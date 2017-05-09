<div id="id-message-new-navbar" class="message-navbar align-center clearfix">
    <div class="message-item-bar">
        <div class="messagebar-item-left">
            <a href="#" class="btn-back btn-back-message-list no-hover-underline">
                <i class="icon-arrow-left blue bigger-110 middle"></i> <b class="middle bigger-110">返回</b>
            </a>
        </div>

        <div class="messagebar-item-right">
            <button type="button" class="btn-send-message btn-submit-notice btn btn-sm btn-primary no-border">
                <%=btnSubmitText%>
            </button>
        </div>
        <a class="clearfix"></a>
    </div>
</div>

<form id="new-notice-form" class="form-horizontal message-form  col-xs-12 notice-form">
    <div class="">

        <div class="select-brh-wrap" style="display:none;">
            <div  class="form-group ">
                <label class="col-sm-2 control-label no-padding-right" for="form-field-recipient">收件机构：</label>

                <div class="col-sm-9">
                    <span class="input-icon">

                            <label class="brh-radio-wrap"><input checked type="radio" class="brh-radio" name="targetBrh" value="All">所有</label>
                            <label class="brh-radio-wrap"><input type="radio" class="brh-radio" name="targetBrh" value="Custom">自定义</label>

                        <div>
                            <input placeholder="- 选择机构 -"  type="text" class="branchNo" name="branchNo">
                        </div>
                    </span>
                </div>
            </div>

            <div class="hr hr-10 dotted"></div>
        </div>

        <div class="form-group">
            <label class="col-sm-2 control-label no-padding-right" for="form-field-recipient">收件人：</label>

            <div class="col-sm-9">
                <span class="input-icon">
                    <select class="target-select" name="target" id="form-field-recipient">
                        <option value="" disabled="disabled" selected>- 收件人类型 -</option>
                        <option value="All">所有</option>
                        <option value="Agents">代理商</option>
                        <option value="Expand">拓展员</option>
                        <option value="Agents&Expand">代理商及拓展员</option>
                    </select>
                </span>
            </div>
        </div>

        <div class="hr hr-10 dotted"></div>

        <div class="form-group">
            <label class="col-sm-2 control-label no-padding-right" for="form-field-subject">主题：</label>

            <div class="col-sm-6 col-xs-12">
                    <input maxlength="60" type="text" class="col-xs-12" name="subject" id="form-field-subject" placeholder="请输入主题">
            </div>
        </div>

        <div class="hr hr-10 dotted"></div>

        <div class="form-group">
            <label class="col-sm-2 control-label no-padding-right">
                <span class="inline space-24 hidden-480"></span>
                正文：
            </label>

            <div class="col-sm-9 edit-group">
                <!-- 编辑器 -->
                <div class="editor-container"></div>
                <input type="text" name="hackContentInput" class="hack-input-for-editor-error">
            </div>
        </div>

        <div class="hr hr-10 dotted"></div>

        <div class="form-group no-margin-bottom">
            <label class="col-sm-2 control-label no-padding-right">附件：</label>

            <div class="col-sm-9">
                <div id="form-attachments">
                    <div class="file-input-container">
                        <div class="attachment-ct">
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="space"></div>
    </div>
</form>