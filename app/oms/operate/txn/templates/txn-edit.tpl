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

var ibox42_map = {
    0: 'ibox42',
    1: 'cupsMchtNo'
};

var iboxNo_map = {
    0: 'iboxNo',
    1: 'fd41'
};

var traceNo_map = {
    0: 'traceNo',
    1: 'fd11'
};

var iboxBatchNo_map = {
    0: 'iboxBatchNo',
    1: 'batchNo'
};


var TRANS_CONFIG = [
    {lable: '商户名称',     name: 'ibox43',  editType: 'input'},
    {lable: '商户编号',     name: 'ibox42',  editType: 'select', selVals: ibox42_map},
    {lable: '终端编号',     name: 'iboxNo',  editType: 'input', selVals: iboxNo_map},
    {lable: '操作员号',     name: 'expand',  editType: 'input'},
    {lable: '卡号',         name: 'acNo',    editType: 'input'},
    {lable: '发卡行',       name: 'acBankName',    editType: 'input'},
    {lable: '收单行',       name: 'acquirer',    editType: 'input'},
    {lable: '交易类型',     name: 'name',    editType: 'select', selVals: SubCodeType},
    {lable: '流水号',       name: 'traceNo',    editType: 'input', selVals: traceNo_map},
    {lable: '批次号',       name: 'iboxBatchNo', editType: 'input', selVals: iboxBatchNo_map},
    {lable: '参考号',       name: 'fd37',        editType: 'input'},
    {lable: '授权号',       name: 'fd38',      editType: 'input'},
    {lable: '交易日期/时间',  name: 'tradeTime',   editType: 'input', placeholder: '年-月-日 时:分:秒'},
    {lable: '交易金额',       name: 'amt',         editType: 'input'},
    {lable: '备注',   name: 'reference',  editType: 'textarea', viewable: '' },
    {lable: '签名', name: 'signUrl',     editType: '', extraClassName: 'sign-img'},
    {lable: '订单号',     name: 'orderNo', editType: 'input', viewable: 'hidden'},
    {lable: '交易类型',   name: 'subCode',     editType: 'input', viewable: 'hidden'},
    {lable: '交易状态',   name: 'stat',        editType: 'input', viewable: 'hidden'},
    {lable: '账户开户行号',   name: 'bankNo',        editType: 'input', viewable: 'hidden'},
    {lable: 'id', name: 'id',      editType: 'input', viewable: 'hidden'}
];

%>

<form class="edit-txn" target="settleTxnTrans" action="api/utils/sign-purchase-order/export-signOrder" method="post">
    <table class="transaction-edit">
        <tbody>

            <tr class="tr-edit">
                <td class="td-edit1 td-head">签购单</td>
                <td class="td-edit2 td-head">
                     <label class="select-label">
                         <input type="radio" name="templateType" value="1" checked>
                         <span>商户模板</span>
                     </label>
                    <label class="select-label">
                        <input type="radio" name="templateType" value="2">
                        <span>持卡人模板</span>
                    </label>
                </td>
            </tr>

            <%
                var vname = data[TRANS_CONFIG[17].name] == null ? '' : data[TRANS_CONFIG[17].name];
                var str_char = vname.charAt(0);
                if(str_char == 3 || str_char == 4){
                    console.log('>>>>>>>>磁条卡');
                    TRANS_CONFIG[14].viewable = 'hidden';
                }
                else if(str_char == 5 || str_char == 6){
                    console.log('>>>>>>>>IC卡');
                    TRANS_CONFIG[14].viewable = '';
                }
                else{
                    console.log('>>>>>>>>txn-edit.tpl');
                }
            %>

            <%
            _.each(TRANS_CONFIG, function (item) {
            %>
            <tr class="tr-edit" <%=item.viewable === 'hidden' ? 'hidden' : '' %>>

                <td class="td-edit1">
                    <%=item.lable %>
                </td>

                <td class="td-edit2 <%= item.extraClassName || '' %>">

                    <% if (item.editType === 'input') { %>
                        <% if (item.name === 'iboxNo' || item.name === 'traceNo' || item.name === 'iboxBatchNo') { %>
                            <input class="input-edit" name="<%=item.name %>" <%=item.placeholder ? 'placeholder="' + item.placeholder + '"' : '' %> type="text" value="<%=data[item.name] || '' %>" />
                                <% _.each(item.selVals, function (val, key) { %>
                                    <li index="<%=val %>" style="display: none;"><%=data[val]%></li>
                                <% });%>

                        <% }else{%>
                            <input class="input-edit" name="<%=item.name %>" <%=item.placeholder ? 'placeholder="' + item.placeholder + '"' : '' %> type="text" value="<%=data[item.name] || '' %>" />
                        <% }%>
                    <% } %>


                    <% if (item.editType === 'select') { %>
                    <select class="select-edit" name="<%=item.name %>">
                        <% if (item.name === 'ibox42' || item.name === 'iboxNo' || item.name === 'traceNo' || item.name === 'iboxBatchNo') {
                            _.each(item.selVals, function (val, key) { %>
                                <option index="<%=key%>" value="<%=data[val] %>" <%=val === data[val] ? 'selected' : '' %>><%=data[val]%></option>
                            <% });%>
                        <% }else{
                                _.each(item.selVals, function (text, val) { %>
                                <option value="<%=val %>" <%=val === data[item.name] ? 'selected' : '' %>><%=text%></option>
                        <% });}%>
                    </select>
                    <% } %>

                    <% if(item.editType === 'textarea' && item.viewable === ''){
                    if(data[item.name] != null){%>
                    <label name="<%=item.name%>" style="width: auto; height: auto; padding: 5px;" readonly="readonly" >
                        <% _.each(data[item.name].split('\n'), function(value){%>
                        <p><%= value %></p>
                        <% }); %>
                    </label>
                    <% }} %>
                </td>
            </tr>

            <%
            });
            %>


        </tbody>
    </table>

    <input type="text" name="signUrl" style="display: none;" />

    <input type="text" name="isNewSignUrl" style="display: none;" />

    <input type="text" name="csn" style="display: none;" />
    <input type="text" name="unprNo" style="display: none;" />
    <input type="text" name="aip" style="display: none;" />
    <input type="text" name="arqc" style="display: none;"  />
    <input type="text" name="tvr" style="display: none;" />
    <input type="text" name="tsi" style="display: none;" />
    <input type="text" name="aid" style="display: none;" />
    <input type="text" name="atc" style="display: none;" />
    <input type="text" name="termCap" style="display: none;" />
    <input type="text" name="iad" style="display: none;" />
    <input type="text" name="appLab" style="display: none;" />
    <input type="text" name="appName" style="display: none;"/>

</form>

<a class="upload-sign">上传签名</a>
<a class="btn btn-primary btn-preview"> 预 览 </a>
<a class="btn btn-primary btn-download"> 导 出 </a>
<a class="delete-uploaded-picture" style="display: none;">删除照片</a>