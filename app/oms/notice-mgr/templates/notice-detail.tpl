<%
    var featureAvailConfig = typeof featureAvailConfig !== 'undefined' ? featureAvailConfig : {}
%>
<div id="id-message-item-navbar" class="message-navbar align-center clearfix">

    <div class="message-bar">
        <div class="message-toolbar">

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
        <div class="messagebar-item-left">
            <a href="#" class="btn-back-message-list btn-back">
                <i class="icon-arrow-left blue bigger-110 middle"></i> <b class="bigger-110 middle">返回</b>
            </a>
        </div>

        <div class="messagebar-item-right">
            <i class="icon-time bigger-110 orange middle"></i>
            <span title=<%=lastModified%> class="time grey"><%=formatTime(lastModified)%></span>
        </div>
    </div>
</div>

<div class="message-content" id="id-message-content">
    <div class="wrap">
        <div class="message-header clearfix">
            <div class="pull-left">
                <span class="blue bigger-125"><%=subject%></span>
            </div>
        </div>
        

        <div class="hr hr-double"></div>

        <div class="message-body">
            <%=content%>
        </div>

        <%if(!_.isEmpty(attachments)){%>
            <div class="hr hr-double"></div>

            <div class="message-attachment clearfix">
                <div class="attachment-title">
                    <span class="blue bolder bigger-110">附件</span>
                    &nbsp;
                    <span class="grey">(<%=attachments.length%>个文件)</span>
                </div>
                &nbsp;
                <ul class="attachment-list pull-left list-unstyled">
                <%_.each(attachments, function (item, index) {%>
                    <li class="attached-file-item">
                        <form target="attach<%=index%>" action="api/announcement/download-attachment?fileName=<%=item.filename%>&url=<%=item.url%>" hidden method="post"></form>
                        <iframe name="attach<%=index%>" hidden></iframe>
                        <a target="_blank" title="<%=item.filename%>" class="attached-file inline">
                            <i class="icon-file-alt bigger-110 middle"></i>
                            <span class="attached-name middle"><%=item.filename%></span>
                            &nbsp;
                            (<%=formatSize(item.size)%>)
                        </a>
    <!--                     <div class="action-buttons inline">
                            <a href="#" class="btn-download">
                                <i class="icon-download-alt bigger-125 blue"></i>
                            </a>
                        </div> -->
                    </li>
                <%});%>
                </ul>
            </div>
        <%}%>
    </div>
</div>