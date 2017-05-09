<%
    var TICKET_TYPE_MAP ={
        '1': '增值税专用发票6%',
        '2': '增值税专用发票3%',
        '3': '普通发票3%'
    };
%>

<div class="innerwrap view-innerwrap">
    <div class="wizard-panel">
        <div class="top clearfix">
            <button class="btn js-back btn-default pull-left" type="button">
                <span class="icon icon-reply">返回</span>
            </button>
            <button class="btn btn-success btn-submit pull-right">审核通过</button>
        </div>
        <div class="main">
            <div class="tab-content" style="border: none;">
                <div class="tab-pane active">
                    <div class="container body audit-info">
                        <form id="postedTicketAudit">
                            <div class="auditInfo">
                                <div class="caption"><b>开票信息</b></div>
                                <div class="form-horizontal" role="form">
                                    <div class="form-group">
                                        <label class="col-md-3 control-label">开票内容</label>
                                        <label class="col-md-4" name="title"><%=title%></label>
                                    </div>
                                    <div class="form-group">
                                        <label class="col-md-3 control-label">收款单位</label>
                                        <label class="col-md-4" name="payee"><%=payee%></label>
                                    </div>
                                    <div class="form-group">
                                        <label class="col-md-3 control-label">发票代码</label>
                                        <label class="col-md-4" name="invoiceCode"><%=invoiceCode%></label>
                                    </div>
                                    <div class="form-group">
                                        <label class="col-md-3 control-label">发票号码</label>
                                        <label class="col-md-4" name="invoiceNo"><%=invoiceNo%></label>
                                    </div>
                                    <div class="form-group">
                                        <label class="col-md-3 control-label">报税月份</label>
                                        <label class="col-md-4" name="remark"><%=remark%></label>
                                    </div>
                                </div>
                            </div>
                            <div class="auditAmount">
                                <div class="caption"><b>开票金额</b></div>
                                <div class="form-horizontal" role="form">
                                    <div class="form-group">
                                        <label class="col-md-3 control-label">发票类型</label>
                                        <label class="col-md-4" name="invoiceType"><%=TICKET_TYPE_MAP[invoiceType]%></label>
                                    </div>
                                    <div class="form-group">
                                        <label class="col-md-3 control-label">开票金额(元)</label>
                                        <label class="col-md-4" name="amount"><%=amount%></label>
                                    </div>
                                    <div class="form-group">
                                        <label class="col-md-3 control-label">奖励总金额(元)</label>
                                        <label class="col-md-4" name="ticketAmount"><%=ticketAmount%></label>
                                    </div>
                                    <div class="form-group">
                                        <label class="col-md-3 control-label">扣税金额(元)</label>
                                        <label class="col-md-4" name="taxAmount"><%=taxAmount%></label>
                                    </div>
                                    <div class="form-group">
                                        <label class="col-md-3 control-label">税后金额(元)</label>
                                        <label class="col-md-4" name="thawAmount"><%=thawAmount%></label>
                                    </div>
                                    <div class="form-group">
                                        <label class="col-md-3 control-label">进项税金额(元)</label>
                                        <label class="col-md-4" name="inputTaxAmount"><%=inputTaxAmount%></label>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <div class="bottom clearfix">
            <button class="btn btn-primary pull-right btn-change">修改</button>
        </div>
    </div>
</div>

<div class="innerwrap edit-innerwrap input-only-bottom-border" hidden>
    <div class="wizard-panel">
        <div class="top clearfix">
            <button class="btn js-back btn-default pull-left" type="button">
                <span class="icon icon-reply">返回</span>
            </button>
            <button class="btn btn-success btn-submit pull-right">审核通过</button>
        </div>
        <div class="main">
            <div class="tab-content" style="border: none;">
                <div class="tab-pane active">
                    <div class="container body audit-info">
                            <form id="postedTicketAuditEdit">
                            <div class="auditInfo">
                                <div class="caption"><b>开票信息</b></div>
                                <div class="form-horizontal" role="form">
                                    <div class="form-group">
                                        <label class="col-md-3 control-label">开票内容</label>
                                        <div class="col-md-4 input-wrap">
                                            <input class="form-control" type="text" name="title" value="<%-title%>">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label class="col-md-3 control-label">收款单位</label>
                                        <div class="col-md-4 input-wrap">
                                            <input class="form-control" type="text" name="payee" value="<%-payee%>">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label class="col-md-3 control-label">发票代码</label>
                                        <div class="col-md-4 input-wrap">
                                            <input class="form-control" type="text" name="invoiceCode" value="<%-invoiceCode%>">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label class="col-md-3 control-label">发票号码</label>
                                        <div class="col-md-4 input-wrap">
                                            <input class="form-control" type="text" name="invoiceNo" value="<%-invoiceNo%>">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label class="col-md-3 control-label">报税月份</label>
                                        <div class="col-md-4 input-wrap">
                                            <input class="form-control" type="text" name="remark" value="<%-remark%>">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="auditAmount">
                                <div class="caption"><b>开票金额</b></div>
                                <div class="form-horizontal" role="form">
                                    <div class="form-group">
                                        <label class="col-md-3 control-label">发票类型</label>
                                        <div class="col-md-4 input-wrap">
                                            <select class="form-control" type="text" name="invoiceType">
                                                <option value="1" <%= invoiceType=='1' ? 'selected' : ''%>>增值税专用发票6%</option>
                                                <option value="2" <%= invoiceType=='2' ? 'selected' : ''%>>增值税专用发票3%</option>
                                                <option value="3" <%= invoiceType=='3' ? 'selected' : ''%>>普通发票3%</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label class="col-md-3 control-label">开票金额(元)</label>
                                        <div class="col-md-4 input-wrap">
                                            <input class="form-control" type="text" name="amount" value="<%-amount%>">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label class="col-md-3 control-label">奖励总金额(元)</label>
                                        <div class="col-md-4 input-wrap">
                                            <input class="form-control" type="text" name="ticketAmount" value="<%-ticketAmount%>">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label class="col-md-3 control-label">扣税金额(元)</label>
                                        <div class="col-md-4 input-wrap">
                                            <input class="form-control" type="text" name="taxAmount" value="<%-taxAmount%>" disabled>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label class="col-md-3 control-label">税后金额(元)</label>
                                        <div class="col-md-4 input-wrap">
                                            <input class="form-control" type="text" name="thawAmount" value="<%=ticketAmount-taxAmount%>" disabled>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label class="col-md-3 control-label">进项税金额(元)</label>
                                        <div class="col-md-4 input-wrap">
                                            <input class="form-control" type="text" name="inputTaxAmount" value="<%-inputTaxAmount%>">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <div class="bottom clearfix">
            <button class="btn btn-default pull-right btn-cancel">取消</button>
            <button class="btn btn-primary pull-right btn-sureChange">确认修改</button>&nbsp;&nbsp;
        </div>
    </div>
</div>
