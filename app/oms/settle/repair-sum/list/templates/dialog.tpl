<div>
    <form class="FormGrid" style="width:auto;overflow:auto;position:relative;height:auto;">
        <table class="EditTable">
            <tbody>
                <tr style="display:none" class="tinfo">
                    <td class="topinfo" colspan="2"></td>
                </tr>

                <% if (needAmt) { %>
                <tr class="FormData">
                    <td class="CaptionTD">交易金额</td>
                    <td class="DataTD">
                        &nbsp;
                        <input type="text"  name="amt" role="textbox" class="FormElement ui-widget-content ui-corner-all"></td>
                </tr>
                <% } %>

                <tr class="FormData">
                    <td class="CaptionTD">操作描述</td>
                    <td class="DataTD">
                        &nbsp;
                        <textarea name="oprDesc" cols="20" role="textbox" multiline="true" class="FormElement ui-widget-content ui-corner-all"></textarea>
                    </td>
                </tr>

            </tbody>
        </table>
    </form>
</div>