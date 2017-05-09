define([
    'tpl!app/oms/service/list/templates/table-ct.tpl',
    'jquery.jqGrid',
    'bootstrap-datepicker'
],function(tpl){

    var STATUS_MAP = {
        '0': '未开始',
        '1': '开通',
        '2': '暂停',
        '3': '停止'
    };

    var TARGET_MAP = {
        '1': '商户',
        '2': '机构'
    };

    var ACTIVATEWAY_MAP = {
        '1': '完全开放',
        '2': '代理商邀请',
        '3': '公司邀请'
    };

    var FIXED_FEE_TYPE = {
        '0': '固定费用',
        '1': '按周期收费',
        '2': '免费'
    };


    var View = Marionette.ItemView.extend({
        tabId: 'menu.service.model.config',
        template: tpl,
        events: {
        },

        initialize: function (options) {
            options && (this.defaultOpenPage = options.defaultOpenPage);
        },

        onRender: function () {
            var me = this;
            _.defer(function () {
                var grid = window.grid = me.renderGrid();
                grid.setGridParam({datatype: 'json', page: me.defaultOpenPage || 1});
                grid.trigger('reloadGrid');
            });
        },

        renderGrid: function () {
            var me = this;

            var grid = me.grid = App.Factory.createJqGrid({
                rsId:'services.manager',
                caption: '服务管理',
                datatype: 'local',
                actionsCol: {
                    edit: false,
                    del : false,
                    view: false,
                    width: 300,
                    extraButtons:[
                        {name: 'editTask', caption:'修改任务配置',  title:'修改任务配置', icon: '', click: function(name, obj, model) {
                            me.trigger('edit:task', model.id, grid.getGridParam().page);
                        }},
                        {name: 'editActivate', caption:'修改开通配置',  title:'修改开通配置', icon: '', click: function(name, obj, model) {
                            me.trigger('edit:Activate', model.id, grid.getGridParam().page);
                        }},
                        {name: 'viewTask', caption:'查看任务配置',  title:'查看任务配置', icon: '', click: function(name, obj, model) {
                            me.trigger('view:task', model.id, grid.getGridParam().page);
                        }},
                        {name: 'viewActivate', caption:'查看开通配置',  title:'查看开通配置', icon: '', click: function(name, obj, model) {
                            me.trigger('view:activate', model.id, grid.getGridParam().page);
                        }}
                        /*,
                        {name: 'viewMchts', caption:'查看开通服务的商户',  title:'查看开通服务的商户', icon: '', click: function(name, obj, model) {
                            me.trigger('view:mchts', model.id);
                        }}*/
                    ]
                },
                nav: {
                    actions:{
                        addfunc: function () {
                            me.trigger('add:service', grid.getGridParam().page);
                        }
                    }
                },
                gid: 'services-manager-grid',
                url: url._('service.list'),
                colNames: {
                    id:                'id',
                    status:            '状态',
                    name:              '名称',
                    version:           '版本',
                    target:            '对象',
                    fixedFeeType:      '费用情况',
                    activateWay:       '开通方式',
                    planOpenTime:      '计划开放时间',
                    closeTime:         '关闭时间',
                    planActiveNum:     '计划开通名额',
                    actualActiveNum:   '实际开通名额'
                },

                colModel: [
                    {name: 'id', hidden: true},
                    {name: 'status', search: true, formatter: statusFormatter, stype: 'select',
                        searchoptions: {
                            value: STATUS_MAP,
                            sopt: ['eq','ne']
                        }
                    },
                    {name: 'name', search: true},
                    {name: 'version'},
                    {name: 'target', formatter: targetFormatter},
                    {name: 'fixedFeeType', formatter: fixedFeeTypeFormatter},
                    {name: 'activateWay', search: true, formatter: activateWayFormatter, stype: 'select',
                        searchoptions: {
                            value: ACTIVATEWAY_MAP,
                            sopt: ['eq','ne']
                        }
                    },
                    {name: 'planOpenTime', search: true,
                        searchoptions: {
                            dataInit : function (elem) {
                                $(elem).datepicker({autoclose: true, format: 'yyyy-mm-dd'});
                            },
                            sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge']
                        }
                    },
                    {name: 'closeTime'},
                    {name: 'planActiveNum'},
                    {name: 'actualActiveNum'}
                ],

                loadComplete: function () {
                    me.$el.find('.horizontal-btns').closest('td').attr('title', '');
                }
            }); 

            return grid;
        }

    });


    function statusFormatter (val) {
        return STATUS_MAP[val] || '';
    }

    function targetFormatter (val) {
        return TARGET_MAP[val] || '';
    }

    function activateWayFormatter(val) {
        return ACTIVATEWAY_MAP[val] || '';
    }

    function fixedFeeTypeFormatter(val) {
        return FIXED_FEE_TYPE[val] || '';
    }


    return View;
});