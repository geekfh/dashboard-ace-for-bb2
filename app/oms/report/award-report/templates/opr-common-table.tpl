<div class="condition-wrap">
    <fieldset>
        <legend>统计条件</legend>

        <div class="fieldset-innerwrap">

            <div class="form-group">
                <span>统计时间：</span>
                <button class="date-range-btn picker-btn">
                    <span class="text">选择时间范围</span>
                </button>
            </div>

            <div class="form-group">
                <input type="button" class="btn btn-primary btn-report-submit" value="查询"/>
            </div>

        </div>

    </fieldset>
</div>


<div class="row">
    <div class="col-xs-12 jgrid-container">

        <table id="<%=gridName%>-grid-table"></table>

        <div id="<%=gridName%>-grid-pager" ></div>

    </div>
</div>


