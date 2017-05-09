define([
    'tpl!app/oms/promotions/model/list/templates/table-ct.tpl',
    'jquery.jqGrid',
    'jquery.validate',
    'bootstrap-datepicker',
    'moment.override'
],function(tpl){
    var filterEditOptsFn = function(jsonObj){
        return JSON.stringify(jsonObj).replace(/[\{|\}|'|"]/g, "").replace(/,/g, ";");
    };

    //活动对象类型
    var OBJTYPE_MAP = {
        "1": "商户",
        "2": "机构"
    };
    var OBJTYPE_VALUE = {value:filterEditOptsFn(OBJTYPE_MAP)};

    //活动方式
    var PROMTSMODE_MAP = {
        "1": "按金额",
        //"2": "按比例",
        "3": "按笔数"
    };
    var PROMTSMODE_VALUE = {value:filterEditOptsFn(PROMTSMODE_MAP)};

    //活动生效形式
    var PROMTSTYPE_MAP = {
        "1": "实时",
        "2": "后返"
    };
    var PROMTSTYPE_VALUE = {value:filterEditOptsFn(PROMTSTYPE_MAP)};

    //活动周期
    var PROMTSCYCLE_MAP = {
        "1": "天",
        "2": "周",
        "3": "月",
        "4": "仅一次"
    };
    var PROMTSCYCLE_VALUE = {value:filterEditOptsFn(PROMTSCYCLE_MAP)};

    //活动状态
    var PROMTSSTATUS_MAP = {
        "1": "正常",
        "0": "关闭"
    };
    var PROMTSSTATUS_VALUE = {value:filterEditOptsFn(PROMTSSTATUS_MAP)};

    return Marionette.ItemView.extend({
        tabId: 'menu.promotions.model',
        template: tpl,
        events: {
        },

        initialize: function (options) {
            //TODO
        },

        onRender: function () {
            var me = this;

            _.defer(function () {
                me.renderGrid();
            });
        },

        renderGrid: function () {
            var me = this;
            var setupValidation = Opf.Validate.setup;
            var addValidateRules = function(form) {
                Opf.Validate.addRules(form, {
                    //要对select2作验证，选择添加select2前 input 的 name
                    //required: {boolean}
                    //number: {boolean},
                    //maxLength {number}
                    rules: {
                        promtsName: { //活动方案名称必填
                            required : true
                        },amount: { //活动优惠额必填且必须是数字
                            required : true,
                            number:true
                        },condationAmt: { //活动条件金额必填且必须是数字
                            required: true,
                            number:true
                        },condationNum: { //活动条件笔数必填且必须是数字
                            required: true,
                            number:true
                        },beginTime: { //活动开始时间必填
                            required: true
                        },endTime: { //活动结束时间必填
                            required: true
                        }
                    }
                });
            };
            me.grid = App.Factory.createJqGrid({
                caption: '优惠方案模型',
                rsId:'promotions.model',
                gid: 'promotions-model-grid',
                url: url._('promotions.model.list'),
                datatype: 'json',
                actionsCol: {
                    view: false
                    //width: 300,
                    //edit: false,
                    //del : false,
                    //extraButtons:[]
                },
                nav: {
                    formSize: {
                        height: 530
                    },
                    add: {
                        beforeShowForm: function(form){
                            //增加校验规则
                            addValidateRules(form);

                            //隐藏ID字段
                            $("input[name='id']",form).closest("tr#tr_id").hide();
                        },
                        /*onclickSubmit: function(params, postdata){
                            return postdata;
                        },*/
                        beforeSubmit: setupValidation
                    },
                    edit: {
                        beforeShowForm: function(form){
                            addValidateRules(form);
                            $("input[name='id']",form).closest("tr#tr_id").hide();
                        },
                        beforeSubmit: setupValidation
                    }
                },
                colNames: {
                    id:                '方案编号',
                    promtsName:        '活动名称',
                    objType:           '活动对象类型',
                    status:            '活动状态',
                    promtsCycle:       '活动周期',
                    promtsMode:        '活动方式',
                    promtsType:        '活动生效方式',
                    condationAmt:      '活动条件金额',
                    condationNum:      '活动条件笔数',
                    amount:            '活动优惠额',
                    beginTime:         '活动开始时间',
                    endTime:           '活动结束时间'
                },
                colModel: [
                    //方案编号
                    {
                        name: 'id',
                        index:'id'
                    },
                    //活动名称
                    {
                        name: 'promtsName',
                        index: 'promtsName',
                        editable: true,
                        search: true,
                        searchoptions: {
                            sopt: ['eq','ne']
                        }
                    },

                    //活动对象类型
                    {
                        name: 'objType',
                        index: 'objType',
                        editable: true,
                        edittype: 'select',
                        editoptions: OBJTYPE_VALUE,
                        formatter: function(value){
                            return OBJTYPE_MAP[value]||"";
                        }
                    },

                    //活动状态
                    {
                        name: 'status',
                        index: 'status',
                        editable: true,
                        edittype: 'select',
                        editoptions: PROMTSSTATUS_VALUE,
                        formatter: function(value){
                            return PROMTSSTATUS_MAP[value]||"";
                        }
                    },

                    //活动周期
                    {
                        name: 'promtsCycle',
                        index: 'promtsCycle',
                        editable: true,
                        edittype: 'select',
                        editoptions: PROMTSCYCLE_VALUE,
                        formatter: function(value){
                            return PROMTSCYCLE_MAP[value]||"";
                        }
                    },

                    //活动方式
                    {
                        name: 'promtsMode',
                        index: 'promtsMode',
                        editable: true,
                        edittype: 'select',
                        editoptions: PROMTSMODE_VALUE,
                        formatter: function(value){
                            return PROMTSMODE_MAP[value]||"";
                        }
                    },

                    //活动生效方式
                    {
                        name: 'promtsType',
                        index: 'promtsType',
                        editable: true,
                        edittype: 'select',
                        editoptions: PROMTSTYPE_VALUE,
                        formatter: function(value){
                            return PROMTSTYPE_MAP[value]||"";
                        }
                    },

                    //活动条件金额
                    {
                        name: 'condationAmt',
                        index: 'condationAmt',
                        editable: true
                    },

                    //活动条件笔数
                    {
                        name: 'condationNum',
                        index: 'condationNum',
                        editable: true
                    },

                    //活动优惠额
                    {
                        name: 'amount',
                        index: 'amount',
                        editable: true
                    },

                    //活动开始时间
                    {
                        name: 'beginTime',
                        index: 'beginTime',
                        formatter: dateFormatter,
                        editable: true,
                        editoptions: {
                            dataInit : function (elem) {
                                $(elem).datepicker( {autoclose: true, format: "yyyymmdd"} );
                            }
                        }
                    },

                    //活动结束时间
                    {
                        name: 'endTime',
                        index: 'endTime',
                        formatter: dateFormatter,
                        editable: true,
                        editoptions: {
                            dataInit : function (elem) {
                                $(elem).datepicker( {autoclose: true, format: "yyyymmdd"} );
                            }
                        }
                    }
                ],

                loadComplete: function () {
                    //console.info(me.$el);
                }
            });

            //return grid;
        }

    });

    //格式化日期格式
    function dateFormatter (value, options, rowData) {
        return value ? moment(value, 'YYYYMMDD').format('YYYY/MM/DD') : '';
    }

});