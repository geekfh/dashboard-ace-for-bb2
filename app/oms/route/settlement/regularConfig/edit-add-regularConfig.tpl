<div class="add-edit-model">

    <div class="form-group">
        <label class="col-md-3 control-label">出款通道</label>
        <div class="col-md-8">
            <input class="form-control" type="text" name="name" >
        </div>
    </div>

    <div class="form-group">
        <label class="col-md-3 control-label">业务来源</label>
        <div class="col-md-8">
            <input class="form-control" type="text" name="sourceCode" value="<%=data.sourceCode %>">
        </div>
    </div>

    <div class="form-group">
        <label class="col-md-3 control-label">交易通道号</label>
        <div class="col-md-8">
            <input class="form-control" type="text" name="tradeChannelNo" value="<%=data.tradeChannelNo %>">
        </div>
    </div>

    <div class="form-group">
        <label class="col-md-3 control-label">是否走普通路由</label>
        <div class="col-md-8">
            <select class="form-control" name="isContinue">
                <option value="0" <%=data.isContinue == 0 ? 'selected' : '' %>>是</option>
                <option value="1" <%=data.isContinue == 1 ? 'selected' : '' %>>否</option>
            </select>
        </div>
    </div>

</div>