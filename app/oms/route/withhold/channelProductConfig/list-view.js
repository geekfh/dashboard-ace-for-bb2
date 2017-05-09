/**
 * Created by liliu on 2017/2/16.
 */
define([
	'jquery.jqGrid',
	'common-ui'
], function() {

	var tableCtTpl = [
		'<div class="row">',
		'<div class="col-xs-12 jgrid-container">',
		'<table id="withhold-channelProductConfig-grid-table"></table>',
		'<div id="withhold-channelProductConfig-grid-pager" ></div>',
		'</div>',
		'</div>'].join('');

	var STATUS_MAP = {
		0: '启用',
		1: '禁用'
	};

	var View = Marionette.ItemView.extend({
		template: _.template(tableCtTpl),
		tabId: 'menu.route.withhold.channelProductConfig',
		events: {},

		onRender: function () {
			var me = this;
			_.defer(function () {
				me.renderGrid();
			});
		},

		onEditModel: function (obj) {
			obj._from = "channelProduct";
			var me = this, model = new Backbone.Model(obj);
			require(['app/oms/route/withhold/channelProductConfig/edit-view'], function (EditModelView) {
				var view = new EditModelView({ model: model, title: '修改' });
				view.on('submit:success', function () {
					Opf.Toast.success('修改成功');
					me.grid.trigger('reloadGrid', {current: true});
				});
			});
		},
		//新增，需求要求条件组字段必填
		onAddModel: function () {
			var obj = {};
			obj.filedsets = JSON.parse(['[[{"factor":"card_bank","opr":"in","value":"","remark":""},' ,
				'{"factor":"amount","opr":"eq","value":"","remark":""},' ,
				'{"factor":"service_type","opr":"in","value":"","remark":""},' ,
				'{"factor":"tx_time","opr":"gt","value":""},',
				'{"factor":"card_type","opr":"in","value":""}]]'].join(''));
			obj._from = "channelProduct";
			var me = this, model = new Backbone.Model(obj);
			require(['app/oms/route/withhold/channelProductConfig/add-view-extend'], function (AddModelView) {
				var view = new AddModelView({ model: model, title: '新增' });
				view.on('submit:success', function () {
					Opf.Toast.success('新增成功');
					me.grid.trigger('reloadGrid', {current: true});
				});
			});
		},

		renderGrid: function () {
			var me = this;

			var grid = me.grid = App.Factory.createJqGrid({
				rsId: 'route.withhold.channelProductConfig',
				caption: '',
				nav: {
					actions: {
						search: false,
						addfunc: function () {
							me.onAddModel();
						},
						editfunc: function (id) {
							me.onEditModel(me.grid._getRecordByRowId(id));
						}
					}
				},
				actionsCol: {
					width: 120,
					extraButtons: [
						{name: 'changestate', icon:'icon-opf-state-change', title: '启用状态更改',
							click: function (name, opts, rowData) {
								showChangeStateDialog(me, rowData);
							}
						}
					]
				},
				gid: 'withhold-channelProductConfig-grid',
				url: url._('route.channelProduct.list'),
				colNames: {
					id: '',
					name: '通道产品名称',
					channel_name_cn: '选择通道',
					status: '启动状态',// 0:启用  1:禁用
					remark: '备注'
				},
				colModel: [
					{name: 'id', hidden:true},
					{name: 'name'},
					{name: 'channel_name_cn'},
					{name: 'status', formatter: function (val) { return STATUS_MAP[val] || ''; } },
					{name: 'remark'}
				],
				loadComplete: function () {}
			});

			return grid;
		}
	});
	function stateFormTpl() {
		return [
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
									url: url._('route.channelProduct.upd-status', {id: rowData.id}),
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
	App.on('route:withhold:channelProductConfig', function () {
		App.show(new View());
	});

	return View;
});