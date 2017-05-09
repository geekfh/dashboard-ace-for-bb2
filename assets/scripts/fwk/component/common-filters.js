/**
 * 过滤条件
 */
define([
	'tpl!assets/scripts/fwk/component/templates/radio.tpl',
	'tpl!assets/scripts/fwk/component/templates/switchable-dropdown.tpl',
	'assets/scripts/fwk/component/RangeDatePicker',
	'tpl!assets/scripts/fwk/component/templates/address.tpl',
	'jquery.inputmask',
    'select2',
	'common-ui'
], function(RadioTplFn,switchableDropdownTplFn, RangeDatePicker, addressTpl){
	/** 
	 *  var conditions = ['gt', 'eq', 'lt'];//如果是'type = text'，则默认为['包含','不包含','等于','不等于']
	 *  
	 *  var VALUE_MAP = {
	 *  	"totalNum":"交易笔数",
	 *  	"totalAmt":"交易金额"
	 *  }
     *  如果某个组件配置了require = true，则在情清空过滤条件的时候将会不清空该组件
	 *  components: [
	 *  	{
	 *  		type:'text', label:'交易日期', ignoreFormReset: true, name: 'date', defaultValue: 'xxx'/{startDate:xx, endDate: 'xx'},
	 *  		options: {sopt: conditions,dataInit: function(elem){...}}
	 *  	},{
	 *  		type:'select', label:'交易日期', ignoreFormReset: false, name: 'date', defaultValue: 'xxx'/{startDate:xx, endDate: 'xx'},
	 *  		options: {sopt: conditions, value: VALUE_MAP}
	 *  	},{
	 *  		type:'date', label:'交易日期', ignoreFormReset: true, name: 'date', defaultValue: 'xxx'/{startDate:xx, endDate: 'xx'},
	 *  		options: {sopt: conditions}
	 *  	},{
	 *  		type:'rangeDate', label:'交易日期', ignoreFormReset: false, name: 'date', defaultValue: 'xxx'/{startDate:xx, endDate: 'xx'},
	 *  		options: {sopt: conditions}
	 *  	},{
	 *  		type:'select2', label:'交易日期', ignoreFormReset: false, name: 'date', defaultValue: 'xxx'/{startDate:xx, endDate: 'xx'},
	 *  		options: {sopt: conditions, value: VALUE_MAP, multiple: true/false, width: xxx, valueFormat: function(value){...}}
	 *  	}
	 *  
	 *  ]
	 * 
	 */
    
	var Filters = Marionette.ItemView.extend({

		className: 'opf-filters-panel',

		events: {
			'click .dropdown-menu a': 'onDropdownSelect'
		},
		//ui: {
		//	zbankProvince: '[name="zbankProvince"]',
		//	zbankCity: '[name="zbankCity"]',
		//	zbankRegionCode: '[name="zbankRegionCode"]'
		//},
		initialize: function (options) {
			options = _.clone(options);

			options.items = options.items || [];
			options.renderTo = options.renderTo || document.body;

			this.options = options;

			this.items = options.items;

			this.render();	
			this.attachEvents();
		},

		render: function () {
			var me = this;
			var options = this.options;
			var items = options.items;

			var $formGroup;
			_.each(items, function (item, idx) {
				$formGroup = buildFilterFromGroup.call(me, item, idx, items);
				me.$el.append($formGroup);
			});

			me.$el.appendTo(options.renderTo);

			me.on('cleanSearch', function(){
				me.reset();
			});
		},

		onDropdownSelect: function (e) {
			e.preventDefault();
			var $target = $(e.target).closest('a');
			var $dropdown = $target.closest('.dropdown');
			var text = $target.text(),
				value = $target.val();

			$dropdown.find('.btn-text').text(text);
			$dropdown.find('.picker-btn').attr('ref',value);
		},

		getValue: function () {
			var rules = [] ;
			var dataIndex, $el, items = this.items, itemData;
			
			//jquery 遍历方法里面的idx并不保证按照dom顺序
			this.$el.find('.filter-form-group').map(function (idx, el) {
				var val;
				$el = $(el);
				dataIndex = $el.attr('data-index');
				itemData = items[dataIndex];

				switch(itemData.type){
					case 'select': 
						val = $el.find('.'+ itemData.name + '-dropdown').find('[ref]').attr('ref');
						break;

					case 'rangeDate':
						var dateObj = $el.find('.date-range-btn').data('rangeDate');
						if(dateObj && dateObj.startDate && dateObj.endDate){
							val = {
								startDate: dateObj.startDate,
								endDate: dateObj.endDate
							};
						}
						break;

                    case 'select2':
                        var select2Data = $el.find('.filter-input').select2('data') || [];

                        if(itemData.options && itemData.options.valueFormat){
							val = itemData.options.valueFormat(select2Data);
                        }
                        break;

					case 'radio':
						val = $el.find('.'+itemData.name+'-radio:checked').val() || '';
						break;

					case 'address':
						var countryEl = $el.find('[name="zbankRegionCode"]').val();
						if(countryEl != undefined || countryEl != null){
							Opf.ajax({
								type: 'GET',
								url: url._('areaCode', {code: countryEl}),
								async: false,
								success: function(resp){
									countryEl = resp;
								}
							});
						}
						else{
							countryEl = '';
						}
						val = countryEl;
						break;

					default:
						val = Opf.String.trim($el.find('.filter-input').val());
						break;
				}

				var sopt = $el.find('.'+ itemData.name + '-sopt-dropdown').find('[ref]').attr('ref');
				if(val) {
					//如果是日期范围，则val为obj类型，设置值为大于等于起始日期，小于等于终止日期
					if(typeof val == 'object'){
						rules.push({
							field: itemData.name,
							op: 'ge',
							data: encodeURIComponent(val.startDate)
						});
						rules.push({
							field: itemData.name,
							op: 'le',
							data: encodeURIComponent(val.endDate)
						});
					}else{
						rules.push({
							field: itemData.name,
							op: sopt || 'eq',
							data: encodeURIComponent($.trim(val))
						});
					}
				}

			});

			return {
				groupOp: 'AND',
				rules: rules
			};
		},

		attachEvents: function () {

		},

		reset: function () {
			//TODO 清空筛选框时触发
			var $filterGroup = this.$el.find('.filter-form-group');
			$filterGroup.each(function(){
				var $this = $(this);
                if($this.data('ignoreFormReset') === true){
                    //不做清空处理
                }
				else if($this.css('display') == 'none'){
					$this.attr('style',$this.attr('style').replace('display: none;',''));
				}
				else if($(this).find('#div_address').html() != undefined){
					//清空
					var provinceEl = $(this).find('[name="zbankProvince"]');
					var cityEl = $(this).find('[name="zbankCity"]');
					var countryEl = $(this).find('[name="zbankRegionCode"]');
					CommonUI.address(provinceEl, cityEl, countryEl);
				}
				else{
					var $input = $this.find('.filter-input');
					if($input.data('select2')){
						//select2
						$input.select2('data', null).trigger('change');
					}else{
						//text, date
						$input.val('').trigger('change').trigger('input');
					}
    				//rangeDate
    				$this.find('.date-range-btn').data('rangeDate', null).children().text('- 选择时间范围 -');//注意：之前没有children()导致清空筛选条件 无法点击控件！
    				//select
    				cleanSelect($this.find('.dropdown-select'));
                }

			});
		}

	});

	var _oprLabelMap = {
		'lk': '包含',
        'llk': '包含', //左包含(%xxxx)
        'rlk': '包含', //右包含(xxxx%)
		'nlk': '不包含',
		'gt': '大于',
		'ge': '大于等于',
		'eq': '等于',
		'ne': '不等于',
		'lt': '小于',
		'le': '小于等于',
        'in': '等于',
        'ni': '不等'
	};

	/**
	 * 转换条件为可识别的对象
	 * @param  {Array} sopt 'gt'/'eq'/'lt'中的元素组成的数组
	 * @return {Array}      [{value: 'xx', label: 'xx'} ...]
	 */
	function convertOprs (sopt) {
		return _.map(sopt, function (val, idx) {
			return { label: _oprLabelMap[val], value: val};
		});
	}

	function convertValue (objList) {
		return _.map(objList, function (val, key) {
			return { label: val, value: key};
		});
	}

    /**
     * [converSelect2Value description]
     * @param  {[type]} objValue {key: 'xxxx'}
     * @return {[type]}          {id: key, text: 'xxxx'}
     */
    function converSelect2Value (objValue) {
        var select2MapList = [];
        for(var p in objValue){
            if(objValue.hasOwnProperty(p)){
                select2MapList.push({
                    id: p,
                    text: objValue[p]
                });
            }
        }

        return select2MapList;
    }

	function isOnlyEqual (sopt) {
		return (sopt && sopt.length == 1 && sopt[0] === 'eq') || !sopt;
	}

	/**
	 * 这里创建条件输入框
	 * @param  {obj} item 
	 *       {
	 *  		type:'text', label:'交易日期', name: 'date', defaultValue: 'xxx'/{startDate:xx, endDate: 'xx'},
	 *  		options: {sopt: conditions, value: VALUE_MAP, dataInit: function(elem){...}}
	 *  	 }
	 * @return {$obj}      [$input]
	 */
	function createInputBy(item) {
        var me = this;
		var ui = me.ui;
		var type = item.type || 'text';
		var options = item.options || {};
		var defaultValue = item.defaultValue || '';

		var $input;
		switch(type){

			case 'text': 
				$input = $('<input class="' + item.name + '-filter-input filter-input"/>');
				$input.val(defaultValue);
                $input.on('input', _.debounce(function(){
                    me.trigger('effect:input', me.getValue().rules);
                },200));
                $input.on('change', function(){
                    me.trigger('effect:input', me.getValue().rules);
                });
				break;

		    case 'date': 
		    	$input = $('<input class="' + item.name + '-filter-input filter-input"/>');
		    	$input.datepicker({autoclose: true,format: 'yyyymmdd'});
		    	$input.val(defaultValue);
				if($.type(defaultValue) == 'string'){
					//defaultValue
				}
				else{
					defaultValue && $input.datepicker('update', defaultValue.format('YYYYMMDD')).prop('readonly', true);
				}
                $input.on('change', function(){
                    me.trigger('effect:input', me.getValue().rules);
                });
		    	break;

			case 'select':
				//var conditionItems = convertValue(options.value);
		    	var dropDownTpl = switchableDropdownTplFn({
		    		data: {
		    			cls: item.name + '-dropdown dropdown-select',
		    			defaultValue: defaultValue,
		    			menu: convertValue(options.value)
		    		}
		    	});
		    	$input = $(dropDownTpl);

				// 触发select的change事件
				if(_.isFunction(options.change)){
					$input.find('a').on('click', function(){
						options.change(me, $(this).text());
					});
				}

				$input.find('a').on('click', function(){
					_.defer(function () {
						me.trigger('effect:input', me.getValue().rules);
					});
				});

		    	break;

			case 'rangeDate':
		    	var inputHtml = [
		    		'<button class="date-range-btn picker-btn ' + item.name + '">',
		    			'<span class="text">- 选择时间范围 -</span>',
	    			'</button>'
		    	].join('');
		    	$input = $(inputHtml);

				$input.data('rangeDate', {
					startDate: defaultValue[0] ? defaultValue[0].format(item.valueFormat || 'YYYYMMDD') : defaultValue[0],
					endDate: defaultValue[1] ? defaultValue[1].format(item.valueFormat || 'YYYYMMDD') : defaultValue[1]
				});

	            new RangeDatePicker({
	                trigger: $input,
                    textHolder: $input.find('.text'),
					defaultValues: defaultValue,
					displayFormat: item.displayFormat,
					valueFormat: item.valueFormat,
                    limitDate: item.limitDate,
					limitRange: item.limitRange
				}).on('submit', function(obj){
                    $input.data('rangeDate', {
                        startDate: obj.startDate,
                        endDate: obj.endDate
                    });
                    me.trigger('effect:input', me.getValue().rules);
                });
                break;

            case 'select2':
                $input = $('<input class="' + item.name + '-filter-input filter-input"/>');
                $input.data('select2Input', true);
                break;

			case 'radio':
				//var conditionItems = convertValue(options.value);
				var radioTpl = RadioTplFn({
					data: {
						cls: item.name + '-radio',
						defaultValue: item.defaultValue,
						options: convertValue(options.value)
					}
				});
				$input = $(radioTpl);
				//$input.on('change', function(){
				//	me.trigger('effect:input', me.getValue().rules);
				//});
				break;

			case 'address':
				var html = addressTpl();

				$input = $(html);

				var provinceEl = $input.find('[name="zbankProvince"]');
				var cityEl = $input.find('[name="zbankCity"]');
				var countryEl = $input.find('[name="zbankRegionCode"]');

				CommonUI.address(provinceEl, cityEl, countryEl);

				break;

			default:
				break;
		}

        if($.isFunction(item.onClickFn)){
            $input.on('click', item.onClickFn);
        }

		return $input;
	}
	//function getRadioTplFn(data){
	//	var spanTpl = '<div class="radio-check">';
	//	_.each(data.options,function(item){
	//		spanTpl = spanTpl+ '<span><input type="radio" class="'+ data.cls+'>" name="'+ data.cls+'>" value="'+ item.value+'">'+ item.label+'</span>'
	//	});
	//	spanTpl = spanTpl + '</div>';
	//	return spanTpl;
	//}
    function createLabelBy (item) {
        var labelHtml = [
            '<div class="filter-group-label">',
                '<label class="the-label">' + item.label + '：</label>',
            '</div>'
        ].join('');

        return labelHtml;
    }

    function createOperDropDownBy (item) {
        var me = this;
        var operDropDownTpl, options = item.options || {}, sopt;
        if(options.sopt){
            sopt = options.sopt;
        }else if(!item.type || item.type == 'text'){
            sopt = ['lk'];
        }else{
            sopt = ['eq'];
        }
        var conditionItems = convertOprs(sopt);

        if(!isOnlyEqual(sopt)){
            operDropDownTpl = switchableDropdownTplFn({
                data: {
                    cls: item.name + '-sopt-dropdown',
                    defaultValue: conditionItems[0].value,
                    menu: conditionItems
                }
            });
        }else{
            operDropDownTpl = '';
        }

        var $operDropDown = $(operDropDownTpl);
        $operDropDown.find('a').on('click', function(){
            me.trigger('effect:input', me.getValue().rules);
        });

        return $operDropDown;
    }


	//生成一个条件爱你对应的组件html
	//这里不用一套模板生成，是为了方便以后扩展输入框或者选项框功能
	function buildFilterFromGroup (item, index, items) {
		var me = this, $formGroup;
        var $label = createLabelBy(item);
		var $operDropDown = createOperDropDownBy.call(me, item);
		var $input = createInputBy.call(me, item);

        /**
         * 过滤条件
         * inputmask: {
         *     decimal: true,//浮点型
         *     integer: true,//整型
         *     minLimit: 300,//最小填是300
         *     maxLimit: 500,//最大值是500
         *     
         * }
         */
        if(item.inputmask && !_.isEmpty(item.inputmask)) {
            item.inputmask.decimal && $input.inputmask('decimal');
            item.inputmask.xinteger && $input.inputmask('integer');
            //TODO 需要扩充时再进行补充
        }
        if(item.options && typeof item.options.dataInit == 'function'){
            setTimeout(function(){
                item.options.dataInit($input);
            },10);
        }
    	var $span = $('<div class="filter-group-content"></div>').append($operDropDown).append($input);

    	var formGroupTpl = _.format('<div data-index="{0}" class="filter-form-group form-group {1}-form-group {2}"></div>',
    		index, item.name, index===items.length-1?'last-one':'');
    							
    	$formGroup = $(formGroupTpl);

    	$formGroup.append($label);
        $formGroup.append($span);

        if(item.ignoreFormReset === true){
            //如果配置流量require=true,那么在清空过滤条件时将不会清空
            $formGroup.data('ignoreFormReset', true);
        }

        if($input.data('select2Input')){
			if(!item.options){
				console.error('你没有给该 select2 配置项！');
			}else{
				var select2Config = item.options.select2Config || {placeholder: '请选择', width: 150};

				if(item.options.value){
					$.extend(select2Config, {data: converSelect2Value(item.options.value)});
				}

				$input.select2(select2Config);
			}
            
        }

    	return $formGroup;
	}

    function cleanSelect($select) {
		$select.find('[ref]').attr('ref', null);
		$select.find('.btn-text').text('- 请选择 -');
    }


	return Filters;

});