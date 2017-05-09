<%
    var txnModelNames = _.map(txnModels, function (item) { 
        return item[1];
    });
%>

<div class="col-xs-12">
关联的交易模型：<%- txnModelNames.join(', ') %>
</div>