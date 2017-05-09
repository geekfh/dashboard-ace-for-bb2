/**
 * Created by liliu on 2016/11/30.
 */
define([
	'App', 'jquery.jqGrid'
], function(App){
	var html = [
		'<div class="row">',
		'<div class="col-xs-12 jgrid-container">',
		'<table id="oms-page-system-permission-grid-table"></table>',
		'<div id="oms-page-system-permission-grid-pager"></div>',
		'</div>',
		'</div>'
	].join('');

	// 获取子系统列表
	var SYSTEM_MAP = {},
		SYSTEM_LIST = [];

	// 新增查询接口
	Opf.ajax({
		url: url._('system.serviceInfoMap'),
		type: 'GET',
		async: false,
		success: function(modules){
			_.each(modules, function(module){
				SYSTEM_MAP[module.remark] = module.remark;
				SYSTEM_LIST.push(module);
			});
		}
	});

	return Marionette.ItemView.extend({
		tabId:'oms.menu.system.permission',
		template: _.template(html),
		onRender: function(){
			var me = this;
			_.defer(function(){
				me.renderGrid();
			});
		},
		renderGrid: function(){
			var me = this;
			
			var grid = me.grid = App.Factory.createJqGrid({
				rsId: '*',
				gid: 'oms-page-system-permission-grid',
				url: url._('system.setting.module'),
				filters: [{
					caption: '条件过滤',
					canClearSearch: true,
					components: [
						{label: '权限码', name: 'code'},
						{label: '权限名', name: 'name'},
						{label: '菜单名称', name: 'resName'},
						{label: '系统', name: 'descr'}
					],
					searchBtn: {text: '搜索'}
				}],
				nav:{
					actions: {
						addfunc: function(){
							me.addEdit();
						},
						editfunc: function(id){
							var rowData = grid._getRecordByRowId(id);
							me.addEdit(rowData);
						}
					}
				},
				colNames: {
					id: '',
					code: '权限码',
					name: '权限名',
					resName: '菜单名称',
					descr: '系统名称'
				},
				colModel: [
					{name: 'id', hidden: true},
					{name: 'code', editable: false, search: true, _searchType: 'string'},
					{name: 'name', editable: true, search: true, _searchType: 'string'},
					{name: 'resName', editable: true, search: true, _searchType: 'string'},
					{name: 'descr', editable: true, search: true, _searchType: 'string', stype: 'select', searchoptions:{value: SYSTEM_MAP}}
				]
			});
		},

		addEdit: function(rowData) {
			var me = this;
			require(['app/oms/system/permission/edit-view'], function(EditView){
				var title = "新增记录";
				if(_.isObject(rowData)){
					title = "修改记录";
				}
				var editView = new EditView({
					systemList: SYSTEM_LIST,
					rowData : rowData
				}).render();
				var $dialog = Opf.Factory.createDialog(editView.$el, {
					destroyOnClose: true,
					autoOpen: true,
					modal: true,
					width: 600,
					height: 400,
					title: title,
					buttons: [
						{
							type: 'save',
							click: function(){
								editView.onSave(function(){
									$dialog.dialog('close');
									me.grid.trigger('reloadGrid', {current: true});
								});
							}
						},
						{type: 'cancel'}
					]
				})
			});
		}
	});
});