<%
    function timeFormatter(val) {
        return Opf.String.replaceFullDate(val.toString(), '$1年$2月$3日$4时$5分');
}
    var STATUS_MAP = {
        "1": "邀请",
        "0": "达标",
        "2": "已开通",
        "3": "停止",
        "4": "复核不通过"
    };
    var TARGETTYPE_MAP = {
        "1": "商户",
        "2": "机构"
    };
%>


<div>
    <table class="table table-bordered">
        <thead>
        <tr>
            <th>对象编号</th>
            <th>服务名称</th>
            <th>服务类型</th>
            <th>对象类型</th>
            <th>开通状态</th>
            <th>开通时间</th>
            <th>结束时间</th>
        </tr>
        </thead>
        <tbody>
        <%_.each(items, function(item){%>

        <tr>
            <td><%=item.serviceObjectId%></td>
            <td><%-item.name%></td>
            <td><%=item.type%></td>
            <td><%=TARGETTYPE_MAP[item.targetType]%></td>
            <td><%=STATUS_MAP[item.status]%></td>
            <td><%=timeFormatter(item.openTime)%></td>
            <td><%=timeFormatter(item.closeTime)%></td>
        </tr>

        <%})%>
        </tbody>
    </table>
</div>