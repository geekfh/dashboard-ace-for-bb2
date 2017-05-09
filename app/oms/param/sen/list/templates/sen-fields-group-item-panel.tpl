<%
    var _collapseTargetId = 'collapseTarget' + Opf.Utils.id();
    var dataParent = false ? '#accordion' : '#hack-' + Opf.Utils.id();
    var isExpand = true;
%>
<div class="panel-heading">
    <h4 class="panel-title">
        <a class="accordion-toggle <%=isExpand ? '' : 'collapsed'%>"
            data-parent="<%=dataParent%>"
            data-toggle="collapse" 
            href="#<%=_collapseTargetId%>"> 

            <i class="icon-angle-down bigger-110" data-icon-hide="icon-angle-down" data-icon-show="icon-angle-right"></i>
            <%=classNameDesc%>
        </a>
    </h4>
</div>

<div class="panel-collapse <%=isExpand ? 'in' : 'collapse'%>" id="<%=_collapseTargetId%>">
    <div class="panel-body">
        <table class="fields-table">
            
            <tbody class="fields-ct"></tbody>
        </table>
    </div>
</div>
