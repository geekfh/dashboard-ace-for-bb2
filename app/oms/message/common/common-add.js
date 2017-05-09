define([
    'tpl!app/oms/message/common/templates/add.tpl',
    'app/oms/message/common/uploadXLS',
    'app/oms/message/common/add-push-validate',
    'app/oms/message/common/timeSelect',
    'bootstrap-datepicker',
    'moment.override',
    'common-ui',
    'jquery.autosize'
], function(tpl, UploadXLS, PushValidUtils, timeSelectView) {

    var PUSH_DEVICE_MAP = [
        { belongPost: '1', value: '1', text: '所有用户'},
        { belongPost: '1', value: '2', text: 'Android用户'},
        { belongPost: '1', value: '3', text: 'ios用户'},
        { belongPost: '2', value: '4', text: '导入用户'}
    ];

    var PUSH_POSITION_MAP = [
        { belongPre: '1,2,3,6', value: '1', text: '打开主页面'},
        { belongPre: '1', value: '2', text: '打开交易流水页面'},
        { belongPre: '1', value: '3', text: '打开清算结果页面'},
        { belongPre: '1,3', value: '4', text: '打开消息中心'}
    ];

    var view = Marionette.ItemView.extend({
        template: tpl,
        events: {
            'change [name="pushObject"]': 'changePushObject',//发送对象
            'change [name="pushObjectRange"]': 'changePushObjectRange',//发送对象范围
            'click button.uploadBtn': 'uploadFile',
            'change input[name="msgType"]': 'changeMsgType',//消息正文
            'change input[name="pushType"]': 'changePushType',//推送时间
            'change input[name="isPush"]': 'changeIsPush',//推送通知
            'change input[name="validityTime"]': 'changeValidityTime'//有效期
        },

        ui: {
            //A1,A2
            pushObject: '[name="pushObject"]',
            pushObjectRange: '[name="pushObjectRange"]',
            receiveId: '[name="receiveId"]',
            uploadFile: '.uploadFile',
            pushDevice: 'select[name="pushDevice"]',
            //A1 消息标题，消息内容
            msgSubject: 'input[name="msgSubject"]',
            msgType: 'input[name="msgType"]',
            textareaContent: '#textarea-content',
            inputContent: '#input-content',
            //A2 APP接收后打开位置
            pushPosition: 'select[name="pushPosition"]',
            //A1,A2
            pushType: 'input[name="pushType"]',
            pushDateDD: '[name="pushDate-dd"]',
            pushDateHH: '[name="pushDate-hh"]',
            pushDateMM: '[name="pushDate-mm"]',

            //A1 是否需要推送消息
            isPush: 'input[name="isPush"]',

            //A1,A2
            pushContent: 'textarea[name="pushContent"]',
            showPosition: 'input[name="showPosition"]',//显示位置
            validityTime: 'input[name="validityTime"]',//有效期至
            limitTime: 'input[name="limitTime"]',//限制日期

            pushDetailLabel: '#label_pushDetail',
            selectUserLabel: '#label_selectUser',
            selectOrgLabel: '#label_selectOrg',

            pushDetailRow: '#row_pushDetail',
            selectUserRow: '#row_selectUser',
            selectOrgRow: '#row_selectOrg',
            userSystemRow: '#row_userSystem',
            userSystem1: '#userSystem1',
            userSystem2: '#userSystem2',

            pushObjectTr: '#tr_pushObject',
            pushDeviceTr: '#tr_pushDevice',
            pushPositionTr: '#tr_pushPosition',
            pushObjectRangeTr: '#tr_pushObjectRange',
            pushContentTr: '#tr_pushContent',
            pushDateTr: '#tr_pushDate',
            pushMsgValidityTr:'#tr_MsgValidity',//有效期至
            pubshMsgPositionTr:'#tr_MsgPosition',//显示位置
            validityTimeTr: '#tr_validityTime',//短期有效期的时间选择框
            previewImageUrlTr : '#tr_previewImageUrl',// 消息预览图片
            previewContentTr : '#tr_previewContent'// 消息预览内容
        },

        initialize: function() {
            this.DD = '';
            this.HH = '';
            this.MM = '';
        },

        onRender: function() {
            this.updateUi();
            this.ui.limitTime.datepicker( {autoclose: true, format: "yyyy-mm-dd"} );
            this.ui.pushMsgValidityTr.hide();//有效期至
            this.ui.pubshMsgPositionTr.hide();//显示位置
            this.$el.find('textarea').autosize();
            this.attachUpload();
            this.addTimeSelectEl();
            this.attachValidation();
            
            this.$el.find('#tr_pushPosition').hide();

            //重新Render
            this.doRender();
        },

        doRender: function(){
            var me = this, ui = me.ui, timeout = null;
            var btns = ui.msgTerminalType.find('button');

            btns.on('click', function(){
                var self = $(this);

                btns.removeClass('btn-success');
                self.addClass('btn-success');

                var msgType = self.attr('data-msg-type');

                ui.pushObject.eq(0).val(msgType+"1");
                ui.pushObject.eq(1).val(msgType+"2");

                ui.pushObjectRange.eq(0).val(msgType+"2");
                ui.pushObjectRange.eq(1).val(msgType+"3");
                ui.pushObjectRange.eq(2).val(msgType+"4");

                ui.previewImageUrlTr.toggle("1"==msgType && me.getMsgType()=='msgCenter' || "5"==msgType && me.getMsgType()=='msgCenter');
                ui.previewContentTr.toggle("1"==msgType && me.getMsgType()=='msgCenter' || "5"==msgType && me.getMsgType()=='msgCenter');

                ui.pushObject.filter(':checked').trigger('change');
                ui.pushObjectRange.filter(':checked').trigger('change');

                // 选择用户范围(防多次调用)
                clearTimeout(timeout);
                timeout = setTimeout(function(){
                    CommonUI.selectMsgUsers(ui.receiveId, {appType:msgType});
                }, 100);
            });

            // 注册回退事件
            ui.msgBack.on('click', function(){
                me.doBack();
            });

            // 添加上传控件提示信息
            me.ui.uploadFile.find('span.upload-file-trigger')
                .tooltip({
                    placement: 'right',
                    title: '钱盒推送导入用户id，开通宝推送导入操作员id'
                })
            ;
        },

        doNext: function(){
            var me = this, ui = me.ui;

            //设置当前所选终端类型
            var btn = $('button.btn-success', ui.msgTerminalType);
            ui.msgTerminalTypeContainer.html('&nbsp;&nbsp;'+btn.text());

            //改变按钮文字
            var $dialogWrap = this.ui.msgTerminalType.closest('.ui-dialog');
            var $submit = $dialogWrap.find('button[type="submit"]');
            $submit.find('span.text').length>0 ?
                $submit.find('span.text').text('提交审核'):
                $submit.text('提交审核');

            ui.msgTerminalType.hide();
            ui.msgConfirm.show();
        },

        doBack: function(){
            var me = this, ui = me.ui;

            //改变按钮文字
            var $dialogWrap = ui.msgTerminalType.closest('.ui-dialog');
            var $submit = $dialogWrap.find('button[type="submit"]');
            $submit.find('span.text').length>0 ?
                $submit.find('span.text').text('下一步'):
                $submit.text('下一步');

            ui.msgTerminalType.show();
            ui.msgConfirm.hide();
        },

        nextValidate: function(){
            var me = this, ui = me.ui;
            var btns = ui.msgTerminalType.find('button');
            var isOk = btns.hasClass('btn-success');
            if(isOk){
                ui.msgTips.removeClass('help-error');
            } else {
                ui.msgTips.addClass('help-error');
            }
            return isOk;
        },

        updateUi: function(){},

        attachUpload: function() {
            var url = this.uploadUrl;
            this.uploadXLS = new UploadXLS({
                data:{ name: 'pushDetail', tid: Ctx.getId() },
                url: url
            }).render();

            this.ui.uploadFile.append(this.uploadXLS.$el);

            this.uploadXLS.on('upload:success', function(){
                var $el = this.$el;
                $el.closest('.uploadFile').removeClass('has-error');
                $el.find('.file-upload-error').remove();
            });
        },
        attachValidation: function () {
            PushValidUtils.addRules4Info(this.$el.find('form:first'));
        },

        addTimeSelectEl: function() {
            var minPushDate = moment().add('minute', 30);
            this.timeSelectView = new timeSelectView({startDate: new Date(minPushDate)});
            var $timeSelect = this.timeSelectView.$el;
            this.ui.pushDateTr.find('.DataTD').append($timeSelect);
            //添加有效期的时间选择框
            this.timeSelectView2 = new timeSelectView({startDate: new Date(minPushDate)});
            var $timeSelect2 = this.timeSelectView2.$el;
            this.ui.validityTimeTr.find('.DataTD').append($timeSelect2);
        },

        changePushObject: function(e){
            var value = $(e.target).val(), options = [];
            var showUpload = value.split('').pop() == 2;
            this.ui.pushObjectRangeTr.toggle(showUpload);
            this.ui.uploadFile.data('validate', showUpload);

            var isKtbao = value.split('')[0] == 3;//是否开通宝用户
            var isHehuoren = value.split('')[0] == 6;//是否是盒伙人
            var isMsgCenter = this.getMsgType() == 'msgCenter'; //消息中心

            //如果是消息中心
            if(isMsgCenter){
                this.ui.pushMsgValidityTr.toggle(isKtbao);//有效期至
                this.ui.selectOrgLabel.toggle(isKtbao); //选择机构Label
                this.ui.pubshMsgPositionTr.toggle(isKtbao);//显示位置
                this.ui.pushMsgValidityTr.toggle(isHehuoren);//有效期至
                this.ui.pubshMsgPositionTr.toggle(isHehuoren);//显示位置
            } else { //消息推送
                //TOD
            }

            //改变推送设备的选项
            this.ui.pushDevice.empty();
            var belongPost = value.split('').pop();
            var deviceOptions = _.where(PUSH_DEVICE_MAP, {belongPost: belongPost});
            _.each(deviceOptions, function(item){
                options.push('<option value='+ item.value +'>'+ item.text +'</option>');
            });
            this.ui.pushDevice.append(options.join(''));
            //改变App打开位置
            this.ui.pushPosition.empty();
            options = [];
            var belongPre = value.split('')[0];
            _.each(PUSH_POSITION_MAP, function(item){
                if(item.belongPre.indexOf(belongPre) !== -1){
                    options.push('<option value='+ item.value +'>'+ item.text +'</option>');
                }
            });
            this.ui.pushPosition.append(options.join(''));
        },

        changePushObjectRange: function(e){
            this.ui.pushDetailRow.hide();
            this.ui.selectUserRow.hide();
            this.ui.selectOrgRow.hide();
            this.ui.userSystemRow.hide(); //用户体系
            this.ui.isPush.prop('disabled', false); //消息推送

            var isOriginalEvent = !!e.originalEvent;
            var value = $(e.target).val();
            var isKtbao = value.split('')[0] == 3;//是否开通宝用户
            var isMsgCenter = this.getMsgType() == 'msgCenter'; //消息中心

            switch (value.split('').pop()){
                case "2": //上传用
                    this.ui.pushDetailRow.show();
                    isMsgCenter && isKtbao && this.ui.userSystemRow.show();
                    break;
                case "3": //选择用户
                    this.ui.selectUserRow.show();
                    isMsgCenter && isKtbao && this.ui.userSystemRow.show();
                    break;
                case "4": //选择机构
                    if(isOriginalEvent){ //click/trigger click
                        this.ui.selectOrgRow.show();
                    } else {
                        isMsgCenter && isKtbao && this.ui.selectOrgRow.show();
                    }
                    this.ui.isPush.prop('checked', false).prop('disabled', true).trigger('change');
                    break;
                default:
                    break;
            }
        },

        getMsgType: function(){

        },

        changeMsgType: function(e){
            var value = $(e.target).val();
            this.ui.textareaContent.toggle(value == 1);
            this.ui.inputContent.toggle(value == 2);
        },

        changePushType: function(e){
            var value = $(e.target).val();
            this.ui.pushDateTr.toggle(value == 2);
        },

        changeValidityTime: function(e){
            var value = $(e.target).val();
            this.ui.validityTimeTr.toggle(value == 2);
        },

        changeIsPush: function(e){
            var checkable = $(e.target).prop('checked');
            this.ui.pushContentTr.toggle(checkable);
        },

        _getValueStr: function(val, idx){
            return val.split('')[idx];
        },

        getPushObject: function(){
            var me = this, ui = me.ui, $el = me.$el;
            var pushObjectObj = {};
            var pushObjectValue = ui.pushObject.filter(':checked').val();
            var pushObjectRangeCk = ui.pushObjectRange.filter(':checked');

            //如果选择的是"部分用户"且用户范围不是"上传用户"
            if(me._getValueStr(pushObjectValue, 1)=="2"){
                pushObjectValue = pushObjectRangeCk.val();
            }
            pushObjectObj.pushObject = pushObjectValue;

            return pushObjectObj;
        },

        getPushDetail: function() {
            var ui = this.ui, $el = this.$el;
            var pushDetailObj = {};

            if(ui.pushDetailRow.is(':visible')){
                pushDetailObj.pushDetail = $el.find('input[name="pushDetail"]').val();
            }

            if(ui.selectUserRow.is(':visible')){
                pushDetailObj.receiveId = ui.receiveId.val();
            }

            if(ui.selectOrgRow.is(':visible')){
                pushDetailObj.brch = ui.addMsgCenterOrgView.getSelectedRoles();
            }

            if(ui.userSystemRow.is(':visible')){
                var userSystem1 = ui.userSystem1,
                    userSystem2 = ui.userSystem2;
                var sysValue;

                if(userSystem1.is(':checked') && userSystem2.is(':checked')) {
                    sysValue = "3";
                } else if(userSystem1.is(':checked')) {
                    sysValue = "1";
                } else if(userSystem2.is(':checked')) {
                    sysValue = "2";
                } else {}

                pushDetailObj.system = sysValue;
            }

            return pushDetailObj;
        },

        getPushDate: function() {
            var ui = this.ui;
            var pushDate = '';
            if(ui.pushDateTr.is(':visible')){
                pushDate = this.timeSelectView.getTime();
            }

            return pushDate;
        },
        getValiTime: function() {
            //var ui = this.ui;
            //var valiTime = '';
            //var type = $('input[name=validityTime]:checked').val();
            ////if(ui.validityTimeTr.is(':visible')){
            //    valiTime = type == '2' ? this.timeSelectView2.getTime() : type;
            ////}
            var type = $('input[name=validityTime]:checked').val();
            var valiTime = type == '2' ? this.timeSelectView2.getTime() : type;
            return valiTime;
        },

        getPushContent: function() {
            var ui = this.ui, $el = this.$el;
            var pushContent = '';
            if(ui.pushContentTr.is(':visible')){
                pushContent = $el.find('[name="pushContent"]:visible').val();
            }

            return pushContent;
        },

        setPushDetailValue: function(data) {
            var me = this, ui = me.ui;
            var sysValue = data.system;
            var pushObject = data.pushObject;
            var pushDetailValue = me._getValueStr(pushObject, 1);

            if(pushDetailValue==2){
                //上传用户
                var pushDetail = data.pushDetail;
                if(pushDetail){
                    me.uploadXLS.trigger('upload:success');
                    me.uploadXLS.loadFileUrl(pushDetail);
                    setUserSystem(sysValue);
                }
            }

            //设置默认用户
            if(pushDetailValue==3){
                var userId = data.receiveId;
                var msgType = me._getValueStr(pushObject, 0);
                if(userId){
                    var receiveObj = {
                        appType: msgType,
                        defaultValue: userId
                    };
                    ui.receiveId.data('receiveObj', receiveObj);
                    setUserSystem(sysValue);
                }
            }

            //设置默认机构
            if(pushDetailValue==4){
                ui.addMsgCenterOrgView.renderOrgGroupDetail(data);
            }

            //设置用户体系
            function setUserSystem(sysValue){
                var userSystem1 = ui.userSystem1,
                    userSystem2 = ui.userSystem2;

                if(sysValue==1){
                    userSystem1.prop('checked', true);
                } else if(sysValue==2){
                    userSystem2.prop('checked', true);
                } else if(sysValue==3) {
                    userSystem1.prop('checked', true);
                    userSystem2.prop('checked', true);
                } else {}
            }
        },

        setPushDeviceValue: function(value) {
            var options = [];
            this.ui.pushDevice.empty();
            var belong = _.findWhere(PUSH_DEVICE_MAP, {value: value}).belong;
            var optionObj = _.where(PUSH_DEVICE_MAP, {belong: belong});
            _.each(optionObj, function(item){
                options.push('<option value='+ item.value +'>'+ item.text +'</option>');
            });
            this.ui.pushDevice.append(options.join(''));
            this.ui.pushDevice.val(value);
        },

        setPushTypeValue: function(value) {
            var $pushType = this.$el.find('[name="pushType"][value='+ value +']');
            $pushType.prop('checked', true).trigger('change');
        },

        setPushDateValue: function(value) {
            value && this.timeSelectView.setTime(value);
        },

        validate: function() {
            var fileError = this.showFileError();
            if(this.$el.find('.has-revise-error:visible').length) {
                return false;
            }
            return this.$el.find("form").valid() && fileError;
        },

        showFileError: function () {
            var ui = this.ui;
            var filePath = ui.uploadFile.find('[name="pushDetail"]').val();
            var $uploadTrigger = ui.uploadFile.find('.btn-upload-file');

            if(!ui.pushDetailRow.is(':visible')){
                ui.uploadFile.removeClass('has-error');
                ui.uploadFile.find('.file-upload-error').remove();
                return true;
            }

            if(!ui.uploadFile.data('validate')){
                return true;
            }

            if(!filePath) {
                ui.uploadFile.addClass('has-error');
                if( ui.uploadFile.find('.file-upload-error').length < 1 ) {
                    var errorHtml = '<div class="help-error file-upload-error"> 需要上传文件 </div>';
                    $uploadTrigger.after(errorHtml);
                }
                return false;
            }

            return true;
        }
    });

    return view;
});