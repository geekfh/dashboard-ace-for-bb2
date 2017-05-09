/**
 * @created 2014-3-12 19:27:29
 */

define(['App',
	'tpl!app/oms/settle/stlm-error/list/templates/table-ct.tpl',
	'tpl!app/oms/settle/stlm-error/list/templates/stlm-error.tpl',
	'tpl!app/oms/settle/stlm-error/list/templates/stlm-error-s0-deal.tpl',
	'i18n!app/oms/common/nls/settle',
	'assets/scripts/fwk/factory/typeahead.factory',
	'common-ui',
	'jquery.jqGrid',
	'jquery.validate',
	'bootstrap-datepicker'
], function(App, tableCtTpl, stlmErrorTpl,s0DealTpl, settleLang, typeaheadFactory,commonUi) {
	var RESULTFLAG_MAP = {
		"0"  : settleLang._("stlm-error.resultFlag.0"),
		"1"  : settleLang._("stlm-error.resultFlag.1"),
		"2"  : settleLang._("stlm-error.resultFlag.2"),
		"3"  : settleLang._("stlm-error.resultFlag.3"),
		"4"  : settleLang._("stlm-error.resultFlag.4"),
		"5"  : settleLang._("stlm-error.resultFlag.5"),
		"6"  : settleLang._("stlm-error.resultFlag.6"),
		"7"  : '退单',
		"8"  : '交易取消',
		"9"  : settleLang._("stlm-error.resultFlag.9"),
		"a" : '处理后参加清算(待审)'
	},
	ERRTYPE_MAP = {
		"1" : settleLang._("stlm-error.errType.1"),
		"2" : settleLang._("stlm-error.errType.2"),
		"3" : settleLang._("stlm-error.errType.3"),
		"4" : settleLang._("stlm-error.errType.4"),
		"5" : '商户信息不全'
	},
	DISCCYCLE_MAP = {
		"T0" : "T0",
		"S0" : "S0",
		"T1" : "T1"
	},
	STLMTYPE_MAP = {
		"0" : settleLang._("stlm-error.stlmType.0"),
		"1" : settleLang._("stlm-error.stlmType.1"),
		"2" : settleLang._("stlm-error.stlmType.2"),
		"3" : settleLang._("stlm-error.stlmType.3"),
		"4" : settleLang._("stlm-error.stlmType.4")
	},
	//ACTYPE_MAP = {
	//	"0" : settleLang._("stlm-error.acType.0"),   //需求说不管之前的定义，用下面的
	//	"1" : settleLang._("stlm-error.acType.1"),
	//	"2" : settleLang._("stlm-error.acType.2")
	//},
	ACTYPE_MAP = {
		"0":"全部类型",
		"1":"借记卡",
		"2":"贷记卡",
		"3":"准贷记卡",
		"4":"预付卡"
	},
    STAT_MAP = {
        "totalSum":"交易笔数",
        "totalAmt":"交易金额",
        "auditUnEvenCount": "对账不平笔数",
        "auditUnEvenAmount": "对账不平金额",
        "riskContrlCount": "风控拦截延迟清算笔数",
        "riskContrlAmount": "风控拦截延迟清算金额",
        "manualClearCount": "手工延迟清算笔数",
        "manualClearAmount": "手工延迟清算金额",
        "unNormalClearCount": "商户不正常延迟清算笔数",
        "unNormalClearAmount": "商户不正常延迟清算金额"
    },
	/*SUPS_NAME_MAP = {
        'cmsp': 'CH01',
        'cups': 'CH02',
        'scup': 'CH03',
        'cpnr': 'CH04',
        'cilk': 'CH05',
        'bill': 'CH06',
        'sqpy': 'CH07',
        'hkrt': 'CH08',
        'alpy': 'CH09',
        'wcht': 'CH10',
        'spdb': 'CH11',
        'umpy': 'CH12',
        'ncbk': 'CH13',
        'cofp': 'CH14',
        'hxbp': 'CH15',
        'hxnp': 'CH16',
        'cntp': 'CH17',
        'xcpy': 'CH18',
        'tftp': 'CH19',
        'bjys': 'CH20',
        'hkub': 'CH21',
        'tlpy': 'CH22'
    },*/
    SELECT_OPTION_TN00 = [
		'<option value="3">手工处理请款</option>',
		'<option value="2">手工处理退货</option>',
		'<option value="6">参与调账</option>'
    ].join('');

	//var queryFilters;

	App.module('SettleApp.StlmError.List.View', function(View, App, Backbone, Marionette, $, _) {

		View.StlmErrors = Marionette.ItemView.extend({
			tabId: 'menu.stlm.error',
			template: tableCtTpl,
			events: {},

			beforeRenderGridView: function () {
				var me = this;

				this.$el.find('.set-grid-table').attr('id', me.getGid() + '-table');
				this.$el.find('.set-grid-pager').attr('id', me.getGid() + '-pager');
			},

			getGid: function () {
				return 'stlm-errors-grid';
			},

			onRender: function() {
				var me = this;
				me.beforeRenderGridView();
				_.defer(function(){
					me.renderGrid();
				});
			},

			getRequestDateSelect: function(dialog) {
				var me = this,
                    options = {},
                    data = {},
                    $dialog = $(dialog),
                    grid = me.grid;

                data['id'] = Opf.Grid.getSelRowId(grid);

				var $form_inputs = $('form.form-stlm-error', $dialog).find(':input');
                    $form_inputs.each(function() {
                        if($(this).attr("type") === "radio"){
                             this.checked && (data[$(this).attr('name')] = $(this).val());
                        }else{
                            data[$(this).attr('name')] = $(this).val();
                        }

                    });

				options.url = 'api/settle/stlm-errors/' + data['id'];							
				options.data = data;
				options.type = 'PUT';
				options.contentType = 'application/json';
				options.dataType = 'json';
				options.needData = true;

				return options;
			},

			ajaxRequest: function(options, dialog) {
                var me = this;
                var $dialog = $(dialog);
				$.ajax({
					type: options.type,
					contentType: options.contentType,
					dataType: options.dataType,
					url: options.url,
					data: options.needData ? JSON.stringify(options.data) : "",
					success: function(resp) {
                        $dialog.dialog("destroy");
						me.grid.trigger("reloadGrid", [{current:true}]);
						if(resp.success) {
		                    Opf.Toast.success('操作成功');
		                }
					},
					error: function(resp) {
                        $dialog.dialog("destroy");
                        console.log("操作失败", resp);
					}
				});
			},

			attachValidation: function() {
				return {
					setupValidation: Opf.Validate.setup,
					addValidateRules: function(form) {
	                    Opf.Validate.addRules(form, {
		                    rules: {
		                    	traceNo: {
		                            required: true,
		                            number: true
		                        },
		                        orderNo: {
		                        	required: true,
		                            number: true
		                        },
		                        errDesc: {
		                            required: true,
		                            maxlength: 300
		                        },
		                        txDate: {
		                            required: true,
		                            date: true
		                        }
		                    }
	                    });
	                }
				};
			},

			onClickButton: function() {
				var me = this, grid = me.grid;
				var tpl = stlmErrorTpl(), $dialogForm = $(tpl);
				var selectedId = Opf.Grid.getSelRowId(grid);
				var rowData = grid._getRecordByRowId(selectedId);
				var $dialog = Opf.Factory.createDialog($dialogForm, {
					autoOpen: true,
					height: Opf.Config._('ui', 'stlmError.grid.form.extra.height'),    //300,
					width: Opf.Config._('ui', 'stlmError.grid.form.extra.width'),      //350,
					modal: true,
					buttons: [{
						type: 'submit',
						click: function() {
							var $form = $('form.form-stlm-error', $dialog);
							var validator = $form.validate();
							var valid = true;
							if(validator && !validator.form()){
								valid = false;
							}
							if(valid){
								me.ajaxRequest(me.getRequestDateSelect(this), this);
							}
						}
					}, {
						type: 'cancel'
					}],
					create: function() {
						var $dialog = $(this);

						if (rowData.discCycle == 0) {
							$.ajax({
								url: url._('stlm.errors.status', {id: selectedId}),
								type: 'GET',
								success: function(resp) {
									if(resp.data == 0) {
										$dialog.find('select[name="resultFlag"]').empty().append(SELECT_OPTION_TN00);
									}
								}
							});
						}

						Opf.Validate.addRules($('form.form-stlm-error', $dialog), {
							rules: {
								nextDo: {
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

				if(rowData.stlmType == 1){//有
					$dialog.find('[name="resultFlag"]').find('[value="8"]').css('display', 'block');//交易取消
				}
				else if(rowData.stlmType == 2){//无
					$dialog.find('[name="resultFlag"]').find('[value="7"]').css('display', 'block');//退单
				}

				me.judgeAndDealWithErrorCash($dialog);
			},
			
			judgeAndDealWithErrorCash : function($dialog){
                var me = this, grid = me.grid;
				var selectId = Opf.Grid.getLastSelRowId(grid);
                var rowData = grid.getRowData(selectId);
                if(rowData.errType == 1 && rowData.stlmType == 3){
                	var stlm_error_side = '<div class="row settle-styles-row">' + 
                			'<div class="col-xs-3">处理金额:</div>' +
                			'<div class="col-xs-9">' +
                			'<input type="radio" value="0" name="cupsFlag" class="settle-styles-radio" checked="checked" /> 以渠道为准' + 
                				'<input type="radio" value="1" name="cupsFlag" class="settle-styles-radio"/> 以我方为准' +
                			'</div> ' +         
                		  '</div>';
                	
                	$('form.form-stlm-error',$dialog).find("fieldset div:first").after(stlm_error_side);
                }
			},
			
			renderGrid: function() {
				var me = this;
				var filters = null;
				if(me.options.stlmDate != undefined)
				{
					filters = {
						"groupOp":"AND",
						"rules":[{"field":"stlmDate","op":"lk","data": ""+me.options.stlmDate+""}]
					};
				}
				var validation = this.attachValidation();
				me.grid = App.Factory.createJqGrid({
					rsId:'stlmError',
					caption: settleLang._('stlmError.txt'),
					filters: [
						{
							caption: '条件过滤',
							defaultRenderGrid: true,
							canClearSearch: true,
							components: [
								{
									label: '交易日期',
									name: 'txDate',
									type: 'date',
									defaultValue: moment()
								}
							],
							searchBtn: {
								text: '搜索'
							}
						}
					],
					stats:{
                        labelConfig:STAT_MAP,
                        items:[
                            {name: 'totalSum', type:'count'},
                            {name: 'totalAmt', type:'currency'},
                            {name: 'auditUnEvenCount', type: 'count'},  
                            {name: 'auditUnEvenAmount', type: 'currency'},   
                            {name: 'riskContrlCount', type: 'count'},   
                            {name: 'riskContrlAmount', type: 'currency'},   
                            {name: 'manualClearCount', type: 'count'},   
                            {name: 'manualClearAmount', type: 'currency'},   
                            {name: 'unNormalClearCount', type: 'count'},   
                            {name: 'unNormalClearAmount', type: 'currency'}
                            
                        ]
                    },
	                download: {
	                    url: url._('export.stlm.error'),
	                    //必须返回对象
	                    params: function () {
							var postData = me.grid.jqGrid('getGridParam', 'postData');
							return {filters: postData.filters};
	                    },
	                    queueTask: {//不配置就不在任务队列里生成一项，通常都要配置
	                        name: function () {
	                            return '差错交易信息';
	                        }
	                    }
	                },
					actionsCol: {
						del: false,
						edit: false,
						extraButtons: [
							{name: 'work', title:'处理', icon: 'icon-opf-process-account icon-opf-process-account-color',
                                click: function() {
								    me.onClickButton();
							    }
                            }
                            //,
                            //{name: 'dealS0', title:'S0处理', icon: 'icon-opf-process-account',
								//click: function (name, options, rowData) {
								//	showChangeStateDialog(me.grid, rowData);
							 //   }
                            //}
						],
						canButtonRender: function(name, opts, rowData) {
							// return true;
							// 只有在未处理的情况下才可以显示处理按钮
							if(name === 'work' && (rowData.resultFlag !== '9' || rowData.errType == '4')) {
								return false;
							}
							//if(name === 'dealS0' && (rowData.discCycleName !== 'S0' || rowData.s0IsDeal === '1')){
							//	return false;
							//}
						}
					},
					nav: {
						formSize: {
							width: Opf.Config._('ui', 'stlmError.grid.form.width'),
							height: Opf.Config._('ui', 'stlmError.grid.form.height')
						},
						add:{
							beforeShowForm:function(form){
								validation.addValidateRules(form);
								$(form).css('overflow', '');
								var $traceNo = me.$traceNo = form.find('#traceNo');
								var $trLabel = $('#tr_traceNo').find('.CaptionTD');
								var $select = $(form).find('select[name="txTime"]');
								var $dateInput = me.$dateInput = $(form).find('input[name="txDate"]');
								var $removeIcon = me.$removeIcon = commonUi.creatRemoveIconWith($traceNo);
								$('#tr_txTime').find('.CaptionTD').html('类型');
								var $txDate = $(form).find('input[name="txDate"]');

								$($txDate).on('change', function(e) {
									if(e.target.value) {
										$traceNo.attr('disabled', false);

									} else {
										$traceNo.attr('disabled', true);

									}
								});

								$select.on('change', function(){
									$traceNo.val('');
									$traceNo.attr('name', $(this).val());
									$dateInput.val('');

									if($(this).val() === 'orderNo') {
										$dateInput.attr('disabled', true);
										$trLabel.html('订单号');
										$traceNo.attr('disabled', false);
									} else {
										$dateInput.attr('disabled', false);
										$trLabel.html('平台流水');
										$txDate.trigger('change');
									}
								});

								$select.trigger('change');
								$txDate.trigger('change');

								typeaheadEl(me,{
									el:$traceNo,
									url:url._('txnid')
								});
							},
							beforeSubmit: validation.setupValidation,
							onclickSubmit: function(params, postdata) {
                                postdata[$('#traceNo').attr('name')] = $('#traceNo').val();
                                if(!postdata['txDate']) {
                                	delete postdata['txDate'];
                                	// postdata['txDate'] = undefined;
                                }
                                delete postdata['txTime'];
                                return postdata;


                            }
						},
						edit: {
							beforeShowForm: function(form) {
								validation.addValidateRules(form);
							},
							beforeSubmit: validation.setupValidation
						},
						view: {
							width: Opf.Config._('ui', 'stlmError.grid.viewform.width'),
							height: Opf.Config._('ui', 'stlmError.grid.viewform.height')
						},
						search: {
							width: 450,
							afterRedraw: function (){
								return CommonUI.searchFormBySelect2($(this), 'cupsNo');
							},
							onSearch: function() {
                                var $grid = $(this), postData = $grid.jqGrid('getGridParam', 'postData');
								var gid = $grid.jqGrid('getGridParam', 'gid');
								var tableId = $('#fbox_'+gid+'-table');

								return me.queryFilters = CommonUI.searchFilterBySelect2(tableId, postData, 'cupsNo');
                            }
						}
					},
					gid: me.getGid(),//innerly get corresponding ct '#stlm-errors-grid-table' '#stlm-errors-grid-pager'
					url: url._('stlm.error'),
					//postData: filters == null ? null : {filters: JSON.stringify(filters)},
					postData: function(){
						var postData = $(this).jqGrid('getGridParam', 'postData');
						if(postData.filters == null){
							return '';
						}
						else if(filters == null){
							return '';
						}
						else{
							return {filters: JSON.stringify(filters)};
						}
					},
					colNames: {
						id       : settleLang._('stlm.error.id'),  //ID
						stlmDate       : settleLang._('stlm.error.stlm.date'),  //对账日期
						txDate       : settleLang._('stlm.error.tx.date'),  //交易日期
						discCycleName   : settleLang._('stlm.error.discCycle'), //结算周期
						traceNo       : settleLang._('stlm.error.trace.no'),  //平台流水
						errType       : settleLang._('stlm.error.err.type'),  //差错类型(1-对账不平，2-风控拦截延迟清算，3-手工延迟清算)
						errDesc       : settleLang._('stlm.error.err.desc'),  //差错描述
						stlmType       : settleLang._('stlm.error.stlm.type'),  //对账不平类型（1-本地有，渠道没有,2-本地无，渠道有,3-本地与渠道金额不一致,4-本地与渠道账号不一致）
						txAmt       : settleLang._('stlm.error.tx.amt'),  //交易金额
						feeAmt       : settleLang._('stlm.error.fee.amt'),  //手续费金额
						oprDate       : settleLang._('stlm.error.opr.date'),  //处理日期
						//add row
						oprName     : settleLang._('stlm.error.opr.name'),
						//add end
						nextDo       : settleLang._('stlm.error.next.do'),  //原因及处理描述
						txTime       : settleLang._('stlm.error.tx.time'),  //交易时间
						resultFlag       : settleLang._('stlm.error.result.flag'),  //处理结果(0-参入清算后并已清分，1-处理后参加清算，2-手工处理退货,3-手工处理请款,4-手工处理挂账,5-手动退货,9-未处理 10-退单, 11-交易取消)
						oprNo       : settleLang._('stlm.error.opr.no'),  //处理人员


						nextDate       : settleLang._('stlm.error.next.date'),  //处理后参加清算日期
						iboxNo       : settleLang._('stlm.error.ibox.no'),  //盒子编号
						orderNo       : settleLang._('stlm.error.order.no'),  //订单号
						cupsNo       : settleLang._('stlm.error.cups.no'),  //渠道名称
						acNo       : settleLang._('stlm.error.ac.no'),  //主账户
						acType       : settleLang._('stlm.error.ac.type.no'),  //卡类型
						acBankNo       : settleLang._('stlm.error.ac.bank.no'),  //账户开户行
						userId       : settleLang._('stlm.error.user.id'),  //用户编号

						//add row
						userName     : settleLang._('stlm.error.userName'), // '用户姓名'
						phone     : settleLang._('stlm.error.phone'), // '用户手机'
						email     : settleLang._('stlm.error.email'), // '用户邮箱'
						//add end

						cupFee       : settleLang._('stlm.error.cup.fee'),  //第三方手续费
						// txCode       : settleLang._('stlm.error.tx.code'),  //交易代码
						txName       : settleLang._('stlm.error.tx.name'),  //交易名称
						// txSubCode       : settleLang._('stlm.error.tx.sub.code'),  //子交易码
						brno       : settleLang._('stlm.error.brno'),  //交易机构号
						// longitude       : settleLang._('stlm.error.longitude'),  //交易经度
						// latitude       : settleLang._('stlm.error.latitude'),  //交易纬度
						sysRefNo       : settleLang._('stlm.error.sys.ref.no'),  //检索参考号
						ibox41       : settleLang._('stlm.error.ibox41'),  //本地终端标识
						// fd41       : settleLang._('stlm.error.fd41'),  //受卡机终端标识
						ibox42       : settleLang._('stlm.error.ibox42'),  //本地商户号
						// fd42       : settleLang._('stlm.error.fd42'),  //受卡方标识码
						ibox43       : settleLang._('stlm.error.ibox43'),  //本地商户名称
						// fd43       : settleLang._('stlm.error.fd43'),  //受卡方名称地址
						recCrtTime       : settleLang._('stlm.error.rec.crt.time'),  //记录创建时间
						recUpdTime       : settleLang._('stlm.error.rec.upd.time'), //记录修改时间
						s0IsDeal     : 's0是否处理'
						
					},

					responsiveOptions: {
						hidden: {
							ss: ['stlmDate', 'errType', 'errDesc', 'txAmt', 'feeAmt', 'oprDate', 'oprName', 'nextDo', 'acNo'],
							xs: ['stlmDate', 'errDesc', 'txAmt', 'feeAmt', 'oprDate', 'oprName'],
							sm: ['stlmDate', 'txAmt', 'feeAmt', 'oprDate', 'oprName'],
							md: ['feeAmt', 'oprDate', 'oprName'],
							ld: []
						}
					},

					colModel: [
						{name:         'id', index:         'id', editable: false, hidden: true},  //ID
						{name:         'stlmDate', index:         'stlmDate', search:true,editable: false,hidden:true,
							searchoptions: {
								dataInit : function (elem) {
									$(elem).datepicker({autoclose: true,format: 'yyyymmdd'});
								},
								sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge']
							}

						},  //对账日期
						{name:         'txTime', index:         'txTime', search:false,editable: true, edittype: 'select', formatter: txTimeFormatter,
							editoptions: {
								value: {
									'traceNo':'平台流水',
									'orderNo':'订单号'
								}
							}

						},  //交易时间
						{name:         'txDate', index:         'txDate', search:true, editable: true, hidden: true,
							searchoptions: {
								dataInit : function (elem) {
									$(elem).datepicker({autoclose: true,format: 'yyyymmdd'});
								},
								sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge']
							},
							editoptions: {
								dataInit : function (elem) {
									$(elem).datepicker({autoclose: true,format: 'yyyymmdd'});
								}
							}

						},  //交易日期
						{name: 'discCycleName', index: 'discCycleName',
							search:true,
							stype: 'select',
							searchoptions: {
								value: DISCCYCLE_MAP,
								sopt: ['eq']
							}
						},
						{name:         'traceNo', index:         'traceNo', search:true,editable: true,
							searchoptions: {
								sopt: ['eq']
							}
						},  //平台流水
						{name:         'errType', index:         'errType', search:true,editable: false, formatter: errTypeFormatter,
							stype: 'select',
							searchoptions: {
								value: ERRTYPE_MAP,
								sopt: ['eq','ne']
							},
							edittype: 'select',
							editoptions: {
								value: ERRTYPE_MAP
							}

						},  //差错类型(1-对账不平，2-风控拦截延迟清算，3-手工延迟清算)
						{name:         'errDesc', index:         'errDesc', search:false,editable: true, edittype: 'textarea', formatter: errDescFormatter},  //差错描述
						{name:         'acNo', index:         'acNo', search:false,editable: false},  //主账户
						{name:         'acType', index:         'acType', search:true,editable: false, formatter: acTypeFormatter, viewable: false,
							stype:'select',
							searchoptions:{
								sopt: ['eq','ne'],
								value:ACTYPE_MAP
							}},  //卡类型
						{name:         'stlmType', index:         'stlmType', search: true, editable: true, formatter: stlmTypeFormatter,//hidden:true,
							edittype: 'select',
							editoptions: {
								value: STLMTYPE_MAP
							},
							stype: 'select',
							searchoptions: {
								sopt: ['eq','ne'],
								value: STLMTYPE_MAP
							}

						},  //对账不平类型（1-本地有，渠道没有,2-本地无，渠道有,3-本地与渠道金额不一致,4-本地与渠道账号不一致）
						{name:         'txAmt',   index:     'txAmt', search:false,editable: false, formatter: Opf.currencyFormatter},  //交易金额
						{name:         'feeAmt',  index:     'feeAmt', search:false,editable: false, formatter: Opf.currencyFormatter, hidden:true, viewable: false},  //手续费金额
						{name:         'oprDate', index:     'oprDate', search:false,editable: false, hidden:true},  //处理日期
						{name:         'oprName', index:     'oprName', search:false,editable: false, hidden:true},
						{name:         'nextDo',  index:     'nextDo', search:false,editable: false, hidden:true},  //原因及处理描述
						{name:         'resultFlag', index:  'resultFlag', search:true, editable: true, formatter: resultFlagFormatter,
							edittype:  'select',
							editoptions: {
								value: RESULTFLAG_MAP
							},
							stype:		'select',
							searchoptions: {
								value: RESULTFLAG_MAP,
								sopt: ['eq','ne']
							}

						},  //处理结果(0-参入清算后并已清分，1-处理后参加清算，2-手工处理退货,3-手工处理请款,4-手工处理挂账,5-手动退货,9-未处理, 10-退单, 11-交易取消)


						{name:         'oprNo', index:         'oprNo', search:false,editable: false, hidden:true, viewable: false},  //处理人员
						{name:         'nextDate', index:         'nextDate', editable: false, hidden: true, search:true, _searchType:'date',
							searchoptions: {
								dataInit : function (elem) {
									$(elem).datepicker( {autoclose: true, format: "yyyymmdd"} );
								}
							}
						},  //处理后参加清算日期
						{name:         'iboxNo', index:         'iboxNo', search:true,editable: false, hidden: true,
							_searchType:'string',searchoptions: {sopt: ['eq']}
						},  //盒子编号
						{name:         'orderNo', index:         'orderNo', search:false,editable: false, hidden: true},  //订单号
						{name:         'cupsNo', index:         'cupsNo', search:true, _searchType: 'string', editable: false, hidden: true},  //银联或银行编号
						{name:         'acBankNo', index:         'acBankNo', search:false,editable: false, hidden: true, viewable: false},  //账户开户行
						{name:         'userId', index:         'userId', search:false,editable: false, hidden:true, viewable:false},  //用户编号

						//add row
						{name:         'userName', index:       'userName', search:false,editable:false, hidden: true},
						{name:         'phone', index:       'phone', search:false,editable:false, hidden: true},
						{name:         'email', index:       'email', search:false,editable:false, hidden: true},
						//add end

						{name:         'cupFee', index:         'cupFee', search:false,editable: false, hidden: true, formatter: Opf.currencyFormatter, viewable: false},  //第三方手续费
						// {name:         'txCode', index:         'txCode', search:false,editable: false, hidden: true},  //交易代码
						{name:         'txName', index:         'txName', search:false,editable: false, hidden: true, viewable: false},  //交易名称
						// {name:         'txSubCode', index:         'txSubCode', search:false,editable: false, hidden: true},  //子交易码
						{name:         'brno', index:         'brno', search:false,editable: false, hidden: true},  //交易机构号
						// {name:         'longitude', index:         'longitude', search:false,editable: false, hidden: true},  //交易经度
						// {name:         'latitude', index:         'latitude', search:false,editable: false, hidden: true},  //交易纬度
						{name:         'sysRefNo', index:         'sysRefNo', search:false,editable: false, hidden: true},  //检索参考号
						{name:         'ibox41', index:         'ibox41', search:false,editable: false, hidden: true},  //本地终端标识
						// {name:         'fd41', index:         'fd41', search:false,editable: false, hidden: true},  //受卡机终端标识
						{name:         'ibox42', index:         'ibox42', search:true,editable: false,
							_searchType:'string',searchoptions: {sopt: ['eq']}
						},  //本地商户号
						// {name:         'fd42', index:         'fd42', search:false,editable: false, hidden: true},  //受卡方标识码
						{name:         'ibox43', index:         'ibox43', search:false,editable: false},  //本地商户名称
						// {name:         'fd43', index:         'fd43', search:false,editable: false, hidden: true},  //受卡方名称地址
						{name:         'recCrtTime', index:         'recCrtTime', search:false,editable: false, hidden: true},  //记录创建时间
						{name:         'recUpdTime', index:         'recUpdTime', search:false,editable: false, hidden: true}, //记录修改时间
						{name:         's0IsDeal', index:         's0IsDeal', search:false,editable: false, hidden: true}, //s0是否处理

					],

					loadComplete: function() {}
				});

			}

		});

	});

	function showChangeStateDialog(roleGird, rowData) {
		var tpl = s0DealTpl();
        var $dialogForm = $(tpl);

		var $dialog = Opf.Factory.createDialog($dialogForm, {
			destroyOnClose: true,
			title: 'S0审核',
			autoOpen: true,
			width: 350,
			height: 300,
			modal: true,
			buttons: [{
				type: 'submit',
				click: function () {
					var dealResult = $(this).find('[name="dealResult"]').val();
					var dealDesc = $(this).find('[name="dealDesc"]').val();
						Opf.ajax({
							type: 'POST',
							jsonData: {
								dealResult:  dealResult,
								dealDesc: dealDesc,
								bankCardNo: rowData.acNo,
								ibox42 :rowData.ibox42,
								ibox43: rowData.ibox43,
								txAmt: rowData.txAmt
							},
							url: url._('stlm.error.s0.add', {id: rowData.id}),
							successMsg: '处理成功',
							success: function () {
								$dialog.dialog("destroy");
								roleGird.trigger('reloadGrid', [{current: true}]);
							}
						});

				}
            },{
				type: 'cancel'
			}]
		});
	}

	function txTimeFormatter(val, options, rowData) {
		var time;
		time = val ? ' ' + val.substring(0,2) + ':' + val.substring(2,4) + ':' + val.substring(4,6) : '';

		return rowData.txDate ? rowData.txDate + time : time;

	}

	function resultFlagFormatter(val) {
		return RESULTFLAG_MAP[val] || '';
	}

	function errTypeFormatter(val) {
		return ERRTYPE_MAP[val] || '';
	}

	function stlmTypeFormatter(val) {
		return STLMTYPE_MAP[val] || '';
	}

	function acTypeFormatter(val) {
		return ACTYPE_MAP[val] || '';
	}

	function errDescFormatter(val, options, rowData) {
		// return (STLMTYPE_MAP[rowData.stlmType] || '') + ': ' + val;
		return val || '';
	}

	/*function discCycleFormatter(val, options, rowData) {
		return 'T+' + val + ' 结算'
	}

	function cupsNoFormatter (val) {
		return SUPS_NAME_MAP[val] || '';
	}*/

	function typeaheadEl (me, options) {
        var $el = options.el;
        var url = options.url;
        var TRACE_TYPEHEAD = 'trace';
        var tahIsSelect = false;

        var model,traceTypeahead;

        model = typeaheadFactory.createModel(TRACE_TYPEHEAD, {
            search  : 'name',
            prefectch   : null,
            remote      : {
                url : url,
                replace : function(url, query){
                    return url + '?' + $.param({
                        kw: encodeURIComponent(me.$traceNo.val()),
                        type:me.$traceNo.attr('name'),
                        date:me.$dateInput.val()
                    });
                }
            }
        });
        
        traceTypeahead = typeaheadFactory.newTypeahead(TRACE_TYPEHEAD, {
            el : $el,
            displayKey : 'name'
        });
        

       traceTypeahead.on('typeahead:selected', function(e, obj){
			var id = obj.id || obj.value;
			tahIsSelect = id ? true:false;
			commonUi.triggerTahSelected($el,me.$removeIcon);
		});

        traceTypeahead.on('typeahead:closed', function(e, obj){
        	if(!tahIsSelect) { $el.val('') };
			model.clearRemoteCache();
			tahIsSelect = false;
		});
    }



	return App.SettleApp.StlmError.List.View;

});