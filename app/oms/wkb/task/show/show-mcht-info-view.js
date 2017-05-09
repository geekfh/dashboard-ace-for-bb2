define([
    'tpl!app/oms/wkb/task/perform/templates/mcht-info.tpl',
    'app/oms/wkb/task/show/show-img-dialog',
    'app/oms/mcht/common/image-gallery-view',
    'app/oms/mcht/wildcard/common/config-info2',
    'i18n!app/oms/common/nls/mcht',
    'moment.override',
    'jquery.jqGrid.origin',
    'jquery.jqGrid.locale',
    'common-ui'
], function(mchtInfoTpl, ShowImgView, GalleryView, wildcardInfo2Conf, mcmgrLang) {

    var View = Marionette.ItemView.extend({

        ui: {
            regionCode: '.oprRegionCode-row'
        },

        events: {
            'click .img-wrap img': 'magnifyImages',//点击图片 显示功能
            'click .bt_valild_userPhone': 'onUserPhoneClickHandle'
        },

        template: mchtInfoTpl,

        onUserPhoneClickHandle: function(el){
            var me = this;
            var currentPhone = $(el.currentTarget).attr('phonetext');
            Opf.ajax({
                type: 'GET',
                asnyc: false,
                url: 'api/mcht/merchants/logInfo',
                data: {phone: currentPhone, mchtName: me.data.mcht.mchtName},
                success: function(resp){
                    console.log(resp);
                }
            });
            $(el.currentTarget).prev().text(currentPhone);
            $(el.currentTarget).attr('disabled', 'disabled');
        },

        magnifyImages: function(e) {
            if ($(e.target).is('.check-trigger')) {
                return;
            }
            var me = this;

            var galleryData = convertToGalleryData(me.data, me);
            var startSlideId = getClickedIndex(e, galleryData);

            var view = new GalleryView(galleryData, startSlideId);
            view.on('all', function (eventName) {
                console.log(arguments);
                me.trigger('gallery.'+eventName, view);
            });
            view.render();
        },

        // makeImgDialog: function (e) {
        //     var me = this;
        //     var galleryData = convertToGalleryData(me.data, me);
        //     var startSlideId = getClickedIndex(e, galleryData);

        //     var imgDialog = new ShowImgView({
        //         images: galleryData.items,
        //         startSlideId: startSlideId,
        //         imgIsCheckedMap: me.getImgCheckMap()
        //     }).render();

        //     imgDialog.on('imgDialog.sure', function (imgIsCheckedMap) {
        //         me.trigger('imgDialog.sure', imgIsCheckedMap);
        //     });

        //     me.trigger('imgDialog.open', imgDialog.$el);
        // },

        // getImgCheckMap: function () {
        //     var imgIsCheckedMap = {};

        //     this.$el.find('.img-wrap').each(function () {
        //         var $this = $(this);
        //         var isChecked = $this.hasClass('checked');
        //         var imgName = $this.attr('name');

        //         imgIsCheckedMap[imgName] = isChecked;
        //     });

        //     return imgIsCheckedMap;
        // },

        initialize: function(options) {
            this.options = options || {};
            this.data = options.data;
            this.convertor = options.convertor;
            this._time = (new Date()).getTime();

            if(options.data&&options.data.mcht){
                this.brhCode = options.data.mcht.brhCode;
            }
        },

        serializeData: function () {
            return {
                data: $.extend( { _t: this._time }, this.data ),
                wildcard_section: wildcardInfo2Conf
                /*,_time: this._time*/
            };
        },

        onRender: function() {
            this.renderSubBrhName();

            var me = this;

            var item = me.data.mcht;

            //拓展员地区码 如果没值必须隐藏字段 就是那么恶心！
            if(item.oprRegionCode == null || item.oprRegionCode == ''){
                me.ui.regionCode.hide();
            }

            if(item.idNoIsRepeat == 1){//身份证号码     是否有重复
                warningAppend(me, 'userCardNo');
            }
            if(item.licenceNoIsRepeat == 1){//营业执照号码    是否有重复
                warningAppend(me, 'licNo');
            }
            if(item.phoneNoIsIn == 1){
                warnAppend(me, 'userPhone');
            }
            if(item.idNoIsIn == 1){
                warnAppend(me, 'userCardNo');
            }
            if(item.licenceNoIsIn == 1){
                warnAppend(me, 'licNo');
            }
            if(item.orgCodeIsIn == 1){
                warnAppend(me, 'orgCode');
            }
            if(item.bankCardNoIsIn == 1){
                warnAppend(me, 'accountNo');
            }

            //三证合一 判断条件 营业执照注册号码、组织机构代码、税务登记号显示处理
            //if(item.certFlag == 1){
                //me.$el.find('.certFlag-row').css('display','none');
            //}
            if(item.certFlag == null || item.certFlag == 1 || item.certFlag == 3){
                me.$el.find('.orgCode-row').css('display','block');
                me.$el.find('.taxNo-row').css('display','block');
            }
            else if(item.certFlag == 2){
                me.$el.find('.orgCode-row').css('display','none');
                me.$el.find('.taxNo-row').css('display','none');
            }

            //隐藏图片的 经营资质块
            if(item.certFlag == 2 || item.certFlag == 3){
                if(me.data.certFlagInfo != undefined && me.data.certFlagInfo.val == 'showMcht'){
                    me.$el.find('[name="orgImage"]').show();
                    me.$el.find('[name="taxImage"]').show();
                }
                else{
                    me.$el.find('[name="orgImage"]').hide();
                    me.$el.find('[name="taxImage"]').hide();
                }
            }
            else{
                me.$el.find('[name="orgImage"]').show();
                me.$el.find('[name="taxImage"]').show();
            }

            _.defer(function(){
                me.$el.find("[data-toggle='tooltip']").tooltip();
            });
        },

        // 显示隶属关系
        renderSubBrhName: function () {
            var me = this;
            Opf.ajax({
                type: 'GET',
                autoMsg: false,
                async: false,
                url: url._('branch.info',{brhCode: me.brhCode}),
                success: function (resp) {
                    me.addSubName(resp);
                }
            });
        },

        addSubName: function (data) {
            var $el = this.$el;
            var modelHtml = [
                '<div class="row row-text-font row-margintop <%-name%>-row">',
                '<label class="col-lg-3 label-color"><%-label%>:</label>',
                '<div class="value col-lg-9 checkable-text" name="<%-name%>">',
                '<span class="text" style="font-family: -webkit-body"><%-value%></span>',
                '</div>',
                '</div>'
            ].join('');

            var tpl = _.template(modelHtml);
            var subBrhNameMap = {name: 'subBrhName', label: '隶属关系', value: formatBrhName(data.subBrhName)};

            $el.find('.explorerName-row').after(tpl(subBrhNameMap));
        }

    });


    var DEFAULT_ITEMS = Opf.Config._('ui', 'mcht.images');

    function convertToGalleryData(data, me) {
        //var $el = me.$el;
        var mchtData = data.mcht ? data.mcht : data;
        var addInfo = data.addInfo;

        if(addInfo){
            for(key in addInfo){
                if(addInfo.hasOwnProperty(key) && !mchtData[key]) {
                    mchtData[key] = addInfo[key];
                }
            }
        }
        
        var kind = mchtData.kind;

        var resultItem;
        var items = [];

        _.each(DEFAULT_ITEMS, function(defaultItem, index) {
            if (defaultItem.belong.indexOf(kind) !== -1) {
                var name = defaultItem.name;

                if (name == 'agreement' && mchtData.accountProxy != 1) {
                    return; //break;
                }

                //var check = $el.find('.checkable[name=' + name + ']').hasClass('checked');

                var bimgDescr = [];
                if (name === 'idCardFront') {
                    var idCardNo = Opf.String.beautyIdNo(mchtData.cardNo,' ');
                    bimgDescr.push('<h4>' + mchtData.mchtUserName + '&nbsp;&nbsp;&nbsp;' + idCardNo + '</h4>');
                }
                else if (name === 'license') {
                    var licenseNo = Opf.String.beautyWithSeparator(mchtData.licNo, ' ');
                    if(mchtData.certFlag == 3){
                        var orgCode = Opf.String.beautyWithSeparator(mchtData.orgCode, ' ');
                        var taxNo = Opf.String.beautyWithSeparator(mchtData.taxNo, ' ');
                        bimgDescr.push('<h4>' + mchtData.mchtName + '(一证三码)<br>营业执照注册号码：' + licenseNo + '<br>组织机构代码：' + orgCode + '<br>税务登记号' + taxNo + '</h4>');
                    }
                    else{
                        bimgDescr.push('<h4>' + mchtData.mchtName + '&nbsp;&nbsp;&nbsp;' + licenseNo + '</h4>');
                    }
                }
                else if (name === 'bankCard') {
                    var bankCardNo = Opf.String.beautyBankCardNo(mchtData.accountNo, ' ');
                    bimgDescr.push('<h4>' +  mchtData.zbankName + '&nbsp;&nbsp;&nbsp;' + mchtData.accountName + '&nbsp;&nbsp;&nbsp;' + bankCardNo + '</h5>');
                }
                else if(name === 'operatorMcht'){
                    Opf.ajax({
                        type: 'GET',
                        async: false,
                        url: url._('user', {id: mchtData.explorerId}),
                        success: function(data){
                            if(data != null){
                                var html = ['<p style="margin-right: 100px;"><b style="color: #0C65AD;">拓展员姓名：</b>',mchtData.explorerName,'，<b style="color: #0C65AD;">身份证号码：</b>',data.cardNo,'</p>',
                                    '<p style="color: #0C65AD;"><b>身份证照片正面图：</b>',
                                    '<a href="',data.idCardFront,'" target="_blank"><img class="opMchtImg" src="',data.idCardFront,'" /></a>',
                                    '<b style="color: #0C65AD;">手持身份证照片：</b>',
                                    '<a href="',data.personWithIdCard,'" target="_blank"><img class="opMchtImg" src="',data.personWithIdCard,'" /></a>',
                                    '</p>'
                                ].join('');
                                bimgDescr.push(html);
                            }
                        }
                    });
                }

                //三证合一 点击图片 去掉图片
                if(me.data.mcht.certFlag == 2 || me.data.mcht.certFlag == 3){
                    if(me.data.certFlagInfo == undefined){//为任务模块 不加载图片进去
                        if(name === 'orgImage' || name === 'taxImage'){
                            return;
                        }
                    }
                }
                /////////
                resultItem = $.extend(defaultItem, {
                    name: name,
                    // check: check,
                    url: mchtData[name],
                    bimgDescr: bimgDescr.join(''),
                    _t: me._time
                });

                if(me.convertor) {
                    me.convertor(resultItem);
                }

                if(resultItem.url) {
                    items.push(resultItem);
                }
            }
        });

        //将商品照片放到商户收银台照片之后
        /*var productImg = _.findWhere(items, {name:"productImg"});
        var checkstandImg = _.findWhere(items, {name:"checkstandImg"});

        if(!_.isEmpty(productImg) && !_.isEmpty(checkstandImg)) {
            var productImgIndex = _.indexOf(items, productImg);

            items.splice(productImgIndex,1);
            items.splice(_.indexOf(items, _.findWhere(items, {name:"checkstandImg"}))+1, 0, _productImg);
        }*/

        if (mchtData.extraImages) {
            _.each(mchtData.extraImages.split(','), function(url, index) {
                var name = 'extra' + index;
                resultItem = {
                    name: name, //名字索引从0开始
                    url: url,
                    tmbDescr: '补充照片 ' + (index + 1) //,//label显示从1开始
                    // check: $el.find('.checkable[name=' + name + ']').hasClass('checked')
                };
                if(me.convertor) {
                    me.convertor(resultItem);
                }
                items.push(resultItem);
            });
        }

        return {
            items: items
        };
    }

    function getClickedIndex(e, galleryData) {
        var clickedUrl = $(e.target).attr('src'),
            correspondingItem = _.find(galleryData.items, function(item){
                console.log(clickedUrl);
                return  clickedUrl.indexOf(item.url) !== -1;
            });

        return _.indexOf(galleryData.items, correspondingItem);
    }

    function formatBrhName(subBrhName) {
        var str = '';
        for(var i = 0, l = subBrhName.length; i < l; i++){
            str += " —> " + subBrhName[i];
        }
        return str.replace(" —> ", '');
    }

    function warningAppend(me, str){
        var item = me.data.mcht;
        var rowTpl = [
            '<div class="row row-text-font row-margintop pre-check-result">',
            '<div class="col-lg-3"></div>',
            '<div class="col-lg-9 desc">',
            '<span class="label label-warning" style="cursor: default;margin-left:6px;">',
            '<i class="icon icon-opf-warning"></i>',
            '证件号重复',
            '</span>',
            '</div>',
            '</div>'
        ].join('');

        //var arr = str.split(',');
        //for(var i=0; i<arr.length; i++){
        me.$el.find('.' + str + '-row').append(rowTpl);//arr[i]
        //}

        me.$el.find('.' + str + '-row').find('.label-warning').on('click', function(){
            warnDialog(item);
        });

    }

    function warnAppend(me, str){
        var rowTpl = [
            '<div class="row row-text-font row-margintop pre-check-result">',
            '<div class="col-lg-3"></div>',
            '<div class="col-lg-9 desc">',
            '<span class="label label-warning" style="margin-left:6px;">',
            '<i class="icon icon-opf-warning"></i>',
            '进件黑名单',
            '</span>',
            '</div>',
            '</div>'
        ].join('');

        me.$el.find('.'+str+'-row').append(rowTpl);
    }

    function warnDialog(item){
        var mchtNo = item.mchtNo;
        var idNo = item.cardNo;
        var licenceNo = item.licNo;

        require(['app/oms/wkb/task/credentials-list/list-view'], function(credentialsView){
            var credentialsListView = new credentialsView({mchtNo: mchtNo, idNo: idNo, licenceNo: licenceNo}).render();
            credentialsListView.showDialog(credentialsListView);
            credentialsListView.$el.on('reloadParentGrid',function(){
                me.grid.trigger('reloadGrid');
            });
        });
    }


    // 之前代码。不用可以删除
    // modify by hefeng

    /*
     var STATUS_MAP = {
         0: mcmgrLang._('MCHT.status.0'),
         1: mcmgrLang._('MCHT.status.1'),
         2: mcmgrLang._('MCHT.status.2'),
         3: mcmgrLang._('MCHT.status.3'),
         4: mcmgrLang._('MCHT.status.4'),
         5: mcmgrLang._('MCHT.status.5'),
         6: mcmgrLang._('MCHT.status.6')
     };

    function statusFormatter(val) {
        return STATUS_MAP[val] || '';
    }

    function warnDialog_old(item){

        var html = [
        '<div class="row">',
        '<div class="col-xs-12 jgrid-container">',
        '<table id="bl-grid-table"></table>',
        '<div id="bl-grid-pager"></div>',
        '</div>',
        '</div>'
        ].join('');

        var dialog = Opf.Factory.createDialog(html, {
            destroyOnClose: true,
            title: '重复证件列表',
            autoOpen: true,
            width: 800,
            height: 500,
            modal: true,
            buttons: [{
                type: 'cancel'
            }]
        });

        var mchtNo = item.mchtNo;
        var idNo = item.cardNo;
        var licenceNo = item.licNo;

        var number = 0;

        dialog.find('#bl-grid-table').jqGrid({
            url: url._('mcht.blackList.merchants.view'),
            mtype: 'GET',
            postData: {'mchtNo':mchtNo,'idNo':idNo,'licenceNo': licenceNo, 'number': 0},
            datatype: "json",
            colNames:['id', '商户编号', '商户名', '商户状态', '身份证号码','营业执照号码'],
            colModel:[
                {name:'id',index:'id', hidden:true},
                {name:'mchtNo',index:'mchtNo',  sortable : false},
                {name:'mchtName',index:'mchtName',  sortable : false},
                {name:'status',index:'status', sortable : false, formatter: statusFormatter},
                {name:'idNo',index:'idNo', sortable : false},
                {name:'licenceNo',index:'licenceNo', sortable : false}
            ],
            pager: '#bl-grid-pager',
            viewrecords: true,
            sortorder: "desc",
            caption: '',
            rowList: false,
            width: 798,
            height: 310,
            rowNum: 10,
            jsonReader:{
                root:"content",
                total: "totalPages",//总页数
                page: "yoyo",//当前页
                records: "totalElements",//总条数
                repeatitems: false,
                rowNum: "totalElements"
            },
            prmNames : {
                rows: "size",
                page: "yoyo"
            },
            loadComplete: function() {
                console.log('file position========>app/oms/wkb/task/show/show-mcht-info-view');
                onPage(dialog, mchtNo, idNo, licenceNo);
            }
        }).navGrid('#bl-grid-pager', { add: true, edit: true, del: true,search:false,refresh:false });

        dialog.find('#bl-grid-pager').css('width','798px');
    }

    function onPage(dialog, mchtNo, idNo, licenceNo){
        var num = dialog.find('#bl-grid-table').jqGrid('getGridParam','page') == 1 ? 1 : dialog.find('#bl-grid-table').jqGrid('getGridParam','page');
        dialog.find('#bl-grid-table').jqGrid('setGridParam',{ postData: {'mchtNo':mchtNo,'idNo':idNo,'licenceNo': licenceNo, 'number': num} });
    }*/

    return View;
});