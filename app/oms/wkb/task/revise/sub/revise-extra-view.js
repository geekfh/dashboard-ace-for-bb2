define(['App',
    'i18n!app/oms/common/nls/mcht',
    'app/oms/mcht/add/sub/extra-view',
    'tpl!app/oms/wkb/task/revise/templates/revise-extra.tpl',
    'app/oms/mcht/add/sub/extra-image-appender',
    'upload',
    'jquery.validate'
], function(App, mchtLang, SuperExtraView, tpl,ExtraImagerAppender) {


    App.module('MchtSysApp.Revise.View', function(View, App, Backbone, Marionette, $, _) {

        View.Extra = SuperExtraView.extend({

            template: tpl,

            constructor: function (data, errorMark, params) {
                SuperExtraView.prototype.constructor.apply(this, arguments);

                this.errorMark = errorMark || {};
                this.viewType = params.viewType;
            },

            //别删update方法
            update: function () {

            },

            onRender: function () {
                SuperExtraView.prototype.onRender &&
                SuperExtraView.prototype.onRender.apply(this, arguments);

                this.applyMchtData();

                this.handleImages();

                if(this.viewType == 'revise'){

                    this.onRender4Revise();

                }else{

                    this.onRender4Edit();

                }

            },

            handleImages: function () {
                //添加新增补充图片按钮及功能
                var $triggerImg = this.$el.find('.add-img-tirgger');
                var $previewCt = this.$el.find('.imgs-preview');

                $triggerImg.find('.uploader-file-input').on('change', function(){
                    if($(this).val()){
                        $triggerImg.closest('.section').find('.prompt-block-label').remove();
                    }
                });

                //添加删除补充图片按钮及功能
                var $img = this.$el.find('.img-wrap img');
                var panelHtml = '<div class="btn-panel"></div>';
                var trashHtml = '<i class="icon icon-trash remove-trigger trigger"></i>';

                var $trash = $(trashHtml).click(function(){
                    $(this).closest('.img-wrap').remove();
                });

                var $panel = $(panelHtml).append($trash);
                $panel.insertBefore($img);
            },

            onRender4Revise: function () {
                var $viceUserCt = this.$el.find('#add-more-receipt-person');
                var $snCt = this.$el.find('#add-more-pos-machine');
                $viceUserCt.find('[name^="remitteeName"]').each(function(){
                    $(this).prop({disabled:true});
                });
                $viceUserCt.find('[name^="remitteePhone"]').each(function(){
                    $(this).prop({disabled:true});
                });

                $viceUserCt.find('.delete_receipt_person').remove();

                $snCt.find('.delete_pos_machine').remove();
            },

            onRender4Edit: function () {
                var $viceUserCt = this.$el.find('#add-more-receipt-person');
                var $receiptSection = this.$el.find('.receipt-section');

                var addPersonHtml = [
                    '<div class="hx-bottom-margin15" style="display: none;"> ',
                    '<span class="edit-add-person">',
                    '<i class="icon-plus green"></i>',
                    '<label name="receipt_person">添加收银员</label>',
                    '</span>',
                    '</div>'
                ].join('');

                var $addReceiptPerson = $(addPersonHtml).click(function(){
                    $viceUserCt.append(viceUserTpl({
                        name:'',
                        phone:''
                    }));
                    $receiptSection.find('.prompt-block').remove();
                });
                $viceUserCt.after($addReceiptPerson);

                //商户编辑时补充照片允许再上传
                var $img = this.$el.find('.img-wrap');
                $img.each(function(){
                    var $uploadImg = $(this);
                    setTimeout(function () {
                        new Uploader({
                            data: {
                                name: 'extra',
                                uuid: Ctx.getId()
                            },
                            trigger: $uploadImg,
                            action: url._('mcht.upload'),
                            accept: 'image/*',
                            success: function(queueId, resp) {
                                if(resp.success === false) {
                                    Opf.alert({ title: '图片格式不合法', message: resp.msg || '上传失败'});
                                }else {
                                    $uploadImg.find('img').attr('src', resp.url);
                                }
                            }
                        });
                    }, 1);
                });
            },


            validate: function () {
                var phoneRepeat = this.remittePhoneRepeatValid();

                return !this.$el.find('.has-revise-error').length && phoneRepeat;
            },

            //验证收银员手机是否重复
            remittePhoneRepeatValid: function () {
                var repeatvalid = true;
                var $remitteePhone = this.$el.find('.remittee-phone');
                var repeatHtml = '<span class="help-error phone-repeat">收银员的手机号不能有重复</span>';

                var phoneList = [];

                $remitteePhone.each(function () {
                    $(this).val() && phoneList.push($(this).val());
                });

                // 如果有重复的手机号码 并且 手机验证格式无误，才显示“手机号码重复了”
                if(!listItemAllDiff(phoneList) && !$remitteePhone.hasClass('error')){
                    var $phoneWrap = $remitteePhone.parent();

                    $phoneWrap.addClass('has-error');
                    if($phoneWrap.find('.phone-repeat').length){
                        $phoneWrap.find('.phone-repeat').show();
                    }else{
                        $remitteePhone.after(repeatHtml);
                    }
                    repeatvalid = false;
                }

                return repeatvalid;
            },

            applyMchtData: function () {
                var me = this;
                var $el = me.$el;
                var data = me.data;
                var imageErrorMark = me.errorMark.extraImages || [];
                var viceUsers = data.viceUsers;
                var terminal = data.terminal;
                //收银员部分
                if(viceUsers){
                    var $viceUserCt = $el.find('#add-more-receipt-person');
                    _.each(viceUsers, function (item) {
                        $viceUserCt.append(viceUserTpl(item));
                    });
                }

                //sn部分
                if(terminal) {
                    var $snCt = $el.find('#add-more-pos-machine');
                    _.each(terminal, function (sn) {
                        var $sn = $(snTpl(sn));
                        $sn.find('[name=delete_pos_machine]').click(function(){
                            var me = $(this);
                            Opf.confirm('您确定要解绑该POS机吗？<br><br> 解绑后将无法用该POS机刷交易。', function (result) {
                                if(result) {
                                    Opf.ajax({
                                        type:'PUT',
                                        url:url._('boxSn',{boxSn:sn}),
                                        success:function(data){
                                            Opf.Toast.success('操作成功');
                                            me.closest('.form-group-append').remove();
                                            if($el.find('.pos-section .form-group-append').length < 1){
                                                $el.find('.pos-section .prompt-block').text('无');
                                            }
                                        }
                                    });
                                }
                            });
                        });
                        $snCt.append($sn);

                    });
                }

                //图片部分
                var $imgsCt = $el.find('.imgs-preview');
                var extraImages = _.findWhere(data.images, {name:'extra'});
                if(extraImages) {
                    _.each(extraImages.value.split(','), function (url, imgIdx) {
                        if(!url) return;
                        var isError = imageErrorMark[imgIdx] == 0 ? true:false;
                        var $imgWrap = genImg(url, isError);
                        $imgsCt.append($imgWrap);
                    });
                }

                /**
                 * 有些部分无信息的时候隐藏整块或者显示“无”
                 */
                //经营信息部分
                var $baseSection = $el.find('.base-section');
                //法人代表部分
                var $userSection = $el.find('.user-section');
                //pos部分
                var $posSection = $el.find('.pos-section');
                //收银员部分
                var $receiptSection = $el.find('.receipt-section');
                var $imgSection = $el.find('.img-section');

                //输入框的值可以直接设置
                _.each([$baseSection, $userSection], function ($section) {
                    $section.find(':input[name]').each(function () {
                        $(this).prop('disabled', true);
                        var fieldName = $(this).attr('name');
                        if(data[fieldName]) {
                            $(this).val(data[fieldName]);
                        }
                        else {//如果没有值，则隐藏
                            $(this).closest('.form-group').hide();
                        }
                    });
                });


                _.each([$baseSection, $userSection], function ($section) {
                    if(!$section.find(':input:visible').length) {
                        $section.hide();
                    }
                });

                if(_.isEmpty(data.viceUsers)){
                    $receiptSection.find('.prompt-block').text("无");
                }

                if(_.isEmpty(data.terminal)){
                    $posSection.find('.prompt-block').text("无");
                }

                var extraImageItem = _.findWhere(data.images,{name:'extra'});
                if((extraImageItem && _.isEmpty(extraImageItem.value)) || !extraImageItem) {
                    $('<div class="hx-top-margin20 prompt-block-label">无</div>').insertBefore($imgSection.find('.prompt-block'));
                }

            }


        });

    });

    function genImg (src, error) {
        var cls = error ? 'has-revise-error' : '';
        var tpl = [
            '<div class="col-xs-3 img-wrap ',cls,'"> ',
            '<img src="',src,'?_t=',(new Date()).getTime(),'">',
            error ? '<div class="help-block help-error">删除或者重新上传</div>' : '',
            '</div>'
        ].join('');
        var $img = $(tpl);
        if(error) {
            $img.find('.icon-remove').on('click', function () {
                $img.remove();
            });
            setTimeout(function () {
                new Uploader({
                    data: {
                        name: 'extra',
                        uuid: Ctx.getId()
                    },
                    trigger: $img,
                    action: url._('mcht.upload'),
                    accept: 'image/*',
                    success: function(queueId, resp) {
                        if(resp.success === false) {
                            Opf.alert({ title: '图片格式不合法', message: resp.msg || '上传失败'});
                        }else {
                            $img.find('img').attr('src', resp.url);
                            $img.removeClass('has-revise-error');
                            $img.find('.help-error').remove();
                        }
                    }
                });
            }, 1);
        }
        return $img;
    }

    function viceUserTpl (item) {
        var uid = Opf.Utils.id();
        var strHtml = [
            '<div class="row  form-group form-group-append">',
            '<div class="col-xs-3">',
            '<input type="text" name="remitteeName' + uid + '" value="' + item.name + '" class="form-control remittee-name" placeholder="收银员姓名" style="cursor: not-allowed" disabled="disabled" readonly="true">',
            '</div>',
            '<div class="col-xs-3">',
            '<input type="text" name="remitteePhone' + uid + '"  value="' + item.phone + '" class="form-control remittee-phone" placeholder="收银员手机号" style="cursor: not-allowed" disabled>',
            '</div>',
            '<div class="col-xs-6 delete_receipt_person" style="display: none;"><label class="cancel-append-trigger" isneed="1" name="delete_receipt_person">去除</label></div>',
            '</div>'
        ].join('');

        return strHtml;
    }

    function snTpl (sn) {
        return [
            '<div class="row form-group   form-group-append">',
            '<div class="col-xs-6">',
            '<input type="text" value="',sn,'" disabled="true" name="pos_machine" class="form-control" placeholder="SN序号">',
            '</div>',
            '<div class="col-xs-6 label-text-style delete_pos_machine">',
            '<label style="cursor:pointer;" isneed="1" name="delete_pos_machine">解绑</label>',
            '</div>',
            '</div>'].join('');
    }

    // 遍历数组，如果数组中所有的成员都不相同，则返回 true，否则返回 false
    function listItemAllDiff (array) {
        var isAllDiff = true;
        if(array.length){
            var l = array.length;
            for(var i = 0; i < l-1; i++){
                for(var j = i+1; j < l; j++){
                    if(array[i] === array[j]){
                        isAllDiff = false;
                    }
                }
            }
        }

        return isAllDiff;
    }



    return App.MchtSysApp.Revise.View.Extra;

});