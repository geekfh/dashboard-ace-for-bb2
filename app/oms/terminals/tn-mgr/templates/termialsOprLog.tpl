<%
    var OPERATION_TYPE = {
        '0': '绑定',
        '1': '解绑',
        '2': '停用',
        '3': '注销',
        '4': '未激活',
        '5': '回收',
        '6': '调配',
        '7': '新增'
    }

%>
<div class="terminal-history-container">
    <span class="title">历史记录</span>
    <ul>
        <% _.each(items,function(item){%>
        <li>
            <span class="operation-time"><%=Opf.String.replaceFullDate(item.oprUpdateTime.toString(), '$1-$2-$3 $4:$5')%></span>
            <span class="operation-type"><%=OPERATION_TYPE[item.type]%></span>
            <% if(OPERATION_TYPE[item.type] === '调配'){ %>
                至 <span class="operation-target"><%=item.brhName%></span>
            <%
                } else if(OPERATION_TYPE[item.type] === '绑定'){
            %>
                至 <span class="operation-target"><%=item.mchtNo%></span>
            <%}%>
        </li>
        <%
        });
        %>
    </ul>
</div>
