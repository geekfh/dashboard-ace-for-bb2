<!-- 商户补充资料审核之前再次确认弹窗 -->
<div class="container">
    <div style="margin-top:5px; margin-bottom:15px; border-bottom: 1px solid #E4E9EE;">
        <strong style="line-height: 32px;">请确认审核结果</strong>
    </div>
    <%
    var isReject = false;
    _.each(data, function(item){
        if(item.isOk === false){
            isReject = true;
        }
    %>
    <div class="row">
        <div class="col-xs-5" style="text-align: right;"><%=item.label%></div>
        <div class="col-xs-7"><%=item.isOk? '<span class="green">审核通过</span>':'<span class="red">审核不通过</span>'%></div>
    </div>
    <% }) %>

    <% if(isReject){ %>
    <div style="margin-top:5px; border-bottom: 1px solid #E4E9EE;">
        <strong style="line-height: 32px;">审核意见</strong>
    </div>
    <!-- 拒绝内容 -->
    <form class="reject-form">
        <div class="row" style="padding-top:10px;">
            <div class="col-xs-1"></div>
            <div class="col-xs-11">
                <div class="reject-container"></div>
            </div>
        </div>
    </form>
    <% } %>
</div>