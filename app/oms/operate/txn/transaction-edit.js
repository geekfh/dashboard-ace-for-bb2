define([
    'tpl!app/oms/operate/txn/templates/txn-edit.tpl',
    'upload'

], function(tpl) {

    var IS_NEW_SIGN = '1', NOT_NEW_SIGN = '0';

    var View = Marionette.ItemView.extend({
        template: tpl,
        className: 'txn-edit-group',
        ui: {
            'isNewUrl': '[name="isNewSignUrl"]',
            '$form': 'form.edit-txn',
            'uploadSign' : 'a.upload-sign',
            'signUrl': '[name="signUrl"]',
            'deletePic': '.delete-uploaded-picture',
            'csn': '[name="csn"]',
            'unprNo': '[name="unprNo"]',
            'aip': '[name="aip"]',
            'arqc': '[name="arqc"]',
            'tvr': '[name="tvr"]',
            'tsi': '[name="tsi"]',
            'aid': '[name="aid"]',
            'atc': '[name="atc"]',
            'termCap': '[name="termCap"]',
            'iad': '[name="iad"]',
            'appLab': '[name="appLab"]',
            'appName': '[name="appName"]',
            'templateType': 'input[name="template-type"]'
        },
        events: {
            'click .delete-uploaded-picture': 'deletePicture',
            'change [name="ibox42"]': 'clickIbox42Handle'
        },
        initialize: function () {
            
        },

        onRender: function () {
            this.addUpload();

            //this.$el.find('[name="iboxNo"]').attr('disabled', 'disabled');
            //this.$el.find('[name="traceNo"]').attr('disabled', 'disabled');
            //this.$el.find('[name="iboxBatchNo"]').attr('disabled', 'disabled');
        },


        serializeData: function () {
            return {data: this.getOption('data')};
        },

        clickIbox42Handle: function(me){
            var appCur = this.$el;
            var cur = me.currentTarget;
            var index = $(cur).find('option:selected').attr('index');
            //var index = $(cur).find('option:selected').val().substring(0,1);
            if(index == 1){
                $(appCur).find('[name="iboxNo"]').val($(appCur).find('[name="iboxNo"]').next().next().text());
                $(appCur).find('[name="traceNo"]').val($(appCur).find('[name="traceNo"]').next().next().text());
                $(appCur).find('[name="iboxBatchNo"]').val($(appCur).find('[name="iboxBatchNo"]').next().next().text());
                $(appCur).find('[name="acquirer"]').val('48315800');
            }
            else{
                $(appCur).find('[name="iboxNo"]').val($(appCur).find('[name="iboxNo"]').next().text());
                $(appCur).find('[name="traceNo"]').val($(appCur).find('[name="traceNo"]').next().text());
                $(appCur).find('[name="iboxBatchNo"]').val($(appCur).find('[name="iboxBatchNo"]').next().text());
                $(appCur).find('[name="acquirer"]').val('');
            }
        },

        deletePicture: function () {
            var ui = this.ui;

            ui.deletePic.hide();
            this.$el.find('.sign-img').empty();
            this.$upload.show();

        },

        addUpload: function () {
            var me = this;
            var $upload = this.$upload = this.ui.uploadSign;

            this.upload = new Uploader({
                data: {
                    name: 'sign',
                    uuid: Ctx.getId()
                },
                action: url._('transaction.upload'),
                accept: 'image/png, image/jpeg, image/jpg',
                trigger: $upload,
                beforeSubmit: function (id) {

                },
                progress: function(queueId, event, position, total, percent) {

                },
                error: function () {

                },
                success: function (queueId, resp) {
                    if(resp.success === false) {
                        Opf.alert('上传出错');

                    } else {
                        $upload.hide();
                        me.ui.signUrl.val(resp.url);
                        me.ui.isNewUrl.val(IS_NEW_SIGN);
                        me.showSignPic(resp.url);
                        me.ui.deletePic.show();

                    }
                }
            });

            var data = this.getOption('data');

            if (data.signUrl && data.ibox42 && data.orderNo) {
                if (data.signUrl.indexOf('images') !== -1 || data.signUrl.indexOf('T') !== -1) {
                    me.ajaxSugnPic(_.pick(data, 'signUrl', 'ibox42', 'orderNo')).done(function (resp) {
                        $upload.hide();
                        me.ui.signUrl.val(resp.url);
                        me.ui.isNewUrl.val(NOT_NEW_SIGN);
                        me.showSignPic(resp.url);
                    });

                }
                else {
                    var imgUrl = url._('transaction.getsign') + '?' + $.param(_.pick(data, 'signUrl', 'ibox42', 'orderNo'));
                    $upload.hide();
                    me.ui.signUrl.val(data.signUrl);
                    me.ui.isNewUrl.val(NOT_NEW_SIGN);
                    me.showSignPic(imgUrl);

                }

            }
            if(data){
                me.ui.csn.val(data.csn);
                me.ui.unprNo.val(data.unprNo);
                me.ui.aip.val(data.aip);
                me.ui.arqc.val(data.arqc);
                me.ui.tvr.val(data.tvr);
                me.ui.tsi.val(data.tsi);
                me.ui.aid.val(data.aid);
                me.ui.atc.val(data.atc);
                me.ui.termCap.val(data.termCap);
                me.ui.iad.val(data.iad);
                me.ui.appLab.val(data.appLab);
                me.ui.appName.val(data.appName);
            }
        },

        ajaxSugnPic: function (submitData) {
            return Opf.ajax({
                url: url._('transaction.getsign'),
                type: 'get',
                data: submitData
            });
        },

        showSignPic: function (picUrl) {
            this.$el.find('.sign-img').empty().append('<img class="sign-upload-img" src="' + picUrl + '">');
        },

        submitTrans: function () {
            if ($('iframe[name="settleTxnTrans"]').length > 0) {

            } else {
                var iframe = $('<iframe style="display: none;" name="settleTxnTrans"></iframe>');
                $('body').append(iframe);
            }

            this.ui.$form.submit();
        }

    });
    
    return View;
});