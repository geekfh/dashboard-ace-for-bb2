<%
    var defaultItem;
    if(data.defaultValue) {
        defaultItem = _.findWhere(data.menu, {value:data.defaultValue});
    }
%>
<div class="dropdown dropdown-switch <%=data.cls ? data.cls : ''%>">
    <button ref="<%=defaultItem ? defaultItem.value: ''%>" type="button" class="picker-btn" data-toggle="dropdown">
        <span class="text btn-text"><%=defaultItem ? defaultItem.label : '- 请选择 -' %></span>
        <span class="caret"></span>
    </button>
    <ul class="dropdown-menu" <% if(data.menu.length>10) { %> style="height: 260px; overflow: auto;" <% } %>>
    <%
    var itemTpl;
    _.each(data.menu, function (item) {
        var needHidden = item.hidden ? ' hidden' : '';
    %>
        <%=item === "-" ? 
            '<li role="presentation" class="divider"></li>':
            '<li'+ needHidden +'><a href="#" value="'+item.value+'">'+item.label+'</a></li>'%>
    <%
    });
    %>
    </ul>
</div>