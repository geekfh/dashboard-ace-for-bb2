/**
 * 清算失败信息
 */
define(['App',
	'tpl!app/oms/settle/stlm-error/list/templates/stlm-error-s0-deal.tpl',
	'tpl!app/oms/settle/settle-error/list/templates/table-ct.tpl',
	'tpl!app/oms/settle/settle-error/list/templates/settle-error.tpl',
	'tpl!app/oms/settle/settle-error/list/templates/settle-error-next.tpl',
	'tpl!app/oms/settle/settle-error/list/templates/settle-error-trade.tpl',
	'tpl!app/oms/settle/settle-error/list/templates/select-msg.tpl',
	'tpl!app/oms/settle/settle-error/list/templates/operate-do.tpl',
	'i18n!app/oms/common/nls/settle',
	'tpl!app/oms/operate/blacklist/add/uploadFile.tpl',
	'jquery.jqGrid',
	'jquery.validate',
	'bootstrap-datepicker',
	'upload'
], function(App, s0DealTpl, tableCtTpl, stErrorTpl, stErrorNextTpl, stErrorTradeTpl, selectMsgTpl, operateDoTpl, settleLang, uploadFileTpl) {

	var DOFLAG_MAP = {
			"0" : settleLang._("settle-error.doFlag.0"),
			//"1" : settleLang._("settle-error.doFlag.1"),
			"2" : settleLang._("settle-error.doFlag.2"),
			"31": "待清算人员处理",
			"4" : settleLang._("settle-error.doFlag.4"),
			"5" : settleLang._("settle-error.doFlag.5"),
			"6" : settleLang._("settle-error.doFlag.6"),
			"91" : '入账失败',
			"92" : '未知',
            "71" : '入账失败(待审)'
		},

	//数据库原先是1，对公，2，对私。现在改为0、对公，1、对私。
		SETTLEACCTTYPE_MAP = {
			"0" : settleLang._("settle-error.settleAcctType.0"),
			"1" : settleLang._("settle-error.settleAcctType.1")
		},
		ERRTYPE_MAP = {
			"1" : settleLang._("settle-error.errType.1"),
			"2" : settleLang._("settle-error.errType.2")
		},

        //清算周期
        //DISCCYCLE_MAP = {
        //    "T0": "T0",
        //    "T1": "T1",
        //    "S0": "S0"
        //},

        SOURCETYPE_MAP = {
            "jsqf" : '系统记录清算失败',
            "sq" : '手工导入清算失败',
            "st" : '手工导入退票'
        }

		STAT_MAP = {
			"totalAmt":"清算金额",
            "totalSum":"清算笔数"
		};


	var BRANCHS = ['branchName', 'branchUserName', 'branchPhone', 'branchMobile'] ,
		MCHTS = ['mchtName', 'userName', 'userPhone'];

	var GRID;

	App.module('SettleApp.SettleError.List.View', function(View, App, Backbone, Marionette, $, _) {

		View.SettleErrors = Marionette.ItemView.extend({
			//tabId: 'menu.settle.error',
			template: tableCtTpl,
			events: {},
			beforeRenderGridView: function () {
				var me = this;
				this.$el.find('.set-grid-table').attr('id', me.getGid() + '-table');
				this.$el.find('.set-grid-pager').attr('id', me.getGid() + '-pager');
			},
			//getGid: function () {},
			getFilters: function(defaultFilters){
				return defaultFilters;
			},
			onRender: function() {
				var me = this;
				me.beforeRenderGridView();
				me.checkType = '';

				_.defer(function() {
					var grid = me.renderGrid();
					if (!Ctx.avail(me.autoBatch('ctx'))) {
						return;
					}
					var $extraBtn = $('<div class="grid-extra-btn">自动成批</div>');
					var $td = $('<td class="ui-pg-button ui-corner-all" title="自动成批"></td>');
					$td.append($extraBtn);

					$('#' + grid.attr('id') + '_toppager_left').find('tr').append($td);

					$extraBtn.on('click', function() {
						if($extraBtn.hasClass('grid-extra-btn-disable')) {
							return;
						}
						$extraBtn.addClass('grid-extra-btn-disable').text('正在运行...');
						$.ajax({
							type: 'GET',
							url: url._(me.autoBatch('url')),//这个是自动成批的URL
							success: function(resp) {
								grid.trigger('reloadGrid', [{ page:1 }]);
								Opf.Toast.success('操作成功');
							},
							complete: function() {
								$extraBtn.removeClass('grid-extra-btn-disable').text('自动成批');
							}
						});
					});
				});
			},

			getRequestDateSelect: function(gird) {
				var data = {};
				data['id'] = Opf.Grid.getSelRowId(gird);
				var $form = $('form.form-settle-error').find(':input');
				$form.each(function() {
					data[$(this).attr('name')] = $(this).val();
				});
				var options = {
					data: data,
					type: 'PUT',
					needData: true,
					dataType: 'json',
					contentType: 'application/json',
					url: me.update() + data['id'] + '/update'
				};
				return options;
			},

			getRequestDateSelectNext: function(grid) {
				var rowId = Opf.Grid.getSelRowId(grid);
				var resultFlag = $('form.form-settle-error-next').find('select[name="resultFlag"]').val();
				var nextDo = $('form.form-settle-error-next').find('textarea[name="nextDo"]').val();

				var data = {
					'id' : rowId,
					'resultFlag' : resultFlag,
					'nextDo' : nextDo
				};

				var options = {
					url: me.update() + rowId + '/change-unknow-status',
					type: 'PUT',
					contentType: 'application/json',
					dataType: 'json',
					needData: true,
					data: data
				};

				return options;
			},

			ajaxRequest: function(options, dialog, grid) {
				$.ajax({
					type: options.type,
					contentType: options.contentType,
					dataType: options.dataType,
					url: options.url,
					data: options.needData ? JSON.stringify(options.data) : "",
					success: function(resp) {
						console.log(resp);
						$(dialog).dialog("destroy");
						$(grid).trigger("reloadGrid", [{current:true}]);
						if(resp.success) {
							Opf.Toast.success('操作成功');
						}
					},
					error: function(resp) {
						// console.log(resp.msg);
						// $(dialog).dialog("destroy");
						// Opf.Grid.alertFail(grid, '操作', resp.msg);
					}
				});
			},

			ajaxGetExtraMessage: function(key, value) {
				$.ajax({
					type: 'GET',
					contentType: 'application/json',
					dataType: 'json',
					url: me.update() + key + '/' + value,
					success: function(resp) {
						$('form.form-settle-error').find('div.addExtraMessage').empty().append(resp.ctlFlag || resp.msg);
					},
					error: function(resp) {
						console.log(resp);
					}
				});
			},

			attachValidation: function() {
				return {
					setupValidation: Opf.Validate.setup,
					addValidateRules: function(form) {
						Opf.Validate.addRules(form, {
							rules:{
								batchNo:{
									required: true,
									number: true
								},
								settleDate:{
									required: true,
									date: true
								},
								inDate: {
									required: true,
									date: true
								},
								traceNo:{
									required: true,
									number: true
								},
								doFlag:{
									required: true
								},
								retNo:{
									required: true,
									number: true
								},
								retCode:{
									required: true,
									number: true
								},
								retMsg:{
									required: true,
									maxlength: 300
								},
								oprDate:{
									required: true,
									date: true
								},
								oprNo:{
									required: true,
									namechars: true
								},
								nextDate:{
									required: true,
									date: true
								},
								nextDo:{
									required: true,
									maxlength: 300
								},
								mchtNo:{
									required: true,
									number: true
								},
								settleBrhId:{
									required: true,
									number: true
								},
								settleAcctType:{
									required: true
								},
								settleBankNo:{
									required: true,
									number: true
								},
								settleBankName:{
									required: true
								},
								settleBankAddress:{
									required: true,
									maxlength: 100
								},
								settleBankCode:{
									required: true,
									number: true
								},
								settleAcctName:{
									required: true
								},
								settleAcct:{
									required: true,
									number: true
								},
								settleAmt:{
									required: true,
									float: true
								},
								otherAmt:{
									required: true,
									float: true
								},
								remark:{
									required: true,
									maxlength: 100
								},
								recCreateTime: {
									required: true,
									date: true
								},
								recUpdTime: {
									required: true,
									date: true
								}
							}
						});
					}
				};
			},

			onClickNextButton: function(rowData, roleGird){
				var me = this;
				var $dialog = $(stErrorNextTpl()).dialog({
					autoOpen: true,
					height: 300,
					width: 350,
					modal: true,
					buttons: [
						{
							html : "<i class='icon-ok'></i>&nbsp; 提交",
							class : "btn btn-xs btn-primary",
							click: function(e) {
								var $form = $('form.form-settle-error-next');
								var validator = $form.validate();
								var valid = true;
								if (validator && !validator.form()) {
									valid = false;
								}
								if(valid) {
									$($(e.target).closest('button')).addClass('disabled').find('span').html("<i class='icon-ok'></i>&nbsp; 正在提交...");
									me.ajaxRequest(me.getRequestDateSelectNext(roleGird), this, roleGird);

								}
							}
						},
						{
							html : "<i class='icon-remove'></i>&nbsp; 取消",
							class : "btn btn-xs",
							click: function () {
								$(this).dialog("destroy");
							}
						}
					],
					create: function () {
						Opf.Validate.addRules($('form.form-settle-error-next'), {
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
						$(this).dialog("destroy");
					}
				});
			},

			onClickButton: function(roleGird) {
				var me = this;
				var rowData = roleGird._getRecordByRowId(Opf.Grid.getSelRowId(roleGird));
				// if(!(rowData.settleDate && rowData.batchNo)){
				// 	alert('清算日期或批次号为空无法处理');
				// 	return;
				//         	}
				if(rowData.errType === '2'){
					me.onClickNextButton(rowData, roleGird);
					return;
				}
				var $dialog = $(stErrorTpl()).dialog({
					autoOpen: true,
					height: Opf.Config._('ui', 'settleError.grid.extra.height'),  //300,
					width: Opf.Config._('ui', 'settleError.grid.extra.width'),  //350,
					modal: true,
					buttons: [{
						html: "<i class='icon-ok'></i>&nbsp; 提交",
						class : "btn btn-xs btn-primary",
						click: function(e) {
							var $form = $('form.form-settle-error');
							var validator = $form.validate();
							var valid = true;
							if (validator && !validator.form()) {
								valid = false;
							}
							if (valid) {
								$($(e.target).closest('button')).addClass('disabled').find('span').html("<i class='icon-ok'></i>&nbsp; 正在提交...");
								me.ajaxRequest(me.getRequestDateSelect(roleGird), this, roleGird);
							}
						}
					},{
						html: "<i class='icon-remove'></i>&nbsp; 取消",
						class : "btn btn-xs",
						click: function () {
							$(this).dialog("destroy");
						}
					}],
					create: function () {
						//me.ajaxGetExtraMessage(rowData.settleDate, rowData.batchNo);
						Opf.Validate.addRules($('form.form-settle-error'), {
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
						$(this).dialog("destroy");
					}
				});
			},

			onCheckBoxClick: function (checkbox) {
				var $checkbox = $(checkbox),
					checkedType = '',
					rowId = $checkbox.attr('rowID'),
					rowData = this.grid._getRecordByRowId(rowId);

				// 如果该条记录被选中
				if ($checkbox.is(':checked')) {
					checkedType = $checkbox.attr('checkedType');
					if (!this.checkType) {
						this.checkType = checkedType;

					}
					else if (this.checkType !== checkedType) {
						Opf.alert('状态不一样的数据不能批量处理！');
						$checkbox.prop('checked', false);
					}
				}
				else {
					if (this.grid.find('input[type="checkbox"]:checked').length === 0) {
						this.checkType = '';
					}
				}
			},

			checkedAll: function () {
				if (this.checkType) {
					this.grid.find('input[checkedType="' + this.checkType + '"]').prop('checked', true);

				} else if (this.canCheckedAll()) {
					this.grid.find('input[type="checkbox"]').not('[disabled]').prop('checked', true);

				} else {
					Opf.alert('当前页面含有不同状态的数据，请先选中一个数据后再点全选！');
				}
			},

			canCheckedAll: function () {
				var canCheckedAll = true, tmpArr = [];
				this.grid.find('input[type="checkbox"]').not('[disabled]').each(function () {
					if (tmpArr.length === 0) {
						tmpArr.push($(this).attr('checkedType'));
					}

					if (tmpArr[0] !== $(this).attr('checkedType')) {
						canCheckedAll = false;
					}

				});

				return canCheckedAll;
			},

			batchOperate: function () {
				var me = this;
				var $batchCheckedBox = me.grid.find('input[type="checkbox"]:checked');

				if ($batchCheckedBox.length === 0) {
					Opf.alert('未选中');
					return;
				}

				var checkedType = $batchCheckedBox.attr('checkedType');
				var ids = [];
				var doFlow = {};

				$batchCheckedBox.each(function () {
					ids.push($(this).attr('rowId'));
				});

				if (checkedType === 'OPERATE_DO') {
					// 运营人员处理流程
					doFlow = {
						tpl: operateDoTpl(),
						url: url._('settle.error.operator'),
						postId: ids,
						batchOper: true
					};
					doitDialog(doFlow);
				}
				else if (checkedType === 'SETTLE_DO_1') {
					doFlow = {
						tpl: stErrorNextTpl(),
						url: url._('settle.error.unknow'),
						postId: ids,
						batchOper: true
					};
					doitDialog(doFlow);
				}
				else if (checkedType === 'SETTLE_DO_2') {
					doFlow = {
						tpl: stErrorTpl(),
						url: url._('settle.error.update'),
						postId: ids,
						batchOper: true
					};
					doitDialog(doFlow);
				}
			},

			renderGrid: function() {
				var me = this;
				var filters = null;
				if(me.options.settleDate != undefined){
					filters = {
						"groupOp":"AND",
						"rules":[{"field":"settleDate","op":"lk","data": ""+ me.options.settleDate +""}]
					};
				}
				var validation = this.attachValidation();
				var roleGird = this.grid = App.Factory.createJqGrid({
					rsId: me.rsId,//'settleError',
					caption: '',//settleLang._('settleError.txt')
					onSelectRow: function (rowId) {
						roleGird.find('tr#' + rowId).removeClass('ui-state-highlight');
					},
					rowNum: 10,
					rowList: [10, 50, 100, 500],
					stats:{
						labelConfig:STAT_MAP,
						items:[
							{name: 'totalAmt', type:'currency'},
                            {name: 'totalSum', type:'count'}
						]
					},
					download: {
						url: url._(me.download()),//'settle.error.download'
						//必须返回对象
						params: function () {
							var postData = $(roleGird).jqGrid('getGridParam', 'postData');
							return { filters: postData.filters };
						},
						queueTask: {//不配置就不在任务队列里生成一项，通常都要配置
							name: function () {
								return '清算失败表';
							}
						}
					},
					actionsCol: {
						edit : false,
						del: false,
						extraButtons: [
							{name: 'operateDo', title:'待运营人员处理', icon: 'icon-opf-process-account icon-opf-process-account-color', click: function() {
								var rowData = roleGird._getRecordByRowId(Opf.Grid.getSelRowId(roleGird));
								operateDo(rowData);
							}},
							{name: 'settleDo', title: '待清算人员处理', icon: 'icon-opf-process-account icon-opf-join-settle-color', click: function() {
								var rowData = roleGird._getRecordByRowId(Opf.Grid.getSelRowId(roleGird));
								settleDo(rowData);
							}}
						],
						canButtonRender: function(name, opts, rowData) {
							// 只有在未处理的状态下才显示这个按钮
							if(name === 'operateDo' && !canOperateDo(rowData)) {
								return false;
							}

							if(name === 'settleDo' && !canSettleDo(rowData)) {
								return false;
							}

							//if(name === 'dealS0' && ( rowData.discCycle !== 'T088' ||  rowData.s0IsDeal === '1')){
							//	return false;
							//}
						}
					},
					filters: me.getFilters([
						{
							caption: '清算失败表搜索',
							defaultRenderGrid: true,//这个改成false会报错
							canSearchAll: true,
							canClearSearch: true,
							components: [
								{
									label: '清算日期',
									name: 'settleDate',
									type: 'date',
									defaultValue: moment(),
									options: {
										sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge']
									}
								},
								{
									label: '商户编号',
									name: 'mchtNo',
									type: 'text',
									options: {
										sopt: ['eq','lk']
									}
								},
								{
									label: '商户名称',
									name: 'mchtName',
									type: 'text',
									options: {
										sopt: ['eq','lk']
									}
								},
								{
									label: '收款账户',
									name: 'settleAcct',
									type: 'text',
									options: {
										sopt: ['eq','lk']
									}
								},
                                {
                                    label: '来源类型',
                                    name: 'sourceType',
                                    type: 'select',
                                    options: {
                                        sopt: ['eq'],
                                        value: SOURCETYPE_MAP
                                    }
                                }
								//{
								//	label: '处理标示',
								//	name: 'doFlag',
								//	type: 'select',
								//	options: {
								//		value: DOFLAG_MAP,
								//		sopt: ['eq']
								//	}
								//},
								//{
								//	label: '错误类型',
								//	name: 'errType',
								//	type: 'select',
								//	options: {
								//		value: ERRTYPE_MAP,
								//		sopt: ['eq']
								//	}
								//}
							],
							searchBtn: {
								text: '搜索'
							}
						}
					]),
					nav: {
						actions: {
							add: false
						},
						formSize: {
							width: Opf.Config._('ui', 'settleError.grid.form.width'),
							height: Opf.Config._('ui', 'settleError.grid.form.height')
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
							width: Opf.Config._('ui', 'settleError.grid.viewform.width'),
							height: Opf.Config._('ui', 'settleError.grid.viewform.height'),
							beforeInitData: function() {
								var rowData = roleGird._getRecordByRowId(Opf.Grid.getSelRowId(roleGird));
								if(rowData.mchtNo) {
									viewableGrid(MCHTS, this, true);
									viewableGrid(BRANCHS, this, false);
								}
								if(rowData.settleBrhId) {
									viewableGrid(BRANCHS, this, true);
									viewableGrid(MCHTS, this, false);
								}
							}
						},
						search: {
							onSearch: function () {
								var postData = $(this).jqGrid('getGridParam', 'postData');
								var filters = $.parseJSON(postData.filters) || {};
								var rules = filters.rules;
								if(rules.length){
									// 找出用户选择的“处理标示”是否为 "入账失败" 或者 "未知" 或者 "入账失败(待审)" 的 ErrorList
									var doFlagList = _.filter(rules, function (item) {
										return item.field == 'doFlag';
									});
									// 去掉 doFlag 规则
									var newRules = _.difference(rules, doFlagList);

									// 如果有"入账失败" 或者 "未知"，则需要对 rules 进行处理
									if(doFlagList.length){
										_.each(doFlagList, function (item) {
											var doFlagVal = item.data[0], errorTypeVal;
											// 重新给 doFlag 赋值
											newRules.push({field: "doFlag",op: item.op, data: doFlagVal});

											// 如果”处理标识“的值为 '9' 并且 操作为'等于'
											if(doFlagVal == '9' && item.op == 'eq'){
												errorTypeVal = item.data[1];
												newRules.push({field: "errType",op: "eq",data: errorTypeVal});
											}

											//如果“处理标识”的值为 '3' 并且 操作为'等于'
											if(doFlagVal == '3' && item.op == 'eq'){
												errorTypeVal = item.data[1];
												newRules.push({field: "errType",op: "eq",data: errorTypeVal});
											}

                                            //如果“处理标识”的值为 '7' 并且 操作为'等于'
                                            if(doFlagVal == '7' && item.op == 'eq'){
                                                errorTypeVal = item.data[1];
                                                newRules.push({field: "errType",op: "eq",data: errorTypeVal});
                                            }
										});
									}

									filters.rules = newRules;
									postData.filters = JSON.stringify(filters);
								}
							}
						}
					},
					gid: me.getGid(),
					url: url._(me.url),//'settle.error'
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
						id       : settleLang._('settle.error.id'),  //ID
						checkbox : '',
						settleDate       : settleLang._('settle.error.settle.date'),  //清算日期
						discCycle        : settleLang._('settle.error.discCycle'),//结算周期
						inDate       : settleLang._('settle.error.in.date'),  //入账日期
						batchNo       : settleLang._('settle.error.batch.no'),  //批次号
						traceNo       : settleLang._('settle.error.trace.no'),  //流水号
						//add new informaction
						mchtBrhNo: '商户/机构号',
						mchtBrhName: '商户/机构名称',
						branchName: settleLang._('settle.error.branch.name'),  //'机构名称'
						branchUserName: settleLang._('settle.error.branch.user.name'),  //'管理员姓名'
						branchPhone: settleLang._('settle.error.branch.phone'),  //'管理员手机'
						branchMobile: settleLang._('settle.error.branch.mobile'),  //'管理员电话'
						mchtName: settleLang._('settle.error.mcht.name'),  //'商户名称'
						userName: settleLang._('settle.error.user.name'),  //'主用户姓名'
						userPhone: settleLang._('settle.error.user.phone'),  //'主用户手机'
						// 
						//add end
						//添加错误类型的字段
						errType      :  settleLang._('settle.error.trace.error.type'),  //错误类型
						//add end
						doFlag       : settleLang._('settle.error.do.flag'),  //处理标示
						retNo       : settleLang._('settle.error.ret.no'),  //响应流水号
						retCode       : settleLang._('settle.error.ret.code'),  //响应码
						retMsg       : settleLang._('settle.error.ret.msg'),  //响应信息
						oprDate       : settleLang._('settle.error.opr.date'),  //处理日期
						oprNo       : settleLang._('settle.error.opr.no'),  //处理人员

						//add row
						oprName     : settleLang._('settle.error.opr.name'),
						//add end

						nextDate       : settleLang._('settle.error.next.date'),  //处理后参加清算日期
						nextDo       : settleLang._('settle.error.next.do'),  //原因及处理描述
						mchtNo       : settleLang._('settle.error.mcht.no'),  //商户编号
						settleBrhId       : settleLang._('settle.error.settle.brh.id'),  //清算机构号
						settleAcctType       : settleLang._('settle.error.settle.acct.type'),  //账户类型
						settleBankNo       : settleLang._('settle.error.settle.bank.no'),  //账户开户行号
						settleBankName       : settleLang._('settle.error.settle.bank.name'),  //账户开户行名称
						settleBankAddress       : settleLang._('settle.error.settle.bank.address'),  //账户开户行地址
						settleBankCode       : settleLang._('settle.error.settle.bank.code'),  //账户开户行地区编码
						settleAcctName       : settleLang._('settle.error.settle.acct.name'),  //账户名称
						settleAcct       : '收款帐户',  //收款帐户
						settleAmt       : settleLang._('settle.error.settle.amt'),  //清算金额
						otherAmt       : settleLang._('settle.error.other.amt'),  //其它金额
						remark       : settleLang._('settle.error.remark'),  //备注
						recCreateTime       : settleLang._('settle.error.rec.create.time'),  //记录创建时间
						recUpdTime       : settleLang._('settle.error.rec.upd.time'), //记录修改时间
						s0IsDeal     : 's0是否处理',
                        errorDescription: '差错描述',
                        sourceType : '来源类型'

					},
					responsiveOptions: {
						hidden: {
							ss: ['id','inDate','doFlag','retCode','retMsg','oprDate','nextDate','oprNo','nextDo','mchtNo','settleBrhId','settleAcctType','settleBankNo','settleBankName','settleBankAddress','settleBankCode','settleAcctName','settleAcct','settleAmt','otherAmt','remark','recCreateTime','recUpdTime', 'settleDate'],
							xs: ['id','retCode','retMsg','oprDate','nextDate','oprNo','nextDo','settleBrhId','settleAcctType','settleBankNo','settleBankName','settleBankAddress','settleBankCode','settleAcctName','settleAcct','settleAmt','otherAmt','remark','recCreateTime','recUpdTime'],
							sm: ['id','retCode','retMsg','settleBrhId','settleAcctType','settleBankNo','settleBankName','settleBankAddress','settleBankCode','otherAmt','remark','recCreateTime','recUpdTime'],
							md: ['id','retCode','retMsg','settleBrhId','settleAcctType','settleBankNo','settleBankName','settleBankAddress','settleBankCode','otherAmt','remark','recCreateTime','recUpdTime'],
							ld: ['id','retCode','retMsg','settleBrhId','settleAcctType','settleBankNo','settleBankName','settleBankAddress','settleBankCode','otherAmt','remark','recCreateTime','recUpdTime']
						}
					},
					colModel: [
						{name: 'id', index: 'id', editable: false, hidden: true},  //ID
						{name: 'checkbox', editable: false, viewable: false, formatter: checkboxFormatter, width: '60px'},
						{name: 'settleDate', index: 'settleDate', search: true, editable: true,
							searchoptions: {
								dataInit : function (elem) {
									$(elem).datepicker({autoclose: true,format: 'yyyymmdd'});
								},
								sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge']
							},
							editoptions: {
								dataInit : function (elem) {
									$(elem).datepicker({ autoclose: true, format: 'yyyymmdd' })
										.on("changeDate changeMonth changeYear", function(oDate) {
											$(oDate.target).valid();
										});
								}
							}
						},  //清算周期
						{name: 'discCycle', index: 'discCycle'
                            //search: true, stype: 'select',
                            //searchoptions: {
                            //    value: DISCCYCLE_MAP,
                            //    sopt:['eq']
                            //}
                        },
						{name: 'inDate', index: 'inDate', search: false, editable: true,
							editoptions: {
								dataInit : function (elem) {
									$(elem).datepicker({ autoclose: true, format: 'yyyymmdd' })
										.on("changeDate changeMonth changeYear", function(oDate) {
											$(oDate.target).valid();
										});
								}
							}
						},  //入账日期
						{name: 'batchNo', index: 'batchNo', search: true, editable: true, hidden: true,
							searchoptions: {
								sopt: [ 'eq']
							}
						},  //批次号
						{name: 'traceNo', index: 'traceNo', search: true, editable: true, hidden: true,
							searchoptions: {
								sopt: [ 'eq']
							}
						},  //流水号
						//add new informaction 
						//
						{name:         's0IsDeal', index:         's0IsDeal', search:false,editable: false, hidden: true}, //s0是否处理
						{name: 'mchtBrhNo', index:'mchtBrhNo', editable: false, viewable: false, formatter: mchtBrhNoFormatter}, //商户/机构号
						{name: 'mchtBrhName', index:'mchtBrhName', editable: false, viewable: false, formatter: mchtBrhNameFormatter}, //商户/机构名称
						{name: 'branchName', index:'branchName', editable: false, viewable: true, hidden: true, search: true},
						{name: 'branchUserName', index:'branchUserName', editable: false, viewable: true, hidden: true},
						{name: 'branchPhone', index:'branchPhone', editable: false, viewable: true, hidden: true},
						{name: 'branchMobile', index:'branchMobile', editable: false, viewable: true, hidden: true},
						{name: 'mchtName', index:'mchtName', editable: false, viewable: true, hidden: true, search: true},
						{name: 'userName', index:'userName', editable: false, viewable: true, hidden: true},
						{name: 'userPhone', index:'userPhone', editable: false, viewable: true, hidden: true},
						//add end
						{name:         'settleAmt', index:         'settleAmt', search:true,editable: true, formatter: Opf.currencyFormatter},  //清算金额
						{name: 'doFlag', index: 'doFlag', search: true, editable: true, formatter: doFlagFormatter,
							edittype: "select",
							editoptions: {
								value: DOFLAG_MAP
							},
							stype: 'select',
							searchoptions: {
								value: DOFLAG_MAP,
								sopt:['eq','ne']
							}
						},  //处理标示
						{name: 'nextDo', index: 'nextDo', search: false, editable: true, edittype: "textarea"},  //原因及处理描述
						{name: 'oprNo', index: 'oprNo', search: false, editable: true, hidden: true, viewable: false},  //处理人员
						{name: 'oprName', index: 'oprName', search:false,editable: false},
						{name: 'oprDate', index: 'oprDate', search: false, editable: true,
							editoptions: {
								dataInit : function (elem) {
									$(elem).datepicker({ autoclose: true, format: 'yyyymmdd' })
										.on("changeDate changeMonth changeYear", function(oDate) {
											$(oDate.target).valid();
										});
								}
							}
						},  //处理日期
						{name:         'nextDate', index:         'nextDate', search:false, hidden: true, editable: true,
							editoptions: {
								dataInit : function (elem) {
									$(elem).datepicker({ autoclose: true, format: 'yyyymmdd' })
										.on("changeDate changeMonth changeYear", function(oDate) {
											$(oDate.target).valid();
										});
								}
							}
						},  //处理后参加清算日期
						//添加错误类型
						{name: 'errType', index: 'errType', editable: false, hidden:true, formatter: errTypeFormatter}, // 错误类型
						//add end
						{name: 'retNo', index: 'retNo', search: false, editable: true, hidden: true},  //响应流水号
						//添加响应码条件查询 2016/05/27
                        {name: 'retCode', index: 'retCode', search: true, editable: true, hidden: true,
                            searchoptions: {
                                sopt: [ 'eq']
                            }
                        },  //响应码
                        //添加响应信息条件查询 2016/05/27
						{name: 'retMsg', index:  'retMsg', search: true, editable: true, hidden: true, edittype: "textarea",
                            searchoptions: {
                                sopt: ['eq','lk']
                            }
                        },  //响应信息
						{name:         'mchtNo', index:         'mchtNo', search:true,editable: true, hidden: true,
							searchoptions: {
								sopt: ['eq']
							}
						},  //商户编号
						{name:         'settleBrhId', index:         'settleBrhId', search:true,editable: true, hidden: true,
							searchoptions: {
								sopt: [ 'eq']
							}
						},  //清算机构号
						{name:         'settleAcctType', index:         'settleAcctType', search:false, hidden: true, editable: true, hidden: true, formatter: settleAcctTypeFormatter,
							edittype: "select",
							editoptions: {
								value: SETTLEACCTTYPE_MAP
							}
						},  //账户类型
						{name:         'settleBankNo', index:         'settleBankNo', search:false,editable: true, hidden: true},  //账户开户行号
						{name:         'settleBankName', index:         'settleBankName', search:false,editable: true, hidden: true},  //账户开户行名称
						{name: 'settleBankAddress', index: 'settleBankAddress', search: false, editable: true, hidden: true, edittype: "textarea"},  //账户开户行地址
						{name:         'settleBankCode', index:         'settleBankCode', search:false,editable: true, hidden: true},  //账户开户行地区编码
						{name:         'settleAcctName', index:         'settleAcctName', search:false,editable: true, hidden: true},  //账户名称
						{name:         'settleAcct', index:         'settleAcct', search:true,editable: true, hidden: true},  //账户账号
						{name:         'otherAmt', index:         'otherAmt', search:false,editable: true, hidden: true, formatter: Opf.currencyFormatter},  //其它金额
						{name:         'remark', index:         'remark', search:false,editable: true, hidden: true, edittype: "textarea"},  //备注
						{name: 'recCreateTime', index: 'recCreateTime', search: true, editable: true, hidden: true,
							// formatter: function(val) {
							// 	return val ? val.substring(0, 8) : "";
							// },
                            searchoptions: {
                                dataInit : function (elem) {
                                    $(elem).datepicker({autoclose: true,format: 'yyyymmdd'});
                                },
                                sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge']
                            },
							editoptions: {
								dataInit : function (elem) {
									$(elem).datepicker({ autoclose: true, format: 'yyyymmdd' })
										.on("changeDate changeMonth changeYear", function(oDate) {
											$(oDate.target).valid();
										});
								}
							}
						},  //记录创建时间
						{name: 'recUpdTime', index: 'recUpdTime', search: false, editable: true, hidden: true,
							// formatter: function(val) {
							// 	return val ? val.substring(0, 8) : "";
							// },
							editoptions: {
								dataInit : function (elem) {
									$(elem).datepicker({ autoclose: true, format: 'yyyymmdd' })
										.on("changeDate changeMonth changeYear", function(oDate) {
											$(oDate.target).valid();
										});
								}
							}
						}, //记录修改时间
                        {name: 'errorDescription', index:'errorDescription', search:false, editable: true, formatter: errorDescriptionFormatter}, //来源类型
                        {name: 'sourceType', index:'sourceType', search:true, editable: true, formatter: sourceTypeFormatter,
                            stype: 'select',
                            searchoptions: {
                                value: SOURCETYPE_MAP,
                                sopt:['eq']
                            }
                        } //来源类型

					],
					loadComplete: function() {
						// $('#cb_settle-errors-grid-table').hide();
						me.checkType = '';
						_.defer(function(){
							roleGird.find('input[type="checkbox"]').on('click', function (e) {
								me.onCheckBoxClick(this);
							});
						})
					}
				});
				GRID = roleGird;
				_.defer(function(){
					if(!Ctx.avail(me.addCtx())) {
						return;
					}

					var btnHtml = _.template(['<div style="border: 1px solid #ffffff;color: #ffffff;border-radius: 3px;text-align: center;">',
						'<div style="width: 110px;  height: 29px; padding: 5px 8px;">',
						'<i class="<%=icon%>"></i>',
						'<%=str%>',
						'</div>',
						'</div>'].join(''));

					Opf.Grid.navButtonAdd(me.grid, {
						caption: '',
						name: 'newAdd',
						title: '新增',
						position: 'first',
						buttonicon: 'icon-plus-sign white',
						onClickButton: function() {
							addDialog(me, roleGird);
						}
					});

					Opf.Grid.navButtonAdd(me.grid, {
						caption: btnHtml({str: '退票信息导入', icon: 'icon-download'}),
						name: 'errorDataImport',
						title: '退票信息导入',
						position: 'last',
						buttonicon: 'auto-batch',
						onClickButton: function() {
							errorDataImportDialog(roleGird);
						}
					});
					Opf.Grid.navButtonAdd(me.grid, {
						caption: btnHtml({str: '全选', icon: 'icon-check'}),
						name: "checkedAll",
						title:'全选',
						buttonicon: "",
						onClickButton: function() {
							me.checkedAll();
						},
						position: "last"
					});
					Opf.Grid.navButtonAdd(me.grid, {
						caption: btnHtml({str: '批量处理', icon: ''}),
						name: "batchOperate",
						title:'批量处理',
						buttonicon: "",
						onClickButton: function() {
							me.batchOperate();
						},
						position: "last"
					});
					Opf.Grid.navButtonAdd(me.grid, {
						caption: "",
						name: "autoBatch",
						title:'自动成批',
						buttonicon: "auto-batch",
						onClickButton: function() {
						},
						position: "last"
					});
				});
				return roleGird;
			}
		});
	});

	function canOperateDo (rowData) {
		return rowData.errType === '1' && rowData.doFlag === '9';
	}

	function canSettleDo (rowData) {
		return (rowData.errType === '2' && rowData.doFlag === '9') ||
			(rowData.errType === '1' && rowData.doFlag === '3');
	}

	function canSettleDo1 (rowData) {
		return (rowData.errType === '2' && rowData.doFlag === '9');

	}

	function canSettleDo2 (rowData) {
		return (rowData.errType === '1' && rowData.doFlag === '3');

	}

	function addDialog(me, grid) {
		var $dialog = $(stErrorTradeTpl()).dialog({
			autoOpen: true,
			width: Opf.Config._('ui', 'settleError.grid.addForm.width'),
			modal: true,
			buttons: [{
				html: "<i class='icon-retweet'></i>&nbsp; 重置",
				class : "btn btn-xs btn-info settle-reset-btn",
				click: function(e) {
					$('#add-extra-msg').empty().append(selectMsgTpl());
					$('#addResource input:checked').removeAttr('checked');
					$('#retMsg textarea').val('');
				}
			},
			{
				html: "<i class='icon-ok'></i>&nbsp; 新增",
				class : "btn btn-xs btn-purple",
				click: function(e) {
					var obj = getFormData($('#settle-error-add-form'));
					if(obj) {
						$($(e.target).closest('button')).addClass('disabled').find('span').html("<i class='icon-ok'></i>&nbsp; 正在提交...");
						$.ajax({
							url: 'api/settle/errors',//url._(me.url),//'settle.error' ====>为公用，四个模块同个接口!
							data: JSON.stringify(obj),
							type: 'POST',
							autoMsg:false, 
							contentType:'application/json',
							dataType:'json',
							success: function(resp) {
								if(resp.success) {
									Opf.Toast.success('操作成功');
								}

							},
							error: function(resp){
								if(resp.responseJSON.msg.indexOf('数据重复') != -1){
									Opf.confirm('数据重复,确认提交？', function (confirm) {
										if (!confirm) {
											return;
										}
										obj.overPos="1";
										$.ajax({
											url: 'api/settle/errors',
											data: JSON.stringify(obj),
											type: 'POST',
											contentType:'application/json',
											dataType:'json',
											async: false,
											success: function(resp){
												if(resp.success) {
													Opf.Toast.success('操作成功');
												}
											}
										});
									});
								}
							}
						});
						$(grid).trigger("reloadGrid", [{current:true}]);
						$(this).dialog('destroy');

					} else {
						//TODO
					}
				}
			}],
			create: function() {
				var me = this;
				$(me).on('click', function(e) {
					var $selected = $(e.target);
					if($selected.hasClass('settle-remove-msg')) {
						$selected.closest('.row').remove();
					}
					if($selected.hasClass('add-rule')) {
						$('#add-extra-msg').append(selectMsgTpl());
					}
				});
				$(me).find('#addResource input').click(function(){
					$('#addResource span').hide();
				});
				$(me).find('#add-extra-msg').append(selectMsgTpl());
				$(me).prev('.ui-widget-header').find('.ui-dialog-title').addClass('settle-styles-paddingL-15');

				//select点击事件
				$(me).find('select.settle-error-add-select').on('change', function(e){
					$(me).find('input.settle-error-add-input').attr("name", $(e.target).val());
					if($(e.target).val() === "settleDate"){
						$(me).find('input.settle-error-add-input').datepicker({autoclose: true,format: 'yyyymmdd'});
						$(me).find('input.settle-error-add-input').datepicker('hide');
					}else {
						$(me).find('input.settle-error-add-input').datepicker('remove');
					}
					$(me).find('input.settle-error-add-input').val('');
				});
				$(me).find('input.settle-error-add-input').click(function(e){
					if($(e.target).attr("name") === "settleDate"){
						$(e.target).datepicker({autoclose: true,format: 'yyyymmdd'});
						$(e.target).datepicker('show');
					}
				});
			},
			close: function() {
				$(this).dialog('destroy');
			}
		});
	}

	//失败信息批量导入
	function errorDataImportDialog(me){
		var titleName = "批量退票信息导入";
		var uploader, tpl = null;
		uploader = tpl = uploadFileTpl({
			data: titleName
		});
		var $dialog = Opf.Factory.createDialog(tpl, {
			destroyOnClose: true,
			autoOpen: true,
			width: 450,
			height: 420,
			modal: true,
			buttons: [{
				type: 'submit',
				click: function (e) {
					var fileSelected = ($dialog.find("input[name='file']").val() === "" ? false : true);

					if(fileSelected){
						uploader.submit();
					}
					else{
						$("label[for='uploadfile']").addClass("error").text("请选择文件");
					}
				}
			}, {
				type: 'cancel'
			}],
			create: function() {
				var $me = $(this),
					$indicator = $me.find('.uploadFileIndicator'),
					$trigger = $me.find('.uploadfile'),
					$submitBtn = $me.closest('.ui-dialog').find('button[type="submit"]');
				uploader = new Uploader({
					data: {},
					name: 'file',
					trigger: $trigger,
					action: 'api/settle/errors/import-excel',//上传接口
					accept: '.xls, .xlsx',
					change: function () {
						$("label[for='uploadfile']").removeClass("error").text($("form input[name='file']").val());
					},
					beforeSubmit: function () {
						Opf.UI.busyText($submitBtn);
					},
					complete: function () {
						Opf.UI.busyText($submitBtn,false);
					},
					progress: function(queueId, event, position, total, percent) {
						if(percent) {
							$indicator.find('.progress-percent').text(percent+'%').show();
						}
					},
					success: function(queueId, resp) {
						if(resp.success === false) {
							Opf.alert({ title: '操作提示', message: resp.msg ? resp.msg : '信息导入错误!' });
						}
						else {
							$me.dialog("destroy");
							require(['app/oms/settle/settle-error/error-view/list-view'], function(errorView){
								var errorView = new errorView({bounceId: resp.msg}).render();
								errorView.showDialog(errorView);
								errorView.$el.on('reloadParentGrid',function(){
									me.grid.trigger('reloadGrid');
								});
							});
						}
					}
				});

				// 下载按钮
				$(this).find('.download-btn').click(function(event) {
					Opf.UI.setLoading($('#page-content'), true);
					Opf.ajax({
						url: 'api/settle/errors/download-template',
						success: function (resp) {
							Opf.download(resp.data);
						},

						error: function(resp) {
							console.log("downlaod template error");
						},

						complete: function (resp) {
							Opf.UI.setLoading($(event.target).closest('#page-content'),false);
						}
					});
				});
			}
		});
	}
	function viewableGrid (argus, grid, viewable) {
		var canView;
		if(viewable) {
			canView = true;
		}
		else {
			canView = false;
		}
		for(var i=0; i<argus.length; i++) {
			$(grid).jqGrid('setColProp', argus[i], {
				viewable: canView
			});
		}
	}

	function getFormData(form) {
		var $form = $(form);
		var obj = {};
		var flag = true;
		$form.find('select.settle-error-add-select').each(function() {
			var value = $(this).closest('.row').find('input.settle-error-add-input').val();
			obj[$(this).val()] = value;
			if(!value) {
				obj = null;
				flag = false;
				return;
			}
		});
		if(!flag){
			return;
		}
		if(!$form.find('#addResource input:checked').length){
			$form.find('#addResource span').show();
			obj = null;
			return;
		}
		obj["addResource"] =$form.find('#addResource input:checked').val();
		obj["retMsg"] =$form.find('#retMsg textarea').val();
		return obj;
	}

	function checkboxFormatter (val, options, rowData) {
		var isDisabled = '', checkedType = '';

		if (canOperateDo(rowData)) {
			checkedType = 'OPERATE_DO';
		}
		else if (canSettleDo1(rowData)) {
			checkedType = 'SETTLE_DO_1';
		}
		else if (canSettleDo2(rowData)) {
			checkedType = 'SETTLE_DO_2';
		}
		else {
			isDisabled = 'disabled';
		}
		return '<label><input checkedType="' + checkedType + '" ' + isDisabled + ' rowId="' + rowData.id + '" type="checkbox" class="ace"><span class="lbl"></span></label>';
	}

	function doFlagFormatter(val, options, rowDate) {
		// var errType = '(' + (ERRTYPE_MAP[rowDate.errType] || '未识别的错误类型') + ')';
		var errType = rowDate.errType;

		if(val === '9' && errType === '1') {
			return '入账失败';
		}

		if(val === '9' && errType === '2') {
			return '未知';
		}

		if(val === '3' && errType === '1') {
			return '待清算人员处理';
		}

		if(val === '0' && errType === '2') {
			return '原入账成功';
		}

        if(val === '7' && errType === '1') {
            return '入账失败(待审)';
        }

        if(val === '7' && errType === '2') {
            return '原入账成功(待审)';
        }

		return DOFLAG_MAP[val] || '';
	}

	function settleAcctTypeFormatter(val) {
		return SETTLEACCTTYPE_MAP[val] || '';
	}

	function errTypeFormatter(val) {
		return ERRTYPE_MAP[val] || '';
	}

	function mchtBrhNoFormatter(cellvalue, options, rowObject) {
		return rowObject.mchtNo || rowObject.settleBrhId || '';
	}

	function mchtBrhNameFormatter(cellvalue, options, rowObject) {
		return rowObject.mchtName || rowObject.branchName || '';
	}

    function errorDescriptionFormatter(cellvalue, options, rowObject) {
        var value = '';
        if (rowObject.retCode) {
            value = rowObject.retCode.toLowerCase().substr(0, 2);
            if ((value == 'st' || value == 'sq') && rowObject.retMsg) {
                value = rowObject.retMsg;
            }  else {
                value = '';
            }
        }
        return value;
    }

    function sourceTypeFormatter(cellvalue, options, rowObject) {
        var value = '';
        if (rowObject.retCode) {
            value = rowObject.retCode.toLowerCase().substr(0, 2);
            if (value == 'js' || value == 'qf') {
                value = '系统记录清算失败';
            } else if (value == 'st') {
                value = '手工导入退票';
            } else if (value == 'sq') {
                value = '手工导入清算失败';
            } else {
                value = '';
            }
        }
        return value;
    }

	function operateDo (rowDate) {
		// 运营人员处理流程
		var doFlow = {
			tpl: operateDoTpl(),
			url: url._('settle.error.operator', {id: rowDate.id}),
			postId: rowDate.id
			//from:'operate',
			//hasBankNo: !!rowDate.settleBankNo
		};

		doitDialog(doFlow);
	}

	function settleDo (rowDate) {
		//TODO 清算人员处理流程
		var doFlow = {};
		if(rowDate.doFlag === '9') {
			doFlow = {
				tpl: stErrorNextTpl(),
				url: url._('settle.error.unknow', {id: rowDate.id}),
				postId: rowDate.id
			};
			doitDialog(doFlow);
		}
		if(rowDate.doFlag === '3') {
			doFlow = {
				tpl: stErrorTpl(),
				url: url._('settle.error.update', {id: rowDate.id}),
				postId: rowDate.id

			};
			doitDialog(doFlow);
		}
	}

	function doitDialog(options) {
		var $dialog = Opf.Factory.createDialog(options.tpl, {
			destroyOnClose: true,
			title: '处理',
			autoOpen: true,
			width: 400,
			height: 250,
			modal: true,
			buttons: [{
				type: 'submit',
				click: function (e) {
					// if(options.from == "operate" && !options.hasBankNo){
					// 	Opf.alert("商户银行卡信息不完整，请完善后处理提交");
					// 	return ;
					// }
					var valid = $(this).find('form').valid();
					if(valid) {
						var $button = $($(e.target).closest('button'));
						$button.addClass('disabled').find('span.text').html("正在提交...");
						submitForm(options.postId, options.url, this, options.batchOper);
					}
				}
			},
			{
				type: 'cancel'
			}],
			create: function() {
				Opf.Validate.addRules($(this).find('form'), {
					rules: {
						nextDo: {
							required: true,
							maxlength: 300
						}
					}
				});
			}
		});
	}

	function showChangeStateDialog(me, rowData) {
		var tpl = s0DealTpl();

		var $dialog = $(tpl).dialog({
			destroyOnClose: true,
			title: 'S0审核',
			autoOpen: true,
			width: 350,
			height: 300,
			modal: true,
			buttons: [{
				html: "<i class='icon-ok'></i>&nbsp; 提交",
				"class" : "btn btn-xs btn-primary",
				click: function () {
					var dealResult = $(this).find('[name="dealResult"]').val();
					var dealDesc = $(this).find('[name="dealDesc"]').val();
					console.log(dealDesc);
					console.log(dealResult);
					Opf.ajax({
						type: 'POST',
						jsonData: {
							dealResult:  dealResult,
							dealDesc: dealDesc,
							bankCardNo: rowData.settleAcct,
							accountName: rowData.settleAcctName,// 帐户名称
							zbankName:  rowData.settleBankName, // 账户开户支行名称
							ibox42 :rowData.mchtNo,//商户号
							ibox43: rowData.mchtName,//商户名称
							txAmt: rowData.settleAmt
						},
						url: url._('settle.error.s0.add', {id: rowData.id}),
						successMsg: '处理成功',
						success: function () {
							$dialog.dialog("destroy");
							me.grid.trigger('reloadGrid', {current: true});
						}
						//complete: function () {
						//	$dialog.dialog('close');
						//}
					});

				}
			}, {
				html: "<i class='icon-remove'></i>&nbsp; 取消",
				class : "btn btn-xs",
				click: function() {
					$( this ).dialog('destroy');
				}
			}],
			create: function () {}
		});
	}
	function submitForm(postId, postUrl, dialog, batchOper) {
		var postData = getFormValues($(dialog).find('form'));
		var tmpData;
		if (batchOper) {
			tmpData = [];
			for(var i=0; i<postId.length; i++) {
				tmpData.push($.extend({id: postId[i]}, postData));
			}
			postData = tmpData;

		}
		else {
			postData['id'] = postId;
		}

		Opf.ajax({
			url: postUrl,
			type:'PUT',
			jsonData: postData,//['1','2']
			success: function(resp) {
				$(GRID).trigger("reloadGrid", [{current:true}]);
				if(resp.success) {
					Opf.Toast.success('操作成功');
				}
			},
			error: function(resp) {
				console.log(resp);
			},
			complete: function(resp) {
				$(dialog).dialog('close');
			}
		})
	}

	function getFormValues (form) {
		var $form = $(form);
		var resultData = {};
		$form.find(':input').each(function(val) {
			resultData[$(this).attr('name')] = $(this).val();
		});
		return resultData;
	}


	return App.SettleApp.SettleError.List.View;

});