<div title="<%=data%>"><!--批量导入-->
    <div class="terminals-group">
        <form method="post" class="upload-form" action="" enctype="multipart/form-data" style="padding: 10px;">
            <div class="form-row">
                <div class="row-num">1</div>
                <input id="bankId" name="bankId" type="hidden"/>
                <div id="bankName" class="div_bankName"></div>
            </div>
            <div class="form-row">
                <div class="row-num">2</div>
                <label class="content-lab">将银行编号写入本系统提供的</label>
                <a href="#" class="content-href download-btn">Excel模板</a>
            </div>
            <div class="form-row">
                <div class="row-num">3</div>
                <span class="uploadfile"><label class="content-upload-btn">上传写入银行编号的Excel文件</label></span>
            </div>
            <br>
            <div class="form-row">
                <div class="row-num" style="visibility: hidden;">6</div>
                <label for="uploadfile"></label>
            <span class="uploadFileIndicator">
            <span class="icon-wrap"> <i class="icon-spinner icon-spin"></i>
              <span class="progress-percent" ></span>
              正在上传...
            </span>
            </span>
            </div>
        </form>
    </div>
</div>