<div class="msg-type-group">
    
    <div class="message-edit">
        <form class="validate-form">
            <div class="edit-row">
                <div class="col-xs-3 text-label">类型名称：</div>
                <div class="col-xs-9"><input type="text" class="type-name" name="name"></div>
            </div>

            <div class="edit-row">
                <div class="col-xs-3 text-label">描述：</div>
                <div class="col-xs-9"><textarea class="type-desc" name="desc"></textarea></div>
            </div>
        </form>

        <div class="edit-row">
            <div class="col-xs-3"></div>

            <div class="col-xs-9">
                <a href="#" class="btn btn-primary btn-sm btn-add"> 新 增 </a>
                <a href="#" class="btn btn-primary btn-sm btn-edit" style="display: none"> 保 存 </a>
                <a href="#" class="btn btn-default btn-sm btn-cancel"> 取 消 </a>
            </div>

        </div>
    </div>

    <div class="message-list">
        <table class="table-list">
            <thead>
                <tr>
                    <th>类型名称</th>
                    <th>描述</th>
                    <th>创建时间</th>
                    <th>更新时间</th>
                    <th>操作</th>
                </tr>
            </thead>

            <tbody class="msg-categories-list">
                
            </tbody>

        </table>
    </div>

</div>
