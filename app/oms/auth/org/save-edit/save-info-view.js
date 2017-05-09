define([
    'app/oms/auth/org/common/sub/info-view',
    'app/oms/auth/org/edit/edit-info-view'

], function (AbstractInfoView, EditInfoView) {
    var View = EditInfoView.extend({
        /**
         * 编辑保存的机构任务时，doSetupUI方法与updateUI应该符合新增机构中的逻辑
         * 但是，编辑保存的机构任务时就不需要再填写验证码了
         */
        doSetupUI: function () {
            AbstractInfoView.prototype.doSetupUI.apply(this, arguments);
            this.$el.find('.verify-group').hide();
        },
        updateUI: function () {
            AbstractInfoView.prototype.updateUI.apply(this, arguments);
        }
    });

    return View;

});