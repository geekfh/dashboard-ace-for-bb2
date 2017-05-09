
define(['App',
	'tpl!app/oms/param/region-code/list/templates/table-ct.tpl',
	'i18n!app/oms/common/nls/param',
	'jquery.jqGrid',
	'bootstrap-datepicker'
], function(App, tableCtTpl, paramLang) {

	var LEVEL_TYPE = {
		'1':'省',
		'2':'市',
		'3':'区'
	};
	App.module('ParamSysApp.RegionCode.List.View', function(View, App, Backbone, Marionette, $, _) {

		View.RegionCodes = Marionette.ItemView.extend({
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
					rsId: 'regioncode',
					caption: paramLang._('region-code.txt'),
					nav: {
					},
					gid: 'region-codes-grid',//innerly get corresponding ct '#region-codes-grid-table' '#region-codes-grid-pager'
					url: url._('region-code'),
					colNames: [
						paramLang._('region-code.id'),
						paramLang._('region-code.code'),
						paramLang._('region-code.name'),
						paramLang._('region-code.level'),
						paramLang._('region-code.postal'),
						paramLang._('region-code.express')
					],
					colModel: [
						{name:      'id', index:      'id', editable:  false, hidden: true},
						{name:    'code', index:    'code', editable: true},
						{name:    'name', index:    'name', editable: true},
						{name:   'level', index:   'level', editable: true,formatter: typeFormatter},
						{name:  'postal', index:  'postal', editable: true},
						{name: 'express', index: 'express', editable: true}
					],
					loadComplete: function() {}
				});

			}

		});

	});

	function typeFormatter(val){
		return LEVEL_TYPE[val];
	}
	return App.ParamSysApp.RegionCode.List.View;

});