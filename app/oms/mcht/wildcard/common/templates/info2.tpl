<!-- 外卡商户独有进件信息 -->
<style type="text/css">
    .mcht-add-wildcard-info2 textarea { height: 100px; }
</style>
<form class="container body">
    <!-- 基础信息 -->
    <% for(var i=0; i<data.length; i++){
        var section = data[i];
        var name = section.name||"";
        var caption = section.caption||"";
        var items = section.items||[];
    %>
        <div class="<%=name%>-section">
            <% if(!!caption){ %>
            <div class="caption">
                <b><%=caption%></b>
            </div>
            <% } %>

            <div class='form-horizontal'>
            <% _.each(items, function(item){
                var item_type = item.type||"";
                var item_belong = item.belong||"";
                var item_label = item.label||"";
                var item_key = item.key||"";
                var item_defaultValue = item.defaultValue||"";
                var item_helps = item.helps||"";
                var item_soptions = item.soptions||{};
            %>
                <div class="form-group" belong="<%=item_belong%>">
                    <label class="col-md-3 control-label"><%=item_label%></label>
                    <% if(!!item_helps||item_type=="select"){ %>
                    <div class="col-md-3">
                    <% } else { %>
                    <div class="col-md-5">
                    <% } %>
                    <% if(item_type=="input"){ %>
                        <input data-set='<%=name%>' class="form-control" type="text" name="<%=item_key%>" value="<%=item_defaultValue%>">
                    <% } else if(item.type=="textarea"){ %>
                        <textarea data-set='<%=name%>' class="form-control" name="<%=item_key%>" value="<%=item_defaultValue%>"></textarea>
                    <% } else if(item.type=="select"&&!!item_soptions){ %>
                        <select data-set="<%=name%>" class="form-control" name="<%=item_key%>">
                            <% _.each(item_soptions, function(v, k){ %>
                            <option value="<%=k%>"><%=v%></option>
                            <% }) %>
                        </select>
                    <% } else {
                        console.log("未知类型：wildcard info2 config");
                    } %>
                    </div>
                    <% if(!!item_helps){ %>
                        <label class="col-md-6 text-muted"><%=item_helps%></label>
                    <% } %>
                </div>
            <% }); %>
            </div>
        </div>
    <% } %>
</form>