<form role="form" id="submit-data">
    <div class="form-section">
        <div class="section receipt-section" belong="B1,B2,D1,E1" style="display: block;">
            <div class="caption">收银员</div>
            <div class="hx-bottom-margin15">
                <div class="hx-top-margin20 prompt-block">
                    <p>除了申请人和法人代表以外，还能添加多名收银员。收银员员用手机号码登录后即可显示POS机收款，所有款项将结算到申请人的收款账户。</p>
                </div>
            </div>

            <div id="add-more-receipt-person" class="hx-bottom-margin15">
            <!-- TODO -->

            </div>

        </div>
        <br>
        <div class="section pos-section" belong="B1,B2,D1,E1" style="display: block;">
            <div class="caption">POS机</div>
            <div class="prompt-block hx-top-margin20 hx-bottom-margin15">
                <p>绑定POS机后，该商户属下的所有收银员都能使用该POS机收款</p>
            </div>

            <div id="add-more-pos-machine" class="hx-bottom-margin35">
                <!-- TODO -->
            </div>
        </div>

        <div class="section img-section" belong="B1,B2,D1,E1,C2,C1" style="display: block;">
            <div class="caption">上传照片</div>
            <div class="hx-top-margin20 prompt-block">
                <span class="add-img-tirgger">
                    <i class="icon-plus green"></i>
                    <label isneed="1" name="add_photo">补充照片</label>
                </span>
                <span class="extra-img-remark"> (最多10张) </span>
            </div>
            <div class="imgs-preview row hx-bottom-margin35">
<!--                 <div class="col-xs-3 img-wrap">
                    <i class="icon icon-remove"></i>
                    <img src="upload/temporary/images/bf309fe3-4dcb-4381-a8c9-10ee16ee069a/extra1395897441698.png">
                </div> -->
            </div>
        </div>
        
        <div class="section base-section">
            <div class="caption hx-bottom-margin15">经营信息</div>
            <div id="add-more-user-message">
                <div class="row form-group " belong="B1,B2,D1,E1,C2,C1">
                    <div class="label-left-boxb col-xs-2">
                        <label>商家名称的中文简称</label>
                    </div>
                    <div class="label-right-boxb col-xs-6">
                        <input type="text" name="mchtCnShortName" class="form-control" placeholder="补充补充商家名称的中文简称"></div>
                    <div class="col-xs-4 label-text-style">
<!--                         <label isneed="1" class="cancel-toggle-append-trigger" name="delete_format_div">取消</label>
 -->                    </div>
                </div>
                <div class="row form-group " belong="B1,B2,D1,E1,C2,C1">
                    <div class="label-left-boxb col-xs-2">
                        <label>商家的英文名称</label>
                    </div>
                    <div class="label-right-boxb col-xs-6">
                        <input type="text" name="mchtEnName" class="form-control" placeholder="补充补充商家的英文名称"></div>
                    <div class="col-xs-4 label-text-style">
<!--                         <label isneed="1" class="cancel-toggle-append-trigger" name="delete_format_div">取消</label>
 -->                    </div>
                </div>
                <div class="row form-group " belong="B2,C2,C1">
                    <div class="label-left-boxb col-xs-2">
                        <label>公司地址的邮政编码</label>
                    </div>
                    <div class="label-right-boxb col-xs-6">
                        <input type="text" name="postcode" class="form-control" placeholder="补充补充公司地址的邮政编码"></div>
                    <div class="col-xs-4 label-text-style">
<!--                         <label isneed="1" class="cancel-toggle-append-trigger" name="delete_format_div">取消</label>
 -->                    </div>
                </div>
                <div class="row form-group " belong="B2,C2,C1">
                    <div class="label-left-boxb col-xs-2">
                        <label>公司的传真号码</label>
                    </div>
                    <div class="label-right-boxb col-xs-6">
                        <input type="text" name="fax" class="form-control" placeholder="补充补充公司的传真号码"></div>
                    <div class="col-xs-4 label-text-style">
