/**
 * nav-list-ctrl by hefeng
 */
define([
	"assets/scripts/entities/nav/list/list-view"
], function(View) {

	return {
		listNav: function() {
			console.log('>>>>nav.list.controller listNav');

			var deps,
				trigger,
				navView = new View();

			//App.navRegion.show(navView);

			//前缀相当于直接监听collectionView中的每个itemview
			//navView.off("navigate");
			navView.on("navigate", function(e, data) {
				deps = data.deps.split(',');
				trigger = data.trigger;

				if (deps && trigger) {
					console.log('>>>>get navigator deps : ' + deps);

					//在手机或者pad屏幕下，点击了菜单后，菜单栏需要自动隐藏。
					$('#sidebar').removeClass('display');
					$('#menu-toggler').removeClass('display');

					App.maskCurTab();

					var toTop = (document.documentElement.clientHeight / 4);

					//对于像商户增加这样的会超出可见区域的高度，导致加载提示现在在可见区域的下面从而没有提示的情况
					if ($("#page-body")[0].offsetHeight > document.documentElement.clientHeight) {
						$("#page-body").find('.loading-indicator').css("top", toTop);
					}

					require(deps, function() {

						console.log('>>>>App trigger : ' + trigger);

						App.trigger(trigger, data);

						//设置菜单项选中高亮
						navView.triggerMethod('navigate:to', e);

						App.unMaskCurTab();
					});

				}

			});

			return navView;
		}
	};
});