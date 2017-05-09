<form name="FormPost" class="FormGrid" onsubmit="return false;">
    <table class="EditTable" cellspacing="0" cellpadding="0" border="0">
        <tbody>
            <!--ID-->
            <tr class="FormData">
                <td class="CaptionTD">ID</td>
                <td class="DataTD"></td>
            </tr>

            <!--商户编号-->
            <tr class="FormData">
                <td class="CaptionTD">商户编号</td>
                <td class="DataTD">&nbsp;<input type="text" name="mchtNo" class="FormElement ui-widget-content ui-corner-all"></td>
            </tr>

            <!--优惠券类型-->
            <tr class="FormData">
                <td class="CaptionTD">优惠券类型</td>
                <td class="DataTD">&nbsp;免扣券</td>
            </tr>

            <!--适用交易-->
            <tr class="FormData">
                <td class="CaptionTD">适用交易</td>
                <td class="DataTD">&nbsp;优惠券刷卡</td>
            </tr>

            <!--优惠券面值-->
            <tr class="FormData">
                <td class="CaptionTD">优惠券面值</td>
                <td class="DataTD">&nbsp;<select name="discountCouponDtlId" class="FormElement ui-widget-content ui-corner-all"></select></td>
            </tr>

            <!--优惠券数量-->
            <tr class="FormData">
                <td class="CaptionTD">优惠券数量</td>
                <td class="DataTD">&nbsp;<input type="text" name="couponCount" class="FormElement ui-widget-content ui-corner-all"></td>
            </tr>

            <!--备注-->
            <tr class="FormData">
                <td class="CaptionTD">备注</td>
                <td class="DataTD">&nbsp;<textarea name="remark" cols="33" rows="5" class="FormElement ui-widget-content ui-corner-all"></textarea></td>
            </tr>

            <!--提示信息-->
            <tr class="FormData">
                <td class="CaptionTD"></td>
                <td class="DataTD">
                    <p class="text-grey">
                        提示：您本月已发放优惠券 <b class="text-primary" id="coupon_count">0</b> 张，总面额 <b class="text-primary" id="coupon_total">0</b> 元
                    </p>
                </td>
            </tr>
        </tbody>
    </table>
</form>