<!--                         <label isneed="1" class="cancel-toggle-append-trigger" name="delete_format_div">取消</label>
 -->                    </div>
                </div>
                <div class="row form-group " belong="B2,C2,C1">
                    <div class="label-left-boxb col-xs-2">
                        <label>公司的电子邮箱</label>
                    </div>
                    <div class="label-right-boxb col-xs-6">
                        <input type="text" name="comEmail" class="form-control" placeholder="补充补充公司的电子邮箱"></div>
                    <div class="col-xs-4 label-text-style">
<!--                         <label isneed="1" class="cancel-toggle-append-trigger" name="delete_format_div">取消</label>
 -->                    </div>
                </div>
                <div class="row form-group " belong="B2,C2,C1">
                    <div class="label-left-boxb col-xs-2">
                        <label>公司的网址</label>
                    </div>
                    <div class="label-right-boxb col-xs-6">
                        <input type="text" name="website" class="form-control" placeholder="补充补充公司的网址"></div>
                    <div class="col-xs-4 label-text-style">
<!--                         <label isneed="1" class="cancel-toggle-append-trigger" name="delete_format_div">取消</label>
 -->                    </div>
                </div>
                <div class="row form-group" belong="B2,C2,C1">
                    <div class="col-xs-2 label-left-boxb">
                        <label>营业时间</label>
                    </div>
                    <div class="col-xs-2 value-time">
                        <select class="form-control" name="openTime">
                            <option class="placeholder">-选择时间-</option>
                            <option value="00:00">00:00</option>
                            <option value="00:30">00:30</option>
                            <option value="01:00">01:00</option>
                            <option value="01:30">01:30</option>
                            <option value="02:00">02:00</option>
                            <option value="02:30">02:30</option>
                            <option value="03:00">03:00</option>
                            <option value="03:30">03:30</option>
                            <option value="04:00">04:00</option>
                            <option value="04:30">04:30</option>
                            <option value="05:00">05:00</option>
                            <option value="05:30">05:30</option>
                            <option value="06:00">06:00</option>
                            <option value="06:30">06:30</option>
                            <option value="07:00">07:00</option>
                            <option value="07:30">07:30</option>
                            <option value="08:00">08:00</option>
                            <option value="08:30">08:30</option>
                            <option value="09:00">09:00</option>
                            <option value="09:30">09:30</option>
                            <option value="10:00">10:00</option>
                            <option value="10:30">10:30</option>
                            <option value="11:00">11:00</option>
                            <option value="11:30">11:30</option>
                            <option value="12:00">12:00</option>
                            <option value="12:30">12:30</option>
                            <option value="13:00">13:00</option>
                            <option value="13:30">13:30</option>
                            <option value="14:00">14:00</option>
                            <option value="14:30">14:30</option>
                            <option value="15:00">15:00</option>
                            <option value="15:30">15:30</option>
                            <option value="16:00">16:00</option>
                            <option value="16:30">16:30</option>
                            <option value="17:00">17:00</option>
                            <option value="17:30">17:30</option>
                            <option value="18:00">18:00</option>
                            <option value="18:30">18:30</option>
                            <option value="19:00">19:00</option>
                            <option value="19:30">19:30</option>
                            <option value="20:00">20:00</option>
                            <option value="20:30">20:30</option>
                            <option value="21:00">21:00</option>
                            <option value="21:30">21:30</option>
                            <option value="22:00">22:00</option>
                            <option value="22:30">22:30</option>
                            <option value="23:00">23:00</option>
                            <option value="23:30">23:30</option>
                        </select>
                    </div>
                    <div class="col-xs-1 label-time">
                        <label>至</label>
                    </div>
                    <div class="col-xs-2 value-time">
                        <select class="form-control" name="closeTime">
                            <option class="placeholder">-选择时间-</option>
                            <option value="00:00">00:00</option>
                            <option value="00:30">00:30</option>
                            <option value="01:00">01:00</option>
                            <option value="01:30">01:30</option>
                            <option value="02:00">02:00</option>
                            <option value="02:30">02:30</option>
                            <option value="03:00">03:00</option>
                            <option value="03:30">03:30</option>
                            <option value="04:00">04:00</option>
                            <option value="04:30">04:30</option>
                            <option value="05:00">05:00</option>
                            <option value="05:30">05:30</option>
                            <option value="06:00">06:00</option>
                            <option value="06:30">06:30</option>
                            <option value="07:00">07:00</option>
                            <option value="07:30">07:30</option>
                            <option value="08:00">08:00</option>
                            <option value="08:30">08:30</option>
                            <option value="09:00">09:00</option>
                            <option value="09:30">09:30</option>
                            <option value="10:00">10:00</option>
                            <option value="10:30">10:30</option>
                            <option value="11:00">11:00</option>
                            <option value="11:30">11:30</option>
                            <option value="12:00">12:00</option>
                            <option value="12:30">12:30</option>
                            <option value="13:00">13:00</option>
                            <option value="13:30">13:30</option>
                            <option value="14:00">14:00</option>
                            <option value="14:30">14:30</option>
                            <option value="15:00">15:00</option>
                            <option value="15:30">15:30</option>
                            <option value="16:00">16:00</option>
                            <option value="16:30">16:30</option>
                            <option value="17:00">17:00</option>
                            <option value="17:30">17:30</option>
                            <option value="18:00">18:00</option>
                            <option value="18:30">18:30</option>
                            <option value="19:00">19:00</option>
                            <option value="19:30">19:30</option>
                            <option value="20:00">20:00</option>
                            <option value="20:30">20:30</option>
                            <option value="21:00">21:00</option>
                            <option value="21:30">21:30</option>
                            <option value="22:00">22:00</option>
                            <option value="22:30">22:30</option>
                            <option value="23:00">23:00</option>
                            <option value="23:30">23:30</option>
                        </select>
                    </div>
                    <div class="col-xs-1">&nbsp;</div>
                    <div class="col-xs-3 label-text-style">
                        <!-- <label isneed="1" name="delete_format_div">取消</label> -->
                    </div>
                </div>
                <div class="row form-group " belong="B2,C2,C1">
                    <div class="label-left-boxb col-xs-2">
                        <label>注册资金</label>
                    </div>
                    <div class="label-right-boxb col-xs-6">
                        <input type="text" name="amount" class="form-control" placeholder="补充补充注册资金"></div>
                    <div class="col-xs-4 label-text-style">
