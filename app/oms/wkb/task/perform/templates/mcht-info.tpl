<!-- *******  录入信息 *******  -->
<%
var taskInfo = data.taskInfo;
var mchtData = data.mcht ? data.mcht : data;
var fieldsetInfo = mchtData.fieldsetInfo || [];
var taskDetailsArray = [];
var taskInfoIsPriority = "";

if(taskInfo){
    for(var i=0;i < taskInfo.taskDetails.length;i++){
        var item = taskInfo.taskDetails[i];
        if(item.oprType.charAt(0) == '2'){
            taskDetailsArray.push(item);
        }
    }
    taskInfoIsPriority = taskInfo.isPriority==0 ?
                '<i class="icon icon-wkb-card" title="优先卡，优先审"></i>'
                : "";
    mchtData.mchtName += taskInfoIsPriority;
}

var user = mchtData.viceUsers;
var sn = mchtData.terminal;
var takeCardStatus = mchtData.takeCardStatus;
var items;
if(!user) {
    user=[];
}
if(!sn){
    sn=[];
}
var kind = mchtData.kind;
var extraImages = mchtData.extraImages ? mchtData.extraImages.split(',') : [];

var MCHT_TAKE_CARD_STATUS = {
    '0': '无需验证',
    '1': '已验证',
    '2': '未验证'
};
var TASK_OPRTYPE_MAP = {
    '21':'一审',
    '22':'二审',
    '23':'三审'
};

var TASK_OPRSTATUS_MAP = {
    '0':{ oprStatusDesc:'审核通过',icon:'icon-ok green'},
    '1':{ oprStatusDesc:'拒绝通过',icon:'icon-remove red'}
};

var FIELDSETFLAG_MAP = {
    '1': '收款账户信息',
    '2': '手机号码'
};

var fieldsetAccount = [
    {label: '开户名', key: 'accountName'},
    {label: '卡号', key: 'accountNo'},
    {label: '开户行', key: 'zbankName'},
    {label: '手机号码', key: 'userPhone'}

];

var MCHT_KIND_MAP = {
    'B1': '个体商户',
    'B2': '普通商户',
    'D1': '新增二维码商户',
    'E1': '新增好哒商户',
    'C2': '集团商户(门店)',
    'C1': '集团商户(总店)'
};

var MCHT_SOURCE_MAP = {
    '1': '开放注册',
    '2': '开通宝',
    '3': '平台录入',
    '4': '新开放注册',
    '5': '快捷商户自主注册'
};

var MCHT_ISCOMARKETING = {
    '1': '是',
    '2': '否'
};

var MCHT_CERTFLAG = {
    '1':'三证三码',
    '2':'一证一码',
    '3':'一证三码'
};

var KIND_MAP = {
    'C2': '门店',
    'C1': '总店'
};

var MCHTDISCTHIS_MAP = {
    0: '清算为上级商户',
    1: '清算为本级别商户',
    2: '清算商户为上上级'
};

