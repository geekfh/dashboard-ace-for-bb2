<label radio-explorer-id="<%=id%>">
    <input type="radio" name="explorer" class="radio-btn">
    <span class="name" title="<%=name%>"><%=name%></span>
    <span class="remark">
        <span class="org-name" title="<%=orgName%>"><%=orgName%></span>
        <%
        if(parentName) {
        %>
            <span class="parent-org-name" title="隶属 <%=parentName%>"> &#8594; 隶属 <%=parentName%></span>
        <%
        }
        %>
    </span>

</label>
