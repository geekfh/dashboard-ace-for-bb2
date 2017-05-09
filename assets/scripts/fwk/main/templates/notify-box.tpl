<a data-toggle="dropdown" class="dropdown-toggle" href="#">
    <i class="icon-bell-alt"></i>
    <span class="badge badge-important"><%=unreadNum%></span>
</a>

<ul class="pull-right dropdown-navbar dropdown-menu dropdown-caret dropdown-close">
    <li class="dropdown-header">
        共<%=totalNum%>条公告
    </li>
    <li>
        <% if(unreadNum > 0){ %>
        <a class="notify-btn" href="#">
            <div class="clearfix">
                <span class="pull-left">
                    未读公告
                </span>
                <span class="pull-right badge badge-info">+<%=unreadNum%></span>
            </div>
        </a>
        <% }else{ %>
        <span style="color:#3a87ad;">没有未读公告</span>
        <%}%>
    </li>
</ul>
