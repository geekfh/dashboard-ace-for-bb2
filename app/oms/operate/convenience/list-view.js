/**
 * @author hefeng
 * @description 便民查询
 */
define([
    'App', 'jquery.jqGrid',
    'bootstrap-datepicker'
], function(App) {
    // 表格模板
    var tableCtTpl = [
        '<div class="row">',
            '<div class="col-xs-12 jgrid-container">',
                '<table id="operate-convenience-grid-table"></table>',
                '<div id="operate-convenience-grid-pager" ></div>',
            '</div>',
        '</div>'].join('');

    return Marionette.ItemView.extend({
        template: _.template(tableCtTpl),
        tabId: 'menu.operate.convenience',

        onRender: function () {
            var me = this;
            _.defer(function () {
                me.renderGrid();
            });
        },

        renderGrid: function () {
            var grid = App.Factory.createJqGrid({
                rsId: 'operate.convenience',
                caption: '便民查询',
                filters: [
                    {
                        caption: '搜索',
                        defaultRenderGrid: false,
                        canSearchAll: true,
                        canClearSearch: true,
                        components: [
                            {
                                label: '交易日期',
                                name: 'txDate',
                                type: 'rangeDate',
                                defaultValue: [moment(), moment()]
                            },
                            {
                                label: '清算日期',
                                name: 'algoDate',
                                type: 'date'
                            },
                            {
                                label: '消费卡号',
                                name: 'acNo'
                            },
                            {
                                label: '流水号',
                                name: 'orderNo'
                            },
                            {
                                label: '欧非订单号',
                                name: 'partnerId'
                            }

                        ],
                        searchBtn: {
                            text: '搜索'
                        }
                    }
                ],
                nav: { actions: { search: false, add: false } },
                actionsCol: { edit: false, del: false },
                gid: 'operate-convenience-grid',
                url: url._('operate.convenience.search'),
                download: {
                    titleName: '导出',
                    url: url._('operate.convenience.download'),

                    //必须返回对象
                    params: function () {
                        var postData = $(grid).jqGrid('getGridParam', 'postData');
                        return { filters: postData.filters };
                    },

                    //不配置就不在任务队列里生成一项，通常都要配置
                    queueTask: {
                        name: function () {
                            return '下载便民信息';
                        }
                    }
                },
                colNames: {
                    id: 'ID',
                    txAmt: '交易金额',
                    settleAmt: '应付金额',
                    amount: '实收金额',
                    partnerId: '欧非订单号',
                    orderNo: '流水号',
                    txDate: '交易日期',
                    algoDate: '清算日期',
                    acNo: '消费卡号',
                    cupsNo: '交易渠道'
                },
                colModel: [
                    {name: 'id', hidden:true},
                    {name: 'txAmt'},
                    {name: 'settleAmt'},
                    {name: 'amount'},
                    {name: 'partnerId'},
                    {name: 'orderNo'},
                    {name: 'txDate'},
                    {name: 'algoDate'},
                    {name: 'acNo'},
                    {name: 'cupsNo'}
                ]
            });
        }
    });
});
