<%
    _.each(items, function (item) {
%>
        <li><a class="field-type-menu-item" data-type="<%=item.type%>" href="javascript: void 0"><%=_.findWhere(fieldMap, {type: item.type}).label%></a></li>
<%
    });
%>

