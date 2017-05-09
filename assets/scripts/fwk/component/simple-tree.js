define(['fuelux.tree' //
	], //
	function(FueluxTree) {

		var SimpleTreeDataSource = function(options) {
			this._data = options.data;
		};

		SimpleTreeDataSource.prototype.data = function(options, callback) {
			var self = this;
			var treeData = null;

			//the root tree
			if (!("name" in options) && !("type" in options)) {
				treeData = this._data; 
				callback({ data: treeData });
				return;
			} 

			if ("isLeaf" in options && !options.isLeaf && "children" in options) {
				treeData = options.children;

			} else {
				treeData = {}; //no data
			}

			if (treeData != null) //this setTimeout is only for mimicking some random delay
				// setTimeout(function() {
					callback({ data: treeData });
				// }, 200);
			
		};



		var defaultOption = {
			multiSelect: true,
			// 'open-icon': 'icon-folder-open',
			// 'close-icon': 'icon-folder-close',
			'open-icon': 'icon-minus',
			'close-icon': 'icon-plus',
			//TODO add readonly
			'selectable': true,
			// 'selected-icon': 'icon-ok',
			// 'unselected-icon': 'icon-remove',	
			'selected-icon': 'icon-ok',
			'unselected-icon': 'icon-remove',
			'loadingHTML': '<div class="tree-loading"><i class="icon-refresh icon-spin blue"></i></div>'
		};

		function SimpleTree(options) {

			var opt = $.extend({}, defaultOption, options);
			opt.dataSource = new SimpleTreeDataSource({
				data: opt.data
			});

			if(!opt.selectable) {
				opt['selected-icon'] = opt['unselected-icon'] = null;
			}

			var cls = opt['selectable'] ? 'tree-selectable' : 'tree-unselectable';

			var tpl = [
			'<div class="tree">',
				'<div class="tree-folder" style="display:none;">',
				'<div class="tree-folder-header">',
				'<i class="' + opt['close-icon'] + '"></i>',
				'<div class="tree-folder-name space-before"></div>',
				'</div>',
				'<div class="tree-folder-content"></div>',
				'<div class="tree-loader" style="display:none"></div>',
				'</div>',
				'<div class="tree-item" style="display:none;">', (opt['unselected-icon'] == null ? '' : '<i class="' + opt['unselected-icon'] + '"></i>'),
				'<div class="tree-item-name"></div>',
				'</div>',
			'</div>'
			].join('');

			this.$tree = $(tpl).addClass('tree') //
			.addClass(cls) //
			.tree(opt);

			this.$tree.appendTo($(opt.renderTo));

			$('.icon-remove').each(function(){
				if($(this).parent().hasClass('tree-folder-header')){
					$(this).remove();
				}
			});
		}

			//TODO refactor  borrow
		SimpleTree.prototype.attach = function () { 
			this.tree.attach.apply(this.tree, arguments);
		};

		SimpleTree.prototype.destroy = function () { 
			this.$tree.remove();
		};

		return SimpleTree;

	});