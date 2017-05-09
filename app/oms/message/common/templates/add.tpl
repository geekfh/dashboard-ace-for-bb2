<style type="text/css">
    #msg_push_confirm .add-push-form .CaptionTD { width:20%; }
    #msg_push_confirm .add-push-form .container.section-pushDetail .row { padding: 12px 0 5px; margin: 0; }
    #msg_push_confirm .add-push-form .container.section-uploadPreviewImage .uploadPreviewImageHelps .prompt-wrap { font-size:13px; color: #0E5F9A; }
    #msg_push_confirm .add-push-form .mcht-form-group.mcht-add-pic .btn-panel { left:2px; top:0; width:186px; margin: 0; border-radius: 0; }
    #msg_push_confirm .add-push-form .mcht-form-group.mcht-add-pic .upload-trigger { width:200px; height:150px; }
    #msg_push_confirm .add-push-form .mcht-form-group.mcht-add-pic .icon-trigger { font-size: 120px !important; }
    #msg_push_confirm .add-push-form .mcht-form-group.mcht-add-pic .add-tips { font-size: 16px !important; bottom:5px; }
    #msg_push_confirm .add-push-form .mcht-form-group.mcht-add-pic .has-error .add-tips { color:#d16e6c; }
</style>
<div id="msg_push_terminalType">
    <ul class="msg-push-terminal-type">
        <li>
            <button type="button" class="btn btn-default" data-msg-type="1">
                <span class="icon icon-msg-cashbox"></span>
                <span>钱盒APP</span>
            </button>
        </li>
        <li>
            <button type="button" class="btn btn-default" data-msg-type="2">
                <span class="icon icon-msg-iboxpay"></span>
                <span>个人端APP</span>
            </button>
        </li>
        <li>
            <button type="button" class="btn btn-default" data-msg-type="3">
                <span class="icon icon-msg-kaitongbao"></span>
                <span>开通宝APP</span>
            </button>
        </li>
        <li>
            <button type="button" class="btn btn-default" data-msg-type="5">
                <span class="icon icon-msg-s300"></span>
                <span>S300终端</span>
            </button>
        </li>
        <li>
            <button type="button" class="btn btn-default" data-msg-type="6">
                <span class="icon icon-msg-kaitongbao"></span>
                <span>盒伙人APP</span>
            </button>
        </li>
    </ul>
    <p id="msg_push_tips" class="text-muted" style="margin-left: 20px;">
        <i class="icon icon-info-sign" style="color: #337ab7;"></i>
        请选择一个推送终端
    </p>
</div>

