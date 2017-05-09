<!-- *******  录入信息 *******  -->
<%
var ISEXPLORER_MAP = {
    '0': '非拓展员',
    '1': '是拓展员'
};

var GENDER_MAP = {
    '0': '男',
    '1': '女'

};

var STATUS_MAP = {
    '0': '正常',
    '1': '停用',
    '2': '提交待审核',
    '5': '拒绝待修改',
    '6': '用户新增保存',
    '7': '自助注册成功',
    '8': '好哒未实名认证'
}; 

var NEEDACCOUNT_MAP = {
    '0': '否',
    '1': '是'
};

var OPRTYPE_MAP = {
    '0': '私人',
    '1': '个体工商户',
    '2': '公司'
};

var OPRATTR_MAP = {
    '2': '个体工商户',
    '0': '公司'
};

var section = [
    {
        name: 'userInfo',
        caption: '基本信息',
        type: 'info',
        items: [
            {key: 'name', label: '真实姓名', type: 'text'},
            {key: 'loginName', label: '登录帐号', type: 'text', noCheckable: true},
            {key: 'roleGroupName', label: '角色组', type: 'text'},
            {key: 'ruleName', label: '管辖范围', type: 'text'},
            {key: 'isExplorer', label: '是否为拓展员', type: 'text',
                formatLabel: function (val) {
                    return ISEXPLORER_MAP[val];
                }
            },
            {key: 'gender', label: '性别', type: 'text',
                formatLabel: function (val) {
                    return GENDER_MAP[val];
                }
            },
            {key: 'status', label: '用户状态', type: 'text', noCheckable: true,
                formatLabel: function (val) {
                    return STATUS_MAP[val];
                } 
            },
            {key: 'brhLevel', label: '机构级别', type: 'text', noCheckable: true},
            {key: 'oprBeinvitedCode', label: '上级推荐码', type: 'text'},
            {key: 'oprInviteCode', label: '推荐码', type: 'text'},
            {key: 'oprAttr', label: '地推身份类型', type: 'text', subType: '306',
                formatLabel: function (val) {
                    return OPRATTR_MAP[val];
                }
            }
        ]
    },{
        name: 'expInfo',
        caption: '拓展员详情',
        type: 'explore',
        items: [
            {key: 'cardNo', label: '身份证号码', type: 'text' },
            {key: 'idCardFront', label: '身份证正面照', type: 'img' },
            {key: 'idCardBack', label: '身份证反面照', type: 'img' },
            {key: 'personWithIdCard', label: '手持身份证照', type: 'img' },
            {key: 'bankCard', label: '银行卡照片', type: 'img' },
            {key: 'signPicture', label: '签名图片', type: 'img' }
        ]
    },{
        name: 'contact',
        caption: '联系方式',
        type: 'extra',
        items: [
            {key: 'tel', label: '固定电话', type: 'text'},
            {key: 'mobile', label: '手机号码', type: 'text'},
            {key: 'email', label: '邮箱', type: 'text'}
        ]
    },{
        name: 'company',
        caption: '公司信息',
        type: 'companyInfo',
        items: [
            {key: 'businessName', label: '公司名称', type: 'text', noCheckable: true},
            {key: 'businessLicNo', label: '营业执照号', type: 'text', subType: '306'}
        ]
    },{
        name: 'account',
        caption: '收款账户',
        type: 'accountInfo',
        items: [
            {key: 'bankName', label: '开户行', type: 'text'},
            {key: 'accountName', label: '账户名称', type: 'text'},
            {key: 'accountNo', label: '银行帐号', type: 'text'},
            {key: 'zbankName', label: '开户支行', type: 'text'}
        ]
    },{
        name: 'img',
        caption: '照片资料',
        type: 'imgInfo',
        items: [
            {key: 'transAppImage', label: '转让申请书照片', type: 'img'},
            {key: 'openPermitImage', label: '开户许可证照片', type: 'img'},
            {key: 'businessLicImg', label: '营业执照图片', type: 'img'}
        ]
    },{
        name: 'identification',
        caption: '活体识别',
        type: 'identity',
        items: [
            {key: 'recognizeScore', label: '分数', type: 'text'},
            {key: 'faceRecognition', label: '活体识别', type: 'img'},
            {key: 'faceRecognition1', label: '活体识别', type: 'img'}
        ]
    }
];

