/**
 * Created by wupeiying on 2015/11/5.
 */
define([
    'tpl!app/oms/message/customer-sms/table-ct.tpl',
    'tpl!app/oms/message/customer-sms/smsConfig.tpl',
    'jquery.jqGrid',
    'common-ui'
], function (tpl, smsConfigTpl) {

    var STATUS_MAP = {
        1:'成功',
        2:'失败',
        3:'失败'
    };

    var View = Marionette.ItemView.extend({
        template: tpl,
        tabId: 'menu.customer.sms.list',
        onRender: function () {
            var me = this;
            _.defer(function () {
                me.renderGrid();
            });
        },
        renderGrid: function () {
            var me = this;
            var grid = this.grid = App.Factory.createJqGrid({
                rsId: 'customerSms',
                caption: '',
                gid: 'message-customersms-grid',
                url: url._('message.customer.sms'),
                actionsCol: {
                    edit : false,
                    del: false
                },
                nav: {
                    actions: {
                        add: false
                    }
                },
                colNames: {
                    id: '',
                    pushDate : '发送时间',
                    topic : '发送标题',
                    content : '发送内容',
                    status : '发送状态',
                    phone : '电话号码',
                    oprName : '操作人'
                },
                colModel: [
                    {name: 'id', hidden: true},
                    {name: 'pushDate', formatter: dateFormatter}, //发送时间
                    {name: 'topic'},    //发送标题
                    {name: 'content'},  //发送内容
                    {name: 'status', formatter: statusFormatter},   //发送状态
                    {name: 'phone'},    //电话号码
                    {name: 'oprName'}   //操作人
                ],
                loadComplete: function(data) {}
            });

            _.defer(function () {
                Opf.Grid.availNavButtonAdd(me.grid, {caption: '短信发送配置', name: "smsConfig", title:'短信发送配置', buttonicon: '',
                    onClickButton: function() {
                        me.showSmsConfigDialog();
                    }
                });
                Opf.Grid.availNavButtonAdd(me.grid, {caption: '短信模板配置', name: "templateConfig", title:'短信模板配置', buttonicon: '',
                    onClickButton: function() {
                        me.showTemplateConfigDialog();
                    }
                });
            });

            return grid;
        },

        showSmsConfigDialog: function(){
            var me = this;
            var $dialog = Opf.Factory.createDialog(smsConfigTpl(), {
                destroyOnClose: true,
                title: '客服人员短信发送配置',
                autoOpen: true,
                width: 650,
                height: 300,
                modal: true,
                buttons: [{
                    type: 'submit',
                    click: function () {
                        var houseSMS = $(this).find('#txt-houseSMS').val();
                        var daySMS = $(this).find('#txt-daySMS').val();
                        var mchtSMS = $(this).find('#txt-mchtSMS').val();

                        if(houseSMS == '' && (daySMS == '' || mchtSMS == '')){
                            CommonUI.loadError($(this), '每小时可发送短信条数为空，三项需选一项填写，请重新输入.');
                            return false;
                        }
                        else if(daySMS == '' && (houseSMS == '' || mchtSMS == '')){
                            CommonUI.loadError($(this), '每天可发送信息条数，三项需选一项填写，请重新输入.');
                            return false;
                        }
                        else if(daySMS == '' && (houseSMS == '' || mchtSMS == '')){
                            CommonUI.loadError($(this), '对同一商户可发送信息条数，三项需选一项填写，请重新输入.');
                            return false;
                        }
                        else{
                            CommonUI.loadCleanError($(this), '');
                        }

                        var params = {houseSMS: houseSMS, daySMS: daySMS, mchtSMS: mchtSMS};
                        Opf.ajax({
                            type: 'PUT',
                            url: url._('message.customer.smsConfig'),
                            jsonData: params,
                            success: function () {
                                Opf.Toast.success('操作成功');
                                $dialog.dialog('close');
                                $(me.grid).trigger("reloadGrid", [{current:true}]);
                            }
                        });
                    }
                }, {
                    type: 'cancel'
                }]
            });
            Opf.ajax({
                type: 'GET',
                url: url._('message.smsConfig.getLimit'),
                success: function (data) {
                    $dialog.find('#txt-houseSMS').val(data.houseSMS);
                    $dialog.find('#txt-daySMS').val(data.daySMS);
                    $dialog.find('#txt-mchtSMS').val(data.mchtSMS);
                }
            });
        },

        showTemplateConfigDialog: function(){
            require(['app/oms/message/customer-sms/list-templateConfig'], function(View){
                var maxAmountView = new View().render();
                maxAmountView.showDialog(maxAmountView);
                maxAmountView.$el.on('reloadParentGrid',function(){
                    me.grid.trigger('reloadGrid');
                });
            });
        }
        
    });

    function statusFormatter(val){
        return STATUS_MAP[val] || '';
    }

    function dateFormatter(val) {
        return val ? moment(val, 'YYYYMMDDHHmm').format('YYYY/MM/DD HH:mm') : '';
    }

    App.on('msg:customer:sms', function () {
        App.show(new View());
    });

    return View;

});