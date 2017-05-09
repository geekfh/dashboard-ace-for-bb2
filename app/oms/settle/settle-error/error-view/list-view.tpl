<div style="width: auto; height: 500px; overflow-y: auto;">
    <div class="col-xs-12 jgrid-container">
        <div style="color: #2A7CCE; padding: 10px 10px 0; border-bottom: 1px dotted #E8E8E8;">
            <p id="exist-message" id="exist-warn" style="width: 60%;line-height: 1.8;font-size: 14px;float: left;">
                以下是系统检索<font style="color: red;">已存在清算失败列表中</font>信息，请确认核实，不再重新导入。
            </p>
            <p><input class="btn btn-primary btn-xs exist-import" type="button" value="导出" /></p>
            <div class="checkbox">
                <label>
                    <input type="checkbox" name="updateExistError"><font style="color: black;">已存在数据导入更新</font>（勾选此项，确认提交系统将此次检索的已存在数据全部更新处理）
                </label>
            </div>
        </div>
        <table id="error-exist-grid-table"></table>
        <div id="error-exist-grid-pager" ></div>
    </div>
    <div class="col-xs-12 jgrid-container">
        <div style="color: #2A7CCE; padding: 10px 10px 0; border-bottom: 1px dotted #E8E8E8;">
            <p id="notTxn-message" style="width: 60%;line-height: 1.8;font-size: 14px;float: left;">以下是系统<font style="color: red;">
                未查询</font>到的信息，请核实，该数据不会导入。
            </p>
            <p><input class="btn btn-primary btn-xs notTxn-import" type="button" value="导出" /></p>
        </div>
        <table id="error-notTxn-grid-table"></table>
        <div id="error-notTxn-grid-pager" ></div>
    </div>
    <div id="error-subMain-grid" class="col-xs-12 jgrid-container">
        <div style="color: #2A7CCE; padding: 10px 10px 0; border-bottom: 1px dotted #E8E8E8;">
            <p id="subMain-message" style="line-height: 1.8;font-size: 14px;">以下是检索存在<font style="color: red;">重复</font>的信息，未导入，请确认核实正确的数据并勾选后确认导入。</p>
        </div>
        <table id="error-subMain-grid-table"></table>
        <div id="error-subMain-grid-pager" ></div>
    </div>
</div>