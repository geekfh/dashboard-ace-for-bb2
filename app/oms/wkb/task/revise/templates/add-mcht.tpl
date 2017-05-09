


    <div class="innerwrap">
    
        <div class="wizard-head row">
            <div class="caption col-lg-3 col-md-4 col-sm-4 col-xs-12">录入商户修订</div>
            <div class="wizard-progress col-lg-5 col-md-5 col-sm-6 col-xs-11">
                <div class="total-bar"></div>
                <ul class="current-progress nav-progress">
                    <li class="step passing active" name="info">
                        <a data-toggle="tab" href="#revise-person-mcht-info<%= count %>">
                            <div class="bar"></div>
                            <div class="end-point"></div>
                            <div class="desc">基本信息</div>
                        </a>
                    </li>
                    <li class="step " name="pic">
                        <a  data-toggle="tab" href="#revise-person-mcht-pic<%= count %>">
                            <div class="bar"></div>
                            <div class="end-point"></div>
                            <div class="desc">上传照片</div>
                        </a>
                    </li>
                    <li class="step" name="extra">
                        <a  data-toggle="tab" href="#revise-person-mcht-extra<%= count %>">
                            <div class="bar"></div>
                            <div class="end-point"></div>
                            <div class="desc">补充资料</div>
                        </a>
                    </li>
                    <li class="step" name="confirm">
                        <a  data-toggle="tab" href="#revise-person-mcht-confirm<%= count %>">
                            <div class="bar"></div>
                            <div class="end-point"></div>
                            <div class="desc">确认提交</div>
                        </a>
                    </li>
                </ul>
            </div>
        </div>

        <div class="wizard-panel clearfix">
            <div class="top">
                <div class="wizard-caption pull-left">基本信息</div>
                <div class="btn btn btn-success btn-next pull-right">继续</div>
                <div class="btn btn btn-success btn-submit pull-right">确认提交</div>
                <label class="pull-right">
                    <a href="#" class="js-del" style="display:none;">删除该申请</a>
                </label>
            </div>

            <div class="main">
               <div class="tab-content">
                    <div class="tab-pane active" id="revise-person-mcht-info<%= count %>">
                    </div>

                    <div class="tab-pane" id="revise-person-mcht-pic<%= count %>">
                    </div>

                    <div class="tab-pane" id="revise-person-mcht-extra<%= count %>">
                    </div>

                    <div class="tab-pane" id="revise-person-mcht-confirm<%= count %>">
                    </div>
                </div>                     
            </div>

            <div class="bottom">
                <div class="btn btn-previous pull-left">上一步</div>
                <div class="btn btn btn-success btn-next pull-right">继续</div>
                <div class="btn btn btn-success btn-submit pull-right">确认提交</div>
            </div>
            

        </div>

    </div>

