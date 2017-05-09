<div class="settle-account-bottom user-section account-informations">
    <div class="caption"> <b>付款账户</b>
    </div>
    <div class="form-horizontal">
        <div class="form-group">
            <label class="col-md-3 control-label">账户:</label>
            <div class="col-md-8">
                <select name="account<%= accountNumber %>" style="width: 178px;">
                    <% if(typeof options === 'string') { %>
                        <%= options %>
                    <% } else { %>
                    <option value="<%=options[j].key %>"><%= options[j].value %></option>
                    <% } %>
                </select> <i class="icon-remove del-more-acc-infos" style="margin-left: 6px;"></i>
            </div>
        </div>
        <div class="form-group">
            <label class="col-md-3 control-label">uk用户:</label>
            <div class="col-md-8">
                <input type="text" name="ukUser<%= ukNumber %>">
            </div>
        </div>
        <div class="form-group">
            <label class="col-md-4 control-label add-more-uk-user">增加uk用户</label>
        </div>
    </div>
</div>