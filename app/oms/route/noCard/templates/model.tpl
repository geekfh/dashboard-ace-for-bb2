<%
    var WAY_MAP = {
        'random':  '<i class="random-way icon-random pull-right"></i>',
        'seriate': '<i class="seriate-way icon-long-arrow-down pull-right"></i>',
        'equal':   '<i class="equal-way icon-long-arrow-right pull-right"></i>'
    }

%>


<div class="model-content">

    <div class="model-left-check">
        <label class="label-pointer">
            <input name="checkbox" class="sel-ckb ace ace-checkbox-2" type="checkbox">
            <span class="lbl"></span>
        </label>
    </div>

    <div class="details-model-content">
        <div class="model-head">
            <div class="model-head-title"><%= model.get('name') || model.get('mchtName') %></div>

            <div class="model-operate">
                
                <%= WAY_MAP[model.get('way')] %>

                <% if (permission.del === true) { %>
                <i class="del-model icon-trash pull-right"></i>
                <% } %>

                <!-- <i class="view-model icon-search pull-right"></i> -->
                <% if (permission.edit === true) { %>
                <i class="edit-model icon-edit pull-right"></i>
                <% } %>

            </div>
        </div>

        <div class="model-remark">
            <%= model.get('remark') || '无描述' %>
        </div>
    </div>

</div>