var infoSection = _.findWhere(section, {type: 'info'});
var expSection = _.findWhere(section, {type: 'explore'});
var extraSection = _.findWhere(section, {type: 'extra'});
var accountSection = _.findWhere(section, {type: 'accountInfo'});
var idenSection = _.findWhere(section, {type: 'identity'});
var imgSection = _.findWhere(section, {type: 'imgInfo'});
var companySection = _.findWhere(section, {type: 'companyInfo'});

%>

<div class="info-board">
    <div class="row user-form-group">
        <!--基本信息-->
        <div class="col-lg-4 user-form-section">
            <div class="container group-margintop">
                <div class="caption caption-text-font"><%= infoSection.caption %></div>
                <% _.each(infoSection.items, function(item) {
                    if(item.subType != '306' || item.subType == '306' && getValue(item) ){ %>
                    <div class="row row-margintop <%=item.key%>-row">
                        <label class="col-lg-4 info-item-text"><%= getLabel(item) %>：</label>
                        <div class="value col-lg-8 <%=item.noCheckable ? '' : 'checkable'%> checkable-text" name="<%=item.key%>">
                                <span class="text">
                                    <%= getValue(item) ? (item.formatLabel ? item.formatLabel(getValue(item)) : getValue(item)) : '无'%>
                                </span>
                        </div>
                    </div>
                <% }}); %>
            </div>
        </div>
        <!--拓展员详情-->
        <div class="col-lg-4 user-form-section">
            <div class="container group-margintop">
                <div class="caption caption-text-font"><%= expSection.caption %></div>
                <% _.each(expSection.items, function(item) { %>
                    <%if(item.type == 'text'){%>
                    <div class="row row-margintop <%=item.key%>-row">
                        <label class="col-lg-5 info-item-text"><%= getLabel(item) %>：</label>
                        <div class="value col-lg-7 <%=item.noCheckable || subType == 306  ? '' : 'checkable'%> checkable-text" name="<%=item.key%>">
                            <span class="text">
                                <%= getValue(item) ? (item.formatLabel ? item.formatLabel(getValue(item)) : getValue(item)) : '无'%>
                            </span>
                        </div>
                    </div>
                    <%}else if(item.type == 'img'){%>
                        <% if(getValue(item)){%>
                    <div class="img-wrap <%=item.noCheckable || subType == 306 ? '' : 'checkable'%>" name="<%=item.key%>">
                        <div class="img-inner-wrap">
                            <span class="vertical-helper"></span><img src="<%=getValue(item)%>?_t=<%=(new Date()).getTime()%>">
                        </div>
                        <div class="img-name-wrap">
                            <span class="img-name"><%= getLabel(item) %></span>
                        </div>
                    </div>
                        <%}else{%>
                    <div class="row row-margintop <%=item.key%>-row">
                        <label class="col-lg-5 info-item-text"><%= getLabel(item) %>：</label>
                        <div class="value col-lg-7">无</div>
                    </div>
                        <%}%>
                    <%}%>
                <% }); %>
            </div>
            <!--联系方式-->
            <div class="container group-margintop">
                <div class="caption caption-text-font"><%= extraSection.caption %></div>
                <% _.each(extraSection.items, function(item) { %>
                <div class="row row-margintop <%=item.key%>-row">
                    <label class="col-lg-4 info-item-text"><%= getLabel(item) %>：</label>
                    <div class="value col-lg-8 <%=item.noCheckable || subType == 306 ? '' : 'checkable'%> checkable-text" name="<%=item.key%>">
                            <span class="text">
                                <%= getValue(item) ? (item.formatLabel ? item.formatLabel(getValue(item)) : getValue(item)) : '无'%>
                            </span>
                    </div>
                </div>
                <% }); %>
            </div>
            <!--活体识别-->
            <div class="container group-margintop">
                <div class="caption caption-text-font"><%= idenSection.caption %></div>
                <% _.each(idenSection.items, function(item) { %>
                <%if(item.type == 'text'){%>
                <div class="row row-margintop <%=item.key%>-row">
                    <label class="col-lg-4 info-item-text"><%= getLabel(item) %>：</label>
                    <div class="value col-lg-8 <%=item.noCheckable || subType == 306 ? '' : 'checkable'%> checkable-text" name="<%=item.key%>">
                            <span class="text">
                                <%= getValue(item) ? (item.formatLabel ? item.formatLabel(getValue(item)) : getValue(item)) : '无'%>
                            </span>
                    </div>
                </div>
                <%}else if(item.type == 'img'){%>
                <% if(getValue(item)){ %>
                <div class="img-wrap <%=item.noCheckable || subType == 306 ? '' : 'checkable'%>" name="<%=item.key%>">
                    <div class="img-inner-wrap">
                        <span class="vertical-helper"></span><img src="<%=getValue(item)%>?_t=<%=(new Date()).getTime()%>">
                    </div>
                    <div class="img-name-wrap">
                        <span class="img-name"><%= getLabel(item) %></span>
                    </div>
                </div>
                <%}else{%>
                <div class="row row-margintop <%=item.key%>-row">
                    <label class="col-lg-4 info-item-text"><%= getLabel(item) %>：</label>
                    <div class="value col-lg-8">无</div>
                </div>
                <%}%>
                <%}%>
                <% }); %>
            </div>
        </div>
        <!--第三列-->
        <div class="col-lg-4 user-form-section" >
            <!--公司信息-->
            <div class="container group-margintop" <%=subType == 306 ? '' : 'hidden' %> >
                <div class="caption caption-text-font"><%= companySection.caption %></div>
                <% _.each(companySection.items, function(item) { %>
                <div class="row row-margintop <%=item.key%>-row">
                    <label class="col-lg-4 info-item-text"><%= getLabel(item) %>：</label>
                    <div class="value col-lg-8 <%=item.noCheckable ? '' : 'checkable'%> checkable-text" name="<%=item.key%>">
                            <span class="text">
                                <%= getValue(item) ? (item.formatLabel ? item.formatLabel(getValue(item)) : getValue(item)) : '无'%>
                            </span>
                    </div>
                </div>
                <% }); %>
            </div>
            <!--收款账号-->
            <div class="container group-margintop">
                <div class="caption caption-text-font"><%= accountSection.caption %></div>
                <% _.each(accountSection.items, function(item) { %>
                <div class="row row-margintop <%=item.key%>-row">
                    <label class="col-lg-4 info-item-text"><%= getLabel(item) %>：</label>
                    <div class="value col-lg-8 <%=item.noCheckable ? '' : 'checkable'%> checkable-text" name="<%=item.key%>">
                            <span class="text">
                                <%= getValue(item) ? (item.formatLabel ? item.formatLabel(getValue(item)) : getValue(item)) : '无'%>
                            </span>
                    </div>
                </div>
                <% }); %>
            </div>
            <!--照片资料-->
            <div class="container group-margintop"  <%=subType == 306 ? '' : 'hidden' %> >
                <div class="caption caption-text-font"><%= imgSection.caption %></div>
                <% _.each(imgSection.items, function(item) { %>
                <%if(item.type == 'text'){%>
                <div class="row row-margintop <%=item.key%>-row">
                    <label class="col-lg-5 info-item-text"><%= getLabel(item) %>：</label>
                    <div class="value col-lg-7" name="<%=item.key%>">
                            <span class="text">
                                <%= getValue(item) ? (item.formatLabel ? item.formatLabel(getValue(item)) : getValue(item)) : '无'%>
                            </span>
                    </div>
                </div>
                <%}else if(item.type == 'img'){%>
                <% if(getValue(item)){%>
                <div class="img-wrap <%=item.noCheckable ? '' : 'checkable'%>" name="<%=item.key%>">
                    <div class="img-inner-wrap">
                        <span class="vertical-helper"></span><img src="<%=getValue(item)%>?_t=<%=(new Date()).getTime()%>">
                    </div>
                    <div class="img-name-wrap">
                        <span class="img-name"><%= getLabel(item) %></span>
                    </div>
                </div>
                <%}else{%>
                <div class="row row-margintop <%=item.key%>-row">
                    <label class="col-lg-5 info-item-text"><%= getLabel(item) %>：</label>
                    <div class="value col-lg-7">无</div>
                </div>
                <%}%>
                <%}%>
                <% }); %>
            </div>
        </div>

        <div class="col-lg-4 user-form-section">
        </div>

    </div>
</div>
