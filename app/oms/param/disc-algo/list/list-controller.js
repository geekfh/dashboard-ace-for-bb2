
define(['App'], function(App) {

	App.module('ParamSysApp.DiscAlgo.List', function(List, App, Backbone, Marionette, $, _) {

		List.Controller = {

			listDiscAlgos: function(kw) {

				require(['app/oms/param/disc-algo/list/list-view'/*,'entities/user'*/], function(View) {

						console.info('new view disc-algo');
						var discAlgosView =  new View.DiscAlgos({}); 
            App.show(discAlgosView);

				});


			}//@listDiscAlgos

		};

	});
	return App.ParamSysApp.DiscAlgo.List.Controller;
});