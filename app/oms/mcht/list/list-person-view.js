define([
    'tpl!app/oms/mcht/list/templates/person-mchts.tpl',
    'jquery.jqGrid',
    'common-ui'
], function (tpl) {

    var SYNC_PERS_STATUS_MAP = {
        '0': '未同步',
        '1': '同步成功',
        '2': '账号非有效Email格式',
        '3': '验证码错误',
        '4': '账号已经存在',
        '5': '其他'
    },

    SEARCH_SYNC_PERS_STATUS_MAP = {
        '0': '未同步',
        '1': '同步成功',
        '4': '账号已经存在',
        '5': '其他'
    },

    STATUS_MAP = {
        '0': '正常',
        '1': '停用',
        '2': '注销',
        '3': '快捷商户暂存'
    },

    PRIMARY_MAP = {
        '0': '附加用户',
        '1': '主用户'
    };

    var View = Marionette.ItemView.extend({
        tabId: 'mcht.user.list',
        template: tpl,
        initialize: function () {},

        onRender: function () {
            var me = this;
            _.defer(function () {
                me.renderGrid();
            });
        },

        ajaxSynchronizationMcht: function (rowData) {
            var me = this;
            Opf.ajax({
                type: 'POST',
                url: url._('mchts.person', {id: rowData.id}),
                success: function (resp) {
                    Opf.Toast.success('操作成功');
                },
                complete: function () {
                    me.updateGrid();
                }
            });
        },

        loadRepeatPwdHandle: function (rowData){
            var me = this;
            var html = [
                '<div id="resetPwdView">',
                    '<div id="div_defaultPwd" style="padding: 10px 0 0 60px;">',
                        '<div class="checkbox" style="padding: 10px 0 0 30px;width: 150px;">',
                            '<label style="font-size:10px;">',
                            '<input id="defaultPwd" name="checkbox" type="checkbox" value="0" checked="true" /> 重置默认密码',
                            '</label>',
                        '</div>',
                        '<div id="div_newPwd" style="padding: 10px 0 0 10px;">',
                            '<span style="padding-right: 10px;">新密码:</span>',
                            '<input id="pd_newPwd" type="password" style="width: 160px;" disabled=true />',
                            '<input id="hd_pwd" type="hidden" />',
                        '</div>',
                    '</div>',
                    '<br>',
                '</div>'
            ].join('');

            var str_pwd = '123456';
            var $dialog = Opf.Factory.createDialog(html, {
                destroyOnClose: true,
                title: '重置密码',
                autoOpen: true,
                width: 350,
                modal: true,
                buttons: [{
                    type: 'submit',
                    text: '确定',
                    click: function () {
                        if($(this).find('#defaultPwd').attr('checked') != 'checked'){
                            str_pwd = $dialog.find('#pd_newPwd').val();
                        }
                        Opf.ajax({
                            type: 'PUT',
                            jsonData: {
                                id: rowData.id,
                                password: str_pwd
                            },
                            url: url._('mcht.user.reset.password'),
                            successMsg: '重置成功!',
                            success: function () {
                                me.trigger('reloadGrid', {current: true});
                            },
                            complete: function () {
                                $dialog.dialog('close');
                            }
                        });
                    }
                }, {
                    type: 'cancel'
                }]
            });

            $dialog.find('#defaultPwd').on('click', function(){
                if($(this).attr('checked') == 'checked'){//不隐藏
                    $(this).removeAttr('checked', 'true');
                    $('#pd_newPwd').removeAttr('disabled', true);
                }
                else{
                    $(this).attr('checked', 'true');
                    $('#pd_newPwd').attr('disabled', true);
                    $('#pd_newPwd').val('');
                }
            });
        },

        updateGrid: function () {
            var me = this;
            me.grid && $(me.grid).trigger("reloadGrid", [{current:true}]);
        },

        renderGrid: function () {
            var me = this;
            var grid = me.grid = App.Factory.createJqGrid({
                rsId:'person.mchts',
                caption: '人工商户',
                filters: [
                    {
                        caption: '商户查询',
                        canClearSearch: true,
                        components: [
                            {
                                label: '商户名称',
                                name: 'mchtNm'
                            },{
                                label: '商户编号',
                                name: 'mchtNo'
                            },{
                                label: '手机号码',
                                name: 'mobile'
                            },{
                                type: 'select',
                                label: '同步状态',
                                name: 'syncPersStatus',
                                options:{
                                    value: SEARCH_SYNC_PERS_STATUS_MAP
                                }
                            }
                        ],
                        searchBtn: {
                            text: '查询'
                        }
                    }
                ],
                actionsCol: {
                    edit: false,
                    del: false,
                    width: 150,
                    extraButtons: [
                        {
                            name: 'status', title: '修改用户状态', icon: 'icon-opf-state-change',
                            click: function(name, obj, rowData) {
                                var status = null;
                                if(rowData.mainUser){
                                    status = {
                                        '0': '正常',
                                        '1': '停用'
                                    };
                                }
                                else{
                                    status = STATUS_MAP;
                                }
                                var callBack = CommonUI.showStatusDialog(rowData.status, status);
                                callBack.parent().find('[type="submit"]').on('click', function (){
                                    var status = callBack.find('[name="status"]').val();
                                    Opf.ajax({
                                        type: 'PUT',
                                        url: url._('mchts.changeStatus.edit', {id: rowData.id}),
                                        jsonData: {
                                            id: rowData.id,
                                            status: status
                                        },
                                        success: function(resp){
                                            if(resp.success){
                                                Opf.Toast.success('修改成功.');
                                                me.grid.trigger('reloadGrid');
                                            }
                                        }
                                    });
                                });
                            }
                        },
                        {
                            name: 'synchronization', title:'同步', icon: 'icon-code-fork',
                            click: function(name, obj, rowData) {
                                me.ajaxSynchronizationMcht(rowData);
                            }
                        },
                        {
                            name: 'repeatPassword', title: '重置密码', icon: 'icon-key orange2',
                            click: function(name, obj, rowData){
                                me.loadRepeatPwdHandle(rowData);
                            }
                        }
                    ],
                    canButtonRender: function(name, opts, rowData) {
                        // 只要状态不是成功的状态都要显示同步按钮
                        if (name === 'synchronization' && rowData.syncPersStatus == 1) {
                            return false;
                        }
                        // status {Number}
                        // 0正常
                        // 1停用
                        // 2注销
                        var status = rowData.status;
                        if(name === 'repeatPassword' && status != 0){
                            return false;
                        }
                        if(name === 'status' && rowData.status == 2){
                            return false;
                        }
                    }
                },
                nav: {
                    actions:{
                        add: false,
                        search: false
                    }
                },
                gid: 'person-mchts-grid',
                url: url._('mchts.person'),
                colNames: {
                    id:             '',
                    mchtNo:         '商户编号',
                    mchtNm:         '商户名称',
                    mobile:         '手机号码',
                    mainUser:       '是否是主用户',
                    status:         '用户状态',
                    mchtUserNm:     '用户名称',
                    loginName:      '登录用户名',
                    regDate:        '注册日期',
                    syncPersStatus: '同步状态'
                },
                colModel: [
                    {name: 'id', hidden: true},
                    {name: 'mchtNo'},
                    {name: 'mchtNm'},
                    {name: 'mobile'},
                    {name: 'mainUser', formatter: function(val){ return val == true ? '主用户' : '附加用户'; }},
                    //{name: 'primary', formatter: primaryFormatter},
                    {name: 'status', formatter: statusFormatter},
                    {name: 'mchtUserNm'},
                    {name: 'loginName'},
                    {name: 'regDate'},
                    {name: 'syncPersStatus', formatter: syncPersStatusFormatter}
                ],
                loadComplete: function() {}
            });
        }
    });

    function syncPersStatusFormatter (val) {
        return SYNC_PERS_STATUS_MAP[val] || '';
    }

    function statusFormatter (val) {
        return STATUS_MAP[val] || '';
    }

    function primaryFormatter (val) {
        return PRIMARY_MAP[val] || '';
    }

    return View;
});