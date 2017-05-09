<div id='add-dialog-div' title="新增入账出错交易">
    <form id="settle-error-add-form">
        <div class="row settle-styles-row">
            <div class="col-xs-12">
                <select class="opsel">
                    <option value="AND" selected="selected">所有</option>
                    <option value="OR">任一</option>
                </select>
                <input type="button" value="+" title="添加查询" class="add-rule ui-add">
            </div>
        </div>
        <div id="add-extra-msg"></div>
        <div class="row settle-styles-row" id="addResource">
            <div class="col-xs-3">请标记选择：</div>
            <div class="col-xs-9">
                <input type="radio" value="1" name="addResource"> 清算失败&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <input type="radio" value="5" name="addResource"> 退票
                <div>
                    <span style="display: none; color:red; font-size: small" class="notice">请选择标记退票或清算失败</span>
                </div>
            </div>
        </div>
        <div class="row settle-styles-row" id="retMsg">
            <div class="col-xs-3"> 差错描述：</div>
            <div class="col-xs-9">
                <textarea style="width:76%; height: 60px;"></textarea>
            </div>
        </div>
    </form>
</div>