define([
    'tpl!app/oms/notice-mgr/templates/notice-detail.tpl',
     'jquery.fancybox',
    'moment.override'
], function(detailTpl) {

    var DetailView = Marionette.ItemView.extend({

        className: 'notice-detail-panel',

        template: detailTpl,

        ui: {
            'navbar': '.message-navbar',
            'messageBody': '.message-body'
        },

        triggers: {
            'click .btn-back': 'back'
        },

        events: {
            'click .btn-edit': 'onActionEdit',
            'click .btn-delete': 'onDeleteClick',
            'click .attached-file': 'onDownloadClick'
        },

        onActionEdit: function () {
            var me = this;
            this.trigger('edit:notice', this.model);
        },

        initialize: function (options) {
            var me = this;

            options = options || {};

            this.options = options;

            this.render();

            this.model.on('request', function () {
                Opf.UI.ajaxLoading(me.$el);
            });
        },

        refrehFromServer: function () {
            var me = this;

            this.model.fetch({
                success: function () {
                    me.render();
                }
            });
        },

        templateHelpers: function () {
            return {
                featureAvailConfig: this.getOption('featureAvailConfig'),
                formatSize: function (byteLen) {
                    return ''+ (byteLen / 1024 / 1024).toFixed(2) + ' MB';
                },
                formatTime: function (str) {
                    return moment(str).calendar();
                }
            };
        },

        onRender: function() {
            if (this.options.renderTo) {
                this.$el.appendTo(this.options.renderTo);
            }

            this.ui.navbar.scrollToFixed();

            this.adjustImageSize();


        },

        adjustImageSize: function() {
            var messageBody = this.ui.messageBody;

            this.$el.find('img').css('visibility', 'hidden').each(function(idx, imgEl) {

                Opf.Utils.getImageNaturalSize(this, function(size) {

                    $(imgEl).css('visibility', 'visible');

                    $(window).on('resize.noticeDetailResize', _.throttle(function () {
                        _adjust(imgEl, size.width, size.height, messageBody.width(), messageBody.height());
                    }, 200)).triggerHandler('resize.noticeDetailResize');

                    $(imgEl).fancybox({
                        padding: 0,
                        href: imgEl.src,
                        closeClick : true,
                        openEffect : 'none',
                        type: 'image',

                        helpers : {
                            title : {
                                type : 'inside'
                            }
                        }
                    });

                }); //ef getImageNaturalSize

            });

            function _adjust (imgEl, naturalW, naturalH, mW, mH) {
                var properSize = Opf.Utils.calcConstrainSize(naturalW, naturalH, mW, mH);

                if (properSize.width !== naturalW || properSize.height !== naturalH) {
                    $(imgEl).width(properSize.width).height(properSize.height);
                }
            }
            
        },

        onDestroy: function () {
            $(window).off('resize.noticeDetailResize');
        },

        onDeleteClick: function () {
            var me = this;

            this.model.destroy({
                success: function () {
                    me.destroy();
                    me.trigger('delete');
                }
            });
        },

        onDownloadClick: function (e) {
            var $a = $(e.target).closest('a');

            $a.parent().find('form').submit();

        },

        onBack: function () {
            this.destroy();
        }

    });
    
    return DetailView;
});