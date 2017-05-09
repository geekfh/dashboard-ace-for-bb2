define([
    'marionette',
    'tpl!assets/scripts/fwk/component/templates/dialog.tpl'
], function(xx, tpl) {

    var DialogView = Marionette.ItemView.extend({

        //@config
        renderTo: document.body,
        //@config
        destroyOnClose: true,
        //@config
        cls: '',
        //@config
        title: '',
        //@config 初始化优先大小
        width: 320,
        //@config
        maxWidth: 2000,
        //@config
        minWidth: 200,
        //@config 初始化优先大小
        height: 480,
        //@config
        maxHeight: 2000,
        //@config
        minHeight: 200,
        //@config
        modal: false,
        //@config
        autoshow: false,
        //@config 放到内容部分的元素
        contentEl: null,

        /**
         * @config 配置底部按钮
         * [
         *     //直接提供html
         *     {html:'<button></button>',click:func(){}, btnCls:'btn'}
         *     //自定义文本和图标
         *     {text:'提交', click:func(){}, iconCls:'icon-remove', btnCls:'btn-submit'}
         * ]
         */
         button: null,
        /**
         * 配置后，对$el包裹一层,此时忽略width和height的配置
         * 窗口的宽高完全依赖该层的内容宽高，通过设置该层的padding
         * 达到控制窗口与容器之间的间距
         * 该层会有一个 '.opf-widget-padding-layer' 和 配置的cls-padding-layer
         * @config {布尔/dom/padding的样式值}
         */
        paddingLayer: false,
        paddingLayerCls: '',//加载pad层上的class

        /******************************************************/
        className: 'opf-widget opf-dialog',

        template: _.template([
            '<div class="opf-widget-header">',
                '<span class="title"></span> <i class="icon-remove btn-close"></i>',
            '</div>',
            '<div class="opf-widget-content"></div>',
            '<div style="display:none;" class="opf-widget-footer"></div>'
        ].join('')),

        constructor: function () {
            Marionette.ItemView.prototype.constructor.apply(this, arguments);

            this.ct = $(this.getOption('renderTo'));
            this.render();
        },

        renderPadLayer: function () {
            var $padLayer;

            var layer = this.getOption('paddingLayer');

            //如果配置为结点，则使用它作为pad层
            if(layer.nodeType || layer instanceof $) {
                $padLayer = $(layer);
            }else {
                $padLayer = $('<div class=""></div>');
            }

            $padLayer.addClass('opf-widget-padding-layer')//
                    .addClass(this.getOption('paddingLayerCls'));

            if(this.getOption('cls')) {
                $padLayer.addClass(this.getOption('cls') + '-padding-layer');
            }

            //如果 paddingLayer 配置为样式，则设置到pad层
            if(typeof layer === 'string' && /\d+(px)?\s*/) {
                $padLayer.css('padding', layer);
            }

            $padLayer.append(this.$el);
            this.$padLayer = $padLayer;
        },

        findElements: function () {
            this.$title = this.$('.title');
            this.$content = this.$('.opf-widget-content');
            this.$header = this.$('.opf-widget-header');
            this.$footer = this.$('.opf-widget-footer');
        },

        render: function() {
            var ret = Marionette.ItemView.prototype.render.apply(this, arguments);

            this.findElements();
            this.$el.hide().addClass(this.getOption('cls'));
            this.$title.text(this.getOption('title'));

            this.$el.css({
                'max-width': this.getOption('maxWidth'),
                'max-height': this.getOption('maxHeight')
            });

            if(this.getOption('paddingLayer')){
                this.renderPadLayer();
                this.$padLayer.appendTo(this.getOption('renderTo'));
            }else {
                this.$el.appendTo(this.getOption('renderTo'));
            }

            if(this.getOption('contentEl')) { 
                this.$('.opf-widget-content').append(this.getOption('contentEl'));
            } 

            if(this.getOption('autoshow')) {
                this.show();
            }

            $(window).on('resize.dialog', _.debounce(_.bind(this.adjustLayout, this), 80));

            this.$('.btn-close').on('click.close', _.bind(this.close, this));

            this.renderButtons();

            return ret;
        },

        renderButtons: function () {
            var me = this;
            var $btnGroup, $btn, btnHtml;

            var btnOptions = this.getOption('button');

            if(btnOptions) {
                $btnGroup = $('<div class="btns"></div>');

                _.each(btnOptions, function (item) {
                    $btnGroup.append(me.createBtn(item));
                });

                $btnGroup.appendTo(this.$footer);
                this.$footer.show();
            }
        },

        createBtn: function (item) {
            var me = this;

            var $btn = $(item.html ? item.html : btnTpl(item));

            if(item.click) {
                $btn.on('click', function () {
                    //如果 item.click 是字符串表示调用当前view的方法
                    if(typeof item.click === 'string' && me[item.click]) {
                        me[item.click].call(me);
                    }else if(typeof item.click === 'function'){
                        item.click.call(me);
                    }
                });
            }

            if(item.btnCls) {
                $btn.addClass(item.btnCls);
            }

            return $btn;
        },

        //获取 宽度/位置 计算依赖的父容器
        _getParentEl: function() {
            var $parent = this.$el.offsetParent();
            if ($parent.is(document) ||
                $parent.is(document.body) || $parent.is('html')) {
                $parent = $(window);
            }
            return $parent;
        },

        _resize: function () {
            var me = this;
            var ui = this.ui;
            var $el = this.$el;
            var $parent = this._getParentEl();
            var $content = this.$content;

            var optionWidht = this.getOption('width'),
                optionHeight = this.getOption('height');

            var parentWidth = $parent.width(),
                parentHeight = $parent.height(), 
                availWidth, availHeight; //= optionHeight; 

                //如果需要留白层，那么宽度依赖于留白层
            if(this.getOption('paddingLayer')) {
                availWidth = parentWidth;
                availHeight = parentHeight;
                //如果不需要留白层，宽度优先依赖于配置
            }else {
                availWidth = optionWidht, 
                availHeight = optionHeight; 

                //如果是数字，则可用宽度限制在父容器宽度内
                if(!/%$/.test(optionWidht))
                    availWidth = Math.min(parentWidth, availWidth);

                if(!/%$/.test(optionHeight))
                    availHeight = Math.min(parentHeight, availHeight);
            }

            availWidth = Math.max(this.getOption('minWidth'), 
                            Math.min(availWidth, this.getOption('maxWidth')));

            availHeight = Math.max(this.getOption('minHeight'), 
                            Math.min(availHeight, this.getOption('maxHeight')));

            this.$el.width(availWidth).height(availHeight);

            //PS:没有做内容宽度调整，暂时没用到
            var vTotalHBesideContent = 0;
            $content.siblings().each(function() {
                // console.log('>>>获取一个内容兄弟结点的高度', $(this).outerHeight(true));
                vTotalHBesideContent += $(this).outerHeight(true);
            });

            //内容的宽度不包括 内容的border和margin
            vTotalHBesideContent += ($content.outerHeight(true) - $content.height());
            $content.height(availHeight - vTotalHBesideContent);
        },

        show: function() {
            var me = this;

            if (this.getOption('modal')) {
                this.$overlay = $('<div class="opf-widget-overlay"></div>');
                this.$overlay.appendTo(this.getOption('renderTo'));
            }

            Opf.UI.fixedBody(true);

            this.refreshZIndex();
            this.$el.show();
            //将图片缩略图按照正常比例调整
            this.fitImages();

            _.defer(function () {
                me.adjustLayout();
            });
        },

        fitImages: function () {
            this.$el.find('.img-wrap').each(function () {
                var $imgWrap = $(this);
                Opf.Util.autoFitImg({
                    img: $imgWrap.find('img'),
                    constrain: $imgWrap.find('.img-inner-wrap')
                });
            });
        },

        refreshZIndex: function () {
            var zindex = this.getOption('zindex') || Opf.Utils.calcChildMaxZIndex(this.ct) + 10;

            // console.log('>>>refreshZIndex get child max zindex', zindex);
            
            if(this.getOption('paddingLayer')) {
                this.$padLayer.css('z-index', zindex);
            }else {
                this.$el.css('z-index', zindex);
            }

            //如果是模态窗口，蒙板层 为窗口zindex-1
            if(this.getOption('modal')) {
                this.$overlay.css('z-index', zindex - 1);
            }
        },

        adjustLayout: function () {
            var me = this;
                me._resize();

            //如果不需要留白层，那么居中需要通过计算实现
            if(!this.getOption('paddingLayer')) {
                this.$el.position({
                    my: 'center',
                    at: 'center',
                    of : this.getOption('renderTo')
                });
            }
        },

        close: function () {

            if(this.$padLayer) {
                this.$padLayer.hide();
            }else {
                this.$el.hide();
            }

            this.$overlay.remove();

            Opf.UI.fixedBody(false);

            if(this.getOption('destroyOnClose')) {
                this.destroy();
            }
        }

    });
    
    function btnTpl (item) {
        return [
            '<a class="btn btn-sm btn-submit">',
                (item.iconCls ? ('<i class="'+item.iconCls+'"></i>') : ''),
                '<span class="text">',
                    item.text,
                '</span>',
            '</a>'
        ].join('');
    }

    return DialogView;
});