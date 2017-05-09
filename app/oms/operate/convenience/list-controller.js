//商机查询
define(['App'], function(App){

    var Controller = Marionette.Controller.extend({
        list: function () {
            require(['app/oms/operate/convenience/list-view'], function (View) {
                var view = new View();
                App.show(view);
            });
        }
    });

    var ctrl = new Controller();

    App.on('operate:convenience:list', function () {
        ctrl.list();
    });

    return ctrl;
});