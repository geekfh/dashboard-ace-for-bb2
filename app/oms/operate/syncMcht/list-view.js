/**
 * Created by wupeiying on 2016/11/11.
 */
define([
	'jquery.jqGrid',
	'common-ui'
], function() {

	var tableCtTpl = [
		'<div class="row">',
		'<div class="col-xs-12 jgrid-container">',
		'<table id="sync-mchtChannel-grid-table"></table>',
		'<div id="sync-mchtChannel-grid-pager" ></div>',
		'</div>',
		'</div>'].join('');

	var SYNCHMODEL_MAP = {
		1: '手动',
		2: '自动',
		3: '线下'
	};

	var STARTSTATUS_MAP = {
		1: '启用',
		2: '未启用'
	};

	var ISUPDATESYNCH_MAP = {
		1: '支持',
		2: '不支持'
	};

	var ISMATCHINGBUSINESS_MAP = {
		1: '匹配',
		2: '不匹配'
	};

	var SETTLEBANK_MAP = {
		1: '全部',
		2: '部分'
	};

	var PAYMENTMETHOD_MAP = {
		'all': '所有',
		'wechat': '微信',
		'alipay': '支付宝'
	};

	var View = Marionette.ItemView.extend({
		template: _.template(tableCtTpl),
		tabId: 'menu.operate.sync.mchtChannel',
		events: {},

		onRender: function () {
			var me = this;
			_.defer(function () {
				me.renderGrid();
			});
		},

		onEditModel: function (obj) {
			var me = this, model = new Backbone.Model(obj);
			require(['app/oms/operate/syncMcht/edit-view'], function (EditModelView) {
				var view = new EditModelView({ model: model, title: '修改' });
				view.on('submit:success', function () {
					Opf.Toast.success('修改成功');
					me.grid.trigger('reloadGrid', {current: true});
				});
			});
		},
		//新增，需求要求条件组一个字段必填，则自动打开显示一个字段
		onAddModel: function () {
			var obj = {};
			obj.filedsets = [[{"factor":"account_type","opr":"in","value":"","remark":""},
				{"factor":"mcht_term","opr":"in","value":"","remark":""},
				//{"factor":"sync_info","opr":"eq","value":"","remark":""},
				{"factor":"certflag","opr":"eq","value":"","remark":""}]];
			var me = this, model = new Backbone.Model(obj);
			require(['app/oms/operate/syncMcht/add-view-extend'], function (AddModelView) {
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
				rsId: 'operate.sync.mchtChannel',
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
					width: 100,
					view: false,
					extraButtons: [
						{
							name: 'updateStatus', icon: 'icon-lock', title: '修改状态', caption: '',
							click: function (name, opts, rowData) {
								updateStatusBtn(rowData, grid);
							}
						}
					],
					canButtonRender: function (name, options, rowData) {
						var status = rowData.startStatus;
						if(status == 1){
							options.colModel.extraButtons[0].icon = 'icon-unlock';
						}
						else{
							options.colModel.extraButtons[0].icon = 'icon-lock';
						}

					}
				},
				gid: 'sync-mchtChannel-grid',
				url: url._('operate.sync.mchtChannel.list'),
				colNames: {
					id: '',
					channelNo: '通道编码',
					channelNm: '通道名称',
					status: '状态',
					synchModel: '同步模式',//（1.手动 2.自动）
					startStatus: '启用状态',//（1.启用 2.未启用）
					isUpdateSynch: '修改同步',//是否匹配（1.支持 2.不支持）
					isMatchingBusiness: '经营类目',//是否匹配（1.匹配 2.不匹配）
					isZbankCode: '是否匹配开户行',//（1.匹配 2.不匹配）
					paymentMethod: '同步业务',
					settleBank: '结算银行',//支持的(1.全部 2.部分)
					channelMaintainTimeStart: '开始时间',//通道维护
					channelMaintainTimeEnd: '结束时间',
					remark: '备注'
				},
				colModel: [
					{name: 'id', hidden:true},
					{name: 'channelNo'},
					{name: 'channelNm'},
					{name: 'status', hidden:true},
					{name: 'synchModel', formatter: synchModelFormatter},
					{name: 'startStatus', formatter: startStatusFormatter},
					{name: 'isUpdateSynch', formatter: isUpdateSynchFormatter},
					{name: 'isMatchingBusiness', formatter: isMatchingBusinessFormatter},
					{name: 'isZbankCode', formatter: isMatchingBusinessFormatter},
					{name: 'paymentMethod', formatter: paymentMethodFormatter},
					{name: 'settleBank', formatter: settleBankFormatter},
					{name: 'channelMaintainTimeStart'},
					{name: 'channelMaintainTimeEnd'},
					{name: 'remark'}
				],
				loadComplete: function () {}
			});

			//me.updateStatusBtn(grid);

			return grid;
		}

	});

	function updateStatusBtn(rowData, grid) {
		var s = rowData.startStatus == 1 ? 2 : 1;
		s = STARTSTATUS_MAP[s];
		Opf.confirm('您确定更改为 "' + s + '" 吗？<br>', function (result) {
			if(result){
				Opf.ajax({
					type: 'PUT',
					url: url._('operate.sync.mchtChannel.updateStatus', {id: rowData.id}),
					success: function (resp) {
						if(resp.success){
							Opf.Toast.success('操作成功');
						}
						else{
							Opf.Toast.error('操作失败');
						}
						grid.trigger('reloadGrid', {current: true});
					}
				});
			}

		});

		// var html = _.template([
		// 	'<form onsubmit="return false;" >',
		// 	'<table width="100%" cellspacing="0" cellpadding="0" border="0">',
		// 	'<tbody>',
		// 	'<tr class="FormData">',
		// 	'<td class="CaptionTD" style="padding-right:10px;">启用状态:</td>',
		// 	'<td class="DataTD">&nbsp;',
		// 	'<select role="select" name="s0State" class="FormElement ui-widget-content ui-corner-all">',
		// 	'<option value="1" <%=rowData.startStatus == 1 ? "selected" : "" %>>启用</option>',
		// 	'<option value="2" <%=rowData.startStatus == 2 ? "selected" : "" %>>未启用</option>',
		// 	'</select>',
		// 	'</td>',
		// 	'</tr>',
		// 	'</tbody>',
		// 	'</table>',
		// 	'</form>'
		// ].join(''));
		// var $dialog = Opf.Factory.createDialog(html({rowData:rowData}), {
		// 	destroyOnClose: true,
		// 	title: '修改状态',
		// 	autoOpen: true,
		// 	width: 200,
		// 	modal: true,
		// 	buttons: [{
		// 		type: 'submit',
		// 		text: '确定',
		// 		click: function () {
		//
		// 		}
		// 	}, {
		// 		type: 'cancel'
		// 	}],
		// 	create: function() {
		//
		// 	}
		// });
	}

	function synchModelFormatter(val){
		return SYNCHMODEL_MAP[val] || '';
	}

	function startStatusFormatter(val){
		return STARTSTATUS_MAP[val] || '';
	}

	function isUpdateSynchFormatter(val){
		return ISUPDATESYNCH_MAP[val] || '';
	}

	function isMatchingBusinessFormatter(val){
		return ISMATCHINGBUSINESS_MAP[val] || '';
	}

	function settleBankFormatter(val){
		return SETTLEBANK_MAP[val] || '';
	}

	function paymentMethodFormatter(val){
		return PAYMENTMETHOD_MAP[val] || '';
	}

	App.on('operate:sync:mchtChannel', function () {
		App.show(new View());
	});

	return View;
});