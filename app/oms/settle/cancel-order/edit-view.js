define([
        'tpl!app/oms/settle/cancel-order/templates/edit.tpl'
    ],
    function(tpl){
    var View = Marionette.ItemView.extend({
        ui:{
            dealStatus:  'input[name="dealStatus"]',
            remark:      'textarea[name="remark"]',
            mehtremark:  'textarea[name="mehtremark"]',
            refundedAmt: 'input[name="refundedAmt"]',
            tradeAmt:    'td[name="tr_tradeAmt"]'
        },
        events:{
            'click input[name="dealStatus"]': 'checkClickHandle'
        },
        template: tpl,
        onRender: function(){
            this.checkClickHandle();//调用checkbox 防止选中多个
            this.getTradeAmtData();//验证交易金额 重复验证
        },
        checkClickHandle: function(){
            var me = this;
            me.$el.find('input[name="dealStatus"]').bind('click', function(){
                me.$el.find('input[name="dealStatus"]').not(this).attr("checked", false);
            });
        },
        getTradeAmtData: function(){
            var me = this;
            Opf.ajax({
                type: 'GET',
                url: url._('settle.cancelorder.whetherDeduction', {orderNo: this.model.attributes.orderNo}),
                success: function(resp){
                    me.$el.find('font[name="f_tradeAmt"]').html(resp.msg);
                }
            });
        },
        getPutData: function(){
            var dealStatus = this.$el.find('input[name="dealStatus"]:checked').val();
            var refundedAmt = this.ui.refundedAmt.val().length > 0 ? parseFloat(this.ui.refundedAmt.val()) : null;
            var remark = this.ui.remark.val();
            var mehtremark = this.ui.mehtremark.val();
            if(refundedAmt > this.ui.tradeAmt.text()) {
                Opf.alert('<font style="color: #ff0000;">退货金额金额小于等于交易金额！</font>');
                return;
            }
            if(refundedAmt == null && this.model.attributes.dealStatus == '1' && this.model.attributes.type == '3') {
                Opf.alert('<font style="color: #ff0000;">退货金额必填，请重新输入。</font>');
                return;
            }
            if(!dealStatus){
                Opf.alert('请选择处理状态！');
                return;
            }
            return  {dealStatus: dealStatus,remark: remark, mehtremark : mehtremark, refundedAmt: refundedAmt};
        },
        submit: function(id,reloadGrid){
            var me = this;
            var data = me.getPutData();
            if(!data){
                return;
            }
            Opf.ajax({
                url: url._('settle.cancelorder.search',{id: id}),
                type: 'PUT',
                jsonData: data,
                success: function(){
                    reloadGrid();
                }
            });


        }
    });

    return View;
});
