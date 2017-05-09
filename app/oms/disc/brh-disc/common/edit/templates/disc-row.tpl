<%
    var ALL_CARD_TYPE = "全部卡类型";

    var CARDTYPE_MAP = {
            "0": "借记卡",
            "1": "贷记卡",
            "2": "准贷记卡",
            "3": "预付卡"
        };

    var TRANSTYPE_MAP = {
            '0': '全部类',
            '1': '消费类',
            '2': '线上支付类'
        };

    var MCHT_MODE = {
            '1': '微信大商户',
            '2': '微信特约商户',
            '4': '支付宝大商户',
            '8': '支付宝特约商户'
        };

    var TERM_TYPE = {
        '01': 'MPOS',
        '02': '慧POS',
        '03': '慧收银',
        '04': '好哒',
        '99': '全部'
    };

    var DISC_CYCLE = {
        '0': 'T0S0',
        '1': 'T1',
        '9': '全部'
    };

    var CAN_SET_MAXFEE = {
        '00': true,
        '01': false,
        '02': true,
        '03': false,
        '05': false,
        '06': true,
        '10': false,
        '11': true
    };

    var CAN_SET_PROFIT_TRADE = {
        'HA': true,
        'HB': true,
        'HC': true,
        'HD': true,
        'FG': true,
        'HE': false,
        'PA': false,
        'PB': false
    };

    var CAN_SET_PROFIT_RATIO = {
        'HA': true,
        'HB': true,
        'HC': true,
        'HD': true,
        'FG': true,
        'HE': false,
        'PA': true,
        'PB': true
    };

    var CAN_SET_TOP = {
        '00': true,
        '01': false,
        '02': true,
        '03': false,
        '05': false,
        '06': true,
        '10': false,
        '11': true
    };

    var CAN_SET_BASERATIO = {
        'HA': true,
        'HB': true,
        'HC': true,
        'HD': false,
        'FG': true,
        'HE': false,
        'PA': true,
        'PB': true
    };

    var SHOW_TRADE = /FG|HC/.test(modelId);

    function format(num){
        return num != null ? num + '%' : '';
    };

    function formatRatio (num, ratioType) {
        var sign = ratioType == '1' || ratioType == '3' ? '%' : '元';
        num = ratioType == '3' ? num * 0.01 : num;
        return num != null ? num + sign : '';
    }

    function isFixRatioType (ratioType) {
        return ratioType == '2'
    }

    function getAllMchtModeNames(mchtMode){
        if(mchtMode == 15){
            return "全部";
        }
        var mchtModeNameArr = [];
        _.each([1,2,4,8], function(item){
                if(mchtMode & item){
                    mchtModeNameArr.push(MCHT_MODE[item]);
                }
            }
        );
        return mchtModeNameArr.join(',');
    }
    
%>
<%if(transType == '2' && mchtMode){%>
<td class=""><%= TRANSTYPE_MAP[transType] + '(' + getAllMchtModeNames(mchtMode) + ')' %></td>
<%}else{%>
<td class=""><%= TRANSTYPE_MAP[transType] %></td>
<%}%>
<td class="">
    <div class="card-type-container">
        <ul>
            <% if(cardType == '15'){%> <!-- 全部卡类型 -->
                    <li><%- ALL_CARD_TYPE %></li>
            <%} else {
                    for(var i = 0; i < 4; i++) {
                        if(cardType & Math.pow(2,i)){
            %>
                    <li><%- CARDTYPE_MAP[i] %></li><!-- 卡类型 -->
            <%}}}%>
        </ul>
    </div>
</td>
<td class=""><%- TERM_TYPE[termType] %></td><!-- 产品类型 -->
<td class=""><%- DISC_CYCLE[discCycle] %></td>  <!-- 结算周期 -->
<%
    if(SHOW_TRADE){
        console.log('>>>> show trade');
%>
        <td class="">
            <ul>
<%
        _.each(baseRatioSetting,function(elem){
%>
            <li><%- elem.minTrade %> ~ <%- elem.maxTrade %></li> <!-- 交易分档 -->
<%
        });
%>
            </ul>
        </td>
<%
    };
%>
<td class="">
    <ul>
    <%
        if(CAN_SET_BASERATIO[modelId.slice(0,2)]){
            _.each(baseRatioSetting, function(elem){ 
    %>
            <li><%- formatRatio(elem.baseRatio, ratioType) %><%- CAN_SET_MAXFEE[mchtGrp] && !isFixRatioType(ratioType) ? '/'+elem.maxFee : '' %></li> <!-- 结算扣率与封顶 -->
    <%});} else {%>
            <li class="">-</li>
    <%};%>
    </ul>
</td>

<td class=""><%- format(minBorm) %><%- minBorm != maxBorm ? '-'+format(maxBorm) : '' %></td><!-- 签约扣率 -->
<%
    if(CAN_SET_TOP[mchtGrp] && isFixRatioType(ratioType)){
%>
        <td class=""><%- minTop %><%- maxTop == minTop ? '': '-'+maxTop %></td><!-- 签约封顶 -->
<%      
    } else{
%>
        <td class="">-</td>
<%}%>

<%
if(shouldProfitInfoRender!==false) {
%>
<td class="col-profit-range">
    <div class="profitTrade-container">
        <ul>
            <% if(CAN_SET_PROFIT_TRADE[modelId.slice(0,2)]) {
                _.each(profitSetting, function(elem){ %>
                <li><%- elem.minTrade %> ~ <%- elem.maxTrade %></li> <!-- 分润档 -->
            <%});} else {%>
                <li>-</li>
            <%}%>
        </ul>
    </div>
</td>
<td class="col-profit-ratio">
    <div class="profitRatio-container">
        <ul>
            <% 
                if(CAN_SET_PROFIT_RATIO[modelId.slice(0,2)]) {
                _.each(profitSetting, function(item){ 
            %>
                <li><%- format(item.profitRatio) %></li><!-- 分润比例 -->
            <% });} else { %>
                <li>-</li>
            <%}%>
        </ul>
    </div>
</td>
<%
}
%>
<td class=""><%- feeAdded %></td>  <!-- 额外分润金额-->
<td class="operation">
    <div class="operation-container" name="<%- id %>">
        <a href="javascript: void 0" class="edit" title="编辑"><span class="icon icon-pencil"></span></a>
        <a href="javascript: void 0" class="delete" title="删除"><span class="icon icon-trash"></span></a>
    </div>
</td>