define([
    'upload',
    'i18n!assets/scripts/fwk/nls/base'
], function(Uploader, baseLang) {


    function ImageAppender (options) {
        var $previewCt = $(options.previewCt);
        var limit = options.limit || 10;

        var queueCache = {

        };

        var default_data = {
            name: 'extra',
            uuid: Ctx.getId()
        };

        var default_url = url._('mcht.upload');

        new Uploader({
            trigger: options.trigger,
            data: options.data || default_data,
            action: options.url || default_url,
            accept: 'image/png, image/jpeg, image/jpg',
            beforeSubmit: function (id) {
                if ($previewCt.find('.img-wrap').length >= limit) {
                    Opf.alert('最多添加' + limit + '张！！');
                    this.refreshInput();
                    return false;
                }
                var imgView = new ImageView().render();
                queueCache[id] = {imgView: imgView};
                $previewCt.append(imgView.$el);
                imgView.toggleUploadingIndicator(true);
            },
            progress: function(queueId, event, position, total, percent) {
                if(queueCache[queueId]) {
                    queueCache[queueId].imgView.updatePercent(percent);
                }
            },
            error: function () {
                if(queueCache[queueId]) {
                    queueCache[queueId].imgView.remove();
                }
            },
            success: function (queueId, resp) {
                if(resp.success === false) {
                    Opf.alert({ title: baseLang._('invalid.image.txt'),  message: resp.msg || '上传失败' });
                    if(queueCache[queueId]) {
                        queueCache[queueId].imgView.remove();
                    }
                }else {
                    if(queueCache[queueId]) {
                        queueCache[queueId].imgView.loadImage(resp.url);
                    }
                }
            }
        });
    }

    var imgTpl = [
        '<div class="col-xs-3 img-wrap">',
            '<div class="inner-wrap">',
                '<div class="btn-panel">',
                    '<i class="icon icon-trash remove-trigger trigger"></i>',
                '</div>',
                // '<div class="uploading-indicator middle-wrap" style="/* display: none; */">',
                //     '<div class="v-align-middle indicator">',
                //         '<span class="icon-wrap"> <i class="icon-spinner icon-spin"></i>',
                //             '<span class="progress-percent" style="display: inline;"></span>',
                //         '</span>',
                //         '<span >上传...</span>',
                //     '</div>',
                // '</div>', 
               '<div class="uploading-indicator middle-wrap" style="/* display: none; */">',
                    '<span>上传</span>&nbsp;<span class="progress-percent">...</span>',
                '</div>',
                '<div class="loading-indicator middle-wrap" >',
                    // '<img src="assets/images/pic-loading.png" />',
                    '<span class="text">预览...</span>',
                '</div>',
                '<div hidden class="img-align-wrap">',
                    //'<img class="upload-file-img"  src="' + '' + '">',
                '</div>',
            '</div>',
        '</div>'
    ].join('');

    var ImageView = Backbone.View.extend({
        template: imgTpl,
        events: {
            'click .remove-trigger': 'remove'
        },
        loadImage: function (url) {
            this.toggleUploadingIndicator(false);
            this.toggleLoadingIndicator(true);

            var $img = $('<img data-set="extra">').attr('src', url);
            this.$el.find('.img-align-wrap').append($img).show();
        },
        render: function () {
            this.$el.append($(this.template));
            return this;
        },
        toggleUploadingIndicator: function (bool) {
            this.$el.find('.uploading-indicator').toggle(bool);
        },        
        toggleLoadingIndicator: function (bool) {
            this.$el.find('.loading-indicator').toggle(bool);
        },
        updatePercent: function (percent) {
            this.toggleUploadingIndicator(true);
            this.$el.find('.progress-percent').text(percent+'%');
        }
    });

    ImageAppender.ImageView = ImageView;

    return ImageAppender;
    
});