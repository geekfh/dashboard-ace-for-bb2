<form onsubmit="return false;">
<div class="trade-container col-sm-5">
    <span class="order"><%- order %></span>
    <div class="min-trade-wrapper">
        <input type="text" class="min-trade" name="min-trade" <%=data.minTradeDisable ? 'disabled' : ''%>>
    </div>
    -
    <div class="max-trade-wrapper">
        <input type="text" class="max-trade" name="max-trade" <%=data.maxTradeDisable ? 'disabled' : ''%>>
    </div>
</div>
<div class="base-ratio-inner col-sm-3">
    <div class="base-ratio-wrapper">
        <input type="text" class="base-ratio" name="base-ratio">
    </div>
</div>
<div class="max-fee-container col-sm-3">
    <div class="max-fee-wrapper">
        <input type="text" class="max-fee" name="max-fee">
    </div>
</div>
<%
    if(data.canDelete !== false){
%>
<div class="col-sm-1">
    <i class="icon-minus-sign btn-delete" title="删除"></i>
</div>
<%
    }
%>
</form>