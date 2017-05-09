<div>
    <table class="select-terminal-table">
        <thead>
        <tr>
            <th>商户名称</th>
            <th>商户类型</th>
            <th>商户号</th>
        </tr>
        </thead>
        <tbody>
        <%_.each(items, function(item){%>

        <tr>
            <td><%=item.mchtName%></td>
            <td><%=item.kind%></td>
            <td><%=item.mchtNo%></td>
        </tr>

        <%})%>
        </tbody>
    </table>
</div>