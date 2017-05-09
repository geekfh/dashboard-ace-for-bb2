<style type="text/css">
    .form-control.error { border: 1px solid red; }
</style>
<div class="row">
    <div class=" col-sm-4 col-xs-4">
        <button type="button" class="js-back btn btn-default pull-left">
          <span class="icon icon-reply"></span> 返回
        </button>
    </div>
    <div class=" col-sm-4 col-xs-8 center-wrap">
        <span class="caption pull-left">新增任务</span>
        <i class="icon icon-info-sign pull-left js-task-info history-trigger"></i>
    </div>
    <div class=" col-sm-4"> <!--col-xs-12-->
        <div class="pull-right btn-groups right-btns">
            <button type="button" class="js-pass btn btn-success pull-right">
                通过审核
            </button>
            <!-- <button style="display:none;" type="button" class="pass-submit btn btn-primary pull-right">
              确认通过
            </button> -->
            <button type="button" class="reject-trigger btn btn-danger pull-right">
                拒绝通过
            </button>
            <!--<button class="btn btn-primary put-back-task pull-right">-->
                <!--放回任务-->
            <!--</button>-->
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
                    <form class="pass-form container" style="width: 250px;">
                        <div class="row">
                            <h4>通过原因:</h4>
                            <textarea name="successRemark" class="pass-reason form-control" rows="10" maxlength="300" cols="25" placeholder="请在此填写通过的原因"></textarea>
                        </div>

                        <% if(finalVertify){ %>
                        <div class="row">
                            <div class="comment">
                                <label>风险等级：</label>
                                <select name="riskLevel">
                                    <option value="1">一级</option>
                                    <option value="2">二级</option>
                                    <option value="3" <%= canGetHeighterLevel() ? '' : 'selected' %>>三级</option>
                                    <option value="4" <%= canGetHeighterLevel() ? 'selected' : '' %>>四级</option>
                                    <option value="5">五级</option>
                                </select>
                            </div>
                            <div class="warm-message">等级越高，商户品质越高</div>
                        </div>
                        <% } %>

                        <% if(getSubType()=="102" || getSubType()=="107"){%>
                        <div class="row">
                            <h5>经营范围:</h5>
                            <select class="form-control" name="grpBudID"></select>
                            <select class="form-control" name="businessId" style="margin:5px 0;">
                                <option></option>
                            </select>
                        </div>
                        <div class="row">
                            <h5>MCC:</h5>
                            <select class="form-control" name="group"></select>
                            <select class="form-control" name="mcc" style="margin:5px 0;">
                                <option></option>
                            </select>
                        </div>

                        <div class="row">
                            <h5>直联/间联:</h5>
                            <div class="col-xs-12">
                                <div style="color: #666;">
                                    <label class="select-label">
                                        <input type="radio" name="category" value="1">
                                        <span>直联</span>
                                    </label>
                                    <label class="select-label">
                                        <input type="radio" name="category" value="0" checked>
                                        <span>间联</span>
                                    </label>
                                </div>
                                <select class="form-control" name="tNDiscId" style="display: none;">
                                    <option></option>
                                </select>
                            </div>
                        </div>
                        <% } %>
                        <!--<div> <label>T+1额度等级：<%=mchtRank()%></label></div>-->

                        <div class="row">
                            <button class="pass-submit btn btn-primary">确认通过</button>
                        </div>
                    </form>
                </div>
            </div>

        </div>
    </div>
</div>

<div role="alert"  class="div_countDown">
    <span class="sp_countDown" style="width: 500px; margin-left: 420px; background-color: #fcf8e3; border-color: #fbeed5;padding: 8px;"></span>
</div>

<div class="info-board-wrap"></div>
