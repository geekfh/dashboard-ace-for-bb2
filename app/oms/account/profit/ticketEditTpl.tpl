<%
    var REWARDSTATUS_MAP = {
        3: "待贴票",
        4: "待审核"
    };

    var sl_isTicket = {
        1: '贴票',
        2: '不贴票'
    };
%>

<div>
    <div id="div-check" style="padding: 20px 40px;">
        <div style="padding: 10px;">是否贴票：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <select id="isTicket" class="form-value">
            <% _.each(sl_isTicket, function(v, i){ %>
                <% if(model.isTicket == i){%>
                    <option value="<%=i%>" selected="selected"><%=v%></option>
                <%} else {%>
                    <option value="<%=i%>"><%=v%></option>
                <%}%>
            <% }); %>
            </select>
        </div>
        <div style="padding: 10px;">代扣税额：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input id="taxAmount" type="text" class="form-value" value="<%=model.taxAmount%>" readonly /></div>
        <div style="padding: 10px;">可解冻金额：&nbsp;&nbsp;&nbsp;<input id="thawAmount" type="text" class="form-value" value="<%=model.thawAmount%>" readonly /></div>
        <div style="padding: 10px;">贴票金额：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input id="ticketAmount" type="text" class="form-value" value="<%=model.ticketAmount%>" readonly /></div>
        <div style="padding: 10px;">奖励明细状态：<input id="status" type="text" class="form-value" key="<%=model.status %>" value="<%=REWARDSTATUS_MAP[model.status] || '' %>" readonly /></div>
    </div>
</div>