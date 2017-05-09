<%
var gid = data.gridId;
%>
<style>
	#fbox_settle-txns-grid-table .ui-widget-content{
		width: auto!important;
	}
	#fbox_settle-t0-txns-grid-table .ui-widget-content{
		width: auto!important;
	}
	#fbox_settle-t0-faster-grid-table .ui-widget-content{
		width: auto!important;
	}
	#fbox_settle-tc-txns-grid-table .ui-widget-content{
		width: auto!important;
	}
</style>
<div class="row">
	<div class="col-xs-12 jgrid-container">
		<!-- PAGE CONTENT BEGINS -->

		<table id="<%= gid || 'settle-txns-grid'%>-table"></table>

		<div id="<%= gid || 'settle-txns-grid'%>-pager" ></div>


		<!-- PAGE CONTENT ENDS -->
	</div><!-- /.col -->
</div><!-- /.row -->

