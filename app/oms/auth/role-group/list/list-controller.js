

//此Controller对应于权限管理菜单下的角色组表
define(['App'], function(App) {


	var Controller = Marionette.Controller.extend({

		listRoleGroups: function(kw) {

			require(['app/oms/auth/role-group/list/list-view'], function(View) {

				var roleGroupsView =  new View.RoleGroups({}); 

   				 App.show(roleGroupsView);

			});


		}//@listRoleGroups

	});


	var ctrl = new Controller();

    App.on('role-groups:list', function() {
        console.log('监听到 App触发的"role-groups:list"事件, 触发权限管理菜单下的角色组表');
        ctrl.listRoleGroups();
    });

    return ctrl;

});