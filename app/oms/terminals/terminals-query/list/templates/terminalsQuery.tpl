<div class="condition-wrap">
    <form class="queryForm" onsubmit="return false;">
        <fieldset>
            <legend>查询条件</legend>
            <div class="fieldset-innerwrap">
                <div class="form-group">
                    <span>终端标识码: </span>
                    <input type="text" id="terminalsQuerySnNo" name="snNo">
                </div>
                <div class="form-group">
                    <span>审核状态: </span>
                    <select name = "checkStatus">
                        <option role="option" value="-1">全部</option>
                        <option role="option" value="0">未考核</option>
                        <option role="option" value="1">考核中</option>
                        <option role="option" value="2">考核暂停</option>
                        <option role="option" value="3">考核结束</option>
                    </select>
                </div>
                <div class="form-group">
                    <span>终端用途: </span>
                    <select  name="application">
                        <option role="option" value="-1">全部</option>
                        <option role="option" value="0">其它</option>
                        <option role="option" value="1">租机</option>
                        <option role="option" value="2">购买</option>
                        <option role="option" value="3">赠送</option>
                        <option role="option" value="4">非考核租机</option>
                    </select>
                </div>
                <div class="form-group" style="display: none!important;">
                    <span>终端类型: </span>
                    <input type="text" name="temrinal">
                </div>
                <input type="submit" class="btn btn-primary" value="查找" id="fbox_terminalsQuery_search">
                <a class="reset-trigger trigger" id="fbox_terminalsQuery_reset">
                    <span class="text">清空筛选条件</span>
                </a>
            </div>
        </fieldset>
    </form>
</div>

<div class="row">
    <div class="col-xs-12 jgrid-container" style="visibility:hidden;">
        <!-- PAGE CONTENT BEGINS -->

        <table id="terminalsQuery-table"></table>

        <div id="terminalsQuery-pager" ></div>

        <!-- PAGE CONTENT ENDS -->
    </div><!-- /.col -->
</div><!-- /.row -->