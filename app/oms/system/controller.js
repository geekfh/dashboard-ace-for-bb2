/**
 * User hefeng
 * Date 2016/7/18
 */
define(['App'], function (App) {

	// api
	var ctrl = {

		//菜单权限
		permissionView: function() {
			require(['app/oms/system/permission/list-view'], function (View) {
				App.show(new View());
			});
		},

		//统一平台
		unionView: function() {
			require(['app/oms/system/union/list-view'], function (View) {
				App.show(new View());
			});
		}

	};

	//系统设置 - 菜单&权限配置
	App.on('oms:evt:system:permission', function(){
		ctrl.permissionView();
	});

	//系统设置 - 统一平台配置
	App.on("oms:evt:system:union", function () {
		ctrl.unionView();
	});
});