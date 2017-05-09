/**
 * Created by wupeiying on 2016/11/10.
 */
define([
	'app/oms/route/settlement/channelConfig/common/AbstractAddModelView',
	'app/oms/route/settlement/channelConfig/common/FieldsetGroup',
	'tpl!app/oms/route/settlement/channelConfig/edit-add-channelConfig.tpl',
	'common-ui',
	'bootstrap-datepicker'
], function(AbstractAddModelView, FieldsetGroup, tpl) {

	var editView = AbstractAddModelView.extend({

		title: '修改-出款通道配置',

		conditions:  [
			{type: 'amount'},
			{type: 'tx_time'},
			{type: 'account_type'}
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
				url: url._('route.settlement.channelConfig.edit', {id: this.model.id})
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
					status: {
						required: true
					},
					validity: {
						required: true
					}
				}
			});
		},

		doSetup: function () {
			var me = this;
			me.$el.find('[name="validity"]').datepicker({autoclose: true,format: 'yyyymmdd'});
		},

		getFormValues: function() {
			var $el = this.$el;

			return {
				name:      $el.find('[name="name"]').val(),
				account:   $el.find('[name="account"]').val(),
				validity:  $el.find('[name="validity"]').val(),
				status:    $el.find('[name="status"]').val(),
				basicModId: this.model.attributes.basicModId ? this.model.attributes.basicModId : null
			};

		},

		validateForm: function () {
			return this.$el.find('form.form').valid();
		}


	});

	return editView;
});