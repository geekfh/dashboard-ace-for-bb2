<!-- 所属地区 -->
<tr id="tr_zbankArea" class="FormData">
    <td class="CaptionTD">支行所属区域</td>
    <td class="DataTD">
        <span id="zbankArea"></span>
    </td>
</tr>

<!-- 所属地区 -->
<tr id="tr_isModify" class="FormData">
    <td class="CaptionTD">是否修改</td>
    <td class="DataTD">&nbsp;
        <label><input type="radio" name="isModify" value="1" /> 是</label>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <label><input type="radio" name="isModify" value="0" checked /> 否</label>
    </td>
</tr>

<!-- 所属地区 -->
<tr id="tr_modifyZbankArea" class="FormData" style="display: none;">
    <td class="CaptionTD"></td>
    <td class="DataTD">
        <div id="modifyZbankArea" class="container">
            <div class="row">
                <div class="col-md-4 input-wrap">
                    <select class="form-control" name="zbankProvince" data-set='zbank'>
                        <option class="placeholder">-选择省-</option>
                    </select>
                </div>
                <div class="col-md-4 input-wrap">
                    <select class="form-control" name="zbankCity" data-set='zbank'>
                        <option class="placeholder">-选择市-</option>
                    </select>
                </div>
                <div class="col-md-4 input-wrap">
                    <select class="form-control" name="zbankRegionCode" data-set='zbank'>
                        <option class="placeholder">-选择区-</option>
                    </select>
                </div>
            </div>
        </div>
    </td>
</tr>

<!-- 内联样式 -->
<style type="text/css">
    #zbankArea { display: block; padding: 0 5px; }
    .ui-jqdialog-content .FormGrid { overflow: hidden !important; }
    .input-wrap { margin-right: 0 !important; }
</style>
