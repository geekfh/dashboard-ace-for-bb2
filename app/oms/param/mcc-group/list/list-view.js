
define(['App',
	'tpl!app/oms/param/mcc-group/list/templates/table-ct.tpl',
	'i18n!app/oms/common/nls/param',
	'jquery.jqGrid',
	'jquery.validate',
	'bootstrap-datepicker'
], function(App, tableCtTpl, paramLang) {

	App.module('ParamSysApp.MccGroup.List.View', function(View, App, Backbone, Marionette, $, _) {

		View.MccGroups = Marionette.ItemView.extend({
			tabId: 'menu.param.mccgroup',
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
				var me = this;

				var setupValidation = Opf.Validate.setup;
				var addValidateRules = function(form) {



					Opf.Validate.addRules(form, {
						rules: {

							code: {
								'required': true
							},
							name: {
								'required': true
							},
							baseFee: {
								'required': true
							},
							descr:{
								'required':true
							}
						}

					});
				};
				var roleGird = App.Factory.createJqGrid({
					rsId: 'mccgroup',
					caption: paramLang._('mcc-group.txt'),
					nav: {
						add:{
							beforeShowForm:function(form){
								addValidateRules(form);	
							},
							beforeSubmit: setupValidation
						},
						edit:{
							beforeShowForm:function(form){
								addValidateRules(form);	
							},
							beforeSubmit: setupValidation
						}
					},
					gid: 'mcc-groups-grid',//innerly get corresponding ct '#mcc-groups-grid-table' '#mcc-groups-grid-pager'
					url: url._('mcc-group'),
					colNames: [
						paramLang._('mcc-group.id'),
						paramLang._('mcc-group.code'),
						paramLang._('mcc-group.name'),
						paramLang._('mcc-group.base.fee'),
						paramLang._('mcc-group.descr')
					],
					colModel: [
						{name: 'id'      , index: 'id'      , editable: false, hidden: true},
						{name: 'code'    , index: 'code'    , search:true,editable: true,
							_searchType:'string'
						},
						{name: 'name'    , index: 'name'    , search:true,editable: true,
							_searchType:'string'
						},
						{name: 'baseFee' , index: 'baseFee' , search:false,editable: true},
						{name: 'descr'   , index: 'descr'   , search:false,editable: true}
					],

					loadComplete: function() {}
				});

			}

		});

	});


	return App.ParamSysApp.MccGroup.List.View;

});