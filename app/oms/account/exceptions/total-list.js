/**
 * Created by wupeiying on 2015/11/27.
 */

define(['App',
    'jquery.jqGrid'
], function(App) {

    var tableCtTpl = [
        '<div class="row">',
        '<div class="col-xs-12 jgrid-container">',
        '<table id="exceptions-total-grid-table"></table>',
        '<div id="exceptions-total-grid-pager" ></div>',
        '</div>',
        '</div>'].join('');

    var CHECKTYPE_MAP = {
        0: '总账',
        1: '通道',
        2: '收单'
    };

    var RESULT_MAP = {
        0: '平',
        1: '不平'
    };

    var View = Marionette.ItemView.extend({
        template: _.template(tableCtTpl),
        tabId: 'menu.exceptions.cutOffCheckTotal',
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
                rsId: 'exceptionsTotal',
                caption: '',
                nav: {
                    actions: {
                        search: false,
                        add: false
                    }
                },
                filters: [
                {
                    caption: '总分账搜索',
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
                        },
                        {
                            label: '核对结果',
                            name: 'result',
                            type: 'select',
                            options: {
                                value: RESULT_MAP,
                                sopt: ['eq']
                            }
                        }
                    ],
                    searchBtn: {
                        text: '搜索'
                    }
                }],
                actionsCol: {
                    edit: false,
                    del: false
                },
                gid: 'exceptions-total-grid',
                url: url._('exceptions.total.list'),
                colNames: {
                    id:'',
                    workDate:'账务日期',
                    checkType:'检查类型',//0  总账 1  通道 2  收单
                    checkTime: '检查时间',
                    yesterdayTotalAmount: '期初余额',
                    todayIncurredlAmount: '当日发生额',
                    todayTotalAmount: '期末余额',
                    varianceAmount: '差异金额',
                    result:'处理结果'//0 表示平 1 表示不平
                },
                colModel: [
                    {name: 'id', hidden:true},
                    {name: 'workDate', formatter: dateFormatter},
                    {name: 'checkType', formatter: checkTypeFormatter},
                    {name: 'checkTime', formatter: chuoFormatter},
                    {name: 'yesterdayTotalAmount'},
                    {name: 'todayIncurredlAmount'},
                    {name: 'todayTotalAmount'},
                    {name: 'varianceAmount'},
                    {name: 'result', formatter: resultFormatter}
                ],
                loadComplete: function () {}
            });

            return grid;
        }
    });

    function checkTypeFormatter(val)
    {
        return CHECKTYPE_MAP[val] || '';
    }

    function resultFormatter(val)
    {
        return RESULT_MAP[val] || '';
    }

    function chuoFormatter(val) {
        return val ? moment(val).format('YYYY/MM/DD') : '';
    }

    function dateFormatter(val) {
        return val ? moment(val, 'YYYYMMDDHHmm').format('YYYY/MM/DD') : '';
    }

    App.on('exceptions:total:list', function () {
        App.show(new View());
    });

    return View;
});