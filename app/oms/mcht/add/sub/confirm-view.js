define(['App',
    'tpl!app/oms/mcht/add/templates/add-confirm.tpl',
    'i18n!app/oms/common/nls/mcht'
], function(App, tpl, mcmgrLang) {
    var formLayout = {
        section: [
            {
                items:[
                    {key: 'explorerName', label: '拓展员', belong: 'B1,B2,D1,E1,C2,C1'},
                    //{
                    //    key: 'kind', label: '商户级别', belong: 'C2,C1',
                    //    format:function(val){
                    //        return mchtKindFormat(val);
                    //    }
                    //},
                    {key: 'remark', label: '特殊说明', belong: 'B1,B2,D1,E1,C2,C1'}
                ]
            },
            {
                name:'base',
                caption:'经营信息',
                items:[
                    //{key:'kindSuffix', label:'总店后缀', belong:'C2'},
                    {key:'mchtName', label:'商户名称', belong:'B1,B2,D1,E1,C2,C1'},
                    {key:'mchtNameSingle', label:'商户简称', belong:'B1,B2,D1,E1,C2,C1'},
                    {key:'address', label:'商家地址', belong:'B1,B2,D1,E1,C2,C1'},
                    {key:'_scope', label:'经营范围', belong:'B1,B2,D1,E1,C2,C1'},
                    {key:'comTel', label:'联系电话', belong:'B1,B2,D1,E1,C2,C1'},
                    {key:'_attrDescr', label:'经济类型', belong:'B1,B2,D1,E1,C2,C1'},
                    {key:'licNo', label:'营业执照注册号码', belong:'B1,B2,D1,E1,C2,C1',
                        format:function(val){
                            return  licNoFormat(val);
                        }
                    },
                    {key:'orgCode', label:'组织机构代码', belong:'B1,B2,D1,E1,C2,C1'},
                    {key:'taxNo', label:'税务登记号', belong:'B1,B2,D1,E1,C2,C1',
                        format:function(val){
                            return  taxNoFormat(val);
                        }
                    }
                ]
            },{
                name:'user',
                caption:'法人代表信息',
                items:[
                    {
                        key:'aloneUser', label:'非独立法人', belong:'C2',
                        format:function(val){
                            return val == 1 ? '否' : '是' || '';
                        }
                    },
                    {key:'userName', label:'姓名', belong:'B1,B2,D1,E1,C2,C1'},
                    {key:'userPhone', label:'手机号码', belong:'B1,B2,D1,E1,C2,C1'},
                    {key:'userCardNo', label:'身份证号码', belong:'B1,B2,D1,E1,C2,C1',
                        format:function(val){
                            return  userCardNoFormat(val);
                        }
                    }
                ]
            },
            //{
            //    name:'uSuffix',
            //    caption:'登陆账号',
            //    items:[
            //        {key:'kindSuffix', label:'账号后缀', belong:'C1'}
            //    ]
            //},{
            //    name:'uLogin',
            //    caption:'管理员账号',
            //    items:[
            //        {key:'userLogin', label:'账号后缀', belong:'C2'}
            //    ]
            //},
            {
                name:'base',
                caption:'清算信息',
                items:[
                    {key:'_mchtDiscIdDescr', label:'商户费率', belong:'B1,B2,D1,E1,C2,C1'},
                    {key:'_discCycleDesc', label:'结算周期', belong:'B1,B2,D1,E1,C2,C1'}
                    // {key:'_mchtDiscIdZeroDescr', label:'T+0费率模型', belong:'B1,B2,D1,E1,C2,C1'}
                ]
            },{
                name:'account',
                caption:'收款账户',
                items:[
                    {
                        key:'discThis', label:'是否清算给上级', belong:'C2',
                        format:function(val){
                            return val == 1 ? '否' : '是' || '';
                        }
                    },
                    {key:'accountName', label:'开户名', belong:'B1,B2,D1,E1,C2,C1'},
                    {key:'accountNo', label:'账户号', belong:'B1,B2,D1,E1,C2,C1',
                        format:function(val){
                            return  accountNoFormat(val);
                        }
                    },
                    {key:'zbankName', label:'开户支行', belong:'B1,B2,D1,E1,C2,C1'}
                ]
            }
        ]
    };

    App.module('MchtSysApp.Add.View', function(View, App, Backbone, Marionette, $, _) {

        View.Confirm = Marionette.ItemView.extend({
            // className: 'main',
            template: tpl,

            events: {
                'click .img-wrap img': 'showImages'
            },

            showImages: function (e) {

                var me = this;

                require(['app/oms/mcht/common/image-gallery-view'], function (GalleryView) {
                    var galleryData = convertToGalleryData(me.data);
                    var startSlideId = getClickedIndex(e, galleryData);
                    var view = new GalleryView(galleryData, startSlideId);
                    view.render();
                });

            },

            constructor: function (data) {
                Marionette.ItemView.prototype.constructor.apply(this, arguments);

                this.data = data;
            },

            update: function (data) {
                this.data = data;
            },

            serializeData: function () {
                var data = this.data;
                return {
                    formLayout:formLayout,
                    data: this.data,
                    getLabel  : function (item) {
                        if(item.label) {
                            return item.label;
                        }else if (item.labelKey){
                            return Opf.get(data, item.labelKey);
                        }
                        return '';
                    },
                    getValue: function (item) {
                        var key = item.key;
                        if(key === '_scope') {
                            return data._mccGroupDescr + ' > ' + data._mccDescr;
                        }else {
                            return Opf.get(data, key);
                        }
                    },
                    getImage: function (name) {
                        var item = _.findWhere(data.images, {name: name});
                        console.log(item);
                        return item ? item.value : '';
                    }
                };
            }

        });

    });


    var imageConfig = Opf.Config._('ui', 'mcht.images');

    function convertToGalleryData (data) {
        var images = data.images;
        var extraImages = data._extraImages;
        var name, url,
            tmbDescr, //下边小图标描述
            bimgDescr;//正中大图下面的描述

        var items = [];

        _.each(images, function (image) {
            name = image.name;
            if(name == 'agreement' && data.accountProxy != 1) {
                return;//break;
            }
            if(name == 'extra') {
                return;//break
            }
            url = image.value;
            tmbDescr = (_.findWhere(imageConfig, {name:name})||{}).tmbDescr||"";
            bimgDescr = '';

            if(name === 'idCardFront') {
                var idCardNo = Opf.String.beautyIdNo(Opf.get(data, 'userCardNo'),' ');
                bimgDescr = '<h4>'+Opf.get(data, 'userName') + '&nbsp;&nbsp;&nbsp;' + idCardNo +'</h4>';
            }

            else if(name === 'bankCard') {
                var bankCardNo = Opf.String.beautyBankCardNo(Opf.get(data, 'accountNo'), ' ');
                bimgDescr = '<h4>'+ bankCardNo +'</h4>';
            }

            else if(name === 'license'){
                var licenseNo = Opf.String.beautyWithSeparator(data.licNo, ' ');
                bimgDescr = '<h4>' + data.mchtName + '&nbsp;&nbsp;&nbsp;' + licenseNo + '</h4>';
            }

            else if(name === 'taxImage'){
                var taxNo = Opf.String.beautyWithSeparator(Opf.get(data, 'taxNo'), ' ');
                bimgDescr = '<h4>' + taxNo + '</h4>';
            }

            else if(name === 'clearProtocol'){
                var clearProtocol = Opf.String.beautyWithSeparator(Opf.get(data, 'clearProtocol'), ' ');
                bimgDescr = '<h4>' + clearProtocol + '</h4>';
            }

            if(url) {
                items.push({
                    name: name,
                    url: url,
                    tmbDescr: tmbDescr,
                    bimgDescr: bimgDescr
                });
            }
        });

        _.each(extraImages, function (url, i) {
            items.push({
                name: 'extra'+i,
                url: url,
                tmbDescr: '补充照片 ' + (i+1),
                bimgDescr: ''
            });
        });

        return {
            items: items
        };
    }

    function licNoFormat (val) {
        return Opf.String.beautyWithSeparator(val);
    }
    function taxNoFormat (val) {
        return Opf.String.beautyWithSeparator(val);
    }
    function userCardNoFormat (val) {
        return Opf.String.beautyIdNo(val);
    }
    function accountNoFormat (val) {
        return Opf.String.beautyBankCardNo(val);
    }

    function getClickedIndex(e, galleryData) {
        var clickedUrl = $(e.target).attr('src'),
            correspondingItem = _.find(galleryData.items, function(item){
                return  clickedUrl.indexOf(item.url) !== -1;
            });

        return _.indexOf(galleryData.items, correspondingItem);
    }

    function mchtKindFormat(val){
        var format = {
            'C2': '门店',
            'C1': '总店'
        };
        return format[val] || '';
    }

    return App.MchtSysApp.Add.View.Confirm;

});