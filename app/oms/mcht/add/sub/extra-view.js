define(['App',
    'tpl!app/oms/mcht/add/templates/add-extra.tpl',
    'i18n!app/oms/common/nls/mcht',
    'app/oms/mcht/add/sub/extra-image-appender',
    'jquery.validate'
], function(App, tpl, mchtLang, ExtraImagerAppender) {


    App.module('MchtSysApp.Add.View', function(View, App, Backbone, Marionette, $, _) {

        View.Extra = Marionette.ItemView.extend({
        	
        	template: tpl,
        	
            tagName: "div",

            className: "mcht-form-group mcht-add-extra",

            ui: {
                form: 'form'
            },

            constructor: function (data) { 
                var me = this;

                Marionette.ItemView.prototype.constructor.apply(this, arguments);

                this.data = data;
            },

            update: function (data) {
                this.data = data;
                this.toggleByKind();
            },

            events: {
                "click .append-trigger": "onAppendTrigger",
                "click .toggle-append-trigger": "onAppendToggleTrigger",

                "click .cancel-append-trigger": "removeAppendGroup",
                "click .cancel-toggle-append-trigger": "removeAppendToggleGroup"
            },

            removeAppendToggleGroup: function (e) {
                //TODO 如果是用隐藏输入部分的方式则不能remove而要
                var $formGroup = $(e.target).closest('.form-group');
                $formGroup.prev('.form-group').show();
                $formGroup.remove();
            },

            removeAppendGroup: function (e) {
                $(e.target).closest('.form-group-append').remove();
            },

            onAppendToggleTrigger: function (e) {
                var $trigger = $(e.target);
                var belong = $trigger.closest('[belong]').attr('belong');
                var $triggerFormGroup = $trigger.closest('.form-group');
                var $label = $triggerFormGroup.find('label');
                var tpl;
                var name = $label.attr('name');

                if(name == 'manageTime') {
                    tpl = this.getTimeHtml();
                }else if (name=='cont') {
                    tpl = this.getFormatContHtml($triggerFormGroup.attr('label'), name, $label.html());
                }else {
                    tpl = this.getFormatHtml($triggerFormGroup.attr('label'), name, $label.html());
                }

                var $inputline = $(tpl).attr('belong', belong);
                $triggerFormGroup.after($inputline).hide();
            },

            onAppendTrigger: function (e) {
                var $trigger = $(e.target).closest('.append-trigger');
                var belong = $trigger.closest('[belong]').attr('belong');
                var name = $trigger.attr('trigger-name');
                var tpl, ct;

                console.log('triggername', name);

                if(name === 'receipt_person') { 
                    tpl = this.getFormatDivHtml(belong);
                    ct = $('#add-more-receipt-person');
                }else if(name === 'pos_machine'){
                    tpl = this.getFormatPosHtml();
                    ct = $('#add-more-pos-machine');
                }
                
                var $inputline = $(tpl).attr('belong', belong);
                ct.append($inputline);
            },

            validate: function() {
                this.attachValidation();
                var phoneRepeat = this.remittePhoneRepeatValid();
                return this.ui.form.valid() && phoneRepeat;
                // zhenyong: 没有添加rules调用valid会出错
                // return this.$el.find("form#submit-data").valid();
            },

            onRender: function () {

                var $el = this.$el;

                var $imgsPreviewCt = $el.find('.imgs-preview');

                new ExtraImagerAppender({
                    trigger: $el.find('.add-img-tirgger'),
                    previewCt: $el.find('.imgs-preview')
                });


                this.toggleByKind();
                this.attachEvents()
            },

            attachEvents: function () {
                var $el = this.$el;
                var $remitteeWrap = this.$el.find('#add-more-receipt-person');
                $remitteeWrap.on('input', '.remittee-phone', function () {
                    $el.find('.phone-repeat').remove();
                    $el.find('.remittee-phone').parent().removeClass('has-error');
                });
            },
            
            attachValidation: function () {
                var me = this;
                // if (!this.hasAttachValidation) {
                    Opf.Validate.addRules(this.ui.form, {
                        ignore: ':hidden,[type="file"]',
                        rules: {
                            mchtCnShortName: {required: true,chinese:true,maxlength:6},
                            mchtEnName: {required: true,english:true,maxlength:40},
                            postcode: {required: true},
                            fax: {required: true},
                            comEmail: {required: true},
                            website: {required: true},
                            openTime: {required: true},
                            closeTime: {required: true},
                            amount: {required: true},
                            contName: {required: true},
                            contPhone: {required: true}
                        }
                    });

                    this.ui.form.find('[name^="remitteeName"]').each(function () {
                        $(this).rules('add', {
                            chineseName: true,
                            minlength:2,
                            required: true
                        });
                    }); 
                   this.ui.form.find('[name^="remitteePhone"]').each(function () {
                        $(this).rules('add', {
                            required: true,
                            mobile: true,
                            mchtMobileDuplicateCheck: {
                                exist: [me.data.userPhone]//TODO 耦合
                            }
                        });
                    });
                // }
                // this.hasAttachValidation = true;
            },
            
            // 主要是针对input做校验，没有对select，textarea，file这些处理
            rxpValid: function(obj, rules) {
            	
            	if ( !obj && $.isEmptyObject(obj)) return false;
            	obj.on("change", function() {
            		var me = $(this), val = me.val();
            		val = val.replace(/^(\s*)|(\s*)$/g, "");
            		if(val.test(rules.rxp)) {
            			if(typeof rules.success == "function")
            				rules.success.call(me, me);
            		}
            	});
            	obj.on("");
            },

            toggleByKind: function() {
                var kind = this.data.mchtKind+'';
                this.$el.find('[belong]').each(function() {
                    var $this = $(this);
                    var belong = $(this).attr('belong');
                    var needShow = belong && belong.indexOf(kind) !== -1;
                    $this.toggle(needShow);
                });

            },

            getValues: function () {
                var ret = {
                    terminal: [],
                    viceUsers: [],
                    _extraImages: []
                };
                //经营信息部分
                $("#add-more-user-message").find(':input:visible').each(function () {
                    ret[$(this).attr('name')] = $(this).val();
                });
                //法人代表部分
                $("#add-more-cont").find(':input:visible').each(function () {
                    ret[$(this).attr('name')] = $(this).val();
                });
                //收银员
                this.$el.find('#add-more-receipt-person').find('.form-group').each(function () {
                    ret.viceUsers.push({
                        name: $(this).find('[name^="remitteeName"]').val(),
                        phone: $(this).find('[name^="remitteePhone"]').val()
                    });
                });
                //sn号
                $('#add-more-pos-machine').find(':input:visible').each(function () {
                    ret.terminal.push($(this).val());
                });
                //图片部分
                this.$el.find('.imgs-preview').find('.img-wrap img').each(function () {
                    var imgSrc = ($(this).attr('src') || '').replace(/\?.*$/,'');
                    ret._extraImages.push(imgSrc);
                });

                return ret;
            },

            getPrimaryUser: function() {
                var data = {};

                var length = message.length;
                var name,value;
                for(var i=0; i<length; i++){
                    name = $(message[i]).attr('name');
                    value = $(message[i]).val();

                    data[name] = value;
                }
                return data;
            },

            getMchtMessage: function() {
                var data = {};
                var message = $("#add-more-user-message").find(':input:visible').each(function () {
                    data[$(this).attr('name')] = $(this).val();
                });
                return data;
            },

            getMchtUserMessage: function() {
                var result = []; 
                this.$el.find('#add-more-receipt-person').find('.form-group').each(function () {
                    result.push({
                        name: $(this).find('[name="name"]').val(),
                        phone: $(this).find('[name="phone"]').val()
                    });
                });
                return result;
            },

            getSN: function() {
                var result = [];
                var message = $('#add-more-pos-machine').find(':input:visible').each(function () {
                    result.push($(this).val());
                });
                return result;
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

            getTimeHtml: function(){
                //TODO
                var arr = [
                '<div class="row form-group">',
                    '<div class="col-xs-2 label-left-boxb">',
                        '<label>营业时间</label>',
                    '</div>',
                    '<div class="col-xs-2 value-time">',
                        '<select class="form-control" name="openTime">'
                ];

                var options = [];
                options.push('<option class="placeholder" selected disabled >-选择时间-</option>');

                for(var i=0; i<24; i++) {
                    var tmp1 = (i < 10 ? '0' + i : i) + ':00';
                    var tmp2 = (i < 10 ? '0' + i : i) + ':30';
                    options.push('<option value="'+tmp1+'">' + tmp1 + '</option>');
                    options.push('<option value="'+tmp2+'">' + tmp2 + '</option>');
                }
                arr.push(options.join(''));

                arr.push(['</select></div>',
                    '<div class="col-xs-1 label-time">',
                        '<label>至</label></div>',
                    '<div class="col-xs-2 value-time">',
                        '<select class="form-control" name="closeTime">'
                        ].join(''));

                arr.push(options.join(''));

                arr.push(['</select></div>',
                    '<div class="col-xs-1">&nbsp;</div>',
                    '<div class="col-xs-3 label-text-style">',
                        '<label isneed="1" class="cancel-toggle-append-trigger" name="delete_format_div">取消</label>',
                    '</div>',
                '</div>'

                ].join(''));

                return arr.join('');
            },

            getFormatDivHtml : function(label, name){
                var uid = Opf.Utils.id();
                var strHtml = [
                '<div class="row form-group form-group-append">',
                    '<div class="col-xs-3">',
                        '<input type="text" name="remitteeName' + uid + '" class="form-control remittee-name" placeholder="收银员姓名">',
                    '</div>',
                    '<div class="col-xs-3">',
                        '<input type="text" name="remitteePhone' + uid + '" class="form-control remittee-phone" placeholder="收银员手机号">',
                    '</div>',
                    '<div class="col-xs-6 "><label class="cancel-append-trigger" isneed="1" name="delete_receipt_person">取消</label></div>',
                '</div>'
                ].join('');

                return strHtml;
            },

            getFormatPosHtml : function(placeholder, leftStyle){
                var strHtml = [
                '<div class="row form-group   form-group-append">',
                    '<div class="col-xs-6">',
                        '<input type="text" name="pos_machine" class="form-control" placeholder="SN序号">',
                    '</div>',
                    '<div class="col-xs-6 label-text-style">',
                        '<label class="cancel-append-trigger" isneed="1" name="delete_pos_machine">取消</label>',
                    '</div>',
                '</div>'
                ].join('');

                return strHtml;
            },

            getFormatContHtml : function(label, name, placeholder){
                var strHtml = [
                '<div class="row form-group">',
                    '<div class="col-xs-2 label-left-boxb">',
                        '<label>',label,'</label>',
                    '</div>',
                    '<div class="col-xs-3 label-right-boxm">',
                        '<input type="text" name="contName" class="form-control" placeholder="姓名">',
                    '</div>',
                    '<div class="col-xs-3 label-right-boxs">',
                        '<input type="text" name="contPhone" class="form-control" placeholder="电话">',
                    '</div>',
                    '<div class="col-xs-4 label-text-style">',
                        '<label class="cancel-toggle-append-trigger" isneed="1" name="delete_format_div">取消</label>',
                    '</div>',
                '</div>'
                ].join('');

                return strHtml;
            },

            getFormatHtml : function(label, name, placeholder){
                var strHtml = [
                '<div class="row form-group ">',
                    '<div class="label-left-boxb col-xs-2">',
                        '<label>',label,'</label>',
                    '</div>',
                    '<div class="label-right-boxb col-xs-6">',
                        '<input type="text" name="',name,'" class="form-control" placeholder="补充',placeholder,'">',
                    '</div>',
                    '<div class="col-xs-4 label-text-style">',
                        '<label isneed="1" class="cancel-toggle-append-trigger" name="delete_format_div">取消</label>',
                    '</div>',
                '</div>'
                ].join('');

                return strHtml;
            }

        });

    });

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



    return App.MchtSysApp.Add.View.Extra;

});