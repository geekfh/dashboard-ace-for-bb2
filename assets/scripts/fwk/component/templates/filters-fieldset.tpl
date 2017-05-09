<%
    var showFieldset = !!caption;
%>

<%if(showFieldset){%>
<fieldset><legend><%-caption%></legend>
<%}%>

    <div class="fieldset-innerwrap">
        <div class="filters"></div>
        <!-- 'class'是关键字 -->
        <%if(searchBtn){%>
        <button class="btn btn-primary search-btn <%=searchBtn['class']%>" id="<%=searchBtn.id%>">
            <%-searchBtn.text%>
        </button>
        <%}%>
    </div>

<%if(showFieldset){%>
</fieldset>
<%}%>
