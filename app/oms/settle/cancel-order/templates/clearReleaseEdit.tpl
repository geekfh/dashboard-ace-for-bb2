<%
    var ORDER_TYPE= {
    "1": "调单",
    "2": "退单",
    "3": "退货",
    "4": "短款请款",
    "5": "例外处理"
    },
    DEAL_STATUS = {"6":"未扣款", "7":"调单暂扣", "8":"风险冻结", "9":"调单释放", "17": "风险协查"},
    DEAL_STATUS2 = {"10":"未请款", "11":"请款成功", "12":"请款失败", "13":"请款中", "14":"退单释放"},
    DEAL_STATUS5 = {"22":"已退款", "19":"未退款", "20":"暂扣", "21":"单据释放"},
    CONTACT_STATUS = {"1":"待联系", "2":"停机空号", "3":"电话畅通", "4":"商户挂机", "5":"无人接听"};

    function dateFormatter(val) {
        return val ? moment(val, 'YYYYMMDD').format('YYYY/MM/DD') : '';
    }

    function timeFormatter(val) {
        return val ? moment(val, 'YYYYMMDDHHmm').format('YYYY/MM/DD HH:mm') : '';
    }
%>
<div class="clearrelease-edit-cancelorder">
    <div class="form-group">
        <label class="control-label col-xs-4">&nbsp;&nbsp;单据类型：</label>
        <div class="col-xs-7"><span class="form-control" name="orderType"><%=ORDER_TYPE[type]%></span></div>
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
        <label class="control-label col-xs-4">&nbsp;&nbsp;交易商户：</label>
        <div class="col-xs-7"><span class="form-control"><%=mchtName%></span></div>
    </div>
    <div class="form-group">
        <label class="control-label col-xs-4">&nbsp;&nbsp;商户联系电话：</label>
        <div class="col-xs-7"><span class="form-control"><%=phone%></span></div>
    </div>
    <%if(type=="2" || type=="5"){%>
    <div class="form-group">
        <label class="control-label col-xs-4">&nbsp;&nbsp;商户联系状态：</label>
        <div class="col-xs-7"><span class="form-control"><%=CONTACT_STATUS[contactStatus]%></span></div>
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
    <div class="form-group">
        <label class="control-label col-xs-4">&nbsp;&nbsp;处理时间：</label>
        <div class="col-xs-7"><span class="form-control"><%=timeFormatter(updateTime)%></span></div>
    </div>
    <%if(type=="1"){%>
        <div class="form-group">
            <label class="control-label col-xs-4">&nbsp;&nbsp;处理状态：</label>
            <div class="col-xs-7"><span name="dealStatusRetrieval" class="form-control"><%=DEAL_STATUS["9"]%></span></div>
        </div>
    <%}else if(type=="2"){%>
        <div class="form-group">
            <label class="control-label col-xs-4">&nbsp;&nbsp;处理状态：</label>
            <div class="col-xs-7"><span name="dealStatusChargeback" class="form-control"><%=DEAL_STATUS2["14"]%></span></div>
        </div>
    <%}else if(type=="5"){%>
        <div class="form-group">
            <label class="control-label col-xs-4">&nbsp;&nbsp;处理状态：</label>
            <div class="col-xs-7"><span name="dealStatusChargeback" class="form-control"><%=DEAL_STATUS5["21"]%></span></div>
        </div>
    <%}%>
    <div class="form-group">
        <label class="control-label col-xs-4">&nbsp;&nbsp;释放金额(元)：</label>
        <div class="col-xs-7">
            <input type="text" name="refundedAmt" class="form-control" style="margin: 4px auto;" value="<%=refundedAmt || 0%>">
            <span name="refundedAmtInfo" style="color:red;font-size: small;visibility: hidden;">请输入大于等于0的数字</span>
        </div>
    </div>
    <div class="form-group">
        <label class="control-label col-xs-4">&nbsp;&nbsp;释放时间：</label>
        <div class="col-xs-7">
            <input name="chargeTime" class="form-control" placeholder="请输入释放时间" style="margin: 4px auto" value="<%=debitReleaseTime ? debitReleaseTime.substring(0,4)+'年'+debitReleaseTime.substring(5,7)+'月'+debitReleaseTime.substring(8,10)+'日' : '' %>">
            <span name="chargeTimeInfo" style="color:red;font-size: small;visibility: hidden">请输入释放时间</span>
        </div>
    </div>
    <div class="form-group">
        <label class="control-label col-xs-4">&nbsp;&nbsp;商户备注：</label>
        <div class="col-xs-7">
            <textarea name="mehtremark" class="form-control"  style="margin:4px auto"><%=mehtremark%></textarea>
        </div>
    </div>
    <div class="form-group">
        <label class="control-label col-xs-4">&nbsp;&nbsp;备注：</label>
        <div class="col-xs-7">
            <textarea name="remark" class="form-control"  style="margin:4px auto"><%=remark%></textarea>
        </div>
    </div>
</div>