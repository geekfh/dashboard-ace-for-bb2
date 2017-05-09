<div class="pull-left">共&nbsp;<%=state.totalRecords||0%>&nbsp;条公告</div>

    <div class="pull-right">



        &nbsp; &nbsp;

        <ul class="pagination middle">
            
            
            <li class="<%=state.isFirstPage===true ? 'disabled' : ''%>">
                <a class="btn-first<%=state.isFirstPage===true ? '-disabled' : ''%>">
                    <i class="icon-double-angle-left bigger-150 middle"></i>
                </a>
            </li>

            <li class="<%=state.hasPreviousPage===false ? 'disabled' : ''%>">
                <a class="btn-previous<%=state.hasPreviousPage===false ? '-disabled' : ''%>">
                    <i class="icon-angle-left bigger-150 middle"></i>
                </a>
            </li>

            <%if(state.totalRecords){%>
            <li >
                <span>
                第
                    <input class="align-center" name="redirectTo" value="<%=state.currentPage !== void 0 ? state.currentPage + 1 : 0%>" maxlength="3" type="text">
                    页
                &nbsp;共&nbsp;<%=state.totalPages%>&nbsp;页&nbsp;
                </span>
            </li>
            <%}%>

            <li class="<%=state.hasNextPage===false ? 'disabled' : ''%>">
                <a  class="btn-next<%=state.hasNextPage===false ? '-disabled' : ''%>">
                    <i class="icon-angle-right bigger-150 middle"></i>
                </a>
            </li>

            <li class="<%=state.isLastPage===true ? 'disabled' : ''%>">
                <a  class="btn-last<%=state.isLastPage===true ? '-disabled' : ''%>">
                    <i class="icon-double-angle-right bigger-150 middle"></i>
                </a>
            </li>
        </ul>
    </div>