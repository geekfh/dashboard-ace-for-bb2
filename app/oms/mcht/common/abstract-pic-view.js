define(['App',
    'tpl!app/oms/mcht/common/templates/pic.tpl',
    'i18n!app/oms/common/nls/mcht',
    'upload',
    'jquery.fancybox'
], function(App, tpl, mcmgrLang, Uploader) {

    App.module('MchtSysApp.Add.View', function(View, App, Backbone, Marionette, $, _) {

        View.Pic = Marionette.ItemView.extend({

            template: tpl,

            events: {
                'click i.remove-trigger': 'clearPic'
            },

            shouldValidate: true,

            validate: function () {
                var mchtData = this.data;
                if(mchtData.mchtKind === 'D1'){
                    return this.skipValidation;
                }
                return !this.shouldValidate ||  this.showError();
            },

            skipValidation: function () {
                this.shouldValidate = false;
            },

            constructor: function (data) { 
                var me = this;

                Marionette.ItemView.prototype.constructor.apply(this, arguments);

                /**
                 * this._value长这样
                 * {images:[
                 *     {
                 *         name: 'idCardFroxx',
                 *         value: 'xxx.png'     
                 *     },
                 *     ...
                 * ]}
                 */
                this._values = {images:[]};
                this.data = data;
            },

            toggleUI: function () {
                var me = this, belong;
                var mchtData = this.data;
                me.freshMchtErrors();
                
                me.$el.find('.section').each(function () {
                    belong = $(this).attr('belong');
                    if(belong.indexOf(me.data.mchtKind) !== -1) {
                        $(this).show();
                    }else {
                        $(this).hide();
                    }
                });

                if(mchtData.mchtKind === 'B2' && parseInt(mchtData.accountType) === 0) {
                    var $uploadTrigger = this.$el.find('[name="personWithIdCard"]').find('.upload-trigger');
                    $uploadTrigger.removeClass('has-error');
                    $uploadTrigger.find(".help-error").remove();
                }

                this.$el.find('.agreement-section').toggle(this.data.accountProxy == 1);
            },

            clearPic: function (e) {
                var $section = $(e.target).closest('.upload-section');
                var $upload = $section.find('.upload-trigger');
                var $preview = $section.find('.preview-container');

                $preview.hide().find('img').attr('src', '');
                $upload.removeClass('hasPic');
                $section.removeClass('uploaded');
            },

            update: function (data) {
                var me = this;
                this.data = data;
                this.toggleUI();
            },

            getValues: function () {
                var images = [];
                this.$el.find('.upload-section:visible').each(function () {
                    var $this = $(this);
                    images.push({
                        name: $this.attr('name'),
                        value: ($this.find('.preview-container img').attr('src')||'').replace(/\?.*$/,'')
                    });
                });
                return { images: images };
            },

            //判断照片是否可选
            _isOptionalImg: function (el) {
                var $el = $(el);
                var $uploadTrigger = $el.closest(".upload-trigger");
                //默认可选依据是有无optional class
                var isOptional = $uploadTrigger.hasClass('optinal');

                var mchtData = this.data;
                var imgName = $el.closest('.upload-section').attr('name');

                //如果是手持身份证
                //如果是普通商户&&账户是对公
                if(imgName === 'personWithIdCard' && mchtData.mchtKind === 'B2' && parseInt(mchtData.accountType, 10) === 0) {
                    return true;
                }

                return isOptional;
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

                // if (me.data.mchtKind === 'B2' && !this.isAtLeastOne()) {
                //     flag = false;
                // }
            	
            	return flag;
            },

            freshMchtErrors: function () {
                var me = this,
                    ignoreValidateWhenB1 = ['shopFrontImg', 'shopInnerImg', 'checkstandImg', 'productImg', 'license', 'rentAgreement'],//B1类型判断能为空
                    atLeastOneImgs = ['license', 'rentAgreement', 'clearProtocol', 'shopFrontImg', 'shopInnerImg', 'checkstandImg', 'productImg'];//能为空的图
                //me.data.mchtKind === 'C2' || me.data.mchtKind === 'C1' || //集团商户也是可以为空
                this.$el.find(".upload-section:visible").each( function() {
                    var $uploadSection = $(this);
                    var uploadSectionName = $uploadSection.attr('name');
                    if(_.contains(ignoreValidateWhenB1, uploadSectionName)) {
                        var $uploadTrigger = $uploadSection.find('.upload-trigger');
                        if (me.data.mchtKind === 'B1' || //个体商户
                            (!!me.data.interMcht || !!me.data.billAddress) //外卡商户
                        ){
                            $uploadTrigger.addClass('optinal').removeClass("has-error");
                            $uploadTrigger.find(".help-error").remove();
                        } else {
                            !_.contains(atLeastOneImgs, uploadSectionName) && $uploadTrigger.removeClass('optinal');
                        }
                    }
                });
            },


            // 判断印业执照和租赁协议是否至少上传了一张
            isAtLeastOne: function () {
                var flag = false;  // 判断结果

                // 检查营业执照和租赁协议是否只上传（至少上传一张）
                this.$el.find('[atLeastOne]').each(function () {
                    $.trim($(this).find('img').attr('src').toString()) !== '' && (flag = true);
                });


                // 如果上传的张数不符合要求，给出错误提示
                if( !flag ) {
                    this.$el.find('[atLeastOne]').each(function () {
                        var $trigger = $(this);
                        $trigger.addClass("has-error");
                        
                        if( $trigger.find(".help-error").length < 1) {
                            $trigger.append("<div class='help-block help-error'>营业执照和租赁协议至少上传一张</div>");
                        }
                    });
                }

                return flag;
            },
            
            // 在上传成功或者失败后调用
            hideError: function() {
            	var curWrap = $(this).closest(".upload-trigger");
            	curWrap.removeClass("has-error");
            	curWrap.find(".help-error").remove();
            },

            serializeData: function () {
                return {
                    data: this.data
                };
            },

            onRender: function () {
                var me = this; 
                me.toggleUI();
                me.setupUploaders();

                /*edit by liuwei*/
                me.$el.find(".fancybox").fancybox();

                console.log('abstract-pic-view certFlag value====>' + me.data.certFlag);
                if(me.data.certFlag == 2 || me.data.certFlag == 3){
                    me.$el.find('.orgImage-section').css('display','none');
                    me.$el.find('.taxImage-section').css('display','none');
                }
                else{
                    me.$el.find('.orgImage-section').css('display','block');
                    me.$el.find('.taxImage-section').css('display','block');
                }
            },

            onMutex: function() {},

            canSetupUploader: function (imageName) {
                return true;
            },

            setupUploaders: function () {
                var me = this;
                me.$el.find('.upload-section').each(function (idx, el) {
                    var $section = $(el),
                        $trigger = $section.find('.upload-trigger'),
                        $preview = $section.find('.preview-container'),
                        $indicator = $section.find('.uploading-indicator'),
                        name = $section.attr('name'),
                        uploader,
                        uploading = false,
                        aborted = false;
                    if(me.canSetupUploader(name)) {
                        uploader = new Uploader({
                            data: {
                                name: name,
                                uuid: Ctx.getId()
                            },
                            beforeSubmit: function () {
                                $indicator.show();
                                if (uploading === true) {
                                    aborted = true;
                                    uploader.abort();
                                } else {
                                    uploading = true;
                                    aborted = false;
                                }

                                // 点击上传后，将下一个需要上传的dom滚上来。
                                var height = $trigger.offset().top + me.$el.find('.section').height() - 100;
                                $('html, body').animate({scrollTop: height}, 500);
                            },
                            complete: function () {
                                if (uploading === true) {
                                    if (aborted) {
                                        aborted = false;
                                    } else {
                                        $indicator.hide();
                                        uploading = false;
                                    }
                                }
                            },
                            trigger: $trigger,
                            action: url._('mcht.upload'),
                            accept: 'image/png, image/jpeg, image/jpg',
                            progress: function(queueId, event, position, total, percent) {
                                if(percent) {
                                    $indicator.find('.progress-percent').text(percent+'%').show();
                                }
                            },
                            success: function(queueId, resp) {
                                if(resp.success === false) {
                                    Opf.alert({ title: '图片格式不合法', message: resp.msg || '上传失败' });
                                } else {
                                    $preview.show().find('img').attr('src', Opf.Util.makeNoCacheUrl(resp.url));
                                    $trigger.addClass('hasPic');
                                    $section.addClass('uploaded');

                                    //TODO还没考虑服务器返回的图片错误信息
                                    doHideImgError($trigger);

                                    // 普通商户
                                    // 营业执照和租赁协议互斥
                                    var mchtKind = Opf.get(me.data, 'mchtKind');
                                    if(
                                        (
                                            mchtKind == "B2" || mchtKind == "C1" || mchtKind == "C2"
                                        ) &&
                                        $section.attr('name') == "license" ||
                                        $section.attr('name') == "rentAgreement"
                                    ) {
                                        // 营业执照和租赁协议互斥
                                        me.triggerMethod('mutex', $section);
                                    }
                                }
                            }
                        });
                    }

                });

                    
            }/*,

            assignImgValue: function (name, url) {
                var images = this._values.images;

                //先找到原来的值,如果有就更换url，没有就push一个新的item
                var item = _.findWhere(images, {name: name});
                if(item) {
                    item.value = url;
                }else {
                    images.push({name: name, value: url});
                }

            }*/

        });

    });

    function doHideImgError (el) {
        var curWrap = $(el).closest(".upload-trigger");

        if (curWrap.attr('atLeastOne') !== undefined) {
            doHideAtLeastOneError(el);
        }

        curWrap.removeClass("has-error");
        curWrap.find(".help-error").remove();
    }

    function doHideAtLeastOneError (el) {
        var curWrap = $(el).closest('.mcht-add-pic').find('[atLeastOne]');

        curWrap.removeClass("has-error");
        curWrap.find(".help-error").remove();
    }

    return App.MchtSysApp.Add.View.Pic;

});