/**
 * User hefeng
 * Date 2016/7/18
 */
define(['App'], function (App) {
	// api
	var ctrl = {
		// test
		testView: function () {
			require(['app/demo/others/test/view'], function(View) {
				App.show(new View());
			});
		},
		// ckeditor
		ckeditorView: function (options) {
			require(['app/demo/others/ckeditor/view'], function(View) {
				App.show(new View());
			});
		},

		datetimepickerView: function () {
			require(['app/demo/others/datetimepicker/view'], function(View) {
				App.show(new View());
			});
		},

		backgridView: function () {
			require(['app/demo/others/backgrid/view'], function(View) {
				App.show(new View());
			});
		},

		select2View: function () {
			require(['app/demo/others/select2/view'], function(View) {
				App.show(new View());
			});
		},

		echartsView: function () {
			require(['app/demo/others/echarts/view'], function(View) {
				App.show(new View());
			});
		},

		jqGridView: function () {
			require(['app/demo/others/jqGrid/view'], function(View) {
				App.show(new View());
			});
		},

		bootstrapView: function () {
			require(['app/demo/others/bootstrap/view'], function(View) {
				App.show(new View());
			});
		}
	};

	// test
	App.on("demo:evt:others:test", function (options) {
		ctrl.testView();
	});

	// ckeditor
	App.on("demo:evt:others:ckeditor", function (options) {
		ctrl.ckeditorView(options);
	});

	// jqueryui datetimepicker
	App.on("demo:evt:others:datetimepicker", function () {
		ctrl.datetimepickerView();
	});

	// backgrid
	App.on("demo:evt:others:backgrid", function () {
		ctrl.backgridView();
	});

	// select2
	App.on("demo:evt:others:select2", function () {
		ctrl.select2View();
	});

	// echarts
	App.on("demo:evt:others:echarts", function () {
		ctrl.echartsView();
	});

	// jqGrid
	App.on("demo:evt:others:jqGrid", function () {
		ctrl.jqGridView();
	});

	// bootstrap
	App.on("demo:evt:others:bootstrap", function () {
		ctrl.bootstrapView();
	});
});
