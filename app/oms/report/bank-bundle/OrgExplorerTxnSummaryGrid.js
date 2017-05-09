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
        '<div class="col-xs-12 jgrid-container orgExploreSum-grid export-grid">',
            '<table id="orgExploreSum-grid-table"></table>',
            '<div id="orgExploreSum-grid-pager" ></div>',
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
                rsId: 'orgExploreSum',
                title: '机构拓展员交易汇总',
                download: {
                    url: url._('report.brh.expand.download'),
                    //必须返回对象
                    params: function () {
                        return me.params;
                    },
                    queueTask: {//不配置就不在任务队列里生成一项，通常都要配置
                        name: function () {
                            return '机构拓展员交易汇总';
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
                gid: 'orgExploreSum-grid',
                url: url._('report.brh.expand'),
                colNames: {
                    id: '',
                    expandId: reportLang._('report.expand.id'),//拓展员Id
                    expandName: reportLang._('report.expand.name'),//所属拓展员名
                    mchtKind: reportLang._('report.mcht.kind'),//商户类型
                    amt: reportLang._('report.amt'),//交易金额
                    total: reportLang._('report.total'),//交易笔数
                    feeAmt: reportLang._('report.fee.amt')//商户手续费
                },

                responsiveOptions: {
                    hidden: {
                        ss: ['mchtKind','total','feeAmt'],
                        xs: ['mchtKind','total','feeAmt'],
                        sm: ['mchtKind'],
                        md: [],
                        ld: []
                    }
                },

                colModel: [
                    {name: 'id', hidden: true},
                    {name: 'expandId', hidden: true,viewable: false},//拓展员Id
                    {name: 'expandName'},//所属拓展员名
                    {name: 'mchtKind'},//商户类型
                    {name: 'amt'},//交易金额
                    {name: 'total'},//交易笔数
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