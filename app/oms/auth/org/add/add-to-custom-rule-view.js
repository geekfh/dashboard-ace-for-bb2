define([
    'tpl!app/oms/auth/org/add/templates/add-to-custom-rule.tpl',
    'tpl!app/oms/auth/org/add/templates/add-to-custom-rule-item.tpl',
    'app/oms/auth/rule/detail-view'
], function(tpl, ruleItemTpl, DetailView) {

    var ItemView = Marionette.ItemView.extend({
        tagName: 'tr',
        template: ruleItemTpl,
        ui: {
            'selectChk': '.select-chk'
        },
        events: {
            'click .col-name': function() {
                this.ui.selectChk.prop('checked', !this.ui.selectChk.prop('checked'));
            }
        },
        triggers: {
            'click .btn-detail': 'view:detail'
        },
        isSelected: function () {
            return this.ui.selectChk.prop('checked');
        }
    });

    var ListView = Marionette.CompositeView.extend({

        template: tpl,

        className: 'add-to-rule-panel',

        childViewContainer: '.list',

        childView: ItemView,

        ui: {
            modal: '.modal',
            selectedPanelSit: '.selected-panel-sit',
            optionPanelSit: '.option-panel-sit',
            list: '.list'
        },

        events: {
            'click .btn-submit': 'onSubmit',
            'click .btn-cancel': 'onCancel',
            'click button.close': 'onCancel'
        },

        initialize: function() {
            var me = this;

            Marionette.CompositeView.prototype.initialize.apply(this, arguments);

            this.deferBranches = Opf.ajax({url:url._('rule.branches')}).done(function (resp) {
                me.branches = resp;
            });

            this.deferOperators = Opf.ajax({url:url._('rule.operators')}).done(function (resp) {
                me.operators = resp;
            });
            this.render();
        },

        onCancel: function () {
            var me = this;
            this.trigger('cancel');

            // _.defer(function () {
                me.destroy();
            // });
        },


        onChildviewViewDetail: function (childView) {
            var me = this;

            //{id:1000717, ruleId:1000283, type:0-机构  1-拓展员, value:拓展员记录ID / 机构号, descr:null}
            var deferRuleDetail = Opf.ajax({
                url: url._('rule', {id:childView.model.id})
            });

            $.when(deferRuleDetail, this.deferBranches, this.deferOperators).done(function (ruleDetailResp) {
                var detailView = new DetailView({
                    model: new Backbone.Model(ruleDetailResp[0]),
                    branches: me.branches,
                    operators: me.operators
                }).render();
            });
        },

        destroy: function () {
            this.ui.modal.modal('hide');
            Marionette.CompositeView.prototype.destroy.apply(this, arguments);
        },

        onSubmit: function () {
            this.trigger('submit', this.getSels());
        },

        getSels: function () {
            var arr = [];
            this.children.each(function (childview) {
                if(childview.isSelected()) {
                    arr.push(childview.model.get('id'));
                }
            });
            return arr;
        },

        onRender: function() {
            this.$el.appendTo(document.body);

            this.ui.modal.modal({
                backdrop: 'static'
            });

            Opf.Utils.scrollLoadMore({
                prefill: true,
                target: this.ui.list,
                collection: this.collection,
                height: 300
            });
        }

    });

    return ListView;
});