//优惠方案模型列表
define(['App'], function(App){

    var Controller = Marionette.Controller.extend({
        listModels: function () {
            require(['app/oms/promotions/model/list/list-view'], function (View) {
                var modelView = new View();
                App.show(modelView);
            });

        }

    });

    var ctrl = new Controller();

    App.on('model:list', function () {
        ctrl.listModels();
    });

    return ctrl;
});