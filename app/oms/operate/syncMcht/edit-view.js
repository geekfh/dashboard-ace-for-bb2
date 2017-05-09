/**
 * Created by wupeiying on 2016/11/10.
 * 修改页面
 */
define([
	'app/oms/operate/syncMcht/common/AbstractAddModelView',
	'app/oms/operate/syncMcht/common/FieldsetGroup',
	'tpl!app/oms/operate/syncMcht/edit-add-syncMcht.tpl',
	'tpl!app/oms/operate/syncMcht/bankDetail.tpl',
	'assets/scripts/fwk/component/ajax-select',
	'common-ui',
	'select2',
	'bootstrap-datetimepicker'
], function(AbstractAddModelView, FieldsetGroup, tpl, bankDetailTpl) {

	var editView = AbstractAddModelView.extend({

		title: '修改',

		conditions:  [
			{type: 'mcht_term'},
			{type: 'account_type'},
			{type: 'synch_business'},
			{type: 'certflag'}
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
				url: url._('operate.sync.mchtChannel.list')
			};
		},

		events: {
			//'change [name="channelNo"]' :  'onChangeChannelNo',
			'change [name="settleBank"]' :  'onChangeSettleBank',
			'click .btn_bankDetail' :  'onLoadBankDetail'
		},

		onRender: function () {
			AbstractAddModelView.prototype.onRender.apply(this, arguments);
			this.doSetup();

			var $form = this.$el.find('form.form');
			$form.validate({
				rules: {
					name: {
						channelNo: true,
						number:true
					},
					channelNm: {
						required: true
					},
					synchModel: {
						required: true
					},
					startStatus: {
						required: true
					},
					isUpdateSynch: {
						required: true
					},
					isMatchingBusiness: {
						required: true
					},
					settleBank: {
						required: true
					}
				}
			});
		},

		onChangeSettleBank: function(){
			var me = this;

			//判断是否打开银行详情
			if(me.$el.find('[name="settleBank"]').val() == '2'){
				me.$el.find('.btn_bankDetail').removeAttr('disabled');
			}
			else{
				me.$el.find('.btn_bankDetail').attr('disabled', 'disabled');
			}
		},

		// onChangeChannelNo: function(){
		// 	var me = this;
		// 	me.ui.btnBankDetail.removeAttr('disabled');
		// },

		onLoadBankDetail: function(){
			var me = this;
			var channelNo = me.$el.find('[name="channelNo"]').val();
			if(!channelNo){
				Opf.alert('查看银行详情需输入通道编码');
				return false;
			}
			Opf.ajax({
				type: 'GET',
				url: url._('operate.sync.mchtChannel.listByChannelNo', {channelNo: channelNo}),
				success: function (resp) {
					var $dialog = Opf.Factory.createDialog(bankDetailTpl({data:resp}), {
						destroyOnClose: true,
						title: '银行详情',
						autoOpen: true,
						width: 600,
						modal: true,
						buttons: [{
							type: 'cancel'
						}],
						create: function() {

						}
					});
				}
			});
		},

		doSetup: function () {
			var me = this;
			var startDate = me.$el.find('[name="channelMaintainTimeStart"]');
			var endDate = me.$el.find('[name="channelMaintainTimeEnd"]');

			startDate.datetimepicker({ format: 'yyyy-mm-dd hh:ii',
				autoclose: true }).on('changeDate', function(ev){
					endDate.datetimepicker('setStartDate', startDate.val());
					startDate.datetimepicker('hide')
			});

			endDate.datetimepicker({ format: 'yyyy-mm-dd hh:ii',
				autoclose: true})
				.on('changeDate', function(ev){
					startDate.datetimepicker('setEndDate', endDate.val());
					startDate.datetimepicker('hide')
			});

			me.onChangeSettleBank();
		},

		getFormValues: function() {
			var $el = this.$el;
			var form = $el.find('.form-control');

			var objStr = {};
			_.each(form, function(v, i){
				objStr[$(v).attr('name')]=$(v).val();
			});

			objStr['id'] = this.model.id;//$el.find('[name="name"]').select2('data').basicModId

			return objStr;
		},

		validateForm: function () {
			return this.$el.find('form.form').valid();
		}

	});

	return editView;
});