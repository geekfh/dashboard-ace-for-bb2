<div class="row">
    <div class="col-sm-7 col-xs-12 center-wrap" style="margin-left: 50px;">
        <span class="caption">
            开通宝实名认证审核
            <i class="icon icon-info-sign js-task-info history-trigger"></i>
        </span>
    </div>
    <div class="col-xs-4">
        <div class="pull-right btn-groups right-btns">
            <button type="button" class="js-back btn btn-default pull-left">
                <span class="icon icon-reply"></span> 返回
            </button>
            <button type="button" class="js-pass btn btn-success pull-right">
                通过审核
            </button>
            <button type="button" class="reject-trigger btn btn-danger pull-right">
                拒绝通过
            </button>
            <div class="reject-form-wrapper">
                <div class="arrow"></div>
                <div class="arrow-border"></div>
                <div class="inner-wrapper">
                    <form class="reject-form container">
                        <!-- 拒绝原因 -->
                        <div class="row">
                            <h4>拒绝原因:</h4>
                        </div>

                        <!-- 拒绝内容 -->
                        <div class="row">
                            <div class="reject-container">
                                <textarea name="reason" class="reject-reason form-control" rows="10" maxlength="300" cols="25" placeholder="请在此填写拒绝通过的原因"></textarea>
                            </div>
                        </div>

                        <!-- 仍需补充资料 -->
                        <div class="row">
                            <label class="needAdd select-label">
                                <input type="checkbox" name="needAdd">
                                <span>仍需补充资料</span>
                            </label>
                        </div>

                        <!-- 拒绝按钮 -->
                        <div class="row">
                            <button type="submit" class="reject-submit btn btn-danger">确认拒绝</button>
                        </div>
                    </form>
                </div>
            </div>

            <div class="pass-form-wrapper">
                <div class="arrow"></div>
                <div class="arrow-border"></div>
                <div class="inner-wrapper">
                    <form class="pass-form">
                        <h4>通过原因:</h4>
                        <textarea name="successRemark" class="pass-reason" rows="10" maxlength="300" cols="25" placeholder="请在此填写通过的原因"></textarea>
                        <button class="pass-submit btn btn-primary" style="display: block;">确认通过</button>
                    </form>
                </div>
            </div>

        </div>
    </div>
</div>
<br>
<div role="alert" class="div_countDown">
    <span class="sp_countDown" style="width: 500px; margin-left: 80px; background-color: #fcf8e3; border-color: #fbeed5;padding: 8px;"></span>
</div>
<div class="info-board-wrap"></div>
