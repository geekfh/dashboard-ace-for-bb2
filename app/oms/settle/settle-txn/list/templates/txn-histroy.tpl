<%
var settleOprs = data.settleOprs || [];
%>
<div class="view-history-container">
<span class="title">设为成功历史记录</span>
<ul>
    <%if(settleOprs.length){%>
        <% _.each(settleOprs,function(item){%>
        <li>
            <span class="operation-time"><%=Opf.String.replaceFullDate(item.oprTime, '$1-$2-$3 $4:$5')%></span>
            <span class="operation-Name"><%=item.oprName%></span>
            <span class="operation-desc"><%=item.oprDescr%></span>
        </li>
        <% });%>
    <%}else{%>
        <span>无</span>
    <%}%>
</ul>
</div>
