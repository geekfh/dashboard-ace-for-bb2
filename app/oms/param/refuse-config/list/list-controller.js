/**
 * 审核拒绝理由模板
 */
define(['App'], function(App) {
	var Controller = Marionette.Controller.extend({
		list: function() {
			require(['app/oms/param/refuse-config/list/list-view'], function(View) {
                App.show(new View);
			});
		}
	});

	var ctrl = new Controller();

    App.on('refuse:config:list', function() {
        console.log('监听到 App触发的"refuse-config:list"事件, 触发参数设置菜单下的"审核拒绝理由模板"');
        ctrl.list();
    });

    return ctrl;
});