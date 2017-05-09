
define(['App'], function(App) {

	App.module('ParamSysApp.Media.List', function(List, App, Backbone, Marionette, $, _) {

		List.Controller = {

			listMedias: function(kw) {

				require(['app/oms/param/media/list/list-view'/*,'entities/user'*/], function(View) {

						console.info('new view media');
						var mediasView =  new View.Medias({}); 
            App.show(mediasView);

				});


			}//@listMedias

		};

	});
	return App.ParamSysApp.Media.List.Controller;
});