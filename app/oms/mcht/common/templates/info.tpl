<div class="container body mcht-add-info">

    <div class="dropdown dropdown-switch">
        <button ref="B2" type="button" class="btn-switch dropdown-toggle" data-toggle="dropdown">
          <span class="text">普通商户</span>
          <i class="icon icon-angle-down"></i>
        </button>
        <ul class="dropdown-menu">
          <li><a href="#" value="B2">普通商户</a></li>
          <li><a href="#" value="B1">个体商户</a></li>
          <li><a href="#" value="D1">二维码商户</a></li>
          <li><a href="#" value="E1">好哒商户</a></li>
          <li><a href="#" value="C1">集团商户(总店)</a></li>
          <li><a href="#" value="C2">集团商户(门店)</a></li>
        </ul>
    </div>

    <form>

    <div class="form-horizontal margin-top-24">
        <div class="form-group" belong="B1,B2,D1,E1,C2,C1">
            <label class="col-md-1 control-label text-left nowrap">拓展员:</label>
            <div class="col-md-3">
                <input data-set="true" placeholder="输入拓展员名称" class="form-control" type="text" name="explorerName">
                <input tabindex="999" class="float-hidden" data-set='true' class="form-control" type="text" name="explorerId">
            </div>
        </div>
    </div>

    <!--<div class="form-horizontal margin-top-24 group_info" style="display: none;">-->
        <!--<div>-->
            <!--<label class="col-md-1 control-label text-left nowrap">商户级别:</label>-->
            <!--<div class="col-md-3">-->
                <!--<select class="form-control next-relative" name="mchtKind">-->
                    <!--<option value="">--请选择--</option>-->
                    <!--<option value="C2">门店</option>-->
                    <!--<option value="C1">总店</option>-->
                <!--</select>-->
            <!--</div>-->
        <!--</div>-->
    <!--</div>-->

    <div class="form-horizontal margin-top-24">
        <div class="form-group" belong="B1,B2,D1,E1,C2,C1">
            <label class="col-md-1 control-label text-left nowrap">特殊说明:</label>
            <div class="col-md-7">
                <textarea data-set="true" class="form-control" name="remark" maxlength="300" style="height: 32px;"></textarea>
                
            </div>
        </div>
    </div>

    <div class="sell_info base-section">
        <div class="caption">
            <b>经营信息</b>
        </div>
        <div class ='form-horizontal' role='form'>

            <!--<div class="form-group group_info" belong="C2" name="brand_suffix">-->
                <!--<label class="col-md-2 control-label">总店后缀:</label>-->
                <!--<div class="col-md-3">-->
                    <!--<input data-set='base' class="form-control" type="text" id="brand_kindSuffix" name="kindSuffix" disabled="disabled" />-->
                <!--</div>-->
            <!--</div>-->

            <div class="form-group" belong="B1,B2,D1,E1,C2,C1">
                <label class="col-md-2 control-label">商户名称:</label>
                <div class="col-md-4">
                <!-- 避免表单有同名字段，又要防止js逻辑出错，这里恶心的添加_name, js取值部分优先以_name为字段名 -->
                    <input data-set='base' class="form-control" type="text" name="mchtName"/>
                </div>

            </div>

            <!--<div class="form-group" belong="B1,B2,D1,E1,C2,C1">-->
                <!--<label class="col-md-2 control-label">商户简称:</label>-->
                <!--<div class="col-md-4">-->
                    <!--<input data-set='base' class="form-control" type="text" name="mchtNameSingle"/>-->
                <!--</div>-->

            <!--</div>-->

            <!--<div class="form-group" belong="B1,B2,D1,E1,C2,C1">-->
                <!--<label class="col-md-2 control-label">经营范围:</label>-->
                <!--<div class="col-md-4">-->
                    <!--<input data-set='base' class="form-control" type="text" name="busScope"/>-->
                <!--</div>-->

            <!--</div>-->

            <div class="form-group" belong="B1,B2,D1,E1,C2,C1">
                <label class="col-md-2 control-label">商户地址:</label>

                <div class="col-md-2">
                    <select id='sellProvince' value="省" xdata-set='base' class="form-control" name="province">
                        <option class="placeholder">-选择省-</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <select  xdata-set='base' class="form-control" name="city">
                        <option class="placeholder">-选择市-</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <select data-set='base' class="form-control" name="areaNo">
                        <option class="placeholder">-选择区-</option>
                    </select>
                </div>
            </div>

            <div class="form-group" belong="B1,B2,D1,E1,C2,C1">
                <label class="col-md-2 control-label">&nbsp;</label>
                <div class="col-md-5">
                    <input type="text" class="form-control"
                     data-set="base" name="address" placeholder="具体地址"/>
                </div>
            </div>

            <div class="form-group" belong="B2,C2,C1">
                <label class="col-md-2 control-label">联系电话:</label>
                <div class="col-md-4">
                    <input data-set='company' class="form-control" type="text" name="comTel" placeholder=""/>
                </div>
            </div>

            <!--
                // grpBudID: 不用传递
                // businessMcc:businessId: businssId
                // businessMcc:mcc: 这个值替换原mcc
                // group/mcc: 忽略
            -->

            <!--
                //[上面为旧规则：新规则是：
                        // grpBudID: 不用传递
                        // businessMcc:businessId: businssId
                        // mcc:mcc: 这个值替换原mcc
                        // group & mcc: 不忽略
                //]
            -->
            <div class="form-group" belong="B1,B2,D1,E1,C2,C1">
                <label class="col-md-2 control-label">经营范围:</label>
                <div class="col-md-5">
                    <select  class="form-control next-relative" name="grpBudID">
                    </select>
                </div>
            </div>

            <div class="form-group" belong="B1,B2,D1,E1,C2,C1">
                <div class="col-md-2 control-label">&nbsp;</div>
                <div class="col-md-5">
                    <select  class="form-control next-relative" name="businessId">
                        <option> </option>
                    </select>
                </div>
            </div>

            <div class="form-group" belong="B1,B2,D1,E1,C2,C1">
                <label class="col-md-2 control-label">MCC:</label>
                <div class="col-md-5">
                    <select data-set='base' class="form-control next-relative" name="group">
                    </select>
                </div>
            </div>

            <div class="form-group" belong="B1,B2,D1,E1,C2,C1">
                <div class="col-md-2 control-label">&nbsp;</div>
                <div class="col-md-5">
                    <select data-set='base' class="form-control next-relative" name="mcc">
                        <option> </option>
                    </select>
                </div>
            </div>

            <div class="form-group" belong="B2,C2,C1">
                <label class="col-md-2 control-label">经济类型:</label>
                <div class="col-md-5">
                    <select data-set='company' class="form-control next-relative" name="attr">
                    </select>
                </div>
            </div>

            <div class="form-group" belong="B2,C2,C1">
                <label class="col-md-2 control-label">证照属性:</label>
                <div class="col-md-5">
                    <select data-set='company' class="form-control next-relative" name="certFlag">
                        <option value="1">三证三码</option>
                        <option value="2">一证一码</option>
                        <option value="3">一证三码</option>
                    </select>
                </div>
            </div>

            <div class="form-group" belong="B2,C2,C1,D1" name="div_licNo">
                <label class="col-md-2 control-label">营业执照注册号:</label>
                <div class="col-md-3">
                    <input data-set='company' class="form-control" type="text"  name="licNo"/>
                </div>
            </div>

                <div class="form-group" belong="B1,B2,D1,E1,C2,C1" name="div_orgCode">
                <label class="col-md-2 control-label">组织机构代码:</label>
                <div class="col-md-3">

                    <input data-set='company' class="form-control" type="text"  name="orgCode"/>
                </div>
            </div>

            <div class="form-group" belong="B2,C2,C1" name="div_taxNo">
                <label class="col-md-2 control-label">税务登记号:</label>
                <div class="col-md-3">

                    <input data-set='company' class="form-control" type="text"  name="taxNo"/>
                </div>
            </div>

        </div>
    </div>

    <div class="law_info user-section">
        <div class="caption"> 
            <b>法定代表信息</b>
        </div>
        <div class="form-horizontal">
            <div class="form-group checkbox" name="div_aloneUser" belong="C2" style="margin-bottom: 10px;" disabled="disabled">
                <label style="width: 320px; padding-left: 144px;">
                    <input name="aloneUser" type="checkbox" class="ace" disabled="disabled">
                    <span class="lbl"> 非独立法人</span><span id="warn_aloneUser" style="color: #ff0000; padding-left: 10px;">(勾选此项，系统将默认法人信息为总店法人信息)</span>
                </label>
            </div>

            <div class="form-group" belong="B1,B2,D1,E1,C2,C1">
                <label class="col-md-2 control-label">（法人/个人）姓名:</label>
                <div class="col-md-2">
                    <input data-set='user' class="form-control" type="text" name="userName" />
                </div>
            </div>

            <div class="form-group" belong="B1,B2,D1,E1,C2,C1">
                <label class="col-md-2 control-label">手机号码:</label>
                <div class="col-md-3">
                    <input data-set='user' class="form-control" type="text"  name="userPhone"/>
                </div>
            </div>

            <div class="form-group" belong="B1,B2,D1,E1,C2,C1">
                <label class="col-md-2 control-label">身份证号:</label>
                <div class="col-md-4">
                    <input data-set='user' class="form-control" maxlength="18" type="text" name="userCardNo" placeholder='证件号码'/> 
                </div>
            </div>

            <div class="form-group" belong="B1,B2,D1,E1,C2,C1">
                <label class="col-md-2 control-label">电子邮箱:</label>
                <div class="col-md-4">
                    <input data-set='user' class="form-control" type="text"  name="userEmail"/>
                </div>
            </div>

        </div>

    </div>

    <!--<div class="form-group group-section group_info" name="user_suffix" belong="C1">-->
        <!--<div class="caption">-->
            <!--<b>登陆账号</b>-->
        <!--</div>-->
        <!--<div class="user_suffix_explain">-->
            <!--帐号后缀将作为总店的唯一标识，该集团内的所有帐号全都以其为后缀，例如将『九毛九』总店的帐号后缀设置为9mao9时，集团管理员的帐号则为admin@9mao9。-->
        <!--</div>-->
        <!--<div class="form-horizontal">-->
            <!--<div class="form-group" belong="C1">-->
                <!--<label class="col-md-2 control-label">账号后缀:</label>-->
                <!--<div class="col-md-3">-->
                    <!--<input type="text" id="user_kindSuffix" name="kindSuffix" />-->
                <!--</div>-->
            <!--</div>-->
        <!--</div>-->
    <!--</div>-->

    <!--<div class="form-group group-section group_info" name="user_login" belong="C2">-->
        <!--<div class="caption">-->
            <!--<b>管理员账号</b>-->
        <!--</div>-->
        <!--<div class="user_suffix_explain">-->
            <!--管理员账号由所填前缀＋@＋后缀组成，例如：盒子支付的门店前缀为 HZZF,登陆账号则为HZZF@iboxpay。-->
        <!--</div>-->
        <!--<div class="form-horizontal">-->
            <!--<div class="form-group" belong="C2">-->
                <!--<label class="col-md-2 control-label">管理员账号:</label>-->
                <!--<div class="col-md-5">-->
                    <!--<input type="text" name="userLogin" maxlength="20" required="true" />&nbsp;<font name="userLogin_suffix"></font>-->
                <!--</div>-->
            <!--</div>-->
        <!--</div>-->
    <!--</div>-->

    <div class="form-group clearing clear-section" belong="B1,B2,C2,C1">
        <div class="caption">
            <b>清算信息</b>
        </div>
        <div class="form-horizontal">

            <div class="form-group" belong="B1,B2,C2,C1">
                <label class="col-md-2 control-label">商户费率:</label>
                <div class="col-md-4">
                    <div hidden>
                        <label>
                            <input data-set value="indirect" type="radio" name="category" checked>
                            间联
                        </label>
                        <label>
                            <input data-set value="direct" type="radio" name="category">
                            直联
                        </label>
                    </div>
                    <!-- <select data-set='base' class="form-control next-relative" name="tNDiscId"></select> -->
                    <input data-set='base' class="form-control next-relative" name="tNDiscId">
                </div>
                <div class="col-md-2 alert alert-info mchtType-group" role="alert" style="text-align: center; height: 30px; line-height: 0; display: none;">
                    <strong>直联商户</strong>
                </div>
            </div>

            <div class="form-group" belong="B1,B2,C2,C1">
                <label class="col-md-2 control-label">结算周期:</label>
                <div class="col-md-4">
                    <select data-set='base' class="form-control next-relative" name="discCycle">
                        <option>-选择结算周期-</option>
                    </select>
                </div>
            </div>

            <div class="form-group hide-important" belong="B1,B2,C2,C1">
                <label class="col-md-2 control-label">T+0费率模型:</label>
                <div class="col-md-4">
                    <select disabled="disabled" data-set='base' class="form-control next-relative" name="tZeroDiscId">
                    </select>
                </div>
            </div>

        </div>
    </div>

    <div class="account account-section">
        <div class="caption">
            <b>收款账户</b>
        </div>
        <div class="form-horizontal">
        <div name="div_discThis" class="form-group checkbox" belong="C2">
            <label style="width: 320px; padding-left: 144px;">
                <input data-set='account' name="discThis" type="checkbox" class="ace" disabled="disabled">
                <span class="lbl"> 是否清算给上级</span>
            </label>
        </div>
        <div class="form-group account-proxy-type checkbox" belong="B1,B2,D1,E1,C2,C1" style="margin-bottom: 10px;">
            <label style="width: 320px; padding-left: 144px;">
                <input data-set='account' name="accountProxy" type="checkbox" class="ace">
                <span class="lbl"> 委托他人收款</span>
            </label>
            <span class="delegate-fieldset" style="margin-left:10px;" hidden>
                <label><input checked="checked" data-set='account' type="radio" value="0" name="_accountProxyType">对公</label>
                <label><input style="margin-left:10px;" data-set='account' type="radio" value="1" name="_accountProxyType">对私</label>
            </span>
        </div>

        <div class="form-group" belong="" style="display: none;"><!--belong="B1,B2,D1,E1,C2,C1"-->
            <label class="col-md-2 control-label">开户支行号:</label>
            <div class="col-md-4 not-delegate-fieldset">
                <label name="zbankNo_noHidden"></label>
            </div>
        </div>

        <div class="form-group" belong="B1,B2,D1,E1,C2,C1">
            <label class="col-md-2 control-label">开户名:</label>
            <div class="col-md-4 not-delegate-fieldset">
                <select xdata-set='account' class="form-control" name="accountName"></select>
                <div class="form-control display-account-name"></div>
            </div>
            <div class="col-md-4 delegate-fieldset" hidden>
            <!-- 委托清算的账户 账户名 -->
                <input  class="form-control" type="text" name="_accountProxyName">
            </div>
            <div class="col-md-2 alert alert-info mchtType-group" role="alert" style="text-align: center; height: 30px; line-height: 0; display: none;">
                <strong>直联商户</strong>
            </div>
        </div>

        <div class="form-group bank-infos-group" belong="">
            <label class="col-md-2 control-label">开户行:</label>
            <div class="col-md-4">
                <input type="text" class="form-control" name="bankInfos">
            </div>
        </div>

        <div class="form-group" belong="B1,B2,D1,E1,C2,C1">
            <label class="col-md-2 control-label">账户号（卡号）:</label>
            <input tabindex="999" class="float-hidden" data-set='account' class="form-control" type="text" name="bankNo">
            <input tabindex="999" class="float-hidden" data-set='account' class="form-control" type="text" name="bankName">

            <div class="account-private">
                <div class="col-md-4">
                    <input class="form-control" type="text" maxlength="28" name="accountNo" placeholder="这个是卡号">
                </div>
                <div class='bank-logo-place'>
                </div>
            </div>


            <div class="account-public">
                <div class="col-md-4">
                    <input class="form-control" type="text" maxlength="28" name="accountNoPublic" placeholder="这个是账号">
                </div>
            </div>

        </div>

        <div class="form-group" belong="B1,B2,D1,E1,C2,C1">
            <label class="col-md-2 control-label">开户支行名称:</label>

            <div class="col-md-2">
                <select xdata-set='account' class="form-control" name="zbankProvince">
                    <option class="placeholder">-选择省-</option>
                </select>
            </div>
            <div class="col-md-2">
                <select xdata-set='account' class="form-control" name="zbankCity">
                    <option class="placeholder">-选择市-</option>
                </select>
            </div>
            <div class="col-md-2">
                <select data-set='account' class="form-control" name="zbankRegionCode">
                    <option class="placeholder">-选择区-</option>
                </select>
            </div>
        </div>

        <div class="form-group" belong="B1,B2,D1,E1,C2,C1">
            <label class="col-md-2 control-label">&nbsp;</label>
            <div class="col-md-6">
         <!--        <select data-set='account' name="zbankNo" multiple="" style="width: 100%">
                </select> -->
                <textarea data-set='account' class="zbank-input" name="zbankName" placeholder="输入支行名称"  style="width: 100%"></textarea>
                <input tabindex="999" data-set='account' name="zbankNo" class="float-hidden form-control" type="text"/>

            </div>
        </div>

    </div>
    </div>

    </form>

</div><!--container body  -->