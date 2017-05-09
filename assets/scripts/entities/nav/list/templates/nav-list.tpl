<%

    for(var i = 0, len = items.length; i < len; i++){

        var item = items[i];
        var hasChild = item.items && item.items.length;

        if(!item.rsId) {
            console.error('菜单没有配置资源ID', item.name);
        }
        
        if(!Ctx.avail(item.rsId)) {
          console.log('顶级菜单没有权限', item.name);
          continue;
        }
%>

    <li class="<%=item.className ? item.className: ''%>">
        <!-- start level 1 item content -->
        <a 
          href="<%= item.url || 'javascript:;'%>"
          class="<%= hasChild ?　'dropdown-toggle' : ''%>"
          data-trigger="<%= item.trigger || ''%>"
          data-deps="<%=item.deps ? item.deps.join(',') : '' %>"
            <%
              _.each(item.data, function (v, k) {
            %>
                data-<%=k%>="<%=v%>"
            <%
              });
            %>
        >
          <!-- icon -->
          <i class="menu-icon icon <%= item.iconCls || 'icon-double-angle-right'%>"></i>
          <!-- menu[item] text -->
          <span class="menu-text"> <%= item.name || ''%> </span>
          
          <!-- dropable arrow icon -->
          <%if (hasChild) {%>
            <b class="arrow icon-angle-down"></b>
          <%}%>
        </a>
        <!-- end level 1 item content -->

        <!-- start level 2 item content -->
        <%if (hasChild) {%>
          <ul class="submenu">
            <%=listTplFn({listTplFn: listTplFn, items: item.items})%>
          </ul>
        <%}%>
        <!-- end level 2 item content -->

    </li><!-- end of frist level item-->
    
<% } %>
