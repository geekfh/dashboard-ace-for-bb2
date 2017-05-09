<div>
    <form onsubmit="return false;" class="FormGrid disc">
        <table border="0" class="EditTable">
            <tbody>
                <tr style="display:none" class="tinfo"></tr>
                <tr style="display:none" rowpos="1" class="FormData" id="tr_id"></tr>
                <tr class="FormData" id="tr_transType">
                    <td class="CaptionTD">交易类型:</td>
                    <td class="DataTD">&nbsp;
                        <select class="trans-type" name="trans-type">
                            <!-- 0-全部类 1-消费类 2-线上支付类 -->
                            <option value="0" data-disabled="all">全部类</option>
                            <option value="1" selected data-disabled="消费类">消费类</option>
                            <option value="2" data-disabled="线上支付类">线上支付类</option>
                        </select>
                        <span class="pay-way" name="pay-way">
                            &nbsp;&nbsp;支付方式:&nbsp;&nbsp;
                            <input style="min-width: 150px;max-width: 400px;">
                        </span>
                    </td>
                </tr>
                <tr class="FormData" id="tr_cardType">
                    <td class="CaptionTD">卡类型:</td>
                    <td class="DataTD">&nbsp;
                        <input class="card-type" name="card-type" style="min-width: 100px;">
                    </td>
                </tr>
                <tr class="FormData" id="tr_termType">
                    <td class="CaptionTD">产品类型:</td>
                    <td class="DataTD">&nbsp;
                        <select class="term-type" name="term-type">
                            <option value="99" data-disabled="all">全部</option>
                            <option value="01" data-disabled="MPOS">MPOS</option>
                            <option value="02" data-disabled="慧POS">慧POS</option>
                            <option value="03" data-disabled="慧收银">慧收银</option>
                            <option value="04" data-disabled="好哒">好哒</option>
                        </select>
                    </td>
                </tr>
                <!--<tr class="FormData" id="tr_mchtType">
                    <td class="CaptionTD">商户类型:</td>
                    <td class="DataTD">&nbsp;
                        <select class="mcht-grp" name="mcht-grp" disabled>
                            &lt;!&ndash; 00-全部类型 01-餐娱类 02-房产汽车类 03-民生类 05-一般类 06-批发类 10-扣率类 11-封顶类 &ndash;&gt;
                            <option value="00">全部类型</option>
                            <option value="01">餐娱类</option>
                            <option value="02">房产汽车类</option>
                            <option value="03">民生类</option>
                            <option value="05">一般类</option>
                            <option value="06">批发类</option>
                            <option value="10">扣率类</option>
                            <option value="11">封顶类</option>
                        </select>
                    </td>
                </tr>-->
                <tr class="FormData" id="tr_ratioType">
                    <td class="CaptionTD">扣率类型:</td>
                    <td class="DataTD">&nbsp;
                        <select class="ratio-type" name="ratio-type">
                            <option value="1">按笔比例(百分之)</option>
                            <option value="2">按笔固定</option>
                            <option value="3">按笔比例(万分之)</option>
                        </select>
                    </td>
                </tr>
                <tr class="FormData">
                    <td class="CaptionTD">结算周期:</td>
                    <td class="DataTD">&nbsp;
                        <select class="disc-cycle" name="disc-cycle">
                            <option value="9" data-disabled="all">全部</option>
                            <option value="1" data-disabled="T1">T1</option>
                            <option value="0" data-disabled="T0S0">T0S0</option>
                        </select>
                    </td>
                </tr>
            </tbody>
        </table>

        <div class="base-ratio-section">
            <div class="title">结算扣率/封顶设置</div>
            <div class="base-ratio-title row">
            <span class="base-ratio-label col-sm-6">扣率(百分比<span class="base-ratio-range">，范围：<%=minBorm%>-<%=maxBorm%></span>)</span>
                <span class="max-fee-label col-sm-6">封顶(元<span class="max-fee-range">，范围：<%=minTop%>-<%=maxTop%></span>)</span>
            </div>
            <div class="base-ratio-content row">
                <div class="col-sm-6">
                    <div class="base-ratio-wrapper">
                        <input class="base-ratio" name="base-ratio" type="text">
                    </div>
                </div>
                <div class="col-sm-6">
                    <div class="max-fee-wrapper">
                        <input class="max-fee" name="max-fee" type="text">
                    </div>
                </div>
            </div>
        </div>
        <div class="sign-ratio-section">
            <div class="title">签约扣率/封顶范围</div>
            <div class="sign-ratio-title row">
                <span class="sign-ratio-label col-sm-6">扣率(百分比<span class="sign-ratio-range">，范围：<%=minBorm%>-<%=maxBorm%></span>)</span>
                <span class="top-label col-sm-6">封顶(元<span class="top-range">，范围：<%=minTop%>-<%=maxTop%></span>)</span>
            </div>
            <div class="sign-ratio-content row">
                <div class="borm col-sm-6">
                    <div class="min-borm-wrapper">
                        <input class="min-borm" name="min-borm" type="text">
                    </div>
                    -
                    <div class="max-borm-wrapper">
                        <input class="max-borm" name="max-borm" type="text">
                    </div>
                </div>
                <div class="top-fee col-sm-6">
                    <div class="min-top-wrapper">
                        <input class="min-top" name="min-top" type="text">
                    </div>
                    -
                    <div class="max-top-wrapper">
                        <input class="max-top" name="max-top" type="text">
                    </div>
                </div>
            </div>
        </div>
    </form>
    <div class="unite-ratio-section">
        
    </div>
</div>