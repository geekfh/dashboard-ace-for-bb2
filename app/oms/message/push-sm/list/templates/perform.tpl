<%

var deviceType = {
    '1': '所有用户',
    '2': 'Android用户',
    '3': 'ios用户',
    '4': null,
    '5': null
};

var formLayout = [
    {name: 'deviceType', label: '发送对象', formatter: function (val) {
        var value = deviceType[val];
        if(!value){
            value = model.get('phoneNoFile') ? ('<a class="download-xls" data-href="'+ model.get('phoneNoFile') +'">' + model.get('phoneNoFile').split('/').pop() + '</a>')
                    : (model.get('customPhoneNos')||[]).join(',');
        }
        return value;
    }},
    { name: 'smCategory',     label: '短信类型' },
    { name: 'content',        label: '短信内容' },
    { name: 'sendTime',       label: '发送方式', formatter: function (val) {
        return val || '立即发送';
    }},
    { name: 'resendTimes',    label: '重发设置', formatter: function (val) {
        return val != '0' ? '发送未成功，自动重发' + val + '次' : '未设置';
    }}
    
];

%>

<div class="message-perform-group">
    <div class="perform-content">

        <% _.each(formLayout, function (item) { %>
        <div class="content-form-group">
            <div class="col-xs-3 perform-label">
                <%= item.label %>:
            </div>
            <div class="col-xs-9 perform-value">
                <%= item.formatter ? item.formatter(model.get(item.name)) : model.get(item.name) %>
            </div>
        </div>

        <%  }); %>

    </div>


    <div class="perform-result">
        <form class="form-perform">
            <div class="result-form-group">
                <div class="col-xs-3 perform-label">
                    审核结果:
                </div>
                <div class="col-xs-9 perform-value">
                    <label class="perform-radio"><input type="radio" name="result" value="1" checked> 通过 </label>
                    <label class="perform-radio"><input type="radio" name="result" value="0"> 拒绝 </label>
                </div>
            </div>

            <div class="result-form-group">
                <div class="col-xs-3 perform-label">
                    审核说明:
                </div>
                <div class="col-xs-9 perform-value">
                    <textarea name="desc" class="perform-desc"></textarea>
                </div>
            </div>
        </form>
        
    </div>

    <div class="perform-operate">
        <button class="btn btn-sm btn-primary perform-submit"> 提 交 </button>
        <button class="btn btn-sm btn-default perform-cancel"> 取 消 </button>
    </div>
</div>