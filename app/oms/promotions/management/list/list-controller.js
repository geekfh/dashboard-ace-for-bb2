//优惠方案模型列表
define(['App'], function(App){

    var Controller = Marionette.Controller.extend({
        listMgrs: function () {
            require(['app/oms/promotions/management/list/list-view'], function (View) {
                var modelView = new View();
                App.show(modelView);
            });
        }
    });

    var ctrl = new Controller();

    App.on('management:list', function () {
        ctrl.listMgrs();
    });

    return ctrl;
});