<div class="message-perform-group">
    <% if(_.isArray(previewLayout)) { %>
    <div class="preview-result">
        <% _.each(previewLayout, function (item) { %>
        <div class="content-form-group">
            <div class="col-xs-3 perform-label">
                <%= item.label %>:
            </div>
            <div class="col-xs-9 perform-value">
                <%= item.formatter ? item.formatter(model.get(item.name)) : (model.get(item.name) || '无')%>
            </div>
        </div>
        <% }); %>
    </div>
    <% }; %>

    <div class="perform-content">
        <% _.each(formLayout, function (item) { %>
        <div class="content-form-group">
            <div class="col-xs-3 perform-label">
                <%= item.label %>:
            </div>
            <div class="col-xs-9 perform-value">
                <%= item.formatter ? item.formatter(model.get(item.name)) : (model.get(item.name) || '无')%>
            </div>
        </div>
        <% }); %>
    </div>


    <div class="perform-result">
        <form class="form-perform">
            <div class="result-form-group">
                <div class="col-xs-3 perform-label">
                    审核结果:
                </div>
                <div class="col-xs-9 perform-value">
                    <label class="select-label">
                        <input type="radio" name="result" value="1" checked>
                        <span>通过</span> 
                    </label>
                    <label class="select-label">
                        <input type="radio" name="result" value="0"> 
                        <span>拒绝</span>
                    </label>
                </div>
            </div>

            <div class="result-form-group">
                <div class="col-xs-3 perform-label">
                    审核说明:
                </div>
                <div class="col-xs-9 perform-value">
                    <textarea name="desc" class="perform-desc"></textarea>
                </div>
            </div>
        </form>
        
    </div>

    <div class="perform-operate">
        <button class="btn btn-sm btn-primary perform-submit"> 提 交 </button>
        <button class="btn btn-sm btn-default perform-cancel"> 取 消 </button>
    </div>
</div>