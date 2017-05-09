
    <div id="id-message-list-navbar" class="message-navbar align-center clearfix">
        <div class="message-bar">
            <div class="message-infobar" id="id-message-infobar">
                <span class="blue bigger-150">公告</span>
                <span class="grey bigger-110 unread-num-text"></span>
            </div>

            <div hidden class="message-toolbar">

                <%if(featureAvailConfig && featureAvailConfig.deleteNotice){%>
                <a href="#" class="btn btn-xs btn-message btn-edit">
                    <i class="icon-pencil bigger-125"></i>
                    <span class="bigger-110">修改</span>
                </a>
                <%}%>

                <%if(featureAvailConfig && featureAvailConfig.deleteNotice){%>
                <a href="#" class="btn btn-xs btn-message btn-delete">
                    <i class="icon-trash bigger-125"></i>
                    <span class="bigger-110">删除</span>
                </a>
                <%}%>
            </div>

        </div>

        <div>
            <div hidden class="nav-search minimized">
                <form class="form-search">
                    <span class="input-icon">
                        <input type="text" autocomplete="off" class="input-small nav-search-input" placeholder="搜索主题">
                        <i class="icon-search nav-search-icon"></i>
                    </span>
                </form>
            </div>

            <%if(featureAvailConfig && featureAvailConfig.newNotice){%>
            <div class="nav-add" title="发布公告">
                <span class="btn-add">
                    <i class="icon-plus icon"></i>
                </span>
            </div>
            <%}%>

            <div class="messagebar-item-right">
                <div class="inline position-relative">
                    显示 <select class="page-size-selet" name="pageNumber">
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="30">30</option>
                    </select> 条
                </div>
            </div>

        </div>
    </div>

    <div class="message-list-container">
        <div class="message-list" id="message-list">

            <table class="notices-table">
                <tbody class="notices-tbody">
                    
                </tbody>
            </table>

        </div>

    </div>

    <div class="message-footer clearfix">
        
    </div>
