define([
	'jquery.jqGrid',
	'common-ui'
], function() {

	var tableCtTpl = [
		'<div class="row">',
			'<div class="col-xs-12 jgrid-container">',
				'<table id="route-productConfig-grid-table"></table>',
				'<div id="route-productConfig-grid-pager"></div>',
			'</div>',
		'</div>'
	].join('');

	var STATUS = {
		'0': '启用',
		'1': '禁用'
	};
	var CMD_TYPE = {
		'51': '代扣',
		'52': '银行卡验证',
		'53': '身份证验证'
	};
	var View = Marionette.ItemView.extend({
		tabId: 'menu.route.withhold.productConfig',
		template: _.template(tableCtTpl),
		onRender: function() {
			var me = this;

			_.defer(function () {
				me.renderGrid();
			});
		},

		onEditModel: function (obj) {
			var me = this, model = new Backbone.Model(obj);
			require(['app/oms/route/withhold/productConfig/edit-product-model-view'], function (EditModelView) {
				var view = new EditModelView({ model: model, title: '修改产品模型', ajaxOptions: {url: url._('route.product'), type: 'PUT'}});

				view.on('submit:success', function () {
					Opf.Toast.success('提交成功');
					me.grid.trigger('reloadGrid', {current: true});
				});
			});
		},

		// 查看通道模型
		onViewModel: function (obj) {
			var model = new Backbone.Model(obj);
			require(['app/oms/route/withhold/productConfig/edit-product-model-view'], function (ModelView) {
				new ModelView({ model: model, title: '查看产品模型' , ajaxOptions: {url: url._('route.product'), type: 'GET'}});
			});
		},

		onAddModel: function () {
			var me = this;
			require(['app/oms/route/withhold/productConfig/edit-product-model-view'], function (AddModelView) {
				var view = new AddModelView({title: '修改产品模型', ajaxOptions: {url: url._('route.product'), type: 'POST'}});
				view.on('submit:success', function () {
					Opf.Toast.success('提交成功');
					me.grid.trigger('reloadGrid', {current: true});
				});
			});
		},

		renderGrid: function() {
			var me = this;
			var grid = me.grid = App.Factory.createJqGrid({
				rsId:'route.productConfig.grid',
				caption: '产品模型配置',
				actionsCol: {
					width: 120,
					extraButtons:[
						{name: 'changestate', icon:'icon-opf-state-change', title: '启用状态更改',
						click: function (name, opts, rowData) {
						    showChangeStateDialog(me, rowData);
						}}
					]
				},
				nav: {
					actions:{
						editfunc: function (id) {
							me.onEditModel(me.grid._getRecordByRowId(id));
						},
						addfunc: function () {
							me.onAddModel();
						},
						viewfunc: function (id) {
							me.onViewModel(me.grid._getRecordByRowId(id));
						}
					}
				},
				gid: 'route-productConfig-grid',
				url: url._('route.product'),
				colNames: {
					id: '',
					appType: '产品编码',
					name: '产品名称',
					status: '启用状态',
					cmdType: '支持交易类型'
				},
				colModel: [
					{name: 'id', hidden:true},
					{name: 'appType', editable:true},
					{name: 'name', editable:true, search: true, searchoptions:{sopt:[ 'eq', 'ne', 'lk', 'nlk']}},
					{name: 'status', formatter: statusFormatter, editable:true, edittype: 'select', editoptions: {value: STATUS},
						search: true, stype: 'select', searchoptions:{
						value: STATUS,
						sopt:[ 'eq', 'ne']
					}},
					{name: 'cmdType', formatter: cmdTypeFormatter}
				]
			});
		}
	});
	function stateFormTpl() {
		var str = [
			'<form onsubmit="return false;" >',
			'<table width="100%" cellspacing="0" cellpadding="0" border="0">',
			'<tbody>',
			'<tr class="FormData">',
			'<td class="CaptionTD" style="padding-right:10px;">状态变更:</td>',
			'<td class="DataTD">',
			'&nbsp;',
			'<select role="select" name="state" class="FormElement ui-widget-content ui-corner-all">',
			'<option value="0">启用</option>',
			'<option value="1">禁用</option>',
			'</select>',
			'</td>',
			'</tr>',
			'</tbody>',
			'</table>',
			'</form>'
		].join('');

		return str;
	}
	function showChangeStateDialog(me, rowData) {
		var $dialog = Opf.Factory.createDialog(stateFormTpl(), {
			destroyOnClose: true,
			title: '状态变更',
			autoOpen: true,
			width: Opf.Config._('ui', 'terminalsMgr.grid.changestate.form.width'),
			height: Opf.Config._('ui', 'terminalsMgr.grid.changestate.form.height'),
			modal: true,
			buttons: [{
				type: 'submit',
				click: function () {
					var $state = $(this).find('[name="state"]');
					var oldState = rowData.status;
					var newState = $state.val();
					var selSateTxt = $state.find('option:selected').text();
					if (oldState != newState) {
						Opf.confirm('您确定更改状态为 "' + selSateTxt + '" 吗？<br><br> ', function (result) {
							if (result) {
								//TODO block target
								Opf.ajax({
									type: 'PUT',
									jsonData: {
										oldStatus: oldState,
										newStatus: newState
									},
									url: url._('route.product.upd-status', {id: rowData.id}),
									successMsg: '更改状态成功',
									success: function () {
										me.grid.trigger('reloadGrid', {current: true});
									},
									complete: function () {
										$dialog.dialog('close');
									}
								});
							}
						});
					} else {
						$(this).dialog('close');
					}
				}
			}, {
				type: 'cancel'
			}],
			create: function () {
				$(this).find('[name="state"]').val(rowData.status);
			}
		});
	}
	function statusFormatter(val){
		return STATUS[val] || '';
	}
	function cmdTypeFormatter(val){
		return CMD_TYPE[val] || '';
	}

	App.on('route:withhold:productConfig', function () {
		App.show(new View());
	});

	return View;

});
