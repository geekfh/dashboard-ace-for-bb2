define(['App'], function(App) {

    App.module('PushApp.PushSMApp.List', function(List, App, Backbone, Marionette, $, _) {

        List.Controller = {

            listRecord: function(kw) {

                require(['app/oms/message/push-sm/list/list-view' ], function(View) {

                    console.info('new view push-sm');
                    var pushSMView = new View.Record();
                    App.show(pushSMView);

                });


            }

        };

    });
    return App.PushApp.PushSMApp.List.Controller;
});