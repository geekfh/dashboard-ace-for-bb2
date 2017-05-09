<style type="text/css">
    .cashbox-manage .tab-btns { text-align: center; }
    .cashbox-manage .tab-container { padding: 20px; }
</style>
<div class="container cashbox-manage">
    <div class="row">
        <div class="col-xs-12">
            <div class="tab-btns btn-group">
                <a href="javascript:void(0);" class="btn btn-sm btn-primary" data-type="sysConfig">配置管理</a>
                <a href="javascript:void(0);" class="btn btn-sm" data-type="errorCode">错误码配置</a>
            </div>
            <div class="tab-container">
                <div class="tab-panel">
                    <!-- TODO -->
                </div>
                <div class="tab-panel" hidden></div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-xs-12">
            <hr/>
        </div>
    </div>
    <div class="row">
        <div class="col-xs-12">
            <button type="button" name="cashboxGA" class="btn btn-primary" data-system="GA">刷新GA</button> &nbsp;&nbsp;&nbsp;&nbsp;
            <button type="button" name="cashboxHDS" class="btn btn-primary" data-system="HDS">刷新HD</button> &nbsp;&nbsp;&nbsp;&nbsp;
            <button type="button" name="cashboxBC" class="btn btn-primary" data-system="BC">刷新BC</button> &nbsp;&nbsp;&nbsp;&nbsp;
            <button type="button" name="cashboxPA" class="btn btn-primary" data-system="PA">刷新PA</button>
        </div>
    </div>
</div>