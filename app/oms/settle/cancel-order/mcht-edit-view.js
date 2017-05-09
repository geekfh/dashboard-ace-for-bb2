/**
 * Created by liliu on 2016/8/5.
 */
define([
	'tpl!app/oms/settle/cancel-order/templates/mchtEdit.tpl'
], function(tpl){
	var View = Marionette.ItemView.extend({
		template:tpl,
		onRender:function(){
		},
		getPutData:function(){
			var orderType = this.$el.find('span[name="orderType"]').text().trim();  //单据类型
			var dealStatus = this.$el.find('select[name="dealStatus"]').val();     //处理类型
			var mehtremark = this.$el.find('textarea[name="mehtremark"]').val();
			var remark = this.$el.find('textarea[name="remark"]').val();
			var contactStatus = this.$el.find('select[name="contactStatus"]').val();  //联系状态
			var cancelReasonCode; //原因码
			if(orderType==="退货"){//type 3
				return {dealStatus:dealStatus, mehtremark:mehtremark, remark:remark};
			}
			else if(orderType==="调单"){//type 1
				return {contactStatus:contactStatus, dealStatus:dealStatus, mehtremark:mehtremark, remark:remark};
			}
			else if(orderType==="退单"){//type 2
				cancelReasonCode = this.$el.find('select[name="cancelReason"]').val();  //退单原因
				var cancelType = this.$el.find('select[name="cancelType"]').val();     //退单类型
				return {contactStatus:contactStatus, cancelReasonCode:cancelReasonCode, cancelType:cancelType, dealStatus:dealStatus, mehtremark:mehtremark, remark:remark};
			}else if(orderType === "例外处理"){//type 5
				cancelReasonCode = this.$el.find('select[name="cancelReason"]').val();  //退单原因
				return {contactStatus:contactStatus, cancelReasonCode:cancelReasonCode, dealStatus:dealStatus, mehtremark:mehtremark, remark:remark};
			}
		},
		submit:function(id, reloadGrid){
			var me = this;
			var data = me.getPutData();
			if(!data){
				return;
			}
			Opf.ajax({
				url:url._('settle.cancelorder.mchtEdit', {id:id}),
				type:'PUT',
				jsonData:data,
				success:function(){
					reloadGrid();
				},
				error: function(resp) {
					Opf.Toast.error(resp.msg || '请求失败！');
				}
			});
		}
	});
	return View;
});