//TODO 所有加载加上 loading 图标

/**
 * 用法类似selet2
 *
 * inputEl.regionselect({
 *   defaultValue: //初始化的值，三级地区码
 * })
 *
 * inputEl.regionselect('val', '441323')//设置为惠东县，需要异步获取各级地区，
 * inputEl.regionselect('val') //获取值
 * inputEl.regionselect('destroy') //销毁
 * inputEl.regionselect('show') //显示
 * inputEl.regionselect('hide') //隐藏
 * inputEl.regionselect('reset') //重置
 * 
 */
define([
  'tpl!assets/scripts/fwk/component/templates/region-select.tpl'
], function(regionSelectTpl) {

  var ZHI_XIA_SHI = {
    '11' : {name:'北京市'}, '31' : {name:'上海市'}, 
    '12' : {name:'天津市'},'50' : {name:'重庆市'}
  };

  var REGION_TYPE = {PROVINCE:'province', CITY:'city', DISTRICT:'district'};

  // TAB CLASS DEFINITION
  // ====================

  var RegionSelect = function(element, options) {
    this.$el = $(element);
    this.options = options;

    //** 这里每个默认属性值都要在reset里面敲多一次

    this.provinceCode = '';
    this.cityCode = '';
    this.districtCode = '';

    //[一级名称，二级名称，三级名称]
    //如果是直辖市，则二级为空串，如果三级和二级一样，则三级为空串
    this.textBuffer = [];//显示所有选中值的文字

    //初始值：[一级地区码，二级地区码, 三级地区码]
    //初始化异步数据后，如果发现有默认选中值，则会默认联动
    //如果手动选择一个选项时，会清空这个值
    this.defaultCodes = [];

    this._build();

    if(this.options.defaultValue){
      this.val(this.options.defaultValue);
    }
  };

  RegionSelect.prototype = {

    _build: function() {

      this._setupElements();

      this._applyStyle();

      this._attach();

      this.$el.before(this.$ct);
    },

    _setupElements: function () {
      var $ct = this.$ct = $(regionSelectTpl());//整个容器

      this.$popTrigger = $ct.find('.pop-trigger');//表示当前选择
      this.$cityTitle = $ct.find('.city-title');//选中的文字描述
      this.$regionOverlay = $ct.find('.overlay').hide(); //代表选择区域面板

      this.$provincePane = $ct.find('.province-pane');//省 选项面板
      this.$cityPane = $ct.find('.city-pane');//市 选项面板
      this.$districtPane = $ct.find('.district-pane');//区 选项面板

      this.$selectTab = $ct.find('.city-select-tab');

    },

    _applyStyle: function() {
      this.$el.css({ width: 0, opacity: 0 });
    },

    /**
     * @param  {[type]} regionCode 三级地区码
     */
    val: function (regionCode) {
      //---获取值---
      if(arguments.length === 0) {
        return this.districtCode || this.defaultCodes[2] || '';
      }

      //----设值----
      if(!regionCode) {//重置
        this.reset();

      }else {//设置有效地区码
        this.defaultCodes = parseRegionCode(regionCode);
        this._checkDefaultProvince();
      }
    },

    destroy: function () {
      this.$popTrigger.off('click');
      this.$regionOverlay.off('click');
      this.$ct.remove();
    },

    _checkDefaultProvince: function () {
      if(this.defaultCodes[0]) {
        this._selectItem(this.$provincePane.find('.a-item[data-code='+this.defaultCodes[0]+']'));
        this.defaultCodes[0] = '';
      }
    },

    _checkDefaultCity: function() {
      //如果是直辖市，自动在城市面板选中这个城市
      if (this.$cityPane.find('.a-item').length === 1) {
        this._selectItem(this.$cityPane.find('.a-item:first'));
      }
      //如果有默认值，则设置默认值
      else if (this.defaultCodes[1]) {
        this._selectItem(this.$cityPane.find('.a-item[data-code=' + this.defaultCodes[1] + ']'));
        this.defaultCodes[1] = '';
      }
    },

    _checkDefaultDistrict: function() {
      //如果只有一个县区，自动选中
      if (this.$districtPane.find('.a-item').length === 1) {
        this._selectItem(this.$districtPane.find('.a-item:first'));
      }
      //如果有默认值，则设置默认值
      else if (this.defaultCodes[2]) {
        this._selectItem(this.$districtPane.find('.a-item[data-code=' + this.defaultCodes[2] + ']'));
        this.defaultCodes[2] = '';
      }
    },

    _refreshDisplayText: function () {
      //去掉空串再拼起来
      this.$cityTitle.text(_.filter(this.textBuffer, _.identity).join('/'));
    },

    _showTab: function (type) {
      this.$selectTab.find('.'+type+'-tab-toggle').tab('show');
    },

    _selectItem: function(itemEl) {
      var me = this;
      var $item = $(itemEl);

      if(!$item.length) {
        return;
      }

      var $tabpane = $item.closest('.tab-pane');

      var code = $item.attr('data-code');
      var text = $item.text();

      //切换高亮选项
      var $lastItem = $tabpane.data('last.item');

      //如果上次选项 和 选中不一样
      if (!$lastItem || !$lastItem.is($item)) {

        $item.addClass('current');
        $lastItem && $lastItem.removeClass('current');

        //缓存最近一次选项
        $tabpane.data('last.item', $item);

        $tabpane.hasClass('province-pane') ? 
          me._onProvinceChange(code, text) : //处理 选择省 的逻辑

          $tabpane.hasClass('city-pane') ?
            me._onCityChange(code, text) : //处理 选择市 的逻辑

            $tabpane.hasClass('district-pane') ?  //处理 选择区 的逻辑
              me._onDistrictChange(code, text) : null;
      }
    },

    _attach: function () {
      var me = this;

      //选择区域弹出隐藏逻辑
      me.$popTrigger.on('click', function () {
        //TODO 点击其余区域可以隐藏
        me.toggleVisible();
      });

      me.$regionOverlay.on('click', '.a-item', function(e) {
        me._selectItem(e.target);
      });
    },

    toggleVisible: function () {
        this[this.$regionOverlay.is(':visible') ? 'hide' : 'show']();
    },

    hide: function () {
        this.$regionOverlay.hide();
        $(document.body).off('click.regionselect');
    },

    show: function () {
      var me = this;
      this.$regionOverlay.show();
      //延迟绑定，防止显示后立刻跑到下面的处理器
      _.defer(function() {
        $(document.body).on('click.regionselect', function(e) {
          if (!$.contains(me.$regionOverlay[0], e.target)) {
            me.hide();
          }
        });
      });
    },

    reset: function () {
        console.log('重置');

        this.provinceCode = '';
        this.cityCode = '';
        this.districtCode = '';
        this.textBuffer = [];//显示所有选中值的文字

        this.$cityTitle.text('');
        updatePaneByData(this.$cityPane, null);//清空 二级 面板
        updatePaneByData(this.$districtPane, null);//清空 三级 面板
    },

    resetCity: function() {
      console.log('重置 城市');
      this.cityCode = '';
      this.districtCode = '';

      updatePaneByData(this.$districtPane, null); //清空 三级 面板
    },

    resetDistrict: function() {
      console.log('重置 县区');

      this.districtCode = '';
    },

    _onProvinceChange: function(code, text) {
      console.log('>>>_onProvinceChange', code, text);

      var zxsItem, me = this;

      me.reset();//如果改变了省，相当于重置组件

      this.provinceCode = code;
      this.textBuffer = [text];//重置选中名称
      this._refreshDisplayText();

      fetchCitysByProvince(code).done(function(resp) {

        console.log('>>> fetchCitysByProvince done callback');

        updatePaneByData(me.$cityPane, resp);
        me._showTab(REGION_TYPE.CITY);
        me._checkDefaultCity();

      }).fail(function () {
          console.log('>>> fetchDistrictsByCity fail callback (abort)');
      });

    },

    _onCityChange: function (code, text) {
      console.log('>>>_onCityChange', code, text);

      var me = this;

      this.resetCity();

      this.cityCode = code;
      // this.cityText = text || this.cityText;

      //如果不是直辖市，那么就添加到显示文字
      this.textBuffer[1] = !ZHI_XIA_SHI[code] ? text : '';
      this._refreshDisplayText();


      fetchDistrictsByCity(code).done(function (itemArr) {

          console.log('>>> fetchDistrictsByCity done callback');

          me.$districtPane.find('dd').html(itemsTpl(itemArr));
          me._showTab(REGION_TYPE.DISTRICT);
          me._checkDefaultDistrict();
      }).fail(function () {
          console.log('>>> fetchDistrictsByCity fail callback (abort)');
      });
    },

    _onDistrictChange: function(code, text) {
      this.resetDistrict();

      this.districtCode = code;
      // this.districtText = text || this.districtText;

      console.log('>>>_onDistrictChange', code, text);
      this.districtCode = code;
      this.$el.val(code);
      /**
       * 如果选中的 三级 与 耳机 不是同一个, 则添加到显示名称
       * 中山市 在表里有两条记录，一个对应2级地区 4420
       * 另一个对应三级地区 442000
       */
      this.textBuffer[2] = (this.cityCode+'00') === (''+code) ? '' : text;
      this._refreshDisplayText();

      this.hide();
    }

  };

  $.fn.regionselect = function(option) {
    return this.each(function() {
      var $this = $(this);
      var data = $this.data('opf.region');

      if (!data) $this.data('opf.region', (data = new RegionSelect(this, option)));
      if (typeof option == 'string') data[option]();
    });
  };

  $.fn.regionselect.defaults = {

  };

  //根据数据列表生成选项，添加到对应面板
  function updatePaneByData ($tabpane, dataArr) {
    $tabpane.find('dd').html(itemsTpl(dataArr));
  }

  function itemsTpl (items) {
    return _.map(items, function(item) {
      return '<a title="'+item.name+'" class="a-item" '+
                'data-code="' + item.value + '" href="javascript:;">'+
                  item.name+'</a>';
    }).join('');
  }

  var _lastFetchCityAjax;
  function fetchCitysByProvince(code) {
    console.log('>>>fetchCitysByProvince', code);

    if (ZHI_XIA_SHI[code]) {
      return $.Deferred().resolve([{value: code, name: ZHI_XIA_SHI[code].name}]);
    }else {
      _lastFetchCityAjax && _lastFetchCityAjax.abort();
      return (_lastFetchCityAjax = Opf.ajax({url: url._('options.city', {province: code})}));
    }
  }

  var _lastFetchDistrictAjax;
  function fetchDistrictsByCity(code) {
    console.log('>>>fetchDistrictsByCity', code);
    _lastFetchDistrictAjax && _lastFetchDistrictAjax.abort();
    return (_lastFetchDistrictAjax = Opf.ajax({ url: url._('options.country', { city: code })}));
  }

  /**
   * 解析地区码 返回对应 一级，二级，三级 地区码
   * @param  {String} regionCode 6位的地区码
   */
  function parseRegionCode(regionCode) {
    regionCode = '' + regionCode;
    var province = regionCode.substring(0, 2);
    var city = ZHI_XIA_SHI[province] ? province : regionCode.substring(0, 4);
    return [province, city, regionCode];
  }

  return RegionSelect;
});