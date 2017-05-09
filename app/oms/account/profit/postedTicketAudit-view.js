/**
 * Created by liliu on 2017/1/18.
 */
define([
	'App',
	'jquery.jqGrid',
	'bootstrap-datepicker'
], function(App){
	var TICKET_TYPE_MAP ={
		'1': '增值税专用发票6%',
		'2': '增值税专用发票3%',
		'3': '普通发票3%'
	};
	var STATUS_TYPE_MAP ={
		'0': '已审核',
		'1': '提交待审核'
	};
	var tableCtTpl = [
		'<div class="row">' ,
			'<div class="col-xs-12 jgrid-container">' ,
				'<table id="postedticket-audit-grid-table"></table>' ,
				'<div id="postedticket-audit-grid-pager"></div>' ,
			'</div>',
		'</div>'].join('');
	var View = Marionette.ItemView.extend({
		template: _.template(tableCtTpl),
		tabId: 'menu.postedTicket.audit',
		onRender: function(){
			var me = this;
			_.defer(function(){
				me.renderGrid();
			})
		},
		renderGrid: function(){
			var me = this;
			var setupValidation = Opf.Validate.setup;
			var addValidateRules = function(form) {
				Opf.Validate.addRules(form, {
					rules: {
						userId: {'required':true},
						userName: {'required':true},
						invoiceType: {'required':true},
						title: {'required':true},
						ticketAmount: {'required':true, 'number':true},
						amount: {'required':true, 'number':true},
						remark: {'required':true, 'number':true},//
						invoiceCode: {'required':true, 'number':true},
						invoiceNo: {'required':true, 'number':true}
					}
				});
			};
			var grid = me.grid =  App.Factory.createJqGrid({
				gid: 'postedticket-audit-grid',
				rsId: 'postedTicket.audit',
				multiselect: true,
				rowList: [10, 20, 30, 50, 100],
				filters: [
					{
						canClearSearch: true,
						components: [
							{label: '用户',name: 'userName', type: 'select2',
								options: {
									sopt: ['eq'],
									select2Config: {
										placeholder: '--请选择发奖用户--',
										minimumInputLength: 1,
										width: 200,
										ajax: {
											type: 'GET',
											url: url._('posted.audit.userSearch'),
											dataType: 'json',
											data: function (term) {
												return {
													userName: term
												};
											},
											results: function (data) {
												return {
													results: data
												};
											}
										},
										id: function (e) {
											return e;
										},
										formatResult: function(data){
											return data;
										},
										formatSelection: function(data){
											return data;
										}
									},
									valueFormat: function (select2Data) {
										return select2Data.length>0 ? select2Data : '';  //见common-filters里，如果select2Data为对象，会被当作日期范围来设置
									}
								}
							},
							{label: '提交时间',name: 'subTime', type: 'rangeDate', limitRange: 'month', limitDate: moment()},
							{label: '发票类型',name: 'invoiceType', type: 'select', options: {value:TICKET_TYPE_MAP}},
							{label: '备注(发奖月份)',name: 'remark'},
							{label: '发票代码',name: 'invoiceCode'},
							{label: '发票号码',name: 'invoiceNo'},
							{
								label: '付款申请单号',
								name: 'id',type: 'text',
								options: {
									sopt: ['eq']
								}}
						],
						searchBtn: {
							text: '搜索'
						}
					}
				],
				nav: {
					actions: {
						//add: false
					},
					add: {
						beforeShowForm: function(form) {
							addValidateRules(form);

							var $form = $(form);
							$form.find('#tr_id').hide();
							$form.find('[name="userName"]').attr('disabled', 'disabled');
							$form.find('[name="remark"]').attr('placeholder', '格式:yyyyMM');
							$form.find("[name='userId']").select2({
								placeholder: '--请选择用户--',
								minimumInputLength: 1,
								//minimumResultsForSearch: Infinity,
								width: '50%',
								ajax: {
									type: "GET",
									url: url._('posted.audit.postedTicketFindUserId'),
									dataType: 'json',
									data: function (term) {
										return {
											userId: term
										};
									},
									results: function (data) {
										return {
											results: data
										};
									}
								},
								id: function (e) {
									return e.userId;
								},
								formatResult: function(data, container, query, escapeMarkup){
									return data.userName;
								},
								formatSelection: function(data, container, escapeMarkup){
									$form.find('[name="userName"]').val(data.userName);
									return data.userName;
								}
							});
						},
						beforeSubmit: setupValidation
					}
				},
				actionsCol: {
					view: false,
					edit: false,
					del: false,
					extraButtons: [
						{name: 'audit', icon: '', caption: '审核',
							click: function(name, opts, rowData){
								var that = this;
								$(that).closest('.tab-pane>div').hide();
								require(['app/oms/account/profit/audit-view'], function(View){
									var auditView = new View({rowData:rowData}).render();
									me.bindBackBtnEvent(auditView, $(that).parents('.tab-pane>div'));
									App.getCurTabPaneEl().append(auditView.$el);
								});
							}
						}
					],
					canButtonRender: function(name, opts, rowData) {
						if(name == 'audit' && STATUS_TYPE_MAP[rowData.status] != '提交待审核'){
							return false;
						}
					}
				},
				url: url._('posted.audit.list'),
				colModel: [
					{name: 'id'},
					{name:'subTime', formatter: dataFormatter, search: true,
						searchoptions:{
							dataInit: function(ele){
								$(ele).datepicker({autoclose: true, format: 'yyyymmdd'});
							},
							sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge']
						}
					},
					{name:'throughTime', formatter: dataFormatter, search: true,
						searchoptions:{
							dataInit: function(ele){
								$(ele).datepicker({autoclose: true, format: 'yyyymmdd'});
							},
							sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge']
						}
					},
					{name: 'userId', hidden: true, editable: true},
					{name:'userName', search: true, editable: true, searchoptions: { sopt:['lk'] } },
					// {name:'payee'},
					{name:'companyName'},
					{name:'acctNo', width: 280,
						formatter: function(val){
							return val ? val.replace(val.substring(0, 4), val.substring(0, 4)+' ')
								.replace(val.substring(4, 8), val.substring(4, 8)+' ')
								.replace(val.substring(8, 12), val.substring(8, 12)+' ')
								.replace(val.substring(12, 16), val.substring(12, 16)+' ') : '';
						}
					},
					{name:'remark', editable: true},
					{name:'amount', editable: true},
					{name:'ticketAmount', hidden: true, editable: true},
					{name:'thawAmount'},
					{name:'invoiceType', formatter: ticketTypeFormatter,
						editable: true,
						edittype: 'select',
						editoptions: {
							value: TICKET_TYPE_MAP,
							sopt: ['eq']
						},
						search: true, stype: 'select', searchoptions: {sopt:['eq'], value: TICKET_TYPE_MAP}},
					{name:'invoiceCode', editable: true},
					{name:'title', hidden: true, editable: true},
					{name:'invoiceNo', editable: true},
					{name: 'status', formatter: statusFormatter}
				],
				colNames: {
					id: '付款申请单号',
					userId: '用户id',
					subTime: '提交日期',
					throughTime: '审核通过时间',
					userName: '用户姓名',
					// payee: '收款单位',
					companyName:'公司名称',
					acctNo:'收款账号',
					remark: '分润月份',
					amount: '开票金额(元)',
					ticketAmount: '奖励总金额(元)',
					thawAmount: '税后金额(元)',
					invoiceType: '发票类型',
					invoiceCode: '发票代码',
					title: '开票内容',
					invoiceNo: '发票号码',
					status: '状态'
				}
			});
			this.importBtn(grid);
			this.importDetailBtn(grid);
		},
		importDetailBtn: function (grid) {
			if (!Ctx.avail('postedTicket.audit.importDetail')) {
				return;
			}
			var importHtml = ['<div style="border: 1px solid #ffffff;color: #ffffff;border-radius: 1px;">',
				'<div style="padding: 5px 10px 5px 10px;">',
				'<i class="icon-download-alt smaller-80"></i>&nbsp;',
				'导出付款申请明细',
				'</div>',
				'</div>'].join('');
			Opf.Grid.navButtonAdd(grid, {
				id: 'importtDetail',
				caption: importHtml,
				name: 'importtDetail',
				title: '导出付款申请明细',
				position: 'last',
				onClickButton: function () {
					if(!Opf.Grid.hasSelRow(grid)){
						Opf.alert("至少选择一行数据！");
						return false;
					}
					var rowIds = Opf.Grid.getSelRowIds(grid);
					Opf.ajax({
						url: 'api/operator/postedTicket/apply/exportApply'+'?ids='+rowIds,
						type: 'GET',
						//jsonData: function(){return {ids:rowIds};},
						success: function(res){
							if(res.success){
								Opf.download(res.data);
							}else {
								Opf.alert(res.remark);
							}
						}
					});
				}
			});
		},

		importBtn: function (grid) {
			if (!Ctx.avail('postedTicket.audit.import')) {
				return;
			}
			var importHtml = ['<div style="border: 1px solid #ffffff;color: #ffffff;border-radius: 1px;">',
				'<div style="padding: 5px 10px 5px 10px;">',
				'<i class="icon-download-alt smaller-80"></i>&nbsp;',
				'导出付款申请单',
				'</div>',
				'</div>'].join('');
			Opf.Grid.navButtonAdd(grid, {
				id: 'import',
				caption: importHtml,
				name: 'import',
				title: '导入数据',
				position: 'last',
				onClickButton: function () {
					if(!Opf.Grid.hasSelRow(grid)){
						Opf.alert("至少选择一行数据！");
						return false;
					}
					var rowIds = Opf.Grid.getSelRowIds(grid);
					Opf.ajax({
						url: url._('posted.audit.exportApplyTable')+'?ids='+rowIds,
						type: 'GET',
						//jsonData: function(){return {ids:rowIds};},
						success: function(res){
							if(res.success){
								Opf.download(res.data);
							}else {
								Opf.alert(res.remark);
							}
						}
					});
				}
			});
		},

		bindBackBtnEvent: function(view, gridEl){
			var $gridEl = $(gridEl);
			var me = this;
			view.on('back', function(){
				me.grid.trigger('reloadGrid', {current: true});
				setTimeout(function(){
					$(window).trigger('resize');
					$gridEl.show();
				},1);
			});
		}
	});

	function dataFormatter(val){
		return val ? moment(val, 'YYYYMMDD').format('YYYY-MM-DD') : '';
	}

	function ticketTypeFormatter(val){
		return TICKET_TYPE_MAP[val] || '';
	}
	function statusFormatter(val){
		return STATUS_TYPE_MAP[val] || '';
	}

	App.on('posted:ticket:audit', function(){
		App.show(new View);
	});

	return View;
});