var formLayout = {

    sections: [{
        items: [
            {name:  'explorerName', key:    'explorerName', label: '拓展员', belong: 'A1,A2,B1,B2,D1,E1,C2,C1'},
            {name:  'kind', key:    'kind', label: '商户种类', belong: 'A1,A2,B1,B2,D1,E1,C2,C1',
                format: function (val) {
                    return MCHT_KIND_MAP[val];
                }
            },
            {name:  'mchtSource', key:    'mchtSource', label: '商户来源', belong: 'A1,A2,B1,B2,D1,E1,C2,C1', noCheckable: true,
                format: function (val) {
                    return MCHT_SOURCE_MAP[val];
                }
            },
            {name: 'mchtLevel', key: 'mchtLevel', label: '商户等级', belong: 'A1,A2,B1,B2,D1,E1,C2,C1', noCheckable: true,
                format: function (val) {
                    var mchtLevel = parseInt(val);
                    var mchtLevelStr = "";
                    for(var i=0; i<mchtLevel; i++){
                        mchtLevelStr += '<i class="icon icon-star" style="color:#FF6A00;"></i>';
                    }
                    return mchtLevelStr;
                }
            },
            {name: 'upMcht', key: 'upMcht', label: '上级商户', belong: 'C2,C1', noCheckable: true},
            {name: 'remark',       key:    'remark',       label: '特殊说明',   belong: 'A1,A2,B1,B2,D1,E1,C2,C1'},
            {name: 'isCoMarketing', key:    'isCoMarketing', label: '联合营销商户',    belong: 'A1,A2,B1,B2,D1,E1,C2,C1',
                format: function (val) {
                    return MCHT_ISCOMARKETING[val];
                }
            },
            {name: 'takeCardStatus', key: 'takeCardStatus', label: '拍卡状态', belong: 'A1,A2,B1,B2,D1,E1,C2,C1',
                format: function (val) {
                    return MCHT_TAKE_CARD_STATUS[val];
                }
            },
            {name:  'oprRegionCode', key:  'oprRegionCode', label: '拓展员地区',  belong: 'A1,A2,B1,B2,D1,E1,C2,C1',
                format: function (val) {
                    var flag = CommonUI.loadProvinceByRegionCode(val);
                    return flag || '';
            }},
            {name:  'intoPosition', key:  'intoPosition', label: '进件位置',  belong: 'A1,A2,B1,B2,D1,E1'},
            {name:  'reviewLabel', key:  'reviewLabel', label: '审核标签', otherkey: 'projectName',  belong: 'A1,A2,B1,B2,D1,E1,C2,C1', noCheckable: true}
        ]
    },{
        caption: '经营信息',
        items: [
            {name: 'mchtName',   key: 'mchtName', label:'商户名称', belong:   'A1,A2,B1,B2,D1,E1,C2,C1'},
            {name: 'mchtNameSingle',   key: 'mchtNameSingle', label:'商户简称', belong:   'A1,A2,B1,B2,D1,E1,C2,C1'},
            {name: 'address',    key: 'address', label: '商家地址', belong: 'A1,A2,B1,B2,D1,E1,C2,C1'},
            {name: 'comTel',     key: 'comTel', label: '联系电话', belong: 'A1,A2,B1,B2,D1,E1,C2,C1'},
            {name: 'busScope',   key: 'busScope', label:  '经营范围', belong:   'A1,A2,B1,B2'},
            {name: 'scope',      key: 'scope', label:  '商户MCC', belong:   'A1,A2,B1,B2'},
            {name: 'attr',       key: 'attr', label: '经济类型', belong: 'A1,A2,B1,B2,D1,E1,C2,C1'},
            {name: 'certFlag',   key: 'certFlag', label:'证照属性', belong: 'A1,A2,B1,B2,D1,E1,C2,C1',
                format: function (val) {
                    return MCHT_CERTFLAG[val];
                }
            },
            {name:     'licNo', key:    'licNo', label:     '营业执照注册号码', belong: 'A1,A2,B1,B2,D1,E1,C2,C1',
                beautyFormat:function(val){
                    return  Opf.String.beautyWithSeparator(val);
                }
            },
            {name:  'orgCode', key:  'orgCode', label:   '组织机构代码', belong:'A1,A2,B1,B2,D1,E1,C2,C1'},
            {name:    'taxNo', key:    'taxNo', label: '税务登记号', belong: 'A1,A2,B1,B2,D1,E1,C2,C1',
                beautyFormat:function(val){
                    return  Opf.String.beautyWithSeparator(val);
                }
            }
        ]
    }, {
        caption: '法人代表信息',
        items: [
            {name: 'aloneUser', key: 'aloneUser', label:     '非独立法人', belong: 'C2',
                format: function (val) {
                    return val == '1' ? '否' : '是';
                }
            },
            {name: 'userName', key: 'mchtUserName', label:     '姓名', belong: 'A1,A2,B1,B2,D1,E1,C2,C1'},
            {name: 'userPhone', key:        'phone', label: '手机号码', belong: 'A1,A2,B1,B2,D1,E1,C2,C1'},
            {name: 'userCardNo', key:       'cardNo', label: '身份证', belong: 'A1,A2,B1,B2,D1,E1,C2,C1',
                beautyFormat:function(val){
                    return  Opf.String.beautyIdNo(val);
                }
            },
            {name:        'userEmail', key:        'userEmail', label: '电子邮箱', belong: 'A1,A2,B1,B2,D1,E1,C2,C1'}
        ]},{
        caption: '清算信息',
        items: [
            {name:  'tNDiscId', key:  'discName', label: '商户费率', belong: 'A1,A2,B1,B2,C2,C1',
                format: function(val) {
                    if (mchtData.category === 'indirect') {
                        return val + '(间联)';
                    }

                    if (mchtData.category === 'direct') {
                        return val + '(直联)';
                    }

                    return val;

                }},
            {name: 'discCycle', key: 'discCycle', label: '结算周期', belong: 'A1,A2,B1,B2,C2,C1', format: function(val){return 'T + '+val+' 个工作日';}}
        ]
    }, {
        name: 'account',
        caption: '账户信息',
        items: [
            {name: 'accountName', key: 'accountName', label:   '开户名', belong: 'A1,A2,B1,B2,D1,E1,C2,C1'},
            {name:   'accountNo', key:   'accountNo', label:   '账户号', belong: 'A1,A2,B1,B2,D1,E1,C2,C1',
                beautyFormat:function(val){
                    return  Opf.String.beautyBankCardNo(val);
                }
            },
            {name:   'zbankName', key:   'zbankName', label: '开户支行', belong: 'A1,A2,B1,B2,D1,E1,C2,C1'}
        ]
    }],

    imageSections: [{
            belong: 'A1,A2,B1,B2,D1,E1,C2,C1',
            name: 'user',
            caption: '法人代表证件照',
            items: [
                {name: 'idCardFront', label: '身份证正面照'},
                {name: 'idCardBack', label: '身份证反面照'},
                {name: 'personWithIdCard', label: '手持身份证照'}
            ]
        }, {
            belong: 'A1,A2,B1,B2,D1,E1,C2,C1',
            name: 'account',
            caption: '账户照片',
            items: [
                {name: 'bankCard', label: '银行卡照片'}
            ]
        }, {
            belong: mchtData.accountProxy == 1 ? 'B1,B2,D1,E1' : '',
            name: 'agreement',
            caption: '委托清算协议书盖章页',
            items: [
                {name: 'agreement', label: '委托清算协议书盖章页'}
            ]
        }, {
            belong: 'A1,A2,B1,B2,D1,E1,C2,C1',
            name: 'license',
            caption: '经营资质',
            items: [
                {name: 'license', label: '营业执照的照片'},
                {name: 'rentAgreement', label: '租赁协议的照片'},
                {name: 'orgImage', label: '组织机构代码证'},
                {name: 'taxImage', label: '税务登记证'},
                {name: 'openAccountLicenses', label: '开户许可证照片'},
            ]
        }, {
            belong: 'A1,A2,B1,B2,D1,E1,C2,C1',
            name: 'scene',
            caption: '经营场景',
            items: [
                {name: 'shopFrontImg', label: '店铺门头照'},
                {name: 'shopInnerImg', label: '店内全景照'},
                {name: 'checkstandImg', label: '商户收银台照片'},
                {name: 'productImg', label: '商品照片'},
                {name: 'operatorMcht', label: '拓展员商户合影'},
                {name: 'operatorCardIdFrontImg', label: '拓展员身份证照片'},
                {name: 'operatorWithIdCardImg', label: '拓展员手持身份证照片'}
            ]
        }, {
            belong: 'C2',
            name: 'clearProtocol',
            caption: '授权证书',
            items: [
                {name: 'clearProtocol', label: '授权证书照片'}
            ]
        }, {
            belong: 'C2',
            name: 'clearProtocol',
            caption: '授权证书',
            items: [
                {name: 'clearProtocol', label: '授权证书照片'}
            ]
        }, {
            belong: 'C2',
            name: 'clearProtocol',
            caption: '授权证书',
            items: [
                {name: 'clearProtocol', label: '授权证书照片'}
            ]
        }
    ]
};
var sections = formLayout.sections;
var imageSections = formLayout.imageSections;

