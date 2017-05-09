<%

var SubCodeType = {
    'POS余额查询' : 'POS余额查询',
    'POS消费'     : 'POS消费',
    'POS消费冲正' : 'POS消费冲正',
    'POS消费撤销' : 'POS消费撤销',
    'POS消费撤销冲正' : 'POS消费撤销冲正',
    'POS退货'         : 'POS退货'
};

var statType = {
    '0' : '成功应答',
    '1' : '请求',
    '2' : '已冲正',
    '3' : '已撤销',
    '4' : '已确认',
    '5' : '部分退货',
    '6' : '全部退货',
    '7' : '交易异常'
};

var TRANS_CONFIG = [
    {lableEn: 'MERCHANT NAME', lable: '商户名称',   name: 'ibox43',  editType: 'input'},
    {lableEn: 'ORDER NO', lable: '订单号',     name: 'orderNo', editType: 'input'},
    {lableEn: 'MERCHANT NO', lable: '商户编号',   name: 'ibox42',  editType: 'input'},
    {lableEn: 'TERMINAL ID', lable: '终端编号',   name: 'iboxNo',  editType: 'input'},
    {lableEn: 'CARD NO', lable: '卡号',       name: 'acNo',    editType: 'input'},
    {lableEn: 'TRANS TYPE', lable: '交易类型',   name: 'name',    editType: 'select', selVals: SubCodeType},
    {lableEn: 'TRANS TYPE', lable: '交易类型',   name: 'subCode',     editType: 'input', edit: false, viewable: 'hidden'},
    {lableEn: '', lable: '交易状态',   name: 'stat',        editType: 'select', selVals: statType, viewable: 'hidden'},
    {lableEn: 'BATCH NO', lable: '批次号',     name: 'iboxBatchNo', editType: 'input'},
    {lableEn: 'VOUCHER NO', lable: '凭证号',     name: 'ibox11',      editType: 'input'},
    {lableEn: 'AUTH NO', lable: '授权码',     name: 'fd38',        editType: 'input'},
    {lableEn: 'REFER NO', lable: '检索参考号', name: 'fd37',        editType: 'input'},
    {lableEn: 'DATE/TIME', lable: '日期/时间',  name: 'date',        editType: 'input'},
    {lableEn: 'DATE/TIME', lable: '日期/时间',  name: 'time',        editType: 'input', viewable: 'hidden'},
    {lableEn: 'AMOUNT', lable: '金额',       name: 'amt',         editType: 'input', edit: false},

];

%>

<div class="settle-txn-transaction">
    <div class="dotted-left"></div>
    <div class="dotted-right"></div>
    <div class="dotted-bottom"></div>

    <img src="assets/images/account-title.jpg" style="width: 100%;">
    <form class="transaction-form" target="settleTxnTrans" action="api/settle/trade-water/export-salesSlip" method="post">
        <table class="transaction-table">
            
            <tbody>

                <%
                _.each(TRANS_CONFIG, function (item) {
                %>
                <tr class="transaction-tr" <%=item.viewable === 'hidden' ? 'hidden' : '' %>>

                    <td class="transaction-td1 transaction-td">
                        <%=item.lableEn %><br><%=item.lable %>
                    </td>

                    <td class="transaction-td2 transaction-td">

                        <span class="span-view <%=item.edit === false ? '' : 'view-data'%>">
                            <% if (item.editType === 'select') { %>
                                <%= item.selVals[data[item.name]] || '' %>
                            <% } else { %>
                                <%= data[item.name] || '' %>
                            <% } %>
                        </span>

                        <div style="display: none;" class="<%=item.edit === false ? '' : 'edit-data'%>">

                            <% if (item.editType === 'input') { %>
                            <input class="input-edit" name="<%=item.name %>" type="text" value="<%=data[item.name] || '' %>">
                            <% } %>


                            <% if (item.editType === 'select') { %>
                            <select class="input-edit" name="<%=item.name %>">
                                <% _.each(item.selVals, function (text, val) { %>
                                <option value="<%=val %>" <%=val === data[item.name] ? 'selected' : '' %>><%=text%></option>
                                <% }); %>
                            </select>
                            <% } %>

                        </div>

                    </td>
                </tr>

                <%
                });
                %>


            </tbody>

        </table>
    </form>
</div>