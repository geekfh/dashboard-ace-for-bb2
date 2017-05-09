<div class="add-edit-model mcht-channel-model">

    <!-- <div class="form-group">
        <label class="col-md-3 control-label">模型编号</label>
        <div class="col-md-8">
            <input class="form-control" type="text" name="modelName">
        </div>
    </div> -->
    <div class="form-group">
        <label class="col-md-3 control-label">商户名称</label>
        <div class="col-md-8">
            <input class="form-control" type="text" name="mchtName" value="<%=data.mchtName %>">
        </div>
    </div>

    <div class="form-group">
        <label class="col-md-3 control-label">商户编号</label>
        <div class="col-md-8">
            <input class="form-control" type="text" name="mchtNo" value="<%=data.mchtNo %>">
        </div>
    </div>

<!--     <div class="form-group">
        <label class="col-md-3 control-label">模型名称</label>
        <div class="col-md-8">
            <input class="form-control" type="text" name="name" value="<%=data.name %>">
        </div>
    </div> -->

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
        <label class="col-md-3 control-label">所属通道</label>
        <div class="col-md-8">
            <select class="form-control" name="channelName"></select>

        </div>
    </div>

    <div class="form-group">
        <label class="col-md-3 control-label">费率</label>
        <div class="col-md-8">
            <input class="form-control" type="text" name="rate" value="<%=data.rate %>">
        </div>
    </div>

    <div class="form-group">
        <label class="col-md-3 control-label">直连商户号</label>
        <div class="col-md-8">
            <input class="form-control" type="text" name="directMchtNo" value="<%=data.directMchtNo %>">
        </div>
    </div>

    <div class="form-group">
        <label class="col-md-3 control-label">真实通道名称</label>
        <div class="col-md-8">
            <input class="form-control" type="text" name="chaZsnm" value="<%=data.chaZsnm %>">
        </div>
    </div>

    <div class="form-group">
        <label class="col-md-3 control-label">封顶手续费</label>
        <div class="col-md-8">
            <input class="form-control" type="text" name="maxFee" value="<%=data.maxFee %>">
        </div>
    </div>

    <div class="form-group">
        <label class="col-md-3 control-label">最低手续费</label>
        <div class="col-md-8">
            <input class="form-control" type="text" name="minFee" value="<%=data.minFee %>">
        </div>
    </div>

    <div class="form-group">
        <label class="col-md-3 control-label">商户MCC组</label>
        <div class="col-md-8">
            <select class="form-control next-relative" name="mccGroup"> </select>
        </div>
    </div>

    <div class="form-group">
        <label class="col-md-3 control-label">商户MCC</label>
        <div class="col-md-8">
            <select class="form-control next-relative" name="mcc"><option></option></select>
        </div>
    </div>

    <div class="form-group">
        <label class="col-md-3 control-label">地区代码</label>

        <div class="col-md-2 region-code">
            <select class="form-control next-relative" name="province">
                <option class="placeholder" disabled="disabled">-选择省-</option>
            </select>
        </div>

        <div class="col-md-2 region-code">
            <select class="form-control next-relative" name="city">
                <option class="placeholder" disabled="disabled">-选择市-</option>
            </select>
        </div>

        <div class="col-md-2 region-code">
            <select class="form-control next-relative" name="regionCode">
                <option class="placeholder" disabled="disabled">-选择区-</option>
            </select>
        </div>

        <!-- <div class="col-md-8">
            <select name="province">
                <option class="placeholder">-选择省-</option>
            </select>

            <select name="city">
                <option class="placeholder">-选择市-</option>
            </select>

            <select name="regionCode">
                <option class="placeholder">-选择区-</option>
            </select>
            <input class="form-control" type="text" name="regionCode" value=" value="<%=data.regionCode %>"">
        </div> -->
    </div>

    <div class="form-group">
        <label class="col-md-3 control-label">单日最大金额</label>
        <div class="col-md-8">
            <input class="form-control" type="text" name="maxTotalAmt" value="<%=data.maxTotalAmt %>">
        </div>
    </div>


    <div class="form-group">
        <label class="col-md-3 control-label">备注</label>
        <div class="col-md-8">
            <textarea name="remark" class="text-control"><%=data.remark %></textarea>
        </div>
    </div>

    
</div>