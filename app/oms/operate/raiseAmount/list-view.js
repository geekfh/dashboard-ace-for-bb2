/**
 * Created by liliu on 2016/11/9.
 */
define([
	'App',
	'jquery.jqGrid'
], function(App){
	var tableCtTpl = [
		'<div class="row">',
		'<div class="col-xs-12 jgrid-container">',
		'<table id="raise-amount-grid-table"></table>',
		'<div id="raise-amount-grid-pager"></div>',
		'</div>',
		'</div>'
	].join('');
	var APPLY_STATUS = {
		"-1": "未审核",
		"1": "审核通过",
		"2": "审核不通过",
		"3": "异常"
	};
	var View = Marionette.ItemView.extend({
		tabId: 'menu.operate.raiseAmount',
		template: _.template(tableCtTpl),
		onRender: function(){
			var me = this;
			_.defer(function(){
				me.renderGrid()
			});
		},
		renderGrid: function(){
			var me = this;
			var grid = me.grid = App.Factory.createJqGrid({
				rsId: 'page.raiseAmount',
				filters: [{
					canClearSearch: true,
					components: [
						{
							label: '商户手机号',
							name: 'mobileNo',
							type: 'text',
							options: {
								sopt: ['eq']
							}
						},
						{
							label: '提交人手机号码',
							name: 'applyMobileNo',
							type: 'text',
							options: {
								sopt: ['eq']
							}
						},
						{
							label: '审批状态',
							name: 'applyStatus',
							type: 'select',
							options: {
								value: APPLY_STATUS,
								sopt: ['eq']
							}
						},
						{
							label: '申请编号',
							name: 'applyId',
							type: 'text',
							options: {
								sopt: ['eq']
							}
						}
					],
					searchBtn: {
						text: '搜索'
					}
				}],
				gid: 'raise-amount-grid',
				url: url._('operate.raiseAmount'),
				nav: {
					actions: {
						add: false,
						search: false,
						editfunc: editfunc,
						viewfunc: viewfunc
					}
				},
				actionsCol: {
					del: false
				},
				colNames: {
					applyId: '申请编号',
					createTime: '提交日期',
					applyUserName: '提交人',
					mobileNo: '手机号码',
					mchtName: '商户名称',
					mchtNo: '商户号',
					expandName: '拓展员',
					applyStatus: '审批状态'
				},
				colModel: [
					{name: 'applyId'},
					{name: 'createTime', formatter:dateFormat},
					{name: 'applyUserName'},
					{name: 'mobileNo'},
					{name: 'mchtName'},
					{name: 'mchtNo'},
					{name: 'expandName'},
					{name: 'applyStatus', formatter:stateFormat}
				]
			});
			return grid;

			function editfunc(id){
				var buttonType = 'edit';
				auditDetail(id, buttonType);
			}
			function viewfunc(id){
				var buttonType = 'view';
				auditDetail(id, buttonType);
			}

			function auditDetail(id, buttonType){
				var rowData = me.grid._getRecordByRowId(id);
				require(['app/oms/operate/raiseAmount/audit-view'], function(AuditView){
					App.maskCurTab();
					Opf.ajax({
						type: 'GET',
						url: url._('operate.raiseAmount.getone'),
						data: {'applyId': rowData.applyId},
						success: function(data){
							data.buttonType=buttonType; // buttonType-edit 审核界面  buttonType-view 查看界面
							var view = new AuditView({
								data: data || '',
								rowData: rowData
							}).render();
							var $dialog = Opf.Factory.createDialog(view.$el,{
								title: data.buttonType == 'edit' ? '额度审批': '查看提额申请',
								width: '60%',
								height: 720,
								modal: true,
								close: function() {
									$dialog.dialog('destroy');
								}
							});
						},
						complete: function(data){
							App.unMaskCurTab();
						}
					});
				});
			}
		}
	});

	function stateFormat(stateCode){
		return APPLY_STATUS[stateCode];
	}
	function dateFormat(value){
		return moment(value).format('YYYY-MM-DD HH:mm:ss');
	}
	App.on('operate:raiseAmount', function(){
		App.show(new View());
	});
});