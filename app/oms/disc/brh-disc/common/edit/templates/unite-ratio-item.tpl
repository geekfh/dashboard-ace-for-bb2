<form>
    <div class="trade-container col-sm-8">
    <span class="order"><%- order %></span>
    <div class="min-trade-wrapper">
        <input type="text" class="min-trade" name="min-trade" <%=data.minTradeDisable ? 'disabled' : ''%>>
    </div>
    -
    <div class="max-trade-wrapper">
        <input type="text" class="max-trade" name="max-trade" <%=data.maxTradeDisable ? 'disabled' : ''%>>
    </div>
</div>
<div class="profit-container col-sm-3">
    <div class="profit-ratio-wrapper">
        <input type="text" class="profit-ratio" name="profit-ratio" >
    </div>

</div>
<%
    if(data.canDelete !== false){
%>
    <div class="">
        <i class="icon-minus-sign btn-delete" title="删除"></i>
    </div>
<%
    }
%>
</form>