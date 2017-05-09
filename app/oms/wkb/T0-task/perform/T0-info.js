define([
    'tpl!app/oms/wkb/T0-task/perform/templates/T0-info.tpl',
    'app/oms/mcht/common/image-gallery-view', 'common-ui'
], function (tpl, GalleryView) {
    var convertToGalleryData = function(data, me){
        var resultItem = {}, items = [];
        _.each(Opf.Config._('ui', 'T0.images'), function(defaultItem) {
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
                data: this.data
            };
        },

        events: {
            'click .img-wrap img': 'magnifyImages'//点击图片 显示功能
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
        },

        onRender: function () {
            //this.checkBigImg();
        }

        /*checkBigImg: function () {
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
        }*/
    });

    return View;
});