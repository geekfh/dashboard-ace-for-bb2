<!-- CRM -->
<div class="container">
    <!-- 商户来电 -->
    <div class="row" style="padding-top:10px; padding-bottom:10px;">
        <div class="col-xs-12">
            <div class="form-horizontal">
                <label class="col-sm-2 control-label" for="customerNumber">更换电话号码：</label>
                <div class="col-sm-4">
                    <input type="text" id="customerNumber" name="customerNumber" class="form-control" value="<%= token.customerNumber %>">
                </div>
                <div class="col-sm-2">
                    <button id="J_service_telephone_alert_search" type="button" class="btn btn-info btn-sm">
                        <i class="icon icon-search"></i> 查询
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- 暂无该信息 -->
    <div class="text-warning">
        <h2><i class="icon icon-info-sign"></i> 暂无该信息</h2>
    </div>

    <!-- 商户信息 -->
    <div class="row" hidden>
        <div class="col-xs-12">
            <em>商户信息</em>
            <table class="table table-bordered table-hover">
                <thead>
                    <tr>
                        <th width="15%">商户名称</th>
                        <th width="15%">法人姓名</th>
                        <th width="30%">所属机构</th>
                        <th width="15%">拓展员</th>
                        <th width="25%">操作</th>
                    </tr>
                </thead>
                <tbody id="J_service_telephone_alert_mchtInfo"></tbody>
            </table>
        </div>
    </div>

    <!-- 机构信息 -->
    <div class="row" hidden>
        <div class="col-xs-12">
            <em>机构信息</em>
            <table class="table table-bordered table-hover">
                <thead>
                <tr>
                    <th width="15%">机构名称</th>
                    <th width="15%">机构编号</th>
                    <th width="30%">联系人</th>
                    <th width="15%">机构等级</th>
                    <th width="25%">操作</th>
                </tr>
                </thead>
                <tbody id="J_service_telephone_alert_brhInfo"></tbody>
            </table>
        </div>
    </div>

    <!-- 机构拓展员信息 -->
    <div class="row" hidden>
        <div class="col-xs-12">
            <em>机构拓展员信息</em>
            <table class="table table-bordered table-hover">
                <thead>
                <tr>
                    <th width="15%">员工姓名</th>
                    <th width="15%">登录账号</th>
                    <th width="30%">所属机构名</th>
                    <th width="15%">一级代理商</th>
                    <th width="25%">操作</th>
                </tr>
                </thead>
                <tbody id="J_service_telephone_alert_unDirectOprInfo"></tbody>
            </table>
        </div>
    </div>

    <!-- 直销网络拓展员信息 -->
    <div class="row" hidden>
        <div class="col-xs-12">
            <em>直销网络拓展员信息</em>
            <table class="table table-bordered table-hover">
                <thead>
                <tr>
                    <th width="20%">员工姓名</th>
                    <th width="20%">登录账号</th>
                    <th width="40%">上级拓展员</th>
                    <th width="20%">操作</th>
                </tr>
                </thead>
                <tbody id="J_service_telephone_alert_directOprInfo"></tbody>
            </table>
        </div>
    </div>
</div>