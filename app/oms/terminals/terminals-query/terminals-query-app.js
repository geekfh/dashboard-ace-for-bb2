// teminals terminal-query

define(['App','app/oms/terminals/terminals-app'],
    function(App,TerminalsApp){
      //define sub app 
      App.module('TerminalsQueryApp', function(TerminalsQueryApp) {

        var TerminalsQueryAppRouter = Marionette.AppRouter.extend({
          appRoutes: {
            "terminalsQuery(/filter/kw::kw)": "listTerminalsQuery"
          }
        });

        /////////////////////////////////////////////////////////////////
        // define methods for interaction (with parent app) and router //
        /////////////////////////////////////////////////////////////////
        var API = {
          listTerminalsQuery: function(kw) {
            require(['app/oms/terminals/terminals-query/list/list-controller'], function(ctrl) {
              ctrl.listTerminalsQuery(kw);
            });
          }
        };

        //if it is not used to map the url first time typed in browser
        //u can new router anywhere before u want, otherwise, u should
        //add router before start Backbone history
        new TerminalsQueryAppRouter({
          controller: API
        });

        /////////////////////////////////////////////////
        //register events or command to parent app //////
        /////////////////////////////////////////////////

        TerminalsApp.on('terminalsQuery:list', function(kw) {
          API.listTerminalsQuery(kw);
        });

        //this callback will be invoked before parent app:initilize:after
        App.addInitializer(function() {

          console.log('>>>>new TerminalsQueryAppRouter');

        });

      });

      return App.TerminalsQueryApp;
});