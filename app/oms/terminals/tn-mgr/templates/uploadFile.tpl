<div title="批量导入">
  <div class="terminals-group">
  <form method="post" class="upload-form" action="" enctype="multipart/form-data" style="padding: 10px;">

    <div class="form-row">
      <div class="row-num">1</div>
      <label class="content-lab">将终端设备号写入本系统提供的</label>
      <a href="#" class="content-href download-btn">Excel模板</a>
    </div>

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

    <div class="form-row">
      <div class="row-num">4</div>
      <label class="content-lab">选择终端挂属机构：</label>
      <span class="input-wrap">
          <input type="text" class="termUsed" name="termUsed">
      </span>
    </div>

    <div class="form-row">
      <div class="row-num">5</div>
      <span class="uploadfile"><label class="content-upload-btn">上传写入终端设备号的Excel文件</label></span>
    </div>

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