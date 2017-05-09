<div>
    <form onsubmit="return false;" class="FormGrid edit-profit">
        <table border="0" class="EditTable">
            <tbody>
                <tr style="display:none" class="tinfo"></tr>
                <tr style="display:none" rowpos="1" class="FormData" id="tr_id"></tr>

                <tr class="FormData" id="tr_cardType">
                    <td class="CaptionTD">方案名称:</td>
                    <td class="DataTD">&nbsp;
                        <input type="text" class="model-name" name="model-name" value="<%= modelNm %>">
                    </td>
                </tr>
            </tbody>
        </table>

        <div class="standard-treaty-section">
            <div class="title">费率模型配置</div>
            <div class="standard-section">
                <span class="type">直联费率模型</span>
                <ul>
                <% _.each(standardTreaty.standard, function(item){ %>
                    <li class="standard-item">
                        <input type="radio" name="standard" value="<%= item.value %>"><span><%= item.name %></span>
                    </li>
                <%});%>
                </ul>
            </div>
            <div class="treaty-section">
                <span class="type">间联费率模型</span>
                <ul>
                <% _.each(standardTreaty.treaty, function(item){ %>
                    <li class="treaty-item">
                        <input type="radio" name="treaty" value="<%= item.value %>"><span><%= item.name %></span>
                    </li>
                <%});%>
                </ul>
            </div>
        </div>
    </form>
</div>