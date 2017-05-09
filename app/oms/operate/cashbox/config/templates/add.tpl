<div class="add-edit-model operate-cashbox-config">

    <div class="form-group">
        <label class="col-md-3 control-label">增值服务名称</label>
        <div class="col-md-8">
            <input class="form-control" type="text" name="serviceName" value="<%=data.serviceName %>">
        </div>
    </div>



    <div class="form-group">
        <label class="col-md-3 control-label">状态</label>
        <div class="col-md-3">
            <select class="form-control" name="serviceStatus">
                <option value="0" <%=data.serviceStatus == 0 ? 'selected' : '' %>>启用</option>
                <option value="1" <%=data.serviceStatus == 1 ? 'selected' : '' %>>不启用</option>
            </select>
        </div>
    </div>

    <div class="form-group">
        <label class="col-md-3 control-label">类别</label>
        <div class="col-md-3">
            <select class="form-control" name="serviceGroup">

            </select>
        </div>
    </div>

    <div class="form-group">
        <label class="col-md-3 control-label">排序</label>
        <div class="col-md-8">
            <input class="form-control" type="text" name="serviceSort" value="<%=data.serviceSort %>">
        </div>
    </div>

    <div class="form-group">
        <label class="col-md-3 control-label">类型</label>
        <div class="col-md-3">
            <select class="form-control" name="serviceType">

            </select>
        </div>
    </div>

    <div class="form-group">
        <label class="col-md-3 control-label">所属</label>
        <div class="col-md-3">
            <select class="form-control" name="serviceSrc">

            </select>
        </div>
    </div>

    <div class="form-group">
    <label class="col-md-3 control-label">服务图标（上架）</label>
    <div class="col-md-8">
        <textarea name="onlinePic" class="text-control"><%=data.onlinePic %></textarea>
    </div>
    </div>

    <div class="form-group">
        <label class="col-md-3 control-label">服务图标（下架）</label>
        <div class="col-md-8">
            <textarea name="offlinePic" class="text-control"><%=data.offlinePic %></textarea>
        </div>
    </div>


    <div class="form-group">
        <label class="col-md-3 control-label">所属一清通道</label>
        <div class="col-md-8">
            <select class="form-control" name="oneSettleChannel"></select>

        </div>
    </div>
    <div class="form-group">
        <label class="col-md-3 control-label">通道商户号</label>
        <div class="col-md-8">
            <input class="form-control" type="text"  name="channelMchtNo" value="<%=data.channelMchtNo %>"/>

        </div>
    </div>


    <div class="form-group">
        <label class="col-md-3 control-label">费率</label>
        <div class="col-md-8">
            <input class="form-control" type="text" name="rate" value="<%=data.rate %>">
        </div>
    </div>

    <div class="form-group">
        <label class="col-md-3 control-label">封顶手续费</label>
        <div class="col-md-8">
            <input class="form-control" type="text" name="maxFee" value="<%=data.maxFee %>">
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
    </div>

    <div class="form-group">
        <label class="col-md-3 control-label">单日最大金额</label>
        <div class="col-md-8">
            <input class="form-control" type="text" name="dayMaxAmt" value="<%=data.dayMaxAmt %>">
        </div>
    </div>


    <div class="form-group">
        <label class="col-md-3 control-label">备注</label>
        <div class="col-md-8">
            <textarea name="remark" class="text-control"><%=data.remark %></textarea>
        </div>
    </div>

    
</div>