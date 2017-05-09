<style type="text/css">
    .style-inline-20170103155820>div {padding-top: 15px;}
    .style-inline-20170103155820 .form-control-inline {padding:5px 3px;height:34px;color:#858585;border:1px solid #ccc;}
    .style-inline-20170103155820 .form-control-inline:focus {-webkit-box-shadow: none;box-shadow: none;color: #696969;border-color: #f59942;background-color: #ffffff;outline: none;}
    .style-inline-20170103155820 label.error[for=codeMiddle],
    .style-inline-20170103155820 label.error[for=codeLast] {display:none !important;}
    .style-inline-20170103155820 input.error {border-color:red;}
</style>
<form class="container style-inline-20170103155820" role="form">
    <div class="form-horizontal">
        <div class="form-group">
            <label class="col-sm-3 control-label">权限码：</label>
            <div class="col-sm-8">
                <%
                var code = rowData.code||"";
                if(code!=="" && isOldCode(code, systemList)){
                %>
                <input class="form-control" type="text" name="code" required="xxx" value="<%=rowData.code||''%>">
                <% } else {
                    var codeArr = splitCode(code);
                %>
                <select class="form-control-inline col-sm-3" name="codeFirst">
                    <% _.each(systemList, function(item){ %>
                        <option value="<%=item.id%>" <%= codeArr[0]==item.serviceName? 'selected':''%>><%=item.serviceName%></option>
                    <% }) %>
                </select>
                <input class="form-control-inline col-sm-7" name="codeMiddle" required value="<%=codeArr[1]%>">
                <input class="form-control-inline col-sm-2" name="codeLast" required value="<%=codeArr[2]%>">
                <% } %>
            </div>
        </div>

        <div class="form-group">
            <label class="col-sm-3 control-label">权限名称：</label>
            <div class="col-sm-8">
                <input class="form-control" type="text" name="name" required value="<%=rowData.name||''%>">
            </div>
        </div>

        <div class="form-group">
            <label class="col-sm-3 control-label">菜单名称：</label>
            <div class="col-sm-8">
                <input class="form-control" type="text" name="resName" required value="<%=rowData.resName||''%>">
            </div>
        </div>
    </div>

    <div class="col-sm-8 col-sm-offset-3">
        <p class="text-warning">提示：菜单名称格式：AAA 或 AAA-BBB-CCC</p>
        <a target="_blank" href="http://wiki.iboxpay.com/pages/viewpage.action?pageId=19760046">运管权限码的配置规范</a>
    </div>
</form>
