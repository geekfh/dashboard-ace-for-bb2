<%
    var rowData = respData.content[0];
    var ignoreFields = respData.ignoreFields;

    var COUPONID_FORMATTER = function(val) {
        return val? '<a href="javascript:;" onclick="App.__events__.jumpTo_coupon(this);" data-value="'+val+'">'+val+'</a>':"";
    };

    var ACTYPE_MAP = {
        "1": "借记卡",
        "2": "贷记卡",
        "3": "准贷记卡",
        "4": "预付费卡"
    };
    var TXSUBCODE_MAP = {
        '0033':'POS消费撤销',
        '0053':'POS消费撤销',
        '0032':'POS消费冲正',
        '0052':'POS消费冲正',
        '0031':'POS消费',
        '0051':'POS消费',
        '9090':'代扣',
        '7051':'电子现金脱机消费',
        '1033':'微信收款撤销',
        '1133':'慧收银微信收款撤销',
        '1233':'好哒微信收款撤销',
        '2033':'支付宝收款撤销',
        '2133':'慧收银支付宝收款撤销',
        '2233':'好哒支付宝收款撤销',
        '2333':'支付宝APP支付撤销',
        '6033':'钱包信用消费撤销',
        '6333':'好哒白条支付撤销',
        '6133':'钱包快捷消费撤销',
        '6233':'钱包余额消费撤销',
        '8033':'快捷支付无卡撤销',
        '1031':'微信收款',
        '1131':'慧收银微信收款',
        '1231':'好哒微信收款',
        '2031':'支付宝收款',
        '2131':'慧收银支付宝收款',
        '2231':'好哒支付宝收款',
        '2331':'支付宝APP支付',
        '6031':'钱包信用消费',
        '6331':'好哒白条支付',
        '6131':'钱包快捷消费',
        '6231':'钱包余额消费',
        '8031':'快捷支付无卡消费'
    };

    var STAT_MAP = {
        '0' : '交易成功',
        '1' : '交易请求中',
        '2' : '已冲正',
        '3' : '已撤销',
        '4' : '交易失败',
        '5' : '部分退货',
        '6' : '全额退货',
        '7' : '交易异常(收到冲正交易)',
        '9' : '交易取消'
    };

    var detaileConfig = [
        {label:'交易时间', name: 'time', value: ''},
        {label:'交易流水号', name: 'traceNo', value: ''},
        {label:'渠道流水号', name: 'fd11', value: ''},
        {label:'渠道批次号', name: 'batchNo', value: ''},
        {label:'订单号', name: 'orderNo', value: ''},
        {label:'交易金额', name: 'amt', value: ''},
        {label:'交易类型', name: 'txSubCode', formatter: function(val){ return TXSUBCODE_MAP [val] || ''; }},
        {label:'交易名称', name: 'txName', value: ''},
        {label:'交易状态', name: 'stat', formatter: function(val){ return STAT_MAP [val] || ''; }},
        {label:'优惠券号', name: 'couponId', value: '', formatter: COUPONID_FORMATTER},
        {label:'交易终端', name: 'tradeTerminal', value: ''},
        {label:'支付方式', name: 'paymentMethod', value: ''},
        {label:'服务类型', name: 'serviceType', value: ''},
        {label:'消费卡号', name: 'acNo', value: ''},
        {label:'卡类型', name: 'acType', value: '', formatter: function(val){ return ACTYPE_MAP [val] || ''; }},
        {label:'终端编号', name: 'iboxNo', value: ''},
        {label:'机构名称', name: 'branchName', value: ''},
        {label:'机构号', name: 'brNo', value: ''},
        {label:'商户名称', name: 'ibox43', value: ''},
        {label:'商户编号', name: 'ibox42', value: ''},
        {label:'收银员编号', name: 'userId', value: ''},
        {label:'收银员', name: 'userName', value: ''},
        {label:'商户结算账户', name: 'userAccNo', value: ''},
        {label:'拓展员', name: 'expandName', value: ''},
        {label:'交易渠道', name: 'cupsNo', value: ''},
        {label:'渠道商户号', name: 'cupsMchtNo', value: ''},
        {label:'渠道商户名', name: 'cupsMchtName', value: ''},
        {label:'交易描叙', name: 'fdxxx', value: ''},
        {label:'检索参考号', name: 'fd37', value: ''},
        {label:'受卡方所在地时间', name: 'fd12', value: ''},
        {label:'受卡方所在地日期', name: 'fd13', value: ''},
        {label:'错误码', name: 'fd39', value: ''},
        {label:'结算周期', name: 'discCycle', value: ''},
        {label:'失败原因', name: 'errStr', value: ''}
    ];

%>
<div>
    <form name="FormPost"  class="FormGrid" style="width:auto;overflow:auto;position:relative;height:auto;">
        <table id="ViewTbl_trade-txn-grid-table" class="EditTable" cellspacing="1" cellpadding="2" border="0" style="table-layout:fixed">
            <tbody>
              
                <% _.each(detaileConfig, function (rowConf) { 
                    if (!_.contains(ignoreFields, rowConf.name)) {
                %>
                    <tr rowpos="2" class="FormData">
                        
                        <td class="CaptionTD form-view-label ui-widget-content" width="30%"> 
                            <b><%=rowConf.label %></b>
                        </td>

                        <td class="DataTD form-view-data ui-helper-reset ui-widget-content" id="v_time">
                            &nbsp;
                            <span><%= rowConf.formatter ? rowConf.formatter(rowData[rowConf.name], rowData) : rowData[rowConf.name] %></span>
                        </td>
                    </tr>
                <% 
                    }
                }); %>
                <!-- <tr rowpos="3" class="FormData">
                    <td class="CaptionTD form-view-label ui-widget-content" width="30%">
                        <b>交易流水号</b>
                    </td>
                    <td class="DataTD form-view-data ui-helper-reset ui-widget-content" id="v_traceNo">
                        &nbsp;
                        <span>000000387015</span>
                    </td>
                </tr> -->
               

            </tbody>
        </table>
    </form>
<!--     <table border="0" class="EditTable" id="ViewTbl_trade-txn-grid-table_2">
        <tbody>
            <tr id="Act_Buttons">
                <td class="navButton" width="30%">
                    <a id="pData" class="fm-button ui-state-default ui-corner-left ui-state-disabled">
                        <span class="ui-icon ui-icon-triangle-1-w"></span>
                    </a>
                    <a id="nData" class="fm-button ui-state-default ui-corner-right">
                        <span class="ui-icon ui-icon-triangle-1-e"></span>
                    </a>
                </td>
                <td class="EditButton">
                    <a id="cData" class="fm-button ui-state-default ui-corner-all fm-button-icon-left">
                        关闭
                        <span class="ui-icon ui-icon-close"></span>
                    </a>
                </td>
            </tr>
        </tbody>
    </table> -->
</div>