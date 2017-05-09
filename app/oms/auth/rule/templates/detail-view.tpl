<div class="modal" >
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal">
          <span aria-hidden="true">&times;</span>
          <span class="sr-only">Close</span>
        </button>
        <h4 class="modal-title">管辖规则详情</h4>
      </div>
      <div class="modal-body">
      <table>
        <tbody>
          <tr>
            <td class="col-label">名称:</td>
            <td class="col-text"><%-name%></td>
          </tr>
          <tr>
            <td class="col-label">范围:</td>
            <td class="col-text"><%=formatType(type)%></td>
          </tr>
          <tr>
            <td class="col-label">机构:</td>
            <td class="col-text"><%-branchName%></td>
          </tr>
          <tr>
            <td class="col-label">描述:</td>
            <td class="col-text"><%-descr%></td>
          </tr>
        </tbody>
      </table>
      <div class="rule-elem-panel clearfix">
        <div class="org-list">
        <div class="label">机构列表</div>
        </div>
        <div class="operator-list">
          <div class="label">拓展员列表</div>
        </div>
      </div>
      </div>
    </div>
    <!-- /.modal-content --> </div>
  <!-- /.modal-dialog -->
</div>
<!-- /.modal -->