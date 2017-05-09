
<%
    var STATUS = {
        'licenceNo':    '营业执照号码',
        'idNo':         '身份证号码',
        'phoneNo':      '手机号码',
        'orgCode':      '组织机构证号',
        'bankCardNo':   '收款银行号卡号'
    };
%>
<div class="add-blacklist-view">
    <div class="form-group">
        <label class="col-md-1 control-label">要素类型</label>
        <div class="col-md-2">
            <select class="form-control" name="type">
                <%  _.each(STATUS, function(i, v){%>
                <option value="<%=v %>"><%=STATUS[v]%></option>
                <%});%>
            </select>
        </div>
        <label class="col-md-1 control-label" style="width: 10%">要素内容</label>
        <div class="col-md-2">
            <input class="form-control" type="text" name="value">
        </div>
        <label class="col-md-2 control-label" style="width: 14%">备注</label>
        <div class="col-md-3">
            <input class="form-control" type="text" name="remark">
        </div>
        <div class="ui-pg-div">
            <span class="ui-icon icon-plus-sign blue" style="margin: 5px 0 0 0px;"></span>
        </div>
    </div>
</div>