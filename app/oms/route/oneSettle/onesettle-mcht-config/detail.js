define([
    'app/oms/route/oneSettle/common/BaseDetailModelView',
    'tpl!app/oms/route/oneSettle/templates/view-model-detail.tpl',
    'tpl!app/oms/route/oneSettle/mcht-channel/templates/relevance-mcht-models.tpl'
], function(BaseDetailModelView, tpl, relevanceMchtTpl) {

    var STATUS_MAP = {
        '0' : '启用',
        '1' : '不启用'
        //'2' : '当日已走满'
    };

    var CHANNEL_NAME_MAP = {};

    var View = BaseDetailModelView.extend({
        
        formTemplate: tpl,

        // @override
        relevanceModelTemplate: relevanceMchtTpl,

        // @override
        onRender: function () {
            var me = this;
            var xx = arguments;
            me.$el.find('.relevance-model-sit').hide();
            
            Opf.ajax({
                url: url._('route.channel.name'),
                type: 'GET',
                success: function (resp) {
                    var result = {};

                    _.each(resp, function (item) {
                        result[item.value] = item.name;
                    });

                    CHANNEL_NAME_MAP = result;
                    BaseDetailModelView.prototype.onRender.apply(me, xx);
                }
            });
        },

        // @override
        serializeFormData: function () {
            var formLayout = [
                { label: '商户名',        name: 'mchtName' },
                { label: '商户号',        name: 'mchtNo' },
                { label: '状态',      name: 'status', formatter: function (val) { return STATUS_MAP[val] || ''; } },
                { label: '所属一清通道',  name: 'oneSettleChannel', formatter: function (val) { return CHANNEL_NAME_MAP[val] || val || ''; } },
                { label: '通道商户号',          name: 'channelMchtNo' },
                { label: '费率',          name: 'rate' },
                { label: '封顶手续费',    name: 'maxFee' },
                { label: '优先级',    name: 'priority' },
                //{ label: '最低手续费',    name: 'minFee' },
                { label: '商户MCC组',     name: 'mccGroup' },
                { label: '商户MCC码',     name: 'mcc' },
                { label: '商户地区码',    name: 'regionCode' },
                { label: '单日最大金额',  name: 'dayMaxAmt' },
                { label: '备注',          name: 'remark' }

            ];

            return { formLayout: formLayout, model: this.model };
        },

        //@override
        serializeRelevanceData: function () {
            return {
                channelModels: {}
            };

        }
    });
    
    return View;
});




