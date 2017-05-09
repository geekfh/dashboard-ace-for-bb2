define([
    'upload',
    'i18n!assets/scripts/fwk/nls/base'
], function(Uploader, baseLang) {
    
    var imgTpl = _.template([
        '<div class="auth-img-group" style="width: 150px; height: 100px;">',
            '<div class="inner-wrap">',
                '<div class="btn-panel">',
                    '<i class="icon icon-trash remove-trigger trigger"></i>',
                '</div>',
                '<div class="uploading-img middle-wrap">',
                    '<span>上传</span>&nbsp;<span class="progress-percent">...</span>',
                '</div>',
                '<div hidden class="img-align-wrap">',
                '</div>',
            '</div>',
        '</div>'
    ].join(''));

    var DEFAULT_UPLOAD_CONFIG = {
        // data: {
        //     uuid: Ctx.getId()
        // },
        action: url._('user.upload'),
        accept: 'image/png, image/jpeg, image/jpg'
    };

    // ImageView 显示图片上传进度，及上传成功后显示上传的图片，点击后还能继续上传图片。
    var ImageView = Marionette.ItemView.extend({
        template: imgTpl,
        events: {
            'click .remove-trigger': 'removeImg'
        },

        initialize: function (data) {
            this.imgName = data.name;
            this.$trigger = data.trigger;
        },

        onRender: function() {
            addUpload(this.$el.find('.img-align-wrap'), this);
        },

        removeImg: function() {
            this.remove();
            this.$trigger.show();
            this.trigger('remove:img');
        },

        loadImage: function (url) {
            this.toggleUploadingIndicator(false);

            var $img = this.creatImage(url);
            var $imgWrap = this.$el.find('.img-align-wrap');
            $imgWrap.append($img).show();
            //将图片缩略图按照正常比例调整
            this.fitImages($imgWrap);
            this.trigger('upload:success');
        },

        initImg: function (url) {
            this.$el.find('.img-align-wrap').find('img').remove();
        },

        toggleUploadingIndicator: function (bool) {
            this.$el.find('.uploading-img').toggle(bool);
        },     

        updatePercent: function (percent) {
            this.toggleUploadingIndicator(true);
            this.$el.find('.progress-percent').text(percent+'%');
        },

        creatImage: function (url) {
            var imgName = this.imgName;
            return [
                '<div class="img-inner-wrap">',
                    '<span class="vertical-helper"></span>',
                    '<img name="' + imgName + '" data-set="upload" src="' + url+ '?_t=<%=(new Date()).getTime()%>">',
                '</div>'
            ].join('');
        },

        fitImages: function (imgWrap) {
            var $imgWrap = $(imgWrap);
            Opf.Util.autoFitImg({
                img: $imgWrap.find('img'),
                constrain: $imgWrap.find('.img-inner-wrap')
            });

        }
    });


    // 通过Controller实现对ImageView的控制。提供
    // getImgView() 获取当前Controller里面的ImgView
    // resetImgView() 重置ImgView，并返回重置接口
    // initUploadView() 初始化点击上传的按钮及ImgView
    // renderViewByImgUrl(url) 通过提供的url手动设置ImgView需要显示的图片
    var ImageController = Marionette.Controller.extend({
        initialize: function(options) {
            this.imgName = options.name;
            this.$trigger = $(options.trigger);
            this.imgView = null;
        },

        getImgView: function() {
            return this.imgView;
        },

        resetImgView: function() {
            var me = this;
            me.imgView = new ImageView({name: me.imgName, trigger: me.$trigger}); 
            me.imgView.render();
            me.imgView.on('upload:success', function(){
                me.trigger('upload:success');
            });
            me._addEvents();
            return this.imgView;
        },

        initUploadView: function() {
            imageAppender(this);
        },

        renderViewByImgUrl: function(url) {
            var me = this;
            me.$trigger.hide();
            me.imgView = new ImageView({name: me.imgName, trigger: me.$trigger});
            me.imgView.render();
            me._addEvents();
            me.$trigger.after(me.imgView.$el);
            me.imgView.loadImage(url);
            me.imgView.on('upload:success', function(){
                me.trigger('upload:success');
            });
        },

        _addEvents: function () {
            var me = this;

            if (this.imgView) {
                this.imgView.on('remove:img', function() {
                    me.$trigger.find('form').remove();
                    me.initUploadView();
                });
            }
        },

        initAddView: function() {

        },

        initEditView: function() {

        }
    });

    function addUpload($el, view) {
        var upload = new Uploader($.extend(DEFAULT_UPLOAD_CONFIG, {
            data: {
                name: view.imgName,
                uuid: Ctx.getId()
            },
            trigger: $el,
            beforeSubmit: function (id) {
                view.initImg();
                view.toggleUploadingIndicator(true);
            },
            progress: function(queueId, event, position, total, percent) {
                view.updatePercent(percent);
            },
            error: function () {

            },
            success: function (queueId, resp) {
                if(resp.success === false) {
                    Opf.alert({ title: baseLang._('invalid.image.txt'),  message: resp.msg || '上传失败' });
                }else {
                    view.loadImage(resp.url);
                }
            }
        }));
    }

    // 初始化点击上传的按钮及ImgView
    function imageAppender (ctrl) {
        var imgView = null;
        var $trigger = ctrl.$trigger;

        var upload = new Uploader($.extend(DEFAULT_UPLOAD_CONFIG, {
            trigger: $trigger,
            data: {
                name: ctrl.imgName,
                uuid: Ctx.getId()
            },
            beforeSubmit: function (id) {
                imgView = ctrl.resetImgView();
                $trigger.hide();
                $trigger.after(imgView.$el);
                imgView.toggleUploadingIndicator(true);
            },
            progress: function(queueId, event, position, total, percent) {
                imgView && imgView.updatePercent(percent);
            },
            error: function () {
                if(imgView) {
                    imgView.remove();
                    $trigger.show();
                }
            },
            success: function (queueId, resp) {
                if(resp.success === false) {
                    Opf.alert({ title: baseLang._('invalid.image.txt'),  message: resp.msg || '上传失败' });
                    if(imgView) {
                        imgView.remove();
                        $trigger.show();
                    }
                }else {
                    if(imgView) {
                        imgView.loadImage(resp.url);
                    }
                }
            }
        }));
    }

    return ImageController;
    
});