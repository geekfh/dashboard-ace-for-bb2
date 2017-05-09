define([
'app/oms/route/noCard/common/ConditionPanel',
'tpl!app/oms/route/noCard/common/templates/model-panel.tpl'
], function(ConditionPanel, modelPanelTpl) {

    var View = Marionette.ItemView.extend({

        className: 'add-model-panel model-panel',

        template: modelPanelTpl,

        ui: {
            conditionPanelSit: '.condition-panel-sit',
            form: '.form'
        },

        initialize: function() {
            this.render();
        },

        //@abstract
        formTemplate: null,

        //@abstract
        FieldsetGroupView: null,

        //@abstract
        ajaxOptions: {

        },

        //@abstract
        getFormValues: function() {

        },

        //@abstract
        onBeforeSubmit: function() {
            return this.validateForm() && this.validationConditionPanel();
        },

        //@abstract
        validateForm: function () {
            return true;
        },

        //@abstract
        validationConditionPanel: function () {
            return this.conditionPanel.validate();
        },

        onSubmit: function() {
            var me = this;

            if (this.onBeforeSubmit() === false) {

                return;
            }
            var params = me.getFormValues();
            me.setFiledsets(me,params);
            me.commit(params);

        },
        commit: function(params){
            var me = this;
            Opf.confirm('确认提交？', function (confirm) {
                if (!confirm) {
                    return;
                }
                var myAjaxOptions = _.result(me, 'ajaxOptions');

                if(!myAjaxOptions.type && !myAjaxOptions.url) {
                    console.error('ajaxOptions 需要配置 url 和 type');
                }

                var ajaxOptions = $.extend({
                    jsonData: params,
                    success: function(resp) {
                        me.$dialog.dialog('close');
                        me.destroy();
                        me.trigger('submit:success', resp);

                    }
                }, myAjaxOptions);

                Opf.ajax(ajaxOptions);

            });
        },


        //@abstract 编辑类 需要覆盖
        serializeFormData: function () {
            return {
                data: {}
            };
        },
        setFiledsets: function(me,params){
            params.filedsets = me.conditionPanel.getObjValue();
        },

        onRender: function() {
            var me = this;

            $(this.formTemplate(this.serializeFormData())).appendTo(this.ui.form);

            this.conditionPanel = new ConditionPanel({
                model: this.model,
                conditions: this.getOption('conditions')
            }).render();

            this.conditionPanel.$el.appendTo(this.ui.conditionPanelSit);

            Opf.UI.fixedBody(true);

            var $dialog = this.$dialog = Opf.Factory.createDialog(this.$el, {
                dialogClass: 'theme-bb bb-dialog',
                destroyOnClose: true,
                width: 500,
                height: 600,
                modal: true,
                title: this.getOption('title'),
                buttons: [{
                    type: 'submit',
                    click: function() {
                        me.onSubmit();
                    }
                }, {
                    type: 'cancel'
                }]
            });

            $dialog.on('dialogclose', function () {
                Opf.UI.fixedBody(false);
            });

        }


    });
    return View;

});