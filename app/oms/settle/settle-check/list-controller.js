//操作审核
define(['App'], function(App){

    var Controller = Marionette.Controller.extend({
        list: function () {
            require(['app/oms/settle/settle-check/list-view'], function (View) {
                var view = new View();
                App.show(view);
            });
        }
    });

    var ctrl = new Controller();

    App.on('settle:check:list', function () {
        ctrl.list();
    });

    return ctrl;
});