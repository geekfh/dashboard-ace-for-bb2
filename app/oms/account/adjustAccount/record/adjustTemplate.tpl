<%
    var model = data;

    var CUSTTYPE_MAP = {
        1:'商户',
        2:'地推',
        3:'代理商'
    };

    var TRADETYPE_MAP = [
        {id: 0, name: '充值'},
        {id: 1, name: '提现'},
        {id: 2, name: '消费'},
        {id: 3, name: '清分入账'},
        {id: 4, name: '商户入账'},
        {id: 5, name: '商户对账'},
        {id:'', name: '所有'}
    ];
%>
<form>
    <div class="div_hd_error" style="border-color: #eed3d7;background-color: #f2dede;margin-top:-4px;padding: 10px 0 10px 0;display: none;">
        <center><a class="hd_error" style="color: #b94a48;"></a></center>
    </div>
    <div style="padding: 20px;">
        <div class="form-group">
            <label class="col-sm-4 control-label no-padding-right">账务日期：</label>
            <input id="txt-workDate" type="text" value="<%=model==null ? '' : model.workDate%>" readonly />
        </div>
        <div class="form-group">
            <label class="col-sm-4 control-label no-padding-right">账务流水号：</label>
            <input id="txt-tradeNo" type="text" value="<%=model==null ? '' : model.accountingNo%>" readonly />
        </div>
        <div class="form-group">
            <label class="col-sm-4 control-label no-padding-right">用户类型：</label>
            <input id="txt-userType" type="text" value="<%=userType==null ? '' : CUSTTYPE_MAP[userType]%>" readonly />
        </div>
        <div class="form-group" hidden>
            <label class="col-sm-4 control-label no-padding-right">用户编号：</label>
            <input id="txt-userId" type="text" value="<%=custNo%>" />
        </div>
        <div class="form-group">
            <label class="col-sm-4 control-label no-padding-right">交易类型：</label>
            <select id="sl-tradeType" disabled>
                <%
                    for(var i = 0; i < TRADETYPE_MAP.length; i++){
                        if(TRADETYPE_MAP[i].id == tradeType){%>
                        <option value="<%=TRADETYPE_MAP[i].id %>" selected="selected"><%=TRADETYPE_MAP[i].name %></option>
                <%}else{%>
                        <option value="<%=TRADETYPE_MAP[i].id %>"><%=TRADETYPE_MAP[i].name %></option>
                <%}}%>
            </select>
        </div>
        <div class="form-group">
            <label class="col-sm-4 control-label no-padding-right">科目：</label>
            <input id="txt-subjectName" type="text" value="<%=model==null ? '' : model.subjectName %>" readonly />
        </div>
        <div class="form-group">
            <label class="col-sm-4 control-label no-padding-right">金额：</label>
            <input id="txt-before-amount" type="text" value="<%=model==null ? '' : model.amount%>" readonly />
        </div>
        <div class="form-group">
            <label class="col-sm-4 control-label no-padding-right">调整金额：</label>
            <input id="txt-after-amount" type="text" />
        </div>
    </div>
</form>