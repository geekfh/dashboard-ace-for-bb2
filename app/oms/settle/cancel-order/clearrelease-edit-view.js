/**
 * Created by liliu on 2016/8/8.
 */
define([
	'tpl!app/oms/settle/cancel-order/templates/clearReleaseEdit.tpl',
	'bootstrap-datepicker'
], function(tpl){
	var View = Marionette.ItemView.extend({
		template:tpl,
		ui:{
			chargeTimeInput: 'input[name="chargeTime"]'
		},
		events:{
			'click @ui.chargeTimeInput' : 'onClickChargeTime'
		},
		onRender:function(){},
		getPutData:function(){
			var orderType = this.$el.find('span[name="orderType"]').text();  //单据类型
			var refundedAmt = this.$el.find('input[name="refundedAmt"]').val(); //释放金额
			var debitReleaseTime = this.$el.find('input[name="chargeTime"]').val(); //释放时间
			debitReleaseTime = debitReleaseTime.replace("T","");
			var mehtremark = this.$el.find('textarea[name="mehtremark"]').val();
			var remark = this.$el.find('textarea[name="remark"]').val();
			var dealStatus;
			if(orderType==="调单"){
				dealStatus = "9"; //调单处理状态
			}else if(orderType==="退单"){
				dealStatus = "14";//退单处理状态
			}else if(orderType ==="例外处理"){
				dealStatus = "21"; //例外处理
			}
			return {dealStatus:dealStatus, refundedAmt:refundedAmt, debitReleaseTime:debitReleaseTime, mehtremark:mehtremark, remark:remark};
		},
		submit:function(id, reloadGrid){
			var me = this;
			var data = me.getPutData();
			if(!data){
				return;
			}
			Opf.ajax({
				url:url._('settle.cancelorder.clearreleaseEdit', {id:id}),
				type:'POST',
				jsonData:data,
				success:function(){
					reloadGrid();
				}
			});
		},
		onClickChargeTime: function(event){
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