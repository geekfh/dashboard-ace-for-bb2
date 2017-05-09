<div class="add-edit-model">

    <div class="form-group">
        <label class="col-md-3 control-label">通道编码</label>
        <div class="col-md-8">
            <input class="form-control" type="text" name="channel_nm" value="<%=data.channel_nm %>">
        </div>
    </div>

    <div class="form-group">
        <label class="col-md-3 control-label">通道名称</label>
        <div class="col-md-8">
            <input class="form-control" type="text" name="name" value="<%=data.name %>">
        </div>
    </div>

    <div class="form-group">
        <label class="col-md-3 control-label">启动状态</label>
        <div class="col-md-8">
            <select class="form-control" name="status">
                <option value="0" <%=data.status == 0 ? 'selected' : '' %>>启动</option>
                <option value="1" <%=data.status == 1 ? 'selected' : '' %>>禁用</option>
            </select>
        </div>
    </div>

    <div class="form-group">
        <label class="col-md-3 control-label">备注</label>
        <div class="col-md-8">
            <input class="form-control" type="text" name="remark" value="<%=data.remark %>">
        </div>
    </div>

</div>