/**
 * Created by wupeiying on 2015/11/27.
 */
define(['App',
    'jquery.jqGrid'
], function(App) {

    var tableCtTpl = [
        '<div class="row">',
        '<div class="col-xs-12 jgrid-container">',
        '<table id="exceptions-detail-grid-table"></table>',
        '<div id="exceptions-detail-grid-pager" ></div>',
        '</div>',
        '</div>'].join('');

    var CUSTTYPE_MAP = {
        1:'商户',
        2:'地推',
        3:'代理商'
        //4:'个人',
        //5:'互金',
        //6:'O2O'
    };

    var CURRENCYTYPE_MAP = {
        156: '人民币'
    };

    var RESULT_MAP = {
        0: '平',
        1: '不平'
    };

    var View = Marionette.ItemView.extend({
        template: _.template(tableCtTpl),
        tabId: 'menu.exceptions.cutOffCheckDetail',
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
                rsId: 'exceptionsDetail',
                caption: '',
                nav: {
                    actions: {
                        search: false,
                        add: false
                    }
                },
                filters: [
                    {
                        caption: '日切搜索',
                        //defaultRenderGrid: false,
                        canSearchAll: true,
                        canClearSearch: true,
                        components: [
                            {
                                label: '核对日期',
                                name: 'searchTime',
                                type: 'rangeDate',
                                limitRange: 'month',
                                limitDate: moment(),
                                defaultValue: [moment(), moment()],
                                options: {
                                    sopt: ['lk','gt','lt']
                                }
                            }
                            //{
                            //    label: '处理结果',
                            //    name: 'result',
                            //    type: 'select',
                            //    options: {
                            //        value: RESULT_MAP,
                            //        sopt: ['eq']
                            //    }
                            //}
                        ],
                        searchBtn: {
                            text: '搜索'
                        }
                }],
                actionsCol: {
                    width: 150,
                    edit: false,
                    del: false,
                    extraButtons: [
                        {
                            name: 'manualAccount', icon: '', title: '手工记账', caption: '手工记账',
                            click: function (name, opts, rowData) {
                                require(['app/oms/account/manualAccount/list-view'], function(View) {
                                    var manualView = new View().render();
                                    manualView.addManualAccountDialog(manualView);
                                });
                            }
                        },
                        {
                            name: 'adjustAccount', icon: '', title: '调账', caption: '调账',
                            click: function (name, opts, rowData) {
                                require(['app/oms/account/adjustAccount/record/trade-view'], function() {
                                    App.trigger('account:trade:list', {tradeNo: rowData.tradeNo});//outTradeNo: rowData.outTradeNo
                                });
                            }
                        }
                    ]
                },
                gid: 'exceptions-detail-grid',
                url: url._('exceptions.detail.list'),
                colNames: {
                    id:'',
                    outTradeNo:'外部交易流水号',
                    tradeNo:'交易流水号',
                    custType:'用户类型',
                    custNo:'用户编号',
                    custName:'用户名称',
                    tradeAmount:'交易金额',
                    accountingAmount: '账务金额',
                    varianceAmount: '差异金额',
                    currencyType:'币种',//156：人民币
                    workDate:'账务日期',
                    tradeTime:'交易时间',
                    tradeTypeName:'交易类型'
                },
                colModel: [
                    {name: 'id', hidden:true},
                    {name: 'outTradeNo', hidden:true},
                    {name: 'tradeNo', hidden:true},
                    {name: 'custType', formatter: custTypeFormatter},
                    {name: 'custNo', hidden:true},
                    {name: 'custName', hidden:true},
                    {name: 'tradeAmount'},
                    {name: 'accountingAmount'},
                    {name: 'varianceAmount'},
                    {name: 'currencyType', formatter: currencyTypeFormatter},
                    {name: 'workDate', hidden:true},
                    {name: 'tradeTime', formatter: chuoFormatter},
                    {name: 'tradeTypeName'},
                ],
                loadComplete: function () {}
            });

            return grid;
        }
    });

    function custTypeFormatter(val){
        return CUSTTYPE_MAP[val] || '';
    }

    function currencyTypeFormatter(val)
    {
        return CURRENCYTYPE_MAP[val] || '';
    }

    function dateFormatter(val) {
        return val ? moment(val, 'YYYYMMDDHHmm').format('YYYY/MM/DD HH:mm') : '';
    }

    function chuoFormatter(val) {
        return val ? moment(val).format('YYYY/MM/DD HH:mm') : '';
        //var date = new Date(val);
        //var Y = date.getFullYear() + '-';
        //var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        //var D = date.getDate() + ' ';
        //var h = date.getHours() + ':';
        //var m = date.getMinutes() + ':';
        //var s = date.getSeconds();
        //return Y+M+D+h+m+s;
    }

    App.on('exceptions:detail:list', function () {
        App.show(new View());
    });

    return View;
});