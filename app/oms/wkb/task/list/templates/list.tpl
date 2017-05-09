<!-- TODO国际化 -->
<div class="header-bar ">
  <div class="inner-wrap">

    <!-- col part left-->
    <div class="task-btn-wrap">
      <div class="btn btn-success btn-sm btn-get-task" style="top: 0px">领取任务</div>
      <select class="task-subtype" style="top: 0px">
        <option value="0">-请选择任务类型-</option>
          <%$.each(data,function(i,v){ %>
            <option value="<%=i%>"><%=v%></option>
          <%});%>
      </select>
      <select class="task-amount" style="top: 0px">
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="5">5</option>
        <option value="10" selected="true">10</option>
        <option value="15">15</option>
      </select>




      <a class="refresh-btn">刷新</a>
    </div>

    <!-- col part  center -->
    <!-- TODO 换成别的高级点的带事件的dropdown组件，bs的dropdown弄太麻烦-->
    <div class="dropdown dropdown-switch">
      <button ref="2" type="button" class="btn-switch dropdown-toggle" data-toggle="dropdown">
        <span class="text">待完成任务</span>
        <span class="icon icon-angle-down"></span>
      </button>
      <ul class="dropdown-menu">
        <li>
          <a href="#" value="5">参与过的任务</a>
        </li>
        <li>
          <a href="#" value="2">待完成任务</a>
        </li>
        <li>
          <a href="#" value="1">待领取任务</a>
        </li>
      </ul>
    </div>

    <!-- col part  center -->
    <div class="revoke-wrap">
      <span class="revoke">
        <span>搜索</span>
        <span class="kw"></span> <i class="icon-remove revoke-trigger"></i>
      </span>
    </div>

    <!-- col part right-->
    <!--     <div class="search-input-wrap"> <i class="icon-search nav-search-icon"></i>
    <input type="text" class="form-control search-input" placeholder="关键词可以为任务名称、描述或发起人"></div>
  -->
    <div class="search-wrap">
      <form class="form-search">
        <span class="input-icon">
          <input type="text" title="搜索任务名称、拓展员或商户手机号" placeholder="搜索任务名称、拓展员或商户手机号" class="nav-search-input" id="nav-search-input" autocomplete="off">
          <i class="icon-search nav-search-icon"></i>
        </span>
      </form>
    </div>
    <a class="clearfix"></a>

  </div>
</div>

<div class="ct">
  <div class='row task-row'>
    <div class="header-cellv class='header-cellv class="header-cellv class="header-celliv class="header-celldiv></div>
  </div>
</div>

<table class="list" style="width:100%">
  <thead><tr class="task-row-head">
    <td>状态</td>
    <td class="hidden-xs">类型</td>
    <td>名称</td>
    <td>发起人</td>
    <td class="hidden-xs">提交时间</td>
    <td class="hidden-xs">发起时间</td>
  </tr></thead>
</table>

