<div class="add-edit-model">

    <!-- <div class="form-group">
        <label class="col-md-3 control-label">模型编号</label>
        <div class="col-md-8">
            <input class="form-control" type="text" name="modelName">
        </div>
    </div> -->

    <div class="form-group">
        <label class="col-md-3 control-label">通道序号</label>
        <div class="col-md-8">
            <input class="form-control" type="text" name="id" value="<%-data.id %>">
        </div>
    </div>


    <div class="form-group">
        <label class="col-md-3 control-label">通道名称</label>
        <div class="col-md-8">
             <input class="form-control" type="text" name="channelName" value="<%=data.channelName %>">
        </div>
    </div>

    <div class="form-group">
        <label class="col-md-3 control-label">通道中文名</label>
        <div class="col-md-8">
            <input class="form-control" type="text" name="channelCnName" value="<%=data.channelCnName %>">
        </div>
    </div>
    <div class="form-group">
        <label class="col-md-3 control-label">通道状态</label>
        <div class="col-md-3">
            <select class="form-control" name="status">
                <option value="0" <%=data.status == 0 ? 'selected' : '' %>>启用</option>
                <option value="1" <%=data.status == 1 ? 'selected' : '' %>>不启用</option>
            </select>
        </div>
    </div>
    <div class="form-group">
        <label class="col-md-3 control-label">通道银商系标记</label>
        <div class="col-md-4">
            <select class="form-control" name="bankMark">
                <option value="0" <%=data.bankMark == 0 ? 'selected' : '' %>>不是银商系</option>
                <option value="1" <%=data.bankMark == 1 ? 'selected' : '' %>>是银商系</option>
            </select>
        </div>
    </div>
    <div class="form-group">
        <label class="col-md-3 control-label">是否虚拟通道</label>
        <div class="col-md-4">
            <select class="form-control" name="xntdFlag">
                <option value="0" <%=data.xntdFlag == 0 ? 'selected' : '' %>>否</option>
                <option value="1" <%=data.xntdFlag == 1 ? 'selected' : '' %>>是</option>
            </select>
        </div>
    </div>

    <div class="form-group" name="div-chaZsnm" style="display: none;">
        <label class="col-md-3 control-label">真实通道名称</label>
        <div class="col-md-8">
            <input class="form-control" type="text" name="chaZsnm" value="<%=data.chaZsnm %>" />
        </div>
        <br>
    </div>

    <div class="form-group">
        <label class="col-md-3 control-label">通道代码</label>
        <div class="col-md-8">
            <input class="form-control" type="text" name="code" value="<%=data.code %>" />
        </div>
        <br>
    </div>

    <div class="form-group">
        <label class="col-md-3 control-label">备注</label>
        <div class="col-md-8">
            <textarea name="remark" class="text-control"><%-data.remark %></textarea>
        </div>
    </div>

</div>