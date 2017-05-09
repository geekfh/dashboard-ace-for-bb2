/**
 * Created by wupeiying on 2016/12/2.
 */

define(['App',
	//'tpl!app/oms/account/adjustAccount/record/adjustTemplate.tpl',
	'jquery.jqGrid',
	'jquery.validate'
], function(App) {

	var tableCtTpl = [
		'<div class="row">',
		'<div class="col-xs-12 jgrid-container">',
		'<table id="changeState-view-grid-table"></table>',
		'<div id="changeState-view-grid-pager" ></div>',
		'</div>',
		'</div>'].join('');

	var View = Marionette.ItemView.extend({
		template: _.template(tableCtTpl),
		tabId: 'menu.changeStateView.management',
		events: {},

		onRender: function () {
			var me = this;
			_.defer(function () {
				me.renderGrid();
			});
		},
		showDialog: function(){
			Opf.Factory.createDialog(this.$el, {
				dialogClass: 'ui-jqdialog',
				open: true,
				destroyOnClose: true,
				width: 800,
				height: 500,
				modal: true,
				title: '查看状态变更记录',
				buttons: [{
					type: 'cancel',
					text: '关闭'
				}]
			});
			$('.ui-jqdialog-content').attr("style","overflow-x:hidden!important;");
		},
		renderGrid: function () {
			var me = this;
			var grid = App.Factory.createJqGrid({
				rsId: 'changeStateView',
				caption: '',
				nav: {
					actions: {
						search: false,
						add: false
					}
				},
				actionsCol: {
					view: false,
					edit: false,
					del: false
				},
				gid: 'changeState-view-grid',
				url: url._(me.options.url, {id: me.options.mchtId}),//'mcht.changeStateView'
				colNames: {
					id: '',
					entrance: '入口',
					remark: '备注',
					oprName: '操作人',
					oprTime: '操作时间'
				},
				colModel: [
					{name: 'id', hidden: true},
					{name: 'entrance'},
					{name: 'remark'},
					{name: 'oprName'},
					{name: 'oprTime', formatter: dateFormatter}
				],
				loadComplete: function () {}
			});

			return grid;
		}
	});

	function dateFormatter(val) {
		return val ? moment(val, 'YYYYMMDDHHmm').format('YYYY/MM/DD HH:mm') : '';
	}
	return View;
});