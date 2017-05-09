<div class="form-sit model-panel">
    <%if(type=='PUT'){%>
    <form class="form clearfix form-horizontal" style="overflow: hidden">
        <div class="form-group">
            <label class="col-sm-4 control-label">产品编码</label>
            <div class="col-sm-6">
                <input class="form-control" value="<%=appType%>" id="appType" name="appType">
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-4 control-label">产品名称</label>
            <div class="col-sm-6">
                <input class="form-control" value="<%=name%>" id="name" name="name">
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-4 control-label">启用状态</label>
            <div class="col-sm-6">
                <select id="status" name="status">
                    <option value="0" <%=status == '0' ? 'selected' : ''%>>启用</option>
                    <option value="1" <%=status == '1' ? 'selected' : ''%>>禁用</option>
                </select>
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-4 control-label">支持交易类型</label>
            <div class="col-sm-6">
                <select id="cmdType" name="cmdType">
                    <option value="51" <%=cmdType == '51' ? 'selected' : ''%>>代扣</option>
                    <option value="52" <%=cmdType == '52' ? 'selected' : ''%>>银行卡验证</option>
                    <option value="53" <%=cmdType == '53' ? 'selected' : ''%>>身份证验证</option>
                </select>
            </div>
        </div>
    </form>
    <%}else if(type=='POST'){%>
    <form class="form clearfix form-horizontal" style="overflow: hidden">
        <div class="form-group">
            <label class="col-sm-4 control-label">产品编码</label>
            <div class="col-sm-6">
                <input class="form-control" name="appType">
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-4 control-label">产品名称</label>
            <div class="col-sm-6">
                <input class="form-control" name="name">
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-4 control-label">启用状态</label>
            <div class="col-sm-6">
                <select name="status">
                    <option value="0">启用</option>
                    <option value="1">禁用</option>
                </select>
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-4 control-label">支持交易类型</label>
            <div class="col-sm-6">
                <select name="cmdType">
                    <option value="51">代扣</option>
                    <option value="52">银行卡验证</option>
                    <option value="53">身份证验证</option>
                </select>
            </div>
        </div>
    </form>
    <%}else{%>
    <form class="form clearfix form-horizontal" style="overflow: hidden">
        <div class="form-group">
            <label class="col-sm-4 control-label">产品编码</label>
            <div class="col-sm-6">
                <input class="form-control" value="<%=appType%>" name="appType" readonly="readonly">
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-4 control-label">产品名称</label>
            <div class="col-sm-6">
                <input class="form-control" value="<%=name%>" name="name"  readonly="readonly">
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-4 control-label">启用状态</label>
            <div class="col-sm-6">
                <select name="status" disabled="disabled">
                    <option value="0" <%=status == '0' ? 'selected' : ''%>>启用</option>
                    <option value="1" <%=status == '1' ? 'selected' : ''%>>禁用</option>
                </select>
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-4 control-label">支持交易类型</label>
            <div class="col-sm-6">
                <select name="cmdType" disabled="disabled">
                    <option value="51" <%=cmdType == '51' ? 'selected' : ''%>>代扣</option>
                    <option value="52" <%=cmdType == '52' ? 'selected' : ''%>>银行卡验证</option>
                    <option value="53" <%=cmdType == '53' ? 'selected' : ''%>>身份证验证</option>
                </select>
            </div>
        </div>
    </form>
    <%}%>

    <div class="separator"></div>
    <div class="condition-panel-sit">
        <div class="condition-panel">
            <div class="fieldset-groups-sit">
                <div class="fieldset-group">
                    <div class="group-head" <%=type=='GET'? 'hidden="hidden"': ''%>>
                        <span class="caption">添加通道</span>
                        <a class="btn-remove-fieldset" href="javascript: void 0">移除所有</a>
                        <div class="field-types-dd">
                            <i class="icon-plus-sign"></i>
                        </div>
                    </div>
                    <div class="separator"></div>
                    <div class="group-body">

                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="separator"></div>
    <div class="relevance-model-sit"></div>
</div>
