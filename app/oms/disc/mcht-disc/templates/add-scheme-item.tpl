<form onsubmit="return false;">
    
<div class="col-sm-2 amount-container">
    <!-- <span class="order"><%= order %></span> -->
    <div class="floor-amount-wrapper">
        <input type="text" class="floor-amount" name="floor-amount-<%= id %>">
    </div>
    -
    <div class="upper-amount-wrapper">
        <input type="text" class="upper-amount" name="upper-amount-<%= id %>">
    </div>
</div>
<div class="col-sm-2 cardType-container">
    <input class="card-type" name="card-type-<%= id %>" style="min-width:100px;width:100%;">
</div>
<div class="col-sm-2 flag-container">
    <select class="flag" name="flag-<%= id %>">
        <option value="1">扣率</option>
    </select>
</div>
<div class="col-sm-2 fee-value-container">
    <span>扣率(%)</span>
    <div class="fee-value-wrapper">
        <input type="text" class="fee-value" name="fee-value-<%= id %>">
        <label class="fee-value-tip"></label>
    </div>
</div>
<div class="col-sm-3 fee-container">
    <span>保底/封顶(元)</span>
    <div class="min-fee-wrapper">
        <input type="text" class="min-fee" name="min-fee-<%= id %>" value="">
    </div>
    -
    <div class="max-fee-wrapper">
        <input type="text" class="max-fee" name="max-fee-<%= id %>" value="">
        <label class="max-fee-tip"></label>
    </div>
</div>
<div class="col-sm-1 operation-container">
    <i class="icon-minus-sign btn-delete" title="删除"></i>
</div>
</form>