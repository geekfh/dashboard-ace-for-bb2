<div class="model-container">
    <form onsubmit="return false;" class="FormGrid add-model-form">
        <table border="0" class="EditTable">
            <tbody>
                <tr style="display:none" class="tinfo"></tr>
                <tr style="display:none" rowpos="1" class="FormData" id="tr_id"></tr>
                <tr class="FormData" id="tr_modelNm">
                    <td class="CaptionTD">模型名称:</td>
                    <td class="DataTD">&nbsp;
                        <input class='model-name' name="model-name" placeholder="">
                        <input class='for-hd-model-name' name="for-hd-model-name" placeholder="" hidden>
                        <br>
                        <label class="length-tip">输入长度要在0-40个字节之间(一个中文字算3个字节)</label>
                    </td>
                </tr>
                <tr class="FormData" id="tr_modelBrh">
                    <td class="CaptionTD">所属机构:</td>
                    <td class="DataTD">&nbsp;
                        <input class="model-brh" name="model-brh" style="min-width: 100px;">
                    </td>
                </tr>
                
                <tr class="FormData" id="tr_transType">
                    <td class="CaptionTD">交易类型:</td>
                    <td class="DataTD">&nbsp;
                        <select class="trans-type">
                        </select>
                        
                    </td>
                </tr>
                <tr class="FormData" id="tr_mchtGrp">
                    <td class="CaptionTD">商户类型:</td>
                    <td class="DataTD">&nbsp;
                        <select class="mcht-grp" name="mcht-grp">
                        </select>
                        
                    </td>
                </tr>
                <tr class="FormData" id="tr_modelFlag">
                    <td class="CaptionTD">状态:</td>
                    <td class="DataTD">&nbsp;
                        <select class="model-flag">
                            <option value="0">是</option>
                            <option value="1">否</option>
                        </select>
                    </td>
                </tr>
                <tr class="FormData" id="tr_modelId" hidden>
                    <td class="CaptionTD">模型ID:</td>
                    <td class="DataTD">&nbsp;
                        <input type="text" class="model-id" name="model-id">
                    </td>
                </tr>
            </tbody>
        </table>

    </form>

    <div class="disc-table"></div>
    <div class="base-disc-table"></div>

</div>