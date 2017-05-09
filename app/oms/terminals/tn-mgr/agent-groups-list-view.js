/**
 * Created by zhuyimin on 2015/1/8.
 */
/**
 * 展示代理列表*/

/**
 * PageView 实现 翻页功能
 * AgentGroupView会根据用户点击加载数据，已经加载过的就不再加载
 * */

define(['tpl!app/oms/terminals/tn-mgr/templates/agents-list.tpl',
		'tpl!app/oms/terminals/tn-mgr/templates/agent.tpl',
		'tpl!app/oms/terminals/tn-mgr/templates/pager.tpl',
		'app/oms/terminals/tn-mgr/child-agent-list-view'
], function (listTpl,itemTpl,pageTpl,BranchesView) {

	"use strict";

	//分页栏的view，它调用 分页 collection 的API
	var PageView = Marionette.ItemView.extend({
		template: pageTpl,

		ui: {
			inputRedirect: '[name="redirectTo"]',
			isFirstPage: '.btn-first',
			isPrevious: '.btn-previous',
			hasNextPage: '.btn-next',
			isLastPage: '.btn-last'
		},

		events: {
			'click .btn-first': function(e) {
				if(this.ui.isFirstPage.parent().hasClass('disabled')){
					return false;
				}
				this.collection.getFirstPage();
				this.ui.inputRedirect.val(1);

				this.ui.isFirstPage.parent().addClass('disabled');//点最前一页，隐藏当前按钮

				this.ui.isPrevious.parent().addClass('disabled');//点最前一页，隐藏前一页按钮
				//后一页按钮亮起
				this.ui.hasNextPage.parent().removeClass('disabled');
				this.ui.isLastPage.parent().removeClass('disabled');
			},
			'click .btn-previous': function(e) {
				if(this.ui.isPrevious.parent().hasClass('disabled')){
					return false;
				}

				var state = this.collection.state;
				var cPage = state.currentPage;
				this.collection.getPreviousPage();
				this.ui.inputRedirect.val(cPage);

				//如果为第一页，隐藏前一页按钮
				if(cPage == 1){
					this.ui.isFirstPage.parent().addClass('disabled');
					this.ui.isPrevious.parent().addClass('disabled');
				}
				//后一页按钮亮起
				this.ui.hasNextPage.parent().removeClass('disabled');
				this.ui.isLastPage.parent().removeClass('disabled');
			},
			'click .btn-next': function(e) {
				if(this.ui.hasNextPage.parent().hasClass('disabled')){
					return false;
				}

				var state = this.collection.state;
				var cPage = state.currentPage + 2;
				this.collection.getNextPage({ fetch: true });
				this.ui.inputRedirect.val(cPage);

				//翻到最后一页，隐藏后一页按钮
				if(cPage == state.totalPages){
					this.ui.hasNextPage.parent().addClass('disabled');
					this.ui.isLastPage.parent().addClass('disabled');
				}
				//前一页按钮亮起
				this.ui.isFirstPage.parent().removeClass('disabled');
				this.ui.isPrevious.parent().removeClass('disabled');

			},
			'click .btn-last': function(e) {
				if(this.ui.isLastPage.parent().hasClass('disabled')){
					return false;
				}

				var state = this.collection.state;
				var cPage = state.currentPage + 2;
				this.collection.getLastPage();
				this.ui.inputRedirect.val(cPage);

				this.ui.hasNextPage.parent().addClass('disabled');
				this.ui.isLastPage.parent().addClass('disabled');
				//前一页按钮亮起
				this.ui.isFirstPage.parent().removeClass('disabled');
				this.ui.isPrevious.parent().removeClass('disabled');
			},
			'change [name="redirectTo"]': function (e) {
				var to = $(e.target).val();
				var state = this.collection.state;
				var totalPages = state.totalPages;

				if(totalPages && to < 0) {
					$(e.target).val(1);
					this.collection.getFirstPage();

					this.ui.isFirstPage.parent().addClass('disabled');//点最前一页，隐藏当前按钮
					this.ui.isPrevious.parent().addClass('disabled');//点最前一页，隐藏前一页按钮
					//后一页按钮亮起
					this.ui.hasNextPage.parent().removeClass('disabled');
					this.ui.isLastPage.parent().removeClass('disabled');
				}
				else if(totalPages && to > totalPages) {
					this.collection.getLastPage();
					$(e.target).val(totalPages);

					this.ui.hasNextPage.parent().addClass('disabled');
					this.ui.isLastPage.parent().addClass('disabled');
					//前一页按钮亮起
					this.ui.isFirstPage.parent().removeClass('disabled');
					this.ui.isPrevious.parent().removeClass('disabled');
				}
				else if(to > 0 && state.totalPages && to <= state.totalPages) {
					this.collection.getPage(to - 1);

					if(to >= totalPages){//超出页面范围
						this.ui.isFirstPage.parent().removeClass('disabled');
						this.ui.isPrevious.parent().removeClass('disabled');
						this.ui.hasNextPage.parent().addClass('disabled');
						this.ui.isLastPage.parent().addClass('disabled');
					}
					else if(to > 1 && to < totalPages){//之间
						this.ui.hasNextPage.parent().removeClass('disabled');
						this.ui.isLastPage.parent().removeClass('disabled');
						this.ui.isFirstPage.parent().removeClass('disabled');
						this.ui.isPrevious.parent().removeClass('disabled');
					}
					else{//最前页
						this.ui.hasNextPage.parent().removeClass('disabled');
						this.ui.isLastPage.parent().removeClass('disabled');
						this.ui.isFirstPage.parent().addClass('disabled');
						this.ui.isPrevious.parent().addClass('disabled');
					}

				}
			}
		},

		initialize: function (options) {
			var me = this;
			options = options || {};

			this.options = options;
			this.collection = options.collection;

			if(this.collection.length) {
				me.render();
			}
			else {
				this.collection.on('sync', function (collection) {
					if(collection instanceof Backbone.Collection) {
						me.render();
					}
				});
			}
		},

		serializeData: function () {
			return {state: this.collection.state};
		},

		onRender: function () {
			var me = this;
			this.options.renderTo && this.$el.appendTo(this.options.renderTo);
			_.once(function () {
				me.ui.inputRedirect.inputmask('numeric', {
					autoUnmask: true,
					allowMinus: false
				});
			});
		}
	});

	var AgentGroupView = Marionette.ItemView.extend({
		template: itemTpl,
		className: 'agent-group',
		ui: {
			'branchesContainer' : '.fields-ct'
		},
		events: {
			'click .panel-heading': 'onClickHead'
		},

		templateHelpers: function(){
			var model = this.model;
			return {
				termUsedTotal: model.get('termUsedTotal') || '0',
				termBoundTotal: model.get('termBoundTotal') || '0'
			};
		},

		initialize: function () {
			var ChildAgentsCollection = Backbone.Collection.extend({
				url: url._('mcht.terminals.agent.nopage',{brhCode: this.model.get('brhNo')})
			});
			this.childAgentsCollection = new ChildAgentsCollection();
		},

		onClickHead: function (event) {
			var $head = $(event.currentTarget);

			// 动态添加class
			!$head.hasClass('active')? $head.addClass('active'):$head.removeClass('active');

			//展开/正在获取数据/已经创建view 则不做任何操作
			// 闭合的 class="collapsed"
			if(!$head.hasClass('collapsed') || this.fetchingFlag || this.childAgentsView){
				return;
			}

			this.renderChildAgnetsView();
		},

		renderChildAgnetsView: function () {
			var me = this;
			this.fetchingFlag = true;

			this.childAgentsCollection.fetch().done(function () {

				this.fetchingFlag = false;

				me.childAgentsView = new BranchesView({
					collection: me.childAgentsCollection,
					renderTo: me.ui.branchesContainer,
					//上级机构号
					upperBrh: me.model.get('brhNo')
				});

				//点击某个子机构，会触发brh:tn:detail
				me.childAgentsView.on('brh:tn:detail',function(options){
					me.trigger('brh:tn:detail',{brhNo: options.brhNo});
				});
			});
		}
	});

	var AgentGroupListView = Marionette.CompositeView.extend({
		template: listTpl,
		childView: AgentGroupView,
		childViewContainer: '.agent-list-container',
		ui: {
			footer: '.message-footer'
		},

		onChildviewBrhTnDetail: function(childview,options){
			this.trigger('brh:tn:detail',{brhNo: options.brhNo});
		},

		initialize: function(options){
			this.options = options;
			this.render();
		},

		onRender: function () {
			var me = this;

			me.pageView = new PageView({
				renderTo: me.ui.footer,
				collection: me.collection
			});

			if(me.options.renderTo){
				me.$el.appendTo(me.options.renderTo);
			}

		}
	});

	return AgentGroupListView;
});