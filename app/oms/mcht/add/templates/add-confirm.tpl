<%
var section = formLayout.section;
var user = formLayout.user;
var sn = formLayout.sn;
var items;

var dataViceUsers = data.viceUsers;
var dataSn = data.terminal;
var extraImages = data._extraImages;

console.info('>>>confirm data',data);
var mchtKind = data.mchtKind;

%>

<div class="row mcht-form-group mcht-add-confirm">
    <form role="form" id="submit-data">

        <div class="col-lg-4 form-section">
            
            <div class="hx-top-margin10 hx-bottom-margin15">

           <% 
            for(var i=0; i<section.length; i++) {
                items = section[i].items;
            %>
            <div class="container row-margintop">
                <%if(section[i].caption){%>
                <div class="caption caption-text-font"><%= section[i].caption %></div>
                <%}%>
                
                <%
                for(var j=0; j<items.length; j++) {
                    if(items[j].belong.indexOf(mchtKind) !== -1 && getValue(items[j])){
                %>
                <div class="row row-text-font row-margintop">
                    <div class="col-lg-3 label-color"><%= getLabel(items[j]) %></div>
                    <div class="value col-lg-9 value-color">
                        <%=items[j].format ? items[j].format(getValue(items[j])) : getValue(items[j])%>
                    </div>
                </div>
                    <%}
                }%>
            </div>
            <%}%>    

            </div>
    </div>

    <!-- 图片 重构一下这里模板写死不好 -->
    <div class="col-lg-4 col-md-6 form-section">
        <div class="container row-margintop">
            <div class="caption caption-text-font">法人代表证件照</div>
            <div class="row row-text-font row-margintop">
                <% var personImg = [
                        {key: 'idCardFront', label: '身份证正面照'},
                        {key: 'idCardBack', label: '身份证反面照'},
                        {key: 'personWithIdCard', label: '手持身份证照'}
                    ];
                %>
                <% for (var k=0; k<personImg.length; k++) { 
                        if(getImage(personImg[k].key)) {
                %>
                <div class="col-xs-4 img-wrap">
                    <div class="img-inner-wrap">
                        <span class="vertical-helper"></span><img class="mcht-img" src="<%=getImage(personImg[k].key)%>">
                    </div>
                    <div class="img-name-wrap">
                        <span class="img-name"><%=personImg[k].label%></span>
                    </div>
                </div>
                <% 
                    }
                } 
                %>
            </div>
        </div>

        <%if(getImage('bankCard')) {%>
        <div class="container row-margintop">
            <div class="caption caption-text-font">银行卡/开户许可证</div>
            <div class="row row-text-font row-margintop">
                <div class="col-xs-4 img-wrap">
                    <div class="img-inner-wrap">
                        <span class="vertical-helper"></span><img class="mcht-img" src="<%=getImage('bankCard')%>">
                    </div>
                    <div class="img-name-wrap">
                        <span class="img-name">银行卡照片</span>
                    </div>
                </div>
            </div>
        </div>
        <%}%>

        <%if(getImage('agreement')) {%>
        <div class="container row-margintop">
            <div class="caption caption-text-font">委托清算协议书盖章页</div>
            <div class="row row-text-font row-margintop">
                <div class="col-xs-4 img-wrap">
                    <div class="img-inner-wrap">
                        <span class="vertical-helper"></span><img class="mcht-img" src="<%=getImage('agreement')%>">
                    </div>
                    <div class="img-name-wrap">
                        <span class="img-name">委托清算协议书盖章页</span>
                    </div>
                </div>
            </div>
        </div>
        <%}%>

        
        <%
        var operateImg = [
            {key: 'license', label: '营业执照的照片'},
            {key: 'rentAgreement', label: '租赁协议的照片'},
            {key: 'orgImage', label: '组织机构代码证'},
            {key: 'taxImage', label: '税务登记证'}
        ];
        var operateArr = _.filter(operateImg, function (item) {return !!getImage(item.key);});

        if(operateArr.length) {
        %>
        <div class="container row-margintop">
            <div class="caption caption-text-font">经营资质</div>
            <div class="row row-text-font row-margintop">
            <% _.each(operateArr, function (item) { %>
                <div class="col-xs-4 img-wrap">
                    <div class="img-inner-wrap">
                        <span class="vertical-helper"></span><img class="mcht-img" src="<%=getImage(item.key)%>">
                    </div>
                    <div class="img-name-wrap">
                        <span class="img-name"><%=item.label%></span>
                    </div>
                </div>
            <% }); %>
            </div>
        </div>
        <% } %>

        <%
        var shopImg = [
            {key: 'shopFrontImg', label: '店铺门头照'},
            {key: 'shopInnerImg', label: '店内全景照'},
            {key: 'checkstandImg', label: '商户收银台照片'},
            {key: 'productImg', label: '商品照片'},
            {key: 'operatorMcht', label: '拓展员与商户合影'},
            {key: 'operatorCardIdFrontImg', label: '拓展员身份证照片'},
            {key: 'operatorWithIdCardImg', label: '拓展员手持身份证照片'}
        ];
        var shopArr = _.filter(shopImg, function (item) {return !!getImage(item.key);});

        if(shopArr.length) {
        %>
        <div class="container row-margintop">
            <div class="caption caption-text-font">经营场景</div>
            <div class="row row-text-font row-margintop">
            <% _.each(shopArr, function (item) { %>
                <div class="col-xs-4 img-wrap">
                    <div class="img-inner-wrap">
                        <span class="vertical-helper"></span><img class="mcht-img" src="<%=getImage(item.key)%>">
                    </div>
                    <div class="img-name-wrap">
                        <span class="img-name"><%=item.label%></span>
                    </div>
                </div>
            <% }); %>
            </div>
        </div>
        <%}%>

        <%if(getImage('clearProtocol')) {%>
        <div class="container row-margintop">
            <div class="caption caption-text-font">授权证书</div>
            <div class="row row-text-font row-margintop">
                <div class="col-xs-4 img-wrap">
                    <div class="img-inner-wrap">
                        <span class="vertical-helper"></span><img class="mcht-img" src="<%=getImage('clearProtocol')%>">
                    </div>
                    <div class="img-name-wrap">
                        <span class="img-name">授权证书照片</span>
                    </div>
                </div>
            </div>
        </div>
        <%}%>

    </div>

    <!-- 补充部分 -->
    <div class="col-lg-4 col-md-6 form-section">

            <div class="container row-margintop">
                <div class="caption caption-text-font">收银员</div>
                <%if(dataViceUsers.length) {%>
                    <%for(var i=0; i<dataViceUsers.length; i++){%>
                    <div class="row row-text-font row-margintop">
                        <div class="col-lg-5 value-color"><%=dataViceUsers[i].name%></div>
                        <div class="value col-lg-7 value-color"><%=dataViceUsers[i].phone%></div>
                    </div>
                    <%}%>
                <%}else {%>
                    <p>无</p>        
                <%}%>
            </div>

<!--             <div class="container row-margintop">
                <div class="caption caption-text-font">POS机</div>
                <%if(dataSn.length) {%>
                    <%for(var i=0; i<dataSn.length; i++){%>
                    <div class="row row-text-font row-margintop">
                        <div class="value col-lg-12 value-color"><%=dataSn[i]%></div>
                    </div>
                    <%}%>
                 <%}else {%>
                    <p>无</p>        
                <%}%>   
            </div> -->

            <div class="container row-margintop">
                <div class="caption caption-text-font">补充的照片</div>
            <%if(extraImages.length) {%>
                <div class="row">
                    <%for(var i=0; i<extraImages.length; i++){%>
                        <div class="extra-img-wrap col-xs-4 img-wrap">
                            <div class="img-inner-wrap">
                                <span class="vertical-helper"></span><img src="<%=extraImages[i]%>">
                            </div>
                        </div>
                    <%}%>
                </div>
            <%}else {%>
                <p>无</p>        
            <%}%>  
            </div>
    </div>

</form>
</div>