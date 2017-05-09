<td class="first"></td>
<td class="columns col-label">
    <span class="label-text"><%= options.label%></span>
</td>
<td class="operators">
    <select class="selectopts">
        <% _.each(options.selOpts, function(v, k) { %>
            <option value="<%=k%>"><%=v%></option>
        <% }); %>
    </select>
</td>
<td class="data col-value">
    <input type="text" name="<%=options.name%>" class="input-elm" >
</td>