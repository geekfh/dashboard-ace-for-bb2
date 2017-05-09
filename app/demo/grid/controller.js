/**
 * User hefeng
 * Date 2016/7/18
 */
define(['App'], function (App) {
	// api
	var ctrl = {
		// 列表
		list1View: function (options) {
			console.log("options>>>", options);
			require(['app/demo/grid/list1/list-view'], function(View) {
				App.show(new View());
			});
		},

		list2View: function (options) {
			console.log("options>>>", options);
			require(['app/demo/grid/list2/list-view'], function(View) {
				App.show(new View());
			});
		},

		list3View: function (options) {
			console.log("options>>>", options);
			require(['app/demo/grid/list3/list-view'], function(View) {
				App.show(new View());
			});
		},

		list4View: function () {
			require(['app/demo/grid/list4/list-view'], function(View) {
				App.show(new View());
			});
		}
	};

	// grid - list
	App.on("demo:evt:grid:list1", function (options) {
		ctrl.list1View(options);
	});

	App.on("demo:evt:grid:list2", function (options) {
		ctrl.list2View(options);
	});

	App.on("demo:evt:grid:list3", function (options) {
		ctrl.list3View(options);
	});

	App.on("demo:evt:grid:list4", function (options) {
		ctrl.list4View(options);
	});
});
