/**
 * Created by liliu on 2017/2/17.
 */
define([
	'app/oms/route/withhold/channelRouter/common/AbstractAddModelView',
	'app/oms/route/withhold/channelRouter/common/FieldsetGroup',
	'tpl!app/oms/route/withhold/channelProductConfig/edit-add-channelProduct.tpl',
	'assets/scripts/fwk/component/ajax-select',
	'common-ui',
	'select2',
	'bootstrap-datepicker'
], function(AbstractAddModelView, FieldsetGroup, tpl) {

	var editView = AbstractAddModelView.extend({

		title: '修改',

		conditions:  [
			{type: 'amount'},//单笔金额
			{type: 'card_bank'},//支持银行
			{type: 'service_type'},//验证要素
			{type: 'tx_time'},//支出时间
			{type: 'card_type'}//卡类型
		],

		formTemplate: tpl,

		initialize: function () {
			var me = this;
			AbstractAddModelView.prototype.initialize.apply(this, arguments);
		},

		serializeFormData: function () {
			var channelListFunc = (function(){
				var channelList = [];
				return function (){
					if(channelList.length){
						return channelList;
					}else {
						Opf.ajax({
							url: url._('route.channelProduct.channel.query'),
							type: 'GET',
							async: false,
							success: function(resp){
								channelList = resp;
							}
						});
						return channelList;
					}
				}
			})();
			return {
				data: this.model.toJSON(),
				channelList: channelListFunc()
			};
		},

		ajaxOptions: function () {
			return {
				type: 'PUT',
				url: url._('route.channelProduct.edit', {id: this.model.get('id')})
			};
		},
		events: {
			//'change [name=""]' :  ''
		},

		onRender: function () {
			AbstractAddModelView.prototype.onRender.apply(this, arguments);

			this.doSetup();

			var $form = this.$el.find('form.form');
			$form.validate({
				rules: {
					name: {
						required: true
					},
					channel_name_cn: {
						required: true
					},
					status: {
						required: true
					}
				}
			});
		},

		doSetup: function () {
			var me = this;

		},

		getFormValues: function() {
			var $el = this.$el;

			return {
				name: $el.find('[name="name"]').val(),
				channelId: $el.find('[name="channel_name_cn"] :selected').attr('channelId'),
				channel_name_cn: $el.find('[name="channel_name_cn"] :selected').text().trim(),
				channel_nm:   $el.find('[name="channel_name_cn"]').val(),
				status:  $el.find('[name="status"]').val(),
				remark:    $el.find('[name="remark"]').val()
			};

		},

		validateForm: function () {
			return this.$el.find('form.form').valid();
		}

	});

	return editView;
});