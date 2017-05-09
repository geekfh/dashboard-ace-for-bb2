define([
    'tpl!app/oms/wkb/extraInfo-open-task/perform/templates/show.tpl',
    'app/oms/wkb/extraInfo-open-task/perform/info',
    'app/oms/wkb/branch-task/show/history-view',
    'moment.override'
], function (tpl, InfoView, HistoryView) {
    return Marionette.ItemView.extend({
        className: 'container common-task openMerchant-show openMerchant-task',

        template: tpl,

        events: {
            'click .js-task-info' : 'popTaskInfo'
        },

        initialize: function (options) {
            this.data = options.data;
            this.taskInfo = options.data.taskInfo;
            this.openMerchantSupp = options.data.openMerchantSupp;
        },

        onRender: function () {
            this.renderOpenUserInfo();
            this.attachValidation();
            //this.checkCanITake();
        },

        renderOpenUserInfo: function () {
            var me = this;

            var showInfoView = new InfoView({
                data: me.openMerchantSupp
            }).render();

            me.$el.find('.info-board-wrap').html(showInfoView.$el);
        },

        attachValidation: function () {
            var me = this;
            $(document.body).click(function(e) {
                if(me.$history && me.$history.is(':visible') &&
                    (!$(e.target).closest('.history-wrapper').length)) {
                    me.$history.hide();
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
        }

    });
});