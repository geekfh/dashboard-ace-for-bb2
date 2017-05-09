

//此Controller对应于参数设置菜单下的基本参数表
define(['App'], function(App) {


	var Controller = Marionette.Controller.extend({

		listSysParams: function(kw) {

			require(['app/oms/param/sys-param/list/list-view'/*,'entities/user'*/], function(View) {

					console.info('new view sys-param');
					var sysParamsView =  new View.SysParams({}); 
       				 App.show(sysParamsView);

			});


		}//@listSysParams

	});

	var ctrl = new Controller();

    App.on('sys-params:list', function() {
        console.log('监听到 App触发的"sys-params:list"事件, 触发参数设置菜单下的基本参数表');
        ctrl.listSysParams();
    });

    return ctrl;


});