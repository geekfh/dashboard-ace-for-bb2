define([
    'app/oms/route/noCard/common/AbstractAddModelView',
    'app/oms/route/noCard/common/FieldsetGroup',
    'tpl!app/oms/route/noCard/channel/templates/add-channel-model.tpl',
    'common-ui'
], function(AbstractAddModelView, FieldsetGroup, tpl) {

    return AbstractAddModelView.extend({
        title: '新增通道模型',


        // 1:最大金额,  2:最小金额,  3:最大总额,  4:最小总额,  5:卡种类,  6:卡介质,  7:交易类型,  8:卡bin,  9:开户行,  10:开始时间,  11:结束时间
        conditions:  [
            {type: 'cmd_type'},
            {type: 'amount'},
            {type: 'card_no'},
            {type: 'card_type'},
            {type: 'card_kind'},
            {type: 'card_bank'},
            {type: 'disc'},
            {type: 'mcht_no'},
            {type: 'brh_no'},
            {type: 'scan_mode'},
            {type: 'credit_supp'},
            {type: 'region_code'},
            {type: 'term_no'},
            {type: 'term_type'},
            {type: 'tx_time'},
            {type: 'pin_type'},
            {type: 'card_amt'},
            {type: 'card_num'},
            {type: 'total_amt'},
            {type: 'total_num'},
            {type: 'mod_amt'},
            {type: 'mod_num'}

         ],

        formTemplate: tpl,

        ajaxOptions: {
            type: 'POST',
            url: url._('nocard.route.channel')
        },

        events: {
            'change [name="channelName"]' :  'onChannelNameChange'
        },

        onChannelNameChange: function () {
            var $channelName = this.$el.find('[name="channelName"]'), $channelCnName = this.$el.find('[name="channelCnName"]');

            if ($channelName.val()) {
                $channelCnName.val($channelName.find('option:selected').text());
            }
        },
        
        onRender: function () {
            AbstractAddModelView.prototype.onRender.apply(this, arguments);
            this.addSelects();

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
                    channelName: {
                        required: true
                    },
                    channelCnName: {
                        required: true
                    },
                    remark: {
                        required: true
                    }
                },
                messages: {
                    priority: '优先级范围：1-1000'
                }
            });

            this.onChannelNameChange();
            

        },

        addSelects: function () {
            CommonUI.noCradChannelName(this.$el.find('[name="channelName"]'));
        },  

        getFormValues: function() {
            var $el = this.$el;

            return {
                name:          $el.find('[name="name"]').val(),
                status:        $el.find('[name="status"]').val(),
                priority:      $el.find('[name="priority"]').val(),
                channelName:   $el.find('[name="channelName"]').val(),
                channelCnName: $el.find('[name="channelCnName"]').val(),
                remark:        $el.find('[name="remark"]').val()
            };
            
        },

        validateForm: function () {
            return this.$el.find('form.form').valid();
        }


    });

});