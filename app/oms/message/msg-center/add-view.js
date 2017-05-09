/**
 * @author hefeng
 * @version OMS-Dev2.1.24
 * @date 2015/12/12
 * @description 消息中心
 */
define([
    'app/oms/message/common/common-add',
    'app/oms/auth/role-group/role-select-view'
], function(AddView, RoleSelectView) {
    var _onRender = AddView.prototype.onRender;
    var _validate = AddView.prototype.validate;
    var _ui = AddView.prototype.ui;
    var _events = AddView.prototype.events;

    // 新增消息推送
    var AddMsgCenterOrgView = RoleSelectView.AddView.extend({
        getAvailRolesUrl: function () {
            return url._('push.msg.branchlist');
        },
        getOrgGroupDetailUrl: function () {
            return url._('push.msg.branchlistchosed', {id: this.rowData.id});
        },
        renderOrgGroupDetail: function (rowData) {
            var me = this;
                me.rowData = rowData;
            $.when(me.deferredOrgGroupDetail()).done(function () {
                me.addChildrenView(me._rawDefaultRoles, me._rawOptionRoles);
            });
        },

        //获取已有角色组详情（编辑时）
        deferredOrgGroupDetail: function () {
            var me = this;
            return Opf.ajax({
                type: 'GET',
                url: me.getOrgGroupDetailUrl(),
                success: function (resp) {
                    me._rawDefaultRoles = _.map(resp, function (obj) {
                        //保证候选接口的数据 和 编辑时获取的已选数据同样为字符串
                        return {id: obj.value + '', name: obj.name};
                    });
                }
            });
        }
    });

    return AddView.extend({
        ui: _.extend({
            msgTerminalType: "#msg_push_terminalType",
            msgTerminalTypeContainer: "#msg_push_terminalTypeContainer",
            msgBack: "#msg_push_back",
            msgConfirm: "#msg_push_confirm",
            msgTips: "#msg_push_tips",
            previewContent: "#previewContent",
            uploadPreviewImage: ".section-uploadPreviewImage",
            previewImageContainer: ".preview-container"
        }, _ui),

        events: _.extend({
            'click i.remove-trigger': 'clearPic'
        }, _events),

        onRender: function(){
            _onRender.apply(this, arguments);

            this.listenMsgType();
            this.ajaxSelectOrg();
            this.previewImageUpload();
        },

        listenMsgType: function() {
            var me = this, ui = me.ui;
            ui.msgType.on("click", function() {
                var self = $(this);
                if(self.is(":checked") && self.val() == "2") {
                    me.showPicError();
                } else {
                    me.clearPicError();
                }
            })
        },

        ajaxSelectOrg: function(){
            var me = this, ui = me.ui;

            Opf.UI.setLoading(me.$el, true);

            var addMsgCenterOrgView = ui.addMsgCenterOrgView = new AddMsgCenterOrgView();
            ui.selectOrgRow.append(addMsgCenterOrgView.$el);

            addMsgCenterOrgView.on('ready', function () {
                Opf.UI.setLoading(me.$el, false);
                ui.selectOrgRow.find('.selected-panel>.role-head').text('选中的机构');
                ui.selectOrgRow.find('.options-panel>.role-head').text('可选的机构');
            });
        },

        previewImageUpload: function() {// 消息图片预览
            var me = this, ui = me.ui;
            var $section = ui.uploadPreviewImage,
                $trigger = $section.find('.upload-trigger'),
                $preview = $section.find('.preview-container'),
                $indicator = $section.find('.uploading-indicator'),
                name = $section.attr('name'),
                uploading = false,
                aborted = false;
            var uploader = new Uploader({
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
                action: this.uploadPreviewImageUrl,
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

                        //上传成功即清除图片错误信息
                        me.clearPicError();
                    }
                }
            });
        },

        validate: function(){
            var me = this, ui = me.ui;
            var msgType = ui.msgType.filter(':checked').val();

            var isValid = _validate.apply(this, arguments);
            var isOrgValid = ui.selectOrgRow.is(':visible')? ui.addMsgCenterOrgView.validate():true;
            var hasPreviewImage = msgType == "2"? me.showPicError():true;

            return isValid && isOrgValid && hasPreviewImage;

        },

        updateUi: function() {
            var ui = this.ui;
            var kind = 'A1';
            this.uploadUrl = url._('upload.center.xls');
            this.uploadPreviewImageUrl = url._('upload.center.preview.image');
            this.$el.find('tr.FormData').each(function(){
                var $this = $(this);
                var belong = $this.attr('belong') || false;
                var neeShow = belong && belong.indexOf(kind) !== -1;
                $this.toggle(neeShow);
            });

            ui.pushContentTr.hide();
            ui.pushObjectTr.find('.CaptionTD').text('发送对象');
            ui.pushDeviceTr.find('.CaptionTD').text('发送设备');
        },

        showPicError: function() {
            var me = this, ui = me.ui, flag = true;

            var $img = ui.previewImageContainer.find('img');
            var imgUrl = $.trim($img.attr("src").toString());
            var $uploadTrigger = $img.closest(".upload-trigger");

            if(ui.previewImageUrlTr.is(':visible') && (imgUrl==="" || $uploadTrigger.hasClass('has-error'))) {
                flag = false;
                $uploadTrigger.addClass("has-error");
            }

            return flag;
        },

        clearPic: function(){
            var me = this, ui = me.ui;
            var $section = ui.uploadPreviewImage;
            var $upload = $section.find('.upload-trigger');
            var $preview = $section.find('.preview-container');

            $preview.hide().find('img').attr('src', '');
            $upload.removeClass('hasPic');
            $section.removeClass('uploaded');
        },

        clearPicError: function(){
            var me = this, ui = me.ui;
            var $section = ui.uploadPreviewImage;
            var $upload = $section.find('.upload-trigger');

            $upload.removeClass("has-error");
        },

        setDefaultData: function(data) {
            var me = this, ui = me.ui;

            var pushObject = data.pushObject;
            var msgType = me._getValueStr(pushObject, 0);
            var btn = ui.msgTerminalType.find('button[data-msg-type="'+msgType+'"]');
                btn.trigger('click'); //第一次trigger设置radio的value值

            ui.pushObject.eq(1).prop('checked', true);
            ui.pushObject.filter('[value="'+pushObject+'"]').prop('checked', true);
            ui.pushObjectRange.filter('[value="'+pushObject+'"]').prop('checked', true);

            //ui.pushObject.val(data.pushObject);
            me.setPushDetailValue(data);
            me.setPushDeviceValue(data.pushDevice);
            ui.msgSubject.val(data.msgSubject);
            me.setMsgContent(data.msgType, data.msgContent);

            ui.isPush.prop('checked', data.isPush == "1").trigger('change');
            ui.pushContent.val(data.pushContent);

            me.setPushTypeValue(data.pushType);
            me.setPushDateValue(data.pushDate);

            //设置钱盒用户默认消息内容
            if(msgType==1){
                data.previewContent && ui.previewContent.val(data.previewContent); // 消息预览内容
                data.previewImageUrl && me.setPreviewImageUrl(data.previewImageUrl); //消息图片预览
            }

            btn.trigger('click'); //第二次trigger触发change事件
        },

        setPreviewImageUrl: function(value){
            var me = this, ui = me.ui;
            var $section = ui.uploadPreviewImage;
            var $trigger = $section.find('.upload-trigger');
            var $preview = $section.find('.preview-container');
            var $img = $preview.find('img');

            $trigger.addClass('hasPic');
            $img.attr('src', value + '?_t=' + (new Date()).getTime());
            $preview.show();
        },

        setMsgContent: function (msgType, msgContent) {
            var $el = this.$el;
            var $msgType = $el.find('[name="msgType"][value='+ msgType +']');
                $msgType.prop('checked', true).trigger('change');
                $el.find('.msgContent[name="msgContent'+msgType+'"]').val(msgContent);
        },

        getMsgType: function () {
            return 'msgCenter';
        },

        getPreviewContent: function(){
            var me = this, ui = me.ui;
            if(ui.previewContentTr.is(':visible')){
                return ui.previewContent.val();
            }
        },

        getPreviewImageUrl: function () {
            var me = this, ui = me.ui;
            if(ui.previewImageUrlTr.is(':visible')){
                return (ui.previewImageContainer.find('img').attr('src')||'').replace(/\?.*$/,'');
            }
        },

        getValue: function() {
            var me = this, ui = this.ui;
            var posationVal = [];
            me.$el.find('input[name="showPosition"]:checked').each(function(){
                posationVal.push($(this).val());
            });
            return _.extend({
                //pushObject: ui.pushObject.filter(':checked').val(),
                //pushDetail: me.getPushDetail(),
                pushDevice: ui.pushDevice.val(),

                msgSubject: ui.msgSubject.val(),
                msgType: ui.msgType.closest(':checked').val(),
                msgContent: me.$el.find('.msgContent:visible').val(),

                isPush: ui.isPush.prop('checked') ? 1 : 0,
                pushContent: me.getPushContent(),

                pushType: ui.pushType.closest(':checked').val(),
                pushDate: me.getPushDate(),

                posation: posationVal.toString(),//显示位置
                validityTime: me.getValiTime(), //有效期至
                
                previewContent : me.getPreviewContent(), // 消息预览内容
                previewImageUrl : me.getPreviewImageUrl() //me.$el.find('input[name="uploadPreviewImageFile"]').val() //ui.previewImageUrl.val()// 消息预览图片地址
            }, me.getPushObject(), me.getPushDetail());
        }
    });
});