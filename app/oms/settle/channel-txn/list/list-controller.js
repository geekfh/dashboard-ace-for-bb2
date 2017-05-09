
//此Controller对应于清分清算下的渠道流水信息表
define(['App'], function(App) {

    var Controller = Marionette.Controller.extend({
    
        listChannelTxn: function(kw) {
            var me = this;
            require(['app/oms/settle/channel-txn/list/list-view'], function(View) {

                console.info('new view channel-txn');
                var channelTxnView = new View.ChannelTxn({});

                App.show(channelTxnView);

                me.channelTxnView = channelTxnView;

            });


        } //@listOrgs

    });


    var ctrl = new Controller();

    App.on('channelTxn:list', function() {
        console.log('监听到 App触发的"channelTxn:list"事件, 触发清分清算下的渠道流水信息表');
        ctrl.listChannelTxn();
    });

    return ctrl;


});