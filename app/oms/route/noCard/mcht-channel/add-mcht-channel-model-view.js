define([
    'app/oms/route/noCard/common/AbstractAddModelView',
    'app/oms/route/noCard/common/FieldsetGroup',
    'tpl!app/oms/route/noCard/mcht-channel/templates/add-mcht-channel-model.tpl',
    'common-ui'
], function(AbstractAddModelView, FieldsetGroup, tpl) {

    return AbstractAddModelView.extend({
        title: '新增通道商户模型',

        // 1:最大金额, 2:最小金额, 3:最大总额, 4:最小总额, 5:交易类型, 6:大额金额, 7:大额笔数, 8:小额金额, 9:小额笔数
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
            {type: 'total_amt'},
            {type: 'total_num'},
            {type: 'bamt_num'},
            {type: 'lamt_num'}

         ],

        formTemplate: tpl,

        ajaxOptions: {
            type: 'POST',
            url: url._('route.nocard.mcht')
        },
        
        onRender: function () {
            AbstractAddModelView.prototype.onRender.apply(this, arguments);
            var $form = this.$el.find('form.form');
            this.addSelects();
            
            $form.validate({
                rules: {
                    name: { required: true },
                    status: { required: true },
                    priority: { required: true, integer: true },
                    mchtNo: { required: true, integer: true },
                    mchtName: { required: true },
                    channelName: { required: true },
                    rate: { required: true, 'float': true },
                    chaZsnm: { required: true },
                    maxFee: { 'float': true },
                    minFee: { 'float': true },
                    scanMode: {required: true},
                    creditSupp: {required: true},
                    // mccGroup: { required: true },
                    // mcc: { required: true },
                    //province: { required: true },
                    // city: { required: true },
                    // regionCode: { required: true },
                    maxTotalAmt: { required: true, 'float': true, floatGtZero: true, max: 9999999999 },
                    remark: { required: true }

                }
            });

        },

        addSelects: function () {
            //CommonUI.mccSection(this.$el.find('[name="mccGroup"]'), this.$el.find('[name="mcc"]'));
            CommonUI.address(this.$el.find('[name="province"]'), this.$el.find('[name="city"]'), this.$el.find('[name="regionCode"]'));
            CommonUI.noCradChannelName(this.$el.find('[name="channelName"]'));

        },

        getFormValues: function() {
            var $el = this.$el;
            return {
                name:          $el.find('[name="name"]').val(),
                status:        $el.find('[name="status"]').val(),
                priority:      $el.find('[name="priority"]').val(),
                mchtNo:        $el.find('[name="mchtNo"]').val(),
                mchtName:      $el.find('[name="mchtName"]').val(),
                channelName:   $el.find('[name="channelName"]').val(),
                rate:          $el.find('[name="rate"]').val(),
                directMchtNo:  $el.find('[name="directMchtNo"]').val(),
                chaZsnm:       $el.find('[name="chaZsnm"]').val(),
                maxFee:        $el.find('[name="maxFee"]').val(),
                minFee:        $el.find('[name="minFee"]').val(),
                scanMode:      $el.find('[name="scanMode"]').val(),
                creditSupport: $el.find('[name="creditSupport"]').val(),
                regionCode:    $el.find('[name="regionCode"]').val() || $el.find('[name="city"]').val() || $el.find('[name="province"]').val() || '',
                maxTotalAmt:   $el.find('[name="maxTotalAmt"]').val(),
                remark:        $el.find('[name="remark"]').val()

            };
        },

        validateForm: function () {
            return this.$el.find('form.form').valid();
        }


    });

});