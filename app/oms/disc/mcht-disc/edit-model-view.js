/**
 * 商户费率模型 编辑某一个费率模型
 */

define([
    'app/oms/param/disc/mcht-disc/add-model-view'
    ], function(AddView){
        var View = AddView.extend({
            onRender: function(){
                this.setData(this.options);
            },

            setData: function(){
                var me = this,
                    ui = me.ui;
                ui.modelNm.val(options.modelNm);
                ui.modelBrh.val(options.modelBrh);
                ui.mchtGrp.val(options.mchtGrp);
                ui.transType.val(options.transType);
                ui.modelFlag.val(options.modelFlag);
                ui.modelId.val(options.modelId);
            }
        });

});