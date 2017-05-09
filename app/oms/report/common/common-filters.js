/**
 * 过滤条件
 */
define([
	'tpl!assets/scripts/fwk/component/templates/switchable-dropdown.tpl',
	'jquery.inputmask'
], function(switchableDropdownTplFn){
 //    var conditions = ['gt', 'eq', 'lt'];
 //    var FILTERS_ITEMS = [
	// 	{ label: "新增商户数", name: "addedMchtAmt", oprs   : conditions}, 
 //        { label: "活跃商户数", name: "activeMchtAmt", oprs   : conditions}, 
 //        { label: "商户总量", name: "totalMchtAmt", oprs   : conditions}, 
 //        { label: "成功交易金额", name: "totalSucTradeNum", oprs   : conditions }
	// ];

	var Filters = Marionette.ItemView.extend({

		className: 'opf-filters-panel',

		initialize: function (options) {
			options = _.clone(options);

			options.items = options.items || [];
			options.renderTo = options.renderTo || document.body;

			this.options = options;

			this.items = options.items;

			this.render();	
			this.attachEvents();
		},

		render: function () {
			var me = this;
			var options = this.options;
			var items = options.items;

			var arr = [], $formGroup;
			_.each(items, function (item, idx) {
				$formGroup = buildFilterFromGroup.call(me, item, idx, items);
				me.$el.append($formGroup);
			});

			this.$el.appendTo(options.renderTo);
		},

		getValue: function () {
			var rules = [] ;
			var dataIndex, $el, items = this.items, itemData, val;
			
			//jquery 遍历方法里面的idx并不保证按照dom顺序
			this.$el.find('.filter-form-group').map(function (idx, el) {
				$el = $(el);
				dataIndex = $el.attr('data-index');
				itemData = items[dataIndex];
				val = $.trim($el.find('input.filter-input').val());

				if(val !== '') {
					rules.push({
						field: itemData.name,
						op: $el.find('[ref]').attr('ref'),
						data: val
					})
				}

			});

			return {
				groupOp: 'AND',
				rules: rules
			};
		},

		attachEvents: function () {
			//绑定下面的所有输入，一旦有人为有效输入，就发出事件
			// var me = this;

			// // //TODO IE测试input事件兼容
			// // //TODO 目前只有输入框,暂时只对输入框做监听
			// var value;

			// this.$el.on('input', 'input.filter-input', function (e) {
			// 	console.log('input event handler');
			// 	value = $.trim($(e.target).val());
			// 	//用户输入导致输入框有 有效 值 ,如果用户在进行删除 并且所有的搜索条件都是初始值 发送已经清空事件
			// 	if(value !== '') {
			// 		me.trigger('effect:input');					
			// 	}else{
			// 		//TODO 这句性能很有问题，做个debounce延迟
			// 		if(me.isAllInputAreInitial()){
			// 			me.trigger('reset')
			// 		}
			// 	}
			// });
		},

		reset: function () {
			//TDOO 只有输入框，先简单把输入框清空
			this.$el.find('input.filter-input').val('');
			this.trigger('reset');
		},


		/**
		 * 是否所有的输入都是初始状态 (空的)
		 * @return {Boolean} [description]
		 */
		isAllInputAreInitial: function () {
			var isInitStatus = false;//是否初始状态，默认非
			//TODO 目前只有输入框,暂时只对输入框做监听

			this.$el.find('input.filter-input').each(function (idx, el) {
				if($.trim($(el).val()) !== '') {
					isInitStatus = true;
					return false;//break each
				}				
			});
			return !isInitStatus;
		}

	});

	var _oprLabelMap = {
		'gt': '大于',
		'eq': '等于',
		'lt': '小于'
	};

	/**
	 * 转换条件为可识别的对象
	 * @param  {Array} oprs 'gt'/'eq'/'lt'中的元素组成的数组
	 * @return {Array}      [{value: 'xx', label: 'xx'} ...]
	 */
	function convertOprs (oprs) {
		return _.map(oprs, function (val, idx) {
			return { label: _oprLabelMap[val], value: val};
		})
	}


	//生成一个条件爱你对应的组件html
	//这里不用一套模板生成，是为了方便以后扩展输入框或者选项框功能
	function buildFilterFromGroup (item, index, items, content) {
		var me = this;
		var mask = item.mask || 'integer';
    	var conditionItems = convertOprs(item.oprs);
    	var operDropDownTpl = switchableDropdownTplFn({
    		data: {
    			cls: item.name + '-oprs-dropdown',
    			defaultValue: conditionItems[0].value,
    			menu: conditionItems
    		}
    	});
    	var formGroupTpl = _.format('<div data-index="{0}" class="filter-form-group form-group {1}-form-group {2}"></div>',
    							index, item.name, index===items.length-1?'last-one':'')
    	var $formGroup, $input;

    	$formGroup = $(formGroupTpl);
    	$input = $('<input class="' + item.name + '-filter-input filter-input"/>');

    	$input.inputmask(mask, {
    		autoUnmask: true,
    		'groupSeparator': ',', 
    		'autoGroup': true,
    		//监听值是否发生变化
    		onKeyUp : function(e){   
    			if(e.which == 8 || e.which == 46 || (e.which >= 48 && e.which <= 57) || (e.which >= 96 && e.which <= 105)){
    				changeInputState(e, me);
    			}
    		}    		
    	});
    	$input.change(function(){
    		me.trigger('effect:input');
    	});	
    	$formGroup.append('<label class="the-label">' + item.label + '：</label>');
    	$formGroup.append(operDropDownTpl);
    	$formGroup.append($input);

    	return $formGroup;
	}

	//当进行有效输入的时候，改变当前的状态
	function changeInputState(e, content){
		var me = content;
		e.target = e.target || e.srcElement;

		value = $.trim($(e.target).val());
		//用户输入导致输入框有 有效 值 ,如果用户在进行删除 并且所有的搜索条件都是初始值 发送已经清空事件
		if(value !== '') {
			me.trigger('effect:input');					
		}else{
			//TODO 这句性能很有问题，做个debounce延迟
			if(me.isAllInputAreInitial()){
				me.trigger('reset');
			}
		}
	}


	return Filters;

});