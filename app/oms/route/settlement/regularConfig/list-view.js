/**
 * Created by wupeiying on 2016/11/14.
 */
define([
	'jquery.jqGrid',
	'common-ui'
], function() {

	var tableCtTpl = [
		'<div class="row">',
		'<div class="col-xs-12 jgrid-container">',
		'<table id="settlement-regularConfig-grid-table"></table>',
		'<div id="settlement-regularConfig-grid-pager" ></div>',
		'</div>',
		'</div>'].join('');

	var ISCONTINUE_MAP = {
		0: '是',
		1: '否'
	};

	var View = Marionette.ItemView.extend({
		template: _.template(tableCtTpl),
		tabId: 'menu.route.settlement.regularConfig',
		events: {},

		onRender: function () {
			var me = this;
			_.defer(function () {
				me.renderGrid();
			});
		},

		onEditModel: function (obj) {
			var me = this, model = new Backbone.Model(obj);
			require(['app/oms/route/settlement/regularConfig/edit-view'], function (EditModelView) {
				var view = new EditModelView({ model: model, title: '修改-出款特定路由配置' });
				view.on('submit:success', function () {
					Opf.Toast.success('修改成功');
					me.grid.trigger('reloadGrid', {current: true});
				});
			});
		},
		//新增，需求要求条件组二个字段必填，则自动打开显示二个字段
		onAddModel: function () {
			var obj = {};
			obj.filedsets = JSON.parse('[[{"factor":"total_amt","opr":"gt","value":"","remark":""},' +
				'{"factor":"tx_time","opr":"gt","value":"","remark":""}]]');
			var me = this, model = new Backbone.Model(obj);
			require(['app/oms/route/settlement/regularConfig/add-view-extend'], function (AddModelView) {
				var view = new AddModelView({ model: model, title: '新增-出款特定路由配置' });
				view.on('submit:success', function () {
					Opf.Toast.success('新增成功');
					me.grid.trigger('reloadGrid', {current: true});
				});
			});
		},

		renderGrid: function () {
			var me = this;

			var grid = me.grid = App.Factory.createJqGrid({
				rsId: 'route.settlement.regularConfig',
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
					view: false
				},
				gid: 'settlement-regularConfig-grid',
				url: url._('route.settlement.regularConfig.list'),
				colNames: {
					id: '',
					basicModId: '出款通道名称Id',
					name: '出款通道名称',
					sourceCode: '业务来源',
					amountTotal: '累计日容量(万)',
					isContinue: '是否走普通路由',
					tradeChannelNo: '交易通道号'
				},
				colModel: [
					{name: 'id', hidden:true},
					{name: 'basicModId', hidden:true},
					{name: 'name'},
					{name: 'sourceCode'},
					{name: 'amountTotal'},
					{name: 'isContinue', hidden:true, formatter: isContinueFormatter},
					{name: 'tradeChannelNo'}
				],
				loadComplete: function () {}
			});

			return grid;
		}
	});

	//格式化转化
	function isContinueFormatter(val){
		return ISCONTINUE_MAP[val] || '';
	}

	App.on('route:settlement:regularConfig', function () {
		App.show(new View());
	});

	return View;
});