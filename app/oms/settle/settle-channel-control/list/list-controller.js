//此Controller对应于清分清算下的商户清算明细表
define(['App'], function(App) {
    var Controller = Marionette.Controller.extend({
        listSettleChannelCtrl: function() {
            require(['app/oms/settle/settle-channel-control/list/list-view'], function(View) {
                console.info('new view settle-channel-control');
                App.show(new View);
            });
        }
    });

    var ctrl = new Controller();

    App.on('settle:channel:control:list', function() {
        console.log('监听到 App触发的"settle:channel:control:list"事件, 触发清分清算/清算控制下面的渠道清算控制');
        ctrl.listSettleChannelCtrl();
    });

    return ctrl;
});