
define(['App',
    'tpl!app/oms/mcht/common/image-gallery.tpl',
    'jquery.royalslider'
], function(App, tpl) {

    App.module('MchtSysApp.View', function(View, App, Backbone, Marionette, $, _) {


        View.ImageGallery = Marionette.ItemView.extend({
            className: 'gallery-wrapper',
            template: tpl,

            events: {
                'click .clickClose': 'destroy'
            },

            onDestroy: function () {
                this.slider.destroy();
                this.$el.prev('.gallery-overlay').remove();
                // $(document.body).css('overflow', 'auto');
                $('body').removeClass('gallery-fixed-body');
                //Opf.UI.fixedBody(false);

                this._doc.off('keydown.gallery');

                this.trigger('close');
            },

            /**
             * data = {
             *     items: [
             *         {
             *             name: '',
             *             url: '',
             *             tmbDescr: '',
             *             bimgDescr: ''
             *         }
             *     ]
             * }
             *
             * startSlideId 用于设定幻灯片初始播放位置，可选
             */

            constructor: function (data, startSlideId) {
                this._doc = $(document);

                console.log('>>>>constructor gallery view with data', data);
                Marionette.ItemView.prototype.constructor.apply(this, arguments);

                this.data = data;
                // this.data = {"items":[{"name":"idCardFront","url":"http://127.0.0.1:8080/openplatform-mcht-webapp/upload/temporary/images/c0568a48-a365-4807-a93e-431e2c0afa4f/idCardFront.png","tmbDescr":"证件正面照","bimgDescr":"黄振涌  440306198912271111"},{"name":"idCardBack","url":"http://127.0.0.1:8080/openplatform-mcht-webapp/upload/temporary/images/c0568a48-a365-4807-a93e-431e2c0afa4f/idCardBack.png","tmbDescr":"证件反面照片","bimgDescr":""},{"name":"personWithIdCard","url":"http://127.0.0.1:8080/openplatform-mcht-webapp/upload/temporary/images/c0568a48-a365-4807-a93e-431e2c0afa4f/personWithIdCard.png","tmbDescr":"手持证件照","bimgDescr":""},{"name":"license","url":"http://127.0.0.1:8080/openplatform-mcht-webapp/upload/temporary/images/c0568a48-a365-4807-a93e-431e2c0afa4f/license.png","tmbDescr":"营业执照","bimgDescr":""},{"name":"scene","url":"http://127.0.0.1:8080/openplatform-mcht-webapp/upload/temporary/images/c0568a48-a365-4807-a93e-431e2c0afa4f/scene.png","tmbDescr":"门头照片","bimgDescr":""}]};


                this.startSlideId = startSlideId > 0 ? startSlideId : 0;

            },
            
            onDocKeyDown: function (e) {
                if(this.slider) {
                    if(e.which == 27 && !this.slider.isFullscreen) { 
                        this.destroy();
                    }
                }
            },

            onRender: function() {
                var me = this;
                this.$el.height($(window).height());
                this._doc.on('keydown.gallery', _.bind(this.onDocKeyDown, this));

                // $(document.body).css('overflow', 'hidden');
                $('body').addClass('gallery-fixed-body');
                //Opf.UI.fixedBody(true);

                this.$el.prependTo(document.body);

                $('<div class="gallery-overlay"></div>').insertBefore(this.$el);

                var $gallery = this.$el.find('.gallery');
                $gallery.royalSlider({
                    autoHeight: true,
                    controlNavigation: 'thumbnails',
                    autoScaleSlider: false, 
                    startSlideId: me.startSlideId,    // 设置 slide 初始位置
                    loop: false,
                    imageScaleMode: 'fit-if-smaller',
                    navigateByClick: false,
                    // autoScaleSliderWidth: 960,     
                    // autoScaleSliderHeight: 850,
                    fullscreen: {
                      enabled: true,
                      nativeFS: true
                    },
                    numImagesToPreload:2,
                    arrowsNav:true,
                    arrowsNavAutoHide: true,
                    arrowsNavHideOnTouch: true,
                    keyboardNavEnabled: true,
                    fadeinLoadedSlide: true,
                    globalCaption: true,
                    globalCaptionInside: false,
                    thumbs: {
                      spacing: 20,
                      appendSpan: true,
                      firstMargin: true,
                      paddingBottom: 4
                    }
                });
                var slider = this.slider = $gallery.data('royalSlider');
                var $fullScreenIcon = this.$el.find('i.enterFullScreen');
                var $prevIcon = this.$el.find('i.prev');
                var $nextIcon = this.$el.find('i.next');

                $prevIcon.click(function(){
                    slider.prev(); 
                });

                $nextIcon.click(function(){
                    slider.next();  
                });

                $fullScreenIcon.click(function(){
                    if(slider.isFullscreen) {
                        slider.exitFullscreen();
                    } else {
                        slider.enterFullscreen();
                    }
                });

                slider.ev.on('rsEnterFullscreen', function() {
                    $fullScreenIcon.removeClass('icon-resize-full').addClass('icon-resize-small');
                    setTimeout(function(){
                        updateSliderSizeByHeight(slider);
                    } , 500);
                });
                slider.ev.on('rsExitFullscreen', function() {
                    $fullScreenIcon.removeClass('icon-resize-small').addClass('icon-resize-full');
                    setTimeout(function(){
                        updateSliderSizeByHeight(slider);
                    } , 500);
                });

                var resizeTimer = Opf.Function.createBuffered(function () {
                    slider.slider.height($(window).height());
                    slider.updateSliderSize();
                }, 200);

                $(window).on('resize.opf.slider', resizeTimer);
                setTimeout(function () {
                    $(window).trigger('resize.opf.slider');
                }, 10);

                slider.ev.on('rsBeforeDestroy', function () {
                    $(window).off('resize.opf.slider');
                });

                me.$el.find('.btn-panel .turnLeft').click(function(){
                    var $currRsContent = slider.currSlide.holder.find('.rsContent');
                    $currRsContent && Opf.UI.roate90($currRsContent,-1);
                    updateSliderSizeByHeight(slider);
                });

                me.$el.find('.btn-panel .turnRight').click(function(){
                    var $currRsContent = slider.currSlide.holder.find('.rsContent');
                    $currRsContent && Opf.UI.roate90($currRsContent,1);
                    updateSliderSizeByHeight(slider);
                });

                //查看原图
                var $bigImgLink = $('<a class="original-image" target="_blank">查看原图</a>');
                $bigImgLink.prependTo($gallery);

                setTimeout(function(){
                    applyCurrentImageTolink(slider, $bigImgLink);
                },200);

                slider.ev.on('rsAfterSlideChange', function(e){
                    applyCurrentImageTolink(slider, $bigImgLink);
                });
            },

            serializeData: function () {
                return this.data;
            }
        });

    });

    function applyCurrentImageTolink(slider, bigImgLink) {
         var $currRsContent = slider.currSlide.holder.find('.rsContent');

        $(bigImgLink).attr('href', $currRsContent.find('img').attr('src'));
    }

    function updateSliderSizeByHeight(slider){
        var $currRsContent = slider.currSlide.holder.find('.rsContent');
        var $img = $currRsContent.find('img');
        var curCls = $currRsContent.attr('class');

        var roatingRegReplace = /rotating-(\w)/;
        var matchRet = curCls.match(roatingRegReplace);
        var degree = parseInt(matchRet[1], 10);

        if(degree % 2){
            var diffSize = $img.width() > $img.height() ? Math.abs($img.width()-$img.height()) : - Math.abs($img.width()-$img.height());
            $img.css({"margin-bottom":diffSize/2});
        }else{
            $img.css({"margin-bottom":0});
        }
        slider.updateSliderSize(true);
    }

    return App.MchtSysApp.View.ImageGallery;

});