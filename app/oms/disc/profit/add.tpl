<%
for(var i = 1; i <= 1; i++) {
var style ='';
%>
<div id="disc-part-addview" class="part-<%=i%>"<%=style%>>
<form id="profit-grid-form" class="FormGrid" onsubmit="return false;">
    <table id="profit-grid-table" class="EditTable" cellspacing="0" cellpadding="0" border="0">
        <tbody>
        <tr id="FormError" style="display:none">
            <td class="ui-state-error" colspan="2"></td>
        </tr>
        <tr style="display:none" rowpos="1" class="FormData" id="tr_id" name="tr_id">
            <td class="CaptionTD">编号</td>
            <td class="DataTD">
                &nbsp;
                <input type="text" id="id" name="id" name="id" role="textbox" class="FormElement ui-widget-content ui-corner-all">
            </td>
        </tr>
        <tr rowpos="2" class="FormData" id="tr_name">
            <td class="CaptionTD">名称</td>
            <td class="DataTD">
                &nbsp;
                <input type="text" id="name" name="name" role="textbox" class="FormElement ui-widget-content ui-corner-all">
            </td>
        </tr>
        <tr rowpos="3" class="FormData" id="tr_serviceName">
            <td class="CaptionTD">关联服务</td>
            <td class="DataTD">
                &nbsp;
                <input type="text" class="js-example-data-array" id="serviceName" name="serviceName" style="width: 182px;">
            </td>
        </tr>
        <tr rowpos="4" class="FormData" id="tr_branchCode">
            <td class="CaptionTD">清算机构编号</td>
            <td class="DataTD">
                &nbsp;
                <input type="text" id="branchCode" name="branchCode" style="width: 182px;">
            </td>
        </tr>
        <tr rowpos="5" class="FormData" id="tr_branchName" style="display: none;">
            <td class="CaptionTD">清算机构</td>
            <td class="DataTD">
                &nbsp;
                <!--<input type="text" id="branchName" name="branchName" style="width: 182px;">-->
            </td>
        </tr>
        <tr rowpos="6" class="FormData" id="tr_status">
            <td class="CaptionTD">状态</td>
            <td class="DataTD">
                &nbsp;
                <select role="select" id="status" name="status" size="1" class="FormElement ui-widget-content ui-corner-all">
                    <option role="option" value="0">启用</option>
                    <option role="option" value="1">停用</option>
                </select>
            </td>
        </tr>
        <tr class="FormData" style="display:none">
            <td class="CaptionTD"></td>
            <td colspan="1" class="DataTD"></td>
        </tr>
        </tbody>
    </table>
</form>
</div>
<%
}
%>