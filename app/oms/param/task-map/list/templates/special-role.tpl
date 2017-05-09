<%
    var NUM_MAP = {
        '1': '一',
        '2': '二',
        '3': '三'
    }
%>


<div class="caption" style="margin-bottom: 12px;"> 
    <% if (mapType === 0) {  %>

    <b>默认规则</b> 

    <% } else { %>

    <b>特殊规则: <%=brhName %></b> 
    <b style="margin-left: 10px;"><i class="remove-special-role icon-trash"></i></b>

    <%  } %>

</div>

<form class="special-form">
<div class="form-horizontal">
    <div class="form-group">
        <label class="col-md-3 control-label task-map-label">主要涉及:</label>
        <div class="col-md-4">
            <select class="form-control" name="taskFlag">
                <option value="0">不用工作流</option>
                <option value="1">一个环节</option>
                <option value="2">两个环节</option>
                <option value="3">三个环节</option>
            </select>
        </div>
    </div>

    <% for(var i=1; i<=3; i++) { %>
    <div class="form-group" SpTaskLink="<%=i %>">
        <label class="col-md-3 control-label task-map-label">第<%=NUM_MAP[i] %>个环节:</label>
        <div class="col-md-4">
            <select class="form-control brh-level-sel" brhLevLink="<%=i %>"  name="brhLevel<%=i %>">
                <option value="0">零级机构</option>
                <option value="1">一级机构</option>
                <option value="2">二级机构</option>
                <option value="3">三级机构</option>
                <option value="4">四级机构</option>
                <option value="5">五级机构</option>
                <option value="6">六级机构</option>

                <% if (i === 1 && taskType && (taskType.split(',')[1] === '103' || taskType.split(',')[1] === '206')) { %>
                <option value="-1">本级机构</option>
                <%  }  %>

            </select>
        </div>

        <div class="col-md-5">
            <input class="form-control role-pull" name="roleCode<%=i %>">
        </div>
    </div>

    <% } %>
    
</div>
</form>