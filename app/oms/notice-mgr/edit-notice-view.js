define([
    'app/oms/notice-mgr/AbstractNoticeFormView'
], function(AbstractNoticeFormView) {

    var NoticeEditView = AbstractNoticeFormView.extend({

        btnSubmitText: '更新',

        ajaxOptions: function () {
            return {
                url: url._('mgr.notices', {id: this.model.id}),
                type: 'PUT'
            };
        },

        updateModel: function (model) {
            var me = this, 
                content;

            this.model = model;

            this.reset();

            content = this.model.get('content');
            this.setEverUploadImages(getEverUploadImages(content));

                // var $iframe = $('iframe.cke_wysiwyg_frame', me.ckEditor.element.$);
                // $iframe.hide();
            this.on('editor:ready', function(){
                me.ckEditor.setData(content);
                me.ckEditor.fire('change');
            });
                
                // _.delay(function () {
                //     $iframe.show();
                // });


            this.updateTarget(this.model.get('target'));
            this.updateSubject(this.model.get('subject'));

            this.uploadView.addAttachments(this.model.get('attachments'));
            this.setTargetBrhValues(this.model.get('branches'));
        },

        onRender: function() {
            var me = this;

            AbstractNoticeFormView.prototype.onRender &&
                AbstractNoticeFormView.prototype.onRender.apply(this, arguments);

            this.disableTargetSelect();

        },

        /**
         * destroy 直接把 ckEditor 删除掉，不用重置输入
         */
        onSubmitSuccess: function () {
            this.triggerMethod('back');
        },

        onBack: function(){
            this.destroy();
        }

    });

    function getEverUploadImages (content) {
        var match = content.match(/<img[^>]*?is-local[^>]*?>/g);
        var urls = _.map(match, function (img) {
            return $(img).attr('src');
        });
        return urls;
    }

    return NoticeEditView;
});