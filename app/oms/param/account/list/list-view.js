
define(['App',
	'tpl!app/oms/param/account/list/templates/table-ct.tpl',
	'i18n!app/oms/common/nls/param',
	'jquery.jqGrid',
	'bootstrap-datepicker'
], function(App, tableCtTpl, paramLang) {

	var DEFAULT_ACCOUNT_VAL_2_LANG = {
		1 : paramLang._('account.is.default.true'),
		0 : paramLang._('account.is.default.false')
	};

	var ACCOUNT_TYPE_VAL_2_LANG = {
		0: paramLang._('account.type.public'),
		1: paramLang._('account.type.private')
	};

	var ACCOUNT_STATUS_VAL_2_LANG = {
		0: paramLang._('account.status.normal'),
		1: paramLang._('account.status.abnormal')
	};

	App.module('ParamSysApp.Account.List.View', function(View, App, Backbone, Marionette, $, _) {

		View.Accounts = Marionette.ItemView.extend({
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
						rsId:'account',
						caption: paramLang._('account.txt'),
						nav: {
						},
						gid: 'accounts-grid',//innerly get corresponding ct '#accounts-grid-table' '#accounts-grid-pager'
						url: url._('account'),

						colNames: [
							'',//for hidden id
							paramLang._('account.app.type'),
							paramLang._('account.app.id'),
							paramLang._('account.seq'),
							paramLang._('account.is.default'),
							paramLang._('account.type'),
							paramLang._('account.no'),
							paramLang._('account.name'),
							paramLang._('account.status'),
							paramLang._('account.bank.no'),
							paramLang._('account.bank.name'),
							paramLang._('account.zbank.no'),
							paramLang._('account.zbank.name'),
							paramLang._('account.zbank.addr'),
							paramLang._('account.zbank.code'),
							paramLang._('account.net.no'),
							paramLang._('account.union.no')
						],

						colModel: [
							{name: 'id'       , index: 'id'       , hidden: true   , editable: false},
							{name: 'appType'  , index: 'appType'  , editable: true},
							{name: 'appId'    , index: 'appId'    , editable: true},
							{name: 'seq'      , index: 'seq'      , editable: true},
							{name: 'isDefault', index: 'isDefault', editable: true, formatter:'map', formatoptions: {map: DEFAULT_ACCOUNT_VAL_2_LANG}},
							{name: 'type'     , index: 'type'     , editable: true, formatter:'map', formatoptions: {map: ACCOUNT_TYPE_VAL_2_LANG}},
							{name: 'no'       , index: 'no'       , editable: true},
							{name: 'name'     , index: 'name'     , editable: true},
							{name: 'status'   , index: 'status'   , editable: true, formatter:'map', formatoptions: {map: ACCOUNT_STATUS_VAL_2_LANG}},
							{name: 'bankNo'   , index: 'bankNo'   , editable: true},
							{name: 'bankName' , index: 'bankName' , editable: true},
							{name: 'zbankNo'  , index: 'zbankNo'  , editable: true},
							{name: 'zbankName', index: 'zbankName', editable: true},
							{name: 'zbankAddr', index: 'zbankAddr', editable: true},
							{name: 'zbankCode', index: 'zbankCode', editable: true},
							{name: 'netNo'    , index: 'netNo'    , editable: true},
							{name: 'unionNo'  , index: 'unionNo'  , editable: true}
						],

						loadComplete: function() {}
				});

			}

		});

	});



	return App.ParamSysApp.Account.List.View;

});