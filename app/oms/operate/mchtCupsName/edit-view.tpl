<%
    var STATUS_MAP = {
        0: '正常',
        1: '停用'
    };

    var tpl = [
        {label: 'chnlName', name: '所属通道'},
        {label: 'chnlCode', name: '渠道简写'},
        {label: 'chnlVCode', name: '虚拟渠道代号'},
        {label: 'chnlInstId', name: '收单机构代码'},
        {label: 'boxMchtNo', name: '盒子商户号'},
        {label: 'mchtName', name: '商户名称'},
        {label: 'mchtNo', name: '商户号'},
        {label: 'termNo', name: '终端号'},
        {label: 'regionCode', name: '地区码'},
        {label: 'mcc', name: '商户MCC码'},
        {label: 'mccGroup', name: '商户MCC组'},
        {label: 'feeRate', name: '费率'},
        {label: 'feeVal', name: '费率封顶'},
        {label: 'remark', name: '备注'},
        {label: 'tmkIndex', name: '密钥索引'},
        {label: 'tmkValue', name: 'TMK主密钥'},
        {label: 'tmkCv', name: '校验码'},
        {label: 'maxAmount', name: ' 单日最大额度'},
        {label: 'status', name: '启用状态', editable: 'checkbox', formatter: function(val){return STATUS_MAP[val];}},
        {label: 'changeDate', name: '日切时间'}
    ];

    var model = data;
%>

<div>
    <form name="FormPost" id="FrmGrid_mcht-cupsName-grid-table" class="FormGrid" onsubmit="return false;" style="width:auto;overflow:auto;position:relative;height:auto;">
        <table id="TblGrid_mcht-cupsName-grid-table" class="EditTable" cellspacing="0" cellpadding="0" border="0">
            <tbody>
            <% _.each(tpl, function(v, i){ %>
                <tr rowpos="<%=i%>" class="FormData" id="tr_<%=v.label%>">
                    <td class="CaptionTD"><%=v.name%></td>
                    <td class="DataTD">
                        <% if(v.editable == 'checkbox'){ %>
                        &nbsp;<select name="<%=v.label%>" class="FormElement ui-widget-content ui-corner-all form-value">
                        <% _.each(STATUS_MAP, function(s, k){ console.log(model[v.label]);%>
                            <option value="<%=k%>" <%=model[v.label] == k ? 'selected' : '' %> ><%=s%></option>
                        <% }); %>
                        </select>
                        <% } else {%>
                        &nbsp;<input type="text" name="<%=v.label%>" class="FormElement ui-widget-content ui-corner-all form-value" value="<%=model[v.label]%>" />
                        <% } %>
                    </td>
                </tr>
            <% }); %>
            </tbody>
        </table>
    </form>
</div>