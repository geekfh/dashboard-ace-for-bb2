/**
 * User hefeng
 * Date 2016/7/18
 */
define([
    'tpl!app/demo/others/ckeditor/templates/new-notice-form.tpl',
    'assets/scripts/fwk/component/common-editor-attachment',
    'assets/scripts/fwk/component/common-editor'
], function(editorTpl, AttachmentView, NoticeEditor) {

    // 配置视图
    return Marionette.ItemView.extend({
        // TAB唯一标识
        tabId: 'demo.menu.others.ckeditor',

        template: editorTpl, //_.template(tpl),

        className: "editor-sample",

        ui: {
            'editorContainer': '.editor-container',
            'attachCt': '.attachment-ct',
            'hackContentInput': '[name="hackContentInput"]',

            'uploadBtn':       '#id-add-attachment',

            'noticeForm': '.notice-form',

            'targetSelect':  '.target-select'
        },

        onRender: function () {
            var me = this;

            me.createEditor();

            me.uploadView = new AttachmentView({
                updateUrl: "app/demo/data/city.json",
                renderTo: this.ui.attachCt
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
                    updateUrl: "app/demo/data/city.json",
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
        }
    });

});