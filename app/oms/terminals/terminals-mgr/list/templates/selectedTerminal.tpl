<%
    var TERMINALTYPE_MAP = {
            "1" : "VI-POS",
            "2" : "传统POS"
        }
%>

<div>
    <table class="select-terminal-table">
        <thead>
            <tr>
                <th>终端号</th>
                <th>终端标识码</th>
                <th>终端类型</th>
                <th>终端机型</th>
                <th>所属商户号</th>
                <th>机构名称</th>
            </tr>
        </thead>
        <tbody>
            <%_.each(items, function(item){%>
            
            <tr>
                <td><%=item.no%></td>
                <td><%=item.snNo%></td>
                <td><%=TERMINALTYPE_MAP[item.type]%></td>
                <td><%=item.termMachType%></td>
                <td><%=item.mchtNo%></td>
                <td><%=item.branchNo%></td>
            </tr>

            <%})%>
        </tbody>
    </table>
    <div class="terminals-operation-msg">
        <div>
            <span class="title">描述(必填)</span>
            <textarea class="operation-msg" name="operation-msg"></textarea>
        </div>
        <div name="describe" class="error-msg" hidden>请填写操作描述</div>
    </div>
</div>