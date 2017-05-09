<%

var infoSections = [
    {key: 'userName', label: '姓名'},
    {key: 'idCard', label: '身份证号'},
    {key: 'acctNo', label: '银行卡号'},
    {key: 'bankName', label: '开户行名'},
    {key: 'zbankName', label: '所属支行名'},
    {key: 'remark', label: '备注信息'},
    {key: 'isDirectOpr', label: '所属体系'}
];

var imgSections = [
    {key: 'idCardFront',label: '身份证正面照'},
    {key: 'idCardBack',label: '身份证反面照'},
    {key: 'personWithIdCard',label: '手持身份证照片'},
    {key: 'bankCard', label: '银行卡照片'},
    {key: 'signPicture', label: '签名图片'}
];
%>

<div class="info-board">
    <div class="row task-group">
        <div role="form" id="submit-data">

            <div class="form-section">
                <div class="container row-margintop">
                    <div class="col-lg-12">
                        <span class="caption caption-text-font">用户信息</span>
                    </div>
                    <% _.each(infoSections, function(item){
                        var itemVal = Opf.get(data, item.key);
                    %>
                    <div class="row row-text-font row-margintop" name="<%=item.key%>-row">
                        <label class="col-lg-4 info-item-text"><%= item.label %>:</label>
                        <div class="checkable value col-lg-8 checkable-text" name="<%=item.key%>">
                            <span class="text">
                                <%if(item.key == 'isDirectOpr'){%>
                                    <%= taskInfo.isDirectOpr == 0 ? '1.0' : '2.0' %>
                                <%}else{%>
                                    <%= item.formatLabel ? item.formatLabel(itemVal) : itemVal%>
                                <%}%>
                            </span>
                        </div>
                    </div>
                    <%});%>
                </div>
            </div>

            <div class="form-section">
                <div class="container row-margintop">
                    <div class="col-lg-12">
                        <span class="caption caption-text-font">照片信息</span>
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