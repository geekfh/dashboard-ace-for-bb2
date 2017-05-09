define([
    'app/oms/route/oneSettle/mcht-channel/upload-mchts'
],function(UploadMchts){

    var OnesettleMchtView = UploadMchts.extend({
        getExeclTemplteUrl: function(){
            return url._('route.download.onesettle.excel');
        },
        getUploadUrl: function(){
            return url._('route.upload.onesettle.excel');
        },
        getTitle: function(){
            return '上传一清商户';
        }
    });

    return OnesettleMchtView;

});
