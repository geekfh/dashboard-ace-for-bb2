/**
 * Created by wupeiying on 2016/11/10.
 */
define([
	'jquery.jqGrid',
	'common-ui'
], function() {

	var tableCtTpl = [
		'<div class="row">',
		'<div class="col-xs-12 jgrid-container">',
		'<table id="settlement-channelConfig-grid-table"></table>',
		'<div id="settlement-channelConfig-grid-pager" ></div>',
		'</div>',
		'</div>'].join('');

	var STATUS_MAP = {
		0: '启用',
		1: '暂停',
		2: '无效'
	};

	var View = Marionette.ItemView.extend({
		template: _.template(tableCtTpl),
		tabId: 'menu.route.settlement.channelConfig',
		events: {},

		onRender: function () {
			var me = this;
			_.defer(function () {
				me.renderGrid();
			});
		},

		onEditModel: function (obj) {
			var me = this, model = new Backbone.Model(obj);
			require(['app/oms/route/settlement/channelConfig/edit-view'], function (EditModelView) {
				var view = new EditModelView({ model: model, title: '修改-出款通道配置' });
				view.on('submit:success', function () {
					Opf.Toast.success('修改成功');
					me.grid.trigger('reloadGrid', {current: true});
				});
			});
		},
		//新增，需求要求条件组三个字段必填，则自动打开显示三个字段
		onAddModel: function () {
			var obj = {};
			obj.filedsets = JSON.parse('[[{"factor":"amount","opr":"eq","value":"","remark":""},'+
				'{"factor":"tx_time","opr":"gt","value":"","remark":""},'+
				'{"factor":"account_type","opr":"in","value":"1,2","remark":"对公,对私"}]]');
			var me = this, model = new Backbone.Model(obj);
			require(['app/oms/route/settlement/channelConfig/add-view-extend'], function (AddModelView) {
				var view = new AddModelView({ model: model, title: '新增-出款通道配置' });
				view.on('submit:success', function () {
					Opf.Toast.success('新增成功');
					me.grid.trigger('reloadGrid', {current: true});
				});
			});
		},

		renderGrid: function () {
			var me = this;

			var grid = me.grid = App.Factory.createJqGrid({
				rsId: 'route.settlement.channelConfig',
				caption: '',
				nav: {
					actions: {
						search: false,
						addfunc: function (id) {
							me.onAddModel();
						},
						editfunc: function (id) {
							me.onEditModel(me.grid._getRecordByRowId(id));
						}
					}
				},
				actionsCol: {
					view: false
				},
				gid: 'settlement-channelConfig-grid',
				url: url._('route.settlement.channelConfig.list'),
				colNames: {
					id:'',
					name: '通道名称',
					validity: ' 有效期',
					status: '状态',
					account: '网银账号',
					basicModId: 'baseId'
				},
				colModel: [
					{name: 'id', hidden:true},
					{name: 'name'},
					{name: 'validity'},
					{name: 'status', formatter: statusFormatter},
					{name: 'account'},
					{name: 'basicModId', hidden:true}
				],
				loadComplete: function () {}
			});

			return grid;
		}
	});

	//格式化转化
	function statusFormatter(val){
		return STATUS_MAP[val] || '';
	}

	App.on('route:settlement:channelConfig', function () {
		App.show(new View());
	});

	return View;
});