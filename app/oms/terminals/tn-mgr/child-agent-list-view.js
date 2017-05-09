/**
 * Created by zhuyimin on 2015/1/13.
 */
/**
 * 用来生成下级机构列表
 * DOM结构很可能会变
 * */

define([
	'tpl!app/oms/terminals/tn-mgr/templates/branch.tpl'
], function (itemTpl) {

	"use strict";

	var ChildView = Marionette.ItemView.extend({
		template: itemTpl,
		tagName: 'tr',
		templateHelpers: function(){
			return {
				termUsedTotal: this.model.get('termUsedTotal') || '0',
				termBoundTotal: this.model.get('termBoundTotal') || '0'
			}
		},
		triggers: {
			'click td' : 'click:item'
		}

	});

	var ComView = Marionette.CompositeView.extend({
		template: _.template('<table class="table table-bordered table-hover"><tbody></tbody></table>'),
		childView: ChildView,
		childViewContainer: 'tbody',

		initialize: function () {
			this.render();
		},

		onRender: function () {
			if(this.options.renderTo){
				this.$el.appendTo(this.options.renderTo);
			}

			this.highlightUpperBrh();
		},

		onChildviewClickItem: function(childview){
			this.trigger('brh:tn:detail',{brhNo: childview.model.get('brhNo')});
		},

		highlightUpperBrh: function(){
			var me = this;
			//遍历子view，找到它对应的model的brhNo
			//与上级brhNo比较，相同则highlight此子view
			me.children.each(function(childView){
				if(childView.model.get('brhNo') === me.options.upperBrh){
					childView.$el.addClass('is-upper-brh');
				}
			});

		}
	});


	return ComView;
});