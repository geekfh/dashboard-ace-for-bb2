<div id="uk-config-dialog" title="处理">
     
  <fieldset class="container">
    <div class="row settle-styles-row">
        <div class="col-xs-3">操作员:</div>
        <div class="col-xs-9">
            <input type="text" name="oprId" style="width: 178px;">
        </div>
    </div>

    <div id="submit-append-values">

    <% if (edit) { 

        var accounts = rows.accounts;
        var options = rows.options;
        var ukUsers = rows.ukUsers;
        var ukNumber = 0;
        var accountNumber = 0;

        for(var i=0; i<accounts.length; i++) {
    %>

        <div class="settle-account-bottom user-section account-informations">
            <div class="caption"> <b>付款账户</b>
            </div>
            <div class="form-horizontal">
                <div class="form-group">
                    <label class="col-md-3 control-label">账户:</label>
                    <div class="col-md-8">
                        <select name="account<%= ++accountNumber %>" style="width: 178px;">
                              <% for(var j=0; j<options.length; j++) { %>
                                <option value="<%=options[j].key %>" <%= accounts[i].no === options[j].key ? 'selected' : '' %>><%= options[j].value %></option>
                              <% } %>
                        </select><i class="icon-remove del-more-acc-infos" style="margin-left: 6px;"></i>
                    </div>
                </div>

                <% 
                    var ukUser = ukUsers[accounts[i].no];
                    for(var k=0; k<ukUser.length; k++) { %>
                <div class="form-group">
                    <label class="col-md-3 control-label">uk用户:</label>
                    <div class="col-md-8">
                        <input  type="text" name="ukUser<%= ++ukNumber %>" value="<%= ukUser[k] %>">
                            <% if (k > 0) { %>
                            <i class="icon-remove del-more-uk-user" style="margin-left: 6px;"></i>
                            <% } %>
                    </div>
                </div>

                <% } %>

                <div class="form-group">
                    <label class="col-md-4 control-label add-more-uk-user">增加uk用户</label>
                
                </div>
                
            </div>
        </div>



        <% }
        }
         %>
    </div>


    <div class="row" style="margin-top: 20px;">
        <div class="col-xs-5 add-more-acc-infos">增加付款账户</div>
        <div class="col-xs-7"></div>
    </div>

  </fieldset>

</div>