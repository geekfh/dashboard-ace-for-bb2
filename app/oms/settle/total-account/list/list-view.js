/**
 * @created 2014-3-12 19:27:29
 */



define(['App',
	'tpl!app/oms/settle/total-account/list/templates/table-ct.tpl',
	'i18n!app/oms/common/nls/settle',
	'jquery.jqGrid',
	'jquery.validate',
	'bootstrap-datepicker'
], function(App, tableCtTpl, settleLang) {

	App.module('SettleApp.TotalAccount.List.View', function(View, App, Backbone, Marionette, $, _) {

		View.TotalAccounts = Marionette.ItemView.extend({
			tabId: 'menu.total.account',
			template: tableCtTpl,

			events: {

			},
			
			onRender: function() {
				var me = this;

				setTimeout(function() {

					me.renderGrid();

				},1);
			},
			
			attachValidation: function() {
				return {
					setupValidation: Opf.Validate.setup,
					addValidateRules: function(form) {
	                    Opf.Validate.addRules(form, {
		                    rules:{
		                    	stlmDate:{
		                            required: true,
		                            date: true
		                        },
		                        upBalance:{
		                            required: true,
		                            float: true
		                        },
		                        nowBalance:{
		                            required: true,
		                            float: true
		                        },
								cupInAmt:{
									required: true,
									float: true
		                        },
		                        mchtAmt:{
		                            required: true,
		                            float: true
		                        },
		                        brhFee:{
		                            required: true,
		                            float: true
		                        },
		                        drawAmt:{
		                            required: true,
		                            float: true
		                        },
		                        otherInAmt:{
		                            required: true,
		                            float: true
		                        },
		                        otherOutAmt:{
		                            required: true,
		                            float: true
		                        }
		                    }
	                    });
	                }
				};
				
			},
			
			renderGrid: function() {
				
				var validation = this.attachValidation();
				
				var roleGird = App.Factory.createJqGrid({
					rsId:'totalAccount',
					caption: settleLang._('totalAccount.txt'),
					actionsCol: {
						// width: 130,
						edit : false,
						del: false
					},
					nav: {

						actions: {
                            add: false
                        },
						
						//add/edit/view 继承
						formSize: {
							width: Opf.Config._('ui', 'totalAccount.grid.form.width'),
							height: Opf.Config._('ui', 'totalAccount.grid.form.height')
						},
						add: {
							beforeShowForm: function(form) {
								validation.addValidateRules(form);
                            },
                            beforeSubmit: validation.setupValidation
						},
						edit: {
							beforeShowForm: function(form) {
								validation.addValidateRules(form);
                            },
                            beforeSubmit: validation.setupValidation
						},
						view: {
							width: Opf.Config._('ui', 'totalAccount.grid.viewform.width'),
							height: Opf.Config._('ui', 'totalAccount.grid.viewform.height')
						}
					},
					gid: 'total-accounts-grid',//innerly get corresponding ct '#total-accounts-grid-table' '#total-accounts-grid-pager'
					url: url._('total.account'),
					colNames: {
						id       : settleLang._('total.account.id'),  //ID
						stlmDate       : settleLang._('total.account.stlm.date'),  //账务日期
						upBalance       : settleLang._('total.account.up.balance'),  //前结算日余额
						nowBalance       : settleLang._('total.account.now.balance'),  //当前余额
						cupInAmt       : settleLang._('total.account.cup.in.amt'),  //渠道收款金额
						mchtAmt       : settleLang._('total.account.mcht.amt'),  //商户清算付款金额
						brhFee       : settleLang._('total.account.brh.fee'),  //机构服务付款金额
						drawAmt       : settleLang._('total.account.draw.amt'),  //公司提现付款金额
						otherInAmt       : settleLang._('total.account.other.in.amt'),  //其它收款金额
						otherOutAmt       : settleLang._('total.account.other.out.amt'), //其它付款金额
						unknowAmt       : settleLang._('total.account.other.unknow.amt') //付款未确定金额
					},

					responsiveOptions: {
						hidden: {
							ss: ['upBalance', 'brhFee', 'drawAmt', 'otherInAmt', 'otherOutAmt', 'unknowAmt', 'cupInAmt', 'mchtAmt'],
							xs: ['upBalance', 'brhFee', 'drawAmt', 'otherInAmt', 'otherOutAmt', 'unknowAmt'],
							sm: ['drawAmt', 'otherInAmt', 'otherOutAmt', 'unknowAmt'],
							md: ['otherInAmt', 'otherOutAmt'],
							ld: []
						}
					},

					colModel: [
						{name:         'id', index:         'id', editable: false, hidden: true},  //ID
						{name:         'stlmDate', index:         'stlmDate', search:true,editable: true,
							searchoptions: {
								dataInit : function (elem) {
									$(elem).datepicker({autoclose: true,format: 'yyyymmdd'});
								},
								sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge']
							},
							editoptions: {
								dataInit : function (elem) {
									$(elem).datepicker({ autoclose: true,format: 'yyyymmdd' })
										.on("changeDate changeMonth changeYear", function(oDate) {
											$(oDate.target).valid();
										});
								}
							}
						
						},  //账务日期
						{name:         'upBalance', index:         'upBalance', search:false,editable: true, formatter: Opf.currencyFormatter },  //前结算日余额
						{name:         'cupInAmt', index:         'cupInAmt', search:false,editable: true, formatter: Opf.currencyFormatter},  //渠道收款金额
						{name:         'mchtAmt', index:         'mchtAmt', search:false,editable: true, formatter: Opf.currencyFormatter},  //商户清算付款金额
						{name:         'brhFee', index:         'brhFee', search:false,editable: true, formatter: Opf.currencyFormatter},  //机构服务付款金额
						{name:         'drawAmt', index:         'drawAmt', search:false,editable: true, formatter: Opf.currencyFormatter},  //公司提现付款金额
						{name:         'otherInAmt', index:         'otherInAmt', search:false,editable: true, formatter: Opf.currencyFormatter},  //其它收款金额
						{name:         'otherOutAmt', index:         'otherOutAmt', search:false,editable: true, formatter: Opf.currencyFormatter}, //其它付款金额
						{name:         'unknowAmt',   index:         'unknowAmt', search:false,editable: true, formatter: Opf.currencyFormatter},
						{name:         'nowBalance', index:         'nowBalance', search:false,editable: true, formatter: Opf.currencyFormatter}  //当前余额
					],

					loadComplete: function() {}
				});

			}

		});

	});


	return App.SettleApp.TotalAccount.List.View;

});