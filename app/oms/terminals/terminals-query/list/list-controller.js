define(['App'], function(App) {

    App.module('TerminalsApp.TerminalsQuery.List', function(List, App, Backbone, Marionette, $, _) {

        List.Controller = {

            listTerminalsQuery: function(kw) {

                require(['app/oms/terminals/terminals-query/list/list-view' ], function(View) {

                    console.info('new view terminalsquery');
                    var terminalsQueryView = new View.TerminalsQuery({});
                    App.show(terminalsQueryView);

                });


            } //@listMchts

        };

    });
    return App.TerminalsApp.TerminalsQuery.List.Controller;
});