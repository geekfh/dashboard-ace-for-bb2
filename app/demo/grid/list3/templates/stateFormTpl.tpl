<div>
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

        <tr class="FormData">
            <td class="CaptionTD" style="padding-right:10px;">限制终端数量:</td>
            <td class="DataTD">
                &nbsp;
                <input type="text" name="maxDeviceNum" style="width: 100px;" />
            </td>
        </tr>

        <!-- 所属地区 -->
        <!--<tr id="tr_modifyZbankArea" class="FormData">
            <td class="CaptionTD">地区：</td>
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
        </tr>-->
        <tr>
            <td class="CaptionTD">select2:</td>
            <td class="DataTD">
                <div id="txt-name" style="width: 180px;"></div>
            </td>
        </tr>
        </tbody>
    </table>
</div>

<!-- 内联样式 -->
<style type="text/css">
    .input-wrap { margin-right: 0 !important; }
</style>