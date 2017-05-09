
<div class="model-detail-group">
    <table class="col-xs-12">
        <% _.each(formLayout, function (item) { %>
        
        <tr class="content-row">
            <td class="col-xs-4 text-right">
                <%- item.label %>
            </td>
            <td class="col-xs-8 text-left">
                <%- item.formatter ? item.formatter(model.get(item.name)) : (model.get(item.name) || '无')%>
            </td>
        </tr>

        <%  }); %>
        
    </table>
</div>


    
