

define(['App','app/oms/message/push-app'], //

  function(App,PushApp) {

    //define sub app
    App.module('PushSMSApp', function(PushSMSApp) {

      var PushSMSRouter = Marionette.AppRouter.extend({
        appRoutes: {
          "pushSM(/filter/kw::kw)": "listRecord"
        }
      });

      /////////////////////////////////////////////////////////////////
      // @API : define methods for interaction (with parent app) and router //
      /////////////////////////////////////////////////////////////////
      var API = {
        listRecord: function(kw) {
          require(['app/oms/message/push-sm/list/list-controller'], function (ctrl) {
            ctrl.listRecord(kw);
          });
        }

      };

      //if it is not used to map the url first time typed in browser
      //u can new router anywhere before u want, otherwise, u should
      //add router before start Backbone history
      new PushSMSRouter({ controller: API });


      /////////////////////////////////////////////////
      //@RegisgerEvent : register events or command to parent app //////
      /////////////////////////////////////////////////
      PushApp.on('sm:record', function(kw) {
        API.listRecord(kw);
      });

      //this callback will be invoked before parent app:initilize:after
      App.addInitializer(function() {

        console.log('>>>>initializer PushSMSApp');

      });

    });

    return App.PushSMSApp;
  });