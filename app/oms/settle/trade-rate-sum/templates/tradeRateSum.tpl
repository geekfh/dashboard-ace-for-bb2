<div class="condition-wrap">

    <div class="fieldset-innerwrap">

        <div class="form-group">
            <span>交易月份：</span>
            <button class="picker-btn range-trigger">
                - 请选择统计时间 -
            </button>
        </div>

        <div class="form-group">
            <span>统计范围：</span>
            <div class="dropdown dropdown-switch target-dropdown">
                <button class="picker-btn" data-toggle="dropdown">
                    <span class="targetVal text" data-set="preforance-explore">- 请选择统计范围 -</span>
                    <span class="caret"></span>
                </button>
                <ul class="dropdown-menu">
                    <li><a href="#" name="preforance-org" value="org">按机构统计</a></li>
                    <li><a href="#" name="preforance-explore" value="explore">按拓展员统计</a></li>
                </ul>
            </div>
        </div>

        <div class="form-group">
            <input type="button" class="btn btn-primary btn-report-submit" value="生成报表"/>
        </div>

    </div>

</div>


<div class="row">
    <div class="col-xs-12 jgrid-container pfms-grid">
        <!-- PAGE CONTENT BEGINS -->
        <table id="trade-rate-sum-grid-table"></table>

        <div id="trade-rate-sum-grid-pager" ></div>

    </div>
</div>
<!-- /.row -->