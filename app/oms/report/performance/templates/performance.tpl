<div class="condition-wrap">

    <div class="fieldset-innerwrap">
        <!--
            //时间初始化的时候设置默认值。 这个值只是当前的以前的四周。可以直接获取
        -->
        <div class="form-group">
            <span>进驻时间：</span>
            <button class="picker-btn date-approved-trigger">- 请选择进驻时间 -</button>
        </div>

        <div class="form-group">
            <span>统计周期：</span>
            <div class="dropdown dropdown-switch frequency-dropdown">
                <button class="picker-btn" data-toggle="dropdown">
                    <span class="text">- 请选择统计周期 -</span>
                    <span class="caret"></span>                             
                </button>
                <ul class="dropdown-menu">
                    <li><a href="#" name="daily">按日统计</a></li>
                    <li><a href="#" name="weekly">按周统计</a></li>
                    <li><a href="#" name="monthly">按月统计</a></li>
                </ul>
            </div>
        </div>

        <div class="form-group">
            <span>统计时间：</span>
            <button class="picker-btn date-range-trigger">- 请选择统计时间 -</button>
        </div>

        <div class="form-group target-btn-group">
            <span>商户范围：</span>
            <button class="mcht-range-btn picker-btn">
                <span class="text">请选择商户范围</span>
            </button>
        </div>

        <div class="form-group">
            <input type="button" class="btn btn-primary btn-report-submit" value="生成报表"/>
        </div>

    </div>

</div>



<div class="row">
    <div class="report report-grid pfms-grid">
        <div class="col-xs-12 jgrid-container">

            <table class="report-grid-table"></table>

            <div class="report-grid-pager" ></div>

        </div><!-- /.col -->
    </div><!-- /.row --> 

</div>
