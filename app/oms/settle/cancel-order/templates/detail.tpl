<%
    var ORDER_TYPE= {
        "1": "调单",
        "2": "退单",
        "3": "退货",
        "4": "短款请款",
        "5": "例外处理"
    },
    CONTACT_STATUS = {"1":"待联系", "2":"停机空号", "3":"电话畅通", "4":"商户挂机", "5":"无人接听"},
    DEAL_STATUS = {
    "1" : {"6":"未扣款", "7":"调单暂扣", "8":"风险冻结","17": "风险协查"},
    "2" : {"10":"未请款", "11":"请款成功", "12":"请款失败", "13":"请款中"},
    "3" : {"15":"通道长款退货", "16":"线下商户退货"},
    "4" : {"18":"手工处理请款"},
    "5" : {"22":"已退款", "19":"未退款", "20":"暂扣", "21":"单据释放"},
    },
    CANCEL_REASON_CODE = {
        "2": {
            "4502": "4502-交易未成功，已扣账",
            "4503": "4503-对请款交易有异议",
            "4507": "4507-持卡人对交易金额有争议",
            "4508": "4508-交易金额超过授权金额",
            "4512": "4512-交易重复提交清算",
            "4514": "4514-疑似欺诈多笔交易",
            "4515": "4515-持卡人否认交易",
            "4522": "4522-交易未被批准",
            "4526": "4526-收单机构提供资料不清晰",
            "4527": "4527-收单机构查复超过时限或回复码为04",
            "4531": "4531-持卡人对消费签单其他内容有争议",
            "4532": "4532-退货交易未清算",
            "4536": "4536-逾期提交结算",
            "4544": "4544-已撤销的交易",
            "4557": "4557-已扣账，但客户未收到商户承诺的服务或订购的商品",
            "4558": "4558-交易证书（TC验证失败）",
            "4559": "4559-不能提供交易证书（TC及相关计算数据）",
            "4562": "4562-伪卡欺诈",
            "4570": "4570-再请款不正确",
            "4572": "4572-发卡行纠正一次退单原因",
            "4752": "4752-余额查询未成功，索还手续费",
            "4802": "4802-风险交易",
            "4803": "4803-风险商户",
            "4806": "4806-以其他方式支付",
            "4810": "4810-补偿申请",
            "4571": "4571-发卡机构能够提供一次退单中缺少的证明材料"
        },
        "5": {
            "9700": "9700-收单机构借记卡贷记调整失误",
            "9701": "9701-对发卡机构借记卡一次退单有疑义",
            "9702": "9702-收单机构原始交易短款",
            "9703": "9703-超过差错交易的提交时限",
            "9704": "9704-差错处理流程已经结束但仍未解决",
            "9705": "9705-中心无记录的交易",
            "9706": "9706-其它经协商同意付款的交易",
            "9710": "9710-争议协商备案"
        }
    },
    CANCEL_TYPE = {"1":"一次退单", "2":"二次退单", "3":"风险退单"};

    function dateFormatter(val) {
        return val ? moment(val, 'YYYYMMDD').format('YYYY/MM/DD') : '';
    }

    function timeFormatter(val) {
        return val ? moment(val, 'YYYYMMDDHHmm').format('YYYY/MM/DD HH:mm') : '';
    }
