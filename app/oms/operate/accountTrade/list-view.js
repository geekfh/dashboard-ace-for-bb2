/**
 * Created by wupeiying on 2016/1/20.
 */
define(['App',
    'jquery.jqGrid',
    'jquery.validate',
    'bootstrap-datepicker'
], function(App) {

    
    var tableCtTpl = [
        '<div class="row">',
        '<div class="col-xs-12 jgrid-container">',
        '<table id="account-trade-grid-table"></table>',
        '<div id="account-trade-grid-pager" ></div>',
        '</div>',
        '</div>'].join('');

    var TRADETYPE_MAP = {
        0: '充值',
        1: '提现',
        2: '消费',
        3: '清分入账',
        4: '商户入账',
        5: '商户对账',
        '': '所有'
    };

    var CUSTTYPE_MAP = {
        1:'商户',
        2:'地推',
        3:'代理商',
        4:'个人',
        5:'互金',
        6:'O2O'
    };

    var View = Marionette.ItemView.extend({
        template: _.template(tableCtTpl),
        tabId: 'menu.discount.accountTrade',
        events: {},

        onRender: function () {
            var me = this;
            _.defer(function () {
                me.renderGrid();
            });
        },
        renderGrid: function () {
            var me = this;

            var grid = App.Factory.createJqGrid({
                rsId: 'accountTrade',
                caption: '',
                nav: {
                    actions: {
                        search: false,
                        add: false
                    }
                },
                actionsCol: {
                    edit: false,
                    del: false
                },
                filters: [{
                    caption: '调账搜索',
                    //defaultRenderGrid: false,
                    canSearchAll: true,
                    canClearSearch: true,
                    components: [
                        {
                            label: '交易类型',
                            name: 'tradeType',
                            type: 'select',
                            options: {
                                value: TRADETYPE_MAP,
                                sopt: ['lk']
                            }
                        },
                        {
                            label: '交易日期',
                            name: 'orderTime',
                            type: 'rangeDate',
                            ignoreFormReset: true,
                            limitRange: 'month',
                            limitDate: moment(),
                            options: {
                                sopt: ['lk']
                            }
                        },
                        {
                            label: '用户类型',
                            name: 'custType',
                            type: 'select',
                            options: {
                                value: CUSTTYPE_MAP,
                                sopt: ['eq']
                            }
                        },
                        {
                            label: '用户编号',
                            name: 'custNo',
                            type: 'text',
                            options: {
                                sopt: ['lk']
                            }
                        },
                        {
                            label: '用户名称',
                            name: 'custName',
                            type: 'text',
                            options: {
                                sopt: ['lk']
                            }
                        },
                        {
                            label: '交易流水号',
                            name: 'outTrandeNo',
                            type: 'text',
                            options: {
                                sopt: ['lk']
                            }
                        },
                        {
                            label: '账务流水号',
                            name: 'tradeNo',
                            //defaultValue: me.options.tradeNo == undefined ? '' : me.options.tradeNo,
                            type: 'text',
                            options: {
                                sopt: ['lk']
                            }
                        }
                    ],
                    searchBtn: {
                        text: '搜索'
                    }
                }],
                gid: 'account-trade-grid',
                url: url._('account.trade.list'),
                colNames: {
                    id: '',
                    tradeNo: '账务流水号',
                    tracer: '',
                    outTradeNo: '交易流水号',
                    tradeType: '交易类型',
                    tradeTypeName: '交易类型名称',
                    curryType: '币种',
                    amount: '交易金额',
                    fee: '手续费',
                    tradeStatus: '交易状态',
                    tradeStatusName: '交易状态名称',
                    custType: '客户类型',
                    custNo: '客户编码',
                    custName: '客户名称',
                    memo: '备注信息',
                    operator: '操作员',
                    operateOrigin: '操作来源',
                    workDate: '账务日期',
                    tallyStatus: '账务状态',
                    tallyStatusName: '账务状态名称',
                    signFlag: '金额符号标识',
                    orderTimeFormat: '订单时间'
                },
                colModel: [
                    {name: 'id', hidden:true},
                    {name: 'tradeNo'},
                    {name: 'tracer', hidden:true},
                    {name: 'outTradeNo', hidden: true},
                    {name: 'tradeType', hidden: true},//, formatter: tradeFormatter
                    {name: 'tradeTypeName'},
                    {name: 'curryType', hidden: true},
                    {name: 'amount'},
                    {name: 'fee', hidden: true},
                    {name: 'tradeStatus', hidden: true},
                    {name: 'tradeStatusName'},
                    {name: 'custType', hidden: true},//, formatter: custFormatter
                    {name: 'custNo', hidden: true},
                    {name: 'custName', hidden: true},
                    {name: 'memo'},
                    {name: 'operator', hidden: true},
                    {name: 'operateOrigin', hidden: true},
                    {name: 'workDate'},
                    {name: 'tallyStatus'},
                    {name: 'tallyStatusName'},
                    {name: 'signFlag'},
                    {name: 'orderTimeFormat', formatter: dateFormatter}
                ],
                loadComplete: function () {}
            });

            return grid;
        }
    });

    function tradeFormatter(val) {
        return TRADETYPE_MAP[val] || '';
    }

    function custFormatter(val){
        return CUSTTYPE_MAP[val] || '';
    }

    function dateFormatter(val) {
        return val ? moment(val, 'YYYYMMDDHHmm').format('YYYY/MM/DD HH:mm') : '';
    }

    function getDateTime(sTime, eTime){
        sTime.datepicker({ autoclose: true, format: 'yyyymmdd'});
        eTime.datepicker({ autoclose: true, format: 'yyyymmdd'});
    }

    App.on('operate:accountTrade:list', function () {
        App.show(new View());
    });

    return View;
});