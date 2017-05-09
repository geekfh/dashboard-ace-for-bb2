/**
 * 外卡商户进件补充资料
 */
define([
    'app/oms/mcht/add/sub/extra-view'
], function(ExtraView) {
    var _onRender = ExtraView.prototype.onRender;

    return ExtraView.extend({
        onRender: function(){
            _onRender.call(this, arguments);
            this.filterExtra();
        },
        filterExtra: function(){
            //去掉收银员
            //去掉上传照片
            var $form = this.ui.form;
            var cashier_section = $form.find('div.section[data-section="cashier"]');
            var uploader_section = $form.find('div.section[data-section="uploader"]');
            cashier_section.remove();
            uploader_section.remove();
        }
    });
});