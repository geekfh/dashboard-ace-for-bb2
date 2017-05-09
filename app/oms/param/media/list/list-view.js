
define(['App',
	'tpl!app/oms/param/media/list/templates/table-ct.tpl',
	'i18n!app/oms/common/nls/param',
	'jquery.jqGrid',
	'bootstrap-datepicker'
], function(App, tableCtTpl, paramLang) {

	App.module('ParamSysApp.Media.List.View', function(View, App, Backbone, Marionette, $, _) {

		View.Medias = Marionette.ItemView.extend({
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
					caption: paramLang._('media.txt'),
					nav: {
					},
					gid: 'medias-grid',//innerly get corresponding ct '#medias-grid-table' '#medias-grid-pager'
					url: url._('media'),
					colNames: [
						paramLang._('media.id'),
						paramLang._('media.app.type'),
						paramLang._('media.app.id'),
						paramLang._('media.path'),
						paramLang._('media.descr')
					],
					colModel: [
						{name:      'id', index:      'id', editable:  false, hidden: true},
						{name: 'appType', index: 'appType', editable: true},
						{name:   'appId', index:   'appId', editable: true},
						{name:    'path', index:    'path', editable: true},
						{name:   'descr', index:   'descr', editable: true}
					],
					loadComplete: function() {}
				});

			}

		});

	});


	return App.ParamSysApp.Media.List.View;

});