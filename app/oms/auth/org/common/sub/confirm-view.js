define(['App',
    'tpl!app/oms/auth/org/common/templates/confirm.tpl',
    'i18n!app/oms/common/nls/auth',
    'jquery.fancybox'
], function(App, tpl, AuthLang) {
    var BRH_TYPE_MAP = {
        '1': '省代',
        '2': '市代',
        '0': '其他'
    };

    var DISC_TYPE_MAP = {
        DirMcc:{belong: 'dir', label:'直联MCC类'},           
        DirMccCanHighSign:{belong: 'dir', label:'直联MCC类可高签'},   
        IndirMcc:{belong: 'indir', label:'间联MCC类'},         
        IndirUnionSettle:{belong: 'indir', label:'间联统一结算扣率'}, 
        IndirNoneBaseRate:{belong: 'indir', label:'间联无基准费率'},  
        IndirSignToSettle:{belong: 'indir', label:'间联签约扣率对应变动结算扣率'}, 
        IndirSettleRateMonthlyChange:{belong: 'indir', label:'间联月交易额结算扣率'},
        IndirMccMonthlyRate:{belong: 'indir', label:'MCC月交易额结算扣率'}
    };

    var formLayout = {
        section: [
            {
                name: 'sys',
                type: 'info',
                caption: '系统信息',
                items:[
                    {key: 'loginName', label: '管理员帐号'}
                ]
            },
            {
                name:'user',
                type: 'info',
                caption:'法人代表信息',
                items:[
                    {key:'name', label:'姓名'},
                    {key:'mobile', label:'手机号码'},
                    {key:'cardNo', label:'身份证号码'},
                    {key:'cardEndDate', label:'证件有效期'}
                ]
            },{
                name:'brh',
                type: 'info',
                caption:'机构信息',
                items:[
                    {key:'brhName', label:'机构名称'},
                    {key:'brhNickName', label:'机构备注名'},
                    // {key:'brhType', label:'机构类型', formatLabel: function(val){
                    //     return BRH_TYPE_MAP[val];
                    // }},
                    {key:'urgentContactName', label:'紧急联系人'},
                    {key:'brhTel', label:'紧急联系电话'},
                    {key:'agencyEnd', label:'合作有效期',formatLabel:function(val){
                        return val == 0 ? '永久' : val;
                    }},
                    {key:'licNo', label:'营业执照号码'},
                    {key:'taxNo', label:'税务登记证号码'}
                ]
            },{
                name:'profit',
                type:'supplement',
                caption:'分润方案',
                items:[
                    {key: 'isJoinProfit', label: '是否参与分润', formatLabel: function(val){
                        return val == '1' ? '是' : '否';
                    }},
                    {key:'profitPlanName', label:'分润方案'}
                ]
            },{
                name:'account',
                type:'supplement',
                caption:'收款账户',
                items:[
                    {key:'accountName', label:'开户名'},
                    {key:'accountNo', label:'账户号'},
                    {key:'zbankName', label:'开户支行'}
                ]
            },{
                name:'contract',
                type:'supplement',
                caption:'合同存档',
                items:[
                    {key:'contractCode', label:'合同编号'},
                    {key:'contractFile', label:'合同扫描件', formatLabel: function (val) {
                        return String(val).split('/').pop();
                    }}
                ]
            }/*,{
                name:'extraImg',
                type:'supplement',
                caption:'补充照片',
                items:[]
            }*/
        ]
    };


    var View = Marionette.ItemView.extend({
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

        initialize: function (data) {
            this.data = data;
        },

        onRender: function () {
        
        },

        update: function (data) {
            this.data = data;
        },

        serializeData: function () {
            var data = this.data;
            if(data.profitPlanName == '- 选择费率模型 -'){
                data.profitPlanName = '无';
            }
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
                    return Opf.get(data, key);

                },
                getImage: function (name) {
                    var item = _.findWhere(data.images, {name: name});
                    console.log(item);
                    return item ? item.value : '';
                },
                getDirDiscType: function () {
                    var arr = [];
                    _.each(data.availDiscModelTypes, function(discType) {
                        var discModel = DISC_TYPE_MAP[discType];
                        if(discModel.belong == 'dir'){
                            arr.push(discModel.label);
                        }
                    });
                    return arr;
                },

                getIndirDiscType: function () {
                    var arr = [];
                    _.each(data.availDiscModelTypes, function(discType) {
                        var discModel = DISC_TYPE_MAP[discType];
                        if(discModel.belong == 'indir'){
                            arr.push(discModel.label);
                        }
                    });
                    return arr;
                }

            };
        }
    });

    var imageConfig = Opf.Config._('ui', 'org.images');

    function convertToGalleryData (data) {
        var images = data.images;
        var extraImages = _.findWhere(images, {name:'extra'}).value.split(',');
        var name, url, 
            tmbDescr, //下边小图标描述
            bimgDescr;//正中大图下面的描述

        var items = [];

        _.each(data.images, function (image) {
            name = image.name;
            if(name == 'agreement' && data.accountProxy != 1) {
                return;//break;
            }
            if(name == 'extra') {
                return;//break
            }
            url = image.value;
            tmbDescr = _.findWhere(imageConfig, {name:name}).tmbDescr;
            bimgDescr = '';

            if(name === 'idCardFront') {
                var idCardNo = Opf.String.beautyIdNo(data.cardNo,' ');
                bimgDescr = '<h4>'+ data.name + '&nbsp;&nbsp;&nbsp;' + idCardNo +'</h4>';
            }

            else if(name === 'bankCard') {
                var bankCardNo = Opf.String.beautyBankCardNo(data.accountNo, ' ');
                bimgDescr = '<h4>'+ bankCardNo +'</h4>';
            }

            else if(name === 'license'){
                var licenseNo = Opf.String.beautyWithSeparator(data.licNo, ' ');
                bimgDescr = '<h4>' + data.brhName + '&nbsp;&nbsp;&nbsp;' + licenseNo + '</h4>';
            }

            else if(name === 'taxImage'){
                var taxNo = Opf.String.beautyWithSeparator(data.taxNo, ' ');
                bimgDescr = '<h4>' + taxNo + '</h4>';
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

    function getClickedIndex(e, galleryData) {
        var clickedUrl = $(e.target).attr('src'),
            correspondingItem = _.find(galleryData.items, function(item){
                return  clickedUrl.indexOf(item.url) !== -1;
            });

        return _.indexOf(galleryData.items, correspondingItem);
    }


    return View;

});