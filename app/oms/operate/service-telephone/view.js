define(['App', 'AppConf',
    'tpl!app/oms/operate/service-telephone/templates/crm.tpl',
    'app/oms/operate/service-telephone/alert-view',
    'jquery.validate',
    'moment.override'
], function(App, AppConf, tpl, AlertView){
    var gui, that, agentNumber;

    return Marionette.ItemView.extend({
        tabId: 'menu.operate.serviceTelephone',
        template: tpl,

        ui: {
            hotLine: '#hotLine',
            cno: '#cno',
            pwd: '#pwd',
            bindTel: '#bindTel',
            bindType: '#bindType',
            initStatus: '#initStatus',

            crm_params_form: '#crm_params_form',
            crm_toolbar_iframe: '#crm_toolbar_iframe',

            btnLogin: '#crm_btn_login',
            btnLogout: '#crm_btn_logout'
        },

        executeAction: function(actionName, actionParams){
            this.ui.crm_toolbar_iframe[0].contentWindow.executeAction(actionName, actionParams);
        },

        serializeData: function () {
            var me = this;
            return {
                events: me.crm_cb
            };
        },

        crm_cb: _.extend({}, AppConf.ccic2, {
            //登录回调
            cbLogin: function(token){
                var ui = gui;
                if(token.code == "0"){
                    //登录成功
                    ui.btnLogin.text('已登录');
                    ui.btnLogout.prop('disabled', false).text('退出');
                } else {
                    Opf.alert("登录失败: " + token.msg);
                    ui.btnLogin.prop('disabled', false).text('登录');
                }
            },

            //退出回调
            cbLogout: function(token){
                var ui = gui;
                if(token.code == "0"){
                    ui.crm_toolbar_iframe[0].src = 'third-party/crm/simple/toolbarIframe.html?type=bs';
                    ui.btnLogout.text('已退出');
                    ui.btnLogin.prop('disabled', false).text('登录');
                } else {
                    Opf.alert("退出失败: " + token.msg);
                    ui.btnLogout.prop('disabled', false).text('退出');
                }
            },

            //挂断回调
            cbUnLink: function(token){
                that.crm_dialog.dialog('destroy');

                if(token.code && token.code !== "0"){
                    var linkStatus = {
                        "2": "连接已中断",
                        "5": "没有正确拿到此座席外呼的channel"
                    };
                    Opf.alert({
                        title: linkStatus[token.code],
                        message: token.msg||"未知错误"
                    });
                }
            },

            //状态响应
            cbThisStatus: function (token){
                if(token.cno == agentNumber){
                    /**
                     * callType：
                     * 1：呼入，
                     * 2：网上400,
                     * 3：点击外呼，
                     * 4：预览外呼，
                     * 5：IVR外呼，
                     * 6：分机直接外呼
                    */

                    //呼入响铃
                    if(token.eventName == "comeRinging"&&token.name == "ringing"){
                        that.crm.doAlert(token);
                    }

                    //客户挂断，整理开始：呼入、空闲时外呼
                    if(token.eventName == "neatenStart"){
                        that.crm.doUnLink(token);
                    }
                }
            }
        }),

        crm: {
            //校验参数
            doValidate: function(){
                gui.crm_params_form.validate({
                    rules: {
                        hotLine: { required: true, number:true },
                        cno: { required: true, number:true },
                        pwd: { required: true },
                        bindTel: { required: true, tel:true }
                    }
                });
            },

            //弹屏
            doAlert: function(token){
                var alertView = new AlertView(token);
                var alertTpl = alertView.render().$el;

                var $crm_dialog = that.crm_dialog = Opf.Factory.createDialog(alertTpl, {
                    title: '商户来电：'+token.customerNumber,
                    destroyOnClose: true,
                    width: 880,
                    height: 500,
                    modal: false,
                    buttons: [{
                        type: 'cancel',
                        text: '关闭'
                    }]
                });
            },

            //登录
            doLogin: function(){
                var ui = gui, params = {};

                params.hotLine = ui.hotLine.val();
                params.cno = agentNumber = ui.cno.val();
                params.pwd =  ui.pwd.val();
                params.bindTel = ui.bindTel.val();
                params.bindType = ui.bindType.val();
                params.initStatus = ui.initStatus.val();

                if(!ui.crm_params_form.validate().form()) return;

                ui.btnLogin.prop('disabled', true).text('正在登录...');
                that.executeAction('doLogin', params);
            },

            //退出
            doLogout: function(){
                var ui = gui, params = {};

                params.type = "1";
                params.removeBinding = "1";

                ui.btnLogout.prop('disabled', true).text('正在退出...');
                that.executeAction('doLogout', params);
            },

            //挂断
            doUnLink: function(token) {
                that.crm_cb.cbUnLink(token);
            }
        },

        onRender: function () {
            var me = that = this;
            var ui = gui = this.ui;

            me.crm.doValidate();

            ui.btnLogin.on('click', me.crm.doLogin);
            ui.btnLogout.on('click', me.crm.doLogout);
        }
    });

});