/**
 * Created by liliu on 2016/11/9.
 */
define([
'tpl!app/oms/operate/raiseAmount/tpl/audit.tpl'
], function(tpl){
	var APPLY_CODE = {
		'pass':      '1', //1-通过审核
		'unPass':    '2'  //2-拒绝审核
	};
	var APPLY_STATUS = {
		"-1": "未审核",
		"1": "审核通过",
		"2": "审核不通过",
		"3": "异常"
	};
	var View = Marionette.ItemView.extend({
		template: tpl,
		ui: {
			tCardOneDay: '#tCardOneDay',    //刷卡单日额度
			tCardOneDeal: '#tCardOneDeal',  //刷卡单笔额度
			tWxOneDeal: '#tWxOneDeal',      //微信单笔额度
			tWxOneDay: '#tWxOneDay',        //微信单日额度
			tAlipayOneDeal: '#tAlipayOneDeal',    //支付宝单笔额度
			tAlipayOneDay: '#tAlipayOneDay',       //支付宝单日额度
			passBtn: '.passBtn',              //通过按钮
			unPassBtn: '.unPassBtn',           //未通过按钮
			textArea: 'textarea',           //备注
			image: 'img',
			oprUser: '.oprUser',              //审批人
			foot: '.foot',                    //审核操作
			editAmountBlock: '.edit-amount-block',
			viewAmountBlock: '.view-amount-block'
		},
		events: {
			'click @ui.passBtn': 'toPassAudit',
			'click @ui.unPassBtn': 'toUnPassAudit'
		},
		initialize: function(options){
			this.data = options.data;
			this.rowData = options.rowData;
		},
		serializeData: function(){
			var data = this.data;
			var rowData = this.rowData;
			return{
				data: data,
				rowData: rowData
			}
		},
		onRender: function(){
			if(this.data.buttonType == 'view'){
				$(this.ui.textArea).attr('disabled', true);
				$(this.ui.oprUser).show();
				$(this.ui.foot).hide();
				$(this.ui.editAmountBlock).hide();
				$(this.ui.viewAmountBlock).show();
			}else {
				$(this.ui.textArea).removeAttr('disabled');
				$(this.ui.oprUser).hide();
				$(this.ui.foot).show();
				$(this.ui.editAmountBlock).show();
				$(this.ui.viewAmountBlock).hide();
			}
			if(APPLY_STATUS[this.data.applyStatus] != "未审核"){
				$(this.ui.passBtn).attr('disabled', true);
				$(this.ui.unPassBtn).attr('disabled', true);
			}else {
				$(this.ui.passBtn).removeAttr('disabled');
				$(this.ui.unPassBtn).removeAttr('disabled');
			}
		},
		toPassAudit: function(){
			var params = this.getParams();
			params.applyCode = parseInt(APPLY_CODE['pass'], 10);
			this.toAudit(params);
		},
		toUnPassAudit: function(){
			var params = this.getParams();
			params.applyCode = parseInt(APPLY_CODE['unPass'], 10);
			this.toAudit(params);
		},
		getParams: function(){
			var params = {};
			params.applyId = this.data.applyId;
			params.remark = this.ui.textArea.val() || '';
			params.cardOneDay = Number(this.ui.tCardOneDay.val()) || 0;
			params.cardOneDeal = Number(this.ui.tCardOneDeal.val()) || 0;
			params.wxOneDay = Number(this.ui.tWxOneDay.val()) || 0;
			params.wxOneDeal = Number(this.ui.tWxOneDeal.val()) || 0;
			params.alipayOneDay = Number(this.ui.tAlipayOneDay.val()) || 0;
			params.alipayOneDeal = Number(this.ui.tAlipayOneDeal.val()) || 0;
			return params;
		},
		toAudit: function(params){
			Opf.ajax({
				type: 'PUT',
				url: url._('operate.raiseAmount.auditCredit'),
				jsonData: params,
				success: function(res){
					if(res.success == true){
						$('.passBtn').attr('disabled', true);
						$('.unPassBtn').attr('disabled', true);
						Opf.alert(res.msg);
					}
				}
			});
		}
	});
	return View;
});