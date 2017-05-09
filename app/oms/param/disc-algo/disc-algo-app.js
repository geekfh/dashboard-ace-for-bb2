// param
// disc-algo
// 
// 



define(['App', 'app/oms/param/param-sys-app'], //

  function(App, ParamSysApp) {

    //define sub app 
    App.module('DiscAlgoApp', function(DiscAlgoApp) {

      var DiscAlgoAppRouter = Marionette.AppRouter.extend({
        appRoutes: {
          "disc-algos(/filter/kw::kw)": "listDiscAlgos"
        }
      });

      /////////////////////////////////////////////////////////////////
      // define methods for interaction (with parent app) and router //
      /////////////////////////////////////////////////////////////////
      var API = {

        listDiscAlgos: function(kw) {
          console.log('>>>>param-sys.listDiscAlgos ' + (kw || ''));

          require(['app/oms/param/disc-algo/list/list-controller'], function (ctrl) {
            ctrl.listDiscAlgos(kw); 
          });
        }

      };
      
      //if it is not used to map the url first time typed in browser
      //u can new router anywhere before u want, otherwise, u should
      //add router before start Backbone history
      new DiscAlgoAppRouter({ controller: API });


      /////////////////////////////////////////////////
      //register events or command to parent app //////
      /////////////////////////////////////////////////
      ParamSysApp.on('disc-algos:list', function(kw) {
        API.listDiscAlgos(kw);
      });

      
      //this callback will be invoked before parent app:initilize:after
      App.addInitializer(function() {

        console.log('>>>>new DiscAlgoAppRouter');

      });

    });

    return App.DiscAlgoApp;

  });