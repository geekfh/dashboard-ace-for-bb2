/**
 * Created by wangdongdong on 2015/10/23.
 */
define([
    'app/oms/mcht/common/image-gallery-view'
],function(GalleryView) {
    var convertToGalleryData = function(data, me) {
        var resultItem = {}, items = [],
            businessLicImages = [
                {name:'businessLicImg', url:'', tmbDescr:'营业执照照片', bimgDescr:'', belong: ''}
            ];

        _.each(businessLicImages, function(defaultItem) {
            var name = defaultItem.name;

            var bimgDescr = [];

            if (name === 'businessLicImg') {
                //var bankCardNo = Opf.String.beautyBankCardNo(data.accountNo, ' ');
                bimgDescr.push('<h4>' + data.accountName + '&nbsp;&nbsp;&nbsp;&nbsp;' + data.businessLicNo + '</h4>');
                bimgDescr.push('<p>' + data.businessName + '</p>');
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

    return Marionette.ItemView.extend({
        template: _.template(getFurtherInfoTpl()),

        initialize: function(options, convertor){
            this.data = options;
            this.convertor = convertor;
        },

        events: {
            'click .img-wrap img': 'magnifyImages'//点击图片 显示功能
        },

        serializeData: function() {
            return {
                data: this.data
            }
        },

        onRender: function(){
            //this.$el.find('div[name="businessName"] span').text(this.data.businessName);
            //this.$el.find('div[name="businessLicNo"] span').text(this.data.businessLicNo);
            //this.$el.find('div[name="businessLicImg"] img').attr('src', this.data.businessLicImg);
            //this.$el.find('div[name="businessLicImg"] a').attr('href', this.data.businessLicImg);
        },

        magnifyImages: function(e) {
            e.stopPropagation();

            if ($(e.target).is('.check-trigger')) {
                return;
            }
            var me = this;

            var galleryData = convertToGalleryData(me.data, me);
            var startSlideId = 0;

            var galleryView = new GalleryView(galleryData, startSlideId).render();

            galleryView.on('destroy', function (eName) {
                galleryView.$el.find(':checkbox').each(function () {
                    var name = $(this).attr('name');
                    var isChecked = $(this).prop('checked');
                    var $checkable = me.$el.find('.checkable[name="'+name+'"]');
                    $checkable.toggleClass('checked', isChecked);
                    $checkable.find('i.check-trigger').toggleClass('icon-remove', isChecked);
                });
            });
        }

    });

    function getCheckable (e) {
        return $(e.target ? e.target : e).closest('.checkable');
    }

    function getFurtherInfoTpl() {
        return [
            '<div class="container group-margintop further-info-wrap" style="border: 1px solid #CECECE">',
                '<div class="caption caption-text-font" style="color: #009ceb">营业执照信息审核</div>',

                    '<div class="row row-margintop businessName-row">',
                        '<label class="col-lg-4 info-item-text">企业名称：</label>',
                        '<div class="value col-lg-8 checkable checkable-text" name="businessName">',
                            '<span class="text"><%= data.businessName%></span>',
                        '</div>',
                    '</div>',

                    '<div class="row row-margintop businessLicNo-row">',
                        '<label class="col-lg-6 info-item-text">营业执照号码：</label>',
                        '<div class="value col-lg-6 checkable checkable-text" name="businessLicNo">',
                            '<span class="text"><%= data.businessLicNo%></span>',
                        '</div>',
                    '</div>',

                    '<div class="row row-margintop">',
                        '<label class="col-lg-6 info-item-text">营业执照照片：</label>',
                        '<div name="businessLicImg" class="col-xs-6 img-wrap checkable">',
                            '<div class="img-inner-wrap">',
                                '<div class="img-wrap">',
                                     '<span class="vertical-helper"></span>',
                                     '<img class="mcht-img" src="<%= data.businessLicImg%>">',
                                '</div>',
                             '</div>',
                        '</div>',
                    '</div>',
                '</div>',
            '</div>'
        ].join('');
    }

});
