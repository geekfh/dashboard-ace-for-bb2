define([
    'app/oms/notice-mgr/AbstractNoticeFormView'
], function(AbstractNoticeFormView) {

    var View = AbstractNoticeFormView.extend({

        btnSubmitText: '发送',

        ajaxOptions: {
            url: url._('mgr.notices'),
            type: 'POST'
        },

        onSubmitClick: function () {
            var me = this;
            
            var targetInfo = this.getTargetOptionInfo();
            Opf.confirm('发送成功后不能修改 收件人，确定接收人为: ' + targetInfo.text + '?', function (result) {
                result && AbstractNoticeFormView.prototype.onSubmitClick.apply(me, arguments);
            });
        }

    });
    
    return View;
});