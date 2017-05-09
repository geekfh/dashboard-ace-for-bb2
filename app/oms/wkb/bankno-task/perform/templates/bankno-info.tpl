<%
var ACCOUNT_TYPE_MAP = {
    "0": "对公",
    "1": "对私"
};

var infoSections = [
    {key: 'accountName', label: '开户名'},
    {key: 'accountType', label: '账户类型', formatLabel:function(value){ return ACCOUNT_TYPE_MAP[value]||"未知"; }},
    {key: 'accountNo', label: '账户号(卡号)'},
    {key: 'zbankName', label: '开户支行'}
];

var imgSections = [
    {key: 'bankCard', label: '银行卡照片'},
    {key: 'personWithBankCard',label: '手持银行卡照片'},
    {key: 'idCardFront',label: '商户身份证照片'},
    {key: 'personWithIdCard',label: '商户手持身份证照片'},
];
%>

<div class="info-board">
    <div class="row task-group">
        <div role="form" id="submit-data">

            <div class="form-section">
                <div class="container row-margintop">
                    <div class="caption caption-text-font row block">
                        <div class="col-xs-3">银行卡信息</div>
                        <% if(data.mchtType == 1) {%>
                        <div class="col-xs-2 alert alert-info mchtType-group" role="alert" style="text-align: center; height: 30px; padding: 3px; margin: -5px 0 0 -10px; line-height: 1.5; display: block;">
                            <strong>直联商户</strong>
                        </div>
                        <%}%>

                    </div>
                    <% _.each(infoSections, function(item){
                        var itemVal = Opf.get(data, item.key);
                    %>
                    <div class="row row-text-font row-margintop" name="<%=item.key%>-row">
                        <label class="col-lg-4 info-item-text"><%= item.label %>:</label>
                        <div class="checkable value col-lg-8 checkable-text" name="<%=item.key%>">
                            <span class="text">
                                <%= item.formatLabel ? item.formatLabel(itemVal) : itemVal%>
                            </span>
                        </div>
                    </div>
                    <%});%>

                </div>
            </div>

            <div class="form-section">
                <div class="container row-margintop">
                    <div class="caption caption-text-font row block">
                        <div class="col-lg-12">照片信息</div>
                    </div>
                    <% _.each(imgSections, function(item){
                        var itemVal = Opf.get(data, item.key);
                        if(itemVal){
                    %>
                        <div class="col-lg-6 bank-img-wrap img-wrap checkable" name="<%=item.key%>">
                            <div class="img-inner-wrap">
                                <span class="vertical-helper"></span><img src="<%=itemVal%>?_t=<%=(new Date()).getTime()%>">
                            </div>
                            <div class="img-name-wrap">
                                <span class="img-name"><%= item.label %></span>
                            </div>
                        </div>
                        <%}%>
                    <%});%>
                </div>
            </div>

        </div>
    </div>
</div>