/**
 * Created by wupeiying on 2015/9/14.
 */
define(['App',
    'jquery.jqGrid',
    'jquery.validate'
], function(App) {

    var tableCtTpl = [
        '<div class="row">',
        '<div class="col-xs-12 jgrid-container">',
        '<table id="account-bind-grid-table"></table>',
        '<div id="account-bind-grid-pager" ></div>',
        '</div>',
        '</div>'].join('');

    var CARDTYPE_MAP = {
        0:'公',
        1:'私'
    };

    var CATAGORY_MAP = {
        0:'借记卡',
        1:'贷记卡',
        2:'准贷记卡'
    };

    var FLAG_MAP = {
        0:'不是',
        1:'是'
    };

    var STATUS_MAP = {
        1: '正常',
        2: '停用',
        3: '注销'
    };

    var View = Marionette.ItemView.extend({
        template: _.template(tableCtTpl),
        tabId: 'menu.bindAccount.management',
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
                title: '绑定卡管理',
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
                rsId: 'bindAccount',
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
                            name: 'changeStatus', icon: 'icon-opf-state-change', title: '状态变更',
                            click: function (name, opts, rowData) {
                                showChangeStatusDialog(grid, rowData);
                            }
                        }
                    ]
                },
                gid: 'account-bind-grid',
                url: url._('account.bind.list'),
                postData: {id: me.options.id},
                colNames: {
                    id			:   '',
                    cardId		:	'编号',//银行卡编号
                    cardNo 		:	'银行卡号',
                    cardType    :  	'对公/对私',//0 公、1私
                    bussName	:	'业务类型',
                    catagory	:	'卡类型',  //0：借记卡，1：贷记卡，2：准贷记卡
                    defaultFlag	:   '是否默认卡',//（1:是，0：不是）
                    status		:	'状态',//（1：正常。2：停用，3：注销）
                    userName	:	'开户名',
                    bankName	:   '银行名',
                    branchName  :   '开户支行名称',
                    bindTime	:	'绑定时间',
                    btime	    :	'绑定时间'
                },
                colModel: [
                    {name:'id',         index:'id',         hidden: true, editable: false},
                    {name:'cardId',     index:'cardId',     width: 50, editable: false},
                    {name:'cardNo',     index:'cardNo',     editable: false},
                    {name:'cardType',   index:'cardType',   editable: false, width:100, formatter: cardtypeFormatter},
                    {name:'bussName',   index:'bussName',    editable: false},
                    {name:'catagory',   index:'catagory',   editable: false, formatter: catagoryFormatter},
                    {name:'defaultFlag',index:'defaultFlag',editable: false, formatter: flagFormatter},
                    {name:'status',     index:'status',     editable: false, formatter: statusFormatter},
                    {name:'userName',   index:'userName',   editable: false},
                    {name:'bankName',   index:'bankName',   editable: false},
                    {name:'branchName', index:'branchName', editable: false},
                    {name:'bindTime',   index:'bindTime',   editable: false, hidden: true},
                    {name:'btime',   index:'btime',   editable: false, formatter: dateFormatter}
                ],
                loadComplete: function () {}
            });

            return grid;
        }
    });

    function showChangeStatusDialog(grid, rowData) {
        var $dialog = Opf.Factory.createDialog(statusFormTpl(rowData), {
            destroyOnClose: true,
            title: '状态变更',
            autoOpen: true,
            width: 300,
            height: 170,
            modal: true,
            buttons: [{
                type: 'submit',
                click: function () {
                    var $state = $(this).find('[name="state"]');
                    var oldState = rowData.status;
                    var newState = $state.val();
                    var selSateTxt = $state.find('option:selected').text();
                    if (oldState != newState) {
                        //标识为  1：正常；2：停用；3：注销
                        Opf.confirm('您确定更改卡状态为 "' + selSateTxt + '" 吗？<br><br> ', function (result) {
                            if (result) {
                                //TODO block target
                                Opf.ajax({
                                    type: 'PUT',
                                    jsonData: {
                                        id: rowData.id,
                                        status: newState
                                    },
                                    url: url._('account.bind.status.edit'),
                                    successMsg: '变更成功！',
                                    success: function () {
                                        grid.trigger('reloadGrid', {current: true});
                                    },
                                    complete: function () {
                                        $dialog.dialog('close');
                                    }
                                });
                            }
                        });
                    }
                    else {
                        $(this).dialog('close');
                    }
                }
            }, {
                type: 'cancel'
            }],
            create: function () {
                $(this).find('[name="state"]').val(rowData.status);
            }
        });
    }

    function statusFormTpl() {
        var str = [
            '<form onsubmit="return false;" style="padding-top:12px;">',
            '<table width="100%" cellspacing="0" cellpadding="0" border="0">',
            '<tbody>',
            '<tr class="FormData">',
            '<td class="CaptionTD">卡状态:</td>',
            '<td class="DataTD">',
            '&nbsp;',
            '<select role="select" name="state" class="FormElement ui-widget-content ui-corner-all">',
            '<option value="1">正常</option>',
            '<option value="2">停用</option>',
            '<option value="3">注销</option>',
            '</select>',
            '</td>',
            '</tr>',
            '</tbody>',
            '</table>',
            '</form>',
        ].join('');

        return str;
    }

    function cardtypeFormatter(val){
        return CARDTYPE_MAP[val] || '';
    }

    function catagoryFormatter(val){
        return CATAGORY_MAP[val] || '';
    }

    function flagFormatter(val){
        return FLAG_MAP[val] || '';
    }

    function statusFormatter(val){
        return STATUS_MAP[val] || '';
    }

    function dateFormatter(val) {
        return val ? moment(val, 'YYYYMMDDHHmm').format('YYYY/MM/DD HH:mm') : '';
    }

    return View;
});