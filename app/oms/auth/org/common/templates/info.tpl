
<div class="container body brh-add-info">
    <form>
        <div class="sys-info info-section">
            <div class="caption">
                <b>系统消息</b>
            </div>
            <div class ='form-horizontal' role='form'>

                <div class="form-group">
                    <label class="col-md-2 control-label">管理员登录帐号:</label>
                    <div class="col-md-3 input-wrap">
                        <input data-set='sys' class="form-control" type="text" name="loginName"/>
                    </div>
                    <label class="col-md-7 dec-label">用于登录新建的机构，初始密码为法人代表的手机号码后6位。</label>
                </div>

            </div>
        </div>

        <div class="law-info info-section">
            <div class="caption">
                <b>法人代表信息</b>
            </div>
            <div class="form-horizontal">

                <div class="form-group">
                    <label class="col-md-2 control-label">真实姓名:</label>
                    <div class="col-md-2 input-wrap">
                        <input data-set='user' class="form-control next-relative" type="text" name="name" />
                    </div>
                </div>

                <div class="form-group">
                    <label class="col-md-2 control-label">身份证号码:</label>
                    <div class="col-md-3 input-wrap">
                        <input data-set='user' class="form-control next-relative" type="text"  name="cardNo"/>
                    </div>
                    <label class="col-md-7 dec-label">将连接征信系统验证真实性。</label>
                </div>

                <div class="form-group">
                    <label class="col-md-2 control-label">身份证有效期:</label>
                    <div class="col-md-2 input-wrap">
                        <input data-set='user' class="form-control next-relative" type="text" name="cardEndDate"/>
                    </div>
                </div>

                <div class="form-group">
                    <label class="col-md-2 control-label">手机号码:</label>
                    <div class="col-md-3 input-wrap">
                        <input data-set='user' class="form-control" type="text"  name="mobile"/>
                    </div>
                    <label class="col-md-7 dec-label">可用于登录新建的机构，以及在忘记密码时找回密码。</label>
                </div>

                <div class="form-group verify-group" hidden>
                    <label class="col-md-2 control-label">&nbsp;</label>
                    <div class="col-md-4 input-wrap">
                        <button class="btn btn-sm btn-warning btn-verifyCode" disabled>获取验证码</button>
                    </div>
                </div>
                <div class="form-group verify-group" hidden>
                    <label class="col-md-2 control-label">验证码:</label>
                    <div class="col-md-2 input-wrap">
                        <input type="text" class="form-control" type="text" name="verifyCode"></div>
                </div>


            </div>

        </div>

        <div class="brh-info info-section">
            <div class="caption">
                <b>机构信息</b>
            </div>
            <div class="form-horizontal">

                <div class="form-group">
                    <label class="col-md-2 control-label">机构名称:</label>
                    <div class="col-md-4 input-wrap">
                        <input type="text" data-set='brh' placeholder="一般为注册公司名字" class="form-control next-relative placeholder" name="brhName">
                    </div>
                </div>

                <div class="form-group">
                    <label class="col-md-2 control-label">机构备注名:</label>
                    <div class="col-md-4 input-wrap">
                        <input type="text" data-set='brh' class="form-control next-relative placeholder" name="brhNickName" placeholder="如“广州市代”">
                    </div>
                </div>

                <div class="form-group" hidden>
                    <label class="col-md-2 control-label">机构类型:</label>
                    <div class="col-md-1 input-wrap">
                        <select value="1" data-set='brh' class="form-control next-relative" name="brhType">
                            <option value="1"> 省代 </option>
                            <option value="2"> 市代 </option>
                            <option value="0"> 其他 </option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label class="col-md-2 control-label">机构地址:</label>

                    <div class="col-md-2 input-wrap">
                        <select id='sellProvince' value="省" data-set='brh' class="form-control" name="brhProvince">
                            <option class="placeholder">-选择省-</option>
                        </select>
                    </div>
                    <div class="col-md-2 input-wrap">
                        <select  data-set='brh' class="form-control" name="brhCity">
                            <option class="placeholder">-选择市-</option>
                        </select>
                    </div>
                    <div class="col-md-2 input-wrap">
                        <select data-set='brh' class="form-control" name="brhRegionCode">
                            <option class="placeholder">-选择区-</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label class="col-md-2 control-label">&nbsp;</label>
                    <div class="col-md-5 input-wrap">
                        <input type="text" class="form-control placeholder next-relative"
                               data-set="brh" name="brhAddress" placeholder="具体地址"/>
                    </div>
                </div>

                <div class="form-group">
                    <label class="col-md-2 control-label">紧急联系人:</label>
                    <div class="col-md-3 input-wrap">
                        <input data-set='brh' class="form-control" type="text"  name="urgentContactName"/>
                    </div>
                </div>

                <div class="form-group" style="margin-bottom: 24px">
                    <label class="col-md-2 control-label tel-label">紧急联系电话:</label>
                    <div class="col-md-3 tel-wrap input-wrap">
                        <input type="text" data-set='brh' class="form-control" name="brhTel">
                        <!--                     <input type="text" data-set='brh' class="form-control placeholder inline-position" placeholder="区号" name="brhTel-pre">
                                            <label class="inline-position">-</label>
                                            <input type="text" data-set='brh' class="form-control inline-position" name="brhTel-after"> -->
                    </div>
                </div>

                <div class="form-group">
                    <label class="col-md-2 control-label">合作有效期:</label>
                    <div class="col-md-3 input-wrap">
                        <input data-set='brh' class="form-control" type="text"  name="agencyEnd"/>
                    </div>
                    <label class="col-md-7 dec-label">永久合作不需要填写。</label>
                </div>

                <div class="form-group">
                    <label class="col-md-2 control-label lic-label">营业执照号<span class="toggle-label brh-type-toggle">(选填)</span>:</label>
                    <div class="col-md-3 input-wrap">
                        <input data-set='brh' class="form-control next-relative" type="text"  name="licNo"/>
                    </div>
                    <label class="col-md-7 dec-label">将连接征信系统验证真实性。</label>
                </div>

                <div class="form-group">
                    <label class="col-md-2 control-label">税务登记号<span class="toggle-label">(选填)</span>:</label>
                    <div class="col-md-3 input-wrap">
                        <input data-set='brh' class="form-control" type="text"  name="taxNo"/>
                    </div>
                </div>

            </div>
        </div>

       <!-- <div class="disc-info info-section" hidden>
            <div class="caption">
                <b>机构可用模型</b>
            </div>
            <div class="form-horizontal">
                <div class="form-group">
                    <label class="col-md-2 control-label">直联费率模型:</label>
                    <div class="col-md-10 input-wrap dir">
                        <label class="col-md-4 checkbox-label">
                            <input class="disc-checkbox" type="checkbox" name="DirMcc">
                            直联商户费率
                        </label>
                        <label class="col-md-4 checkbox-label">
                            <input class="disc-checkbox" type="checkbox" name="DirMccCanHighSign">
                            直联商户费率可高签
                        </label>
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-md-2 control-label">间联费率模型:</label>
                    <div class="col-md-10 input-wrap indir">
                        <label class="col-md-4 checkbox-label">
                            <input class="disc-checkbox" type="checkbox" name="IndirMcc">
                            间联MCC计费模型
                        </label>
                        <label class="col-md-4 checkbox-label">
                            <input class="disc-checkbox" type="checkbox" name="IndirUnionSettle">
                            间联统一结算扣率
                        </label>
                        <label class="col-md-4 checkbox-label">
                            <input class="disc-checkbox" type="checkbox" name="IndirNoneBaseRate">
                            无基准费率模型
                        </label>
                        <label class="col-md-4 checkbox-label">
                            <input class="disc-checkbox" type="checkbox" name="IndirSignToSettle">
                            签约扣率对应结算扣率
                        </label>
                        <label class="col-md-4 checkbox-label">
                            <input class="disc-checkbox" type="checkbox" name="IndirSettleRateMonthlyChange">
                            间联月交易额结算扣率
                        </label>
                        <label class="col-md-4 checkbox-label">
                            <input class="disc-checkbox" type="checkbox" name="IndirMccMonthlyRate">
                            MCC月交易额结算扣率
                        </label>
                    </div>
                </div>

            </div>

        </div>-->

        <div class="contract-info info-section">
            <div class="caption">
                <b>合同存档<span class="toggle-label brh-type-toggle" style="color: #025D9C!important">(选填)</span></b>
            </div>

            <div class ='form-horizontal' role='form'>
                <div class="form-group">
                    <label class="col-md-2 control-label">合同编号:</label>
                    <div class="col-md-2 input-wrap">
                        <input data-set='contract' class="form-control next-relative" type="text" name="contractCode"/>
                    </div>
                    <label class="col-md-8 dec-label">必须与合同首页的编号一致。</label>
                </div>
            </div>

            <div class ='form-horizontal' role='form'>
                <div class="form-group">
                    <label class="col-md-2 control-label">合同扫描件:</label>
                    <div class="col-md-6 input-wrap btn-upload-file">
                        <!-- <div data-set='contract' class="btn-upload btn-upload-file" name="contractFile">上传文件</div> -->
                        <!-- <span class="add-img-tirgger 10086">
                            <div data-set="img" class="btn-upload btn-upload-img" name="extraImg">上传图片</div>
                        </span> -->
                    </div>
                </div>
            </div>

        </div>

        <div class="profit-info info-section" hidden>
            <div class="caption">
                <b>分润方案</b>
            </div>

            <div class ='form-horizontal' role='form'>
                <div class="form-group">
                    <label class="col-md-2 control-label">是否参与分润:</label>
                    <div class="col-md-4">
                    <span class="delegate-fieldset">
                            <label><input name="isJoinProfit" data-set='profit' type="radio" value="1" checked="checked"> 参与分润</label>
                            <label><input name="isJoinProfit" style="margin-left:10px;" data-set='profit' type="radio" value="0"> 不参与分润</label>
                        </span>
                    </div>
                </div>
            </div>

            <div class ='form-horizontal' role='form'>
                <div class="form-group">
                    <label class="col-md-2 control-label">分润方案:</label>
                    <div class="col-md-4 input-wrap">
                        <select data-set='profit' class="form-control next-relative" name="profitPlan"></select>
                    </div>
                </div>
            </div>

        </div>

    <div class="accounts-info info-section">
        <div class="caption">
            <b>收款账户</b>
        </div>
        <div class="form-horizontal">
            <!-- 对私账号 -->
            <div class="paccount-info" hidden>
                <div class="caption" style="margin-left: 2em;">
                    <b>管理员账户</b>
                </div>
                <div class="form-group">
                    <label class="col-md-2 control-label">开户名:</label>
                    <div class="col-md-4 not-delegate-fieldset input-wrap">
                        <input type="text" class="form-control next-relative" name="paccountName" disabled />
                    </div>
                </div>

                <div class="form-group pbank-infos-group">
                    <label class="col-md-2 control-label">开户行:</label>
                    <div class="col-md-4 input-wrap">
                        <input type="text" class="form-control next-relative" name="pbankInfos" />
                        <a href="javascript:void(0);" class="check-bank">查看推荐银行</a>
                    </div>
                    <div class="col-md-6 input-wrap">
                        <span class="bank-dialog" style="color: #ff0000">*必须填写推荐的18家银行，否则将会影响到活动奖励到账</span>
                    </div>
                </div>

                <div class="form-group" belong="B1,B2">
                    <label class="col-md-2 control-label">账户号（卡号）:</label>
                    <input tabindex="999" class="float-hidden" data-set='account' type="text" name="pbankNo" />
                    <input tabindex="999" class="float-hidden" data-set='account' type="text" name="pbankName" />
                    <div class="col-md-4 input-wrap">
                        <input class="form-control next-relative" type="text" maxlength="28" name="paccountNo" placeholder="请输入卡号">
                    </div>
                    <div class='pbank-logo-place'></div>
                </div>

                <div class="form-group">
                    <label class="col-md-2 control-label">开户支行名称:</label>

                    <div class="col-md-2 input-wrap">
                        <select xdata-set='account' class="form-control" name="pzbankProvince">
                            <option class="placeholder">-选择省-</option>
                        </select>
                    </div>
                    <div class="col-md-2 input-wrap">
                        <select xdata-set='account' class="form-control" name="pzbankCity">
                            <option class="placeholder">-选择市-</option>
                        </select>
                    </div>
                    <div class="col-md-2 input-wrap">
                        <select data-set='account' class="form-control" name="pzbankRegionCode">
                            <option class="placeholder">-选择区-</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label class="col-md-2 control-label">&nbsp;</label>
                    <div class="col-md-6 input-wrap">
                        <textarea data-set='account' class="zbank-input" name="pzbankName" placeholder="输入关键词以搜索支行名称"  style="width: 100%"></textarea>
                        <input tabindex="999" data-set='account' name="pzbankNo" class="float-hidden form-control" type="text"/>
                    </div>
                </div>

                <div class="caption" style="margin-left: 2em;">
                    <b>对公账户</b>
                </div>
            </div>

            <!-- 对公账号 -->
            <div class="form-group">
                <label class="col-md-2 control-label">是否提供对公账户:</label>
                <div class="col-md-4">
                    <span class="delegate-fieldset">
                        <label><input type="radio" checked="checked" value="1" name="needAccount"> 提供</label>
                        <label><input style="margin-left:10px;" type="radio" value="0" name="needAccount"> 不提供</label>
                    </span>
                    </div>
                </div>

                <div class="account-info">
                    <div class="form-group">
                        <label class="col-md-2 control-label">开户名:</label>
                        <div class="col-md-4 not-delegate-fieldset input-wrap">
                            <select xdata-set='account' class="form-control next-relative" name="accountName"></select>
                        </div>
                    </div>

                    <div class="form-group bank-infos-group">
                        <label class="col-md-2 control-label">开户行:</label>
                        <div class="col-md-4 input-wrap">
                            <input type="text" class="form-control next-relative" name="bankInfos">
                        </div>
                    </div>

                    <div class="form-group" belong="B1,B2">
                        <label class="col-md-2 control-label">账户号（卡号）:</label>
                        <input tabindex="999" class="float-hidden" data-set='account' class="form-control" type="text" name="bankNo">
                        <input tabindex="999" class="float-hidden" data-set='account' class="form-control" type="text" name="bankName">

                        <div class="account-private">
                            <div class="col-md-4 input-wrap">
                                <input class="form-control next-relative" type="text" maxlength="28" name="accountNo" placeholder="这个是卡号">
                            </div>
                            <div class='bank-logo-place'></div>
                        </div>


                        <div class="account-public">
                            <div class="col-md-4 input-wrap">
                                <input class="form-control next-relative" type="text" maxlength="28" name="accountNoPublic" placeholder="这个是账号">
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-md-2 control-label">开户支行名称:</label>

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
                        <label class="col-md-2 control-label">&nbsp;</label>
                        <div class="col-md-6 input-wrap">
                            <textarea data-set='account' class="zbank-input" name="zbankName" placeholder="输入关键词以搜索支行名称"  style="width: 100%"></textarea>
                            <input tabindex="999" data-set='account' name="zbankNo" class="float-hidden form-control" type="text"/>

                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="img-info info-section">
            <div class="caption">
                <b>补充照片(可选)</b>
            </div>

            <div class ='form-horizontal' role='form'>
                <div class="form-group">
                    <label class="col-xs-2 control-label">上传图片:</label>
                    <div class="col-xs-4 input-wrap">
                    <span class="add-img-tirgger">
                        <!-- <i class="icon-plus green"></i> -->
                        <div data-set="img" class="btn-upload btn-upload-img">上传图片</div>
                        <!-- <label isneed="1" name="add_photo">补充照片</label> -->
                    </span>
                    </div>
                </div>

                <div class="form-group">
                    <label class="col-md-2">&nbsp;</label>
                    <div class="col-md-10 imgs-preview row hx-bottom-margin35"></div>
                </div>
            </div>

        </div>

        <div class="recommend-info info-section" style="display: none;">
            <div class="caption">
                <b>推荐人信息(可选)</b>
            </div>
            <div class="form-group">
                <label class="col-md-2 control-label">推荐人手机号：</label>
                <div class="col-md-3 input-wrap">
                    <input data-set='brh' class="form-control" type="text" name="phoneNo" />
                </div>
                <label class="hd-info-icon-ok" style="visibility:hidden;"><i class="icon-ok green" style="padding: 9px;"/></label>
            </div>
            <div class="form-group">
                <label class="col-md-2 control-label">代理商名称：</label>
                <div class="col-md-3 input-wrap" name="div-brhName">
                    <input data-set='brh' class="form-control" type="text"  name="info_brhName" readonly="readonly" brhNo="" oprId="" />
                    <span name="help-error-brhName" for="info_brhName" class="help-error help-block" style="display: none;">没有一级代理商关联该手机号</span>
                </div>
            </div>
        </div>

        <!-- <div class="section" belong="B1,B2">
            <div class="caption">上传照片</div>
            <div class="form-group hx-top-margin20">
            </div>
        </div> -->

    </form>

</div><!--container body  -->