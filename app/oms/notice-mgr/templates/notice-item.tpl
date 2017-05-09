<%if(featureAvailConfig && featureAvailConfig.noticeItemCheckable){%>
<td class="col-checkbox">
    <label class="inline">
        <input type="checkbox" class="ace notice-select-chk">
        <span class="lbl"></span>
    </label>
</td>
<%}%>
<td class="col-summary">
    <span class="text" title="<%=subject%>" status="<%=status%>">
        <%-subject%>
    </span>
</td>
<td class="col-time">
    <%if(!_.isEmpty(attachments)) {%>
        <span class="attachment"><i class="icon-paper-clip"></i></span>
    <%}%>
    <span title="<%=lastModified%>"><%=formatTime(lastModified)%></span>
</td>
