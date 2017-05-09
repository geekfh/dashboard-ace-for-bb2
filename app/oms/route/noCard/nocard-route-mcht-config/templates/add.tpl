<div class="add-edit-model nocard-route-mcht-config">

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
        <label class="col-md-3 control-label">扫码模式</label>
        <div class="col-md-8">
            <select class="form-control" name="scanMode">
                <option value="1" <%=data.status == 1 ? 'selected' : '' %>>主扫</option>
                <option value="2" <%=data.status == 2 ? 'selected' : '' %>>被扫</option>
                <option value="3" <%=data.status == 3 ? 'selected' : '' %>>主扫和被扫</option>
                <option value="4" <%=data.status == 4 ? 'selected' : '' %>>二维码</option>
                <option value="5" <%=data.status == 5 ? 'selected' : '' %>>二维码和主扫</option>
                <option value="6" <%=data.status == 6 ? 'selected' : '' %>>二维码和被扫</option>
                <option value="7" <%=data.status == 7 ? 'selected' : '' %>>全支持</option>
            </select>
        </div>
    </div>

    <div class="form-group">
        <label class="col-md-3 control-label">是否支持信用卡</label>
        <div class="col-md-8">
             <select class="form-control" name="creditSupp">
                <option value="0" <%=data.status == 0 ? 'selected' : '' %>>不支持</option>
                <option value="1" <%=data.status == 1 ? 'selected' : '' %>>支持</option>
             </select>
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