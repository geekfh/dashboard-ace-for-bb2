

//此Controller对应于参数设置菜单下的支行表
define(['App'], function(App) {


	var Controller = Marionette.Controller.extend({

		listZbanks: function(kw) {

			require(['app/oms/param/zbank/list/list-view'/*,'entities/user'*/], function(View) {

					console.info('new view zbank');
					var zbanksView =  new View.Zbanks({}); 
      				App.show(zbanksView);

			});


		}//@listZbanks

	});


	var ctrl = new Controller();

    App.on('zbanks:list', function() {
        console.log('监听到 App触发的"zbanks:list"事件, 触发参数设置菜单下的支行表');
        ctrl.listZbanks();
    });

    return ctrl;


});