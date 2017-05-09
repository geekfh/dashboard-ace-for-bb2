<div title="批量导入">
  <div class="service-target-group">
  <form method="post" class="upload-form" action="" enctype="multipart/form-data" style="padding: 10px;">

    <div class="form-row">
      <div class="row-num">1</div>
      <label class="content-lab">将服务对象信息写入本系统提供的</label>
      <a href="#" class="content-href download-btn">Excel模板</a>
    </div>

    <div class="form-row">
      <div class="row-num">2</div>
      <label class="content-lab">选择相应服务：</label>
      <select name="service-id"></select>
    </div>

    <div class="form-row">
      <div class="row-num">3</div>
      <span class="uploadfile"><label class="content-upload-btn">上传写入服务对象信息的Excel文件</label></span>
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