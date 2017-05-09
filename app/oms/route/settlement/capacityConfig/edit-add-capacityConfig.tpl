<div class="add-edit-model">

    <div class="form-group">
        <label class="col-md-3 control-label">名称</label>
        <div class="col-md-8">
            <input class="form-control" type="text" name="name" >
        </div>
    </div>

    <div class="form-group">
        <label class="col-md-3 control-label">优先级</label>
        <div class="col-md-8">
            <input class="form-control" type="text" name="priority" value="<%=data.priority %>">
        </div>
    </div>

    <div class="form-group">
        <label class="col-md-3 control-label">单笔代付成本(元)</label>
        <div class="col-md-8">
            <input class="form-control" type="text" name="singleCost" value="<%=data.singleCost %>">
        </div>
    </div>

    <div class="form-group">
        <label class="col-md-3 control-label">是否有交易区间</label>
        <div class="col-md-8">
            <select class="form-control" name="tradeRange">
                <option value="0" <%=data.tradeRange == 0 ? 'selected' : '' %>>是</option>
                <option value="1" <%=data.tradeRange == 1 ? 'selected' : '' %>>否</option>
            </select>
        </div>
    </div>

    <div class="form-group">
        <label class="col-md-3 control-label">垫资成本(%)</label>
        <div class="col-md-8">
            <input class="form-control" type="text" name="loaningCost" value="<%=data.loaningCost %>">
        </div>
    </div>

</div>