<!--                         <label isneed="1" class="cancel-toggle-append-trigger" name="delete_format_div">取消</label>
 -->                    </div>
                </div>
            </div>
        </div>
        <!-- ef section -->
        <div class="section user-section" belong="B1,B2,D1,E1,C2,C1" style="display: block;">
            <div class="caption">法人代表</div>
            <div id="add-more-cont">
<!--                 <div class="row form-group " belong="B1,B2,D1,E1,C2,C1">
                    <div class="label-left-boxb col-xs-2">
                        <label>电子邮箱</label>
                    </div>
                    <div class="label-right-boxb col-xs-6">
                        <input type="text" name="userEmail" class="form-control" placeholder="补充电子邮箱"></div>
                    <div class="col-xs-4 label-text-style"></div>
                </div> -->
                <div class="row form-group" belong="B1,B2,D1,E1,C2,C1">
                    <div class="col-xs-2 label-left-boxb">
                        <label>紧急联系人</label>
                    </div>
                    <div class="col-xs-3 label-right-boxm">
                        <input type="text" name="contName" class="form-control" placeholder="姓名"></div>
                    <div class="col-xs-3 label-right-boxs">
                        <input type="text" name="contPhone" class="form-control" placeholder="电话"></div>
                    <div class="col-xs-4 label-text-style">
                    </div>
                </div>
            </div>
        </div>
        <a class="clearfix"></a>
    </div>
</form>