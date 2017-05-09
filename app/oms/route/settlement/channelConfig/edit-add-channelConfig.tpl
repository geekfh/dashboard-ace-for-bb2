<div class="add-edit-model">

    <div class="form-group">
        <label class="col-md-3 control-label">名称</label>
        <div class="col-md-8">
            <input class="form-control" type="text" name="name" value="<%=data.name %>">
        </div>
    </div>

    <div class="form-group">
        <label class="col-md-3 control-label">网银账号</label>
        <div class="col-md-8">
            <input class="form-control" type="text" name="account" value="<%=data.account %>">
        </div>
    </div>

    <div class="form-group">
        <label class="col-md-3 control-label">有效截止日期</label>
        <div class="col-md-8">
            <input class="form-control" type="text" name="validity" value="<%=data.validity %>" readonly>
        </div>
    </div>

    <div class="form-group">
        <label class="col-md-3 control-label">状态</label>
        <div class="col-md-8">
            <select class="form-control" name="status">
                <option value="0" <%=data.status == 0 ? 'selected' : '' %>>启用</option>
                <option value="1" <%=data.status == 1 ? 'selected' : '' %>>暂停</option>
                <option value="2" <%=data.status == 2 ? 'selected' : '' %>>失效</option>
            </select>
        </div>
    </div>

    <div class="form-group">
        <label class="col-md-3 control-label">通道类型</label>
        <div class="col-md-8">
            <input class="form-control" type="text" name="x1" value="本代本,本代他" readonly>
        </div>
    </div>

    <div class="form-group">
        <label class="col-md-3 control-label">默认全部银行支持</label>
        <div class="col-md-8">
            <select class="form-control" name="x2">
                <option value="0" >是</option>
            </select>
        </div>
    </div>

    <div class="form-group">
        <label class="col-md-3 control-label">生僻字默认选中</label>
        <div class="col-md-8">
            <select class="form-control" name="x3">
                <option value="0" >是</option>
            </select>
        </div>
    </div>

</div>