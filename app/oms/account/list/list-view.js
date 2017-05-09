/**
 * Created by wupeiying on 2015/9/11.
 */
define(['App',
    'jquery.jqGrid',
    'jquery.validate'
], function(App) {

    //App.module('AccountApp.List.View', function (View, App, Backbone, Marionette, $, _) {

        var tableCtTpl = [
            '<div class="row">',
            '<div class="col-xs-12 jgrid-container">',
            '<table id="account-info-grid-table"></table>',
            '<div id="account-info-grid-pager" ></div>',
            '</div>',
            '</div>'].join('');

        var USERSTATUS_MAP = {
            1:'商户',
            2:'地推',
            3:'代理商'
        };

        var View = Marionette.ItemView.extend({
            template: _.template(tableCtTpl),
            tabId: 'menu.accountInfo.management',
            events: {},

            onRender: function () {
                var me = this;
                _.defer(function () {
                    me.renderGrid();
                });
            },
            showDialog: function(){
                var $dialog = Opf.Factory.createDialog(this.$el, {
                    dialogClass: 'ui-jqdialog',
                    open: true,
                    destroyOnClose: true,
                    width: '60%',//1250
                    height: '10%',//600
                    modal: true,
                    title: '用户信息查询',
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
                    rsId: 'accountInfo',
                    caption: '',
                    nav: {
                        actions: {
                            search: false,
                            add: false
                        }
                    },
                    filters: [
                        {
                            caption: '用户查询',
                            defaultRenderGrid: 'important',
                            canClearSearch: true,
                            components: [
                                {
                                    label: '用户类型',
                                    name: 'userType',
                                    type: 'select',
                                    options: {
                                        sopt: ['eq'],
                                        value: USERSTATUS_MAP
                                    }
                                },
                                {
                                    label: '手机号',
                                    name: 'userPhone',
                                    type: 'text',
                                    inputmask: {
                                        integer: true
                                    },
                                    options: {
                                        sopt: ['eq']
                                    }
                                },
                                {
                                    label: '用户名称',
                                    name: 'userName',
                                    type: 'text'
                                },
                                {
                                    label: '用户编号',
                                    name: 'id',
                                    inputmask: {
                                        integer: true
                                    },
                                    options: {
                                        sopt: ['eq']
                                    }
                                }
                            ],
                            searchBtn: {
                                text: '搜索'
                            }
                        }
                    ],
                    actionsCol: {
                        view: false,
                        edit: false,
                        del: false,
                        extraButtons: [
                            {
                                name: 'accountView', icon: '', title: '查看账户', caption: '查看账户',
                                click: function (name, opts, rowData) {
                                    Opf.ajax({
                                        type: 'GET',
                                        data: {
                                            id: rowData.id,
                                            userType: rowData.userType,
                                            size: 10,
                                            number:0
                                        },
                                        url: url._('account.config.list'),
                                        success: function (data) {
                                            if(data.content.length > 0){
                                                me.$el.dialog('close');
                                                App.trigger('account:config:list', { userType: rowData.userType, id: rowData.id });
                                            }
                                            else{
                                                Opf.alert(data.msg);
                                            }
                                        }
                                    });
                                }
                            }
                        ]
                    },
                    gid: 'account-info-grid',
                    url: url._('account.info.list'),
                    colNames: {
                        id: '用户编号',
                        userName: '用户名称',
                        userType: '用户类型',
                        userStatus: '用户状态',
                        userPhone: '账户手机号'
                    },
                    colModel: [
                        {name: 'id', index: 'id', editable: false, search: true},
                        {name: 'userName', index: 'userName', editable: true},
                        {name: 'userType', index: 'userType', editable: true, search: true ,formatter: statusFormatter},
                        {name: 'userStatus', index: 'userStatus', editable: true},
                        {name: 'userPhone', index: 'userPhone', editable: true}
                    ],
                    loadComplete: function () {}
                });

                return grid;
            }
        });
    //});

    function statusFormatter(val){
        return USERSTATUS_MAP[val] || '';
    }

    //return App.AccountApp.List.View;

    //App.on('account:info:list', function () {
    //    App.show(new View());
    //});

    return View;
});