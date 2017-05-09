
define(['App'], function(App) {

	App.module('ParamSysApp.Account.List', function(List, App, Backbone, Marionette, $, _) {

		List.Controller = {

			listAccounts: function(kw) {

				require(['app/oms/param/account/list/list-view'/*,'entities/user'*/], function(View) {

						console.info('new view account');
						var accountsView =  new View.Accounts({}); 
            App.show(accountsView);

				});


			}//@listAccounts

		};

	});
	return App.ParamSysApp.Account.List.Controller;
});