/**
 * @created 2014-3-12 19:27:29
 */
define(['App',
	'tpl!app/oms/settle/total-account-detail/list/templates/table-ct.tpl',
	'tpl!app/oms/settle/total-account-detail/list/templates/total-account-detail.tpl',
	'i18n!app/oms/common/nls/settle',
	'jquery.jqGrid',
	'jquery.validate',
	'bootstrap-datepicker'
], function(App, tableCtTpl, totalAcctDetailTpl, settleLang) {

	var STLMTYPE_MAP = {
		"0" : settleLang._("total-account-detail.stlmType.0"),
		"1" : settleLang._("total-account-detail.stlmType.1"),
		"2" : settleLang._("total-account-detail.stlmType.2")
	};

	var STAT_MAP = {
		"0" : "审核通过",
		"1" : "审核拒绝",
		"2" : "初始化申请"
	};

	App.module('SettleApp.TotalAccountDetail.List.View', function(View, App, Backbone, Marionette, $, _) {

		View.TotalAccountDetails = Marionette.ItemView.extend({
			tabId: 'menu.total.account.detail',
			template: tableCtTpl,

			events: {

			},

			onRender: function() {
				var me = this;

				setTimeout(function() {

					me.renderGrid();

				},1);
			},

			getRequestDateSelect: function(gird) {
				var data = {};
				data['id'] = Opf.Grid.getSelRowId(gird);
				var $form = $('form.form-total-account-detall').find(':input');
				$form.each(function() {
					data[$(this).attr('name')] = $(this).val();
				});
				return {
					url: 'api/settle/total-account-details/' + data['id'] + '/update',
					data: data,
					type: "PUT",
					contentType: "application/json",
					dataType: "json",
					needData: true
				};
			},

			ajaxRequest: function(options, dialog, grid) {

				$.ajax({
					type: options.type,
					contentType: options.contentType,
					dataType: options.dataType,
					url: options.url,
					data: options.needData ? JSON.stringify(options.data) : "",
					success: function(resp) {
						console.log('审核结果：' + (resp.success || '') + (resp.msg || ''));
						$(dialog).dialog("destroy");
						$(grid).trigger("reloadGrid", [{current:true}]);
						if(resp.success) {
		                    Opf.Toast.success('操作成功');
		                }
					},
					error: function(resp) {
						console.error(resp.msg || resp.success || resp);
						$(dialog).dialog("destroy");
					}
				});
			},

			ajaxGetAccount: function(form, value, select){
				$.ajax({
					type: 'GET',
					contentType: 'application/json',
					dataType: 'json',
					url: url._('stlm.account') + '/' + value + '/accountInfo',
					success: function(resp) {
						var $form = $(form),
							$select = $(select);
							$select.empty();

						for(var i=0; i<resp.length; i++) {
							var appendedData = '<option value="' + resp[i].key + '">' + resp[i].value + '</option>';
							$select.append(appendedData);
						}
					},
					error: function(resp){
						console.error(resp);
					}
				});
			},
			
			attachValidation: function() {
				return {
					setupValidation: Opf.Validate.setup,
					addValidateRules: function(form){
	                    Opf.Validate.addRules(form, {
		                    rules:{
		                    	stlmType:{
		                            required: true
		                        },
		                        outAcctId:{
		                            required: true
		                        },
		                        txAmt:{
		                            required: true,
		                            float: true
		                        },
		                        oprMsg:{
									required: true,
									maxlength: 300
		                        }
		                    }
	                    });
	                }
				};
				
			},

			onClickButton: function(roleGird) {
				var me = this;
				var tpl = totalAcctDetailTpl();
				var $dialog = $(tpl).dialog({
					autoOpen: true,
					height: Opf.Config._('ui', 'totalAccountDetail.grid.form.extra.height'),     //300,
					width: Opf.Config._('ui', 'totalAccountDetail.grid.form.extra.width'),    //350,
					modal: true,
					buttons: [{
						html: "<i class='icon-ok'></i>&nbsp; 提交",
						"class" : "btn btn-xs btn-primary",
						click: function(e) {

							var $form = $('form.form-total-account-detall');
							var validator = $form.validate();
							var valid = true;
							if(validator && !validator.form()){
								valid = false;
							}
							if(valid){
								$($(e.target).closest('button')).addClass('disabled').find('span').html("<i class='icon-ok'></i>&nbsp; 正在提交...");	
								me.ajaxRequest(me.getRequestDateSelect(roleGird), this, roleGird);
							}
						}
					}, {
						html: "<i class='icon-remove'></i>&nbsp; 取消",
						"class" : "btn btn-xs",
						click: function() {
							$( this ).dialog( "destroy" );
						}
					}],
					create: function() {
						Opf.Validate.addRules($('form.form-total-account-detall'), {
							rules: {
								oprMsg2: {
									required: true,
									maxlength: 300
								}
							}
						});


						$(this).prev('.ui-widget-header').find('.ui-dialog-title').addClass('settle-styles-paddingL-15');
					},
					close: function() {
						$( this ).dialog( "destroy" );
					}
				});
			},

			renderGrid: function() {
				
				var me = this;
				var validation = this.attachValidation();
				var roleGird = App.Factory.createJqGrid({
					rsId:'totalAccountDetail',
					caption: settleLang._('totalAccountDetail.txt'),
					jsonReader: {

					},
					actionsCol: {
						// width: Opf.Config._('ui', 'totalAccountDetail.grid.form.actionsCol.width'),  // 130,
						edit : false,
						del: false,
						extraButtons: [
							{name: 'check', title:'审核', icon: 'icon-opf-verify icon-opf-verify-color', click: function() {
								me.onClickButton(roleGird);
							}}
						],
						canButtonRender: function(name, opts, rowData) {
							// return true;
							// 初始申请的情况下才可以显示审核按钮
							if(name === 'check' && rowData.stat !== '2') {
								return false;
							}
						}
					},
					nav: {
						formSize: {
							width: Opf.Config._('ui', 'totalAccountDetail.grid.form.width'),
							height: Opf.Config._('ui', 'totalAccountDetail.grid.form.height')
						},
						add : {
							beforeShowForm: function(form) {
								validation.addValidateRules(form);
								
								var $select = $(form).find('select[name="stlmType"]');
								$select.on('change', function(){
									var $acctSelect = $('#tr_outAcctId').find('select');
									var $caption = $('#tr_outAcctId').find('.CaptionTD');
									var value = $(this).val();
									if (value === '0') {
										$acctSelect.attr('name', 'outAcctId');
										$caption.empty().append('付款账户');
										me.ajaxGetAccount(form, value, $acctSelect);

									} else if (value === '1') {
										$acctSelect.attr('name', 'outAcctId');
										$caption.empty().append('付款账户');
										me.ajaxGetAccount(form, value, $acctSelect);

									} else if (value === '2') {
										$acctSelect.attr('name', 'inAcctId');
										$caption.empty().append('收款账户');
										me.ajaxGetAccount(form, value, $acctSelect);

									}
									
								});

								$select.trigger('change');
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
							width: Opf.Config._('ui', 'totalAccountDetail.grid.viewform.width'),
							height: Opf.Config._('ui', 'totalAccountDetail.grid.viewform.height')
						}
					},
					gid: 'total-account-details-grid',//innerly get corresponding ct '#total-account-details-grid-table' '#total-account-details-grid-pager'
					url: url._('total.account.detail'),
					colNames: {
						id       : settleLang._('total.account.detail.id'),  //ID
						stlmDate       : settleLang._('total.account.detail.stlm.date'),  //账务日期
						stlmType       : settleLang._('total.account.detail.stlm.type'),  //账务维护类型
						txAmt       : settleLang._('total.account.detail.tx.amt'),  //交易金额
                        realetiveAccount : settleLang._('total.account.detail.realetive.account'),
						oprName        : settleLang._('total.account.detail.opr.name'),
						oprMsg       : settleLang._('total.account.detail.opr.msg'),  //操作描述

						//add database message because the database had changed in 20140321
						stat           : settleLang._('total.account.detail.stat'),   //状态
						//add end
						oprMsg2       : settleLang._('total.account.detail.opr.msg2'),  //复审描述
						oprName2       : settleLang._('total.account.detail.opr.name2'),
						
						
						//add rows
						outAcctNo    : settleLang._('total.account.detail.out.acct.no'),
						inAcctNo     : settleLang._('total.account.detail.in.acct.no'),
						//add end
						//
						
						outAcctId       : settleLang._('total.account.detail.out.acct.id'),  //付款账户Id
						inAcctId       : settleLang._('total.account.detail.in.acct.id'),  //收款账户Id


						oprId       : settleLang._('total.account.detail.opr.id'),  //操作员
						oprId2       : settleLang._('total.account.detail.opr.id2'),  //复审员
						recOprTime       : settleLang._('total.account.detail.rec.opr.time'),  //操作时间
						recOprTime2       : settleLang._('total.account.detail.rec.opr.time2') //复审时间
						
					},

					responsiveOptions: {
						hidden: {
							ss: ['realetiveAccount', 'oprName', 'oprMsg', 'stat', 'oprMsg2', 'oprName2'],
							xs: ['oprName', 'oprMsg', 'stat', 'oprMsg2', 'oprName2'],
							sm: ['stat', 'oprMsg2', 'oprName2'],
							md: ['oprMsg2', 'oprName2'],
							ld: []
						}
					},

					colModel: [
						{ name: 'id', index: 'id', editable: false, hidden: true },  //ID
						{ name: 'stlmDate', index: 'stlmDate', width: 100, search: true, editable: false, 
							searchoptions: {
								dataInit : function (elem) {
									$(elem).datepicker( {autoclose: true, format: "yyyymmdd"} );
								},
								sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge']
							}
						},  //账务日期
						{name: 'stlmType', index: 'stlmType', width: 90, search:true, editable: true, formatter: stlmTypeFormatter, 
							stype: 'select', 
							searchoptions: {
								value: STLMTYPE_MAP,
								sopt: ['eq','ne']
							},
							edittype:'select',
							editoptions: {
								value: STLMTYPE_MAP
							}

						},  //账务维护类型
						{name:         'txAmt', index:         'txAmt', search:true, editable: true, formatter: Opf.currencyFormatter,
							_searchType:'num'

						},  //交易金额
                        {name:   'realetiveAccount', index: 'realetiveAccount', width:250, search:false,editable:false, formatter : function(val, options, obj){
                            var account = obj.outAcctNo || obj.inAcctNo || '';
                            return account;
                        }},
						{name:   'oprName', index: 'oprName', search:true, width: 90, editable:false,
							_searchType:'string'
						},
						{name:         'oprMsg', index:         'oprMsg', search:false,editable: true, edittype: 'textarea'},  //操作描述
						//add database message because the database had changed in 20140321
						{name:   'stat', index:   'stat',   search:true, editable:false, formatter: statFormatter,
							stype: 'select', 
							searchoptions: {
								value: STAT_MAP,
								sopt: ['eq','ne']
							}
						},//状态
						//add end
						{name:         'oprMsg2', index:         'oprMsg2', search:false,editable: false},  //复审描述
						{name:         'oprId2', index:         'oprId2', search:false,editable: false, hidden: true, viewable: false},  //复审员
						//
						//add rows
						{name:   'outAcctNo', index: 'outAcctNo', search:false,editable:false,  hidden : true, viewable: false/*,
							searchoptions: {
								sopt: ['eq']
							}*/

						},
						{name:   'inAcctNo', index: 'inAcctNo', search:false,editable:false,  hidden : true, viewable: false/*,
							searchoptions: {
								sopt: ['eq']
							}*/

						},
						{name:   'oprName2', index: 'oprName2', search:true, width: 90, editable:false,
							_searchType:'string'
						},	
						//add end
						//
						{name: 'outAcctId', index: 'outAcctId', search:false,editable: true, hidden: true, viewable: false, edittype: 'select'},  //付款账户Id
						{name:         'inAcctId', index:         'inAcctId', search:false,editable: false, hidden: true, viewable: false},  //收款账户Id
						{name:         'oprId', index:         'oprId', search:false,editable: false, hidden: true, viewable: false},  //操作员
						{name: 'recOprTime', index: 'recOprTime', search: false, editable: false, hidden:true,
							editoptions: {
								dataInit : function (elem) {
									$(elem).datepicker({ autoclose: true, format: 'yyyymmdd' })
										.on("changeDate changeMonth changeYear", function(oDate) {
											$(oDate.target).valid();
										});
								}
							}
						},  //操作时间
						{name: 'recOprTime2', index: 'recOprTime2', search: false, editable: false, hidden:true,
							editoptions: {
								dataInit : function (elem) {
									$(elem).datepicker({ autoclose: true, format: 'yyyymmdd' })
										.on("changeDate changeMonth changeYear", function(oDate) {
											$(oDate.target).valid();
										});
								}
							}
						} //复审时间
					],

					loadComplete: function() {}
				});

			}

		});

	});

	function stlmTypeFormatter (val) {
		return STLMTYPE_MAP[val];
	}

	function statFormatter (val) {
		return STAT_MAP[val];
	}


	return App.SettleApp.TotalAccountDetail.List.View;

});