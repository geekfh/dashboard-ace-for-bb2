
//此Controller对应于权限管理菜单下的角色表
define(['App'], function(App) {


	var Controller = Marionette.Controller.extend({

		refreshRoleAuths: function (id) {
			var me = this;

			if(me.view) {
				me.view.refreshAuth(id);
			}
		},

		convert : function (auths) {

			var handle = function (node) {
				var item = {
					name: node.text,
					isLeaf: node.isLeaf,
					id: node.id
				};

				if(!node.isLeaf) {

					item.type = 'folder';

					_.each(node.children || [], function (child) {
						var itemChildren = item.children || (item.children = []);
						itemChildren.push(handle(child));
					});

				}else {

					item.type = 'item';
				}
				return item;
			};

			var ret = [];
			_.each(auths, function (node) {
				ret.push(handle(node));
			});

			return ret;
		},

		listRoles: function(kw) {

			var me = this;

			require(['app/oms/auth/role/list/list-view' /*,'entities/role'*/ ], function(View) {

				console.info('new view roles');
				var rolesView = me.view = new View.Roles({});

				App.show(rolesView);

				rolesView.on('role:edit', function (id, el) {
					console.info('>>>list ctrl view.on role:edit');

					require(['app/oms/auth/role/edit/edit-controller'], function (editCtrl) {
						editCtrl.editRole(id, el);
					});

				});
			});

		} //@listRoles

	});


	var ctrl = new Controller();

    App.on('roles:list', function() {
        console.log('监听到 App触发的"roles:list"事件, 触发权限管理菜单下的角色表');
        ctrl.listRoles();
    });

    return ctrl;


});