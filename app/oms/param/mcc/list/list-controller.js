
//此Controller对应于参数设置菜单下的mcc表
define(['App'], function(App) {


	var Controller = Marionette.Controller.extend({

		listMccs: function(kw) {

			require(['app/oms/param/mcc/list/list-view'/*,'entities/user'*/], function(View) {

					console.info('new view mcc');
					var mccsView =  new View.Mccs({}); 
                    App.show(mccsView);

			});


		}//@listMccs

	});

	var ctrl = new Controller();

    App.on('mccs:list', function() {
        console.log('监听到 App触发的"mccs:list"事件, 触发参数设置菜单下的mcc表');
        ctrl.listMccs();
    });

    return ctrl;


});