define(['App'], function(App) {

    var Controller = Marionette.Controller.extend({

        addBrh: function(addBrhType) {
            var me = this;
            require(['app/oms/auth/org/add/add-brh-view'], function(View) {

                console.info('new view addBrh');
                var addBrhView = new View();

                App.show(addBrhView);

            });


        }


    });

    var ctrl = new Controller();

    return ctrl;

});