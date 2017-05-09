define([
    'tpl!app/oms/route/oneSettle/mcht-channel/templates/upload-more-mchts.tpl',
    'upload',
    'common-ui'
], function(tpl) {

    var View = Marionette.ItemView.extend({
        template: tpl,

        events: {
            'click .download-btn': 'onDwonloadClick'
        },

        ui: {
            uploadBtn: '.content-upload-btn',
            uploadMsg: '.upload-message',
            channelName: '[name="channelName"]'
        },

        initialize: function () {
            this.render();
        },

        onSubmit: function () {
            if(!this.ui.channelName.val()){
                Opf.alert('请选择所属通道');
                return;
            }
            if (this.uploadBtn.input.val()) {
                this.uploadBtn.setData( {'channelName': this.ui.channelName.val()} );
                this.uploadBtn.submit();
            } else {
                Opf.alert('请上传Excel');
            }

        },

        onDwonloadClick: function () {
            var me = this;
            Opf.ajax({
                url: me.getExeclTemplteUrl(),
                type: 'GET',
                success: function (resp) {
                    Opf.download(resp.data);
                }
            });
        },
        getExeclTemplteUrl: function(){
          return url._('route.download.excel');
        },

        initUploadBtn: function () {
            var me = this, ui = me.ui, $trigger = ui.uploadBtn;

            var uploadFile = this.uploadBtn = new Uploader({
                trigger: $trigger,
                data: {
                    name: 'excel',
                    uuid: Ctx.getId()
                },
                action: me.getUploadUrl(),
                accept: 'application/vnd.ms-excel',
                change: function () {
                    var fileName = this.input.val().split('\\').pop().split('/').pop();
                    ui.uploadMsg.text(fileName);
                },
                beforeSubmit: function (id) {
                    Opf.UI.setLoading(me.$el.closest('.ui-dialog'), true, {text: '正在上传...'});
                },
                progress: function(queueId, event, position, total, percent) {
                    me.$el.closest('.ui-dialog').find('.loading-text').text('正在上传...' + percent + '%');

                },
                success: function (queueId, resp) {
                    if (resp.success === false) {
                        Opf.alert({ title: '信息提示', message: resp.msg || '上传失败' });
                    } else {
                        me.remove();
                        Opf.Toast.success('操作成功');
                        me.trigger('submit:success');
                    }
                },
                complete: function (queueId) {
                    Opf.UI.setLoading(me.$el.closest('.ui-dialog'), false);
                    ui.uploadMsg.text('');
                }
            });

        },
        getUploadUrl: function(){
            return url._('route.upload');
        },

        addSelects: function (me) {
            CommonUI.channelName(me.$el.find('[name="channelName"]'));
        }, 

        onRender: function() {
            var me = this;

            this.initUploadBtn();
            this.addSelects(me);

            var $dialog = this.$dialog = Opf.Factory.createDialog(this.$el, {
                destroyOnClose: true,
                width: 400,
                height: 300,
                modal: true,
                title: me.getTitle(),
                buttons: [{
                    type: 'submit',
                    click: function() {
                        me.onSubmit();
                    }
                }, {
                    type: 'cancel'
                }]
            });

            $dialog.on('dialogclose', function () {
                Opf.UI.fixedBody(false);
            });

        },
        getTitle: function(){
            return '上传通道商户模型';
        }

    });
    
    return View;
});