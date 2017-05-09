define([
    'tpl!app/oms/message/push-sm/add/templates/addSm.tpl',
    'app/oms/message/common/timeSelect',
    'jquery.validate',
    'jquery.autosize',
    'upload'
    ], function(Tpl,timeSelectView){

        var RESEND_TIMES = 1,

            CHAR_TO_TYPE = 262,

            LENGTH_OF_ONE_SM = 64,

            PUSHAPP_MAP = {
                "ALL_CASH_BOX" : "11",
                "SOME_CASH_BOX" : "12",
                "ALL_PERSONAL_TERMINAL" : "21",
                "SOME_PERSONAL_TERMINAL" : "22",
                "ALL_KAI_TONG_BAO": "31",
                "SOME_KAI_TONG_BAO": "32"
            },

            PUSHDEVICE_MAP ={
                //1-所有用户 2-Android用户 3-ios用户 4-导入用户 5-输入号码
                "allUser": "1",
                "AndroidUser": "2",
                "IOSUser": "3",
                "importUser": "4",
                "inputNo": "5"
            };

        var View = Backbone.Marionette.ItemView.extend({
            events: {
                'click .add-sm-categories' : 'showAddCategories'
            },

            template: Tpl,

            ui: {
                pushApp: '.push-app',
                pushDevice: '.push-device',
                trPushDevice: '#tr_pushDevice',
                pushDate: '#tr_pushDate',
                trPhoneNo: '#tr_inputPhoneNo',
                upload: '#tr_uploadPhoneNo',
                triggerUpload: '#id-add-attachment',
                inputPhoneNo: '.phone-no',
                smCategory: '.sm-category',
                smContent: '.sm-content',
                smContentTip: '.sm-content-tip',
                pushType: '.push-type',
                reSend: '.need-resend'

            },

            mixinTemplateHelpers: function(data){
                var me = this;
                data.CHAR_TO_TYPE = CHAR_TO_TYPE;
                return data;
            },

            initialize: function(){
                this.render();
            },

            onRender: function(){
                this.ui.smContent.autosize();
                this.ui.inputPhoneNo.autosize();
                this.addTimeSelectEl();
                this.attachEvent();
                this.addValidation();
            },

            addTimeSelectEl: function(){
                var me = this;
                var minPushDate = moment().add('minute', 30);
                me.timeSelectView = new timeSelectView({startDate: new Date(minPushDate)});
                var $timeSelect = me.timeSelectView.$el;
                me.ui.pushDate.find('.DataTD').append($timeSelect);
                    
            },

            attachEvent: function(){
                var me = this,
                    ui = this.ui;

                ui.pushApp.on('change', function(event){
                    ui.pushDevice.find('option').show();
                    // hideAndSelctOpt;
                    if($(this).val() == "11" || 
                        $(this).val() == "21" ||
                        $(this).val() == "31"){
                        ui.pushDevice.find('option[value="1"]').prop('selected',true);
                        ui.pushDevice.find('option[value="4"]').hide();
                        ui.pushDevice.find('option[value="5"]').hide();
                    } else {
                        ui.pushDevice.find('option[value="1"]').hide();
                        ui.pushDevice.find('option[value="2"]').hide();
                        ui.pushDevice.find('option[value="3"]').hide();
                        ui.pushDevice.find('option[value="4"]').prop('selected',true);
                    }
                    ui.pushDevice.trigger('change');
                }).trigger('change');

                ui.pushDevice.on("change", function(event){

                    ui.trPhoneNo.remove();
                    ui.upload.remove();

                    if(this.value === PUSHDEVICE_MAP["inputNo"]){
                        ui.trPhoneNo.insertAfter(ui.trPushDevice).show();
                    } else if(this.value === PUSHDEVICE_MAP["importUser"]){
                        me.showUpload();
                    }

                });

                ui.pushType.on("change", function(event){
                    ui.pushDate.hide();
                    if(this.value === "2"){
                        ui.pushDate.show();
                    }
                });

                ui.smContent.on("input", function(event){
                    var charLeft = CHAR_TO_TYPE - $(this).val().length,
                        SmAmount = parseInt($(this).val().length / (LENGTH_OF_ONE_SM + 1)) + 1;
                    ui.smContentTip.text("可输入" + charLeft + "字（" + SmAmount + "条短信）");
                });

                this.listenTo(this.collection, 'sync', function(collection, resp){
                    var names = collection.pluck('name'),
                        ids = collection.pluck('id');

                    generateSmCategory(names, ids);

                });

                function generateSmCategory(names, ids){
                    for (var i = 0, optionsStr = ''; i < names.length; i++) {
                        optionsStr += '<option value="' + ids[i] + '">' + names[i] + '</option>';
                    }
                    ui.smCategory.empty().append($(optionsStr));
                }
            },

            addValidation: function(){
                jQuery.validator.addMethod('phoneNos', function(value, element){
                    var arr = [],
                        mobile_reg = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(17[067])|(18[0-9]{1}))+\d{8})$/,
                        result = true;
                    value.indexOf(',') === -1 ? arr.push(value) : arr.concat(value.split(','));
                    for(var i = arr.length - 1; i >= 0; i--){
                        if( arr[i].length != 11 || !mobile_reg.test(arr[i])){
                            result = false;
                            break;
                        }
                    }
                    return this.optional(element) || result;
                },'格式不对');
                this.$('form').validate({
                    rules:{
                        "sm-content": {required: true},
                        "push-app": {required: true},
                        "push-device": {required: true},
                        "sm-category": {required: true},
                        "phone-no": {required: true, phoneNos: true}
                    },
                    messages:{
                        "sm-content": {required: "请输入短信内容"},
                        "push-app": {required: "请选择发送对象"},
                        "sm-category": {required: "请新建短信类型"},
                        "push-device": {required: "请选择发送用户"},
                        "phone-no": {required: "请输入手机号码"}
                    }
                });
            },

            showAddCategories: function(){
                var me = this;
                require([
                        'app/oms/message/push-sm/add/add-sm-categories'
                    ], function(AddCategoriesView){
                        var addCategoriesView = new AddCategoriesView();
                        var $dialog = Opf.Factory.createDialog(addCategoriesView.render().$el,{
                            destroyOnClose: true,
                            title: '添加短信类型',
                            autoOpen: true,
                            width: 550,
                            height: 550,
                            modal: true,
                            close: function(){
                                me.collection.fetch({
                                    reset: true
                                }).done(function(){
                                    me.ui.smCategory.find(':last-child').trigger('click');
                                });
                            }
                        });
                });
            },


            showUpload: function(){
                var me  = this,
                    ui = me.ui,
                    defer = $.Deferred();
                require(['app/oms/message/common/uploadXLS'], function(UploadView){
                    var tpl = _.template([
                            '<div class="xlsFile-info" style="display: none;">',
                                '<label class="xlsFile-name"></label>',
                            '</div>',
                            '<span class="upload-file-trigger" style="display: inline-block; position: relative;">',
                                '<label data-set="<%= name %>" class="btn-upload-file">上传文件</label>',
                                '<input type="text" name="<%= name %>" style="display: none">',
                            '</span>'
                        ].join(''));
                    UploadView.extend({
                        template: tpl
                    });
                    var uploadView = me.uploadView = new UploadView({
                        data:{ name: 'phoneNo', tid: Ctx.getId() },
                        url: url._('upload.xls')
                    });
                    uploadView.on('upload:success', function(){
                        var $el = this.$el;
                        $el.closest('.upload_container').removeClass('has-error');
                        $el.find('.file-upload-error').remove();
                    });
                    ui.upload.find('.upload_container').empty().append(uploadView.render().$el);
                    ui.upload.insertAfter(ui.trPushDevice).show();
                    me.hasShownBefore = true;
                    defer.resolve();
                });
                return defer.promise();
            },

            getID: function(){
                return this.id;
            },

            setID: function(value){
                return this.id = value;
            },

            getAppType: function(){
                return this.ui.pushApp.val();
            },

            setAppType: function(value){
                this.ui.pushApp.val(value);
            },

            getDeviceType: function(){
                return this.ui.pushDevice.val();
            },

            setDeviceType: function(value){
                this.ui.pushDevice.val(value);
            },

            getPhoneNoFiles: function(){
                if(this.getDeviceType() === PUSHDEVICE_MAP["importUser"]){
                    return me.uploadView.getFileIds();
                }
                return [];
            },

            getCustomPhoneNos: function(){
                if (this.getDeviceType() === PUSHDEVICE_MAP["inputNo"]) {
                    return this.ui.inputPhoneNo.val().split(",");
                }
                return [];
            },

            setCustomPhoneNos: function(value){
                value && this.ui.inputPhoneNo.val(value);
            },

            getSmCategory: function(){
                return this.ui.smCategory.val();
            },

            setSmCategory: function(value){
                this.ui.smCategory.val(value);
            },

            getContent: function(){
                return _.escape(this.ui.smContent.val());
            },

            setContent: function(value){
                this.ui.smContent.val(value).trigger('input');
            },

            getSendTime: function(){
                var ui = this.ui,
                    sendTime = '';
                if(this.getPushType() === "2"){
                    sendTime = this.timeSelectView.getTime();
                }

                return sendTime;
            },

            setSendTime: function(value){
                value && this.timeSelectView.setTime(value);
                this.ui.pushType.trigger("change");
            },

            getPushType: function(){
                return this.ui.pushType.val();
            },

            setPushType: function(value){
                this.ui.pushType.val(value);
            },

            getResendTimes: function(){
                return this.ui.reSend.prop('checked') ? RESEND_TIMES : 0;
            },

            setResendTimes: function(value){
                this.ui.reSend.prop('checked', value != "0");
            },

            getPhoneNoFile: function() {
                var ui = this.ui,
                    phoneNo = '';
                if(this.getDeviceType() === PUSHDEVICE_MAP["importUser"]){
                    phoneNo = this.$('input[name="phoneNo"]').val();
                }

                return phoneNo;
            },

            setPhoneNoFile: function(value) {
                var me = this;
                if(value){
                    this.showUpload()
                        .done(function(){
                            me.uploadView.trigger('upload:success');
                            me.uploadView.loadFileUrl(value);
                    });
                }
            },


            setDefaultValue: function(data){
                this.setID(data.id);
                this.setAppType(data.appType);
                this.setDeviceType(data.deviceType);
                this.setSmCategory(data.smCategory);
                this.setPhoneNoFile(data.phoneNoFile);
                this.setCustomPhoneNos(data.customPhoneNos);
                this.setContent(data.content);
                this.setPushType(data.pushType);
                this.setSendTime(data.sendTime);
                this.setResendTimes(data.resendTimes);
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
                var filePath = ui.upload.find('[name="phoneNo"]').val();
                var $uploadTrigger = ui.upload.find('.btn-upload-file');

                if(ui.pushDevice.val() !== PUSHDEVICE_MAP["importUser"]){
                    return true;
                }

                if(!filePath) {
                    ui.upload.addClass('has-error');
                    if( ui.upload.find('.file-upload-error').length < 1 ) {
                        var errorHtml = '<div class="help-error file-upload-error"> 需要上传文件 </div>';
                        $uploadTrigger.after(errorHtml);
                    }
                    return false;
                }

                return true;
            },

            selectUploadFile: function(){
                return !this.$('#tr_uploadPhoneNo').length || !!this.$('#tr_uploadPhoneNo').find('li').length;
            },

            showUploadTip: function(){
                this.$('label[for="upload-file"]').addClass('error').show();
            },

            hideUploadTip: function(){
                this.$('label[for="upload-file"]').removeClass('error');
            }


        });


        return View;
});