define([
    'tpl!app/oms/disc/brh-disc/brh-profit/templates/edit.tpl',
    'jquery.validate'
    ], function(Tpl){
    var View = Marionette.ItemView.extend({
        template: Tpl,
        initialize: function(){

        },
        ui: {
            form: 'form',
            modelNm: '.model-name',
            selectedStandard: 'input[name=standard]:checked',
            selectedTreaty: 'input[name=treaty]:checked'
        },
        onRender: function(){
            var me = this;
            me.setDefaultValue();
            me.addValidation();
        },
        setDefaultValue: function(){
            var me = this;
            me.$('[value="' + me.model.get('standardId') + '"]').prop('checked', true);
            me.$('[value="' + me.model.get('treatyId') + '"]').prop('checked', true);
        },

        addValidation: function(){
            var me = this,
                ui = me.ui;
            ui.form.validate({
                rules:{
                    "model-name": {
                        required:true,
                        checkProfitNmRepeat: {
                            ignore: [ui.form.find('input[name="model-name"]').val()]
                        }

                    }
                },
                messages:{
                    "model-name": {
                        required:"请输入方案名称",
                        checkProfitNmRepeat: "该方案名称已存在"
                    }

                }
            });
        },
        isValid: function(){
            return this.ui.form.valid();
        },
        getModelNm: function(){
            return this.ui.modelNm.val();
        },
        getStandardId: function(){
            return this.$('input[name=standard]:checked').val();
        },
        getTreatyId: function(){
            return this.$('input[name=treaty]:checked').val();
        },
        getStandardNm: function(){
            return this.$('input[name=standard]:checked').closest('li').find('span').text();
        },
        getTreatyNm: function(){
            return this.$('input[name=treaty]:checked').closest('li').find('span').text();
        }
    });

    return View;
});