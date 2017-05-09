define([
    'tpl!app/oms/wkb/bankno-task/perform/templates/bankno-info.tpl',
    'app/oms/mcht/common/image-gallery-view', 'common-ui'
], function (tpl, GalleryView) {
    // 账号预审状态
    var CARD_STATUS = {
        "0": {
            cls: "label-success",
            text: "卡预审成功"
        },
        "1": {
            cls: "label-warning",
            text: "卡预审失败"
        },
        "2": {
            cls: "label-default",
            text: "未预审"
        }
    };

    var convertToGalleryData = function(data, me){
        var resultItem = {}, items = [];
        _.each(Opf.Config._('ui', 'bankNo.images'), function(defaultItem) {
            var name = defaultItem.name;

            var bimgDescr = [];

            if (name === 'bankCard') {
                var bankCardNo = Opf.String.beautyBankCardNo(data.accountNo, ' ');
                bimgDescr.push('<h4>' + data.accountName + '&nbsp;&nbsp;&nbsp;' + bankCardNo + '</h4>');
                bimgDescr.push('<p>' + data.zbankName + '</p>');
            }

            resultItem = _.extend({}, defaultItem, {
                name: name,
                url: data[name],
                bimgDescr: bimgDescr.join('')
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

        onRender: function () {
            //this.checkBigImg();
            //修改银行卡，弹出原商户资料页面
            this.renderMchtDetail();
            this.renderCardStatus();
            this.renderBankLogo();
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
*/
        //修改银行卡，弹出原商户资料页面
        renderMchtDetail:function(){
            var id=this.data.mchtId;
            this.$el.find('[name="accountName"] span').after($('<a href="javascript:void(0)"><span name="mchtDetail">查看商户资料</span></a>'));
            this.$el.find('span[name="mchtDetail"]').on("click", function(){
                console.log("查看商户资料");
                require(['app/oms/mcht/show/show-controller'], function (ctrl) {
                    ctrl.showMcht(id);
                });
            });
        },

        //0-卡预审成功 1-卡预审失败  2-未预审
        renderCardStatus: function() {
            var cardStatus = CARD_STATUS[this.data.cardStatus];

            if(_.isUndefined(cardStatus)) { return; }

            var cardStatusRow = [
                '<div class="row row-text-font pre-check-result" name="cardStatus-row">',
                    '<div class="col-lg-4 info-item-text"></div>',
                    '<div class="col-lg-8 desc">',
                        '<span class="label '+ cardStatus.cls +'">',
                            '<i class="icon icon-opf-warning"></i>' + cardStatus.text,
                        '</span>',
                    '</div>',
                '</div>',
                '<br>'
            ].join('');

            var $cardStatusRow = $(cardStatusRow);

            this.$el.find('[name="accountNo-row"]').after($cardStatusRow);

        },

        renderBankLogo: function () {
            var bankLogoRow = [
                '<div class="row row-text-font" name="bankLogo-row">',
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
        }
    });

    return View;
});