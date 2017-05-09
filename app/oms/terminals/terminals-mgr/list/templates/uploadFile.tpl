<%
var ARR_TITLENAME = data;
console.log('POS管理批量导入参数：' + ARR_TITLENAME[0]);
%>

<div title="<%=ARR_TITLENAME[0] %>"><!--批量导入-->
  <div class="terminals-group">
    <form method="post" class="upload-form" action="" enctype="multipart/form-data" style="padding: 10px;">
    <% var excelLab = '将终端设备号写入本系统提供的';
      if(ARR_TITLENAME[0] == '租机替换'){
        excelLab = '将租机替换信息写入本系统提供的';
      }
    %>
      <div class="form-row">
        <div class="row-num">1</div>
        <label class="content-lab"><%=excelLab%></label>
        <a href="#" class="content-href download-btn">Excel模板</a>
      </div>


      <% if(ARR_TITLENAME[0] == '批量导入'){ %>

      <div class="form-row">
        <div class="row-num">2</div>
        <label class="content-lab">选择终端所属厂商：</label>
        <select name="termFactory"></select>
      </div>

      <div class="form-row">
        <div class="row-num">3</div>
        <label class="content-lab">选择终端型号：</label>
        <select name="termMachType"></select>
      </div>

      <% } %>

      <%
        var str = 'display: block;';
        if(ARR_TITLENAME[0] == '导入解绑' || ARR_TITLENAME[0] == '批量回收返修' || ARR_TITLENAME[0] == 'SN批量查询' || ARR_TITLENAME[0] == '租机替换'){
            str = 'display: none;';
        }
        else{
            str = 'display: block;';
        }

      %>
      <div class="form-row" style="<%=str %>">
        <div class="row-num">
          <%if(ARR_TITLENAME[0] != '导入调整'){%>
          <font>4</font>
          <%}else {%>
          <font>2</font>
          <% } %>
        </div>
        <label class="content-lab">选择终端挂属机构：</label>
      <span class="input-wrap">
          <input type="text" class="termUsed" name="termUsed">
      </span>
      </div>

      <div class="form-row opr-select-row" style="display: none;padding-left: 46px">
        <label class="content-lab">直销网络拓展员选择：</label>
      <span class="input-wrap">
          <input type="text" class="oprSelectDir" name="oprSelectDir">
      </span>
      </div>

      <% if(ARR_TITLENAME[0] == '批量导入'){ %>
      <div class="form-row" >
        <div class="row-num">5</div>
        <label class="content-lab">终端用途：</label>
        <select name="termApp"></select>
      </div>

      <% } %>


      <div class="form-row">
        <div class="row-num">
          <%if(ARR_TITLENAME[0] == '批量导入'){%>
              <font>6</font>
          <%}else if(ARR_TITLENAME[0] == '导入调整'){%>
              <font>3</font>
          <% } else {%>
            <font>2</font>
          <% } %>
        </div>
        <span class="uploadfile"><label class="content-upload-btn">上传写入终端设备号的Excel文件</label></span>
      </div>

      <% if(ARR_TITLENAME[0] == '批量回收返修'){ %>
      <br>
      <div class="form-row">
        <div class="row-num">3</div>
        <!--<label class="content-lab">回收原因(必填)：</label>-->
        <span class="input-wrap">
          <textarea name="desc" class="desc" placeholder="请填写回收原因(必填),字数不能超过42" style="width: 264px; height: 144px;max-width: 264px; max-height: 144px;"></textarea>
        </span>
      </div>

      <% } %>

      <div class="form-row">
        <div class="row-num" style="visibility: hidden;">6</div>
        <label for="uploadfile"></label>
      <span class="uploadFileIndicator">
        <span class="icon-wrap"> <i class="icon-spinner icon-spin"></i>
          <span class="progress-percent" ></span>
          正在上传
        </span>
      </span>
      </div>
    </form>
  </div>
</div>