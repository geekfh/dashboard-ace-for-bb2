define([
    'app/oms/route/noCard/common/AbstractAddModelView',
    'app/oms/route/noCard/common/FieldsetGroup',
    'tpl!app/oms/route/noCard/txn/templates/add-txn-model.tpl'
], function(AbstractAddModelView, FieldsetGroup, txnTpl) {

    return AbstractAddModelView.extend({
        title: '新增交易模型',

        ajaxOptions: {
            type: 'POST',
            url: url._('nocard.route.txn')
        },

        conditions:  [
            {type: 'cmd_type'},
            {type: 'amount'},
            {type: 'card_no'},
            {type: 'card_type'},
            {type: 'card_kind'},
            {type: 'card_bank'},
            {type: 'disc'},
            {type: 'mcht_no'},
            {type: 'mcht_type'},
            {type: 'fee_type'},
            {type: 'brh_no'},
            {type: 'scan_mode'},
            {type: 'credit_supp'},
            {type: 'region_code'},
            {type: 'term_no'},
            {type: 'term_type'},
            {type: 'tx_time'}
         ],

        formTemplate: txnTpl,
        
        onRender: function () {
            AbstractAddModelView.prototype.onRender.apply(this, arguments);
            
            var $form = this.$el.find('form.form');
            $form.validate({
                rules: {
                    name: {
                        required: true
                    },
                    status: {
                        required: true
                    },
                    priority: {
                        required: true,
                        integer: true,
                        integerScope: [1, 1000]
                    },
                    remark: {
                        required: true
                    }
                },
                messages: {
                    priority: '优先级范围：1-1000'
                }
            });

        },

        getFormValues: function() {
            var $el = this.$el;
            return {
                name:     $el.find('[name="name"]').val(),
                status:   $el.find('[name="status"]').val(),
                priority: $el.find('[name="priority"]').val(),
                remark:   $el.find('[name="remark"]').val()
            };
        },

        validateForm: function () {
            return this.$el.find('form.form').valid();
        }


    });

});