<!-- *******  录入信息 *******  -->
<%
var taskInfo = data.taskInfo;
var taskDetailsArray = [];

for(var i=0;i < taskInfo.taskDetails.length;i++){
    var item = taskInfo.taskDetails[i];
    if(item.oprType.charAt(0) == '2'){
        taskDetailsArray.push(item);
    }
}


var mchtData = data.mcht ? data.mcht : data;

var user = mchtData.viceUsers;
var sn = mchtData.terminal;
var items;
if(!user) {
    user=[];
}
if(!sn){
    sn=[];
}
var kind = mchtData.kind;
var extraImages = mchtData.extraImages ? mchtData.extraImages.split(',') : [];

var TASK_OPRTYPE_MAP = {
    '21':'一审',
    '22':'二审',
    '23':'三审'
};

var TASK_OPRSTATUS_MAP = {
    '0':{ oprStatusDesc:'审核通过',icon:'icon-ok green'},
    '1':{ oprStatusDesc:'拒绝通过',icon:'icon-remove red'}
};

var formLayout = {

    sections: [{
        caption: '服务信息',
        items: [
            {name: 'cupsMchtNo',     key: 'cupsMchtNo',     label: '同步商户号', belong:   'B1, B2'},
            {name: 'exportDate',     key: 'exportDate',     label: '同步时间',   belong: 'B1, B2'},
            {name: 'cupsMchtSortNo', key: 'cupsMchtSortNo', label: '归类商户号', belong: 'B1, B2'},
            {name: 'localMchtNo',    key: 'localMchtNo',    label: '本地商户号', belong:   'B1, B2'},
            {name: 'explorerName',   key: 'explorerName',   label: '拓展员',     belong: 'B1, B2'}
        ]
    },{
        caption: '经营信息',
        items: [
            {name: 'mchtName', key: 'mchtName', label:     '商户名称', belong:   'B1, B2'},
            {name: 'mchtNameSingle',   key: 'mchtNameSingle', label:'商户简称', belong: 'B1, B2'},
            {name:  'address', key:  'address', label:     '商家地址', belong: 'B1, B2'},
            {name:  'comTel', key:  'comTel', label:     '联系电话', belong: 'B1,B2'},
            {name:    'scope', key:    'scope', label:     '经营范围', belong:   'B1, B2'},
            {name:     'attr', key:     'attr', label:     '经济类型', belong: 'B2'},
            {name:    'licNo', key:    'licNo', label:   '营业执照注册号码', belong: 'B1,B2',
                beautyFormat:function(val){
                    return  Opf.String.beautyWithSeparator(val);
                }
            },
            {name:  'orgCode', key:  'orgCode', label:   '组织机构代码', belong:'B1,B2'},
            {name:    'taxNo', key:    'taxNo', label: '税务登记号', belong: 'B1,B2',
                beautyFormat:function(val){
                    return  Opf.String.beautyWithSeparator(val);
                }
            }
        ]
    }, {
        caption: '法人代表信息',
        items: [
            {name: 'userName', key: 'mchtUserName', label:     '姓名', belong: 'B1, B2'},
            {name:        'userPhone', key:        'phone', label: '手机号码', belong: 'B1, B2'},
            {name:       'userCardNo', key:       'cardNo', label: '身份证', belong: 'B1, B2',
                beautyFormat:function(val){
                    return  Opf.String.beautyIdNo(val);
                }
            },
            {name:        'userEmail', key:        'userEmail', label: '电子邮箱', belong: 'B1, B2'}
        ]
    }, {
        caption: '清算信息',
        items: [
            {name:  'tNDiscId', key:  'discName', label: '商户费率', belong: 'B1, B2',
                format: function(val) {
                    if (mchtData.category === 'indirect') {
                        return val + '(间联)';
                    }

                    if (mchtData.category === 'direct') {
                        return val + '(直联)';
                    }

                    return val;

                }},
            {name: 'discCycle', key: 'discCycle', label: '结算周期', belong: 'B1, B2', format: function(val){return 'T + '+val+' 个工作日';}}
        ]
    }, {
        name: 'account',
        caption: '账户信息',
        items: [
            {name: 'accountName', key: 'accountName', label:   '开户名', belong: 'B1, B2'},
            {name:   'accountNo', key:   'accountNo', label:   '账户号', belong: 'B1, B2',
                beautyFormat:function(val){
                    return  Opf.String.beautyBankCardNo(val);
                }
            },
            {name:   'zbankName', key:   'zbankName', label: '开户支行', belong: 'B1, B2'}
        ]
    }],

    imageSections: [{
            belong: 'B1,B2',
            name: 'user',
            caption: '法人代表证件照',
            items: [
                {name: 'idCardFront'}, 
                {name: 'idCardBack'},
                {name: 'personWithIdCard'}
            ]
        }, {
            belong: 'B1,B2',
            name: 'account',
            caption: '银行卡/开户许可证照片',
            items: [
                {name: 'bankCard'}
            ]
        }, {
            belong: mchtData.accountProxy == 1 ? 'B1,B2' : '',
            name: 'agreement',
            caption: '委托清算协议书盖章页',
            items: [
                {name: 'agreement'}
            ]
        }, {
            belong: 'B1,B2',
            name: 'license',
            caption: '经营资质',
            items: [
                {name: 'license'},
                {name: 'rentAgreement'},
                {name: 'orgImage'},
                {name: 'taxImage'}
            ]
        }, {
            belong: 'B1,B2',
            name: 'scene',
            caption: '经营场景',
            items: [
                {name: 'shopFrontImg'},
                {name: 'shopInnerImg'},
                {name: 'checkstandImg'},
                {name: 'productImg'}
            ]
        }

    ]
};
var sections = formLayout.sections;
var imageSections = formLayout.imageSections;


