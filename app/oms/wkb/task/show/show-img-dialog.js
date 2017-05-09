define(['tpl!app/oms/wkb/task/show/templates/show-img.tpl'], function (tpl) {

    var View = Marionette.ItemView.extend({

        template: tpl,

        events: {
            'change [name="imgError"]': 'changeImgIsCheckedMap'
        },

        ui: {
            imgWrap: '.img-wrap',
            bigImage: '.img-wrap img',
            imgError: '[name="imgError"]'
        },

        initialize: function (options) {
            this.images = options.images;
            this.startSlideId = options.startSlideId;
            this.imgIsCheckedMap = options.imgIsCheckedMap;
            this.currImage = this.images[this.startSlideId];
        },

        serializeData: function () {
            if(this.currImage.bimgDescr == void 0){
                this.currImage.bimgDescr = '';
            }
            return this.currImage;
        },
        
        onRender: function () {
            var me = this;
            // 默认打开查看大图弹框时，弹框的宽高根据窗口的宽高进行调整
            this.renderDialog();
            this.replaceUiMaxFront();
            this.renderDialogPanel();
        },

        renderDialog: function () {
            var me = this;
            var infoWrapWidth = 0.6*$(window).width();
            var infoWrapHeight = 0.8*$(window).height();

            var $dialog = this.$dialog = Opf.Factory.createDialog(me.$el, {
                modal: true,
                width: infoWrapWidth,
                height: infoWrapHeight,
                minWidth: 650,
                minHeight: 600,
                title: me.currImage.tmbDescr,
                appendTo: document.body,
                buttons: [{
                    type: 'submit',
                    text: '确定',
                    click: function() {
                        me.trigger('imgDialog.sure', me.imgIsCheckedMap);
                        $dialog.trigger('dialogclose');
                        $dialog.dialog('destroy');
                    }
                }],
                close: function() {
                    $dialog.dialog('destroy');
                }
            });

            // 按正常比例调整图片大小
            fitImg(me.$el);

            // 该图片是否有错误，如果有，则勾上‘图片有误’
            me.checkImgError(me.currImage);

            // 调整弹框宽高后触发
            $dialog.on('resize.stop', function () {
                fitImg(me.$el);
            });
        },

        replaceUiMaxFront: function () {
            var $dialogWrap = this.$dialog.closest('.ui-dialog');
            var $overlay = $dialogWrap.prev();

            $dialogWrap.removeClass('ui-front').addClass('ui-max-front');
            $overlay.removeClass('ui-front').addClass('ui-max-overlay-front');
        },

        renderDialogPanel: function () {
            var me = this;
            var $panel = $(getPannelTpl());
            var $dialogWrap = this.$el.closest('.ui-dialog');
            $dialogWrap.find('.ui-dialog-buttonset').append($panel);
            
            $panel.find('i.prev').on('click', function () {
                if(me.startSlideId > 0){
                    me.startSlideId --;
                    me.updateImageByIndex(me.startSlideId);
                }
            });

            $panel.find('i.next').on('click', function () {
                if(me.startSlideId < me.images.length - 1){
                    me.startSlideId ++;
                    me.updateImageByIndex(me.startSlideId);
                }
            });

            $panel.find('i.turnLeft').on('click', function () {
                Opf.UI.roate90(me.ui.imgWrap,-1);
            });

            $panel.find('i.turnRight').on('click', function () {
                Opf.UI.roate90(me.ui.imgWrap,1);
            });
        },

        checkImgError: function (image) {
            var isChecked = this.imgIsCheckedMap[image.name];

            this.ui.imgError.prop('checked', isChecked);
        },

        updateImageByIndex: function (index) {
            this.destroyImgRoate();
            var currImage = this.currImage = this.images[index];

            var $imgDialogTitle = this.$el.closest('.ui-dialog').find('.ui-dialog-title');
            $imgDialogTitle.text(currImage.tmbDescr);

            this.ui.bigImage.attr('src', currImage.url + '?_t=' + (new Date()).getTime());

            this.checkImgError(currImage);

            fitImg(this.$el);
        },

        destroyImgRoate: function () {
            var $imgWrap = this.ui.imgWrap;
            var curCls = $imgWrap.attr('class');
            var newCls = curCls.replace(/rotating-\d/, '');

            $imgWrap.attr('class', newCls);
        },

        changeImgIsCheckedMap: function () {
            var currImgName = this.currImage.name;
            var isChecked = this.ui.imgError.is(':checked');

            this.imgIsCheckedMap[currImgName] = isChecked;
        }
    });

    function getPannelTpl () {
        return [
            '<div class="btn-panel">',
                '<i title="上一张" class="icon-arrow-left prev"></i>',
                '<i title="下一张" class="icon-arrow-right next"></i>',
                '<i title="图片左转" class="icon-rotate-left turnLeft"></i>',
                '<i title="图片右转" class="icon-rotate-right turnRight"></i>',
            '</div>'
        ].join('');
    }


    function fitImg (el) {
        var $el = $(el);
        Opf.Util.autoFitImg({
            img: $el.find('img'),
            constrain: $el.find('.img-inner-wrap')
        });
    }

    return View;

});