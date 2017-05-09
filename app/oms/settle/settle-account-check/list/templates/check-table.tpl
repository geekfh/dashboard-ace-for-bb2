<div class="table-wrap">
    <table id="actCheck" class="table table-bordered table-hover">
        <tr>
            <td class="noneRightBorder" style="width: 35%;"></td>
            <td class="noneLeftBorder" style="width: 17%;"></td>
            <td class="textCenter" style="width: 12%">交易笔数</td>
            <td class="textCenter" style="width: 12%">交易金额</td>
            <td class="textCenter" style="width: 12%">商户手续费</td>
            <td class="textCenter" style="width: 12%">应付</td>
        </tr>
        <tr id="tr-trade-water" style="cursor: pointer;">
            <td class="noneRightBorder" style="text-align: right">23:00 ~ 23:00</td>
            <td class="noneLeftBorder">所有成功交易</td>
            <td class="textCenter"><%=txNum%></td>
            <td class="textCenter"><%=txAmt%></td>
            <td class="textCenter">—</td>
            <td class="textCenter">—</td>
        </tr>
        <tr id="tr-clear-water" style="cursor: pointer;">
            <td class="noneRightBorder" style="text-align: right"><p><%=dateDescShort%></p></td>
            <td class="noneLeftBorder">所有参与清分交易</td>
            <td class="textCenter"><%=clearNum || 0%></td>
            <td class="textCenter"><%=clearAmt || 0%></td>
            <td class="textCenter"><%=clearFee || 0%></td>
            <td class="textCenter"><%=clearSettle || 0%></td>
        </tr>
        <tr id="tr-stlm-errors" style="cursor: pointer;">
            <td class="noneBottomBorder">
                <span class="hor-group-title">差错交易</span>
            </td>
            <td>本期延迟</td>
            <td class="textCenter"><%=delayNum%></td>
            <td class="textCenter"><%=delayAmt%></td>
            <td class="textCenter">—</td>
            <td class="textCenter">—</td>
        </tr>
        <tr id="tr-stlm-errors-his" style="cursor: pointer;">
            <td class="noneTopBorder"></td>
            <td>历史延迟在本期恢复</td>
            <td class="textCenter"><%=redoNum%></td>
            <td class="textCenter"><%=redoAmt%></td>
            <td class="textCenter"><%=redoFee%></td>
            <td class="textCenter"><%=redoSettle%></td>
        </tr>
        <tr>
            <td class="noneRightBorder"></td>
            <td class="noneLeftBorder">调账前汇总</td>
            <td class="textCenter"><%=totalNum%></td>
            <td class="textCenter"><%=totalAmt%></td>
            <td class="textCenter"><%=totalFee%></td>
            <td class="textCenter"><%=totalSettle%></td>
        </tr>
        <tr id="tr-stlm-repair-dtl-in" style="cursor: pointer;">
            <td class="noneBottomBorder"></td>
            <td>本期截留</td>
            <td class="textCenter">—</td>
            <td class="textCenter">—</td>
            <td class="textCenter">—</td>
            <td class="textCenter"><%=deleySettle%></td>
        </tr>
        <tr id="tr-stlm-repair-dtl-out" style="cursor: pointer;">
            <td class="noneTopBorder noneBottomBorder">调账</td>
            <td>本期解冻</td>
            <td class="textCenter">—</td>
            <td class="textCenter">—</td>
            <td class="textCenter">—</td>
            <td class="textCenter"><%=repairAmt%></td>
        </tr>
        <tr id="tr-settle-errors" style="cursor: pointer;">
            <td class="noneTopBorder"></td>
            <td>历史失败参与本期清算</td>
            <td class="textCenter">—</td>
            <td class="textCenter">—</td>
            <td class="textCenter">—</td>
            <td class="textCenter"><%=repairSettle%></td>
        </tr>
        <tr>
            <td class="noneRightBorder"></td>
            <td class="noneLeftBorder">调账后汇总</td>
            <td class="textCenter">—</td>
            <td class="textCenter">—</td>
            <td class="textCenter">—</td>
            <td class="textCenter"><%=settleAmt%></td>
        </tr>
    </table>
</div>