<li data-org-id="<%=id%>" class="org-item">
    <%if(hasChild){%>
    <input id="raido-org-<%=id%>" type="radio" name="org" class="radio-btn">
    <%}else{%>
    <span>&nbsp;&nbsp;</span>
    <%}%>
    <label for="raido-org-<%=id%>">
      <span class="name" title="<%=name%>"><%-name%></span>
      <span class="owner-tips" title="<%=orgLevel%>级机构 隶属于<%=parentName%><%=hasChild ? '' : '无下属机构'%>">
        <%-orgLevel%>级机构 隶属于<%-parentName%>
        <%=hasChild ? '' : '无下属机构'%>
      </span>
    </label>
</li>
