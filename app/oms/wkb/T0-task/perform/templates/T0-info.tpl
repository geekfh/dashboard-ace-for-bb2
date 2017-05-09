<%
console.log(data);
var infoSections = [
    {key: 'mchtNo', label: '商户号', noCheckable: true},
    {key: 'mchtName', label: '商户名称', noCheckable: true},
    {key: 'licNo', label: '营业执照号'},
    {key: 'taxNo', label: '税务登记号'},
    {key: 'orgCode', label: '机构组织代码'}
];

var imgSections = [
    {key: 'orgImage', label: '组织机构证图片'},
    {key: 'taxImage', label: '税务登记证图片'},
    {key: 'license',label: '营业执照照片'}
];

%>


<div class="info-board">
    <div class="row task-group">
        <div role="form" id="submit-data">

            <div class="form-section">
                <div class="container row-margintop">
                    <div class="caption caption-text-font">基本信息</div>
                    <% _.each(infoSections, function(item){
                        var itemVal = Opf.get(data, item.key);
                    %>
                    <div class="row row-text-font row-margintop" name="<%=item.key%>-row">
                        <label class="col-lg-4 info-item-text"><%= item.label %>:</label>
                        <div class="<%= item.noCheckable ? '' : 'checkable'%> value col-lg-8 checkable-text" name="<%=item.key%>">
                            <span class="text">
                                <%= itemVal ? (item.formatLabel ? item.formatLabel(itemVal) : itemVal) : '无'%>
                            </span>
                        </div>
                    </div>
                    <%});%>
                </div>
            </div>

            <div class="form-section">
                <div class="container row-margintop">
                    <div class="caption caption-text-font">照片信息</div>
                    <% _.each(imgSections, function(item){
                        var itemVal = Opf.get(data, item.key);
                        if(itemVal){
                    %>
                        <div class="col-lg-6 bank-img-wrap img-wrap checkable" name="<%=item.key%>">
                            <div class="img-inner-wrap">
                                <span class="vertical-helper"></span><img src="<%=itemVal%>?_t=<%=(new Date()).getTime()%>">
                            </div>
                            <div class="img-name-wrap">
                                <span class="img-name"><%= item.label %></span>
                            </div>
                        </div>
                        <%}%>
                    <%});%>
                </div>
            </div>

        </div>
    </div>
</div>