define(['app/oms/auth/org/common/sub/pic-view'], function(PicView) {
    var brhPicView = PicView.extend({

        onRender: function () {
            PicView.prototype.onRender &&
                PicView.prototype.onRender.apply(this, arguments);

            this.applyMchtData();

        },

        applyMchtData: function () {
            var data = this.data;
            var imagesData = data.images;

            // 对私账户银行卡信息
            if(data.pbankCard){
                var pbankCardItem = _.findWhere(imagesData, {name:"pbankCard"});
                if(!pbankCardItem){
                    var obj = {
                        name: 'pbankCard',
                        value: data.pbankCard
                    };
                    imagesData.push(obj);
                }
            }

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
                }
            });
        }
    });

    return brhPicView;
});