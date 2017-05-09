<div class="target-select-panel">
<!-- 所有内容顶上的元素都要放在top-part,便于计算content-wrap的可用高度 
-->
    <div class="top-part">
    <form class="search-form">
        <div class="search-wrap">
            <input type="text" placeholder="<%=searchInputPlaceHolder%>" class="search-input"/>
            <button type="submit" class="search-btn"><%=searchSubmitBtnText%></button>
            <a href="#" class="cancel-btn">取消搜索</a>
        </div>
    </form>

        <div class="caption-line">
        <%=captionHtml%>
        </div>
    </div>

    <div class="content-wrap clearfix"></div>
</div>