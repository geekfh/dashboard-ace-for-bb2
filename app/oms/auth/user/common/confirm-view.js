define(['App',
    'tpl!app/oms/auth/user/common/templates/confirm.tpl',
    'jquery.fancybox'
], function(App, tpl) {

    var ISEXPLORER_MAP = {
        '0': '非拓展员',
        '1': '是拓展员'
    };

    var GENDER_MAP = {
        '0': '男',
        '1': '女'
    };

    var NEEDACCOUNT_MAP = {
        '0': '否',
        '1': '是'
    }; 

    var formLayout = {
        section: [
            {
                name: 'userInfo',
                caption: '基本信息',
                type: 'info',
                items: [
                    {key: 'name', label: '真实姓名', type: 'text'},
                    {key: 'loginName', label: '登录帐号', type: 'text'},
                    {key: '_roleGroupId', label: '角色组', type: 'text'},
                    {key: '_ruleId', label: '管辖范围', type: 'text'},
                    {key: 'isExplorer', label: '是否为拓展员', type: 'text',
                        formatLabel: function (val) {
                            return ISEXPLORER_MAP[val];
                        }
                    },
                    {key: 'gender', label: '性别', type: 'text',
                        formatLabel: function (val) {
                            return GENDER_MAP[val];
                        }
                    }
                ]
            },{
                name: 'expInfo',
                caption: '拓展员详情',
                type: 'explore',
                items: [
                    {key: 'cardNo', label: '身份证号码', type: 'text'},
                    {key: 'idCardFront', label: '身份证正面照片', type: 'img'},
                    {key: 'idCardBack', label: '身份证反面照片', type: 'img'},
                    {key: 'personWithIdCard', label: '手持身份证照片', type: 'img'},
                    {key: 'bankCard', label: '银行卡照片', type: 'img'}
                ]
            },{
                name: 'contact',
                caption: '联系方式',
                type: 'extra',
                items: [
                    {key: 'tel', label: '固定电话', type: 'text'},
                    {key: 'mobile', label: '手机号码', type: 'text'},
                    {key: 'email', label: '邮箱', type: 'text'}
                ]
            },{
                name: 'account',
                caption: '收款账户',
                type: 'extra',
                items: [
                    {key: 'bankName', label: '开户行', type: 'text'},
                    {key: 'accountName', label: '账户名称', type: 'text'},
                    {key: 'accountNo', label: '银行帐号', type: 'text'},
                    {key: 'zbankName', label: '开户支行', type: 'text'}
                ]
            }
        ]
    };


    var View = Marionette.ItemView.extend({
        // className: 'main',
        template: tpl,

        events: {

        },

        initialize: function (data) {
            this.data = data;
        },

        onRender: function () {
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
                    return Opf.get(data, key);

                },
                getImage: function (name) {
                    var item = _.findWhere(data.images, {name: name});
                    return item ? item.value : '';
                }
            };
        }
    });

    return View;

});