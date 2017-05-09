<div class="info-board">
    <div class="row task-group">
        <div role="form" id="submit-data">
            <!-- info section -->
            <%
                var infoSection = config.infoSection;
            %>
            <div class="form-section">
                <div class="container row-margintop">
                    <div class="caption caption-text-font"><%=infoSection.legend%></div>
                    <% _.each(infoSection.items, function(item){
                        var itemVal = Opf.get(data, item.key);
                        var isCheckable = (item.checkable!==false && data.faceRecognitionStatue!="5")? 'checkable':'';
                        var isImgWrapper = item.type=="image"? 'img-wrap':'';
                    %>
                    <div class="row row-text-font row-margintop <%=item.key%>-row">
                        <label class="col-xs-4 info-item-text"><%= item.label %>:</label>
                        <div class="col-xs-2 <%=isImgWrapper%> <%=isCheckable%>" name="<%=item.key%>">
                            <% if(item.type=="image"){ %>
                                <div class="img-inner-wrap">
                                    <span class="vertical-helper"></span><img src="<%=itemVal%>?_t=<%=(new Date()).getTime()%>">
                                </div>
                            <% } else{ %>
                                <span class="text">
                                    <%= item.formatter? item.formatter(itemVal) : itemVal%>
                                </span>
                            <%}%>
                        </div>
                    </div>
                    <%});%>
                </div>
            </div>

            <!-- image section -->
            <%
                var imageSection = config.imageSection;
            %>
            <div class="form-section">
                <div class="container row-margintop">
                    <%
                    for(var k in imageSection){
                        if(k == "legend"){
                    %>
                    <div class="caption caption-text-font"><%=imageSection.legend%></div>
                    <% }else{ %>
                    <div class="col-xs-6">
                    <%
                        _.each(imageSection[k].items, function(item){
                            var itemVal = Opf.get(data, item.key);
                            var isCheckable = (item.checkable!==false && data.ocrStatue!="5")? 'checkable':'';
                    %>
                        <% if(item.type=="text"){ %>
                        <div class="row row-margintop <%=item.key%>-row">
                            <label class="col-xs-4 info-item-text"><%= item.label %>:</label>
                            <div class="col-xs-8 <%=isCheckable%>" name="<%=item.key%>">
                                <span class="text">
                                    <%= item.formatter? item.formatter(itemVal) : itemVal%>
                                </span>
                            </div>
                        </div>
                        <% }else{ if(itemVal){ %>
                        <div class="col-xs-6 img-wrap checkable" name="<%=item.key%>">
                            <div class="img-inner-wrap">
                                <span class="vertical-helper"></span><img src="<%=itemVal%>?_t=<%=(new Date()).getTime()%>">
                            </div>
                            <div class="img-name-wrap">
                                <span class="img-name"><%= item.label %></span>
                            </div>
                        </div>
                        <% }}});} %>
                    </div>
                    <%}%>
                </div>
            </div>
        </div>
    </div>
</div>