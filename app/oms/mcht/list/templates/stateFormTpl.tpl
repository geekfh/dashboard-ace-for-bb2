
    <div><form>
        <table width="100%" cellspacing="0" cellpadding="0" border="0">
            <tbody>
            <tr class="FormData">
                <td class="CaptionTD" style="padding-right:10px;">商户状态:</td>
                <td class="DataTD">
                    &nbsp;
                    <select role="select" name="state" class="FormElement ui-widget-content ui-corner-all">
                        <option value="0">正常</option>
                        <option value="3">商户停用</option>
                        <option value="4">商户注销</option>
                    </select>
                </td>
            </tr>
            <tr class="FormData">
                <td class="CaptionTD" style="padding-right:10px;">是否联合营销商户:</td>
                <td class="DataTD">
                    &nbsp;
                    <select role="select" name="unionState" class="FormElement ui-widget-content ui-corner-all">
                        <option value="1">是</option>
                        <option value="2">否</option>
                    </select>
                </td>
            </tr>
            </tr>
            <!--<tr class="FormData">
                <td class="CaptionTD" style="padding-right:10px;">S0秒到开关:</td>
                <td class="DataTD">
                    &nbsp;
                    <select role="select" name="s0State" class="FormElement ui-widget-content ui-corner-all">
                        <option value="0">关闭</option>
                        <option value="1">打开</option>
                    </select>
                </td>
            </tr>-->
            <tr class="FormData">
                <td class="CaptionTD" style="padding-right:10px;">限制终端数量:</td>
                <td class="DataTD">
                    &nbsp;
                    <input type="text" name="maxDeviceNum" style="width: 100px;" />
                </td>
            </tr>
            <tr class="FormData">
                <td class="CaptionTD" style="padding-right:10px;">备注:</td>
                <td class="DataTD">
                    &nbsp;
                    <textarea name="remark" placeholder="状态变更原因，必填项" style="max-width: 198px; max-height: 97px;width: 198px; height: 97px;"></textarea>
                </td>
            </tr>
            </tbody>
        </table></form>
    </div>
