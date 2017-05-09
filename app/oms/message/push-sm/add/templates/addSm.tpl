<div class="">
    <form onsubmit="return false;" class="FormGrid add-sm-form">
        <table border="0" class="EditTable">
            <tbody>
                <tr style="display:none" class="tinfo"></tr>
                <tr style="display:none" rowpos="1" class="FormData" id="tr_id"></tr>
                <tr class="FormData" id="tr_pushObject">
                    <td class="CaptionTD">发送对象</td>
                    <td class="DataTD">&nbsp;
                        <select class="FormElement ui-widget-content ui-corner-all push-app" name="push-app">
                            <option value="11">所有钱盒用户</option>
                            <option value="12">部分钱盒用户</option>
                            <option value="21">所有个人端用户</option>
                            <option value="22">部分个人端用户</option>
                            <option value="31">所有开通宝用户</option>
                            <option value="32">部分开通宝用户</option>
                        </select>
                    </td>
                </tr>
                <tr class="FormData" id="tr_pushDevice">
                    <td class="CaptionTD">发送设备</td>
                    <td class="DataTD">&nbsp;
                        <select class="FormElement ui-widget-content ui-corner-all push-device" name="push-device">
                            <option value="1">所有用户</option>
                            <option value="2">Android用户</option>
                            <option value="3">ios用户</option>
                            <option value="4">导入用户</option>
                            <option value="5">输入号码</option>
                        </select>
                    </td>
                </tr>
                <tr class="FormData" id="tr_inputPhoneNo" hidden>
                    <td class="CaptionTD">输入号码</td>
                    <td class="DataTD">&nbsp;
                        <textarea class='phone-no' name="phone-no" placeholder="多个号码用','逗号隔开"></textarea>
                    </td>
                </tr>
                <tr class="FormData" id="tr_uploadPhoneNo" hidden>
                    <td class="CaptionTD">导入文件</td>
                    <td class="DataTD">
                        <div class="upload_container"></div>
                    </td>
                </tr>
                <tr class="FormData" id="tr_smCategory">
                    <td class="CaptionTD">短信类型</td>
                    <td class="DataTD">&nbsp;
                        <select class="sm-category" name="sm-category"></select>
                        <a href="javascript: void 0" class="add-sm-categories">增加短信类型</a>
                    </td>
                </tr>
                <tr class="FormData" id="tr_smContent">
                    <td class="CaptionTD">短信内容</td>
                    <td class="DataTD">&nbsp;
                        <textarea class="sm-content" name="sm-content" maxlength="<%= CHAR_TO_TYPE %>"></textarea>
                        <span class="sm-content-tip">可输入<%= CHAR_TO_TYPE %>字（0条短信）</span>
                    </td>
                </tr>
                <tr class="FormData" id="tr_pushType">
                    <td class="CaptionTD">发送时间</td>
                    <td class="DataTD">&nbsp;
                        <select class="push-type">
                            <option value="1">即时发送</option>
                            <option value="2">定时发送</option>
                        </select>
                    </td>
                </tr>
                <tr class="FormData" id="tr_pushDate" hidden>
                    <td class="CaptionTD">&nbsp;</td>
                    <td class="DataTD"></td>
                </tr>
                <tr class="FormData" id="tr_needResend">
                    <td class="CaptionTD"></td>
                    <td class="DataTD">&nbsp;
                        <label class="select-label">
                            <input type="checkbox" class="need-resend">
                            <span>短信未发送成功，自动重发一次</span>
                        </label>
                    </td>
                </tr>
            </tbody>
        </table>

    </form>
</div>