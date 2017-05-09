// teminals terminal-mgr

define(['App','app/oms/terminals/terminals-app'],
    function(App,TerminalsApp){
      //define sub app 
      App.module('TerminalsMgrApp', function(TerminalsMgrApp) {

        var TerminalsMgrAppRouter = Marionette.AppRouter.extend({
          appRoutes: {
            "terminalsMgr(/filter/kw::kw)": "listTerminalsMgr"
          }
        });

        /////////////////////////////////////////////////////////////////
        // define methods for interaction (with parent app) and router //
        /////////////////////////////////////////////////////////////////
        var API = {
          listTerminalsMgr: function(kw) {
            require(['app/oms/terminals/terminals-mgr/list/list-controller'], function(ctrl) {
              ctrl.listTerminalsMgr(kw);
            });
          }
        };

        //if it is not used to map the url first time typed in browser
        //u can new router anywhere before u want, otherwise, u should
        //add router before start Backbone history
        new TerminalsMgrAppRouter({
          controller: API
        });

        /////////////////////////////////////////////////
        //register events or command to parent app //////
        /////////////////////////////////////////////////

        TerminalsApp.on('terminalsMgr:list', function(kw) {
          API.listTerminalsMgr(kw);
        });

        //this callback will be invoked before parent app:initilize:after
        App.addInitializer(function() {

          console.log('>>>>new TerminalsMgrAppRouter');

        });

      });

      return App.TerminalsMgrApp;
});