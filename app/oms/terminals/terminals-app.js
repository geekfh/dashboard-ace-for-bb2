define([
    'App'
], function(App) {
    //define sub app
    App.module('TerminalsApp', function(TerminalsApp) {

      var TerminalsRouter = Marionette.AppRouter.extend({
        appRoutes: {
          "terminals(/filter/kw::kw)": "listTerminals"
        }
      });

      /////////////////////////////////////////////////////////////////
      // @API : define methods for interaction (with parent app) and router //
      /////////////////////////////////////////////////////////////////
      var API = {
        listTerminals: function(kw) {
          var me = this;
          console.log('>>>>terminals.listTerminals ' + (kw || ''));

          require(['app/oms/terminals/terminals-mgr/terminals-mgr-app'], function (ctrl) {
            TerminalsApp.trigger('terminalsMgr:list');
          });
        },
        queryTerminals: function(kw) {
          var me = this;
          console.log('>>>>terminals.queryTerminals ' + (kw || ''));

          require(['app/oms/terminals/terminals-query/terminals-query-app'], function (ctrl) {
            TerminalsApp.trigger('terminalsQuery:list');
          });
        },

        setTerminals: function(kw){
          console.log('>>>>terminals.type.display ' + (kw || ''));

          require(['app/oms/terminals/terminals-type-displays/list/list-view'], function (View) {
            App.show(new View({}));
          });
        },

        queryTerminalsCode: function(kw) {
          require(['app/oms/terminals/terminals-query-code/list-view'], function (View) {
            App.show(new View());
          });
        }

      };

      //if it is not used to map the url first time typed in browser
      //u can new router anywhere before u want, otherwise, u should
      //add router before start Backbone history
      new TerminalsRouter({ controller: API });


      /////////////////////////////////////////////////
      //@RegisgerEvent : register events or command to parent app //////
      /////////////////////////////////////////////////
      App.on('terminals:list', function(kw) {
        API.listTerminals(kw);
      });
      App.on('terminalsQuery:list', function(kw) {
        API.queryTerminals(kw);
      });

      App.on('terminalsTypeDisplay:list', function(kw) {
        API.setTerminals(kw);
      });

      //this callback will be invoked before parent app:initilize:after
      App.addInitializer(function() {

        console.log('>>>>initializer TerminalsApp');

      });

      App.on('terminalsQueryCode:list', function(kw) {
        API.queryTerminalsCode(kw);
      });

    });

    return App.TerminalsApp;
  });