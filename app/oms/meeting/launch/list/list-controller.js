//优惠方案模型列表
define(['App'], function(App){

    var Controller = Marionette.Controller.extend({
        listMeeting: function () {
            require(['app/oms/meeting/launch/list/list-view'], function (View) {
                var meetView = new View();
                App.show(meetView);
            });

        }

    });

    var ctrl = new Controller();

    App.on('launch:list', function () {
        ctrl.listMeeting();
    });

    return ctrl;
});