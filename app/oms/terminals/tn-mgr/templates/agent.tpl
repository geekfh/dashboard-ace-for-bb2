<!--
    用于展示每个大代理下的所有直属代理
-->
<%
var _collapseTargetId = 'collapseTarget' + Opf.Utils.id();
var dataParent = false ? '#accordion' : '#hack-' + Opf.Utils.id();
var isExpand = false;
%>
<div class="panel-heading <%=isExpand ? '' : 'collapsed'%>">
    <div class="panel-title">
        <a class="row accordion-toggle collapsed"
           data-parent="<%=dataParent%>"
           data-toggle="collapse"
           href="#<%=_collapseTargetId%>">

            <span class="col-sm-4 brh-name"><%- brhName %></span><span class="col-sm-3 term-used-total">挂属终端：<%- termUsedTotal %>台</span><span class="col-sm-3 term-bound-total">绑定终端：<%- termBoundTotal %>台</span>
            <i class="col-sm-2 icon-sort-down bigger-110" data-icon-hide="icon-sort-up" data-icon-show="icon-sort-down"></i>
        </a>
    </div>
</div>

<div class="panel-collapse <%=isExpand ? 'in' : 'collapse'%>" id="<%=_collapseTargetId%>">
    <div class="panel-body">
        <div class="fields-ct"></div>
    </div>
</div>
