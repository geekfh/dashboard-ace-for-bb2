define([
    'upload'
], function (Upload) {

    var tpl = _.template([
        '<span class="upload-file-trigger" style="display: inline-block; position: relative;">',
            '<label data-set="contract" class="btn-upload-file">上传文件</label>',
            '<input type="text" name="contractFile" style="display: none">',
        '</span>',
        '<div class="file-info" style="display: none;">',
            '<label class="file-name">合同文件.pdf</label>',
            '<div class="file-link">',
                '<a href="#" target="_blank" class="check-file">查看</a> | <a href="#" class="delete-file">删除</a>',
            '</div>',
        '</div>',
        '<label class="dec-label">&nbsp;&nbsp;仅支持图片或PDF文件( 最大2M )。</label>'
    ].join(''));

    var UploadView = Marionette.ItemView.extend({

        template: tpl,
        className: 'upload-group',
        events: {
            'click .delete-file': 'deleteFile', //点击删除
            'click .check-file' : 'checkFile'   //点击查看
        },
        initialize: function (options) {
            this.uploadUrl = options.url;
            this.data = options.data;
            this.accept = options.accept;
        },
        onRender: function () {
            var me = this;

            this.uploadFile = new Uploader({
                trigger: me.$el.find('.upload-file-trigger'),
                data: me.data,
                action: me.uploadUrl,
                accept: 'image/png, image/jpeg, image/jpg, application/pdf',
                beforeSubmit: function (id) {
                    // me.uploadFile.input.attr('disabled', true);
                },
                progress: function(queueId, event, position, total, percent) {
                    me.$el.find('.btn-upload-file').text('正在上传扫描件... ' + percent + '%');
                },
                success: function (queueId, resp) {
                    if (resp.success === false) {
                        me.uploadFile.input.val('');
                        Opf.alert({ title: '文件不合适',  message: resp.msg || '上传失败' });
                        console.error('upload had some error');
                    } else {
                        me.trigger('upload:success');
                        me.loadFileUrl(resp.url);
                    }
                },
                error: function () {
                    me.uploadFile.input.val('');
                    Opf.alert('上传出错');
                    console.error('upload had some error');
                },
                complete: function () {
                    me.$el.find('.btn-upload-file').text('上传文件');
                    // me.uploadFile.input.attr('disabled', false);
                }
            });
        },
        deleteFile: function (e) {
            var event = $.event.fix(e);
            event.preventDefault();
            var me = this;

            me.uploadFile.input.val('');
            me.$el.find('input[name="contractFile"]').val('');
            me.$el.find('.upload-file-trigger').show();
            me.$el.find('.file-info').hide();
            
            me.trigger('file:deleted');
        },
        loadFileUrl: function (url) {
            var me = this;
            var fileName = url.split('/').pop();

            me.$el.find('.upload-file-trigger').hide();
            me.$el.find('.file-info').show();
            me.$el.find('input[name="contractFile"]').val(url);
            me.$el.find('.file-name').text(fileName);
            me.$el.find('.check-file').attr('href', url);
            
        },
        disableDeleteBtn: function () {
            this.$el.find('.delete-file').toggle(false);

        },
        enableDeleteBtn: function () {
            this.$el.find('.delete-file').toggle(true);

        },
        checkFile: function () {

        }

    });


    return UploadView;

});