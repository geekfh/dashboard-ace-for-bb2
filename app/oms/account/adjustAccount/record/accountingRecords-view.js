/**
 * Created by wupeiying on 2015/12/1.
 */

define(['App',
    'tpl!app/oms/account/adjustAccount/record/adjustTemplate.tpl',
    'jquery.jqGrid',
    'jquery.validate'
], function(App, adjustTpl) {

    var tableCtTpl = [
        '<div class="row">',
        '<div class="col-xs-12 jgrid-container">',
        '<table id="account-record-grid-table"></table>',
        '<div id="account-record-grid-pager" ></div>',
        '</div>',
        '</div>'].join('');

    var View = Marionette.ItemView.extend({
        template: _.template(tableCtTpl),
        tabId: 'menu.accountRecord.management',
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
                title: '调账',
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
                rsId: 'accountRecord',
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
                    del: false,
                    extraButtons: [
                        {
                            name: 'addAdjust', icon: '', title: '调账', caption: '调账',
                            click: function (name, opts, rowData) {
                                addDialog(me, rowData, me.options.custType, me.options.tradeType, me.options.custNo);
                            }
                        }
                    ]
                },
                gid: 'account-record-grid',
                url: url._('adjust.account.record.list', {tradeNo: me.options.tradeNo}),
                //postData: {tradeNo: me.options.tradeNo},
                colNames: {
                    id: '',
                    accountingId: '账务流水编号',
                    accountingNo: '账务流水号',
                    workDate: '账务日期',
                    subjectName: '科目名称',
                    amount:'金额'
                },
                colModel: [
                    {name: 'id', hidden: true},
                    {name: 'accountingId', hidden: true},
                    {name: 'accountingNo', hidden: true},
                    {name: 'workDate', formatter: dateFormatter},
                    {name: 'subjectName'},
                    {name: 'amount'}
                ],
                loadComplete: function () {}
        });

    return grid;
}
});

function addDialog(me, rowData, custType, tradeType, custNo){
    var $dialog = Opf.Factory.createDialog(adjustTpl({data: rowData, userType: custType, tradeType: tradeType, custNo: custNo}), {
        destroyOnClose: true,
            title: '调账',
            autoOpen: true,
            width: 500,
            height: 600,
            modal: true,
            buttons: [{
            type: 'submit',
            click: function () {
                var tradeNo = rowData.accountingNo;//$(me).find('#txt-tradeNo').val();//accountingNo对应的是调账tradeNo，账务流水号
                var userType = custType;//$(me).find('#txt-userType').val();
                var userId = custNo;//$(me).find('#txt-userId').val();
                var amount = $(this).find('#txt-after-amount').val();
                var tradeTypeName = $(this).find('#sl-tradeType').find('option:selected').text();
                //var subjectName = rowData.subjectName;//$(me).find('#txt-subjectName').val();
                //var tradeType = tradeType;//$(me).find('#sl-tradeType').val();
                Opf.ajax({
                    type: 'POST',
                    url: url._('adjust.account.list'),
                    async: false,
                    jsonData: {
                    "tradeNo": rowData.accountingId,
                    "amount": amount,
                    "userType": userType,
                    "userId": userId,
                    "tradeType": tradeType,
                    "tradeTypeName": tradeTypeName
                    },
                    success: function(resp){
                        if(resp.success){
                            me.$el.dialog('destroy');
                            $dialog.dialog("close");
                            Opf.Toast.success('新增成功.');
                        }
                        else{
                            Opf.Toast.success('新增失败.');
                        }
                    }
                });
            }}, {type: 'cancel'}]
    });
    $dialog.find('#txt-after-amount').focus();
}

function dateFormatter(val) {
    return val ? moment(val, 'YYYYMMDDHHmm').format('YYYY/MM/DD HH:mm') : '';
}
return View;
});