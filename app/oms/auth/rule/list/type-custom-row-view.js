define(['App',
	'i18n!app/oms/common/nls/auth',
	'tpl!app/oms/auth/rule/list/templates/type-custom-row.tpl',
	'jstree'
], function(App, authLang, tpl) {

	App.module('AuthSysApp.Rule.List.View', function(View, App, Backbone, Marionette, $, _) {

		View.TypCustomRow = Marionette.ItemView.extend({

			template: tpl,

			events: {

			},

			initialize: function (orgsData, oprsData, ownerView) {
				this.orgsData = orgsData;
				this.oprsData = oprsData;

				this.ownerView = ownerView;

				this.render();

				this._bindEvents(ownerView);
			},

			_bindEvents: function () {
				//编辑、增加表单都跟jqgrid (list-viuew)绑定一起，这里监听list-view
				//在submit事件里面把树部分的数据塞进去
				this.ownerView && this.ownerView.off('submit').on('submit', this._onFormSubmit, this);
			},

			_onFormSubmit: function (params, postdata) {
				var me = this;
				var elems = [];
				var selOrgIds = this.orgTree.jstree('get_selected');
				var selExpIds = this.expandTree.jstree('get_selected');

                if(selOrgIds.length || selExpIds.length){
                   
					_.each(selOrgIds, function (id) {
						elems.push({
							type: 0,
							value: me.orgTree.jstree('get_node',id).original.code,
							descr:''
						});
					});
					_.each(selExpIds, function (id) {
						elems.push({
							type: 1,
							value: id.replace('exp',''),
							descr:''
						});
					});

					postdata.elems = elems;
                }
			},

			destroy: function () {
				this._detachEvents();

				this.orgTree.jstree('destroy');
				this.expandTree.jstree('destroy');

				this.$el.remove();
			},

			_detachEvents: function () {
				this.ownerView && this.ownerView.off('submit');
			},

			render: function () {
				var me = this;

				this.$el = $(this.template({
					branchLabel : authLang._('rule.branchsel.label'),
					oprLabel    : authLang._('rule.oprsel.label')
				}));

				var orgTree = this.$el.find('.org-tree').jstree({
					'plugins': ["wholerow", "checkbox"],
					'core': {
						themes: {
							dots: true,
							icons: false
						},
						data: me.orgsData
					}
				});
				orgTree.bind('loaded.jstree', function() {
					$(this).jstree("open_all");
				});
				setTimeout(function () {
					orgTree.data('jstree').show_dots();
				},1);

				me.orgTree = orgTree;

				var expandTree = this.$el.find('.opr-tree').jstree({
					'plugins': ["wholerow", "checkbox"],
					'core': {
						themes: {
							dots: true,
							icons: false
						},
						data: me.oprsData
					}
				});
				expandTree.bind('loaded.jstree', function() {
					$(this).jstree("open_all");
				});
				setTimeout(function () {
					expandTree.data('jstree').show_dots();
				},1);

				me.expandTree = expandTree;
			}


		});

	});

	return App.AuthSysApp.Rule.List.View.TypCustomRow;

});