<div class="add-edit-model">

    <!-- <div class="form-group">
        <label class="col-md-3 control-label">模型编号</label>
        <div class="col-md-8">
            <input class="form-control" type="text" name="modelName">
        </div>
    </div> -->

    <div class="form-group">
        <label class="col-md-3 control-label">模型名称</label>
        <div class="col-md-8">
            <input class="form-control" type="text" name="name" value="<%-data.name %>">
        </div>
    </div>

    <div class="form-group">
        <label class="col-md-3 control-label">启用状态</label>
        <div class="col-md-3">
            <select class="form-control" name="status">
                <option value="0" <%=data.status == 0 ? 'selected' : '' %>>启用</option>
                <option value="1" <%=data.status == 1 ? 'selected' : '' %>>不启用</option>
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
        <label class="col-md-3 control-label">通道名称</label>
        <div class="col-md-8">
            <!-- <input class="form-control" type="text" name="channelName" value="<%=data.channelName %>"> -->
            <select class="form-control" name="channelName">
                <option value="spdb" <%=data.channelName === 'spdb' ? 'selected' : '' %> >浦发</option>
                <option value="cilk" <%=data.channelName === 'cilk' ? 'selected' : '' %> >讯联</option>
                <option value="tftp" <%=data.channelName === 'tftp' ? 'selected' : '' %> >腾付通</option>
                <option value="hxbp" <%=data.channelName === 'hxbp' ? 'selected' : '' %> >翰鑫</option>
                <option value="umpy" <%=data.channelName === 'umpy' ? 'selected' : '' %> >联动势力</option>
                <option value="cofp" <%=data.channelName === 'cofp' ? 'selected' : '' %> >卡付通</option>
                <option value="bill" <%=data.channelName === 'bill' ? 'selected' : '' %> >快钱</option>
                <option value="cntp" <%=data.channelName === 'cntp' ? 'selected' : '' %> >银视通</option>
                <option value="ncbk" <%=data.channelName === 'ncbk' ? 'selected' : '' %> >宁波通商</option>
                <option value="sqpy" <%=data.channelName === 'sqpy' ? 'selected' : '' %> >社区001</option>
                <option value="scup" <%=data.channelName === 'scup' ? 'selected' : '' %> >深银商</option>
                <option value="cups" <%=data.channelName === 'cups' ? 'selected' : '' %> >银联</option>
                <option value="hkrt" <%=data.channelName === 'hkrt' ? 'selected' : '' %> >海科</option>
                <option value="alpy" <%=data.channelName === 'alpy' ? 'selected' : '' %> >支付宝</option>
                <option value="cmsp" <%=data.channelName === 'cmsp' ? 'selected' : '' %> >银商移动支付平台</option>
                <option value="hxnp" <%=data.channelName === 'hxnp' ? 'selected' : '' %> >翰鑫新平台</option>
            </select>
        </div>
    </div>

    <div class="form-group">
        <label class="col-md-3 control-label">通道中文名</label>
        <div class="col-md-8">
            <input class="form-control" type="text" name="channelCnName" value="<%=data.channelCnName %>">
        </div>
    </div>

    <div class="form-group">
        <label class="col-md-3 control-label">备注</label>
        <div class="col-md-8">
            <textarea name="remark" class="text-control"><%-data.remark %></textarea>
        </div>
    </div>

    
</div>