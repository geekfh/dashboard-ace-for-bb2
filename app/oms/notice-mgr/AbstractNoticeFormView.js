//TODO 销毁的时候销毁掉editor
define([
    'tpl!app/oms/notice-mgr/templates/new-notice-form.tpl',
    'assets/scripts/fwk/component/common-editor-attachment',
    'assets/scripts/fwk/component/common-editor',
    'select2'
], function(tpl, AttachmentView, NoticeEditor) {

    var View = Marionette.ItemView.extend({

        //@abstract
        btnSubmitText: 'xxx',
        
        //@abstract
        ajaxOptions: null,

        className: 'notice-form-panel clearfix',

        template: tpl,

        ui: {
            'targetBrhRadioCustom': '[name="targetBrh"][value="Custom"]',
            'targetBrhRadioAll': '[name="targetBrh"][value="All"]',
            'branchNo': '[name="branchNo"]',
            'selectBrhWrap': '.select-brh-wrap',
            'editorContainer': '.editor-container',
            'uploadBtn':       '#id-add-attachment',
            'target': '[name="target"]',
            'subject': '[name="subject"]',
            'noticeForm': '.notice-form',
            'attachCt': '.attachment-ct',
            'buttonSend': '.btn-submit-notice',
            'navbar': '.message-navbar',
            'hackContentInput': '[name="hackContentInput"]',
            'form':  'form.form-horizontal',
            'targetSelect':  '.target-select'
        },

        triggers: {
            'click .btn-back': 'back'
        },

        events: {
            'click .btn-submit-notice': '_onSubmitClick'
        },


        disableTargetSelect: function () {
            this.ui.targetSelect.prop('disabled', true);
            this.ui.branchNo.prop('disabled', true);
            this.$el.find('[name="targetBrh"]:checked').prop('disabled', true);
        },

        initialize: function (options) {
            options = options || {};

            this.everUploadImages = [];//存放曾经通过上传插入过的图片url
            this.render();

            options.renderTo && this.$el.appendTo(options.renderTo);
        },

        setEverUploadImages: function (urls) {
            this.everUploadImages = _.union(this.everUploadImages, urls);
        },

        updateTarget: function(target){
            this.ui.targetSelect.val(target);
        },

        updateSubject: function (subject) {
            this.ui.subject.val(subject);
        },

        templateHelpers: function () {
            return {
                btnSubmitText: this.btnSubmitText
            };
        },

        show: function () {
            this.$el.show();
            //头部用了 ScrollToFixed， 当重新显示后要给机会它重新调整
            _.defer(function () {
                $(window).trigger('resize.ScrollToFixed');
            });
        },

        onRender: function() {
            var me = this;

            this.createEditor();

            this.uploadView = new AttachmentView({
                uploadUrl: url._('notice.upload.attachment'),
                renderTo: this.ui.attachCt
            });

            this.ui.navbar.scrollToFixed();
            this._attachValidation();

            if(this.isTargetBrhNeed()) {
                    me.enableSelectBrh();
            }
        },

        isTargetBrhNeed: function () {
            return Ctx.isTopBrh();
        },

        getTargetBrhRadioValue: function () {
            return this.$el.find('[name="targetBrh"]:checked').val();
        },

        isTargetBrhCustom: function () {
            return this.getTargetBrhRadioValue() === 'Custom';
        },

        setTargetBrhValues: function (brhCodesArr) {
            var me = this;

            if(!_.isEmpty(brhCodesArr)) {
                this.ui.targetBrhRadioCustom.prop('checked', true).trigger('change.checkShowCustomBrh');
                    me.ui.branchNo.val(brhCodesArr.join(','));//select2 会处理好
            }else {
                this.ui.targetBrhRadioAll.prop('checked', true).trigger('change.checkShowCustomBrh');
            }
        },

        enableSelectBrh: function () {
            var me = this;
            var brhSelectData = [];
            ui = me.ui;

            ui.selectBrhWrap.show();

            this.$el.find('[name="targetBrh"]').on('change.checkShowCustomBrh', checkShowCustomBrh);

            function checkShowCustomBrh() {
                var isCustomBrh = me.isTargetBrhCustom();
                me.ui.branchNo.toggle(isCustomBrh);
                me.ui.branchNo.siblings('.select2-container').toggle(isCustomBrh);
            }

            Opf.ajax({
                url: url._('org.direct.children'),
                success: function(resp) {

                   me.ui.branchNo.select2({
                        width: 300,
                        // initSelection: $.noop,
                        multiple: true,
                        data: _.map(resp, function(item) {
                            return {
                                id: item.code,
                                text: item.name
                            };
                        }),
                        xxplaceholder: '- 选择机构 -'
                    });

                    brhSelectData = _.map(resp, function(item) {
                        return {
                            id: item.code,
                            text: item.name
                        };
                    });

                    //hack: 非空验证错误的情况下，选择一个选项后，还是红的
                    //间接触发一下再验证
                    me.ui.branchNo.on('change', function () {
                        $(this).keyup();
                    });
                    checkShowCustomBrh();
                }
            });
        },

        validate: function() {
            if (this.uploadView && this.uploadView.hasUploadingFile()) {
                Opf.alert('文件正在上传！请上传完成后再提交！');
                return false;
            }
            return this.$el.find("form").valid();
        },

        _attachValidation: function () {
            Opf.Validate.addRulesToBsForm(this.ui.form, {
                rules: {
                    target: { required: true },
                    subject: { required: true },
                    hackContentInput: { required: true },
                    branchNo: {required: true}
                }
            });
        },
        
        createEditor: function () {
            var me = this;

            //ckeditor需要界面上已经渲染好dom才能创建，这里setloading，保证创建完界面才能点击，这样就保证ckEditor不会为空
            
            _.defer(function() {
                me.ckEditor =  new NoticeEditor({
                    uploadUrl: url._('notice.upload.image'),
                    renderTo: me.ui.editorContainer
                });
                me.ckEditor.on('insert:image', function (obj) {
                    obj.data.url && me.everUploadImages.push(obj.data.url);
                });
                me.ckEditor.on('instanceReady', function(){
                    me.trigger('editor:ready');
                });

                me._ckEditorEvents();
            });
        },

        _ckEditorEvents: function () {
            var me = this;

            var emptyCkContentReg = /(^[\s\r\n]*<p>((&nbsp;\s?)|<br>)*?<\/p>[\s\r\n]*$)+/img;

            me.ckEditor.on('change', function () {
                var content = this.getData();
                var isContentEmpty = (content.replace(emptyCkContentReg, '').length === 0);
                //一个看不见的输入框模拟富文本的表单验证
                me.ui.hackContentInput.val(isContentEmpty ? '': 'xxhack').trigger('keyup');
            });
        },

        reset: function () {
            this.ckEditor && this.ckEditor.setData(null);
            this.ui.subject.val('');
            this.everUploadImages = [];
            this.uploadView.reset();
            this.ui.branchNo.select2 && this.ui.branchNo.select2('data', null);
        },

        getSubmitData: function () {
            var content = this.ckEditor.getData();
            var existUrls = filterExistImageUrls(content, this.everUploadImages);

            var data = {
                effectiveImages: existUrls,
                attachments: this.uploadView.getFileUrls(),
                tid: Ctx.getId(),
                target: this.ui.target.val(),
                subject: this.ui.subject.val(),
                content: content
            };

            if(this.isTargetBrhNeed() && this.isTargetBrhCustom() && this.ui.branchNo.val()) {
                data.branches = this.ui.branchNo.val().split(',');
            }

            return data;
        },

        /**
         * 在 edit-notice-view.js 中重写此方法
         */
        onSubmitSuccess: function () {
            this.reset();
            this.triggerMethod('back');
            // this.destroy();
        },

        _onSubmitClick: function () {
            var me = this;
            var ui = this.ui;

            if(!me.validate()) {
                return;
            }

            this.onSubmitClick();

        },

        onSubmitClick: function () {
            var me = this;

            Opf.UI.ajaxLoading(me.$el);
            Opf.UI.ajaxBusyText(me.ui.buttonSend, '正在提交...');

            var myAjaxOptions = _.result(me, 'ajaxOptions');

            $.ajax($.extend(myAjaxOptions, {
                jsonData: me.getSubmitData(),
                success: function () {
                    me.triggerMethod('submit:success'); //triggerMethod 才能用 onXxx 捕获
                }
            }));
        },

        getTargetOptionInfo: function () {
            var $option = this.ui.targetSelect.find(':selected');
            return {
                value: $option.attr('value'),
                text: $option.text()
            };
        }

    });
    
    //返回只包含在正文中的“曾插入”的url
    function filterExistImageUrls (content, urls) {
        if(_.isEmpty(urls)) {
            return [];
        }

        urls = _.clone(urls);
        var ret;
        //从ckeditor回调取到的url是通过元素的src属性获取，可能会返回绝对路径
        //这里把内容种的url也通过img元素的src属性取出，保证路径通过相同方式获取
        var imgsJoinStr = (content.match(/<img.*?>/g) || []).join(''); //content 里面的 img 可能会被删除

        ret = _.filter(urls, function (url) {
            return imgsJoinStr.indexOf(url) !== -1;
        });

        return ret;
    }

    
    
    return View;
});