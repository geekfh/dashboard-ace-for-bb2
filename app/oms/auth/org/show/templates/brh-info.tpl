<!-- *******  录入信息 *******  -->
<%
var BRH_TYPE_MAP = {
    '1': '省代',
    '2': '市代',
    '0': '其他'
};

var formLayout = {
    section: [
        {
            name:'user',
            type: 'info',
            caption:'法人代表信息',
            items:[
                {name:'name',key:'name', label:'联系人'},
                {name:'mobile',key:'mobile', label:'手机号码'},
                {name:'cardNo',key:'cardNo', label:'身份证号码'},
                {name:'cardEndDate',key:'cardEndDate', label:'证件有效期'}
            ]
        },{
            name:'brh',
            type: 'info',
            caption:'机构信息',
            items:[
                {name:'brhName',key:'brhName', label:'机构名称'},
                {name:'brhNickName',key:'brhNickName', label:'机构备注名'},
                {name:'brhAddress',key:'brhAddress', label:'机构地址'},
                {name:'urgentContactName',key:'urgentContactName', label:'紧急联系人'},
                {name:'brhTel',key:'brhTel', label:'紧急联系电话'},
                {name:'agencyEnd',key:'agencyEnd', label:'合作有效期', formatLabel:function(val){
                    return val == 0 ? '永久' : val;
                }},
                {name:'licNo',key:'licNo', label:'营业执照号'},
                {name:'taxNo',key:'taxNo', label:'税务登记证号'}
            ]
        },{
            name:'profit',
            type:'supplement',
            caption:'分润方案',
            items:[
                {name: 'isJoinProfit', key: 'isJoinProfit', label: '是否参与分润', formatLabel: function(val){
                    return val == '1' ? '是' : '否';
                }},
                {name:'profitPlanName',key:'profitPlanName', label:'分润方案'}
            ]
        },{
            name:'account',
            type:'supplement',
            caption:'收款账户',
            items:[
                {name:'accountName',key:'accountName', label:'开户名'},
                {name:'accountNo',key:'accountNo', label:'账户号'},
                {name:'zbankName',key:'zbankName', label:'开户支行'}
            ]
        },{
            name:'contract',
            type:'supplement',
            caption:'合同存档',
            items:[
                {name:'contractCode',key:'contractCode', label:'合同编号'},
                {name:'contractFile',key:'contractFile', label:'合同扫描件',formatLabel: function(val){
                    return String(val).split('/').pop();
                }}
            ]
        },{
            name:'extraImages',
            type:'img',
            caption:'补充照片',
            items:[]
        },{
            name:'recommend-info',
            type:'supplement',
            caption:'推荐人信息',
            items:[
                {name:'phoneNo',key:'recommendOprPhone', label:'推荐人手机号'},
                {name:'info_brhName',key:'recommendBrhName', label:'代理商名称'}
            ]
        }
    ],
    imageSections: [{
        name: 'user',
        caption: '法人代表证件照',
        items: [
            {name: 'idCardFront', label: '身份证正面照'},
            {name: 'idCardBack', label: '身份证反面照'},
            {name: 'personWithIdCard', label: '手持身份证照'}
        ]
    }, {
        name: 'account',
        caption: '账户照片',
        items: [
            {name: 'pbankCard', label: '银行卡照片'},
            {name: 'bankCard', label: '开户许可证照片'}
        ]
    }, {
        name: 'license',
        caption: '经营资质',
        items: [
            {name: 'license', label: '营业执照的照片'},
            {name: 'orgImage', label: '组织机构代码证'},
            {name: 'taxImage', label: '税务登记证'}
        ]
    }]
};
var section = formLayout.section;
var imageSections = formLayout.imageSections;
var infoSection = _.where(section, {type: 'info'});
var supplementSection = _.where(section, {type: 'supplement'});
var extraImgSection = _.findWhere(section, {type: 'img'});
var _extraImages = Opf.get(data, extraImgSection.name);
var extraImages = _extraImages ? _extraImages.split(',') : [];
var isOrgan = data.pbankCard ? true:false;
var brhInfo = data.brhInfo||{};
%>

