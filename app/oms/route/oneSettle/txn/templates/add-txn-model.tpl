<!-- <div class="form-group">
    <label class="col-md-3 control-label">模型编号</label>
    <div class="col-md-8">
        <input class="form-control" type="text" name="modelName">
    </div>
</div> -->

<div class="form-group">
    <label class="col-md-3 control-label">模型名称</label>
    <div class="col-md-8">
        <input class="form-control" type="text" name="name" value="<%=data.name %>">
    </div>
</div>

<div class="form-group">
    <label class="col-md-3 control-label">启用状态</label>
    <div class="col-md-3">
        <select class="form-control" name="status">
            <option value="0" <%=data.status == 0 ? 'selected': '' %>>启用</option>
            <option value="1" <%=data.status == 1 ? 'selected': '' %>>不启用</option>
        </select>
    </div>
</div>

<div class="form-group">
    <label class="col-md-3 control-label">优先级</label>
    <div class="col-md-4">
        <input class="form-control" type="text" name="priority" value="<%=data.priority %>">
    </div>
    <label class="col-md-4 control-label align-left priority-label">数字越大级别越高</label>
</div>

<div class="form-group">
    <label class="col-md-3 control-label">备注</label>
    <div class="col-md-8">
        <textarea name="remark" class="text-control"><%=data.remark %></textarea>
    </div>
</div>