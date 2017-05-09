
define(['App',
	'tpl!app/oms/param/sys-param/list/templates/table-ct.tpl',
	'i18n!app/oms/common/nls/param',
	'jquery.jqGrid',
	'bootstrap-datepicker'
], function(App, tableCtTpl, paramLang) {

	var TYPE_MAP = {
		'0': '系统参数',
		'1': '业务参数',
		'2': '其他',
	};
	App.module('ParamSysApp.SysParam.List.View', function(View, App, Backbone, Marionette, $, _) {

		View.SysParams = Marionette.ItemView.extend({
			tabId: 'menu.param.sysparam',
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
				var setupValidation = Opf.Validate.setup;
				var addValidateRules = function(form) {
					Opf.Validate.addRules(form, {
						rules: {
							owner: 'required',
							key: 'required',
							type: 'required',
							value: 'required',
							descr: 'required'
							
						}
					});
				};

				var roleGird = App.Factory.createJqGrid({
					rsId:'sysparam',
					caption: paramLang._('sys-param.txt'),
					nav: {
						add: {
							beforeShowForm: function(form) {
								addValidateRules(form);
							},
							beforeSubmit: setupValidation
						},

						edit: {
							beforeShowForm: function(form) {
								addValidateRules(form);
							},
							beforeSubmit: setupValidation
						}
					},
					gid: 'sys-params-grid',//innerly get corresponding ct '#sys-params-grid-table' '#sys-params-grid-pager'
					url: url._('sys-param'),
					colNames: [
						paramLang._('sys-param.id'),
						paramLang._('sys-param.owner'),
						paramLang._('sys-param.key'),
						paramLang._('sys-param.type'),
						paramLang._('sys-param.value'),
						paramLang._('sys-param.descr')
					],

					responsiveOptions: {
						hidden: {
							ss: ['type', 'value', 'descr'],
							xs: ['type', 'value', 'descr'],
							sm: ['descr'],
							md: ['descr'],
							ld: []
						}
					},

					colModel: [
						{name:    'id', index:    'id', editable:  false, hidden: true},
						{name: 'owner', index: 'owner', search:true,editable: true,
							_searchType:'string'
						},
						{name:   'key', index:   'key', search:false,editable: true},
						{name:  'type', index:  'type', search:false,editable: true,formatter: typeFormatter,
						edittype:'select',
							editoptions: {
								value: TYPE_MAP
							}
						},
						{name: 'value', index: 'value', search:false,editable: true},
						{name: 'descr', index: 'descr', search:false,editable: true}
					],

					loadComplete: function() {}
				});

			}

		});

	});

	function typeFormatter(val){
		return TYPE_MAP[val] || '<span style="color: red">未识别的参数类型</span>';
	}
	return App.ParamSysApp.SysParam.List.View;

});