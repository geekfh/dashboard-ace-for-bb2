

//此Controller对应于参数设置菜单下的mcc组表
define(['App'], function(App) {


	var Controller = Marionette.Controller.extend({

		listMccGroups: function(kw) {

			require(['app/oms/param/mcc-group/list/list-view'/*,'entities/user'*/], function(View) {

					console.info('new view mcc-group');
					var mccGroupsView =  new View.MccGroups({}); 
        			App.show(mccGroupsView);

			});


		}//@listMccGroups

	});

	var ctrl = new Controller();

    App.on('mcc-groups:list', function() {
        console.log('监听到 App触发的"mccs:list"事件, 触发参数设置菜单下的mcc组表');
        ctrl.listMccGroups();
    });

    return ctrl;


});