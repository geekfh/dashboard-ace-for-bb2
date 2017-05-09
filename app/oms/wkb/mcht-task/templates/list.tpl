<!-- TODO国际化 -->
<!--注意：其他页面有公用到改class 则看到有style勿删，商审页面单独使用-->
<div class="header-bar ">
    <div class="inner-wrap clearfix">
        <!-- col part left-->
        <div class="task-btn-wrap pull-left">
            <!--<div class="btn btn-success btn-sm btn-get-task" style="top: 0px">领取任务</div>-->
            <button class="btn btn-success bt-verifyonlines" style="width:85px; height: 40px;float: left;" value="">
                <i class="icon-calendar"></i>
                <span class="bt_i_verifyonlines">签到</span>
            </button>
            <div class="bt-refresh-list" style="float: left; margin: 20px 0 0 15px;">
                <a class="a-refresh-btn" style="font-size: 14px;text-decoration:none;">
                    <span class="sp-refresh-list"></span>
                </a>
            </div>
            <!--refresh-btn float: right; 刷新按钮-->
<!--            <div class="btn btn-success btn-sm btn-get-task" style="top: 0px">领取任务</div>-->
<!--            <select class="task-subtype" style="top: 0px">
                <option value="0">-请选择任务类型-</option>
                <option value="101">新增机构</option>
                <option value="102">新增商户</option>
                <option value="103">新增机构用户</option>
                <option value="104">新增直销拓展员</option>
                <option value="201">修改机构信息</option>
                <option value="202">修改商户信息</option>
                <option value="203">修改用户信息</option>
                <option value="204">修改终端信息</option>
                <option value="205">修改银行卡号</option>
                <option value="206">实名认证审核</option>
                <option value="207">商户补充资料审核</option>
                <option value="301">申请生产终端</option>
                <option value="302">申领终端</option>
                <option value="303">申购终端</option>
                <option value="304">申请提额</option>
            </select>
            <select class="task-amount" style="top: 0px">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="5">5</option>
                <option value="10" selected="true">10</option>
                <option value="15">15</option>
            </select>
-->
        </div>
        <!-- col part  center -->
        <!-- TODO 换成别的高级点的带事件的dropdown组件，bs的dropdown弄太麻烦-->
        <div class="dropdown dropdown-switch pull-right">
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
                <!--<li>
                    <a href="#" value="1">待领取任务</a>
                </li>-->
            </ul>
        </div>

        <!-- col part  center -->
        <!--<div class="revoke-wrap" style="float: left; margin-left: 500px;">
            <span class="revoke" style="height: 50px; line-height: 50px;">
            <span>搜索</span>
            <span class="kw"></span> <i class="icon-remove revoke-trigger"></i>
            </span>
        </div>
        <div class="search-wrap">
            <form class="form-search">
                <span class="input-icon">
                    <input type="text" title="搜索任务名称、拓展员或商户手机号" placeholder="搜索任务名称、拓展员或商户手机号" class="nav-search-input" id="nav-search-input" autocomplete="off">
                    <i class="icon-search nav-search-icon"></i>
                </span>
            </form>
        </div> -->
    </div>
</div>

<div class="ct">
    <div class='row task-row'>
        <div class="header-cellv class='header-cellv class="header-cellv class="header-celliv class="header-celldiv></div>
    </div>
</div>

<table class="list" style="width:100%">
    <thead style="font-size:14px; background-color: #eee;">
    <tr class="task-row-head">
        <td style="width:150px;">状态</td>
        <td class="hidden-xs">类型</td>
        <td>名称</td>
        <td style="width:250px;">发起人</td>
        <td class="hidden-xs" style="width:200px;">提交时间</td>
        <td class="hidden-xs" style="width:200px;">发起时间</td>
    </tr>
    </thead>
</table>