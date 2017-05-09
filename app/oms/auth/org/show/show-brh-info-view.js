define(['tpl!app/oms/auth/org/show/templates/brh-info.tpl',
    'app/oms/mcht/common/image-gallery-view',
     'jquery.fancybox'
], function(tpl, GalleryView) {

    var DISC_TYPE_MAP = {
        DirMcc:{belong: 'dir', label:'直联MCC类'},           
        DirMccCanHighSign:{belong: 'dir', label:'直联MCC类可高签'},   
        IndirMcc:{belong: 'indir', label:'间联MCC类'},         
        IndirUnionSettle:{belong: 'indir', label:'间联统一结算扣率'}, 
        IndirNoneBaseRate:{belong: 'indir', label:'间联无基准费率'},  
        IndirSignToSettle:{belong: 'indir', label:'间联签约扣率对应变动结算扣率'}, 
        IndirSettleRateMonthlyChange:{belong: 'indir', label:'间联月交易额结算扣率变动'},
        IndirMccMonthlyRate:{belong: 'indir', label:'MCC月交易额结算扣率'}
    };

    var View = Marionette.ItemView.extend({
        template: tpl,
        events: {
            'click .img-wrap img': 'magnifyImages',
            'click .bt_valild_phone': 'loadPhoneValidClickHandle'
        },
        initialize: function(options) {
            this.data = options.data;
            this.rowData = options.rowData || {};
            this.brhCode = options.rowData ? options.rowData.code : options.data.brhCode;
            this.convertor = options.convertor;
        },
        
        serializeData: function () {
            var data = this.data;
            var brhLevel = this.rowData.level;
            return {
                data: data,
                getBrhLevel: function () {
                    return brhLevel;
                },
                getDirDiscType: function () {
                    var arr = [];
                    _.each(data.availDiscModelTypes, function(discType) {
                        if(discType){
                            var discModel = DISC_TYPE_MAP[discType];
                            if(discModel.belong == 'dir'){
                                arr.push(discModel.label);
                            }
                        }
                    });
                    return arr;
                },

                getIndirDiscType: function () {
                    var arr = [];
                    _.each(data.availDiscModelTypes, function(discType) {
                        if(discType){
                            var discModel = DISC_TYPE_MAP[discType];
                            if(discModel.belong == 'indir'){
                                arr.push(discModel.label);
                            }
                        }
                    });
                    return arr;
                }
            };
        },

        magnifyImages: function (e) {
            if ($(e.target).is('.check-trigger')) {
                return;
            }
            var me = this;
            var galleryData = convertToGalleryData(me.data, me);
            var startSlideId = getClickedIndex(e, galleryData);
            var view = new GalleryView(galleryData, startSlideId);
            view.on('all', function (eventName) {
                console.log(arguments);
                me.trigger('gallery.'+eventName, view);
            });
            view.render();
        },

        checkBigImg: function () {
            this.$el.find('.extra-images').fancybox({
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

        onRender: function () {
            var me = this;
            // me.checkBigImg();

            //如果有合同扫描件就可以查看一下
            var $contractFile = me.$el.find('[name="contractFile"]');

            if(me.data.contractFile){
                $contractFile.append('<a href='+ me.data.contractFile +' target="_blank">查看</a>');
            }

            Opf.ajax({
                type: 'GET',
                autoMsg: false,
                url: url._('branch.info',{brhCode: me.brhCode}),
                success: function (resp) {
                    me.addInfo(resp);
                }
            });


            //手机屏蔽
            if(me.data.mobile != null && /^1[3|4|5|7|8]\d{9}$/.test(me.data.mobile)){
                var phone = this.$el.find('[name="mobile"] span');
                $(phone).html(Opf.String.phoneFormat(me.data.mobile));
                if(me.data.mobile.indexOf('*') < 0){
                    this.$el.find('[name="mobile"]').append('&nbsp;&nbsp;<button type="button" class="btn btn-minier btn-yellow bt_valild_phone" phonetext="'+me.data.mobile+'">点击查看完整号码</button>');
                }
            }
            //紧急联系电话屏蔽
            if(me.data.brhTel != null){// && /^1[3|4|5|7|8]\d{9}$/.test(me.data.brhTel)
                var brhTel = this.$el.find('[name="brhTel"] span');
                $(brhTel).html(Opf.String.phoneFormat(me.data.brhTel));
                if(me.data.brhTel.indexOf('*') < 0) {
                    this.$el.find('[name="brhTel"]').append('&nbsp;&nbsp;<button type="button" class="btn btn-minier btn-yellow bt_valild_phone" phonetext="' + me.data.brhTel + '">点击查看完整号码</button>');
                }
            }
        },

        loadPhoneValidClickHandle: function(el){
            var currentPhone = $(el.currentTarget).attr('phonetext');
                Opf.ajax({
                    type: 'GET',
                    asnyc: false,
                    url: 'api/mcht/merchants/logInfo',
                    data: {phone: currentPhone, mchtName: ''},
                    success: function(resp){
                        console.log(resp);
                    },
                    complete: function(){
                        $(el.currentTarget).prev().text(currentPhone);
                        $(el.currentTarget).attr('disabled', 'disabled');
                    }
                });
        },

        addInfo: function (data) {
            var $el = this.$el;
            var modelHtml = [
                '<div class="row row-text-font row-margintop <%-name%>-row">',
                    '<label class="col-lg-4 info-item-text"><%-label%>:</label>',
                    '<div class="value col-lg-8 checkable-text" name="<%-name%>">',
                        '<span class="text" style="font-family: -webkit-body"><%-value%></span>',
                    '</div>',
                '</div>'
            ].join('');

            var tpl = _.template(modelHtml);
            var brhLevelMap = {name: 'brhLevel', label: '机构等级', value: formatBrhLevel(data.brhLevel)};
            var subBrhNameMap = {name: 'subBrhName', label: '隶属关系', value: formatBrhName(data.subBrhName)};


            $el.find('.brhNickName-row').after(tpl(subBrhNameMap)).after(tpl(brhLevelMap));

        }

    });


    var DEFAULT_ITEMS = Opf.Config._('ui', 'org.images');

    function convertToGalleryData(data, me) {
        var $el = me.$el;
        var result = {};
        var brhInfo = data.brhInfo ? data.brhInfo : data;
        var extraImages = brhInfo.extraImages ? brhInfo.extraImages.split(',') : [];

        var resultItem;
        var items = [];

        _.each(DEFAULT_ITEMS, function(defaultItem, index) {
            var name = defaultItem.name;

            var check = $el.find('.checkable[name=' + name + ']').hasClass('checked');

            var bimgDescr = [];
            if (name === 'idCardFront') {
                var idCardNo = Opf.String.beautyIdNo(brhInfo.cardNo,' ');
                bimgDescr.push('<h4>' + brhInfo.name + '&nbsp;&nbsp;&nbsp;' + idCardNo + '</h4>');
            } else if (name === 'license') {
                var licenseNo = Opf.String.beautyWithSeparator(brhInfo.licNo, ' ');
                bimgDescr.push('<h4>' + brhInfo.brhName + '&nbsp;&nbsp;&nbsp;' + licenseNo + '</h4>');
            } else if (name === 'bankCard') {
                var bankCardNo = Opf.String.beautyBankCardNo(brhInfo.accountNo, ' ');
                bimgDescr.push('<h4>' + brhInfo.accountName + '&nbsp;&nbsp;&nbsp;' + bankCardNo + '</h4>');
            } else if(name === 'taxImage'){
                var taxNo = Opf.String.beautyWithSeparator(brhInfo.taxNo, ' ');
                bimgDescr.push('<h4>' + taxNo + '</h4>');
            }

            resultItem = $.extend(defaultItem, {
                name: name,
                // check: check,
                url: brhInfo[name],
                bimgDescr: bimgDescr.join('')
            });

            if(me.convertor) {
                me.convertor(resultItem);
            }

            if(resultItem.url) {
                items.push(resultItem);
                
            }
        });

        if (extraImages && extraImages.length) {

            _.each(extraImages, function(url, index) {
                var name = 'extra' + index;
                resultItem = {
                    name: name, //名字索引从0开始
                    url: url,
                    tmbDescr: '补充照片 ' + (index + 1) //,//label显示从1开始
                    // check: $el.find('.checkable[name=' + name + ']').hasClass('checked')
                };
                if(me.convertor) {
                    me.convertor(resultItem);
                }
                items.push(resultItem);
            });
        }

        return {
            items: items
        };
    }

    function getClickedIndex(e, galleryData) {
        var clickedUrl = $(e.target).attr('src'),
            correspondingItem = _.find(galleryData.items, function(item){
                return  clickedUrl.indexOf(item.url) !== -1;
            });

        return _.indexOf(galleryData.items, correspondingItem);
    }

    function formatBrhName(subBrhName) {
        var str = '';
        for(var i = 0, l = subBrhName.length; i < l; i++){
            str += " —> " + subBrhName[i];
        }
        return str.replace(" —> ", '');
    }

    function formatBrhLevel(brhLevel) {
        var orgLevelMap = {
            '0': '集团总部',
            '1': '合作机构'
        };

        return brhLevel > 1 ? (brhLevel-1) + ' 级代理' : orgLevelMap[brhLevel];
    }

    return View;
});