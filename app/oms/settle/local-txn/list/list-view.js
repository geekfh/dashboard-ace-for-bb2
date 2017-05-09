define([
    'tpl!app/oms/settle/local-txn/list/templates/table.tpl',
    'jquery.jqGrid',
    'bootstrap-datepicker',
    'moment.override',
    'jquery.validate'
], function(tableCtTpl) {

    var STAT_MAP = {
        "totalSum":"总交易笔数",
        "totalAmt":"总交易金额"
    };

    var RESULT_FLAG_MAP = {
        '0': '已对账且对平',
        '1': '已对账但不平',
        '2': '本地流水未对账',
        '9': '非消费成功交易'
    };

    var DISC_CYCLE_MAP = {
        '0': 'T+0',
        '1': 'T+1'/*,
        '2': 'T+2',
        '3': 'T+3',
        '4': 'T+4',
        '5': 'T+5',
        '6': 'T+6',
        '7': 'T+7',
        '8': 'T+8',
        '9': 'T+9'*/
    };

    //卡类型
    var AC_TYPE = {
        "0":"全部类型",
        "1":"借记卡",
        "2":"贷记卡",
        "3":"准贷记卡",
        "4":"预付卡"
    };
    var View = Marionette.ItemView.extend({
        template: tableCtTpl,
        tabId: 'menu.local.txn',

        events: {

        },

        onRender: function() {
            var me = this;

            _.defer(function() {
                me.queryFilters = '';
                me.renderGrid();

                //var postData = me.grid.jqGrid('getGridParam', 'postData');
                //postData.filters = me.getYesterdayParams();
                //
                //me.grid.jqGrid('setGridParam', { postData: postData, datatype: 'json' });
                //me.grid.trigger("reloadGrid", [{page:1}]);
            });
        },


        getYesterdayParams: function () {
            var yesterDay = moment().subtract('day',1).format('YYYYMMDD');

            var filters = {
                'groupOp': 'AND',
                rules: [
                    {field: 'txDate', op: 'eq', data: yesterDay}
                ]   
            };

            return JSON.stringify(filters);
        },

            
        gridOptions: function(defaultOptions) {
            return defaultOptions;
        },


        renderGrid: function() {
            var me = this;

            var roleGird = me.grid = App.Factory.createJqGrid(me.gridOptions({
                rsId:'local.txn',
                caption: '本地流水表',
                stats:{
                    labelConfig:STAT_MAP,
                    items:[
                        {name: 'totalSum', type:'count'},
                        {name: 'totalAmt', type:'currency'}
                    ]
                },
                datatype: 'local',
                download: {
                    url: url._('local.txn.download'),
                    //必须返回对象
                    params: function () {
                        return {filters: me.queryFilters};
                    },
                    queueTask: {//不配置就不在任务队列里生成一项，通常都要配置
                        name: function () {
                            return '本地流水信息';
                        }
                    }
                },
                actionsCol: {
                    edit : false,
                    del: false
                },
                nav: {
                    actions: {
                        add: false
                    },
                    search: {
                        beforeShowSearch: function () {
                            me.grid.jqGrid('setGridParam', { datatype: 'json' });
                            return true;
                        }
                    }
                },
                gid: 'local-txn-grid',
                url: url._('local.txn'),

                colNames: {
                    id: 'id',
                    txDate: '交易日期',
                    txTime: '交易时间',
                    traceNo: '平台流水',
                    fd43: '渠道名称',
                    fd37: '系统检索号',
                    orderNo: '订单号',
                    acNo: '交易卡号',
                    acType:'卡类型',
                    txAmt: '交易金额',
                    discCycle: '清算周期',
                    resultFlag: '流水状态'
                    
                },

                responsiveOptions: {
                    hidden: {
                        ss: [],
                        xs: [],
                        sm: [],
                        md: [],
                        ld: []
                    }
                },

                colModel: [
                    {name: 'id', editable: false, hidden: true},  //ID
                    {name: 'txDate', formatter: txDateFormatter, search: true,
                        searchoptions: {
                            dataInit : function (elem) {
                                $(elem).datepicker({autoclose: true,format: 'yyyymmdd'});
                            },
                            sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge']
                        }
                    },  //交易日期
                    {name: 'txTime', formatter: txTimeFormatter},  //交易时间
                    {name: 'traceNo', search: true, _searchType:'string',searchoptions: {sopt: ['eq']}},  //平台流水
                    {name: 'fd43'},  //渠道名称
                    {name: 'fd37', search: true, _searchType:'string',searchoptions: {sopt: ['eq']}},  //系统检索号
                    {name: 'orderNo', search: true, _searchType:'string',searchoptions: {sopt: ['eq']}},  //订单号
                    {name: 'acNo', search: true, _searchType:'string'},  //交易卡号
                    {name: 'acType', search: true, formatter: acTypeFormatter,
                        stype:'select',
                        searchoptions:{
                            value: AC_TYPE,
                            sopt: ['eq','ne']
                        }
                    },  //卡类型
                    {name: 'txAmt'},  //交易金额
                    {name: 'discCycle', search: true, formatter: discCycleFormatter,
                        stype: 'select',
                        searchoptions: {
                            value: DISC_CYCLE_MAP,
                            sopt: ['eq','ne']
                        }
                    },  //清算周期
                    {name: 'resultFlag', formatter: resultFlagFormatter, search: true,
                        stype: 'select',
                        searchoptions: {
                            value: RESULT_FLAG_MAP,
                            sopt: ['eq','ne']
                        }
                    }  //流水状态
                   
                ],

                loadComplete: function() {
                    var postData = $(me.grid).jqGrid('getGridParam', 'postData') || {};
                    me.queryFilters = postData.filters;
                }
            }));


        }

    });

    function  acTypeFormatter(val){
        return AC_TYPE[val] || '';
    }
    function resultFlagFormatter (val) {
        return RESULT_FLAG_MAP[val] || '';
    }

    function discCycleFormatter (val) {
        return DISC_CYCLE_MAP[val] || val || '';
     }

    function txDateFormatter (val) {
        var value = val || '';
        return value.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
    }

    function txTimeFormatter (val) {
        var value = val || '';
        return value.replace(/(\d{2})(\d{2})(\d{2})/, '$1:$2:$3');
    }



    App.on('localTxn:list', function () {
        App.show(new View());
    });


    return View;

});