<%
var TERMINALTYPE_MAP = {
"1" : "VI-POS",
"2" : "传统POS"
}
%>

<div>
    <table class="select-terminal-table">
        <thead>
        <tr>
            <th>终端号</th>
            <th>终端标识号</th>
            <th>终端类型</th>
            <th>终端机型</th>
            <th>所属商户号</th>
            <th>挂属机构代码</th>
            <th>直销网络拓展员</th>
        </tr>
        </thead>
        <tbody>
        <%_.each(items, function(item){%>
        <tr>
            <td><%=item.no%></td>
            <td><%=item.snNo%></td>
            <td><%=TERMINALTYPE_MAP[item.type]%></td>
            <td><%=item.termMachType%></td>
            <td><%=item.mchNo%></td>
            <td><%=item.termUsed%></td>
            <td>
                <%if(item.termUsed.indexOf('015') == 0){%>
                <div name="trTermUsed" class="trTermUsed" style="display:block;"></div>
                <%}else{%>
                <div name="trTermUsed" class="trTermUsed" style="display:none;"></div>
                <%}%>
            </td>
        </tr>
        <%})%>
        </tbody>
    </table>
</div>


