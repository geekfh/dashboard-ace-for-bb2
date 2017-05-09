/**
 * Created by liliu on 2017/1/6.
 */
define([
	'tpl!app/oms/route/withhold/productConfig/templates/product-model-config-edit.tpl',
	'assets/scripts/fwk/component/ajax-select',
	'jquery.validate'
], function(editTpl, AjaxSelect) {

	var rowViewTpl = [
		'<form class="form-inline" style="margin-top: 5px;">',
			'<div class="form-group" style="width: 50%;">',
				'<label>&nbsp;通道产品名称&nbsp;</label>',
				'<select name="channel" style="min-width: 100px; max-width: 140px;" value="<%=channel%>" <%=type=="GET"?"disabled=\'disabled\'":""%>>',
				'</select>&nbsp;',
			'</div>',
			'<div class="form-group" style="width: 40%;">',
				'<label>&nbsp;优先级&nbsp;</label>',
				'<input style="min-width:60px; max-width: 60px;" type="number" name="priority" style="max-width: 140px;" value="<%=priority%>" <%=type=="GET"?"disabled=\'disabled\'":""%>>',
			'</div>',
			'<div class="form-group col-opr pull-right" style="width: 10%;">',
				'<i class="btn-remove-field icon-minus-sign cursor-pointer" <%=type=="GET"?"style=\'display:none;\'":""%>></i>',
			'</div>',
		'</form>'
	].join('');
	var RowView = Marionette.ItemView.extend({
		tagName: "div",
		className: "rowForm",
		template: _.template(rowViewTpl),
		ui: {
			channel: 'select[name="channel"]',
			priority: 'input[name="priority"]',
			removeButton: '.col-opr',
			form: 'form'
		},
		events: {
			'click @ui.removeButton': 'removeOne'
		},
		templateHelpers: function(){
			var me = this;
			return {
				channel: me.model.get('channel'),
				priority: me.model.get('priority'),
				type: me.options.type
			}
		},
		initialize: function(options){
			this.channel_product_nameList= options.channel_product_nameList
		},
		onRender: function(){
			var me = this;
			me.ui.form.validate({
				rules:{
					channel: {required:true},
					priority: {required:true}
				},
				messages:{
					channel: '必填',
					priority: '必填'
				}
			});
			var setAjaxSelect = (function(me){
				var ajaxSelect = new AjaxSelect(me.ui.channel, {
					placeholder: '- 选择通道 -',
					convertField: {
						name: 'name',
						value: 'id'
					}
				});
				ajaxSelect.updateOptions(me.channel_product_nameList);
				if(!!me.model.get('channel')){
					_.each(me.ui.channel.find('option'), function(option){
						$(option).removeAttr("selected");
						if($(option).text() == me.model.get('channel')){
							$(option).attr("selected", "selected");
						}
					})
				}
			})(me);
		},
		removeOne: function(){
			this.trigger('remove:one');
		},
		validate: function(){
			return this.ui.form.valid();
		},
		getObjValue: function () {
			return {
				channel: this.ui.channel.val(),
				priority: this.ui.priority.val()
			};
		}
	});

	var EditChannelView = Marionette.CompositeView.extend({
		childView: RowView,
		childViewContainer: "div.group-body",
		template: editTpl,
		ui:{
			removeAll: '.btn-remove-fieldset',
			addOne: '.field-types-dd'
		},
		events:{
			'click @ui.removeAll': 'onRemoveAll',
			'click @ui.addOne': 'onAddOne'
		},
		initialize: function(){
			var me = this, filedsets = null;

			//编辑时，会传入model，如果有数据就要生成条件组
			if(this.model) {
				filedsets = this.model.get('filedsets');
			}

			this.collection = new Backbone.Collection(filedsets);
			this.render();
		},
		templateHelpers: function(){
			var me = this;
			return {
				type: me.getOption("ajaxOptions").type
			}
		},
		ajaxSelectFunc:function(){
			var me = this;
			me.cacheData= me.cacheData ||[];
			return (function (cacheData){
				if(cacheData.length){
					return cacheData;
				}
				Opf.ajax({
					url: url._('route.channel.query'),
					type: 'GET',
					async: false,
					success: function(data){
						cacheData = me.cacheData= data;
					}
				});
				return cacheData;
			})(me.cacheData);
		},
		onRender:function(){
			var me = this;
			var $dialog = this.$dialog = Opf.Factory.createDialog(me.$el, {
				dialogClass: 'theme-bb bb-dialog',
				destroyOnClose: true,
				width: 500,
				height: 600,
				modal: true,
				title: this.getOption('title'),
				buttons: [{
					type: 'submit',
					click: function() {
						var $form = me.$el.find('form');
						me.setUpValidate($form);
						if($form.valid() && me.validate(me)){
							me.onSubmit();
						}
					}
				}, {
					type: 'cancel'
				}]
			});
		},
		childEvents: {
			'remove:one': function(childView){
				this.collection.remove(childView.model);
			}
		},
		onRemoveAll: function(){
			this.collection.remove(this.collection.models);
		},
		onAddOne: function(){
			this.collection.add({});
		},
		validate: function (me) {
			var valid = true;
			me.children.each(function (childView) {
				if(childView.validate() === false) {
					valid = false;
				}
			});
			return valid;
		},
		setUpValidate: function($form){
			$form.validate({
				rules:{
					appType: {required:true},
					name: {required:true},
					status: {required:true},
					cmdType: {required:true}
				}
			});
		},
		getFormValues: function() {
			var $el = this.$el;
			return {
				id: this.model?this.model.get('id')+'':'',
				appType: $el.find('[name="appType"]').val(),
				name: $el.find('[name="name"]').val(),
				status: $el.find('[name="status"]').val(),
				cmdType: $el.find('[name="cmdType"]').val()
			};
		},
		setFiledsets: function(me,params){
			params.filedsets = me.getObjValue();
		},
		getObjValue: function () {
			return this.children.map(function (view) {
				return view.getObjValue();
			});
		},
		onSubmit: function(){
			var me = this;
			var params = me.getFormValues();
			me.setFiledsets(me,params);
			me.commit(params);
		},
		ajaxOptions: function(){
			return this.getOption('ajaxOptions');
		},
		childViewOptions: function(){
			var me = this;
			return {
				type: me.getOption("ajaxOptions").type,
				channel_product_nameList: me.ajaxSelectFunc()
			}
		},
		commit: function(params){
			var me = this;
			Opf.confirm('确认提交？', function (confirm) {
				if (!confirm) {
					return;
				}
				var myAjaxOptions = _.result(me, 'ajaxOptions');
				Opf.ajax({
					jsonData: params,
					url: myAjaxOptions.url,
					type: myAjaxOptions.type,
					success: function(resp){
						me.$dialog.dialog('close');
						me.destroy();
						me.trigger('submit:success', resp);
					}
				});
			});
		}
	});

	return EditChannelView;
});