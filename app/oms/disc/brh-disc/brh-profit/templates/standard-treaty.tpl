<div class="standard-treaty-section">
    <div class="title">费率模型配置</div>
    <div class="standard-section">
            <span class="type">直联费率模型</span>
        <ul>
        <% _.each(data.standard, function(item){ %>
            <li class="standard-item">
                <input type="radio" name="standard" value="<%= item.value %>">
                <span class="standard-name"><%= item.name %></span>
            </li>
        <%});%>
        </ul>
        <span class="standard-tip" hidden>请先设置直联费率模型</span>
    </div>
    <div class="treaty-section">
            <span class="type">间联费率模型</span>
        <ul>
        <% _.each(data.treaty, function(item){ %>
            <li class="treaty-item">
                <input type="radio" name="treaty" value="<%= item.value %>">
                <span class="treaty-name"><%= item.name %></span>
            </li>
        <%});%>
        </ul>
        <span class="treaty-tip" hidden>请先设置间联费率模型</span>
    </div>
</div>