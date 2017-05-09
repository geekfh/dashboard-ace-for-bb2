/**
 * Created by wupeiying on 2017/1/5.
 */
define([
	'app/oms/route/withhold/channelRouter/common/AbstractAddModelView',
	'app/oms/route/withhold/channelRouter/common/FieldsetGroup',
	'tpl!app/oms/route/withhold/channelRouter/edit-add-channelRouter.tpl',
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
			AbstractAddModelView.prototype.initialize.apply(this, arguments);
		},

		serializeFormData: function () {
			return {
				data: this.model.toJSON()
			};
		},

		ajaxOptions: function () {
			return {
				type: 'PUT',
				url: url._('route.withhold.channelRouter.edit', {id: this.model.id})
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
					channel_nm: {
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
				channel_nm:   $el.find('[name="channel_nm"]').val(),
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