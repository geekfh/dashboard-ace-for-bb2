<%
    var USERTYPE_MAP = [
        {id: 1, value: '商户'},
        {id: 2, value: '地推'},
        {id: 3, value: '代理商'}
    ];
%>
<form>
    <div class="div_hd_error" style="border-color: #eed3d7;background-color: #f2dede;margin-top:-4px;padding: 10px 0 10px 0;display: none;">
        <center><a class="hd_error" style="color: #b94a48;"></a></center>
    </div>
    <div style="padding: 20px;">
        <div class="form-group">
            <label class="col-sm-4 control-label no-padding-right">用户类型：</label>
            <select id="sl-userType">
                <%for(var i = 0; i < USERTYPE_MAP.length; i++){%>
                    <option value="<%=USERTYPE_MAP[i].id%>"><%=USERTYPE_MAP[i].value%></option>
                <%}%>
            </select>
        </div>
        <div class="form-group" id="div-outTradeNo">
            <label class="col-sm-4 control-label no-padding-right">用户名称：</label>
            <input id="outTradeNo" type="text" disabled="disabled" />
        </div>
        <div class="form-group">
            <label class="col-sm-4 control-label no-padding-right">账户：</label>
            <select id="sl-userName"></select>
            <!--<input id="hd-userid" type="hidden" />-->
            <!--<input id="txt-userName" type="text" readonly />-->
        </div>
        <div class="form-group">
            <label class="col-sm-4 control-label no-padding-right">科目：</label>
            <input id="userSubjectName" type="text" />
        </div>
        <div class="form-group">
            <label class="col-sm-4 control-label no-padding-right">记账金额：</label>
            <input id="amount" type="text" />
        </div>
    </div>
</form>