
define(['App',
    'tpl!app/oms/operate/cashbox/config/templates/table-list.tpl',
    'jquery.jqGrid'
],function(App, tpl){
    var GROUP_MAP = {//服务类别
        '1' : '便民',
        '2' : '金融',
        '3' : '信息化',
        '99' :' 其他'
    },STATUS_MAP = {//服务状态
        '1':  '正常(默认值)',
        '0':  '下架 ',
        '2':  '暂停',
        '3':  '外部调用钱盒'
    },SRC_MAP = {//服务提供商
        '1':'自营',
        '2':'第三方'
    },TYPE_MAP = {//页面类型
        '1':'native',
        '0':'h5'
    },preConditionType_MAP = {
        '1' : '刷卡',
        '2' : 'SDK'
    },sdkT0TradeFlag_MAP = {//SDK是否允许T+0
        '1' : '允许',
        '0' : '不允许'
    },sdkCancleTradeFlag_MAP = {//SDK是否允许撤销交易
        '1' : '允许',
        '0' : '不允许'
    };

    var View = Marionette.ItemView.extend({
        tabId: 'menu.cashbox.config',
        template: tpl,
        onRender: function(){
            var me = this;
            _.defer(function(){
                me.renderGrid();

            });
        },
        onAddModel: function(){
            var me = this;
            require(['app/oms/settle/cancel-order/add-view'],function(AddView){
                var AddOrderView = new AddView().render();
                AddOrderView.showDialog(AddOrderView);
                //App.searchOrderRegion.show(AddOrderView);
                AddOrderView.$el.on('reloadParentGrid',function(){
                    me.grid.trigger('reloadGrid');
                });

            });

        },
        renderGrid: function() {
            var setupValidation = Opf.Validate.setup;
            var addValidateRules = function(form) {
                Opf.Validate.addRules(form, {
                    rules : {
                        serviceName       : {'required': true},
                        serviceGroup      : {'required': true},
                        serviceSort       : {'required': true},
                        serviceType       : {'required': true},
                        serviceSrc        : {'required': true},
                        serviceStatus     : {'required': true},
                        serviceDes        : {'required': true},
                        onlinePic         : {'required': true},
                        offlinePic        : {'required': true},
                        serviceUrl        : {'required': true},
                        appCode           : {'required': true},
                        preConditionType  : {'required': true}

                    }
                });
            };
            var me = this;
            me.grid = App.Factory.createJqGrid({
                rsId:'cashbox.config',
                //rsId:'operate.cashboxconfig',
                gid: 'operate-cashboxconfig-grid',
                caption: '钱盒增值服务配置',
                nav: {
                    formSize: {
                        width: 400,
                        height: 600
                    },
                    add : {
                        beforeShowForm: function(form) {
                            addValidateRules(form);
                        },
                        beforeSubmit: setupValidation
                    },

                    edit: {
                        beforeShowForm: function (form) {
                            //var $form = $(form),
                            //    $code = $form.find('input[name="code"]');
                            //$code.attr('readonly', 'readonly');
                            //$code.css('readonly');
                            addValidateRules(form);
                        },
                        beforeSubmit: setupValidation
                    }
                },
                actionsCol:{
                    view:false,
                    width: 110,
                    extraButtons: [
                        {
                            name: 'serviceObjConfig', icon: 'icon-edit red', title: '服务对象',
                            click: function (name,obj,rowData) {
                                require(['app/oms/operate/service-targer/list-view'], function(configView){
                                    var serviceConfigView = new configView({serviceId: rowData.serviceId}).render();
                                    serviceConfigView.showDialog(serviceConfigView);
                                    serviceConfigView.$el.on('reloadParentGrid',function(){
                                        me.grid.trigger('reloadGrid');
                                    });
                                });
                            }
                        }
                    ]
                },
                //url: 'darren/test.json',
                url: url._('operate.cashboxconfig.list'),

                colNames: {
                    id                :    'ID',
                    serviceName       :    '增值服务名称',
                    serviceGroup      :    '服务类别',
                    serviceSort       :    '排序',
                    serviceType       :    '页面类型',
                    serviceSrc        :    '服务提供方',
                    serviceStatus     :    '状态',
                    serviceDes        :    '描述',

                    crtTime           :    '创建时间',
                    updateTime        :    '修改时间',
                    crtUser           :    '创建人',
                    onlinePic         :    '服务图标（上架）',
                    offlinePic        :    '服务图标（下架）',
                    serviceUrl        :    '链接',
                    appCode           :    'APP CODE',
                    preConditionType  :    '交易前置类型',
                    sdkPospServeType  :    'SERVE TYPE',
                    sdkT0TradeFlag    :    'SDK是否允许T+0',
                    sdkCancleTradeFlag:    'SDK是否允许撤销交易',
                    sdkSignType       :    'SDK加密方式',
                    sdkSignKey        :    'SDK key',
                    sdkNotifyUrl      :    'TPF回调URL',
                    serviceUrlProcess :    '钱盒调起第三方URL参数处理'

                },

                colModel: [
                    {name: 'id',hidden:true},
                    {name: 'serviceName',editable: true,search:true},
                    {name: 'serviceGroup',
                        formatter : groupFormatter,
                        editable: true,
                        edittype:'select',
                        editoptions: {
                            value: GROUP_MAP
                        },
                        search:true,
                        stype: 'select',
                        searchoptions:{
                            value: GROUP_MAP
                        }
                    },
                    {name: 'serviceSort',editable: true},
                    {name: 'serviceType',
                        formatter : typeFormatter,
                        editable: true,
                        edittype:'select',
                        editoptions: {
                            value: TYPE_MAP
                        }
                    },
                    {name: 'serviceSrc',
                        formatter : srcFormatter,
                        editable: true,
                        edittype:'select',
                        editoptions: {
                            value: SRC_MAP
                        }
                    },
                    {name: 'serviceStatus',
                        formatter: statusFormatter,
                        editable: true,
                        edittype:'select',
                        editoptions: {
                            value: STATUS_MAP
                        },
                        search:true,
                        stype: 'select',
                        searchoptions:{
                            value: STATUS_MAP
                        }
                    },
                    {name: 'serviceDes',editable: true,edittype:'textarea',search:true},

                    {name: 'crtTime',hidden:true},
                    {name: 'updateTime',hidden:true},
                    {name: 'crtUser',hidden:true},
                    {name: 'onlinePic',hidden:true,editable: true,edittype:'textarea'},
                    {name: 'offlinePic',hidden:true,editable: true,edittype:'textarea'},
                    {name: 'serviceUrl',hidden:true,editable: true,edittype:'textarea'},
                    {name: 'appCode',hidden:true,editable: true},
                    {name: 'preConditionType',
                        hidden:true,
                        editable: true,
                        edittype:'select',
                        editoptions: {
                            value: preConditionType_MAP
                        }
                    },
                    {name: 'sdkPospServeType',hidden:true,editable: true},
                    {name: 'sdkT0TradeFlag',
                        hidden:true,
                        editable: true,
                        edittype:'select',
                        editoptions: {
                            value: sdkT0TradeFlag_MAP
                        }
                    },
                    {name: 'sdkCancleTradeFlag',
                        hidden:true,
                        editable: true,
                        edittype:'select',
                        editoptions: {
                            value: sdkCancleTradeFlag_MAP
                        }
                    },
                    {name: 'sdkSignType',hidden:true,editable: true},
                    {name: 'sdkSignKey',hidden:true,editable: true},
                    {name: 'sdkNotifyUrl',editable: true,edittype:'textarea'},
                    {name: 'serviceUrlProcess',hidden:true,editable: true}

                ],
                loadComplete: function() {}
            });
        }
    });

    function typeFormatter(val){
        return TYPE_MAP[val];
    }
    function statusFormatter(val){
        return STATUS_MAP[val];
    }

    function groupFormatter(val){
        return GROUP_MAP[val];
    }
    function srcFormatter(val){
        return STATUS_MAP[val];
    }

    App.on('operate:cashbox:config',function(){
        App.show(new View());
    });
    return View;


});
