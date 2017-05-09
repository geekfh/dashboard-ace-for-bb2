<div class="model-panel txn-panel">

    <div class="panel-head">
        <span><%= title %></span>
        <% if ( permission.add === true ) { %>
        <i class="icon-plus-sign add-model"></i>
        <% } %>
    </div>

    <div class="panel-search">
        <form class="search-form"><input type="search" name="search" class="search-models" placeholder="搜索模型"></form>
        <i class="icon-search"></i><a class="clear-search btn-clear-search" href="#">&times;</a>
    </div>

<!--     <div class="batch-edit-bind hide">
        <a href="javascript: void 0" class="btn btn-xs btn-primary batch-bind">批量绑定</a>
        <a href="javascript: void 0" class="btn btn-xs btn-primary batch-unbind">批量解绑</a>
    </div> -->

    <!-- items -->
    <div class="model-item">
        
    </div>

    <div class="model-pager">
        
    </div>

</div>