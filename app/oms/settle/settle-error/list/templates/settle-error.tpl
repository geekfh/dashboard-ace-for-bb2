<div id="dialog-form" title="处理">
    <form class="form-settle-error">
        <fieldset class="container">
            <div class="row settle-styles-row">
                <div class="col-xs-3">处理结果:</div>
                <div class="col-xs-9">
                    <select name="doFlag">
                        <!--<option value="1">处理后参入下一批清算</option>-->
                        <option value="2">处理后手工清算</option>
                        <option value="4">待自动清算</option>
                    </select>
                </div>
            </div>
            <div class="row settle-styles-row">
                <div class="col-xs-3">处理描述:</div>
                <div class="col-xs-9">
                    <textarea style="width: 76%; height: 60px;" name="nextDo"/>
                </div>
            </div>
        </fieldset>
    </form>
</div>