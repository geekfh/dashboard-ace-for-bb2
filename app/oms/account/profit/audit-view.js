/**
 * Created by liliu on 2017/1/19.
 */
define([
	'tpl!app/oms/account/profit/audit-view.tpl',
	'jquery.validate'
], function(tpl){
	var TICKET_TYPE_MAP_REVERSE ={
		'增值税专用发票6%': '1',
		'增值税专用发票3%': '2',
		'普通发票3%':'3'
	};
	var auditView = Marionette.ItemView.extend({
		tabId: 'menu.audit.view',
		template: tpl,
		ui: {
			backBtn: '.js-back',
			toChange: '.btn-change',
			toCancel: '.btn-cancel',
			toSureChange: '.btn-sureChange',
			toSubmit: '.btn-submit',
			editPanel: '.edit-innerwrap',
			viewPanel: '.view-innerwrap',
			ticketAmountInput: 'input[name="ticketAmount"]',//奖励总金额(元)
			taxAmountInput: 'input[name="taxAmount"]',
			thawAmountInput: 'input[name="thawAmount"]',
			inputTaxAmountInput: 'input[name="inputTaxAmount"]'
		},
		events: {
			'click @ui.backBtn': 'goback',
			'click @ui.toChange': 'toChangeView',
			'click @ui.toCancel': 'toChangeView',
			'click @ui.toSureChange': 'toSureChange',
			'click @ui.toSubmit': 'toSubmit',
			//'change @ui.ticketAmountInput': 'setThawAmount',
			//'change @ui.taxAmountInput': 'setThawAmount',
			'change [name="invoiceType"], [name="ticketAmount"]': 'changeTax' //计算汇率的
		},
		changeTax: function(){
			var me = this;
			var txt_taxAmount,inputTaxAmount;
			//汇率值-->选择下拉框，需要换算汇率然后得出值。
			var INVOICETYPE_CA ={
				'1': '0',
				'2': '0.02',
				'3': '0.03'
			};
			//进税金额%
			var INVOICETYPE_CA_TA ={
				'1': '0.06',
				'2': '0.03',
				'3': '0'
			};
			var invoiceType_value = me.$el.find('[name="invoiceType"] option:selected').val();//获取下拉框的值
			txt_taxAmount = INVOICETYPE_CA[invoiceType_value] * me.ui.ticketAmountInput.val();//计算汇率
			me.ui.taxAmountInput.val(txt_taxAmount.toFixed(2));

			//进项税金额
			inputTaxAmount = me.ui.ticketAmountInput.val()/(1+parseFloat(INVOICETYPE_CA_TA[invoiceType_value]))*INVOICETYPE_CA_TA[invoiceType_value];
			me.ui.inputTaxAmountInput.val(inputTaxAmount.toFixed(2));

			var ta_value = me.ui.ticketAmountInput.val() - me.ui.taxAmountInput.val();
			me.ui.thawAmountInput.val(ta_value.toFixed(2));
		},
		goback: function(){
			this.$el.remove();
			this.trigger('back');
		},
		toChangeView: function(){
			this.ui.viewPanel.toggle();
			this.ui.editPanel.toggle();
			if(this.ui.editPanel.is(':visible')){
				this.ui.toSubmit.attr("disabled", "disabled");
			}else {
				this.ui.toSubmit.removeAttr("disabled");
			}
		},
		toSureChange: function(){
			var me = this;
			var $form = $('form#postedTicketAuditEdit');
			if(!$form.validate().form()){
				return;
			}
			var data = this.getValue();
			Opf.ajax({
				url: url._('posted.audit.list'),
				jsonData: data,
				type: 'PUT',
				success: function(){
					this.rowData = me.updateRowData(data);
					me.toChangeView();
					me.render(); //重新渲染视图，展示更新的rowData
				}
			});
		},
		updateRowData: function(data){
			return _.extend(this.rowData, data);
		},
		toSubmit: function(){
			var data = this.getViewValue();
			var _validate = true;
			_.each(data, function(itemVal){
				if(itemVal == ''){
					_validate = false;
					Opf.Toast.warning("请补全贴票内容！");
					return false;
				}
			});
			if(!_validate){
				return;
			}
			data && (data.userId = this.rowData.userId); //点击审核通过的时候查询改该用户名下的所有状态为待审核的奖励明细表记录 时要用到
			require(['app/oms/account/profit/updateAwardDetail-view'], function(UpdateAwardDetailView){
				var updateAwardDetailView = new UpdateAwardDetailView({data:data}).render();
				var $dialog = Opf.Factory.createDialog(updateAwardDetailView.$el, {
					destroyOnClose:true,
					width:1000,
					height:600,
					modal:true,
					title:'更新奖励明细',
					buttons:[{
						type:'submit',
						text:'确认',
						click: function(){
							updateAwardDetailView.submit(data.id,function(){
								$dialog.dialog('close');
							});
						}
					}, {
						type:'cancel'
					}]
				});
			});
		},
		setThawAmount: function(){
			if(this.ui.ticketAmountInput.val() - this.ui.taxAmountInput.val() < 0){
				this.ui.ticketAmountInput.val(this.rowData.ticketAmount);
				this.ui.taxAmountInput.val(this.rowData.taxAmount);
				Opf.Toast.error("贴票金额应大于扣税金额！");
			}
			this.ui.thawAmountInput.val(this.ui.ticketAmountInput.val() - this.ui.taxAmountInput.val());
		},
		getViewValue: function(){
			return {
				id: this.rowData.id,
				title: $('label[name="title"]').text().trim(), //开票内容
				payee: $('label[name="payee"]').text().trim(), //收款单位
				invoiceCode: $('label[name="invoiceCode"]').text().trim(), //发票代码
				invoiceNo: $('label[name="invoiceNo"]').text().trim(), //发票号码
				invoiceType: TICKET_TYPE_MAP_REVERSE[$('label[name="invoiceType"]').text().trim()], //发票类型
				remark: $('label[name="remark"]').text().trim(), //报税月份
				amount: $('label[name="amount"]').text().trim(), //开票金额(元)
				ticketAmount: $('label[name="ticketAmount"]').text().trim(), //奖励总金额(元)
				taxAmount: $('label[name="taxAmount"]').text().trim(), //扣税金额(元)
				thawAmount: $('label[name="thawAmount"]').text().trim(), //税后金额(元)
				inputTaxAmount: $('label[name="inputTaxAmount"]').text().trim() //进项金额(元)
			}
		},
		getValue: function(){
			return {
				id: this.rowData.id,
				title: $('input[name="title"]').val(), //开票内容
				payee: $('input[name="payee"]').val(), //收款单位
				invoiceCode: $('input[name="invoiceCode"]').val(), //发票代码
				invoiceNo: $('input[name="invoiceNo"]').val(), //发票号码
				invoiceType: $('select[name="invoiceType"]').val(), //发票类型
				remark: $('input[name="remark"]').val(), //报税月份
				amount: $('input[name="amount"]').val(), //开票金额(元)
				ticketAmount: $('input[name="ticketAmount"]').val(), //奖励总金额(元)
				taxAmount: $('input[name="taxAmount"]').val(), //扣税金额(元)
				thawAmount: $('input[name="thawAmount"]').val(), //税后金额(元)
				inputTaxAmount: $('input[name="inputTaxAmount"]').val() //进项金额(元)
			}
		},
		initialize: function(options){
			this.rowData = options.rowData;
		},
		serializeData: function () {
			return this.rowData;
		},
		onRender: function(){
			_.defer(function(){
				var $form = $('form#postedTicketAuditEdit');
				Opf.Validate.addRules($form, {
					rules: {
						title: 'required',
						payee: 'required',
						invoiceCode: 'required',
						invoiceNo: 'required',
						remark: 'required',
						invoiceType: 'required',
						amount: {
							required: true,
							min:0
						},
						ticketAmount: {
							required: true,
							min:0
						},
						taxAmount: {
							required: true,
							min:0
						},
						thawAmount:{
							required: true,
							min:0
						}
					}
				});
			})
		}
	});

	return auditView;
});
