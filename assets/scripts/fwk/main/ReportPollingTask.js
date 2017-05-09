define([
    'marionette',
    'tpl!assets/scripts/fwk/main/templates/report-task-queue-item.tpl',
    'assets/scripts/fwk/main/TaskQueueMgr'
], function(Marionette, tpl, TaskQueueMgr) {

    var STATUS = {
        WAITING: 'waiting',
        DONE: 'done',
        FAIL: 'fail'
    };

    var STATUS_CN = {
        waiting: '<img src="assets/images/waiting.gif" width="18"><span class="text">等待中</span>',
        done: '<i class="icon-ok"></i><span class="text">完成</span>',
        fail: '失败'
    };

    var ReportTaskView = Marionette.ItemView.extend({

        tagName: 'tr',

        template: tpl,

        ui: {
            // btnDownload: '.btn-download',
            colStatusText: '.col-status .text'
        },

        events: {
            // 'click .btn-download': 'onDownloadBtnClick'
        },

        initialize: function () {
            var me = this;

            this.model.on('change:status', function (xx, val) {
                // console.log('>>>status change');
                me.ui.colStatusText.html(me.formatStatus(val));
                // if(val === STATUS.DONE) {
                //     me.ui.btnDownload.show();
                // }
            });
        },

        // onDownloadBtnClick: _.throttle(function () {
        //     Opf.download(this.model.get('url'));
        // }, 200),

        formatStatus: function(val) {
            return STATUS_CN[val];
        },

        templateHelpers: function() {
            return {
                formatStatus: this.formatStatus
            };
        }
    });

    var Task = TaskQueueMgr.extendTask({

        View: ReportTaskView,

        getModel: function () {
            return this.model;
        },

        initialize: function (data) {
            var me = this;

            this.model = new Backbone.Model(_.extend({
                status: STATUS.WAITING
            }, data));

        },

        updateStatusAsFinish: function () {
            this.model.update('status', STATUS.DONE);
        },

        udateStatusAsFail: function () {

        },

        updateByResponse: function (resp) {
            var status;

            if(resp.data) {
                status = STATUS.DONE;
                // this.model.set('url', resp.data.url);
                Opf.download(resp.data);
                
            }else {
                status = STATUS.FAIL;
            }

            this.model.set('status', status);
        }
    });

    return Task;
});