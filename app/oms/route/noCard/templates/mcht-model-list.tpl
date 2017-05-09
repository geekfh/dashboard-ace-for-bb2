<div class="model-panel txn-panel">

    <div class="panel-head">
        <span><%= title %></span>

        <% if ( permission.add === true ) { %>
        <i class="icon-plus-sign add-model"></i>
        <% } %>

        <% if ( permission.upload === true ) { %>
        <i class="icon-upload-alt upload-models"></i>
        <% } %>

    </div>

    <div class="panel-search">
        <form class="filters-search search-form">
            <input type="search" name="search" class="search-models" placeholder="搜索模型">
            <a href="javascript: void 0" class="filter-pop-trigger btn btn-success btn-sm pull-right">条件过滤</a>
        </form>
        <i class="icon-search"></i><a class="clear-search mcht-clear-search btn-clear-search" href="#">&times;</a>

    </div>

<!--     <div class="batch-edit-bind hide">
        <a href="javascript: void 0" class="btn btn-xs btn-primary batch-bind">批量绑定</a>
        <a href="javascript: void 0" class="btn btn-xs btn-primary batch-unbind">批量解绑</a>
    </div> -->

    <!-- items -->
    <div class="model-item">
        
    </div>

    <div class="model-pager" style="height: 50px; line-height: 30px;">
        <div class="mcht-total-num"></div>

        <!-- <a href="javascript: void 0;" class="batch-operate batch-btn">批量操作</a> -->
        <div class="btn-group dropup batch-btn">
            <a href="javascript: void 0;" data-toggle="dropdown" class="btn btn-xs btn-primary dropdown-toggle batch-op-dd-toggle"> 批量操作 <i class="icon-caret-up icon-only icon-on-right"></i></a>

            <ul class="dropdown-menu dropdown-inf pull-right">
                <li>
                    <a href="javascript: void 0;" class="batch-operate-open">开启</a>
                </li>
                <li>
                    <a href="javascript: void 0;" class="batch-operate-close">关闭</a>
                </li>
                <li>
                    <a href="javascript: void 0;" class="batch-update-day-amount-limit">修改单日额度</a>
                </li>
                <li>
                    <a href="javascript: void 0;" class="batch-update-remark">批量修改备注</a>
                </li>
            </ul>
        </div>

        <div class="btn-group batch-btn">
            <a href="javascript: void 0;" class="btn btn-xs btn-primary batch-unchecked">反 选</a>
        </div>

        <div class="btn-group batch-btn">
            <a href="javascript: void 0;" class="btn btn-xs btn-primary batch-checked">全 选</a>
        </div>

    </div>

</div>