var wildcardData = data.interMcht ? data.interMcht : null;
var wildcardSection = wildcard_section||[];
var isWildcard = !!wildcardData;
var grid_N = isWildcard? 'col-lg-3':'col-lg-4';

%>
<div class="info-board"><div class="row mcht-form-group">
    <div role="form" id="submit-data">
        <!--第一列商户基本信息开始-->
        <div class="<%=grid_N%> form-section">
            <div class="hx-top-margin10 hx-bottom-margin15">
            <%
            for(var i=0; i<sections.length; i++) {
                var section = sections[i];
                items = sections[i].items;
                var canShowSection = false;
                _.each(items, function(item){
                    if(item.belong.indexOf(kind) !== -1 && Opf.get(mchtData, item.key)){
                        canShowSection = true;
                    }
                    if(item.key == 'certFlag'){
                        if(Opf.get(mchtData, 'certFlag') == null){
                            canShowSection = true;
                        }
                    }
                });
                if(canShowSection){
                %>
                <div class="container fieldset">

                    <%if(section.caption){%>
                        <div class="caption caption-text-font"><%= section.caption %></div>
                    <%}%>

                    <%
                    for(j=0; j<items.length; j++) {
                        var item = items[j];
                        if(
                            (item.belong.indexOf(kind)+1) &&
                            Opf.get(mchtData, item.key) !== null ||
                            Opf.get(mchtData, 'certFlag') == null
                        ){
                    %>
                        <div class="row row-text-font row-margintop <%=item.name%>-row">
                            <div class="col-lg-3 label-color" style="padding-right: 0px!important;"><%=item.label %></div>
                            <div class="<%= item.noCheckable ? '' : 'checkable'%> value col-lg-9 checkable-text" name="<%=item.name%>">
                                <%
                                    var text = Opf.get(mchtData, item.key);
                                    if(item.format){
                                        text = item.format(text);
                                    }
                                    if(item.beautyFormat){
                                        text = item.beautyFormat(text);
                                    }
                                    if(item.key == 'certFlag'){
                                      if(Opf.get(mchtData, 'certFlag') == null){
                                          text = '三证三码';
                                      }
                                    }
                                %>
                                <%if(item.key == 'phone'){%>
                                    <%if(text && text.indexOf("*")>0){%>
                                        <span class="text"><%=text%></span>
                                    <%}else{%>
                                        <span class="text"><%=text ? Opf.String.phoneFormat(text) : '无' %></span>
                                        <%if(text){%>
                                            &nbsp;&nbsp;<button type="button" class="btn btn-minier btn-yellow bt_valild_userPhone" phonetext="<%=text%>">点击查看完整号码</button>
                                        <%}%>
                                    <%}%>
                                <%}else if(item.key == 'reviewLabel'){%>
                                    <%if(text){%>
                                        <label class="label label-info" style="border-radius: 3px;" data-toggle="tooltip" data-html="true" data-animation="false" data-placement="right" data-delay="0" title="<span align='left' style='color:white;display:inline-block;'><%=Opf.String.replaceWordWrapByHtml(mchtData.reviewLabel)%></span>"><%=Opf.get(mchtData, item.otherkey)%></label>
                                    <%}else{%>
                                        <span class="text"><%=text ? text : '无'%></span>
                                    <%}%>
                                <%}else{%>
                                    <span class="text"><%=text ? text : '无'%></span>
                                <%}%>
                                <%if(item.key == 'explorerName' && mchtData.mcht38Rate == '1'){%>
                                    &nbsp;&nbsp;<label class="btn btn-minier btn-success">0.38</label>
                                <%}%>
                            </div>
                        </div>
                        <%if(item.key == 'cardNo' && !!mchtData.validationPhotoIdCard && _.isObject(taskInfo) && (taskInfo.subType == '102' || taskInfo.subType == '107')){%>
                        <div class="row row-text-font">
                            <div class="col-lg-3"></div>
                            <div class="col-lg-9">
                                <a target=_blank href="<%=mchtData.validationPhotoIdCard == null ? '' : mchtData.validationPhotoIdCard + '?_t='+(data._t || (new Date()).getTime())%>">查看照片</a>
                            </div>
                        </div>
                        <% }}
                    }%>
                </div>
                <%}%>
            <%}%>
            </div>
        </div><!--//第一列商户基本信息结束-->

        <!--第二列外卡商户信息开始-->
        <% if(isWildcard){ %>
        <div class="<%=grid_N%> form-section">
            <div class="hx-top-margin10 hx-bottom-margin15">
                <%
                for(var i=0; i<wildcardSection.length; i++) {
                    var items = wildcardSection[i].items;
                    var canShow = true;
                %>
                    <div class="container fieldset">
                        <%if(!!wildcardSection[i].caption){%>
                        <div class="caption caption-text-font"><%= wildcardSection[i].caption %></div>
                        <%}%>

                        <%
                        for(var j=0; j<items.length; j++) {
                            var item = items[j];

                            if(wildcardData[item.key] || wildcardData[item.key] == 0){
                                canShow = false;
                        %>
                        <div class="row row-text-font row-margintop <%=item.key%>-row">
                            <div class="col-lg-5 label-color"><%= item.label %></div>
                            <div class="<%= item.noCheckable ? '' : 'checkable'%> value col-lg-7 checkable-text" name="<%=item.key%>">
                                <%=item.format ? item.format(wildcardData[item.key]) : wildcardData[item.key]%>
                            </div>
                        </div>
                        <%}}%>

                        <% if(canShow){ %>
                        <div class="no-extra-img">无</div>
                        <%}%>
                    </div>
                <%}%>
            </div>
        </div><!--//第二列外卡商户信息结束-->
        <% } %>

        <!--第三列图片信息开始-->
        <div class="<%=grid_N%> form-section">
            <%
            for(var i = 0; i < imageSections.length; i++) {
                var imageSec = imageSections[i];
                var items = imageSec.items;
                var canShowSection = false;
                _.each(items, function(item){
                    if(Opf.get(mchtData, item.name) !== null){
                        canShowSection = true;
                    }
                });
                if(imageSec.belong.indexOf(kind) !== -1 && canShowSection) {
            %>
                <div class="container fieldset">
                    <div class="caption caption-text-font"><%=imageSec.caption%></div>
                    <div class="row row-text-font row-margintop">
                        <%
                        for(var k = 0; k < items.length; k++) {
                            if(Opf.get(mchtData, items[k].name)){
                        %>
                        <div name="<%=items[k].name%>" class="col-xs-4 img-wrap checkable">
                            <div class="img-inner-wrap">
                                <span class="vertical-helper"></span><img class="mcht-img" src="<%=Opf.get(mchtData, items[k].name) + '?_t='+(data._t || (new Date()).getTime())%>">
                            </div>
                            <div class="img-name-wrap">
                                <span class="img-name"><%=items[k].label%></span>
                            </div>
                        </div>
                        <% }} %>
                    </div>
                </div>
            <% }} %>
            <div class="container fieldset">
                <div class="caption caption-text-font out-extra-img">补充的照片</div>
                <%if(extraImages && extraImages.length){%>
                    <div class="row row-margintop extra-img-outwrap">
                    <%for(var i=0; i<extraImages.length; i++){%>
                        <div class="extra-img-wrap col-xs-4 img-wrap checkable" name="<%="extra"+i%>">
                            <div class="img-inner-wrap">
                                <span class="vertical-helper"></span><img src="<%=extraImages[i] + '?_t='+(data._t || (new Date()).getTime())%>">
                            </div>
                        </div>
                    <%}%>
                    </div>
                <%}else{%>
                <div class="no-extra-img">无</div>
            <%}%>
            </div>
        </div><!--//第三列图片信息结束-->

        <!--第四列商户附加信息开始-->
        <div class="<%=grid_N%> form-section extra-section">

            <div class="container fieldset">
                <div class="caption caption-text-font">收银员</div>
                <div style="max-height: 300px; overflow-y: inherit; overflow-x: hidden;">
                <%if(user && user.length){%>
                    <%for(var i=0; i<user.length; i++){%>
                    <div class="row row-text-font row-margintop" style="overflow: hidden;">
                        <div class="col-xs-3 value"><%=user[i].name%></div>
                        <div class="value col-xs-8">
                            <%if(user[i].phone && user[i].phone.indexOf("*")>0){%>
                                <span class="text"><%=user[i].phone%></span>
                            <%}else{%>
                                <span class="text"><%=Opf.String.phoneFormat(user[i].phone)%></span>
                                <%if(user[i].phone){%>
                                    &nbsp;&nbsp;<button type="button" class="btn btn-minier btn-yellow bt_valild_userPhone" phonetext="<%=user[i].phone%>">点击查看完整号码</button>
                                <%}%>
                            <%}%>
                        </div>
                    </div>
                    <%}%>
                <%}else{%>
                    <div class="row row-text-font row-margintop" style="overflow: hidden;">
                        <div class="col-xs-3 value"><%=Opf.get(mchtData,'mchtUserName')%></div>
                        <div class="value col-xs-8">
                            <%if(Opf.get(mchtData,'phone') && Opf.get(mchtData,'phone').indexOf("*") > 0){%>
                                <span class="text"><%=Opf.get(mchtData,'phone')%></span>
                            <%}else{%>
                                <span class="text"><%=Opf.String.phoneFormat(Opf.get(mchtData,'phone')) %></span>
                                <%if(Opf.get(mchtData,'phone')){%>
                                    &nbsp;&nbsp;<button type="button" class="btn btn-minier btn-yellow bt_valild_userPhone" phonetext="<%=Opf.get(mchtData,'phone')%>">点击查看完整号码</button>
                                <%}%>
                            <%}%>
                        </div>
                    </div>
                <%}%>
                </div>
            </div>

            <div class="pos-section container fieldset">
                <div class="caption caption-text-font"><%= Opf.get(mchtData,'kind')!=="D1"? "POS机":"二维码支付" %></div>
                <div style="max-height: 300px; overflow-y: inherit; overflow-x: hidden;">
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
            </div>

            <%
            if(mchtData.riskLevel){
            %>
            <div class="container fieldset">
                <div class="caption caption-text-font">评级</div>
                    <div class="row row-text-font row-margintop">
                        <div class="col-lg-3 label-color">风险等级</div>
                        <div class="value col-lg-9 checkable-text">
                            <span class="text"><%=mchtData.riskLevel%></span>
                        </div>
                    </div>
                    <div class="row row-text-font row-margintop t1-level">
                        <div class="col-lg-3 label-color">T+1额度等级</div>
                        <div class="value col-lg-9 checkable-text">
                            <span class="text"><%=mchtData.mchtRank%></span>
                        </div>
                     </div>
            </div>
            <%
            }
            %>

            <div class="container fieldset">
                <div class="caption caption-text-font">客户身份认证结果</div>
                <%
                    if(!_.isEmpty(mchtData.faceRecognition)){
                %>
                <div class="row row-text-font row-margintop">
                    <div class="col-lg-3 label-color">认证分数</div>
                    <div class="value col-lg-9 checkable-text">
                        <span class="text"><%=mchtData.score||"0"%></span>
                    </div>
                </div>
                <div class="row row-text-font row-margintop" style="padding-top: 10px;">
                    <div class="col-lg-3 label-color">认证图片</div>
                    <div name="faceRecognition" class="col-xs-3 img-wrap checkable">
                        <div class="img-inner-wrap">
                            <img class="mcht-img" src="<%=mchtData.faceRecognition + '?_t='+(data._t || new Date().getTime())%>" >
                        </div>
                    </div>
                </div>
                <%} else {%>
                <div class="row row-text-font row-margintop">
                    <div class="col-xs-12">
                        <span class="text-danger">未认证</span>
                    </div>
                </div>
                <%}%>
            </div>

            <div class="container fieldset">
                <div class="caption caption-text-font">补充身份认证结果</div>
                <%
                    var face_flag = false, face_num = 5;
                    for(var i=1;i<=face_num;i++){
                        if(!_.isEmpty(mchtData["faceRecognition"+i])){
                            face_flag = true; break;
                        }
                    }
                    if(face_flag){
                %>
                <div class="row row-text-font row-margintop">
                    <div class="col-lg-3 label-color">认证分数</div>
                    <div class="value col-lg-9 checkable-text checkable" name="recognitionScore">
                        <span class="text"><%=mchtData.recognitionScore||"0"%></span>
                    </div>
                </div>
                <div class="row row-text-font row-margintop" style="padding-top: 10px;">
                    <div class="col-lg-3 label-color">认证图片</div>
                    <div class="col-lg-9 row">
                        <% for(var n=1; n<=face_num; n++){
                            var faceRecognitionN = mchtData["faceRecognition"+n];
                            if(!_.isEmpty(faceRecognitionN)){
                        %>
                        <div name="faceRecognition<%=n%>" class="col-xs-3 img-wrap">
                            <div class="img-inner-wrap">
                                <img class="mcht-img" src="<%=faceRecognitionN + '?_t='+(data._t || new Date().getTime())%>" >
                            </div>
                        </div>
                        <%}}%>
                    </div>
                </div>
                <%} else {%>
                <div class="row row-text-font row-margintop">
                    <div class="col-xs-12">
                        <span class="text-danger">未认证</span>
                    </div>
                </div>
                <%}%>
            </div><br>

            <%
            if(fieldsetInfo.length){
            %>
            <div class="container fieldset">
                <div class="caption caption-text-font">信息变更历史</div>
                <div style="max-height: 300px; overflow-y: inherit; overflow-x: hidden;">
                <% _.each(fieldsetInfo, function (item) {
                    var oldFieldset = item.oldFieldset;
                    var newFieldset = item.newFieldset;
                    if(item.fieldsetFlag != '3'){
                 %>
                <div class="row-text-font row-margintop">
                    <div>
                        <%= moment(item.modifiedTime, 'YYYYMMDD').formatCnYMD()
                             + ' 修改了 ' + FIELDSETFLAG_MAP[item.fieldsetFlag]
                         %>
                    </div>
                    <% _.each(fieldsetAccount, function(fieldsetItem) {
                        if(Opf.get(item.oldFieldset, fieldsetItem.key)){
                    %>
                    <div class="fieldset-info-li">
                        <div class="fieldset-label">
                            <span class="label-color"><%=fieldsetItem.label%></span>
                        </div>
                        <div class="fieldset-change">
                            <span class="oldfieldset-info"> <%=oldFieldset[fieldsetItem.key]%> </span>
                            <span> <i class="icon icon-opf-larrow-right"></i> </span>
                            <span class="newfieldset-info green"> <%=newFieldset[fieldsetItem.key]%> </span>
                        </div>
                    </div>
                    <%
                        }
                    });
                    %>
                </div>
                <div class="line"></div>
                <%
                    }
                });
                %>
                </div>
            </div>
            <%
            }
            %>

            <%
            if(taskDetailsArray.length){
                var hasOprDesc = false;
            %>
            <div class="container fieldset">
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
        </div><!--//第四列商户附加信息结束-->
    </div>
</div></div><!--ef *******  录入信息 *******  -->