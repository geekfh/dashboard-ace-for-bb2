// param
// account
//
//



define(['App', 'app/oms/param/param-sys-app'], //

  function(App, ParamSysApp) {

    //define sub app
    App.module('AccountApp', function(AccountApp) {

      var AccountAppRouter = Marionette.AppRouter.extend({
        appRoutes: {
          "accounts(/filter/kw::kw)": "listAccounts"
        }
      });

      /////////////////////////////////////////////////////////////////
      // define methods for interaction (with parent app) and router //
      /////////////////////////////////////////////////////////////////
      var API = {

        listAccounts: function(kw) {
          console.log('>>>>param-sys.listAccounts ' + (kw || ''));

          require(['app/oms/param/account/list/list-controller'], function (ctrl) {
            ctrl.listAccounts(kw);
          });
        }

      };

      //if it is not used to map the url first time typed in browser
      //u can new router anywhere before u want, otherwise, u should
      //add router before start Backbone history
      new AccountAppRouter({ controller: API });


      /////////////////////////////////////////////////
      //register events or command to parent app //////
      /////////////////////////////////////////////////
      ParamSysApp.on('accounts:list', function(kw) {
        API.listAccounts(kw);
      });


      //this callback will be invoked before parent app:initilize:after
      App.addInitializer(function() {

        console.log('>>>>new AccountAppRouter');

      });

    });

    return App.AccountApp;

  });