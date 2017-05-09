define(['App',
    'app/oms/mcht/edit/sub/edit-pic-view'
], function(App, EditPicView) {
    var array = [
        'idCardFront','idCardBack','bankCard','license',
        'rentAgreement', 'operatorMcht', 'shopFrontImg', 'shopInnerImg', 'orgImage',
        'taxImage', 'personWithIdCard', 'checkstandImg', 'productImg'
    ];

    var PicView = EditPicView.extend({
        constructor: function (data, errorMark,params) { 
            EditPicView.prototype.constructor.apply(this, arguments);

            this.errorMark = errorMark;
            this.originalData = params.originalData;
        },

        onRender: function () {
            EditPicView.prototype.onRender &&
                EditPicView.prototype.onRender.apply(this, arguments);

            this.applyErrorMark();
        },

        canSetupUploader: function (imageName) {
            // if(imageName == 'orgImage' || imageName == 'taxImage' || imageName == 'personWithIdCard'){
            // 恶心 array 内为非必填图片，如果没有勾错打回则设置为可上传
            if (_.contains(array, imageName)) {
                var originalImg = _.findWhere(this.originalData.images,{name:imageName});
                if(originalImg && this.errorMark[imageName] === void 0){
                    return false;
                }
                return true;
            }
            else if(this.errorMark[imageName] === void 0 ) {
                if(imageName == 'agreement' && this.errorMark['accountName'] !== void 0 && this.originalData.accountProxy == 0){
                    return true;
                }
                else return false;
            }
            return true;
        },

        applyErrorMark: function () {
            var errorMark = this.errorMark;

            this.$el.find(".upload-section").each(function () {
                var $section = $(this);
                var $trigger = $section.find('.upload-trigger');
                var name = $section.attr('name');
                
                if(errorMark[name] !== void 0) {
                    $trigger.addClass('has-error');
                }else{
                    // 如果图片没有出现在错误表中，则去掉清空图片的 panel
                    $trigger.removeClass('hasPic');
                }
            });
        }
    });


    return PicView;

});