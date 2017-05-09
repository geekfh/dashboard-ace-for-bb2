// param
// media
// 
// 



define(['App', 'app/oms/param/param-sys-app'], //

  function(App, ParamSysApp) {

    //define sub app 
    App.module('MediaApp', function(MediaApp) {

      var MediaAppRouter = Marionette.AppRouter.extend({
        appRoutes: {
          "medias(/filter/kw::kw)": "listMedias"
        }
      });

      /////////////////////////////////////////////////////////////////
      // define methods for interaction (with parent app) and router //
      /////////////////////////////////////////////////////////////////
      var API = {

        listMedias: function(kw) {
          console.log('>>>>param-sys.listMedias ' + (kw || ''));

          require(['app/oms/param/media/list/list-controller'], function (ctrl) {
            ctrl.listMedias(kw); 
          });
        }

      };
      
      //if it is not used to map the url first time typed in browser
      //u can new router anywhere before u want, otherwise, u should
      //add router before start Backbone history
      new MediaAppRouter({ controller: API });


      /////////////////////////////////////////////////
      //register events or command to parent app //////
      /////////////////////////////////////////////////
      ParamSysApp.on('medias:list', function(kw) {
        API.listMedias(kw);
      });

      
      //this callback will be invoked before parent app:initilize:after
      App.addInitializer(function() {

        console.log('>>>>new MediaAppRouter');

      });

    });

    return App.MediaApp;

  });