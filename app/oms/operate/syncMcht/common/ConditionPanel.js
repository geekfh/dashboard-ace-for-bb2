/**
 * Created by wupeiying on 2016/11/10.
 */
define([
	'app/oms/operate/syncMcht/common/FieldsetGroup'
], function(FieldsetGroup) {

	var View = Marionette.CompositeView.extend({

		// @cofing
		// conditions: []
		className: 'condition-panel',

		childViewContainer: '.fieldset-groups-sit',

		events: {
			'click .btn-add-fieldset-group': 'onBtnAddGroupClick'
		},

		onBtnAddGroupClick: function () {
			var me = this;
			this.collection.add({});
			this.loadChildViewByAddGroup(me);
		},

		getChildView: function () {
			return FieldsetGroup.extend({
				conditions:  this.getOption('conditions')
			});
		},

		template: _.template([
			'<div class="fieldset-groups-sit" style="display:block;"></div>',
			'<a class="btn-add-fieldset-group cursor-pointer">添加一个组...</a>',
			'<br>'
		].join('')),

		ui: {
			fieldsetGroupsSit: '.fieldset-groups-sit'
		},

		validate: function () {
			var valid = true;
			this.children.each(function (childView) {
				if(childView.validate() === false) {
					valid = false;
				}
			});
			return valid;
		},

		initialize: function() {
			var me = this, filedsets = null;

			//编辑时，会传入model，如果有数据就要生成条件组
			if(this.model) {
				filedsets = _.map(this.model.get('filedsets'), function (filedset) {
					return {data: filedset};
				});
			}

			this.collection = new Backbone.Collection(filedsets);
		},

		onAddChild: function () {
			var panel = this.$el.closest('.add-model-panel.model-panel')[0];
			panel && (panel.scrollTop = 999999);
		},

		onRender: function() {
			var me = this;
			this.loadChildViewByAddGroup(me);
		},

		getObjValue: function () {
			return _.filter(this.children.map(function (childView) {
				return childView.getObjValue();
			}), _.identity);
		},

		onChildviewBtnRemoveClick: function (childView) {
			var me = this;
			this.collection.remove(childView.model);
			this.children.invoke('refreshCaption');
			this.loadChildViewByAddGroup(me);
		},

		loadChildViewByAddGroup: function (me) {
			if(me.$el.find('.fieldset-groups-sit').is(':has(div)')){
				me.$el.find('.btn-add-fieldset-group').css('display', 'none');
			}
			else{
				me.$el.find('.btn-add-fieldset-group').css('display', 'block');
			}
		}

	});

	return View;
});