<form role="form" id="submit-data">
    <div class="form-section">


        <div class="section" belong="B1,B2">

            <div class="caption">收银员</div>

            <div class="hx-bottom-margin15">
                <div class="hx-top-margin20">
                    <p>除了申请人和法人代表以外，还能添加多名收银员。收银员用手机号码登录后即可显示POS机收款，所有款项将结算到申请人的收款账户。</p>
                </div>
            </div>

            <div id="add-more-receipt-person" class="hx-bottom-margin15"></div>
            <div class="hx-bottom-margin15">
                <span class="append-trigger append-receipt-user" trigger-name="receipt_person" trigger-type="append">
                    <i class="icon-plus green"></i>
                    <label isneed="1" name="receipt_person">添加收银员</label>
                </span>
            </div>


        </div>
        
<!--         <div class="section pos-section" belong="B1,B2,C2,C1">
            <div class="caption">POS机</div>

            <div class="hx-top-margin20 hx-bottom-margin15">
                <p>绑定POS机后，该商户属下的所有收银员都能使用该POS机收款</p>
            </div>

            <div class="hx-bottom-margin15"> 
                <span class="append-trigger" trigger-name="pos_machine">
                    <i class="icon-plus green"></i>
                    <label isneed="1" name="pos_machine">添加POS机</label>
                </span>
            </div>

            <div id="add-more-pos-machine" class="hx-bottom-margin35"></div>
        </div> -->

        <div class="section" belong="B1,B2,C2,C1">
            <div class="caption">上传照片</div>
            <div class="form-group hx-top-margin20">
                <span class="add-img-tirgger">
                    <i class="icon-plus green"></i>
                    <label isneed="1" name="add_photo">补充照片</label>
                </span>
                <span class="extra-img-remark"> (最多10张) </span>
            </div>
            <div class="imgs-preview row hx-bottom-margin35"></div>
        </div>

        <div class="section">
            <div class="caption hx-bottom-margin15">经营信息</div>

            <div id="add-more-user-message">

                <div class="form-group append-trigger-wrap hx-top-margin20" label="商家名称的中文简称"  belong="B1,B2,C2,C1">
                    <span class="toggle-append-trigger">
                        <i class="icon-plus green"></i>
                        <label isneed="1" name="mchtCnShortName">补充商家名称的中文简称</label>
                    </span>
                </div>

                <div class="form-group append-trigger-wrap hx-top-margin20" label="商家的英文名称"  belong="B1,B2,C2,C1">
                    <span class="toggle-append-trigger">
                        <i class="icon-plus green"></i>
                        <label isneed="1" name="mchtEnName">补充商家的英文名称</label>
                    </span>
                </div>

                <div class="form-group append-trigger-wrap hx-top-margin20" label="公司地址的邮政编码"  belong="B2,C2,C1">
                    <span class="toggle-append-trigger">
                        <i class="icon-plus green"></i>
                        <label isneed="1" name="postcode">补充公司地址的邮政编码</label>
                    </span>
                </div>

                <div class="form-group append-trigger-wrap hx-top-margin20" label="公司的传真号码" belong="B2,C2,C1">
                    <span class="toggle-append-trigger">
                        <i class="icon-plus green"></i>
                        <label isneed="1" name="fax">补充公司的传真号码</label>
                    </span>
                </div>

                <div class="form-group append-trigger-wrap hx-top-margin20" label="公司的电子邮箱" belong="B2,C2,C1">
                    <span class="toggle-append-trigger">
                        <i class="icon-plus green"></i>
                        <label isneed="1" name="comEmail">补充公司的电子邮箱</label>
                    </span>
                </div>

                <div class="form-group append-trigger-wrap hx-top-margin20" label="公司的网址" belong="B2,C2,C1">
                    <span class="toggle-append-trigger">
                        <i class="icon-plus green"></i>
                        <label isneed="1" name="website">补充公司的网址</label>
                    </span>
                </div>

                <div class="form-group append-trigger-wrap hx-top-margin20" label="经营时间" belong="B2,C2,C1">
                    <span class="toggle-append-trigger">
                        <i class="icon-plus green"></i>
                        <label isneed="1" name="manageTime">补充经营时间</label>
                    </span>
                </div>

                <div class="form-group append-trigger-wrap hx-top-margin20" label="注册资金" belong="B2,C2,C1">
                    <span class="toggle-append-trigger">
                        <i class="icon-plus green"></i>
                        <label isneed="1" name="amount">补充注册资金</label>
                    </span>
                </div>

            </div>
        </div><!-- ef section -->

        <div class="section" belong="B1,B2,C2,C1">
            <div class="caption hx-bottom-margin15">法人代表</div>

            <div id="add-more-cont">
<!--                 <div class="form-group append-trigger-wrap hx-top-margin20" label="电子邮箱">
                    <span class="toggle-append-trigger">
                        <i class="icon-plus green"></i>
                        <label isneed="1" name="userEmail">电子邮箱</label>
                    </span>
                </div> -->
                <div class="form-group append-trigger-wrap hx-top-margin20" label="紧急联系人">
                    <span class="toggle-append-trigger">
                        <i class="icon-plus green"></i>
                        <label isneed="1" name="cont">紧急联系人</label>
                    </span>
                </div>
            </div>
        </div>

        <a class="clearfix"></a>
    </div>
</form>