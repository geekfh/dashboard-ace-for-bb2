<div id="dialog-form" title="划分批次">
    <form class="form-settle-sum">
        <fieldset>
            <br/>
            <div class="row">
                <div class="col-xs-12">
                    <input type="checkbox" name="sameBankFlag" value="1" checked>先将本代本单独成批</div>
            </div>
            <br/>
            <div class="row">
                <div class="col-xs-12">
                    再将资金划分为
                    <input type="text" name="batchNum" style="width: 36px;">
                    批次入账(
                    <label id="batchNum-to-append" style="color: blue;"></label>
                    )
                </div>
            </div>
            <br/>
            <div class="row">
                <div class="col-xs-12">
                    <input type="radio" name="sortLevel" value="0" checked>尽量将收款银行相同的划在同一批次。</div>
            </div>
            <div class="row">
                <div class="col-xs-12">
                    <input type="radio" name="sortLevel" value="1">先按照金额大小排序再划分批次</div>
            </div>
            <br/>
            <div class="row">
                <div class="col-xs-12" style="color:#969696;">注：清算给机构的款项将单独划为一个批次</div>
            </div>
            <br/>
            <div class="row">
                <div class="col-xs-12">
                    操作员描述
                    <textarea name="oprMsg1" style="width: 100%; height: 50px;" />
                </div>
            </div>

        </fieldset>
    </form>
</div>