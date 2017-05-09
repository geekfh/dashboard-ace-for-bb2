/**
 * 费率模型是 商户费率与基准费率一一对应 时，要求用户填写的 基准收费方案列表
 */

define([
    'app/oms/disc/mcht-disc/scheme-list-view'
    ], function(SchemeView){
    var View = SchemeView.extend({
        templateHelpers: function(){
            return {
                scheme: "基准收费方案"
            };
        },
        onRender: function(){
            this.enableAdd();
        }
    });
    return View;
});