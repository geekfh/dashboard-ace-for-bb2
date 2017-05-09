<%
for(var i = 1; i <= 1; i++) {
    var style ='';
%>
<div class="part-<%=i%>"<%=style%>>
    <form name="FormPost" id="xxxFrmGrid_discs-grid-table" class="FormGrid" onsubmit="return false;" style="">
        <table id="xxxTblGrid_discs-grid-table" class="EditTable" cellspacing="0" cellpadding="0" border="0">
            <tbody>
                <tr id="FormError" style="display:none">
                    <td class="ui-state-error" colspan="2"></td>
                </tr>
                <tr style="display:none" class="tinfo">
                    <td class="topinfo" colspan="2"></td>
                </tr>
                <tr style="display:none" rowpos="1" class="FormData" id="tr_id">
                    <td class="CaptionTD"></td>
                    <td class="DataTD">
                        &nbsp;
                        <!-- <input type="text" id="id" name="id" role="textbox" class="FormElement ui-widget-content ui-corner-all">--></td>
                </tr>
                <tr rowpos="2" class="FormData" id="tr_name">
                    <td class="CaptionTD">名称</td>
                    <td class="DataTD">
                        &nbsp;
                        <input type="text" id="name" name="name" role="textbox" class="FormElement ui-widget-content ui-corner-all"></td>
                </tr>
                <tr rowpos="3" class="FormData" id="tr_type">
                    <td class="CaptionTD">类型</td>
                    <td class="DataTD">
                        &nbsp;
                        <select role="select" id="type" name="type" size="1" class="FormElement ui-widget-content ui-corner-all">

                            <option role="option" value="serv">服务手续费率/分润模型</option>
                            <option role="option" value="rewd">服务奖励分润模型</option>

                            <!-- <option role="option" value="mcht">商户手续费率</option>
                            <option role="option" value="sale">商户基准销售费率</option>
                            <option role="option" value="brh">机构服务费率</option> -->
                        </select>
                    </td>
                </tr>
                <!-- <tr rowpos="4" class="FormData" id="tr_branchCode">
                    <td class="CaptionTD">适用机构</td>
                    <td class="DataTD">
                        &nbsp;
                        <select role="select" id="branchCode" name="branchCode" size="1" class="FormElement ui-widget-content ui-corner-all">
                        </select>
                    </td>
                </tr> -->
                <!-- <tr rowpos="4" class="FormData" id="tr_branchCode">
                <td class="CaptionTD">机构编号</td>
                <td class="DataTD">
                    &nbsp;
                    <input type="text" id="branchCode" name="branchCode" role="textbox" class="FormElement ui-widget-content ui-corner-all"></td>
            </tr>
            <tr rowpos="5" class="FormData" id="tr_branchName">
                <td class="CaptionTD">机构名称</td>
                <td class="DataTD">
                    &nbsp;
                    <input type="text" id="branchName" name="branchName" role="textbox" class="FormElement ui-widget-content ui-corner-all"></td>
            </tr>
            -->
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
                <td colspan="1" class="DataTD">
                    <!-- <input class="FormElement" id="id_g" type="text" name="discs-grid-table_id" value="5">--></td>
            </tr>
        </tbody>
    </table>
</form>
</div>
<%
}
%>