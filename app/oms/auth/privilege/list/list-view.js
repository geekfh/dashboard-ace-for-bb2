define(['App',
	'tpl!app/oms/auth/privilege/list/templates/table-ct.tpl',
	'i18n!app/oms/common/nls/auth',
	'jquery.jqGrid',
	'bootstrap-datepicker'
], function(App, tableCtTpl, authLang) {

	App.module('AuthSysApp.Privilege.List.View', function(View, App, Backbone, Marionette, $, _) {

		View.Privileges = Marionette.ItemView.extend({
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
						rules : {
							name: 'required',
							code: 'required',
							resName: 'required'
						}
					});
				};

				var privilegeGird = App.Factory.createJqGrid({
						rsId: 'privilege',
						caption: authLang._('privilege.txt'),
						nav: {
							formSize: {
	                            width: Opf.Config._('ui', 'privilege.grid.form.width'),
	                            height: Opf.Config._('ui', 'privilege.grid.form.height')
	                        },
							add : {
								beforeShowForm: function(form) {
									addValidateRules(form);
								},
								beforeSubmit: setupValidation
							},
							
							edit: {
								beforeShowForm: function (form) {
									var $form = $(form),
										$code = $form.find('input[name="code"]');
									$code.attr('readonly', 'readonly');
									$code.css('readonly');
									addValidateRules(form);
								},
								beforeSubmit: setupValidation
							}
						},
						gid: 'privileges-grid',//innerly get corresponding ct '#privileges-grid-table' '#privileges-grid-pager'
						url: url._('privilege'),
						colNames: [
							'',
							authLang._('name'),
							authLang._('code'),
							authLang._('auth.module'),
							authLang._('url'),
							authLang._('auth.res.code'),
							authLang._('auth.res.name')
							],

						responsiveOptions: {
							hidden: {
								ss: [ 'module', 'resUrl', 'resCode','resName'],
								xs: [ 'module', 'resUrl', 'resCode'],
								sm: [ 'resUrl', 'resCode'],
								md: [],
								ld: []
							}
						},

						colModel: [
							{name: 'id', index: 'id', editable: false, hidden: true  },
							{name: 'name', index: 'name', search:true,editable: true ,
								_searchType:'string'
							},
							{name: 'code', index: 'code', search:false,editable: true  },
							{name: 'module', index: 'module', search:false,editable: false, hidden: true  },
							{name: 'resUrl', index: 'resUrl', search:false,editable: false, hidden: true  },
							{name: 'resCode', index: 'resCode', search:false,editable: false, hidden: true },
							{name: 'resName', index: 'resName', search:false,editable: true  }


						],
						// pager: pagerSelector,// '#privileges-grid-pager'

						loadComplete: function() {}
				});

			}

		});

	});
	
	function isExplorerFormatter (val) {
		return IS_EXPOLRER_MAP[val];
	}

	function genderFormatter (val) {
		return GENDER_MAP[val];
	}


	function statusFormatter (val) {
		return STATUS_MAP[val];
	}	

	return App.AuthSysApp.Privilege.List.View;

});