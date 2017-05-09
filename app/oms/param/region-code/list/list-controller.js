
define(['App'], function(App) {

	App.module('ParamSysApp.RegionCode.List', function(List, App, Backbone, Marionette, $, _) {

		List.Controller = {

			listRegionCodes: function(kw) {

				require(['app/oms/param/region-code/list/list-view'/*,'entities/user'*/], function(View) {

						console.info('new view region-code');
						var regionCodesView =  new View.RegionCodes({}); 
            App.show(regionCodesView);

				});


			}//@listRegionCodes

		};

	});
	return App.ParamSysApp.RegionCode.List.Controller;
});