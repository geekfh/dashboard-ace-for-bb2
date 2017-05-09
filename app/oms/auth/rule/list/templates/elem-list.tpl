<ul>
<%
_.each(list, function (item) {
%>
    <li><%=getText(item.value)%></li>
<%
});
%>
</ul>