<td hidden><%=id%></td>
<td class="col-class-name"><%=classNameDesc%></td>
<td class="col-field"><%=sensitiveFieldDesc%></td>
<td class="col-handle-type">
    <div class="for-display">
        <%
            if(filterType=='1'){
        %>
                去敏
        <%
            }else if(filterType=='0'){
        %>
                隐藏
        <%
            }
        %>
    </div>

    <div class="for-edit">
        <select name="filterType" class="handle-type-select">
            <option role="option" value="1">去敏</option>
            <option role="option" value="0">隐藏</option>
            <option role="option" value="2">不处理</option>
        </select>
    </div>
</td>

<td class="col-mosica">
    <div class="for-display">
    <%
        if(filterType=='1'){
    %>
        将第&nbsp;<%=begin+1%>&nbsp;到&nbsp;<%=end+1%>&nbsp;位替换为&nbsp;*&nbsp;号
     <%
        }else if(filterType=='0'){
    %>
            <div class="text-center" style="color:#AAA;">—</div>
    <%
        }
    %>
    </div>
        
    <div class="for-edit filter-type-mosaic">
            <!-- 注意保存到模型时要减去1 -->
            第
            &nbsp;
            <input name="begin" maxLength="2" type="text" class="begin-input">
            &nbsp;
            到
            &nbsp;
            <input name="end" maxLength="2" type="text" class="end-input">
            &nbsp;
            位替换为 * 号
    </div>

    <div class="for-edit filter-type-hidden">
        <div class="text-center" style="color:#AAA;">—</div>
    </div>

</td>