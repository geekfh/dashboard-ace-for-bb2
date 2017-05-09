<form>
<div class="title"><span>结算扣率/封顶设置</span><i class="icon-plus-sign btn-add" title="增加"></i></div>
    <div class="base-ratio-title base-ratio-title-hundred row">
        <span class="trade-range col-sm-3">交易额区间(元)</span>
        <span class="profit-range col-sm-5">扣率(百分比<span class="base-ratio-range">，范围：<%= bormRange %></span>)</span>
        <span class="profit-range col-sm-4">封顶(元<span class="max-fee-range">，范围：<%= topRange%></span>)</span>
    </div>
    <div class="base-fixed-title row" hidden>
        <span class="trade-range col-sm-3">交易笔数(笔)</span>
        <span class="profit-range col-sm-5">扣率(元)</span>
        <span class="profit-range col-sm-4">封顶(元)</span>
    </div>
    <div class="base-ratio-title base-ratio-title-million row" hidden>
        <span class="trade-range col-sm-3">交易额区间(元)</span>
        <span class="profit-range col-sm-5">分润标准(万分比<span class="base-ratio-range">，范围：<%= bormRange %></span>)</span>
        <span class="profit-range col-sm-4">封顶(元<span class="max-fee-range">，范围：<%= topRange%></span>)</span>
    </div>
    <div class="base-ratio-container row">
        
    </div>
</form>