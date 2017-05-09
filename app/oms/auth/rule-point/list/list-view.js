define(['App',
	'tpl!app/oms/auth/rule-point/list/templates/table-ct.tpl',
	'i18n!app/oms/common/nls/auth',
	'jquery.jqGrid',
	'bootstrap-datepicker'
], function(App, tableCtTpl, authLang) {

	App.module('AuthSysApp.RulePoint.List.View', function(View, App, Backbone, Marionette, $, _) {

		View.RulePoints = Marionette.ItemView.extend({
			template: tableCtTpl,

			events: {

			},

			onRender: function() {
				var me = this;

				setTimeout(function() {

					me.renderGrid();

				}, 1);
			},

			renderGrid: function() {

				var roleGird = App.Factory.createJqGrid({
						caption: authLang._('rule-point.txt'),
						nav: {
						},
						gid: 'rule-points-grid',//innerly get corresponding ct '#rule-points-grid-table' '#rule-points-grid-pager'
						url: 'rule-points',
						colNames: [
							// '',
							authLang._('name'),
							authLang._('descr')],

						colModel: [
							{name: 'name', index: 'name', editable: true  }, 
							{name: 'descr', index: 'descr', editable: true  }
						],
						// pager: pagerSelector,// '#rule-points-grid-pager'

						loadComplete: function() {}
				});

			}

		});

	});

	return App.AuthSysApp.RulePoint.List.View;

});