<%
var section = formLayout.section;
var infoSection = _.findWhere(section, {type: 'info'});
var expSection = _.findWhere(section, {type: 'explore'});
var extraSection = _.where(section, {type: 'extra'});
%>

<div class="row user-add-confirm">
    <form role="form" id="submit-data">

        <div class="col-lg-4 user-form-section">
            <div class="container group-margintop">
                <div class="caption caption-text-font"><%= infoSection.caption %></div>
                <% _.each(infoSection.items, function(item) { %>
                    <div class="row row-margintop">
                        <label class="col-lg-4 info-item-text"><%= getLabel(item) %>：</label>
                        <div class="value col-lg-8">
                            <%= getValue(item) ? (item.formatLabel ? item.formatLabel(getValue(item)) : getValue(item)) : '无'%>
                        </div>
                    </div>
                <% }); %>
            </div>
        </div>
        <div class="col-lg-4 user-form-section">
            <div class="container group-margintop">
                <div class="caption caption-text-font"><%= expSection.caption %></div>
                <% _.each(expSection.items, function(item) { %>
                    <%if(item.type == 'text'){%>
                    <div class="row row-margintop">
                        <label class="col-lg-5 info-item-text"><%= getLabel(item) %>：</label>
                        <div class="value col-lg-7">
                            <%= getValue(item) ? (item.formatLabel ? item.formatLabel(getValue(item)) : getValue(item)) : '无'%>
                        </div>
                    </div>
                    <%}else if(item.type == 'img'){%>
                        <% if(getImage(item.key)){ %>
                    <div class="img-wrap">
                        <div class="img-inner-wrap">
                            <a href="<%=getImage(item.key)%>" class="img-link"><span class="vertical-helper"></span><img src="<%=getImage(item.key)%>"></a>
                        </div>
                        <div class="img-name-wrap">
                            <span class="img-name"><%= getLabel(item) %></span>
                        </div>
                    </div>
                        <%}else{%>
                    <div class="row row-margintop">
                        <label class="col-lg-5 info-item-text"><%= getLabel(item) %>：</label>
                        <div class="value col-lg-7">无</div>
                    </div>
                        <%}%>
                    <%}%>
                <% }); %>
            </div>
        </div>
        <div class="col-lg-4 user-form-section">
            <% _.each(extraSection, function(itemSection){%>
                <div class="container group-margintop">
                    <div class="caption caption-text-font"><%= itemSection.caption %></div>
                    <% _.each(itemSection.items, function(item) { %>
                        <div class="row row-margintop">
                            <label class="col-lg-4 info-item-text"><%= getLabel(item) %>：</label>
                            <div class="value col-lg-8">
                                <%= getValue(item) ? (item.formatLabel ? item.formatLabel(getValue(item)) : getValue(item)) : '无'%>
                            </div>
                        </div>
                    <% }); %>
                </div>
            <% });%>
        </div>
    </form>
</div>