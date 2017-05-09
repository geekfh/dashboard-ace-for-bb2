<%
function dateFormatter(val) {
return val ? moment(val, 'YYYYMMDD').format('YYYY/MM/DD') : '';
}

function timeFormatter(val) {
return val ? moment(val, 'YYYYMMDDHHmm').format('YYYY/MM/DD HH:mm') : '';
}
%>
<div class="edit-cancelorder">
    <table border="0" class="EditTable">
        <tbody>
            <tr class="FormData">
                <td class="col-label">&nbsp;&nbsp;订单ID：</td>
                <td class="col-text"><%-id%></td>
            </tr>
            <tr class="FormData">
                <td class="col-label">&nbsp;&nbsp;录入日期：</td>
                <td class="col-text"><%-createTime%></td>
            </tr>
            <tr class="FormData">
                <td class="col-label">&nbsp;&nbsp;交易时间：</td>
                <td class="col-text"><%-timeFormatter(tradeTime)%></td>
            </tr>
            <tr class="FormData">
                <td class="col-label">&nbsp;&nbsp;交易商户：</td>
                <td class="col-text"><%-mchtName%></td>
            </tr>
            <tr>
                <td class="col-label">&nbsp;&nbsp;商户备注</td>
                <td class="col-text">
                    <textarea name="mehtremark" class="text-control" maxlength ="50"
                    onchange="this.value=this.value.substring(0, 50);" onkeydown="this.value=this.value.substring(0, 50);" onkeyup="this.value=this.value.substring(0, 50);"
                    style="width: 180px; height: 50px;" placeholder="备注不能超过50字"><%-mehtremark%></textarea>
                    <br>
                </td>
            </tr>
            <tr class="FormData">
                <td class="col-label">&nbsp;&nbsp;商户联系电话：</td>
                <td class="col-text"><%-phone%></td>
            </tr>
            <tr class="FormData">
                <td class="col-label">&nbsp;&nbsp;交易卡号：</td>
                <td class="col-text"><%-tradeCardNo%></td>
            </tr>
            <tr class="FormData">
                <td class="col-label">&nbsp;&nbsp;交易金额：</td>
                <td class="col-text" name="tr_tradeAmt"><%-tradeAmt%><font name="f_tradeAmt" style="color: #ff0000; padding-left: 100px;"></font></td>
            </tr>
            <tr class="FormData">
                <td class="col-label">&nbsp;&nbsp;退货金额：</td>
                <td class="col-text"><input type="text" name="refundedAmt" value="<%=refundedAmt %>" />元</td>
            </tr>
            <tr class="FormData">
                <td class="col-label">&nbsp;&nbsp;商管处理人：</td>
                <td class="col-text"><%-cancelOrderSG%></td>
            </tr>
            <tr class="FormData">
                <td class="col-label">&nbsp;&nbsp;清算处理人：</td>
                <td class="col-text"><%-cancelOrderQS%></td>
            </tr>
            <tr class="FormData">
                <td class="col-label">&nbsp;&nbsp;商管处理时间：</td>
                <td class="col-text"><%-dateFormatter(cancelOrderSGTime)%></td>
            </tr>
            <tr class="FormData">
                <td class="col-label">&nbsp;&nbsp;清算处理时间：</td>
                <td class="col-text"><%-dateFormatter(cancelOrderQSTime)%></td>
            </tr>
            <tr class="FormData">
                <td class="col-label">&nbsp;&nbsp;处理时间：</td>
                <td class="col-text"><%-timeFormatter(updateTime)%></td>
            </tr>
            <tr class="FormData">
                <td class="col-label">&nbsp;&nbsp;处理状态：</td>
                <td class="col-text">
                <%
                    _.each(statusMap,function(val,key){

                    %>
                    <input type="checkbox" name="dealStatus" value="<%= key %>" <%= dealStatus == key ? 'checked' : '' %> ><span><%= val %></span>

                    <%
                        });

                    %>
                </td>
            </tr>
            <tr>
                <td class="col-label">&nbsp;&nbsp;备注</td>
                <td class="col-text">
                    <textarea name="remark" class="text-control" style="width: 180px; height: 93px;"><%-remark%></textarea>
                    <br>
                </td>
            </tr>
        </tbody>

    </table>

</div>