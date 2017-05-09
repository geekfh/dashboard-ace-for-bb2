
<div class="radio-check  <%=data.cls ? data.cls : ''%>">
    <%
    _.each(data.options, function (item) {
        if(data.defaultValue == item.value){%>
        <span><input type="radio" class="<%= data.cls%>" name="<%= data.cls%>" value="<%= item.value%>" checked /> <%= item.label%></span>
        <%}
        else{%>
            <span><input type="radio" class="<%= data.cls%>" name="<%= data.cls%>" value="<%= item.value%>" /> <%= item.label%></span>
        <%}
    });
    %>
</div>