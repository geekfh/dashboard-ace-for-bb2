<%

var needAccount = data.needAccount||"1";
var section = formLayout.section;
var user = formLayout.user;
var infoSection = _.where(section, {type: 'info'});
var supplementSection = _.where(section, {type: 'supplement'});
var extraImages = getImage('extra') ? getImage('extra').split(',') : [];

var isOrgan = getImage('pbankCard') ? true:false;

%>

<div class="row mcht-form-group brh-add-confirm mcht-add-confirm">
    <form role="form" id="submit-data">

        <!-- 信息部分  -->
        <div class="col-lg-4 form-section">
            
            <div class="hx-top-margin10 hx-bottom-margin15">

                <% 
                for(var i=0; i<infoSection.length; i++) {
                    items = infoSection[i].items;
                %>
                    <div class="container group-margintop">
                        <%if(infoSection[i].caption){%>
                        <div class="caption caption-text-font"><%= infoSection[i].caption %></div>
                        <%}%>
                        
                        <%
                        for(var j=0; j<items.length; j++) {
                            if(getValue(items[j])){
                        %>
                        <div class="row row-text-font row-margintop">
                            <div class="col-lg-3 label-color control-label"><%= getLabel(items[j]) %></div>
                            <div class="value col-lg-9 value-color">
                                <%= items[j].formatLabel ? items[j].formatLabel(getValue(items[j])) : getValue(items[j])%>
                            </div>
                        </div>
                            <%}
                        }%>
                    </div>
                <%}%> 
                <!--<%if(Ctx.getUser().get('brhCode') === '000'){%>
                <div class="container group-margintop">
                    <div class="caption caption-text-font">直联费率模型</div>
                    <div class="row row-text-font row-margintop">
                        <div class="value col-lg-12 value-color">
                            <% _.each(getDirDiscType(), function(dirDiscType) { %>
                            <span class="col-lg-6 disc-type"><%=dirDiscType%></span>
                            <% }); %>
                        </div>
                    </div>
                </div>
                <div class="container group-margintop">
                    <div class="caption caption-text-font">间联费率模型</div>
                    <div class="row row-text-font row-margintop">
                        <div class="value col-lg-12 value-color">
                            <% _.each(getIndirDiscType(), function(indirDiscType) { %>
                            <span class="col-lg-6 disc-type"><%=indirDiscType%></span>
                            <% }); %>
                        </div>
                    </div>
                </div>
                <%}%>-->
            </div>  

        </div>

        <!-- 图片部分 -->
        <div class="col-lg-4 form-section">
            <div class="container group-margintop">
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

            <% if(getImage('bankCard') || isOrgan){ %>
            <div class="container group-margintop">
                <div class="caption caption-text-font">银行卡/开户许可证</div>
                <div class="row row-text-font row-margintop">
                    <% if(getImage('bankCard')){ %>
                    <div class="col-xs-4 img-wrap">
                        <div class="img-inner-wrap">
                            <span class="vertical-helper"></span><img class="mcht-img" src="<%=getImage('bankCard')%>">
                        </div>
                        <div class="img-name-wrap">
                            <span class="img-name">银行卡/开户许可证照片</span>
                        </div>
                    </div>
                    <% } %>

                    <% if(getImage('pbankCard')){ %>
                    <div class="col-xs-4 img-wrap">
                        <div class="img-inner-wrap">
                            <span class="vertical-helper"></span><img class="mcht-img" src="<%=getImage('pbankCard')%>">
                        </div>
                        <div class="img-name-wrap">
                            <span class="img-name">银行卡照片</span>
                        </div>
                    </div>
                    <% } %>
                </div>
            </div>
            <%}%>

            <%
            var operateImg = [
                {key: 'license', label:'营业执照的照片'},
                {key: 'orgImage', label:'组织机构代码证'},
                {key: 'taxImage', label:'税务登记证'}
            ];
            var operateArr = _.filter(operateImg, function (item) {return !!getImage(item.key);});

            if(operateArr.length) {
            %>
            <div class="container group-margintop">
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

        </div>

        <!-- 补充部分 -->
        <div class="col-lg-4 form-section">
            <div class="hx-top-margin10 hx-bottom-margin15">

                <% 
                for(var i=0; i<supplementSection.length; i++) {
                    items = supplementSection[i].items;
                %>
                    <div class="container group-margintop">
                        <%if(supplementSection[i].caption){%>
                            <div class="caption caption-text-font"><%= supplementSection[i].caption %></div>
                        <%}%>

                        <%
                            var name = supplementSection[i].name||"";
                            var organMode = (name=="account" && isOrgan);
                            var accountItems = [
                                {key:'paccountName', label:'开户名'},
                                {key:'paccountNo', label:'账户号'},
                                {key:'pzbankName', label:'开户支行'}
                            ];
                            if(organMode){
                                console.log(">>>organMode");
                                if(needAccount=="1"){
                                    $.merge(accountItems, items);
                                }
                                items = accountItems;
                            }
                        %>
                        
                        <%
                        for(var j=0; j<items.length; j++) {
                            var item = items[j];
                            if(organMode && j==0){
                        %>
                                <div class="row row-text-font row-margintop">
                                    <div class="col-lg-3 control-label">
                                        <b style="display: block;">管理员帐户</b>
                                    </div>
                                </div>
                            <%} if(organMode && j==3) {%>
                                <div class="row row-text-font row-margintop">
                                    <div class="col-lg-3 control-label">
                                        <b style="display: block;">对公帐户</b>
                                    </div>
                                </div>
                            <%}%>
                            <div class="row row-text-font row-margintop">
                                <div class="col-lg-3 label-color control-label"><%= getLabel(items[j]) %></div>
                                <div class="value col-lg-9 value-color">
                                    <%= getValue(items[j]) ?
                                        (items[j].formatLabel ? items[j].formatLabel(getValue(items[j])) : getValue(items[j])) :
                                        '无'
                                    %>
                                </div>
                            </div>
                        <%}%>
                    </div>
                <%}%> 


                <div class="container group-margintop">
                    <div class="caption caption-text-font">补充的照片</div>
                    <%if(extraImages.length) {%>
                        <div class="row row-margintop">
                            <%for(var i=0; i<extraImages.length; i++){%>
                                <div class="extra-img-wrap col-xs-4 img-wrap">
                                    <div class="img-inner-wrap">
                                        <span class="vertical-helper"></span><img class="mcht-img" src="<%=extraImages[i]%>">
                                    </div>
                                </div>
                            <%}%>
                        </div>
                    <%} else {%>
                        <p>无</p>
                    <%}%>
                </div>
            </div>
        </div>
    </form>
</div>