<div class="info-board">
    <div class="row brh-form-group">
        <div role="form" id="submit-data">

            <div class="col-lg-4 form-section">
                
                <div class="item-group">
               <% 
                for(var i=0; i<infoSection.length; i++) {
                    var section = infoSection[i];
                    items = infoSection[i].items;

                    %>
                <div class="container row-margintop">
                    <div class="caption caption-text-font"><%= section.caption %></div>
                    <%
                    for(j=0; j<items.length; j++) {
                        var item = items[j];
                        var itemVal = Opf.get(data, item.key);
                    %>
                        <div class="row row-text-font row-margintop <%=item.name%>-row">
                            <label class="col-lg-4 info-item-text"><%= item.label %>:</label>
                            <div class="<%= item.noCheckable ? '' : 'checkable'%> value col-lg-8 checkable-text" name="<%=item.name%>">
                                <span class="text">
                                    <%= itemVal ? (item.formatLabel ? item.formatLabel(itemVal) : itemVal) : '无' %>
                                </span>
                            </div>
                        </div>

                    <%}%>

                    </div>
                <%}%>    

                </div>
                <%if(getBrhLevel() === 1){%>
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
                <%}%>
            </div>

            <div class="col-lg-4 form-section">
            <%
            for(var i = 0; i < imageSections.length; i++) {
                var imageSec = imageSections[i];
                var items = imageSec.items;

                var canShowSection = false;
                _.each(items, function(item){
                    if(Opf.get(data, item.name) !== null){
                        canShowSection = true;
                    }
                });

                if(canShowSection){
            %>
                <div class="container row-margintop">
                    <div class="caption caption-text-font"><%=imageSec.caption%></div>
                    <div class="row row-text-font row-margintop">
                        <%
                        for(var k = 0; k < items.length; k++) {
                            if(Opf.get(data, items[k].name)){
                        %>
                            
                        <div name="<%=items[k].name%>" class="col-xs-4 img-wrap checkable">
                            <div class="img-inner-wrap">
                                <span class="vertical-helper"></span><img class="mcht-img" src="<%=Opf.get(data, items[k].name) + '?_t='+(new Date()).getTime()%>">
                            </div>
                            <div class="img-name-wrap">
                                <span class="img-name"><%=items[k].label%></span>
                            </div>
                        </div>
                        
                        <%
                            }
                        }
                        %>
                        
                    </div>
                </div>
                <%}%>
            <%}%>
            </div>

            <div class="col-lg-4 form-section">
                
                <div class="item-group">
                <% 
                for(var i=0; i<supplementSection.length; i++) {
                    var section = supplementSection[i];
                    items = supplementSection[i].items;
                %>
                    <div class="container row-margintop">
                        <div class="caption caption-text-font"><%= section.caption %></div>

                        <%
                            var name = section.name||"";
                            var organMode = (name=="account" && isOrgan);
                            var accountItems = [
                                {name:'paccountName', key:'paccountName', label:'开户名'},
                                {name:'paccountNo', key:'paccountNo', label:'账户号'},
                                {name:'pzbankName', key:'pzbankName', label:'开户支行'}
                            ];
                            if(organMode){
                                if(brhInfo.pbankName != ""){
                                    $.merge(accountItems, items);
                                }
                                items = accountItems;
                            }
                        %>

                        <%
                        for(j=0; j<items.length; j++) {
                            var item = items[j];
                            var itemVal = Opf.get(data, item.key)||"";
                            if(organMode && j==0){
                        %>
                                <div class="row row-text-font row-margintop">
                                    <b style="padding-left:2em;">管理员帐户</b>
                                </div>
                            <%} if(organMode && j==3) {%>
                                <div class="row row-text-font row-margintop">
                                    <b style="padding-left:2em;">对公帐户</b>
                                </div>
                            <%}%>
                            <div class="row row-text-font row-margintop <%=item.name%>-row">
                                <label class="col-lg-4 info-item-text"><%= item.label %>:</label>
                                <div class="<%= item.noCheckable ? '' : 'checkable'%> value col-lg-8 checkable-text" name="<%=item.name%>">
                                    <span class="text">
                                        <%= itemVal ? (item.formatLabel ? item.formatLabel(itemVal) : itemVal) : '无' %>
                                    </span>
                                </div>
                            </div>
                        <%}%>
                    </div>
                <%}%>

                </div>

                <div class="hx-top-margin10 hx-bottom-margin15">
                    <div class="container row-margintop">
                        <div class="caption caption-text-font"><%= extraImgSection.caption %></div>
                        <%if(extraImages && extraImages.length) {%>
                        <div class="row row-margintop">
                            <%for(var i=0; i<extraImages.length; i++){%>
                                <div name="extraImg<%=i%>" class="extra-img-wrap col-xs-4 img-wrap checkable">
                                    <div class="img-inner-wrap">
                                        <span class="vertical-helper"></span><img class="mcht-img" src="<%=extraImages[i] + '?_t='+(new Date()).getTime()%>">
                                    </div>
                                </div>
                            <%}%>
                        </div>
                        <%}else {%>
                        <p>无</p>        
                        <%}%>  
                    </div>
                </div>

            </div>
        </div>
    </div>
</div>