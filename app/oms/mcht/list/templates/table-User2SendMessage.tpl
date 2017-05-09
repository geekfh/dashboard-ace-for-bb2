<form>
    <input id="mesId"  type="hidden" />
        <div class="div_hd_error" style="border-color: #eed3d7;background-color: #f2dede;margin-top:-4px;padding: 10px 0 10px 0;display: none;">
        <center><a class="hd_error" style="color: #b94a48;"></a></center>
        </div>
    <div style="padding: 20px;">
        <div class="form-group">
            <input name="rd-mobile" value="default" type="radio" checked="checked" />
            <label style="width: 100px;">默认联系方式</label>
            <input id="txt-default-mobile" type="text" value="" class="control-label" readonly />
        </div>
        <div class="form-group">
            <input name="rd-mobile" value="defined" type="radio" />
            <label style="width: 100px;">自定义手机号</label>
            <input id="txt-defined-mobile" type="text" class="control-label" />
        </div>
        <div class="form-group">
            <label style="width: 117px;">模板标题</label>
            <!--<select style="width: 180px;"><option value="123">--请选择模板标题--</option></select>-->
            <div id="txt-name" style="width: 180px;"></div>
        </div>
        <div class="form-group">
            <label style="width: 117px;">模板内容</label>
            <textarea id="txt-descr" style="width: 300px; height: 150px;" disabled="disabled" readonly ></textarea>
        </div>
        <div class="form-group">
            <input id="ck-flag" type="checkbox" />
            <label>短信未发送成功 自动再发送一次</label>
        </div>
    </div>
</form>