<%
  var gridId = data.gridId;
%>


<div class="row" style="width: 100%; margin: 15px auto; display: inline-block;">
  <div class="col-xs-12 jgrid-container">
    <!-- PAGE CONTENT BEGINS -->

    <table id="<%=gridId || 'settle-controls-grid' %>-table"></table>

    <div id="<%=gridId || 'settle-controls-grid' %>-pager" ></div>

    <!-- PAGE CONTENT ENDS -->
  </div><!-- /.col -->
</div><!-- /.row -->
