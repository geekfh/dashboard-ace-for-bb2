<form>
    <div class="div_hd_error" style="border-color: #eed3d7;background-color: #f2dede;margin-top:-4px;padding: 10px 0 10px 0;display: none;">
        <center><a class="hd_error" style="color: #b94a48;"></a></center>
    </div>
    <div class="space-4"></div>
    <div style="padding: 20px;">
        <div class="form-group">
            <label class="col-sm-4 control-label no-padding-right">编号：</label>
            <input id="txt-id" type="text"  readonly />
        </div>
        <div class="form-group">
            <label class="col-sm-4 control-label no-padding-right">时间(时:分)：</label>
            <!--<input id="txt-time" type="text" />-->
            <input id="txt-time" type="time" />
        </div>
        <div class="form-group">
            <label class="col-sm-4 control-label no-padding-right">金额：</label>
            <input id="txt-amt" type="text" />
        </div>
        <div class="form-group">
            <label class="col-sm-4 control-label no-padding-right">描述：</label>
            <textarea id="txt-oprMsg2" style="width: 250px; height: 100px;"></textarea>
        </div>
    </div>

</form>