%>
<div class="info-board">
    <div class="row mcht-form-group">
    <div role="form" id="submit-data">

        <div class="col-lg-4 form-section">
            
            <div class="hx-top-margin10 hx-bottom-margin15">
           <% 
            for(var i=0; i<sections.length; i++) {
                var section = sections[i];
                items = sections[i].items;

                %>
            <div class="container row-margintop">
                <div class="caption caption-text-font"><%= section.caption %></div>
                <%
                for(j=0; j<items.length; j++) {
                    var item = items[j];
                    if(((item.belong.indexOf(kind)) + 1) && Opf.get(mchtData, item.key)){
                %>
                    <div class="row row-text-font row-margintop <%=item.name%>-row">
                        <div class="col-lg-3 label-color"><%=item.label %></div>
                        <div class="checkable value col-lg-9 checkable-text" name="<%=item.name%>">
                            <%
                                var text = Opf.get(mchtData, item.key);
                                if(item.format){
                                    text = item.format(text);
                                }

                                if(item.beautyFormat){
                                    text = item.beautyFormat(text);
                                }
                            %>
                            <span class="text"><%=text%></span>
                        </div>
                    </div>

                    <% }
                }%>

                </div>
            <%}%>    

            </div>
        </div>


        <div class="col-lg-4 form-section">
            <%
            for(var i = 0; i < imageSections.length; i++) {
                var imageSec = imageSections[i];
                var items = imageSec.items;
                if(imageSec.belong.indexOf(kind) !== -1) {
            %>
                <div class="container row-margintop">
                    <div class="caption caption-text-font"><%=imageSec.caption%></div>
                    <div class="row row-text-font row-margintop">
                        <%
                        for(var k = 0; k < items.length; k++) {
                            if(Opf.get(mchtData, items[k].name)){
                        %>
                            
                        <div name="<%=items[k].name%>" class="col-xs-4 img-wrap checkable">
                            <img class="mcht-img" src="<%=Opf.get(mchtData, items[k].name)%>">
                        </div>
                        
                        <%
                            }
                        }
                        %>
                        
                    </div>
                </div>
            <%
                }
            }
            %>
        </div>

        <div class="col-lg-4 form-section extra-section">

                <div class="container row-margintop">
                    <div class="caption caption-text-font">收银员</div>
                    <%if(user && user.length){%>
                        <%for(var i=0; i<user.length; i++){%>
                        <div class="row row-text-font row-margintop">
                            <div class="col-xs-5 value"><%=user[i].name%></div>
                            <div class="value col-xs-7">
                                <span class="text"><%=user[i].phone%></span>
                            </div>
                        </div>
                        <%}%>
                    <%}else{%>
                        <div class="row row-text-font row-margintop">
                            <div class="col-xs-5 value"><%=Opf.get(mchtData,'mchtUserName')%></div>
                            <div class="value col-xs-7">
                                <span class="text"><%=Opf.get(mchtData,'phone')%></span>
                            </div>
                        </div>
                    <%}%>
                </div>

                <div class="pos-section container row-margintop">
                    <div class="caption caption-text-font">POS机</div>
                    <%if(sn && sn.length){%>
                        <%for(var i=0; i<sn.length; i++){%>
                        <div class="row row-text-font row-margintop">
                            <div class="value col-lg-12">
                                <span class="text"><%=sn[i]%></span>
                            </div>
                        </div>
                        <%}%>
                    <%}else{%>
                        无
                    <%}%>
                </div>

                <div class="container row-margintop">
                    <div class="caption caption-text-font">补充的照片</div>
                    <%if(extraImages && extraImages.length){%>
                        <div class="row">
                        <%for(var i=0; i<extraImages.length; i++){%>
                            <div class="extra-img-wrap col-xs-4 img-wrap checkable" name="<%="extra"+i%>">
                                <img src="<%=extraImages[i]%>">
                            </div>
                        <%}%>
                        </div>
                    <%}else{%>
                    无
                <%}%>
                </div>
                
                <%
                if(mchtData.riskLevel){
                %>
                <div class="container row-margintop">
                    <div class="caption caption-text-font">评级</div>
                    <div class="row row-text-font row-margintop">
                        <div class="col-lg-3 label-color">商户等级</div>
                        <div class="value col-lg-9 checkable-text">
                            <span class="text"><%=mchtData.riskLevel%></span>
                        </div>
                    </div>
                </div>
                <%
                }
                %>
                <%
                if(taskDetailsArray.length){
                    var hasOprDesc = false;
                %>
                <div class="container row-margintop">
                    <div class="caption caption-text-font">进件审核意见</div>
                    <div class="row row-text-font row-margintop">
                        <div class="taskDetails history-wrapper">
                        <%
                        for(var i=0;i < taskDetailsArray.length;i++){
                            var item = taskDetailsArray[i];
                        %>
                            <%
                            if(item.oprDesc){
                                hasOprDesc = true;
                            %>
                            <div class="desc"></div>
                            <div class="single-state">
                                <div class="status">
                                    <i class="icon <%=TASK_OPRSTATUS_MAP[item.oprStatus].icon%>"></i>
                                </div>
                                <i class="icon icon-circle"></i>
                                <div class="taskInfo"><%=TASK_OPRTYPE_MAP[item.oprType]%> <%=TASK_OPRSTATUS_MAP[item.oprStatus].oprStatusDesc%></div>
                            </div>
                            <div class="desc"><span><%=item.oprDesc%></span></div>
                        <%
                            }
                        }
                        %>
                        </div>
                    </div>
                    <%if(!hasOprDesc){%>
                    无
                    <%}%>
                </div>
                <%
                }
                %>

        </div>

    </div>
    </div>

</div><!--ef *******  录入信息 *******  -->