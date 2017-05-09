<li class="light-blue" style="border:0 none; margin-right:2px;">
    <a data-toggle="dropdown" href="javascript:;" class="dropdown-toggle" style="background-color: transparent !important; border-right: 1px solid #2e6589;">
        <span class="bigger-120" id="tbr-submodule">== 请选择 ==</span>
        <i class="icon-caret-down"></i>
    </a>

    <ul class="pull-right dropdown-menu dropdown-default dropdown-caret dropdown-close">
        <% _.each(submodules, function(submodule) { %>
        <li>
            <a href="javascript:;" data-module="<%= submodule.serviceName%>" data-default="<%= submodule.isDefault%>"><%= submodule.remark%></a>
        </li>
        <% }) %>
    </ul>
</li>

<li class="light-blue" style="border:0 none;">
    <a data-toggle="dropdown" href="javascript:;" class="dropdown-toggle" style="background-color: transparent !important;">
        <span class="user-info">
            <small>欢迎您</small>
            <%= user.name%>
        </span>
        <i class="icon-caret-down"></i>
    </a>

    <ul class="user-menu pull-right dropdown-menu dropdown-default dropdown-caret dropdown-close">
        <li>
            <a href="javascript:;" id="tbr-psw">
                <i class="icon-cog"></i>修改密码
            </a>
        </li>
        <li class="divider"></li>
        <li>
            <a href="javascript:;" id="tbr-logout">
                <i class="icon-off"></i>注销
            </a>
        </li>
    </ul>
</li>