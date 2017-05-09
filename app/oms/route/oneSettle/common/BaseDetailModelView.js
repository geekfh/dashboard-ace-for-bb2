define([
    'tpl!app/oms/route/oneSettle/templates/view-model-detail.tpl',
    'tpl!app/oms/route/oneSettle/common/templates/model-panel.tpl',
    'app/oms/route/oneSettle/common/DetailConditionPanel'
], function(tpl, modelPanelTpl, DetailConditionPanel) {

    var View = Marionette.ItemView.extend({

        //@abstract
        formTemplate: function () {return '';},

        //@abstract
        relevanceModelTemplate: null,

        //@abstract
        serializeFormData: function () {
            return {};
        },

        //@abstract 编辑类 需要覆盖
        serializeRelevanceData: function () {
            return {

            };
        },

        ui: {
            conditionPanelSit: '.condition-panel-sit',
            form: '.form',
            relevance: '.relevance-model-sit'
        },

        className: 'model-panel detail-model-panel',

        template: modelPanelTpl,

        initialize: function () {
            var me = this;

            this.collection = new Backbone.Collection();
            var filedsets = this.model.get('filedsets');

            _.each(filedsets, function (details) {
                me.collection.add({details: details});
            });

            this.render();
        },

        // initialize: function () {
        //     this.render();
        // },

        onRender: function () {
            var me = this;
            $(this.formTemplate(this.serializeFormData())).appendTo(this.ui.form);

            if (this.relevanceModelTemplate && this.serializeFormData) {
                $(this.relevanceModelTemplate(this.serializeRelevanceData())).appendTo(this.ui.relevance);
            }

            this.conditionPanel = new DetailConditionPanel({
                conditions: this.getOption('conditions'),
                collection: me.collection
            }).render();

            this.conditionPanel.$el.appendTo(this.ui.conditionPanelSit);
            me.showDialog();

        },
        showDialog: function(){
            Opf.Factory.createDialog(this.$el, {
                dialogClass: 'theme-bb bb-dialog',
                open: true,
                destroyOnClose: true,
                width: 460,
                maxHeight: 700,
                modal: true,
                title: this.getOption('title'),
                buttons: [{
                    type: 'cancel',
                    text: '关闭'
                }]
            });
        }

    });
    
    return View;
});