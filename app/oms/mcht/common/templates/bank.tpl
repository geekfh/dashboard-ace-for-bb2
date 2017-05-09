<div class="account account-section" style="overflow-y: auto;">
    <div class="form-horizontal" style="overflow: hidden; padding: 60px;">
        <form id="f_bank">
        <div class="form-group div_proxy">
            <div>
                <span class="col-md-2 col-md-offset-2" style="width: 320px;">
                    <label class="account-proxy-label">
                        <input data-set='account' type="checkbox" id="accountProxy"> 委托他人收款
                    </label>
                    <span id="account-proxy-check" class="delegate-fieldset" style="margin-left:10px;" hidden>
                        <input type="radio" value="0" name="accountType" />对公
                        <input type="radio" value="1" name="accountType" style="margin-left:10px;" />对私
                    </span>
                </span>
            </div>
        </div>

        <!--<div class="form-group" hidden>-->
            <!--<label class="col-md-2 control-label">开户支行号:</label>-->
            <!--<input id="zbankNo" type="text">-->
        <!--</div>-->

        <div class="form-group">
            <label class="col-md-2 control-label">开户名:</label>
            <div id="div_accountName"  class="col-md-4 not-delegate-fieldset">
            <!-- 动态追加控件 -->
            </div>
            <div class="col-md-2 alert alert-info mchtType-group" role="alert" style="height: 30px; line-height: 0; display: block; text-align: center;">
                <strong>直联商户</strong>
            </div>
        </div>

        <div class="form-group bank-infos-group" hidden>
            <label class="col-md-2 control-label">开户行:</label>
            <div class="col-md-4">
                <input type="text" class="form-control" id="bankInfos" name="bankInfos">
            </div>
            <input id="bankNo" name="bankNo" type="hidden" value="<%=model.bankNo%>" type="text" />
            <input id="bankName" name="bankName" type="hidden" value="<%=model.bankName%>" type="text" />
        </div>

        <div class="form-group" id="div_account_no">
            <label class="col-md-2 control-label">账户号:</label>
            <div class="account-private">
                <div class="col-md-4">
                    <input id="accountNo" name="accountNo" class="form-control" type="text" maxlength="28" value="<%=model.accountNo%>">
                    <input id="bankLongNo" name="bankLongNo" type="hidden" value="<%=model.bankNo%>" type="text" />
                    <input id="bankLongName" name="bankLongName" type="hidden" value="<%=model.bankName%>" type="text" />
                </div>
                <div class='bank-logo-place'></div><!--银行LOGO-->
            </div>
        </div>

        <div class="form-group">
            <label class="col-md-2 control-label">开户支行名称:</label>

            <div class="col-md-2">
                <select xdata-set='account' class="form-control" id="zbankProvince" name="zbankProvince">
                    <option class="placeholder">-选择省-</option>
                </select>
            </div>
            <div class="col-md-2">
                <select xdata-set='account' class="form-control" id="zbankCity" name="zbankCity">
                    <option class="placeholder">-选择市-</option>
                </select>
            </div>
            <div class="col-md-2">
                <select data-set='account' class="form-control" id="zbankRegionCode" name="zbankRegionCode">
                    <option class="placeholder">-选择区-</option>
                </select>
            </div>
        </div>

        <div class="form-group">
            <label class="col-md-2 control-label">&nbsp;</label>
            <div class="col-md-6">
                <textarea data-set='account' class="zbank-input" id="zbankName" name="zbankName" placeholder="输入支行名称"  style="width: 379px; height: 87px;" disabled="disabled"><%=model.zbankName%></textarea>
                <input tabindex="999" data-set='account' id="zbankNo" class="float-hidden form-control" type="text" value="<%=model.zbankNo%>" />
            </div>
        </div>

        <div class="form-group">
            <label class="col-md-2 control-label">&nbsp;</label>
            <input id="sp_accountValid" type="button" class="btn btn-info col-md-6 disabled" value="账户号验证" style="cursor: pointer; width: 204px; height: 40px; margin-left: 12px;" />
            <font style="color: #ff0000;line-height: 40px;font-size: 14px;">对公账户暂不支持验证</font>
        </div>

        </form>
    </div>
</div>