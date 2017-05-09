define([], function(){
    var format = {}, me = format;

    format.PUSH_APP_MAP = {
        '1': '钱盒商户通',
        '2': '个人端',
        '3': '开通宝',
        '5': 'S300',
        '6': '盒伙人'
    };
    format.PUSH_STATUS_MAP = {
        '1':'待审核',
        '2':'已审核',
        '3':'已发送',
        '4':'已撤销',
        '5':'已取消',
        '6':'发送失败',
        '7':'发送中'
    };
    format.PUSH_DEVICE_MAP = {
        '1': '所有用户',
        '2': '仅Android用户',
        '3': '仅ios用户',
        '4': '导入用户'
    };
    format.PUSH_TYPE_MAP = {
        '1': '即时发送',
        '2': '定时发送'
    };
    format.PUSH_OBJECT_MAP = {
        '11': '所有钱盒用户',
        '12': '部分钱盒用户',
        '13': '部分钱盒选择用户',
        '14': '部分钱盒机构用户',
        '21': '所有个人端用户',
        '22': '部分个人端用户',
        '23': '部分个人端选择用户',
        '24': '部分个人端机构用户',
        '31': '所有开通宝用户',
        '32': '部分开通宝用户',
        '33': '部分开通宝选择用户',
        '34': '部分开通宝机构用户',
        '51': '所有S300用户',
        '52': '部分S300用户',
        '53': '部分S300选择用户',
        '54': '部分S300机构用户',
        '61': '所有盒伙人用户',
        '62': '部分盒伙人用户',
        '63': '部分盒伙人选择用户'
    };
    format.PUSH_POSITION_MAP = {
        '1': '打开主页面',
        '2': '打开交易流水页面',
        '3': '打开清算结果页面',
        '4': '打开消息中心'
    };
    format.ISPUSH_MAP = {
        '0': '否',
        '1': '是'
    };

    format.pushApp = function(cellvalue, options, rowObject) {
        var pushObject = rowObject.pushObject;
        var pushObjectType = pushObject.split('')[0];
        return me.PUSH_APP_MAP[pushObjectType] || '';
    };

    format.msgContent = function(cellvalue, options, rowObject) {
        var contentHtml;
        if(rowObject.msgType == 1){
            var content = [];
            content.push('<span title='+ cellvalue +'>');
            content.push(String(cellvalue).substring(0, 30));
            content.push(cellvalue.length > 30 ? '...' : '');
            content.push('</span>');
            contentHtml = content.join('');
        }else{
            var match = /http[s]?:\/\//;
            var url = match.test(cellvalue) ? cellvalue : 'http://' + cellvalue;
            contentHtml = '<a href='+ url +' target="_blank">'+ url +'</a>';
        }
        return contentHtml;
    };

    format.pushDate = function(cellvalue, options, rowObject) {
        return cellvalue ? moment(cellvalue, 'YYYYMMDDHHmm').formatYMDHm() : '无';
    };

    format.pushStatus = function(cellvalue, options, rowObject) {
        return me.PUSH_STATUS_MAP[cellvalue] || '';
    };

    format.pushDevice = function(cellvalue, options, rowObject) {
        return me.PUSH_DEVICE_MAP[cellvalue] || '';
    };

    format.pushType = function(cellvalue, options, rowObject) {
        return me.PUSH_TYPE_MAP[cellvalue] || '';
    };

    format.pushObject = function(cellvalue, options, rowObject) {
        return me.PUSH_OBJECT_MAP[cellvalue]||"";
    };

    format.pushPosition = function(cellvalue, options, rowObject) {
        return me.PUSH_POSITION_MAP[cellvalue]||"";
    };

    format.pushDetail = function(cellvalue, options, rowObject) {
        if(cellvalue){
            return '<a class="download-xls">' + cellvalue.split('/').pop() + '<span hidden>'+ cellvalue +'</span></a>';
        }else{
            return '无';
        }
    };

    format.isPush = function(cellvalue, options, rowObject) {
        return me.ISPUSH_MAP[cellvalue] || '';
    };

    format.pushContent = function(cellvalue, options, rowObject) {
        return cellvalue || '无';
    };

    format.msgPreview = function(cellvalue, options, rowObject) {
        if(cellvalue=="无") return cellvalue;

        var formatStr = "";
            formatStr += '<div class="container">';
            formatStr += '<div class="row">';
            formatStr += '<div class="col-xs-6"><img title="消息图片" src="'+rowObject.previewImageUrl+'" style="width:100%; height:auto; max-height:200px;" /></div>';
            formatStr += '<div class="col-xs-6"><p class="text-muted" style="font-size:12px;">'+rowObject.previewContent+'</p></div>';
            formatStr += '</div>';
            formatStr += '</div>';

        return formatStr;
    };

    return  format;

});