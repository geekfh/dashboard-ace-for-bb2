define(['App'], function(App) {

    App.module('TerminalsApp.TerminalsMgr.List', function(List, App, Backbone, Marionette, $, _) {

        List.Controller = {

            listTerminalsMgr: function(kw) {

                require(['app/oms/terminals/terminals-mgr/list/list-view' ], function(View) {

                    console.info('new view terminalsmgr');
                    var terminalsMgrView = new View.TerminalsMgr({});
                    App.show(terminalsMgrView);

                });


            } //@listMchts

        };

    });
    return App.TerminalsApp.TerminalsMgr.List.Controller;
});