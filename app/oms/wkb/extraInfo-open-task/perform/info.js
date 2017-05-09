define([
    'tpl!app/oms/wkb/extraInfo-open-task/perform/templates/info.tpl',
    'app/oms/wkb/extraInfo-open-task/perform/config',
    'app/oms/mcht/common/image-gallery-view',
    'common-ui'
], function (tpl, openMerchantConf, GalleryView) {

    var convertToGalleryData = function(data, me){
        var resultItem = {}, items = [];
        _.each(Opf.Config._('ui', 'mcht.images'), function(defaultItem) {
            var name = defaultItem.name;
            resultItem = _.extend({}, defaultItem, {
                name: name,
                url: data[name]
            });
            if(me.convertor) {
                me.convertor(resultItem);
            }
            if(resultItem.url) {
                items.push(resultItem);
            }
        });

        return {
            items: items
        };
    };
    var getClickedIndex = function(e, galleryData){
        var clickedUrl = $(e.target).attr('src'),
            correspondingItem = _.find(galleryData.items, function(item){
                return  clickedUrl.indexOf(item.url) !== -1;
            });

        return _.indexOf(galleryData.items, correspondingItem);
    };

    var View = Marionette.ItemView.extend({
        template: tpl,

        initialize: function (options) {
            this.data = options.data;
            this.convertor = options.convertor;
        },

        serializeData: function () {
            return {
                data: this.data,
                config: openMerchantConf
            };
        },

        events: {
            'click .img-wrap img': 'magnifyImages'//点击图片 显示功能
        },

        onRender: function () {
            //this.checkBigImg();
            //this.renderBankLogo();
        },

        magnifyImages: function(e) {
            if ($(e.target).is('.check-trigger')) {
                return;
            }
            var me = this;

            var galleryData = convertToGalleryData(me.data, me);
            var startSlideId = getClickedIndex(e, galleryData);

            var bankNoGalleryView = new GalleryView(galleryData, startSlideId);
            bankNoGalleryView.on('all', function (eventName) {
                me.trigger('gallery.'+eventName, bankNoGalleryView);
            });
            bankNoGalleryView.render();
        }

/*
        checkBigImg: function () {
            this.$el.find('.img-link').fancybox({
                wrapCSS    : 'fancybox-custom',
                closeClick : true,
                openEffect : 'none',
                type: 'image',

                helpers : {
                    title : {
                        type : 'inside'
                    }
                }
            });
        },


        renderBankLogo: function () {
            var bankLogoRow = [
                '<div class="row row-text-font row-margintop" name="bankLogo-row">',
                    '<label class="col-lg-4 info-item-text">&nbsp;</label>',
                    '<div class="value col-lg-8 checkable-text" name="bankLogo">',
                        '<div class="bank-logo-place"></div>',
                    '</div>',
                '</div>'
            ].join('');

            var $bankLogoRow = $(bankLogoRow);

            this.$el.find('[name="accountNo-row"]').after($bankLogoRow);


            var accountNo = this.data.accountNo;
            if (accountNo) {
                Opf.ajax({
                    autoMsg: false,
                    type: 'GET',
                    async: false,
                    url: url._('bankcode', {
                        bankCardNo: accountNo
                    }),
                    success: function(data) {
                        if (data.success !== false) {
                            $bankLogoRow.find('.bank-logo-place').empty().append(CommonUI.template('bank.logo.name', data));
                        }
                    }
                });
            }
        }*/
    });

    return View;
});