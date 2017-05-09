<% 
    var FREQUENCY_MAP = {
        0 : "年",
        1 : "月",
        2 : "周"
        };

    var FEE_MAP = {
        0 : fixedFeeAmt + "元",
        1 : fixedFeeAmt + "元/" + FREQUENCY_MAP[fixedFeeFrequency],
        2 : "免费开通"
        };

    var FEE_RATE = {
        0 : "免手续费"
        };

    var REWARD_MAP = {
        0 : "户"
    };

%>
<div class="service-container col-xs-12 col-md-8">
    <div class="title-fee-special">
        <div class="title"><%= name %></div>
        <div class="fee">
            <span class="fix-fee"><%= FEE_MAP[fixedFeeType] %>，</span><span class="handling-charge"><%= (handlingChargeRate == 0) ? "免手续费" : "手续费在原来的基础上增加" + handlingChargeRate + "%。" %></span>
        </div>
        <% if(trialPrice) { %>
        <div class="special-offers">
            <span class="special-offers-title">优惠活动：</span><span><%= trialPrice %></span>元试用<span><%= trialPeriod %></span>天
        </div>
        <% } %>
    </div>
    <div class="service-desc">
        <div class="service-title">服务内容</div>
        <div class="service-summary-desc">
            <%= summaryDesc %>
            <% if(shouldAppendUnfoldBtn) { %>
                <a href="javascript: void 0" class="unfold">更多></a>
            <% } %>
        </div>
        <div class="service-detail-desc">
            <%= desc %>
            <a href="javascript: void 0" class="fold"><折叠</a>
        </div>
    </div>
</div>

<div class="reward-list-buttons-container col-lg-offset-1 col-lg-3 col-md-4 col-xs-12 row">
    <div class="reward-share-model col-xs-12">
        <div class="agency-reward">
            <span class="reward-title">代理商奖励：</span>
            <span>成功开通商户奖励</span>
            <span class="reward-desc"><%= fixedRewardAmt %>元/<%= REWARD_MAP[fixedRewardType] %></span>
        </div>
        <div class="share-model">
            <span>您当前为<%= shareProfitModelName %>分润模型</span>
        </div>
    </div>
    <div class="list-buttons-container col-xs-12 row">
        <div class="bussiness-list col-xs-12 col-md-6">
            <% if(activateWay == "2") { %>
                <div class="available clearfix">
                    <span class="desc">可邀请商户</span>
                    <span class="availableNum"><%= availableNum %>户</span>
                </div>
                <div class="invited clearfix">
                    <span class="desc">已邀请商户</span>
                    <span class="inviteNum"><%= invitedNum %>户</span>
                </div>
            <% } %>
            <div class="actual clearfix">
                <span class="desc">已开通商户</span>
                <span class="actualNum"><%= actualNum %>户</span>
            </div>
        </div>
        <div class="buttons-container col-xs-12 col-md-6">
            <% if(activateWay == "2" && Ctx.avail('mcht.service.invite')) { %>
                <div class="col-md-12 col-xs-6 invite-more-container">
                    <button type="button" class="btn btn-default btn-primary invite-more">邀请商户</button>
                </div>
            <% } %>
            <% if(Ctx.avail('mcht.service.show.active')) { %>
                <div class="col-md-12 col-xs-6 show-actual-user-container">
                    <button type="button" class="btn btn-default btn-success show-actual-user">已开通商户</button>
                </div>
            <% } %>
        </div>
    </div>
</div>
