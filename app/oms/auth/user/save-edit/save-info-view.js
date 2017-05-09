define([
    'app/oms/auth/user/common/info-view',
    'app/oms/auth/user/edit/edit-info-view'
], function (InfoView, EditView) {
    var view = EditView.extend({
        doSetupUI: function () {
            var me = this;
            var ui = this.ui;
            var data = this.data;
            this.$el.find(':input').each(function(){
                var name = $(this).attr('name');
                $(this).val(data[name]);
            });
            CommonUI.roleGroup4User(ui.roleGroupId, data.roleGroupId, data.id);
            CommonUI.rule4User(ui.ruleId);
            this.checkUserPermission();
            //编辑保存任务去掉手机验证码
            ui.verifyGroup.remove();
            //编辑保存任务去掉菜单选择
            this.$el.find('.user-type-select').hide();
            //去掉登录名的查重验证
            _.defer(function(){
                me.adjustValidateRules();
            });
        },

        adjustValidateRules: function () {
            var data = this.data;
            this.ui.loginName.rules( "add", {
                checkLoginRepeat: {ignore: [data.loginName]}
            });
        }

    });

    return view;
});