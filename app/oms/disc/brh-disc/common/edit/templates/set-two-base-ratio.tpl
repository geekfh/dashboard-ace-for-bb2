<form>
    <div class="title">
        <span>结算扣率/封顶设置</span>
        <i class="icon-plus-sign btn-add" title="增加"></i>
        <select class="base-type">
            <option value="0">按交易额</option>
            <option value="1">按交易笔数</option>
        </select>
    </div>
    <div class="base-ratio-title row">
        <span class="trade-range col-sm-3">交易额区间(元)</span>
        <span class="profit-range col-sm-5">扣率(百分比<span class="base-ratio-range">，范围：<%= bormRange %></span>)</span>
        <span class="profit-range col-sm-4">封顶(元<span class="max-fee-range">，范围：<%= topRange%></span>)</span>
        <span class="fix-fee-range col-sm-9" hidden>手续费(元)</span>
    </div>
    <div class="base-ratio-container row">

    </div>
</form>