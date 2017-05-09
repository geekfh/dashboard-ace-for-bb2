<%
    var CARDTYPE_MAP = {
            "0": "借记卡",
            "1": "贷记卡",
            "2": "准贷记卡",
            "3": "预付卡"
        };

    var FLAG_MAP = {
            "1": "扣率",
            "2": "固定"
        };

    var ALL_CARD_TYPE = "全部卡类型";
%>

<td class="trade-range"><%- floorAmount %> ~ <%- upperAmount %></td>
<td class="card-type">
    <ul class="card-type-container">
        <% if(cardType == 15) {%>
            <li><%- ALL_CARD_TYPE %></li>
        <%} else {%>
        <% 
        for(var i = 0; i < 4; i++) {
            if(cardType & Math.pow(2,i)){
        %>
                <li><%- CARDTYPE_MAP[i] %></li><!-- 卡类型 -->
        <%}}}%>
    </ul>
</td>
<td class="flag"><%- FLAG_MAP[flag] %></td>
<td class="fee-value"><%- feeValue %></td>
<td class="min-max-fee"><%- minFee %> ~ <%- maxFee %></td>
