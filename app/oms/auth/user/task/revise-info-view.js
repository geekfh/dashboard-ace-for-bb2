define([
    'app/oms/auth/user/edit/edit-info-view'
], function(EditInfoView) {

   var View = EditInfoView.extend({
        initUpload: function () {
            var me = this;
            var ui = this.ui;
            var data = this.data;

            _.defer(function () {
                    me.initUploadView(ui.idCardFront, data.idCardFront);
                    me.initUploadView(ui.idCardBack, data.idCardBack);
                    me.initUploadView(ui.personWithIdCard, data.personWithIdCard);
                    me.initUploadView(ui.bankCard, data.bankCard);
            });
        },

        isTwoMoreBrh: function () {
            return this.data.brhLevel > 1;
        }

   });

    return View;
});