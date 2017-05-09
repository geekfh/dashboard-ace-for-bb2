<%
    var CAN_SHOW_TRADE_RAGE = {
        'HA': false,
        'HB': false,
        'HC': true,
        'HD': false,
        'HE': false,
        'FG': true,
        'PA': false,
        'PB': false
    }
%>

<div class="title-section">
    <span class="disc-title">计费方案</span>
    <i class="more-scheme" title="增加" hidden></i>
</div>
<table class="model-table table">
    <thead>
        <tr>
            <th>交易类型</th>
            <th>卡类型</th>
            <th>产品类型</th>
            <th>结算周期</th>
            <%
                if(CAN_SHOW_TRADE_RAGE[shortModelId]){
            %>
                <th>交易分档</th>
            <%
                }
            %>
            <th>结算扣率/封顶</th>
            <th>签约扣率(范围)</th>
            <th>签约封顶(范围)</th>
            <th>分润档</th><!-- (交易额) -->
            <th>分润比例</th>
            <th>额外分润(元)</th>
            <th class="operation">操作</th>
        </tr>
    </thead>
    <tbody>
        
    </tbody>
</table>