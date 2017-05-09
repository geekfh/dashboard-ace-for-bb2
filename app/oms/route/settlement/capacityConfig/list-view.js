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
		'<table id="settlement-capacityConfig-grid-table"></table>',
		'<div id="settlement-capacityConfig-grid-pager" ></div>',
		'</div>',
		'</div>'].join('');

	var TRADERANGE_MAP = {
		0: '是',
		1: '否'
	};

	var View = Marionette.ItemView.extend({
		template: _.template(tableCtTpl),
		tabId: 'menu.route.settlement.capacityConfig',
		events: {},

		onRender: function () {
			var me = this;
			_.defer(function () {
				me.renderGrid();
			});
		},

		onEditModel: function (obj) {
			var me = this, model = new Backbone.Model(obj);
			require(['app/oms/route/settlement/capacityConfig/edit-view'], function (EditModelView) {
				var view = new EditModelView({ model: model, title: '修改-通道出款容量配置' });
				view.on('submit:success', function () {
					Opf.Toast.success('修改成功');
					me.grid.trigger('reloadGrid', {current: true});
				});
			});
		},
		//新增，需求要求条件组一个字段必填，则自动打开显示一个字段
		onAddModel: function () {
			var obj = {};
			obj.filedsets = JSON.parse('[[{"factor":"total_amt","opr":"gt","value":"","remark":""}]]');
			var me = this, model = new Backbone.Model(obj);
			require(['app/oms/route/settlement/capacityConfig/add-view-extend'], function (AddModelView) {
				var view = new AddModelView({ model: model, title: '新增-通道出款容量配置' });
				view.on('submit:success', function () {
					Opf.Toast.success('新增成功');
					me.grid.trigger('reloadGrid', {current: true});
				});
			});
		},

		renderGrid: function () {
			var me = this;

			var grid = me.grid = App.Factory.createJqGrid({
				rsId: 'route.settlement.capacityConfig',
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
				gid: 'settlement-capacityConfig-grid',
				url: url._('route.settlement.capacityConfig.list'),
				colNames: {
					id: '',
					basicModId: '通道modId',
					name: '通道名称',
					amountTotal: '累计日容量(万)',
					amountCount: '日累计笔数',
					singleCost: '单笔代付成本',
					tradeRange: '是否有交易区间',
					loaningCost: '垫资成本',
					priority: '优先级',
					limitId: '规则ID'
				},
				colModel: [
					{name: 'id', hidden:true},
					{name: 'basicModId', hidden:true},
					{name: 'name'},
					{name: 'amountTotal'},
					{name: 'amountCount'},
					{name: 'singleCost', hidden:true},
					{name: 'tradeRange', hidden:true, formatter: tradeRangeFormatter},
					{name: 'priority'},
					{name: 'loaningCost', hidden:true},
					{name: 'limitId', hidden:true}
				],
				loadComplete: function () {}
			});

			return grid;
		}
	});

	//格式化转化
	function tradeRangeFormatter(val){
		return TRADERANGE_MAP[val] || '';
	}

	App.on('route:settlement:capacityConfig', function () {
		App.show(new View());
	});

	return View;
});