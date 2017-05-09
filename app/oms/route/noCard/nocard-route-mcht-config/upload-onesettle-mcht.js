define([
    'app/oms/route/noCard/mcht-channel/upload-mchts'
],function(UploadMchts){

    var OnesettleMchtView = UploadMchts.extend({
        getExeclTemplteUrl: function(){
            return url._('route.download.nocard.excel');
        },
        getUploadUrl: function(){
            return url._('route.upload.nocard.excel');
        },
        getTitle: function(){
            return '上传无卡路由商户';
        }
    });

    return OnesettleMchtView;

});
