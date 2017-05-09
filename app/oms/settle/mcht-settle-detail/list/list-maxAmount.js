/**
 * Created by wupeiying on 2015/11/6.
 */

define(['App',
    'jquery.jqGrid',
    'jquery.validate'
], function(App) {

    var tableCtTpl = [
        '<div class="row">',
        '<div class="col-xs-12 jgrid-container">',
        '<table id="max-amount-grid-table"></table>',
        '<div id="max-amount-grid-pager" ></div>',
        '</div>',
        '</div>'].join('');

    var RESULTFLAG_MAP = {
        6:'初始化信息',
        5:'已拆分批次',
        4:'提交请求',
        3:'入账受理成功',
        2:'超时',
        1:'入账失败',
        0:'入账成功'
    };

    var View = Marionette.ItemView.extend({
        template: _.template(tableCtTpl),
        tabId: 'menu.maxAmount.management',
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
                title: '大额拆分列表',
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
                rsId: 'maxAmount',
                caption: '',
                nav: {
                    actions: {
                        search: false,
                        add: false
                    }
                },
                actionsCol: {
                    view: false,
                    edit: false,
                    del: false
                },
                gid: 'max-amount-grid',
                url: url._('mcht.settle.details.list',{id:me.options.id}),
                // postData: {id: me.options.id},
                colNames: {
                    settleAmt   : '清算金额',
                    acctNo      : '清算卡号',
                    accountName : '户名',
                    payTime     : '付款时间',
                    zbankNo     : '开户支行',
                    zbankName   : '开户支行',
                    resultFlag  : '状态'
                },
                colModel: [
                    {name : 'settleAmt'},
                    {name : 'acctNo'},
                    {name : 'accountName'},
                    {name : 'payTime', formatter: dateFormatter},
                    {name : 'zbankNo'},
                    {name : 'zbankName'},
                    {name : 'resultFlag', formatter: resultFlagFormatter}
                ],
                loadComplete: function () {}
            });

            return grid;
        }
    });

    function resultFlagFormatter(val){
        return RESULTFLAG_MAP[val] || '';
    }

    function dateFormatter(val) {
        return val ? moment(val, 'YYYYMMDDHHmm').format('YYYY/MM/DD HH:mm') : '';
    }

    return View;
});