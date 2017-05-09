<div class="add-edit-model">

    <input class="form-control" name="status" type="hidden" value="<%=data.status %>" />

    <div class="form-group">
        <label class="col-md-3 control-label">通道编码</label>
        <div class="col-md-8">
            <input class="form-control" type="text" name="channelNo" value="<%=data.channelNo %>">
        </div>
    </div>

    <div class="form-group">
        <label class="col-md-3 control-label">通道名称</label>
        <div class="col-md-8">
            <input class="form-control" type="text" name="channelNm" value="<%=data.channelNm %>">
        </div>
    </div>

    <div class="form-group">
        <label class="col-md-3 control-label">同步模式</label>
        <div class="col-md-8">
            <select class="form-control" name="synchModel">
                <option value="1" <%=data.synchModel == 1 ? 'selected' : '' %>>手动</option>
                <option value="2" <%=data.synchModel == 2 ? 'selected' : '' %>>自动</option>
            </select>
        </div>
    </div>

    <div class="form-group">
        <label class="col-md-3 control-label">启用状态</label>
        <div class="col-md-8">
            <select class="form-control" name="startStatus">
                <option value="1" <%=data.startStatus == 1 ? 'selected' : '' %>>启用</option>
                <option value="2" <%=data.startStatus == 2 ? 'selected' : '' %>>未启用</option>
            </select>
        </div>
    </div>

    <div class="form-group">
        <label class="col-md-3 control-label">修改同步</label>
        <div class="col-md-8">
            <select class="form-control" name="isUpdateSynch">
                <option value="1" <%=data.isUpdateSynch == 1 ? 'selected' : '' %>>支持</option>
                <option value="2" <%=data.isUpdateSynch == 2 ? 'selected' : '' %>>不支持</option>
            </select>
        </div>
    </div>

    <div class="form-group">
        <label class="col-md-3 control-label">经营类目</label>
        <div class="col-md-8">
            <select class="form-control" name="isMatchingBusiness">
                <option value="1" <%=data.isMatchingBusiness == 1 ? 'selected' : '' %>>匹配</option>
                <option value="2" <%=data.isMatchingBusiness == 2 ? 'selected' : '' %>>不匹配</option>
            </select>
        </div>
    </div>

    <div class="form-group">
        <label class="col-md-3 control-label">是否匹配开户行</label>
        <div class="col-md-8">
            <select class="form-control" name="isZbankCode">
                <option value="1" <%=data.isZbankCode == 1 ? 'selected' : '' %>>匹配</option>
                <option value="2" <%=data.isZbankCode == 2 ? 'selected' : '' %>>不匹配</option>
            </select>
        </div>
    </div>

    <div class="form-group">
        <label class="col-md-3 control-label">同步业务</label>
        <div class="col-md-8">
            <select class="form-control" name="paymentMethod">
                <option value="all" <%=data.paymentMethod == 'all' ? 'selected' : '' %>>所有</option>
                <option value="wechat" <%=data.paymentMethod == 'wechat' ? 'selected' : '' %>>微信</option>
                <option value="alipay" <%=data.paymentMethod == 'alipay' ? 'selected' : '' %>>支付宝</option>
            </select>
        </div>
    </div>

    <div class="form-group">
        <label class="col-md-3 control-label">结算银行</label>
        <div class="col-md-8">
            <select class="col-sm-8" name="settleBank">
                <option value="1" <%=data.settleBank == 1 ? 'selected' : '' %>>全部</option>
                <option value="2" <%=data.settleBank == 2 ? 'selected' : '' %>>部分</option>
            </select>
            <div class="col-sm-2">
                <button type="button" class="btn btn-primary btn-sm btn_bankDetail" style="height: 30px;line-height: 0;" disabled="disabled">银行详情</button>
            </div>
        </div>
    </div>

    <div class="form-group">
        <label class="col-md-3 control-label">开始时间</label>
        <div class="col-md-8">
            <input class="form-control" type="text" name="channelMaintainTimeStart" value="<%=data.channelMaintainTimeStart %>">
        </div>
    </div>

    <div class="form-group">
        <label class="col-md-3 control-label">结束时间</label>
        <div class="col-md-8">
            <input class="form-control" type="text" name="channelMaintainTimeEnd" value="<%=data.channelMaintainTimeEnd %>">
        </div>
    </div>

    <div class="form-group">
        <label class="col-md-3 control-label">备注</label>
        <div class="col-md-8">
            <input class="form-control" type="text" name="remark" value="<%=data.remark %>">
        </div>
    </div>

</div>