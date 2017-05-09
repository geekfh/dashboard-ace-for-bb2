<div class="container body user-add-info">


    <div class="dropdown dropdown-switch user-type-select">
        <button type="button" class="btn-switch dropdown-toggle" data-toggle="dropdown">
            <span class="text"></span> <i class="icon icon-angle-down"></i>
        </button>
        <ul class="dropdown-menu">
        </ul>
    </div>

    <form>
        <div class="userInfo">
            <div class="caption"> <b>基本信息</b>
            </div>
            <div class ='form-horizontal' role='form'>
                <div class="form-group">
                    <label class="col-md-3 control-label">真实姓名:</label>
                    <div class="col-md-4 input-wrap">
                        <input type="text" class="form-control" type="text" name="name"></div>
                </div>
                <div class="form-group">
                    <label class="col-md-3 control-label">登录帐号:</label>
                    <div class="col-md-4 input-wrap">
                        <input type="text" class="form-control" type="text" name="loginName"></div>
                </div>
                <div class="form-group">
                    <label class="col-md-3 control-label">角色组:</label>
                    <div class="col-md-4 input-wrap">
                        <select class="form-control" name="roleGroupId"></select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-md-3 control-label">管辖范围:</label>
                    <div class="col-md-4 input-wrap">
                        <select class="form-control" name="ruleId"></select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-md-3 control-label">性别:</label>
                    <div class="col-md-4 input-wrap">
                        <select class="form-control" name="gender">
                            <option value="0">男</option>
                            <option value="1">女</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-md-3 control-label">是否为拓展员:</label>
                    <div class="col-md-4 input-wrap">
                        <select class="form-control" name="isExplorer">
                            <option value="0">非拓展员</option>
                            <option value="1">是拓展员</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
        <div class="expInfo">
            <div class="caption"> <b>拓展员详情</b>
            </div>
            <div class='form-horizontal' role='form'>
                <div class="form-group">
                    <label class="col-md-3 control-label">身份证号码:</label>
                    <div class="col-md-4 input-wrap">
                        <input type="text" class="form-control" name="cardNo" placeholder="将验证真实性"></div>
                </div>
                <div class="form-group" id="idCardFront">
                    <label class="col-md-3 control-label">身份证正面照片:</label>
                    <div class="col-md-4 upload-img"></div>
                </div>
                <div class="form-group" id="idCardBack">
                    <label class="col-md-3 control-label">身份证反面照片:</label>
                    <div class="col-md-4 upload-img"></div>
                </div>
                <div class="form-group" id="personWithIdCard">
                    <label class="col-md-3 control-label">手持身份证照片:</label>
                    <div class="col-md-4 upload-img"></div>
                </div>
                <div class="form-group" id="bankCard">
                    <label class="col-md-3 control-label">银行卡照片:</label>
                    <div class="col-md-4 upload-img"></div>
                </div>
            </div>
        </div>
        <div class="contact">
            <div class="caption">
                <b>联系方式</b>
            </div>
            <div class='form-horizontal' role='form'>
                <div class="form-group">
                    <label class="col-md-3 control-label">固定电话:</label>
                    <div class="col-md-4 input-wrap">
                        <input type="text" class="form-control" type="text" name="tel"></div>
                </div>
                <div class="form-group">
                    <label class="col-md-3 control-label">手机号码:</label>
                    <div class="col-md-4 input-wrap">
                        <input type="text" class="form-control" type="text" name="mobile"></div>
                </div>
                <div class="form-group verify-group" hidden>
                    <label class="col-md-3 control-label">&nbsp;</label>
                    <div class="col-md-4 input-wrap">
                        <button class="btn btn-sm btn-warning btn-verifyCode" disabled>获取验证码</button>
                    </div>
                </div>
                <div class="form-group verify-group" hidden>
                    <label class="col-md-3 control-label">验证码:</label>
                    <div class="col-md-4 input-wrap">
                        <input type="text" class="form-control" type="text" name="verifyCode"></div>
                </div>

                <div class="form-group">
                    <label class="col-md-3 control-label">邮箱:</label>
                    <div class="col-md-4 input-wrap">
                        <input type="text" class="form-control" type="text" name="email"></div>
                </div>
            </div>
        </div>
        <div class="account">
            <div class="caption">
                <b>银行账号信息</b>
            </div>
            <div class='form-horizontal' role='form'>
                <div class="form-group" style="display: none!important;">
                    <label class="col-md-3 control-label">是否填写帐号信息:</label>
                    <div class="col-md-4 input-wrap">
                        <select class="form-control" name="needAccount">
                            <option value="0">否</option>
                            <option value="1">是</option>
                        </select>
                    </div>
                </div>
                <div class="accountInfo">
                    <div class="form-group">
                        <label class="col-md-3 control-label">开户行:</label>
                        <div class="col-md-4 input-wrap">
                            <input type="text" class="form-control" type="text" name="bankInfo">
                            <a href="javascript:void(0);" class="check-bank">查看推荐银行</a>
                        </div>
                        <div class="col-md-5 input-wrap">
                            <span class="bank-dialog" style="color: #ff0000">*必须填写推荐的18家银行，否则将会影响到活动奖励到账</span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-3 control-label">账户名称:</label>
                        <div class="col-md-4 input-wrap">
                            <input type="text" class="form-control" type="text" name="accountName"></div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-3 control-label">银行帐号:</label>
                        <div class="col-md-4 input-wrap">
                            <input type="text" class="form-control" type="text" name="accountNo"></div>
                    </div>

                    <div class="form-group">
                        <label class="col-md-3 control-label">开户支行名称:</label>

                        <div class="col-md-2 input-wrap">
                            <select xdata-set='account' class="form-control" name="zbankProvince">
                                <option class="placeholder">-选择省-</option>
                            </select>
                        </div>
                        <div class="col-md-2 input-wrap">
                            <select xdata-set='account' class="form-control" name="zbankCity">
                                <option class="placeholder">-选择市-</option>
                            </select>
                        </div>
                        <div class="col-md-2 input-wrap">
                            <select data-set='account' class="form-control" name="zbankRegionCode">
                                <option class="placeholder">-选择区-</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-3 control-label">&nbsp;</label>
                        <div class="col-md-6 input-wrap">
                            <textarea data-set='account' class="zbank-input" name="zbankName" placeholder="输入关键词以搜索支行名称"  style="width: 100%"></textarea>
                            <input tabindex="999" data-set='account' name="zbankNo" class="float-hidden form-control" type="text"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>