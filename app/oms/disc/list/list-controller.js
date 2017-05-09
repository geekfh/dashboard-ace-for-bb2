//此Controller对应于参数设置菜单下的计费模型表
define(['App'], function(App) {

	var Controller = Marionette.Controller.extend({
		listDiscs: function () {
			require(['app/oms/disc/list/list-view'/*,'entities/user'*/], function (View) {

				console.info('new view disc');
				var discsView = new View.Discs({});
				App.show(discsView);

			});
		},//@listDiscs
        listMcht: function () {
            require(['app/oms/disc/list/list-mcht-view'], function (View) {

                console.info('new view disc mcht');
                var mchtView = new View.Mcht({});
                App.show(mchtView);

            });
        },//@listMcht
		listProfit: function() {
			require(['app/oms/disc/profit/list-view'], function(View) {
				console.info('new view profit');
				var profitView =  new View.Profit({});
				App.show(profitView);

			});
		}
	});

	var ctrl = new Controller();

    App.on('discs:list', function() {
        console.log('监听到 App触发的"discs:list"事件, 触发参数设置菜单下的计费模型表');
		ctrl.listDiscs();
    });
    App.on('discs:list:mcht', function() {
        console.log('监听到 App触发的"discs:list:mcht"事件, 触发参数设置菜单下的单商户服务费');
        ctrl.listMcht();
    });
	App.on('profit:list', function() {
		console.log('监听到 App触发的"profit:list"事件, 触发参数设置菜单下的服务费分润');
		ctrl.listProfit();
	});

	return ctrl;
});