define([
    'i18n!app/oms/common/nls/report',
    'app/oms/report/common/common-grid-fn',
    'jquery.jqGrid',
    'moment.override'
], function(reportLang, CommonGrid) {

    var TXSUBCODE_MAP = {
        '30': '余额查询',
        '31': '消费',
        '33': '消费撤销',
        '35': '退货',
        '38': '预授权完成',

        '50': '余额查询',
        '51': '消费',
        '53': '消费撤销',
        '55': '退货',
        '58': '预授权完成'
    };

    var gridTpl = [
        '<div class="col-xs-12 jgrid-container orgTxn-grid export-grid">',
            '<table id="orgTxn-grid-table"></table>',
            '<div id="orgTxn-grid-pager" ></div>',
        '</div>'
    ].join('');

    var gridView = Marionette.ItemView.extend({
        className: 'row',
        template: _.template(gridTpl),

        initialize: function (params) {
            this.params = params;
        },

        serializeData: function () {
            return this.params;
        },

        onRender: function () {
            var me = this;
            setTimeout(function(){
                me.renderGrid();
                me.grid.jqGrid('setGridParam', { postData: me.params, datatype: 'json' });
                me.grid.trigger("reloadGrid", [{page:1}]);
            },10);
        },

        renderGrid: function () {
            var me = this;
            var grid = me.grid = App.Factory.createJqGrid({
                datatype: 'local',
                rsId: 'orgTxn',
                title: '机构流水对账',
                download: {
                    url: url._('report.brh.txns.download'),
                    //必须返回对象
                    params: function () {
                        return me.params;
                    },
                    queueTask: {//不配置就不在任务队列里生成一项，通常都要配置
                        name: function () {
                            return '机构流水对账';
                        }
                    }
                },
                actionsCol: {
                    edit: false,
                    del: false
                },
                nav: {
                    actions: {
                        add: false,
                        view: false,
                        search: false,
                        refresh: false
                    }
                },
                gid: 'orgTxn-grid',
                url: url._('report.brh.txns'),
                colNames: {
                    id: '',
                    brhName: reportLang._('report.brh.name'),//所属机构名
                    expandName: reportLang._('report.expand.name'),//所属拓展员名
                    mchtName: reportLang._('report.mcht.name'),//商户名称
                    mchtNo: reportLang._('report.mcht.no'),//商户编号
                    mchtKind: reportLang._('report.mcht.kind'),//商户类型
                    termNo: reportLang._('report.term.no'),//POS终端号
                    acNo: reportLang._('report.ac.no'),//卡号
                    acType: reportLang._('report.ac.type'),//交易卡种
                    txName: reportLang._('report.tx.name'),//交易名称
                    txSubCode: reportLang._('report.tx.sub.code'),//交易类型
                    txAmt: reportLang._('report.amt'),//交易金额
                    modelName: reportLang._('report.fee.value'),//商户签约费率
                    feeAmt: reportLang._('report.fee.amt'),//商户手续费
                    settleAmt: reportLang._('report.settle.amt'),//清算金额
                    brhFee: reportLang._('report.brh.fee'),//合作分润金额
                    traceNo: reportLang._('report.trace.no'),//交易流水号
                    date: reportLang._('report.date'),//交易日期
                    time: reportLang._('report.time'),//交易时间
                    authorizationNo: reportLang._('report.authorization.no'),//授权号
                    referenceNo: reportLang._('report.reference.no')//参考号
                },

                responsiveOptions: {
                    hidden: {
                        ss: ['brhName','expandName','mchtName','mchtKind','termNo','acNo','acType','txName','txSubCode','modelName','feeAmt','settleAmt','brhFee','traceNo','date','time','authorizationNo','referenceNo'],
                        xs: ['brhName','expandName','mchtName','mchtKind','termNo','acNo','acType','txName','txSubCode','modelName','feeAmt','settleAmt','brhFee','traceNo','date','time','authorizationNo','referenceNo'],
                        sm: ['mchtName','mchtKind','termNo','acNo','acType','txName','txSubCode','modelName','feeAmt','settleAmt','brhFee','traceNo','date','time','authorizationNo','referenceNo'],
                        md: ['mchtName','mchtKind','termNo','acType','txName','modelName','settleAmt','brhFee','traceNo','date','time','authorizationNo','referenceNo'],
                        ld: ['mchtKind','termNo','txName','modelName','acType','settleAmt','brhFee','authorizationNo','referenceNo']
                    }
                },

                colModel: [
                    {name: 'id', hidden: true},
                    {name: 'brhName'},// 所属机构名
                    {name: 'expandName'},// 所属拓展员名
                    {name: 'mchtName'},// 商户名称
                    {name: 'mchtNo'},// 商户编号
                    {name: 'mchtKind'},// 商户类型
                    {name: 'termNo'},// POS终端号
                    {name: 'acNo'},// 卡号
                    {name: 'acType'},// 交易卡种
                    {name: 'txName'},// 交易名称
                    {name: 'txSubCode', formatter: TxSubCodeFormatter},//交易类型
                    {name: 'txAmt'},// 交易金额
                    {name: 'modelName', viewable: true},// 商户签约费率
                    {name: 'feeAmt'},// 商户手续费
                    {name: 'settleAmt'},// 清算金额
                    {name: 'brhFee'},// 合作分润金额
                    {name: 'traceNo'},// 交易流水号
                    {name: 'date' ,formatter: dateFormatter},//交易日期
                    {name: 'time', formatter: timeFormatter},//交易时间
                    {name: 'authorizationNo'},// 授权号(FD38)
                    {name: 'referenceNo'}// 参考号(FD37)   
                ],

                onInitGrid: function () {

                },
                
                loadComplete: function() {

                }
            });
        }
    });

    function TxSubCodeFormatter (cellvalue, options, rowObject){
        return TXSUBCODE_MAP[cellvalue];
    }

    function dateFormatter (cellvalue, options, rowObject){
        return moment(cellvalue, 'YYYYMMDD').formatYMD();
    }

    function timeFormatter (cellvalue, options, rowObject){
        return moment(cellvalue, 'hhmmss').formatHMS();
    }

    return gridView;
});