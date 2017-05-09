define(['App',
	'i18n!app/oms/common/nls/auth'
], function(App, authLang) {

	App.module('AuthSysApp.Role.View', function(View, App, Backbone, Marionette, $, _) {

		View.AddAuth = Marionette.ItemView.extend({
			tagName: 'form',
			template: _.template('<div class="tree"></div>'),

			events: {
			},

			initialize: function (data) {

				this._data = data;
			},

			setLoading: function (toggle) {
				Opf.UI.setLoading(this.$el,toggle);
			},

			//TODO move out
			convert: function(auths) {

				var handle = function(node) {
					var item = {
						text: node.text,
						name: node.text,
						isLeaf: node.isLeaf,
						id: node.id
					};

					if (!node.isLeaf) {
						item.type = 'folder';
						item.state = 'opened';

						_.each(node.children || [], function(child) {
							var itemChildren = item.children || (item.children = []);
							itemChildren.push(handle(child));
						});

					} else {
						item.type = 'item';
					}

					return item;
				};

				var ret = [];
				_.each(auths, function(node) {
					ret.push(handle(node));
				});
				console.info('convert to jstree data', ret);
				return ret;
			},

			onRender: function() {
				var me = this;
				var $form = $('<form><div class="tree"></div></form>');

				var addAuthDialog = Opf.Factory.createDialog(this.el, {
					modal: true,
					height: 400,
					minHeight: 400,
					width: 400,
					//TODO i18n
					title: '添加权限',
					appendTo: document.body,
					buttons: [{
						//TODO i18n
						text: '提交',
						click: function() {
							var ids = tree.jstree('get_selected');
							//TODO provide jstree.getSelctedItems method
							ids = _.filter(ids, function (id) {
								return id.split(/:/).length > 2;
							});
							//TODO need a better way
							// var selId = Utils.jqGrid.getLastSelRowId(grid);
							me.trigger('submit', me._data.id, ids);

						}
					}]
				});

				var tree = this.$el.find('.tree').jstree({
					'plugins': ["wholerow", "checkbox"],
					'core': {
						themes: {
							dots: true,
							icons: false
						},
						data: me.convert(me._data.auths)
					}
				});

				tree.bind('loaded.jstree', function() {
					$(this).jstree("open_all");
				});

				tree.data('jstree').show_dots();

			}

		});

	});

	return App.AuthSysApp.Role.View.AddAuth;

});

