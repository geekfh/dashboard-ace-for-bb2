define(['App',
	'i18n!app/oms/common/nls/auth',
	'assets/scripts/fwk/component/simple-tree'
], function(App, authLang, SimpleTree) {

	App.module('AuthSysApp.Role.Edit', function(Edit, App, Backbone, Marionette, $, _) {

		Edit.View = Marionette.ItemView.extend({

			events: {
				'click .icon-to-add-auth' : function () {
					this.trigger('role:auth:add', this.roleId);
				}
			},

			initialize: function(options) {
				//this.el = options.el;
				this.roleId = options.roleId;
				this.data = options.data;
			},

			getAuthSectionTpl: function() {
				return [
					'<div class="auth-section col-xs-12">',
						'<div class="own-auth-caption">',
							'<b>拥有的权限</b>',
							'<i class="icon icon-plus icon-to-add-auth" style="margin-top: 2px; margin-left: 8px;"></i>',
						'</div>',
					'</div>'
				].join('');
			},

			//TODO to model
			convert: function(auths) {

				var handle = function(node) {
					var item = {
						name: node.text,
						isLeaf: node.isLeaf,
						id: node.id
					};

					if (!node.isLeaf) {
						item.type = 'folder';
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

				return ret;
			},

			onBeforeDelAuth: function() {
				//TODO not find every time
				Opf.UI.setLoading(this.$el.find('.auth-section'),true);
				// Opf.UI.spin(this.$el.find('.auth-section'),{});
			},

			onAfterDelAuth: function() {
				//TODO not find every time
				Opf.UI.setLoading(this.$el.find('.auth-section'),false);
				// Opf.UI.unSpin(this.$el.find('.auth-section'),{});
			},

			refresh: function (data) {
				this.data = data;
				this.renderTree();
			},

			renderTree: function() {
				var me = this;

				if(me.tree) {
					me.tree.destroy();
				}

				var treeData = me.convert(me.data.auths);

				me.tree = new SimpleTree({

					renderTo: me.$el.find('.auth-section'),
					data: treeData,
					expanded: true,
					selectable: false,
					events: {
						'click .icon-auth-remove': 'onAuthRemove',
						'click .icon-plus': 'onPlus'
					},

					onAuthRemove: function(ev) {
						var $target = $(ev.target);

						var $item = $target.closest('.tree-item');
						if (!$item.length) {
							$item = $target.closest('.tree-folder-header');
						}
						var itemData = $item.data();

						me.trigger('role:delete:auth', me.roleId, [itemData.id]);

					},

					onItemRender: function($item) {

						var delTpl = '<i class="icon-remove icon-auth-remove" ></i>';

						var $ct = $item;
						if ($item.hasClass('tree-folder')) {
							$ct = $item.find('.tree-folder-header');
						}
						$ct.append(delTpl);
					}
				});
			},

			//@override
			render: function() {
				var tpl = this.getAuthSectionTpl();

				this.$el.find('form').after(tpl);
				this.renderTree();
			}

		});

	});

	return App.AuthSysApp.Role.Edit.View;

});