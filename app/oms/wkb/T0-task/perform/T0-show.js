define([
    'tpl!app/oms/wkb/T0-task/perform/templates/T0-show.tpl',
    'app/oms/wkb/T0-task/perform/T0-info',
    'app/oms/wkb/branch-task/show/history-view',
    'moment.override'
], function (tpl, InfoView, HistoryView) {
    var View = Marionette.ItemView.extend({
        className: 'common-task T0-show T0-task',

        template: tpl,

        events: {
            'click .js-task-info' : 'popTaskInfo',
            'click .js-back'      : 'goback',
            'click .js-take' : 'requestTakeTask'
        },

        ui: {
            btnTake:   '.js-take'
        },

        initialize: function (options) {
            this.data = options.data;
            this.taskInfo = options.data.taskInfo;
            this.taskModel = options.taskModel;
            this.tasks = options.tasks;
        },

        onRender: function () {
            this.renderBanknoInfo();

            this.attachValidation();

            this.checkCanITake();

        },

        renderBanknoInfo: function () {
            var showInfoView = new InfoView({
                data: this.data.servInfo
            }).render();

            this.$el.find('.info-board-wrap').html(showInfoView.$el);
        },

        attachValidation: function () {
            var me = this;
            $(document.body).click(function(e) {
                if(me.$history && me.$history.is(':visible') &&
                    (!$(e.target).closest('.history-wrapper').length)) {

                    me.$history.hide();
                    console.log($(e.target).attr('class'));
                }
            });
        },

        popTaskInfo: function () {
            var me = this;
            setTimeout(function(){
                if(me.$history){
                    me.$history.show();
                }else{
                    me.doPopTaskInfo();
                }
            }, 10);
        },

        doPopTaskInfo: function () {
            var me = this;

            var $historyTrigger = me.$el.find('.history-trigger');
            var historyView = new HistoryView(me.taskInfo).render();

            me.$history = historyView.$el;
            $historyTrigger.append(me.$history);
        },

        goback: function () {
            this.$el.remove();
            this.trigger('back');
        },

        requestTakeTask: function () {
            var me = this;
            Opf.UI.busyText(me.ui.btnTake);
            Opf.ajax({
                url: url._('task.take.by.id', {id: me.taskModel.id}),
                type: 'PUT',
                success: function (resp) {
                    me.taskModel.set('status', 2);//更改成已领取状态
                    App.maskCurTab();
                    Opf.ajax({
                        url: url._('task.target', {id: me.taskModel.id}),
                        success: function (data) {
                            // 切换到 performView 界面
                            me.goToPerformView(data);
                            App.unMaskCurTab();
                        }
                    });

                },
                complete: function () {
                    Opf.UI.busyText(me.ui.btnTake, false);
                }
            });
        },

        goToPerformView: function (data) {
            var me = this;

            require(['app/oms/wkb/T0-task/perform/T0-perform'], function (PerformView) {
                var performView = new PerformView({
                    data: data,
                    taskModel: me.taskModel,
                    tasks: me.tasks
                });

                performView.render();
                me.$el.remove();

                App.getCurTabPaneEl().append(performView.$el);
                performView.on('back', function(){
                    $('.tasks-board').show();
                    var currentPage = performView.tasks.state.currentPage;
                    performView.tasks.getPage(parseInt(currentPage, 10), {reset: true});
                });
            });
        },

        checkCanITake: function () {
            var me = this;
            if(this.taskModel && this.taskModel.get('status') == 1) {
                Opf.ajax({
                    url: url._('task.canitake', {id: this.taskModel.id}),
                    success: function (resp) {
                        if(resp && resp.canTake) {
                            me.ui.btnTake.show();
                        }
                    }
                });
            }
        }

    });


    return View;
});