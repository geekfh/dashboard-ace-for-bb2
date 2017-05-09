<style type="text/css">
    .width100per{ width: 100%;}
    .width100{width: 100px;}
    .height100{height: 100px;}
    button{margin: 5px;}
    .color-red{color:red;}
    .color-blue{color:blue;}
    .foot{margin: 5px;}
    .block-div{padding-top: 10px;padding-bottom: 5px;border: solid 1px #d5d5d5}
    .attachment{padding-top: 10px;}
    img{
        border:solid 1px #d5d5d5;
    }
</style>
<%
var APPLY_STATUS = {
    "-1": "未审核",
    "1": "审核通过",
    "2": "审核不通过",
    "3": "异常"
};
%>
<div class="container">
    <div class="row applyerInfo">
        <div class="col-xs-12">
            <h5>申请人信息：</h5>
            <div class="row block-div">
                <div class="col-xs-4">
                    <p><span>提交日期：</span> <span><%=data.createTime || ''%></span></p>
                    <p><span>手机号码：</span> <span><%=data.mobileNo || ''%></span></p>
                    <p><span>商户号：</span> <span><%=data.mchtNo || ''%></span></p>
                    <p><span>经营状况说明：</span> <span><%=data.mchtStatusRemark || ''%></span></p>
                </div>
                <div class="col-xs-4">
                    <p><span>申请人：</span> <span><%=data.legalName || ''%></span></p>
                    <p><span>拓展员：</span> <span><%=data.expandName || ''%></span></p>
                    <p><span>审批状态：</span> <span><%=APPLY_STATUS[data.applyStatus] || ''%></span></p>
                    <p><span>提额申请说明：</span> <span><%=data.applyRemark || ''%></span></p>
                </div>
                <div class="col-xs-4">
                    <p><span>提交人：</span> <span><%=data.applyUserName || ''%></span></p>
                    <p><span>商户名称：</span> <span><%=data.mchtName || ''%></span></p>
                    <p><span>申请编号：</span> <span><%=data.applyId || ''%></span></p>
                </div>
            </div>
        </div>
    </div>
    <div class="row wannerAmount">
        <div class="col-xs-12">
            <h5>意愿额度   单位（元）</h5>
            <div class="row block-div">
                <div class="col-xs-4">
                    <p><span class="color-red">刷卡单笔额度：</span> <span><%= Opf.currencyFormatter(data.cardOneDeal) || 0%></span></p>
                    <p><span>微信单笔额度：</span> <span><%= Opf.currencyFormatter(data.wxOneDeal) || 0%></span></p>
                </div>
                <div class="col-xs-4">
                    <p><span class="color-blue">刷卡单日额度：</span> <span><%= Opf.currencyFormatter(data.cardOneDay) || 0%></span></p>
                    <p><span>微信单日额度：</span> <span><%= Opf.currencyFormatter(data.wxOneDay) || 0%></span></p>
                </div>
                <div class="col-xs-4">
                    <p><span>支付宝单笔额度：</span> <span><%= Opf.currencyFormatter(data.alipayOneDeal) || 0%></span></p>
                    <p><span>支付宝单日额度：</span> <span><%= Opf.currencyFormatter(data.alipayOneDay) || 0%></span></p>
                </div>
            </div>
        </div>
    </div>
    <div class="row agreeAmount">
        <div class="col-xs-12">
            <h5>审批额度   单位（元）</h5>
            <div class="row block-div edit-amount-block">
                <div class="col-xs-4">
                    <p><span class="color-red">刷卡单笔额度：</span> <input id="tCardOneDeal" value="<%=data.tCardOneDeal || 0%>"></p>
                    <p><span>微信单笔额度：</span> <input id="tWxOneDeal" value="<%=data.tWxOneDeal || 0%>"></p>
                </div>
                <div class="col-xs-4">
                    <p><span class="color-blue">刷卡单日额度：</span> <input id="tCardOneDay" value="<%=data.tCardOneDay || 0%>"></p>
                    <p><span>微信单日额度：</span> <input id="tWxOneDay" value="<%=data.tWxOneDay || 0%>"></p>
                </div>
                <div class="col-xs-4">
                    <p><span>支付宝单笔额度：</span> <input id="tAlipayOneDeal" value="<%=data.tAlipayOneDeal || 0%>"></p>
                    <p><span>支付宝单日额度：</span> <input id="tAlipayOneDay" value="<%=data.tAlipayOneDay || 0%>"></p>
                </div>
            </div>
            <div class="row block-div view-amount-block">
                <div class="col-xs-4">
                    <p><span class="color-red">刷卡单笔额度：</span> <span><%= Opf.currencyFormatter(data.tCardOneDeal) || 0%></span></p>
                    <p><span>微信单笔额度：</span> <span><%= Opf.currencyFormatter(data.tWxOneDeal) || 0%></span></p>
                </div>
                <div class="col-xs-4">
                    <p><span class="color-blue">刷卡单日额度：</span> <span><%= Opf.currencyFormatter(data.tCardOneDay) || 0%></span></p>
                    <p><span>微信单日额度：</span> <span><%= Opf.currencyFormatter(data.tWxOneDay) || 0%></span></p>
                </div>
                <div class="col-xs-4">
                    <p><span>支付宝单笔额度：</span> <span><%= Opf.currencyFormatter(data.tAlipayOneDeal) || 0%></span></p>
                    <p><span>支付宝单日额度：</span> <span><%= Opf.currencyFormatter(data.tAlipayOneDay) || 0%></span></p>
                </div>
            </div>
        </div>
    </div>
    <div class="row remark">
        <div class="col-xs-12">
            <h5>备注</h5>
            <div class="row">
                <textarea class="width100per" placeholder="备注信息" rows="4" value="<%=data.remark%>"><%=data.remark%></textarea>
            </div>
        </div>
    </div>
    <div class="row attachment">
        <div class="col-xs-3">
            <span>查看附件</span>
        </div>
        <div class="col-xs-9">
            <a target="_blank" href="<%=rowData.attPath || ''%>?_t=<%=(new Date()).getTime()%>">
                <img src="<%=rowData.attPath || ''%>?_t=<%=(new Date()).getTime()%>" class="width100 height100">
            </a>
        </div>
        <div class="col-xs-12 oprUser">
            <span>审批人：</span><span><%=data.oprUserId%></span>
        </div>
    </div>
    <div class="row pull-right foot">
        <button class="btn btn-primary passBtn">通过</button>
        <button class="btn btn-danger unPassBtn">未通过</button>
    </div>
</div>