%>
<div class="detail-cancelorder">
    <div class="form-group">
        <label class="control-label col-xs-4">&nbsp;&nbsp;单据类型：</label>
        <div class="col-xs-7"><span class="form-control"><%=ORDER_TYPE[type]%></span></div>
    </div>
    <div class="form-group">
        <label class="control-label col-xs-4">&nbsp;&nbsp;录入日期：</label>
        <div class="col-xs-7"><span class="form-control"><%=dateFormatter(createTime)%></span></div>
    </div>
    <div class="form-group">
        <label class="control-label col-xs-4">&nbsp;&nbsp;交易时间：</label>
        <div class="col-xs-7"><span class="form-control"><%=timeFormatter(tradeTime)%></span></div>
    </div>
    <div class="form-group">
        <label class="control-label col-xs-4">&nbsp;&nbsp;交易经度：</label>
        <div class="col-xs-7"><span class="form-control"><%=longitude%></span></div>
    </div>
    <div class="form-group">
        <label class="control-label col-xs-4">&nbsp;&nbsp;交易纬度：</label>
        <div class="col-xs-7"><span class="form-control"><%=latitude%></span></div>
    </div>
    <div class="form-group">
        <label class="control-label col-xs-4">&nbsp;&nbsp;交易商户：</label>
        <div class="col-xs-7"><span class="form-control"><%=mchtName%></span></div>
    </div>
    <div class="form-group">
        <label class="control-label col-xs-4">&nbsp;&nbsp;商户联系电话：</label>
        <div class="col-xs-7"><span class="form-control"><%=phone%></span></div>
    </div>
    <%if(type !== '3'){%>
        <div class="form-group">
            <label class="control-label col-xs-4">&nbsp;&nbsp;商户联系状态：</label>
            <div class="col-xs-7"><span class="form-control"><%=CONTACT_STATUS[contactStatus]%></span></div>
        </div>
    <%}%>
    <%if(type === '2' || type === '5'){%>
        <div class="form-group">
            <label class="control-label col-xs-4">&nbsp;&nbsp;原因码：</label>
            <div class="col-xs-7"><p class="form-control" style="border: none"><%=CANCEL_REASON_CODE[type][cancelReasonCode]%></p></div>
        </div>
    <%}if(type === '2'){%>
        <div class="form-group">
            <label class="control-label col-xs-4">&nbsp;&nbsp;退单类型：</label>
            <div class="col-xs-7"><span class="form-control"><%=CANCEL_TYPE[cancelType]%></span></div>
        </div>
    <%}%>
    <div class="form-group">
        <label class="control-label col-xs-4">&nbsp;&nbsp;交易卡号：</label>
        <div class="col-xs-7"><span class="form-control"><%=tradeCardNo%></span></div>
    </div>
    <div class="form-group">
        <label class="control-label col-xs-4">&nbsp;&nbsp;交易金额：</label>
        <div class="col-xs-7"><span class="form-control"><%=tradeAmt%></span></div>
    </div>
    <div class="form-group">
        <label class="control-label col-xs-4">&nbsp;&nbsp;商管处理人：</label>
        <div class="col-xs-7"><span class="form-control"><%=cancelOrderSG%></span></div>
    </div>
    <div class="form-group">
        <label class="control-label col-xs-4">&nbsp;&nbsp;清算处理人：</label>
        <div class="col-xs-7"><span class="form-control"><%=cancelOrderQS%></span></div>
    </div>
    <div class="form-group">
        <label class="control-label col-xs-4">&nbsp;&nbsp;商管处理时间：</label>
        <div class="col-xs-7"><span class="form-control"><%=dateFormatter(cancelOrderSGTime)%></span></div>
    </div>
    <div class="form-group">
        <label class="control-label col-xs-4">&nbsp;&nbsp;清算处理时间：</label>
        <div class="col-xs-7"><span class="form-control"><%=dateFormatter(cancelOrderQSTime)%></span></div>
    </div>
    <div class="form-group" hidden>
        <label class="control-label col-xs-4">&nbsp;&nbsp;处理时间：</label>
        <div class="col-xs-7"><span class="form-control"><%=timeFormatter(updateTime)%></span></div>
    </div>
    <div class="form-group">
        <label class="control-label col-xs-4">&nbsp;&nbsp;处理状态：</label>
        <div class="col-xs-7"><span class="form-control"><%=DEAL_STATUS[type][dealStatus]%></span></div>
    </div>
    <div class="form-group">
        <label class="control-label col-xs-4">&nbsp;&nbsp;扣款金额(元)：</label>
        <div class="col-xs-7"><span class="form-control"><%=refundedAmt%></span></div>
    </div>
    <div class="form-group">
        <label class="control-label col-xs-4">&nbsp;&nbsp;扣款日期：</label>
        <div class="col-xs-7"><span class="form-control"><%=debitReleaseTime%></span></div>
    </div>
    <div class="form-group">
        <label class="control-label col-xs-4">&nbsp;&nbsp;商户备注：</label>
        <div class="col-xs-7"><textarea class="form-control" disabled style="border:none;background-color:white;"><%=mehtremark%></textarea></div>
    </div>
    <div class="form-group">
        <label class="control-label col-xs-4">&nbsp;&nbsp;备注：</label>
        <div class="col-xs-7"><span class="form-control"><%=remark%></span></div>
    </div>
</div>