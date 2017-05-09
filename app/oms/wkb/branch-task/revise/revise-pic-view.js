define(['App',
    'app/oms/auth/org/edit/edit-pic-view'
], function(App, EditPicView) {

    var PicView = EditPicView.extend({
        setExtraParams: function (options) {
            this.brhInfo = options.brhInfo;
            this.errorMark = options.errorMark;
        },

        onRender: function () {
            EditPicView.prototype.onRender &&
                EditPicView.prototype.onRender.apply(this, arguments);

            this.applyErrorMark();
        },

        applyErrorMark: function () {
            var errorMark = this.errorMark;

            this.$el.find(".upload-section").each(function () {
                var $section = $(this);
                var $trigger = $section.find('.upload-trigger');
                var name = $section.attr('name');
                
                if(errorMark[name] !== void 0) {
                    $trigger.addClass('has-error');
                }else{
                    // 如果图片没有出现在错误表中，则去掉清空图片的 panel
                    $trigger.removeClass('hasPic');
                }
            });
        },

        canSetupUploader: function (imageName) {
            // 如果该图片不存在或者该图片存在于错误表中，都可以点击上传图片
            return !this.brhInfo[imageName] || this.errorMark[imageName] !== void 0;
        },

        applyMchtData: function () {
            var data = this.data;
            this.$el.find(".upload-section").each(function () {
                var $section = $(this);
                var $trigger = $section.find('.upload-trigger');
                var $preview = $section.find('.preview-container');
                var $img = $preview.find('img');
                var name = $section.attr('name');

                if(data[name]) {
                    $trigger.addClass('hasPic');
                    $img.attr('src', data[name] + '?_t=' + (new Date()).getTime());
                    $preview.show();
                }
            });
        }
    });


    return PicView;

});