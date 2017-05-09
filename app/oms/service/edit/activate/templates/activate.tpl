<div class="service-activate">

    <i class="icon-circle-arrow-left back-list"></i>

    <form class="submit-form">
        <div class="header-conf">
            <div class="activ-row">
                <label class="col-md-2">计划开通时间:</label>
                <input class="col-md-3" type="text" name="planOpenDate" value="<%= data.planOpenDate || '' %>">
            </div>

            <div class="activ-row">
                <label class="col-md-2">结束日期:</label>
                <input class="col-md-3" type="text" name="closeDate" value="<%= data.closeDate || '' %>">
            </div>


            <div class="activ-row">
                <label class="col-md-2">运行状态:</label>
                <select name="status">
                    <option value="0" <%= data.status == 0 ? 'selected' : '' %>>未开通</option>
                    <option value="1" <%= data.status == 1 ? 'selected' : '' %>>开通</option>
                    <option value="2" <%= data.status == 2 ? 'selected' : '' %>>暂停</option>
                    <option value="3" <%= data.status == 3 ? 'selected' : '' %>>停止</option>
                </select>
            </div>
        </div>


        <div class="mcht-qualified qualified-table" style="display: none">
            <div class="qulified-header">
                <label>达到邀请标准的商户</label>
                <div class="left-menu">
                    <!-- <a href="#" class="add-mcht">添加</a> -->
                    <a href="#" style="position: relative;" class="upload-mcht">上传</a>
                </div>
                <div class="right-menu">
                    
                </div>
            </div>
        </div>

        <div class="branch-qualified qualified-table" style="display: none">
            <div class="qulified-header">
                <label>代理商邀请名额</label>
                <div class="left-menu">
                    <!-- <input type="text" placeholder="搜索代理商..."> -->
                </div>
                <div class="right-menu">
                    总名额：<input type="text" style="width: 70px;" name="planActiveNum" value="<%= data.planActiveNum || '' %>">
                </div>
            </div>
        </div>

        <div class="bottom" style="display: inline-block; width: 100%; margin-top: 20px; padding: 0 20px;">
            <div class="btn btn btn-success btn-submit pull-right" style="display: block;">保存</div>
        </div>

    </form>

</div>
