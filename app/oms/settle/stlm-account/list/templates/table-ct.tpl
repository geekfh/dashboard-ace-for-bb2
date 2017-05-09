

<div class="row">
	<div class="col-xs-12 jgrid-container">
		<!-- PAGE CONTENT BEGINS -->

		<table id="stlm-accounts-grid-table"></table>

		<div id="stlm-accounts-grid-pager" ></div>


		<!-- PAGE CONTENT ENDS -->
	</div><!-- /.col -->
</div><!-- /.row -->



<script type="text/template" id="add-password-dialog-template">
    <div title="转账密码">
      <form>
          <fieldset class="container">
            <div class="row settle-styles-row">
                <div class="col-xs-3">选择账号:</div>
                <div class="col-xs-9">
                    <select id="acctMmCodeId" name="id" style="width: 76%"><option></option></select>
                </div>
            </div>

            <div class="row settle-styles-row">
                <div class="col-xs-3">转账密码:</div>
                <div class="col-xs-9"><input type="text" style="width: 76%" name="acctMmCode" /></div>
            </div>
            <br>
            <div class="row settle-styles-row">
                <div class="col-xs-3"></div>
                <div class="col-xs-9" id="call-back-info"></div>
            </div>
          </fieldset>
      </form>
    </div>
</script>