define([
    'i18n!app/oms/common/nls/report',
    'app/oms/report/common/common-grid-fn',
    'jquery.jqGrid'
], function(reportLang, CommonGrid) {

    //TODO 数据中心返回的商户类型就是中文名称，临时转化下翻译
    //将来还是要让数据中心返回 B1, B2 这种数据
    var DIC_MCHT_KIND = {
        'B1': '个体商户',
        'B2': '普通商户',
        '个人商户': '个体商户',
        '企业商户': '普通商户'
    };

    var gridTpl = [
        '<div class="col-xs-12 jgrid-container orgMchtSum-grid export-grid">',
            '<table id="orgMchtSum-grid-table"></table>',
            '<div id="orgMchtSum-grid-pager" ></div>',
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
                rsId: 'orgMchtSum',
                title: '机构商户交易汇总',
                download: {
                    url: url._('report.brh.mcht.trade.download'),
                    //必须返回对象
                    params: function () {
                        return me.params;
                    },
                    queueTask: {//不配置就不在任务队列里生成一项，通常都要配置
                        name: function () {
                            return '机构商户交易汇总';
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
                gid: 'orgMchtSum-grid',
                url: url._('report.brh.mcht.trade'),
                colNames: {
                    id: '',
                    mchtName: reportLang._('report.mcht.name'),//商户名称
                    mchtNo: reportLang._('report.mcht.no'),//商户编号
                    mchtKind: reportLang._('report.mcht.kind'),//商户类型
                    txAmt: reportLang._('report.amt'),//交易金额
                    tradeSum: reportLang._('report.trade.sum'),//交易笔数
                    modelName: reportLang._('report.fee.value'),//商户签约费率
                    feeAmt: reportLang._('report.fee.amt')//商户手续费
                },

                responsiveOptions: {
                    hidden: {
                        ss: ['mchtName','mchtKind','tradeSum','feeAmt'],
                        xs: ['mchtName','mchtKind','tradeSum','feeAmt'],
                        sm: ['mchtName','mchtKind'],
                        md: [],
                        ld: []
                    }
                },

                colModel: [
                    {name: 'id', hidden: true},
                    {name: 'mchtName'},//商户名称
                    {name: 'mchtNo'},//商户编号
                    {name: 'mchtKind'},//商户类型
                    {name: 'txAmt'},//交易金额
                    {name: 'tradeSum'},//交易笔数
                    {name: 'modelName'},// 商户签约费率
                    {name: 'feeAmt'}//商户手续费
                ],

                onInitGrid: function () {

                },
                
                loadComplete: function() {

                }
            });
        }
    });

    return gridView;
});