define([
    'app/oms/route/noCard/common/BaseDetailModelView',
    'tpl!app/oms/route/noCard/templates/view-model-detail.tpl',
    'tpl!app/oms/route/noCard/channel/templates/relevance-txn-model.tpl'
], function(BaseDetailModelView, tpl, relevanceTxnTpl) {

    var STATUS_MAP = {
        '0' : '启用',
        '1' : '不启用',
        '3' : '注销'
    },BANKMARK_MAP = {
    '1':'是银商系'
    };


var View = BaseDetailModelView.extend({


        formTemplate: tpl,

        // @override
        relevanceModelTemplate: relevanceTxnTpl,
        onRender:function(){
            var me = this;
            BaseDetailModelView.prototype.onRender.apply(this,arguments);
            this.$el.find('.relevance-model-sit').hide();
        },
        // @override
        serializeFormData: function () {
            var formLayout = [
                { label: '序列号',      name: 'id' },
                { label: '通道名称',      name: 'channelName' },
                { label: '通道中文名称',  name: 'channelCnName' },
                { label: '通道状态',      name: 'status', formatter: function (val) { return STATUS_MAP[val] || ''; } },
                { label: '通道银商系标记',          name: 'bankMark',formatter: function(val){ return BANKMARK_MAP[val] ? BANKMARK_MAP[val] : '不是银商系';} },
                { label: '备注',          name: 'remark' }
            ];

            return { formLayout: formLayout, model: this.model };
        },

        // @override
        serializeRelevanceData: function () {
            return {
                txnModels: this.model.get('txnModels')
            };
            
        }
    });
    
    return View;
});