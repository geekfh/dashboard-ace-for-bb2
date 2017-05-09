/**
 * Created by liliu on 2016/8/8.
 */
define([
	'tpl!app/oms/settle/cancel-order/templates/clearEdit.tpl',
	'bootstrap-datepicker'
], function(tpl){
	var View = Marionette.ItemView.extend({
		template:tpl,
		ui:{
			debitReleaseTimeInput: 'input[name="debitReleaseTime"]'
		},
		events:{
			'click @ui.debitReleaseTimeInput' : 'onClickDebitReleaseTime'
		},
		onRender:function(){
		},
		getPutData:function(){
			var refundedAmt = this.$el.find('input[name="refundedAmt"]').val(); //扣款金额
			var debitReleaseTime = this.$el.find('input[name="debitReleaseTime"]').val();  //扣款日期
			debitReleaseTime = debitReleaseTime.replace("T","");
			var mehtremark = this.$el.find('textarea[name="mehtremark"]').val();
			var remark = this.$el.find('textarea[name="remark"]').val();
			return {refundedAmt:refundedAmt, debitReleaseTime:debitReleaseTime, mehtremark:mehtremark, remark:remark};
		},
		submit:function(id, reloadGrid){
			var me = this;
			var data = me.getPutData();
			if(!data){
				return;
			}
			Opf.ajax({
				url:url._('settle.cancelorder.clearEdit', {id:id}),
				type:'PUT',
				jsonData:data,
				success:function(){
					reloadGrid();
				}
			});
		},
		onClickDebitReleaseTime: function(event){
			$(event.target).datepicker({
				language: "zh-CN",
				autoclose: true,
				format: 'yyyy年mm月dd日'
			});
			$(event.target).datepicker('show');
		}
	});
	return View;
});