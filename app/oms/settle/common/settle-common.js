/**
 * Created by wupeiying on 2015/12/23.
 */
define(['App',
    'jquery.jqGrid'
], function(App) {

    var tableCtTpl = [
        '<div class="row">',
        '<div class="col-xs-12 jgrid-container">',
        '<table id="settle-history-grid-table"></table>',
        '<div id="settle-history-grid-pager" ></div>',
        '</div>',
        '</div>'].join('');

    var RESULTFLAG_MAP = {
        0: '入账成功',
        1: '入账失败',
        2: '出款中'
    };

    var View = Marionette.ItemView.extend({
        template: _.template(tableCtTpl),
        tabId: 'menu.settleHistory.list',
        events: {},
        onRender: function () {
            var me = this;
            _.defer(function () {
                me.renderGrid();
            });
        },
        showDialog: function(){
            Opf.Factory.createDialog(this.$el, {
                dialogClass: 'ui-jqdialog',
                open: true,
                destroyOnClose: true,
                width: 1250,
                height: 600,
                modal: true,
                title: '出款历史记录',
                buttons: [{
                    type: 'cancel',
                    text: '关闭'
                }]
            });
            $('.ui-jqdialog-content').attr("style","overflow-x:hidden!important;");
        },
        renderGrid: function () {
            var me = this;

            var grid = App.Factory.createJqGrid({
                rsId: 'settleHistory',
                caption: '',
                nav: {
                    actions: {
                        search: false,
                        add: false,
                        refresh: false
                    }
                },
                actionsCol: {
                    edit: false,
                    del: false,
                    view: false
                },
                gid: 'settle-history-grid',
                url: url._('settle.txns.payRecords', {id: me.options.id}),
                colNames: {
                    id:'',
                    txnId: '清算流水表ID',
                    acctNo: '卡号',
                    acctName: '账户名',
                    resultFlag: '出款结果',// 0、入账成功 1、入账失败 2、出款中
                    oprId: '操作人ID',
                    oprName: '操作人',
                    payTime: '付款时间',
                    retMsg: '响应信息',
                    zbankNo: '支行号',
                    zbankName: '支行名'
                },
                colModel: [
                    {name: 'id', hidden:true},
                    {name: 'txnId', hidden:true},
                    {name: 'acctNo'},
                    {name: 'acctName'},
                    {name: 'resultFlag', formatter: function(val){ return RESULTFLAG_MAP[val]; }},// 0、入账成功 1、入账失败 2、出款中
                    {name: 'oprId', hidden:true},
                    {name: 'oprName'},
                    {name: 'payTime'},
                    {name: 'retMsg'},
                    {name: 'zbankNo', hidden:true},
                    {name: 'zbankName'}
                ],
                loadComplete: function () {}
            });

            return grid;
        }
    });

    return View;
});