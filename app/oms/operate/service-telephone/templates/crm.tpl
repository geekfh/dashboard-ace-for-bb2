<!--
 接入天润融通客服中心
 http://sem.ti-net.com.cn
 -->
<%
    for(var k in events){
        if(events.hasOwnProperty(k)){
            window[k] = events[k];
        }
    }
%>

<style type="text/css">
    .form-group label[class^=col-xs] { text-align: right; }
    .form-group iframe { border: 1px solid #DDD; }
</style>

<div class="form-horizontal">
    <!-- 电话工具条 -->
    <div class="row form-group">
        <div class="col-xs-12">
            <iframe id="crm_toolbar_iframe" width="100%" height="50px" src="third-party/crm/simple/toolbarIframe.html"></iframe>
        </div>
    </div>

    <form id="crm_params_form">
        <!-- 客服中心 -->
        <div class="row">
            <div class="col-xs-10 col-sm-7 col-md-6 col-lg-5">
                <!-- 热线号码 -->
                <div class="row form-group">
                    <label class="col-xs-4">热线号码：</label>
                    <div class="col-xs-8"><input type="text" value="" id="hotLine" name="hotLine" class="form-control" /></div>
                </div>

                <!-- 座席号 -->
                <div class="row form-group">
                    <label class="col-xs-4">座席号：</label>
                    <div class="col-xs-8"><input type="text" value="" id="cno" name="cno" class="form-control" /></div>
                </div>

                <!-- 密码 -->
                <div class="row form-group">
                    <label class="col-xs-4">密码：</label>
                    <div class="col-xs-8"><input type="text" value="" id="pwd" name="pwd" class="form-control" /></div>
                </div>

                <!-- 绑定电话 -->
                <div class="row form-group">
                    <label class="col-xs-4">绑定电话：</label>
                    <div class="col-xs-8"><input type="text" value="" id="bindTel" name="bindTel" class="form-control" /></div>
                </div>

                <!-- 电话类型 -->
                <div class="row form-group">
                    <label class="col-xs-4">电话类型：</label>
                    <div class="col-xs-8">
                        <select id="bindType" name="bindType" class="form-control">
                            <option value="1" selected>电话号码</option>
                            <option value="2" >分机号码</option>
                            <!--<option value="3">软电话</option>-->
                        </select>
                    </div>
                </div>

                <!-- 电话类型 -->
                <div class="row form-group">
                    <label class="col-xs-4">初始状态：</label>
                    <div class="col-xs-8">
                        <select id="initStatus" name="initStatus" class="form-control">
                            <option value="online">空闲</option>
                            <option value="pause">置忙</option>
                        </select>
                    </div>
                </div>

                <!-- 登录 -->
                <div class="row form-group" style="margin-top: 30px; text-align: center;">
                    <div class="col-xs-12">
                        <button id="crm_btn_login" type="button" class="btn btn-success">登陆</button>
                        &nbsp;&nbsp;
                        <button id="crm_btn_logout" type="button" class="btn btn-default" disabled>退出</button>
                    </div>
                </div>
            </div>
            <div class="col-xs-2 col-sm-5 col-md-6 col-lg-7"></div>
        </div>
    </form>
</div>