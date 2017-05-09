<%
    var UNITERATIO_MAP = {
        "0": "是",
        "1": "否"
        };
    var STATUS_MAP = {
            '0': '启用',
            '1': '停用'
        };
%>

<div class="model-container">
    <form onsubmit="return false;" class="FormGrid edit-model-form">
        <table border="0" class="EditTable">
            <tbody>
                <tr style="display:none" class="tinfo"></tr>
                <tr style="display:none" rowpos="1" class="FormData" id="tr_id"></tr>
                <tr class="FormData" id="tr_modelName">
                    <td class="CaptionTD">模型名称:</td>
                    <td class="DataTD">&nbsp;
                        <input class='model-name' maxlength="40" name="model-name" placeholder="">
                        <br>
                        <label class="length-tip">输入长度要在0-40个字节之间(一个中文字算3个字节)</label>
                    </td>
                </tr>
                <tr class="FormData" id="tr_modelBranchName">
                    <td class="CaptionTD">所属机构:</td>
                    <td class="DataTD">&nbsp;
                        <input class="model-branch-name" name="model-branch-name">
                    </td>
                </tr>
                <tr class="FormData" id="tr_modelStatus">
                    <td class="CaptionTD">状态:</td>
                    <td class="DataTD">&nbsp;
                        <select class="model-status">
                            <option value="0"><%=STATUS_MAP["0"]%></option>
                            <option value="1"><%=STATUS_MAP["1"]%></option>
                        </select>
                    </td>
                </tr>
                <tr class="FormData" id="tr_modelUniteRatio">
                    <td class="CaptionTD">统一分润:</td>
                    <td class="DataTD">&nbsp;
                        <select class="model-unite-ratio">
                            <option value="0">是</option>
                            <option value="1">否</option>
                        </select>
                        <a href="javascript: void 0" class="btn btn-xs btn-primary set-unite-ratio btn-set-unite-ratio">统一分润档设置</a>
                    </td>
                </tr>
            </tbody>
        </table>

    </form>

    <div class="disc-table"></div>
</div>
