//操作审核
define(['App'], function(App){

    var Controller = Marionette.Controller.extend({
        initServiceTelephone: function () {
            require(['app/oms/operate/service-telephone/view'], function (View) {
                var view = new View();
                App.show(view);
            });
        }
    });

    var ctrl = new Controller();

    App.on('operate:serviceTelephone', function () {
        ctrl.initServiceTelephone();
    });

    return ctrl;
});