define([
    'app/oms/route/oneSettle/common/AbstractAddModelView',
    'tpl!app/oms/route/noCard/nocard-route-mcht-config/templates/add.tpl'
], function(AbstractAddModelView, tpl) {

    var valRules ={
        status: { required: true },
        mchtNo: { required: true, integer: true },
        mchtName: { required: true },
        channelName: { required: true },
        oneSettleChannel: { required: true },
        channelMchtNo: { required: false },
        rate: { required: true, 'float': true },
        maxFee: {required: false, 'float': true },
        priority: {required: true },
        //minFee: { 'float': true },
        // mccGroup: { required: true },
        // mcc: { required: true },
        province: { required: true },
        // city: { required: true },
        // regionCode: { required: true },
        remark: { required: true }

    };
    var EditView = AbstractAddModelView.extend({
        title: '修改无卡路由商户配置',

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
            {type: 'mcc'},
            {type: 'mcc_grp'},
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


        initialize: function () {
            AbstractAddModelView.prototype.initialize.apply(this, arguments);

        },
        onRender: function () {
            var me = this;
            AbstractAddModelView.prototype.onRender.apply(this, arguments);
            var $form = this.$el.find('form.form');


            this.addSelects();
            this.setupUI(me);


        },
        setupUI:function(me){
            me.$el.find('.condition-panel-sit').hide();
        },
        setFiledsets: function(me,params){
            delete(params.filedsets);
        },
        ajaxOptions: function () {
            return {
                type: 'PUT',
                url: url._('route.nocard.route.mcht.config', {id: this.model.id})//问题
            };
        },

        addSelects: function () {
            var regionCode = this.model.get('regionCode');
            var oneSettleChannel = this.model.get('oneSettleChannel');

            //CommonUI.mccSection(this.$el.find('[name="mccGroup"]'), this.$el.find('[name="mcc"]'), this.model.get('mccGroup'), this.model.get('mcc'));

            regionCode = regionCode ? Opf.Util.parseRegionCode(regionCode) : [];
            CommonUI.address(this.$el.find('[name="province"]'), this.$el.find('[name="city"]'), this.$el.find('[name="regionCode"]'), regionCode[0],  regionCode[1], regionCode[2]);

            CommonUI.noCradChannelName(this.$el.find('[name="oneSettleChannel"]'), oneSettleChannel);
        },
        getFormValues: function() {
            var $el = this.$el;
            return {
                mchtName:      $el.find('[name="mchtName"]').val(),
                mchtNo:        $el.find('[name="mchtNo"]').val(),
                status:        $el.find('[name="status"]').val(),
                oneSettleChannel:   $el.find('[name="oneSettleChannel"]').val(),
                channelMchtNo:   $el.find('[name="channelMchtNo"]').val(),
                rate:          $el.find('[name="rate"]').val(),
                maxFee:        $el.find('[name="maxFee"]').val(),
                priority:        $el.find('[name="priority"]').val(),
                scanMode:      $el.find('[name="scanMode"]').val(),
                creditSupp:    $el.find('[name="creditSupp"]').val(),
                regionCode:    $el.find('[name="regionCode"]').val() || $el.find('[name="city"]').val() || $el.find('[name="province"]').val() || '',
                dayMaxAmt:   $el.find('[name="dayMaxAmt"]').val(),
                remark:        $el.find('[name="remark"]').val()

            };
        },

        validateForm: function () {
            var $form = this.$el.find('form.form');
            var channelMchtNo =$form.find('[name="channelMchtNo"]').val();
            // 填写通道商户号的情况下，dayMaxAmt变为必填
            if(channelMchtNo && channelMchtNo != '' ){
                $.extend(valRules,{
                    dayMaxAmt: { required: true, 'float': true, floatGtZero: true, max: 9999999999 }
                });
            }else{
                $.extend(valRules,{
                    dayMaxAmt: { required: false, 'float': true, floatGtZero: true, max: 9999999999 }
                });
            }
            $form.data('validator',null);
            $form.validate({rules:valRules});
            return this.$el.find('form.form').valid();
        },

        serializeFormData: function () {
            return {
                data: this.model.toJSON()
            };
        }

    });
    
    return EditView;
});