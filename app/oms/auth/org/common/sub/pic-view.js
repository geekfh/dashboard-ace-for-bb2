define(['tpl!app/oms/auth/org/common/templates/pic.tpl',
    'app/oms/mcht/common/abstract-pic-view'
], function(tpl, PicView) {
    var brhPicView = PicView.extend({
        template: tpl,

        validate: function () {
            return this.showError();
        },

        toggleUI: function () {
            var orgData = this.data;
            this.$el.find('.section').each(function () {
                belong = $(this).attr('belong');
                if(belong.indexOf('branch') !== -1) {
                    $(this).show();
                }else {
                    $(this).hide();
                }
            });

            //如果在填写机构资料中没有填写银行卡号信息，则隐藏银行卡照片的上传
            if(!orgData.accountNo){
                this.$el.find('.bankCard-section').hide();
            }

            //如果在填写机构资料中没有填写对私账号信息，则隐藏银行卡照片的上传
            if(!orgData.paccountNo){
                this.$el.find('.pbankCard-section').hide();
            }
        },

        _isOptionalImg: function (el) {
            // 营业执照,组织机构代码证,税务登记证为选填,其余必填
            var imgName = $(el).closest('.upload-section').attr('name');
            if(imgName === 'license' || imgName === 'orgImage' || imgName === 'taxImage' ) {
                return true;
            }
            return false;
        },

        showError: function() {
                
            var flag = true;
            var me = this;

            this.$el.find(".upload-section:visible .upload-trigger img").each( function(img) {
                var $img = $(this), 
                    $uploadTrigger = $img.closest(".upload-trigger");

                // var isRequire = !$uploadTrigger.hasClass('optinal');
                var isRequire = !me._isOptionalImg(this);//!$uploadTrigger.hasClass('optinal');
                
                if( ($.trim($img.attr("src").toString())  === "" && isRequire) ||
                         $uploadTrigger.hasClass('has-error')) {
                    
                    flag = false;
                    $uploadTrigger.addClass("has-error");
                    
                    if( $uploadTrigger.find(".help-error").length < 1) {
                        $uploadTrigger.append("<div class='help-block help-error'>请上传图片</div>");
                    }
                }
            } );
            
            return flag;
        }
    });

    return brhPicView;
});