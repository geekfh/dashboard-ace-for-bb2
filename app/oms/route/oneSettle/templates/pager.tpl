<%
    var beginPage = parseInt(state.currentPage / 3) * 3;

    var maxPage = state.totalPages > (beginPage + 3) ? (beginPage + 3) : state.totalPages;

    var beginNum = state.totalPages ? (state.currentPage * state.pageSize) + 1 : 0;
    var endNum   = (state.currentPage+1) * state.pageSize;
    endNum = endNum > state.totalRecords ? state.totalRecords : endNum;
%>



<div class="pager-message">
    第<%= beginNum %>~<%= endNum %>个，共<%=state.totalRecords %>个
</div>


<div class="pager-buttons">
    <ul class="pagination">
        <li class="<%= state.isFirstPage ? 'disabled' : '' %>">
            <a href="#" class="btn-previous"> <i class="icon-double-angle-left"></i>
            </a>
        </li>

        <%
            for ( var page = beginPage; page < maxPage; page++ ) {
         %>

        <li class="<%= page === state.currentPage ? 'active' : '' %>">
            <a href="#" toPage="<%= page %>" class="btn-page"><%= page+1 %></a>
        </li>

        
        <% } %>

        <li class="<%= state.isLastPage ? 'disabled' : '' %>">
            <a href="#" class="btn-next"> <i class="icon-double-angle-right"></i>
            </a>
        </li>
    </ul>
</div>

