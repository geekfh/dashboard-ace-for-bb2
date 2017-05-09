
//此Controller对应于权限管理菜单下的权限表
define(['App'], function(App) {


	var Controller = Marionette.Controller.extend({

		listPrivileges: function(kw) {

			require(['app/oms/auth/privilege/list/list-view'/*,'entities/privilege'*/], function(View) {

					console.info('new view privileges');
					var privilegesView =  new View.Privileges({}); 

        App.show(privilegesView);

			});


		}//@listPrivileges

	});


	var ctrl = new Controller();

    App.on('privileges:list', function() {
        console.log('监听到 App触发的"privileges:list"事件, 触发权限管理菜单下的权限表');
        ctrl.listPrivileges();
    });

    return ctrl;



});