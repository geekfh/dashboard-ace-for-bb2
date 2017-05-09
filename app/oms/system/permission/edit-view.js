/**
 * Created by liliu on 2016/12/5.
 */
define([
	'tpl!app/oms/system/permission/templates/edit.tpl',
	'jquery.validate.origin'
], function(tpl){
	return Marionette.ItemView.extend({
		template: tpl,

		initialize: function(options){
			this.systemList = options.systemList;
			this.rowData = options.rowData||{};
		},

		templateHelpers: {
			isOldCode: function(code, systemList) {
				var sName = this.splitCode(code)[0];
				return !_.isObject(_.findWhere(systemList, {serviceName:sName}));
			},
			splitCode: function(code) {
				return code.split(":");
			}
		},

		serializeData: function(){
			return{
				systemList: this.systemList,
				rowData: this.rowData
			}
		},

		ui: {
			form: 'form',
			name: '[name="name"]',
			resName: '[name="resName"]'
		},

		onRender:function(){
			//var me = this;
		},

		onSave: function(callback){
			var me = this,
				ui = me.ui;
			var valid = ui.form.validate().form();

			if(valid) {
				var params = me.getParams();
				Opf.ajax({
					url: url._('system.setting.module'),
					type: 'POST',
					jsonData: params,
					success: function(){
						callback();
					}
				});
			}

		},

		getParams: function(){
			var me = this,
				ui = me.ui,
				rowData = me.rowData,
				systemList = me.systemList;

			return {
				id: rowData.id||"",
				code: me.getCode(),
				serviceId: me.getServiceId(rowData, systemList),
				name: ui.name.val(),
				resName: ui.resName.val()
			}
		},

		getCode: function() {
			var code = "";

			if(this.$el.find('input[name=code]').length>0) {
				code = this.$el.find('input[name=code]').val();
			} else {
				this.$el.find('[name^=code]').each(function() {
					var $this = $(this);
					code += ($this.is('select')? $this.find('option[value='+$this.val()+']').text():$this.val())+":";
				})
			}

			// 去掉结尾的冒号":"
			code = code.replace(/(.*?):+$/ig, "$1");

			return code;
		},

		getServiceId: function(rowData, systemList) {
			var serviceId = "";

			if(this.$el.find('input[name=code]').length>0) {
				var systemItem = _.findWhere(systemList, {remark:rowData.descr})||{};
				serviceId = systemItem.id||"";
			} else {
				serviceId = this.$el.find('select[name=codeFirst]').val();
			}

			return parseInt(serviceId);
		}
	});
});