/**
 * Created by wupeiying on 2015/9/11.
 */
define(['App',
    'jquery.jqGrid',
    'jquery.validate'
], function(App) {

    var USER_MAP = {
        0:'普通账户',
        1:'企业账户'
    };

    var STATUS_MAP = {
        1:'正常',
        2:'停用',
        3:'锁定',
        4:'注销'
    };

    App.module('AccountApp.List.View', function (View, App, Backbone, Marionette, $, _) {

        var btSearchPer = Ctx.avail('accountInfo');

        var tableCtTpl = _.template([
            '<div class="row">',
            '<div class="hd_userSearch" style="padding:0 0 10px 12px;display: none;"><button class="btn btn-white bt_userSearch"><i class="icon-search"></i>用户信息查询</button></div>',
            '<div class="col-xs-12 jgrid-container">',
            '<table id="account-config-grid-table"></table>',
            '<div id="account-config-grid-pager" ></div>',
            '</div>',
            '</div>'].join(''));

        View.Config = Marionette.ItemView.extend({
            template: tableCtTpl,
            tabId: 'menu.accountConfig.management',
            events: {
                'click .bt_userSearch': 'onUserSearch'
            },
            //ui: {
            //    accountInfo: '.div_accountInfo'
            //},
            onRender: function () {
                var me = this;
                _.defer(function () {
                    me.renderGrid();
                });

                //判断用户信息查询功能 权限
                if(btSearchPer){
                    me.$el.find('.hd_userSearch').show();
                }
            },
            onUserSearch: function () {
                require(['app/oms/account/list/list-view'], function(configView){
                    var configView = new configView({}).render();
                    configView.showDialog(configView);
                    // configView.$el.on('reloadParentGrid',function(){
                    //     this.grid.trigger('reloadGrid');
                    // });
                });
            },
            renderGrid: function () {
                var me = this;
                var kw = me.options.kw;

                var grid = me.grid = App.Factory.createJqGrid({
                    rsId: 'accountConfig',
                    caption: '',
                    nav: {
                        actions: {
                            search: false,
                            add: false
                        }
                    },
                    actionsCol: {
                        edit: false,
                        del: false,
                        width: 130,
                        extraButtons: [
                            {
                                name: 'changeStatus', icon: 'icon-opf-state-change', title: '状态变更',
                                click: function (name, opts, rowData) {
                                    showChangeStatusDialog(grid, rowData);
                                }
                            },
                            {
                                name: 'bindAccountView', icon: 'icon-credit-card', title: '绑定卡管理',
                                click: function (name, opts, rowData) {
                                    require(['app/oms/account/list/bind/list-view'], function(bindView){
                                        var bindView = new bindView({ id: rowData.id }).render();
                                        bindView.showDialog(bindView);
                                        bindView.$el.on('reloadParentGrid',function(){
                                            me.grid.trigger('reloadGrid');
                                        });
                                    });
                                }
                            },
                            {
                                name: 'childAccountView', icon: 'icon-list', title: '子账户管理',
                                click: function (name, opts, rowData) {
                                    require(['app/oms/account/list/child/list-view'], function(childView){
                                        var childView = new childView({ id: rowData.id }).render();
                                        childView.showDialog(childView);
                                        childView.$el.on('reloadParentGrid',function(){
                                            me.grid.trigger('reloadGrid');
                                        });
                                    });
                                }
                            }
                        ]
                    },
                    gid: 'account-config-grid',
                    url: url._('account.config.list'),
                    postData: { userType: kw.userType, id: kw.id },
                    colNames: {
                        id              :   '',
                        accountNo       :   '账户编号',
                        accountName	    :   '账户名称',
                        accountType     :   '账户类型ID',//("0":普通账户;"1":企业账户)
                        accountTypeName :   '账户类型',//("0":普通账户;"1":企业账户)
                        accountStatus   :	'账户状态ID',
                        accountStatusName:	'账户状态',
                        lockType        :   '锁定类别',//(预留，暂时无用)
                        rmbAmount       :   '人民币总余额',
                        pointAmount     :   '积分总余额',
                        creditAmount    :	'信用总额度',
                        ctime	        :   '开户日期'
                    },
                    colModel: [
                        {name: 'id',index: 'id', editable: false, hidden:true},
                        {name: 'accountNo',index: 'accountNo', editable: false},
                        {name: 'accountName',index: 'accountName', editable: false},
                        {name: 'accountType',index: 'accountType', hidden: true, editable: false, formatter: userFormatter},
                        {name: 'accountTypeName',index: 'accountTypeName', editable: false},
                        {name: 'accountStatus',index: 'accountStatus', hidden: true, editable: false, formatter: statusFormatter},
                        {name: 'accountStatusName',index: 'accountStatusName', editable: false},
                        {name: 'lockType',index: 'lockType', editable: false, hidden: true},
                        {name: 'rmbAmount',index: 'rmbAmount', editable: false},
                        {name: 'pointAmount',index: 'pointAmount', editable: false},
                        {name: 'creditAmount',index: 'creditAmount', editable: false},
                        {name: 'ctime',index: 'ctime', editable: false, formatter: dateFormatter}
                    ],
                    loadComplete: function () {}
                });
            }
        });
    });

    function showChangeStatusDialog(grid, rowData) {
        var $dialog = Opf.Factory.createDialog(statusFormTpl(rowData), {
            destroyOnClose: true,
            title: '主账户状态变更',
            autoOpen: true,
            width: 300,
            height: 150,
            modal: true,
            buttons: [{
                type: 'submit',
                click: function () {
                    var $state = $(this).find('[name="state"]');
                    var oldState = rowData.accountStatus;
                    var newState = $state.val();
                    var selSateTxt = $state.find('option:selected').text();
                    if (oldState != newState) {
                        //标识为  1正常/2停用/3锁定/4注销
                        Opf.confirm('您确定更改主账户状态为 "' + selSateTxt + '" 吗？<br><br> ', function (result) {
                            if (result) {
                                //TODO block target
                                Opf.ajax({
                                    type: 'PUT',
                                    jsonData: {
                                        id: rowData.id,
                                        accountStatus: newState
                                        //oldStatus: oldState,
                                        //newStatus: newState
                                    },
                                    url: url._('account.config.status.edit'),
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
                $(this).find('[name="state"]').val(rowData.accountStatus);
            }
        });
    }

    function statusFormTpl() {
        var str = [
            '<form onsubmit="return false;" style="padding-top:12px;">',
            '<table width="100%" cellspacing="0" cellpadding="0" border="0">',
            '<tbody>',
            '<tr class="FormData">',
            '<td class="CaptionTD">主账户状态:</td>',
            '<td class="DataTD">',
            '&nbsp;',
            '<select role="select" name="state" class="FormElement ui-widget-content ui-corner-all">',
            '<option value="1">正常</option>',
            '<option value="2">停用</option>',
            '<option value="4">注销</option>',
            //'<option value="3">锁定</option>',
            '</select>',
            '</td>',
            '</tr>',
            '</tbody>',
            '</table>',
            '</form>',
        ].join('');

        return str;
    }

    function userFormatter(val){
        return USER_MAP[val] || '';
    }

    function statusFormatter(val){
        return STATUS_MAP[val] || '';
    }

    function dateFormatter(val) {
        return val ? moment(val, 'YYYYMMDDHHmm').format('YYYY/MM/DD HH:mm') : '';
    }

    return App.AccountApp.List.View;
});