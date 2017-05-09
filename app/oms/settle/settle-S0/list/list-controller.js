//S0异常处理
define(['App'], function(App){

    var Controller = Marionette.Controller.extend({
        list: function () {
            require(['app/oms/settle/settle-S0/list/list-view'], function (View) {
                var view = new View();
                App.show(view);
            });
        }
    });

    var ctrl = new Controller();

    App.on('exception:S0:list', function () {
        ctrl.list();
    });

    return ctrl;
});