<div id="changeStatusView">
    <div style="padding: 10px 0 0 30px;">
        黑名单状态:&nbsp;&nbsp;&nbsp;&nbsp;
        <select role="select" name="status" class="FormElement ui-widget-content ui-corner-all" style="width: 80px;">
            <option value="0">停用</option>
            <option value="1">启用</option>
        </select>
    </div>
    <div style="padding: 10px 0 0 30px;">
        原因:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <textarea name="remark" style="max-width: 400px; max-height: 130px; width: 230px; height: 134px; margin: 0px;">
         </textarea>
        <div style="color: grey; padding: 10px; font-weight: bold; text-align: center;">
            <label>提示：备注长度不超过20中文字</label>
        </div>
    </div>
    <div class="checkbox" style="padding: 10px 0 0 50px;width: 300px;">
        <label style="font-size:10px;">
            <input id="otherStatusElse" type="checkbox" value="0"> 同时修改该商户其他黑名单状态
        </label>
    </div>
</div>

