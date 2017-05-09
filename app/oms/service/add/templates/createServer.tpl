<div class="person-mcht-wizard status-info">
    <div class="innerwrap">
        <div class="wizard-panel clearfix">

            <i class="icon-circle-arrow-left back-list"></i>

            <div class="main">
                <div class="tab-content">
                    <div class="container body mcht-add-info">
                        <form novalidate="novalidate" class="create-server-form">

                            <!-- 基本信息 -->
                            <div class="base-section">
                                <div class="caption"> <b>基本信息</b></div>

                                <div class="form-horizontal" role="form">
                                    <div class="form-group">
                                        <label class="col-md-2 control-label">服务代码:</label>
                                        <div class="col-md-2">
                                            <select class="form-control" name="code" service-backgroud="1">
                                            </select>
                                        </div>
                                    </div>

                                    <div class="form-group">
                                        <label class="col-md-2 control-label">服务名称:</label>
                                        <div class="col-md-4">
                                            <input type="text" name="name" class="form-control">
                                        </div>
                                    </div>

                                    <div class="form-group">
                                        <label class="col-md-2 control-label">服务版本</label>
                                        <div class="col-md-2">
                                            <input type="text" class="form-control" name="version">
                                        </div>
                                    </div>

                                    <div class="form-group">
                                        <label class="col-md-2 control-label">服务对象:</label>
                                        <div class="col-md-2">
                                            <select class="form-control" name="target">
                                                <option value="1">商户</option>
                                                <option value="2">机构</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div class="form-group">
                                        <label class="col-md-2 control-label">开通方式:</label>
                                        <div class="col-md-2">
                                            <select class="form-control" name="activateWay">
                                                <option value="1">完全开放</option>
                                                <option value="2">代理商邀请</option>
                                                <option value="3">公司邀请</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div class="form-group">
                                        <label class="col-md-2 control-label">服务描述:</label>
                                        <div class="col-md-8">
                                            <textarea class="form-control" style="height: 100px;" name="desc"></textarea>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            <!-- 商户费用 -->
                            <div class="fee-section">
                                <div class="caption"> <b class="mcht-fee">商户费用</b> <b class="branch-fee">代理商费用</b></div>

                                <div class="form-horizontal" role="form">

                                    <!-- <div class="form-group">
                                        <label class="col-md-2 control-label">费用:</label>
                                        <div class="col-md-2">
                                            <select class="form-control" name="fixedFeeType">
                                                <option value="0">固定费用</option>
                                                <option value="1">按周期收费</option>
                                                <option value="2">免费</option>
                                            </select>
                                        </div>
                                        <div class="col-md-7">
                                            <select name="fixedFeeFrequency">
                                                <option value="0">每年</option>
                                                <option value="1">每月</option>
                                                <option value="2">每周</option>
                                            </select>
                                            <input type="text" name="fixedFeeAmt" style="margin-left: -5px; height: 30px; width: 50px;"><label class="fee-label" style="margin: 0 3px;">元</label>
                                        </div>
                                    </div> -->

                                    <div class="form-group">
                                        <label class="col-md-2 control-label mcht-handChargeRate">服务费率:</label>
                                        <label class="col-md-2 control-label branch-handChargeRate">分润模型:</label>
                                        <div class="col-md-2">
                                            <!--<select class="form-control" name="handChargeRate" service-backgroud="1"></select>-->
                                            <!--<input type="hidden" name="handChargeRate" service-backgroud="1">-->
                                            <div id="handChargeRateName">
                                                <span>无</span>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <span id="btn_add_fee" class="btn btn-sm btn-primary">点击添加</span>
                                            <span id="btn_add_fees" class="btn btn-sm btn-default">批量添加</span>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            <!-- 代理商奖励 -->
                            <div class="award-section">
                                <div class="caption"> <b>代理商奖励</b></div>

                                <div class="form-horizontal" role="form">

                                    <div class="form-group">
                                        <label class="col-md-2 control-label">固定奖励:</label>
                                        <div class="col-md-10">
                                            <select  name="fixedRewardType">
                                                <option value="0">每开通一个服务商户</option>
                                            </select>
                                            <input type="text" name="fixedRewardAmt" style="margin-left: -5px; height: 30px; width: 50px;"><label class="service-message-value" >元</label>
                                        </div>
                                    </div>

                                    <div class="form-group">
                                        <label class="col-md-2 control-label">分润模型:</label>
                                        <div class="col-md-2">
                                            <select class="form-control" name="shareProfitModel" service-backgroud="1">
                                            </select>
                                        </div>
                                    </div>

                                </div>
                            </div>


                            <!-- 营销活动 -->
                            <div class="market-section">
                                <div class="caption"> <b>营销活动</b></div>

                                <div class="form-horizontal" role="form">

                                    <div class="form-group">
                                        <label class="col-md-2 control-label">优惠费率:</label>
                                        <div class="col-md-2">
                                            <select class="form-control" name="trialPrice" service-backgroud="1">
                                            </select>
                                            <!-- <input type="text" name="trialPrice" style="width: 50px;"> -->
                                            <label class="service-message-value" ></label> 
                                        </div>
                                        <div class="col-md-2">
                                            <label class="service-message-value">优惠</label> <input type="text" name="trialPeriod" style="width: 50px;"> <label class="service-message-value" >天</label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- main content end  -->

                        </form>
                    </div>
                </div>
            </div>
            <div class="bottom">
                <div class="btn btn btn-success btn-submit pull-right" style="display: block;">保存</div>
            </div>
        </div>
    </div>
</div>