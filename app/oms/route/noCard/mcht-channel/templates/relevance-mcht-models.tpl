<%
    var channelModelNames = _.map(channelModels, function (item) { 
        return item.name;
    });
%>

<div class="col-xs-12">
关联的通道模型：<%- channelModelNames.join(', ') %>
</div>