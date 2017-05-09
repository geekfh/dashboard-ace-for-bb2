define([
    'upload'
], function (Upload) {

    var tpl = _.template([
        '<div class="xlsFile-info" style="display: none;">',
            '<label class="xlsFile-name">发送对象明细.xls</label>',
        '</div>',
        '<span class="upload-file-trigger" style="display: inline-block; position: relative;">',
            '<label data-set="<%= name %>" class="btn-upload-file">上传文件</label>',
            '<input type="text" name="<%= name %>" style="display: none">',
        '</span>'
    ].join(''));

    var UploadView = Marionette.ItemView.extend({

        template: tpl,
        className: 'upload-group',
        events: {

        },
        initialize: function (options) {
            this.uploadUrl = options.url;
            this.data = options.data;
        },

        serializeData: function () {
            return this.data;
        },

        onRender: function () {
            var me = this;

            this.uploadFile = new Uploader({
                trigger: me.$el.find('.upload-file-trigger'),
                data: me.data,
                action: me.uploadUrl,
                //accept: 'application/vnd.ms-excel',
                //accept: {
                //    extensions: 'xls,txt,xlsx'
                //},
                accept: '.xls, .xlsx, .txt, .cvs, .jpeg, .png, .jpg',
                beforeSubmit: function (id) {

                },
                progress: function(queueId, event, position, total, percent) {
                    me.$el.find('.btn-upload-file').text('正在上传... ' + percent + '%');
                },
                success: function (queueId, resp) {
                    if (resp.success === false) {
                        me.uploadFile.input.val('');
                        Opf.alert({ title: '文件不合适',  message: resp.msg || '上传失败' });
                        console.error('upload had some error');
                        me.$el.find('.btn-upload-file').text('上传文件');
                    } else {
                        me.trigger('upload:success');
                        me.loadFileUrl(resp.url);
                    }
                    me.$el.find('.btn-upload-file').text('重新上传');
                },
                error: function () {
                    me.uploadFile.input.val('');
                    Opf.alert('上传出错');
                    console.error('upload had some error');
                },
                complete: function () {
                    // me.uploadFile.input.attr('disabled', false);
                }
            });
        },

        loadFileUrl: function (url) {
            var $el = this.$el;
            var name = this.data.name;
            var fileName = url.split('/').pop();

            $el.find('.btn-upload-file').addClass('upload-again');
            $el.find('.xlsFile-info').show();
            $el.find('input[name='+ name +']').val(url);
            $el.find('.xlsFile-name').text(fileName);
        }

    });


    return UploadView;

});