<div class="condition-wrap">


    <div class="fieldset-innerwrap">
        <!--
            //时间初始化的时候设置默认值。 这个值只是当前的以前的四周。可以直接获取
        -->

        <div class="form-group">
            <span>报表类型：</span>
            <div class="dropdown dropdown-switch type-dropdown">
                <button class="picker-btn" data-toggle="dropdown">
                    <span class="text" data-set="orgTxn">- 请选择报表类型 -</span>
                    <span class="caret"></span>                             
                </button>
                <ul class="dropdown-menu">
                    <li><a href="#" name="orgTxn" style="display: block;">机构流水对账</a></li>
                    <li><a href="#" name="orgMchtSum" style="display: block;">机构商户交易汇总</a></li>
                    <li><a href="#" name="orgExploreSum" style="display: block;">机构拓展员交易汇总</a></li>
                    <li><a href="#" name="mchtTxn" style="display: block;">商户流水对账</a></li>
                </ul>
            </div>
        </div>
        <div class="form-group">
            <span>统计时间：</span>
            <button class="picker-btn range-trigger">
                - 请选择统计时间 -
            </button>

        </div>

        <div class="form-group">
            <span>商户范围：</span>
            <div class="dropdown dropdown-switch target-dropdown">
                <button class="picker-btn" data-toggle="dropdown">
                    <span class="targetVal text" data-set="preforance-explore">- 请选择商户范围 -</span>
                    <span class="caret"></span>                             
                </button>
                <ul class="dropdown-menu">
                    <li><a href="#" name="preforance-explore" value="explore">统计某个拓展员的业绩</a></li>
                    <li><a href="#" name="preforance-org" value="org">统计某个机构的业绩</a></li>
                </ul>
            </div>

            <button class="picker-btn mcht-trigger" style="display:none;">
                <span class="targetVal text"> - 请选择商户范围 - </span>
            </button>
        </div>

        
        <div class="form-group">
            <input type="button" class="btn btn-primary btn-report-submit" value="生成报表"/>
        </div>

    </div>

</div>



<div class="row">

</div>
<!-- /.row -->