<div id="msg_push_confirm" hidden>
    <form onsubmit="return false;" class="FormGrid add-push-form">
        <table border="0" class="EditTable">
            <tbody>
                <tr style="display:none" class="tinfo"></tr>
                <tr class="FormData" Belong="A1,A2">
                    <td class="CaptionTD wizard-panel" colspan="2" style="text-align:left; font-size: 16px; font-weight: bold; color: #1b6aaa;">
                        <i id="msg_push_back" class="icon-circle-arrow-left back-list" style="margin: 0 0 0 10px;"></i>&nbsp;返回
                    </td>
                </tr>
                <tr class="FormData" id="tr_terminalType" Belong="A1,A2">
                    <td class="CaptionTD">推送终端</td>
                    <td class="DataTD">
                        <div id="msg_push_terminalTypeContainer"></div>
                    </td>
                </tr>
                <tr class="FormData" id="tr_pushObject" Belong="A1,A2">
                    <td class="CaptionTD">推送对象</td>
                    <td class="DataTD">&nbsp;
                        <!--<select class="FormElement ui-widget-content ui-corner-all" id="pushObject" name="pushObject">
                            <option value="-1">- 请选择 -</option>
                            <option value="11">所有钱盒用户</option>
                            <option value="12">部分钱盒用户</option>
                            <option value="21">所有个人端用户</option>
                            <option value="22">部分个人端用户</option>
                            <option value="31">所有开通宝用户</option>
                            <option value="32">部分开通宝用户</option>
                        </select>-->
                        <label class="select-label">
                            <input type="radio" name="pushObject" value="">
                            <span>全部用户</span>
                        </label>
                        <label class="select-label">
                            <input type="radio" name="pushObject" value="">
                            <span>部分用户</span>
                        </label>
                    </td>
                </tr>
                <tr class="FormData" id="tr_pushObjectRange" hidden>
                    <td class="CaptionTD" style="vertical-align: top;">用户范围</td>
                    <td class="DataTD">&nbsp;
                        <label id="label_pushDetail" class="select-label">
                            <input type="radio" name="pushObjectRange">
                            <span>上传用户</span>
                        </label>
                        <label id="label_selectUser" class="select-label">
                            <input type="radio" name="pushObjectRange">
                            <span>选择用户</span>
                        </label>
                        <label id="label_selectOrg" class="select-label" hidden>
                            <input type="radio" name="pushObjectRange">
                            <span>选择机构</span>
                        </label>

                        <div class="container section-pushDetail">
                            <!-- 上传用户 -->
                            <div id="row_pushDetail" class="row" hidden>
                                <div class="uploadFile"></div>
                            </div>

                            <!-- 选择用户 -->
                            <div id="row_selectUser" class="row" hidden>
                                <select name="receiveId" class="form-control" style="width: 260px;"></select>
                            </div>

                            <!-- 选择机构 -->
                            <div id="row_selectOrg" class="row" hidden>
                                <!-- append -->
                            </div>

                            <!-- 用户体系 -->
                            <div id="row_userSystem" class="row" hidden>
                                <label class="select-label">
                                    <input type="checkbox" id="userSystem1" name="userSystem" value="1">
                                    <span>1.0体系</span>
                                </label>
                                <label class="select-label">
                                    <input type="checkbox" id="userSystem2" name="userSystem" value="2">
                                    <span>2.0体系</span>
                                </label>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr class="FormData" id="tr_pushDevice" Belong="A1,A2">
                    <td class="CaptionTD">发送设备</td>
                    <td class="DataTD">&nbsp;
                        <select class="FormElement ui-widget-content ui-corner-all" id="pushDevice" name="pushDevice">
                            <option value="1">所有用户</option>
                            <option value="2">Android用户</option>
                            <option value="3">ios用户</option>
                        </select>
                    </td>
                </tr>
                <tr class="FormData" id="tr_pushPosition" Belong="A2">
                    <td class="CaptionTD">APP接收到后</td>
                    <td class="DataTD">&nbsp;
                        <select class="FormElement ui-widget-content ui-corner-all" id="pushPosition" name="pushPosition">
                            <option value="1">打开主页面</option>
                            <option value="2">打开交易流水页面</option>
                            <option value="3">打开清算结果页面</option>
                            <option value="4">打开消息中心</option>
                        </select>
                    </td>
                </tr>
                <tr class="FormData" id="tr_previewImageUrl" Belong="A1">
                    <td class="CaptionTD">消息预览图片</td>
                    <td class="DataTD">
                        <!-- 上传消息预览图片 -->
                        <!--<div class="uploadPreviewImageFile container" id="uploadPreviewImageFile"></div>-->
                        <div class="container section-uploadPreviewImage" name="previewImageUrl">
                            <div class="row">
                                <div class="col-xs-7">
                                    <div class="mcht-form-group mcht-add-pic">
                                        <div class="upload-trigger">
                                            <div class="btn-panel">
                                                <i class="icon icon-trash remove-trigger" title="清空图片"></i>
                                            </div>
                                            <div class="preview-container">
                                                <span class="vertical-helper"></span><img src="">
                                            </div>
                                            <div class="uploading-indicator middle-wrap">
                                                <div class="v-align-middle indicator">
                                                    <span class="icon-wrap">
                                                      <i class="icon-spinner icon-spin"></i>
                                                      <span class="progress-percent" ></span>
                                                    </span>正在上传
                                                </div>
                                            </div>
                                            <i class="icon-plus icon-trigger hx-font100"></i>
                                            <div class="add-tips">点击此处添加照片</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-xs-5 uploadPreviewImageHelps">
                                    <div class="prompt-wrap">
                                        1）请上传尺寸为560*315的图片；<br><br>
                                        2）可支持图片格式 jpg, jpeg, png；<br><br>
                                        3）最大支持150KB；<br><br>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
                 <tr class="FormData" id="tr_previewContent" Belong="A1">
                    <td class="CaptionTD">消息预览内容</td>
                    <td class="DataTD">&nbsp;
                        <textarea class="FormElement ui-widget-content ui-corner-all previewContent" id="previewContent" name="previewContent"></textarea>
                    </td>
                </tr>
                <tr class="FormData" id="tr_msgSubject" Belong="A1">
                    <td class="CaptionTD">消息标题</td>
                    <td class="DataTD">&nbsp;
                        <input type="text" class="FormElement ui-widget-content ui-corner-all" id="msgSubject" name="msgSubject">
                    </td>
                </tr>
                <tr class="FormData" id="tr_msgType" Belong="A1">
                    <td class="CaptionTD">消息正文</td>
                    <td class="DataTD">&nbsp;
                        <label class="select-label">
                            <input type="radio" name="msgType" value="1" checked="true">
                            <span>纯文本</span>
                        </label>
                        <label class="select-label">
                            <input type="radio" name="msgType" value="2">
                            <span>链接</span>
                        </label>
                    </td>
                </tr>
                <tr class="FormData" id="tr_msgContent" Belong="A1">
                    <td class="CaptionTD">&nbsp;</td>
                    <td class="DataTD">
                        <div id="textarea-content">
                            <textarea class="FormElement ui-widget-content ui-corner-all msgContent" name="msgContent1"></textarea>
                        </div>
                        <div id="input-content" hidden>
                            <input class="FormElement ui-widget-content ui-corner-all msgContent" name="msgContent2">
                        </div>
                    </td>
                </tr>
                <tr class="FormData" id="tr_pushType" Belong="A1,A2">
                    <td class="CaptionTD">推送时间</td>
                    <td class="DataTD">&nbsp;
                        <label class="select-label">
                            <input type="radio" name="pushType" value="1" checked="true">
                            <span>即时发送</span>
                        </label>
                        <label class="select-label">
                            <input type="radio" name="pushType" value="2">
                            <span>定时发送</span>
                        </label>
                    </td>
                </tr>
                <tr class="FormData" id="tr_pushDate" hidden>
                    <td class="CaptionTD">&nbsp;</td>
                    <td class="DataTD"></td>
                </tr>

                <tr class="FormData" id="tr_MsgValidity" Belong="A1,A2">
                    <td class="CaptionTD">有效期至</td>
                    <td class="DataTD">&nbsp;
                        <label class="select-label">
                            <input type="radio" name="validityTime" value="0" checked="true">
                            <span>长期</span>
                        </label>
                        <label class="select-label">
                            <input type="radio" name="validityTime" value="2">
                            <span>短期</span>
                        </label>
                        <!--<label>-->
                            <!--<input  name="limitTime" >-->
                        <!--</label>-->
                    </td>
                </tr>
                <!--时间选择框-->
                <tr class="FormData" id="tr_validityTime" hidden>
                    <td class="CaptionTD">&nbsp;</td>
                    <td class="DataTD"></td>
                </tr>

                <tr class="FormData" id="tr_MsgPosition" Belong="A1,A2">
                    <td class="CaptionTD">显示位置</td>
                    <td class="DataTD">&nbsp;
                        <label class="select-label">
                            <input type="checkbox" name="showPosition" value="1" checked="true">
                            <span>消息中心</span>
                        </label>
                        <br/>&nbsp;
                        <label class="select-label">
                            <input type="checkbox" name="showPosition" value="2" checked="true">
                            <span>首页活动公告</span>
                        </label>
                    </td>
                </tr>

                <tr class="FormData" id="tr_isPush" Belong="A1">
                    <td class="CaptionTD">推送通知</td>
                    <td class="DataTD">&nbsp;
                        <label class="select-label">
                            <input type="checkbox" name="isPush">
                            <span>需要推送通知给用户</span>
                        </label>
                    </td>
                </tr>
                <tr class="FormData" id="tr_pushContent" hidden>
                    <td class="CaptionTD" style="vertical-align: top;">推送内容</td>
                    <td class="DataTD">&nbsp;
                        <textarea maxlength="256" class="FormElement ui-widget-content ui-corner-all" id="pushContent" name="pushContent"></textarea>
                    </td>
                </tr>
            </tbody>
        </table>

    </form>
</div>