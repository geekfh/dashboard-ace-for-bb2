<div class="condition-wrap">
    <fieldset>
        <legend>统计条件</legend>

        <div class="fieldset-innerwrap">
            <div class="form-group">
                <span>进驻时间：</span>
                <button class="date-approved-trigger picker-btn">- 请选择进驻时间 -</button>
            </div>

            <div class="form-group">
                <span>统计时间：</span>
                <button class="date-range-btn picker-btn">
                    <span class="text">选择时间范围</span>
                    <!-- <i class="icon-caret-down"></i>
                    -->
                </button>
            </div>

            <div class="form-group target-btn-group">
                <span>考核范围：</span>
                <button class="mcht-range-btn picker-btn">
                    <span class="text">选择考核范围</span>
                </button>
            </div>

            <div class="form-group">
                <span>排行依据：</span>
                <div style="display: inline-block">
                    <%=switchableDropdownTplFn(assessmentTplData)%>
                    <%=switchableDropdownTplFn(orderTplData)%>
                </div>
            </div>

        </div>

    </fieldset>
</div>

<div class="filter-wrap">
    <fieldset>
        <legend>筛选条件</legend>

        <div class="fieldset-innerwrap">
            <span class="descr">
                用于对排行榜进一步筛选结果，例如将优秀拓展员的标准定义为“每月发展30个新商户”，那么可以通过设置“新增商户数大于30”来快速筛选出优秀拓展员。
            </span>
            <div class="filters"></div>
            <a class="toggle-trigger expand-trigger trigger">
                <i class="icon icon-filter"></i>
                <span class="text">展开筛选条件</span>
            </a>
            <a class="toggle-trigger collapse-trigger trigger" hidden>
                <span class="text">收起筛选条件</span>
            </a>
            <a class="reset-trigger trigger" hidden>
                <span class="text">清空筛选条件</span>
            </a>
        </div>

    </fieldset>
</div>

<input type="button" class="btn btn-primary btn-report-submit" value="生成排行榜"/>

<div class="row">
    <div class="col-xs-12 jgrid-container rank-grid pfms-grid">

        <table class="rank-grid-table"></table>

        <div class="rank-grid-pager" ></div>

    </div>
</div>
