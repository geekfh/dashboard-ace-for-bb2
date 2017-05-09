define([
    'tpl!app/oms/auth/user/show/templates/show-info.tpl',
    'app/oms/mcht/common/image-gallery-view',
    'assets/scripts/fwk/component/ajax-select'
], function(tpl, GalleryView, AjaxSelect) {
    var convertToGalleryData = function(data, me){
        var resultItem = {}, items = [];
        _.each(Opf.Config._('ui', 'user.images'), function(defaultItem) {
            var name = defaultItem.name;

            var bimgDescr = [];

            if (name === 'bankCard') {
                var bankCardNo = Opf.String.beautyBankCardNo(data.accountNo, ' ');
                bimgDescr.push('<h4>' + data.accountName + '&nbsp;&nbsp;&nbsp;' + bankCardNo + '</h4>');
                bimgDescr.push('<p>' + data.zbankName + '</p>');

            }
            else if (name === 'idCardFront') {
                var idCardNo = Opf.String.beautyIdNo(data.cardNo,' ');
                bimgDescr.push('<h4>' + data.name + '&nbsp;&nbsp;&nbsp;' + idCardNo + '</h4>');
            }
            else if (name === 'businessLicImg') {
                bimgDescr.push('<h4>公司名称: ' + data.businessName + '<br><br>营业执照号: ' + data.businessLicNo + '</h4>');
            }
            else if (name === 'openPermitImage') {
                bimgDescr.push('<h4>银行卡号: ' + data.accountNo + '</h4>');
            }

            resultItem = _.extend({}, defaultItem, {
                name: name,
                url: data[name],
                bimgDescr: bimgDescr.join('')
            });

            if(me.convertor) {
                me.convertor(resultItem);
            }

            if(resultItem.url) {
                items.push(resultItem);
            }
        });

        return {
            items: items
        };
    };
    var getClickedIndex = function(e, galleryData){
        var clickedUrl = $(e.target).attr('src'),
            correspondingItem = _.find(galleryData.items, function(item){
                return  clickedUrl.indexOf(item.url) !== -1;
            });

        return _.indexOf(galleryData.items, correspondingItem);
    };
    var provinces;
    var View = Marionette.ItemView.extend({
        template: tpl,
        initialize: function(options) {
            if(options.data != null){
                this.data = options.data;
                this.convertor = options.convertor;
                this.taskModel = options.taskModel == null ? null : options.taskModel;
                this.rowData = options.rowData == null ? '' : options.rowData;
                this.brhCode = options.data.brhCode == null ? '' : options.data.brhCode;
                //if(this.data.regionCode){
                //    this.data.provinceName = this.getProvinceByRegionCode(this.data.regionCode);
                //}
            }
            else{
                options.data = '';
            }
        },

        serializeData: function () {
            var data = this.data;
            var taskInfo = '000';//默认000，存任务信息里的taskInfo,taskModel数据
            if(this.taskModel){
                taskInfo = this.taskModel.attributes.subType;
            }
            else if(this.data.taskSubType){
                taskInfo = this.data.taskSubType;
            }

            if(this.rowData){
                //如果有rowData,那么是从列表中查看详情，将rowData的brhLevel赋值给data.brhLevel
                data.brhLevel = this.rowData.brhLevel;
            }
            return {
                data: data,
                subType: taskInfo,
                getLabel: function (item) {
                    if(item.label) {
                        return item.label;
                    }else if (item.labelKey){
                        return Opf.get(data, item.labelKey);
                    }
                    return '';
                },
                getValue: function (item) {
                    var key = item.key;
                    return Opf.get(data, key);

                },
                getImage: function (name) {
                    var item = _.findWhere(data.images, {name: name});
                    return item ? item.value : '';
                }
            };
        },

        events: {
            'click .img-wrap img': 'magnifyImages',//点击图片预览
            'click .provinceName-row [name="editDistrict"]': 'editDistrict' //点击编辑拓展范围
        },

        magnifyImages: function(e) {
            if ($(e.target).is('.check-trigger')) {
                return;
            }
            var me = this;

            var galleryData = convertToGalleryData(me.data, me);
            var startSlideId = getClickedIndex(e, galleryData);

            var userGalleryView = new GalleryView(galleryData, startSlideId);
            userGalleryView.on('all', function (eventName) {
                me.trigger('gallery.'+eventName, userGalleryView);
            });
            userGalleryView.render();
        },

        editDistrict: function(){
            var me = this;
            me.id = me.data && me.data.id;
            var html = [
                '<div class="row" style="padding: 20px;">',
                '<label class="col-md-4 col-md-offset-1">拓展范围</label>',
                '<select class="col-md-6" id="operatorRange">',
                '</select>',
                '</div>'
            ].join('');
            var $html = $(html);
            new AjaxSelect($html.find('select'), {
                placeholder: '- 选择拓展范围 -',
                ajax : {
                    url: url._('options.province')
                }
            });
            var $dialog = Opf.Factory.createDialog($html, {
                destroyOnClose: true,
                title: "选择拓展范围",
                width: 300,
                height: 200,
                autoshow: true,
                modal: true,
                buttons: [{
                    type: 'save',
                    text: '保存',
                    click: function(){
                        if($('select#operatorRange').val()){
                            Opf.ajax({
                                url: url._('user.updateregion'),
                                type: 'PUT',
                                jsonData: {
                                    id: me.id,
                                    value: $('select#operatorRange').val()
                                },
                                success: function(res){
                                    if(res.success){
                                        Opf.Toast.success(res.msg);
                                        var selectedOption = _.find($('select#operatorRange option'), function(option){
                                            return option.value == $('select#operatorRange').val()
                                        });
                                        $($('.provinceName-row').find('[name="provinceName"]').find("span")[0]).text(selectedOption.text);
                                    }
                                    _.defer(function(){
                                        $dialog.dialog("close");
                                    })
                                }
                            });
                        }
                        else {
                            Opf.alert("请选择拓展范围！");
                        }
                    }
                }]
            });
        },

        /*checkBigImg: function () {
            this.$el.find('.img-link').fancybox({
                wrapCSS    : 'fancybox-custom',
                closeClick : true,
                openEffect : 'none',
                type: 'image',

                helpers : {
                    title : {
                        type : 'inside'
                    }
                }
            });  
        },*/

        onRender: function () {
            var oprBeinCode = this.$el.find('.oprBeinvitedCode-row');
            if (this.data.oprBeinvitedCode == null) {
                oprBeinCode.css('display','none');
            }
            this.$el.find('div[name="signPicture"]').hide();
            this.$el.find('.signPicture-row').hide();

            if(this.taskModel != null){
                var me = this.taskModel.attributes;
                //这里为了模板定死了，103隐藏，104显示
                if(me.subType == 104  || me.subType == 305){
                    if (this.data.oprBeinvitedCode == null) {
                        oprBeinCode.css('display','none');
                    }
                    this.$el.find('div[name="signPicture"]').show();
                    this.$el.find('.signPicture-row').show();
                }
            }
            else if(this.data && this.data.taskSubType != null){
                if(this.data.taskSubType == 104  || this.data.taskSubType == 305){
                    if (this.data.oprBeinvitedCode == null) {
                        oprBeinCode.css('display','none');
                    }
                    this.$el.find('div[name="signPicture"]').show();
                    this.$el.find('.signPicture-row').show();
                }
            }

            //this.checkBigImg();
            this.renderSubBrhName();
            this.getProvinceByRegionCode(this.data.regionCode);

            //手机屏蔽
            if(this.data.mobile != null){
                if(this.data.mobile.indexOf("*")>=0){
                    return false;
                }
                var phone = this.$el.find('[name="mobile"] span');
                $(phone).html(Opf.String.phoneFormat(this.data.mobile));
                this.$el.find('[name="mobile"]').append('&nbsp;&nbsp;<button type="button" class="btn btn-minier btn-yellow bt_valild_userPhone" phonetext="'+this.data.mobile+'">点击查看完整号码</button>');
                this.$el.find('.bt_valild_userPhone').on('click', function(el){
                    var currentPhone = $(el.currentTarget).attr('phonetext');
                    Opf.ajax({
                        type: 'GET',
                        asnyc: false,
                        url: 'api/mcht/merchants/logInfo',
                        data: {phone: currentPhone, mchtName: ''},
                        success: function(resp){
                            console.log(resp);
                        },
                        complete: function(){
                            $(el.currentTarget).prev().text(currentPhone);
                            $(el.currentTarget).attr('disabled', 'disabled');
                        }
                    });
                });
            }
        },

        // 显示隶属关系
        renderSubBrhName: function () {
            var me = this;
            Opf.ajax({
                type: 'GET',
                autoMsg: false,
                url: url._('branch.info',{brhCode: me.brhCode}),
                success: function (resp) {
                    me.addSubName(resp);
                }
            });
        },
        getProvinceByRegionCode: function(regionCode){
            var me = this;
            if(!regionCode){
                return;
            }
            var prov = regionCode.substr(0,2);
            if(!provinces){
                Opf.ajax({
                    url: url._('options.province'),
                    success: function(data){
                        provinces = data;
                        me.addProvinceName(me.getProItemName(provinces, prov));
                        //拓展员修改拓展范围
                        if(Ctx.avail('users.editdistrict') && me.data && me.data.brhCode == "015001" && me.data.isExplorer == "1" && me.data._from == "view"){
                            //_from："view" ----表示是来自员工管理的拓展员详情界面，区别于任务审核-新增拓展员下的拓展员详情界面
                            me.$el.find('.provinceName-row').find('[name="provinceName"]').append('<a style="display: inline-block;color:#669FC7;cursor: pointer;padding-left: 10px;" name="editDistrict"><span class="icon icon-pencil blue"></span>&nbsp;修改</a>')
                        }
                    }
                });
            }
            else {
                me.addProvinceName(me.getProItemName(provinces, prov));
                //拓展员修改拓展范围
                if(Ctx.avail('users.editdistrict') && me.data && me.data.brhCode == "015001" && me.data.isExplorer == "1" && me.data._from == "view"){
                    me.$el.find('.provinceName-row').find('[name="provinceName"]').append('<a style="display: inline-block;color:#669FC7;cursor: pointer;padding-left: 10px;" name="editDistrict"><span class="icon icon-pencil blue"></span>&nbsp;修改</a>')
                }
            }
        },

        getProItemName: function(arr,code){
            for(i in arr){
                if(arr[i].value === code){
                    return arr[i].name;
                }
            }
        },

        addSubName: function (data) {
            var $el = this.$el;
            var modelHtml = [
                '<div class="row row-margintop <%-name%>-row">',
                    '<label class="col-lg-4 info-item-text"><%-label%>:</label>',
                    '<div class="value col-lg-8 checkable-text" name="<%-name%>">',
                        '<span class="text" style="font-family: -webkit-body"><%-value%></span>',
                    '</div>',
                '</div>'
            ].join('');

            var tpl = _.template(modelHtml);
            var subBrhNameMap = {name: 'subBrhName', label: '隶属关系', value: formatBrhName(data.subBrhName)};


            $el.find('.brhLevel-row').after(tpl(subBrhNameMap));
        },
        addProvinceName: function(data){
            var $el = this.$el;
            var modelHtml = [
                '<div class="row row-margintop <%-name%>-row">',
                '<label class="col-lg-4 info-item-text"><%-label%>:</label>',
                '<div class="value col-lg-8 checkable-text" name="<%-name%>">',
                '<span class="text" style="font-family: -webkit-body"><%-value%></span>',
                '</div>',
                '</div>'
            ].join('');

            var tpl = _.template(modelHtml);
            var provinceModel = {name: 'provinceName', label: '地区', value: data};
            $el.find('.oprBeinvitedCode-row').before(tpl(provinceModel));
        }

    });

    function formatBrhName(subBrhName) {
        var str = '';
        for(var i = 0, l = subBrhName.length; i < l; i++){
            str += " —> " + subBrhName[i];
        }
        return str.replace(" —> ", '');
    }

    return View;
});