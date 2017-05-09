//此Controller对应于参数设置菜单下的总行表
define(['App'], function(App) {
    var Controller = Marionette.Controller.extend({
        listBanks: function() {
            require(['app/oms/param/banks/list/list-view'], function(View) {
                App.show(new View.banks());
            });
        }
    });

    var ctrl = new Controller();

    App.on('banks:list', function() {
        console.log('监听到 App触发的"banks:list"事件, 触发参数设置/总行');
        ctrl.listBanks();
    });

    return ctrl;
});