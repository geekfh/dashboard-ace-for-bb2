define(['App',
    'app/oms/mcht/common/abstract-pic-view'
], function(App, AddPicView) {


    var PicView = AddPicView.extend({
        constructor: function (data, errorMark) { 
            AddPicView.prototype.constructor.apply(this, arguments);

            this.errorMark = errorMark||{};
        },

        onRender: function () {
            AddPicView.prototype.onRender &&
                AddPicView.prototype.onRender.apply(this, arguments);

            this.applyMchtData();

        },

        onMutex: function($current) {
            var $target,
                name = $current.attr('name');

            // 营业执照
            if(name == "license") {
                $target = $current.closest('.section').siblings('.rentAgreement-section').find('.upload-trigger');
            } else { // 租赁协议
                $target = $current.closest('.section').siblings('.license-section').find('.upload-trigger');
            }

            $current.find('.upload-trigger').removeClass("optinal");

            $target.addClass("optinal");
            $target.removeClass("has-error");
            $target.find(".help-error").remove();
        },

        applyMchtData: function () {
            var me = this;
            var imagesData = this.data.images;

            this.$el.find(".upload-section").each(function () {
                var $section = $(this);
                var $trigger = $section.find('.upload-trigger');
                var $preview = $section.find('.preview-container');
                var $img = $preview.find('img');
                var name = $section.attr('name');

                var item = _.findWhere(imagesData, {name: name});

                if(item) {
                    $trigger.addClass('hasPic');
                    $img.attr('src', item.value + '?_t=' + (new Date()).getTime());
                    $preview.show();

                    // 普通商户
                    // 营业执照和租赁协议互斥
                    var mchtKind = Opf.get(me.data, 'mchtKind');
                    if(
                        (
                            mchtKind == "B2" || mchtKind == "C1" || mchtKind == "C2"
                        ) &&
                        name == "license" ||
                        name == "rentAgreement"
                    ) {
                        // 营业执照和租赁协议互斥
                        me.triggerMethod('mutex', $section);
                    }
                }
            });
        }

    });


    return PicView;

});