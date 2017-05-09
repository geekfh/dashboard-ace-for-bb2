
define([
    'tpl!../change/templates/table-list.tpl',
    'jquery.jqGrid', 'moment.override'
],function(tpl){
    var oprType_MAP = {
        1:'修改',
        2:'删除',
        3: '新增'
    };

    //日期格式化
    var createTimeFormatter = function(value){
        return value? moment(value).format('YYYY/MM/DD'):"";
    };

    var View = Marionette.ItemView.extend({
        tabId: 'menu.cashpool.change',
        template: tpl,
        onRender: function(){
            var me = this;
            _.defer(function(){
                me.renderGrid();

            });
        },
        onAddModel: function(){
            var me = this;
            require(['../../../settle/cancel-order/add-view'],function(AddView){
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
                rsId:'cashpool.change',
                gid: 'cashpool-change-grid',
                caption: '资金池配置',
                nav: {
                    actions: {
                        add: false
                    }
                },
                actionsCol:{
                    view:false,
                    del:false,
                    width: 110
                },
                url: url._('operate.cashpollchange.list'),

                colNames: {
                    id: 'ID',
                    operatorType: '操作类型',//
                    createTime: '创建时间',//
                    //newValue: '新值',
                    name: '操作员姓名',//
                    effectTime: '资金池生效日期',//
                    //oldValue: '旧值',
                    //fieldName: '修改字段'
                    jsonString: '修改内容'


                },

                colModel: [
                    {name: 'id',hidden:true},
                    {
                        name: 'operatorType', editable: true, search: true, formatter: function (val) {return oprType_MAP[val];}, search: true,
                        stype: 'select',
                        searchoptions: {
                            value: oprType_MAP,
                            sopt: ['eq']
                        }
                    },
                    {name: 'createTime', formatter: createTimeFormatter},
                    //{name: 'newValue',editable: true,search:true},
                    {name: 'name'},
                    {name: 'effectTime'},
                    {name: 'jsonString'}
                    //{name: 'oldValue',editable: true,search:true},
                    //{name: 'fieldName',editable: true,search:true}






                ],
                loadComplete: function() {}
            });
        }
    });

    App.on('operate:cashpollchange:list',function(){
        App.show(new View());
    });
    return View;


});

































