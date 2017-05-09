define([
    'tpl!assets/scripts/fwk/main/templates/toolMenu.tpl'
], function(headerTpl) {

    return Marionette.ItemView.extend({
        tagName: 'ul',

        className: 'nav ace-nav no-border',

        template: headerTpl,

        ui: {
            tbr_psw: '#tbr-psw',
            tbr_logout: '#tbr-logout',
            tbr_submodule_txt: '#tbr-submodule',
            tbr_submodule: 'a[data-module]'
        },

        events: {
            'click @ui.tbr_psw': '_modifyPsw',
            'click @ui.tbr_logout': '_logout',
            'click @ui.tbr_submodule': '_submodule'
        },

        initialize: function(options) {
            this.user = options.user||{};
            this.submodules = options.submodules||[];

            //设置OMS为默认系统
            _.each(this.submodules, function(submodule){
                submodule.isDefault = (submodule.serviceName == "oms");
            })
        },

        serializeData: function() {
            return {
                user: this.user,
                submodules: this.submodules
            }
        },

        /**
         * 修改密码
         */
        _modifyPsw: function(evt) {
            evt.preventDefault();
            require(['assets/scripts/fwk/entry/repair-password'], function () {
                App.trigger('toChangePsw');
            });
        },

        /**
         * 退出登录
         */
        _logout: function() {
            $.ajax({
                cache: false,
                url: url._('fwk.logout'),
                type: 'GET',
                success: function(resp) {
                    if (resp.success) {
                        window.location = Ctx.getLoginHtml() || 'login.html';
                    }
                }
            });
        },

        /**
         * 切换子模块
         * @param evt
         * @private
         */
        _submodule: function(evt) {
            var $target = $(evt.currentTarget || evt.target);
            var moduleName = $target.attr('data-module');
            var moduleTxt = $target.text();
            var modulePath = 'app/' + moduleName + '/module-main';

            // 切换模块
            this.ui.tbr_submodule_txt.text(moduleTxt);

            App.loadModule(modulePath);
        },

        onRender: function() {
            this.$el.prop("id", "notify-boxes");

            // 设置默认加载模块
            this.ui.tbr_submodule.filter('[data-default="true"]').trigger('click');
        }
    })

});