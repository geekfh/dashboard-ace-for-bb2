/**
 * 机构费率模型 编辑计费模型 表单
 * 
 */

define([
    'tpl!app/oms/disc/brh-disc/common/edit/templates/edit-model.tpl',
    'app/oms/disc/brh-disc/common/edit/disc-table-view',
    'jquery.validate',
    'select2',
    'common-ui'
    ],function(Tpl, DiscTableView){

        //是否统一分润
        var UNIT_RATIO = {
            YES: '0',
            NO: '1'
        };


        var View = Marionette.ItemView.extend({

            //@config
            title: '',

            template: Tpl,

            ui: {
                discTable: '.disc-table',
                form : '.edit-model-form',
                modelNm: '.model-name',
                modelBrh: '.model-branch-name',
                modelFlag: '.model-status',
                uniteRatio: '.model-unite-ratio',
                btnSetUnitRatio: '.btn-set-unite-ratio'
            },

            events: {
                'click .set-unite-ratio': 'showSettingUniteRatio'
            },

            initialize: function(options){
                this.modelRecord = options.modelRecord;
                this.originModelRecord = $.extend(true, {}, options.modelRecord);
            },

            onRender: function(){
                var me = this;

                this.attachEventListener();
                this.setDefaultVal();
                this.addValidation();

                CommonUI.select2Branch4DiscByInput(me.ui.modelBrh, {
                    modelType: this.getOption('modelType')
                });

                this.discTableView = new DiscTableView({
                    modelRecord: this.modelRecord,
                    renderTo: this.ui.discTable
                }).render(); 

                this.$dialog = Opf.Factory.createDialog(this.$el, {
                    destroyOnClose: true,
                    title: this.getOption('title'),
                    autoOpen: true,
                    width: 1100,
                    height: 550,
                    modal: true,
                    buttons: [
                        {type: 'submit',text: '保存',click: _.bind(this.onSubmit, this)},
                        {type: 'cancel'}
                    ]
                });
            },
            
            onSubmit: function () {
                var me = this;

                if(me.$('form').valid() && !me.needAdd()){
                    Opf.ajax({
                        //TODO 这种取 ID 不好，改！！！
                        url: url._('disc.brh',{id: me.modelRecord.id}),
                        type: "PUT",
                        jsonData: this.getPostData(),
                        success: function(){
                            me.trigger('submit:success');
                        },
                        complete: function(){
                            me.$dialog.dialog('close');
                        }
                    });
                }
                else{
                    Opf.alert('请补全所缺计费方案');
                }
            },

            getModelId: function () {
                return this.modelRecord.modelId;
            },

            getPostData: function(){
                return {
                    modelId: this.getModelId(),
                    modelNm: this.getModeNm(),
                    modelBrh: this.getModelBrh(),
                    modelFlag: this.getModelFlag(),
                    uniteRatio: this.getUniteRatio()
                };
            },

            setDefaultVal: function(){
                var me = this,
                    ui = me.ui;
                ui.modelNm.val(me.originModelRecord.modelNm);
                ui.modelFlag.val(me.originModelRecord.modelFlag);
                ui.uniteRatio.val(me.originModelRecord.uniteRatio).trigger('change.toggleBtnSetUnitRatioVisible');
                ui.modelBrh.val(me.originModelRecord.modelBrh);
            },

            attachEventListener: function(){
                var me = this;

                me.ui.uniteRatio.on('change.toggleBtnSetUnitRatioVisible', function(){
                    me.ui.btnSetUnitRatio.toggle($(this).val()==UNIT_RATIO.YES);
                    me.modelRecord.uniteRatio = $(this).val();
                })//
                //如果是初始化设置之后再绑定事件，就不用触发
                .trigger('change.toggleBtnSetUnitRatioVisible');
            },

            addValidation: function(){
                var me = this,
                    ui = me.ui;
                ui.form.validate({
                    rules:{
                        "model-name": {
                            required:true,
                            utf8ByteLength: [0, 40],
                            uniqueBrhDiscModelName: {
                                depends: function () {
                                    var shouldDo =  ui.modelBrh.val();
                                    //如果模型名称和机构名称跟初始值一样，则不验证
                                    if(ui.modelBrh.val() == me.originModelRecord.modelBrh && 
                                        ui.modelNm.val() == me.originModelRecord.modelNm) {
                                        shouldDo = false;
                                    }
                                    return shouldDo;
                                },
                                param: {
                                    brhCode: function () {
                                        return ui.modelBrh.val();
                                    }
                                }
                            }
                        },
                        "model-branch-name": {required:true}
                    },
                    messages:{
                        "model-name": {
                            required:"请输入模型名称",
                            checkBrhModelNmRepeat: "该模型名称已存在"
                        },
                        "model-branch-name": {required:"请选择"}
                    }
                });
            },

            showSettingUniteRatio: function(){
                var me = this;

                require(['app/oms/disc/brh-disc/common/edit/set-unite-ratio-dialog-view'], function(View) {

                    var view = new View({
                        modelId: me.modelRecord.modelId
                    }).render();

                    view.on('save:success', function() {
                        //保存完 分润设置 之后刷新计费方案列表
                        console.log('>>>保存统一分润成功 刷新计费方案列表');
                        me.discTableView.reload();
                    });
                });

            },

            getModeNm: function(){
                var ui = this.ui;
                return ui.modelNm.val();
            },
            getModelBrh: function(){
                var ui = this.ui;
                return ui.modelBrh.val();
            },
            getModelFlag: function(){
                var ui = this.ui;
                return ui.modelFlag.val();
            },
            getUniteRatio: function(){
                var ui = this.ui;
                return ui.uniteRatio.val();
            },

            needAdd: function(){
                return this.discTableView.needAdd();
            }
        });


        return View;

});