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
    {lableEn: 'MERCHANT NAME', lable: '商户名称',   name: 'ibox43'},
    {lableEn: 'MERCHANT NO',   lable: '商户编号',   name: 'ibox42'},
    {lableEn: 'TERMINAL ID',   lable: '终端编号',   name: 'iboxNo'},
    {lableEn: 'OPERATOR NO',   lable: '操作员号',   name: 'expand'},
    {lableEn: 'CARD NO',       lable: '卡号',       name: 'acNo'},
    {lableEn: 'ISS',           lable: '发卡行',     name: 'acBankName'},
    {lableEn: 'ACQ',           lable: '收单行',     name: 'acquirer'},
    {lableEn: 'TRANS TYPE',    lable: '交易类型',   name: 'name'},
    {lableEn: 'TRACE NO',      lable: '流水号',     name: 'traceNo'},
    {lableEn: 'BATCH NO',      lable: '批次号',     name: 'iboxBatchNo'},
    {lableEn: 'REFER NO',      lable: '参考号',     name: 'fd37'},
    {lableEn: 'AUTH NO',       lable: '授权号',     name: 'fd38'},
    {lableEn: 'DATE/TIME',     lable: '交易日期/时间',  name: 'tradeTime'},
    {lableEn: 'AMOUNT',        lable: '交易金额',    name: 'amt'},
    {lableEn: 'REFERENCE',     lable: '备注',       name: 'reference'}
];

%>

<div class="settle-txn-transaction">
    <div class="dotted-left"></div>
    <div class="dotted-right"></div>
    <div class="dotted-bottom"></div>



    <% if (data.templateType == 1) { %>
    <img src="assets/images/account-title-mcht.jpg" style="width: 100%;">
    <% } else { %>
    <img src="assets/images/account-title.jpg" style="width: 100%;">
    <% } %>
    <form class="transaction-form">
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

                        <span class="span-view">
                            <%= data[item.name] || '' %>
                        </span>

                    </td>
                </tr>

                <%
                });
                %>
                


            </tbody>

        </table>

        <table class="transaction-table">
            <tbody>
                <tr class="transaction-tr">
                    <td class="transaction-td2 transaction-td" style="width: 100%;">
                        CARDHOLDER SIGNATURE <br> 签名
                    </td>
                </tr>

                <tr class="transaction-tr">
                    <td class="transaction-td1 transaction-td">
                    <% if (data.signUrl) { %>
                        <% if (data.signUrl.indexOf('images') !== -1 || data.signUrl.indexOf('T') !== -1) { %>
                        <img style="width: 40%; height: 50px;" src="<%= data.signUrl %>">
                        
                        <% } else { %>
                        <img style="width: 40%; height: 50px;" src="<%= url._('transaction.getsign') + '?' + $.param(_.pick(data, 'signUrl', 'ibox42', 'orderNo')) %>">

                        <% } %> 
                    <% } %>
                    </td>
                </tr>
            </tbody>
        </table>

    </form>
</div>