// param
// region-code
// 
// 



define(['App', 'app/oms/param/param-sys-app'], //

  function(App, ParamSysApp) {

    //define sub app 
    App.module('RegionCodeApp', function(RegionCodeApp) {

      var RegionCodeAppRouter = Marionette.AppRouter.extend({
        appRoutes: {
          "region-codes(/filter/kw::kw)": "listRegionCodes"
        }
      });

      /////////////////////////////////////////////////////////////////
      // define methods for interaction (with parent app) and router //
      /////////////////////////////////////////////////////////////////
      var API = {

        listRegionCodes: function(kw) {
          console.log('>>>>param-sys.listRegionCodes ' + (kw || ''));

          require(['app/oms/param/region-code/list/list-controller'], function (ctrl) {
            ctrl.listRegionCodes(kw); 
          });
        }

      };
      
      //if it is not used to map the url first time typed in browser
      //u can new router anywhere before u want, otherwise, u should
      //add router before start Backbone history
      new RegionCodeAppRouter({ controller: API });


      /////////////////////////////////////////////////
      //register events or command to parent app //////
      /////////////////////////////////////////////////
      ParamSysApp.on('region-codes:list', function(kw) {
        API.listRegionCodes(kw);
      });

      
      //this callback will be invoked before parent app:initilize:after
      App.addInitializer(function() {

        console.log('>>>>new RegionCodeAppRouter');

      });

    });

    return App.RegionCodeApp;

  });