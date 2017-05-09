<div title="审核">
  <form class="form-stlm-error">
  <fieldset class="container">
    <div class="row settle-styles-row">
      <div class="col-xs-3">处理结果:</div>
      <div class="col-xs-9">
        <select name="resultFlag">
          <!--<option value="4">手工处理挂账</option>-->
          <option value="3">手工处理请款</option>
          <option value="2">手工处理退货</option>
          <option value="1">处理后参加清算</option>
          <option value="8" style="display: none;">交易取消</option>
          <option value="7" style="display: none;">转退单</option>
        </select>
      </div>
    </div>
    <div class="row settle-styles-row">
      <div class="col-xs-3">处理描述:</div>
      <div class="col-xs-9">
        <textarea name="nextDo" />
      </div>
    </div>
  </fieldset>
</form>
</div>