/*
 * Fuel UX Tree
 * https://github.com/ExactTarget/fuelux
 *
 * Copyright (c) 2012 ExactTarget
 * Licensed under the MIT license.
 */

(function($ , undefined) {

	//var $ = require('jquery');


	// TREE CONSTRUCTOR AND PROTOTYPE

	var Tree = function (element, options) {
		this.$el = $(element);
		this.options = $.extend({}, $.fn.tree.defaults, options);

		// this.$el.on('click', '.tree-item', $.proxy( function(ev) { this.selectItem(ev.currentTarget); } ,this));
		// this.$el.on('click', '.tree-folder-header', $.proxy( function(ev) { this.selectFolder(ev.currentTarget); }, this));

		this.$el.on('click', '.tree-item', $.proxy( function(ev) { this.selectItem(ev.currentTarget); } ,this));

		var toggleTrigger = '.' + this.options['open-icon'] + ',.' + this.options['close-icon'];

		this.$el.on('click', toggleTrigger, $.proxy( function(ev) { this.toggleFolder(ev.currentTarget); }, this));

		if (options.events) {
			this.attach();
		}

		this.render();
	};

	Tree.prototype = {
		constructor: Tree,

		render: function () {
			this.populate(this.$el);
		},

		attach: function(events) {
			var me = this,
				options = me.options,
				theEvents = events || options.events;
				
			var tmp = [], //['click', '.icon-plus']
				onArgs = [],
				handler;

			_.each(theEvents, function(val, key) {
				handler = $.isFunction(val) ? val :
					_.isString(val) && $.isFunction(options[val]) ? options[val] : null;

				if (handler) {
					tmp = key.split(/\s+/);

					onArgs[0] = tmp[0];
					if (tmp[1]) {
						onArgs[1] = tmp[1];
						onArgs[2] = handler;
					} else {
						onArgs[1] = handler;
					}
					me.$el.on.apply(me.$el, onArgs);
				}
			});
		},

		populate: function ($el) {
			var self = this;
			var loader = $el.parent().find('.tree-loader:eq(0)');

			loader.show();
			this.options.dataSource.data($el.data(), function (items) {
				loader.hide();

				$.each( items.data, function(index, value) {
					var $entity;

					if(value.type === "folder") {
						$entity = self.$el.find('.tree-folder:eq(0)').clone().show();
						$entity.find('.tree-folder-name').html(value.name);
						$entity.find('.tree-loader').html(self.options.loadingHTML);
						var header = $entity.find('.tree-folder-header');
						header.data(value);
						if('icon-class' in value)
							header.find('[class*="icon-"]').addClass(value['icon-class']);

					} else if (value.type === "item") {
						$entity = self.$el.find('.tree-item:eq(0)').clone().show();
						$entity.find('.tree-item-name').html(value.name);
						$entity.data(value);

						if('additionalParameters' in value
							&& 'item-selected' in value.additionalParameters 
								&& value.additionalParameters['item-selected'] == true) {
								$entity.addClass ('tree-selected');
								$entity.find('i').removeClass(self.options['unselected-icon']).addClass(self.options['selected-icon']);
								//$entity.closest('.tree-folder-content').show();
						}
					}

					//callback
					if(self.options.onItemRender) {
						self.options.onItemRender.call(self, $entity);
					}


					if($el.hasClass('tree-folder-header')) {
						$el.parent().find('.tree-folder-content:eq(0)').append($entity);
					} else {
						$el.append($entity);
					}


					if(self.options.expanded && value.type === "folder" && value.children && value.children.length) {
						self.toggleFolder($entity, false);
					}

				});

				self.$el.trigger('loaded');
			});
		},

		selectItem: function (el) {
			if(this.options['selectable'] == false) return;
			var $el = $(el);
			var $all = this.$el.find('.tree-selected');
			var data = [];

			if (this.options.multiSelect) {
				$.each($all, function(index, value) {
					var $val = $(value);
					if($val[0] !== $el[0]) {
						data.push( $(value).data() );
					}
				});
			} else if ($all[0] !== $el[0]) {
				$all.removeClass('tree-selected')
					.find('i').removeClass(this.options['selected-icon']).addClass(this.options['unselected-icon']);
				data.push($el.data());
			}

			if($el.hasClass('tree-selected')) {
				$el.removeClass('tree-selected');
				$el.find('i').removeClass(this.options['selected-icon']).addClass(this.options['unselected-icon']);
			} else {
				$el.addClass ('tree-selected');
				$el.find('i').removeClass(this.options['unselected-icon']).addClass(this.options['selected-icon']);
				if (this.options.multiSelect) {
					data.push( $el.data() );
				}
			}

			if(data.length) {
				this.$el.trigger('selected', {info: data});
			}

		},

		_getFolderHeader: function (el) {
			var $el = $(el);
			//find tree-folder-header as $el
			if(!$el.hasClass('tree-folder-header')) {

					$el = $el.hasClass('tree-folder') ? 
									$el.find('.tree-folder-header') : 
										$(el).closest('.tree-folder-header');
			}
			return $el;
		},

		toggleFolder: function (el, trigger) {
			// var $el = $(el);
			var $el = this._getFolderHeader(el);

			var $par = $el.parent();

			if($el.find('.'+this.options['close-icon']).length) {
				if ($par.find('.tree-folder-content').children().length) {
					$par.find('.tree-folder-content:eq(0)').show();
				} else {
					this.populate( $el );
				}

				$par.find('.'+this.options['close-icon']+':eq(0)')
					.removeClass(this.options['close-icon'])
					.addClass(this.options['open-icon']);

				this.$el.trigger('opened', $el.data());
			} else {
				if(this.options.cacheItems) {
					$par.find('.tree-folder-content:eq(0)').hide();
				} else {
					$par.find('.tree-folder-content:eq(0)').empty();
				}

				$par.find('.'+this.options['open-icon']+':eq(0)')
					.removeClass(this.options['open-icon'])
					.addClass(this.options['close-icon']);

				trigger !== false && this.$el.trigger('closed', $el.data());
			}
		},

		selectedItems: function () {
			var $sel = this.$el.find('.tree-selected');
			var data = [];

			$.each($sel, function (index, value) {
				data.push($(value).data());
			});
			return data;
		}
	};


	// TREE PLUGIN DEFINITION

	$.fn.tree = function (option, value) {
		var methodReturn;

		var $set = this.each(function () {
			var $this = $(this);
			var data = $this.data('tree');
			var options = typeof option === 'object' && option;

			if (!data) $this.data('tree', (data = new Tree(this, options)));
			if (typeof option === 'string') methodReturn = data[option](value);
		});

		return (methodReturn === undefined) ? $set : methodReturn;
	};

	$.fn.tree.defaults = {
		multiSelect: false,
		loadingHTML: '<div>Loading...</div>',
		cacheItems: true
	};

	$.fn.tree.Constructor = Tree;

})(window.jQuery);
