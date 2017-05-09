

define(['App'], //

  function(App) {

    //define sub app
    App.module('PushApp', function(PushApp) {

      var PushRouter = Marionette.AppRouter.extend({
        appRoutes: {
          "push(/filter/kw::kw)": "record"
        }
      });

      /////////////////////////////////////////////////////////////////
      // @API : define methods for interaction (with parent app) and router //
      /////////////////////////////////////////////////////////////////
      var API = {
        record: function(kw) {
          var me = this;
          console.log('>>>>Push.record ' + (kw || ''));

          require(['app/oms/message/push-sm/push-sm-app'], function (ctrl) {
            PushApp.trigger('sm:record');
          });
        }

      };

      //if it is not used to map the url first time typed in browser
      //u can new router anywhere before u want, otherwise, u should
      //add router before start Backbone history
      new PushRouter({ controller: API });


      /////////////////////////////////////////////////
      //@RegisgerEvent : register events or command to parent app //////
      /////////////////////////////////////////////////
      App.on('sm:record', function(kw) {
        API.record(kw);
      });

      //this callback will be invoked before parent app:initilize:after
      App.addInitializer(function() {

        console.log('>>>>initializer pushSMApp');

      });

    });

    return App.PushApp;
  });