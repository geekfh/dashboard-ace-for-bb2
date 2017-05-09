/**
 * Created by zhuyimin on 2015/1/8.
 */
/**
 * 初始化agents和terminals两个view
 * 控制agents与terminals两个view之间的切换*/

define([
	'app/oms/common/store/AgentsStore',
	'app/oms/terminals/tn-mgr/agent-groups-list-view',
	'app/oms/terminals/tn-mgr/terminals-list-view'
], function (AgentsStore, AgentsView, TerminalsView) {

	"use strict";
	var View = Marionette.ItemView.extend({
		tabId: 'menu.terminals.mgr.new',

		template: _.template('<div class="terminals-container"></div>'),

		ui: {
			container : '.terminals-container'
		},

		initialize: function () {
			var me = this;
			me.layersMgr = new Opf.LayersMgr();
			this.agentsStore = new AgentsStore([], {brhCode: Ctx.getBrhCode()});
		},

		onRender: function(){
			var me = this;

			this.agentsStore.fetch().done(function () {
				me.renderAgentGroupsView();
			});
		},

		renderAgentGroupsView: function () {
			var me = this;

			me.agentGroupsView = new AgentsView({
				collection: me.agentsStore,
				renderTo: me.ui.container
			});

			me.layersMgr.bringToFront(me.agentGroupsView);

			/**
			 * 点击了某个下级机构，跳转到这个下级机构的 terminals 列表
			 * options:{brhNo:xx}
			 */

			me.agentGroupsView.on('brh:tn:detail', function (options) {
				//新建 terminals view
				//要传入 termUserd ，挂属机构号
				var terminalsView = me.terminalsView = new TerminalsView({
					termUsed: options.brhNo,
					renderTo: me.ui.container
				});

				//把terminals view 放进 layersMgr
				me.layersMgr.bringToFront(terminalsView);
			});
		}
	});

	App.on('show:agent:groups', function () {
		App.show(new View());
	});
	return View;
});