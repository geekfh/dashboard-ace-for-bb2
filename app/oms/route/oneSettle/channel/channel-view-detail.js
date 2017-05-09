define([
    'app/oms/route/oneSettle/common/BaseDetailModelView',
    'tpl!app/oms/route/oneSettle/templates/view-model-detail.tpl',
    'tpl!app/oms/route/oneSettle/channel/templates/relevance-txn-model.tpl'
], function(BaseDetailModelView, tpl, relevanceTxnTpl) {

    var STATUS_MAP = {
        '0' : '启用',
        '1' : '不启用',
        '2' : '当日已走满'
    };

    var View = BaseDetailModelView.extend({
        
        formTemplate: tpl,

        // @override
        relevanceModelTemplate: relevanceTxnTpl,

        // @override
        serializeFormData: function () {
            var formLayout = [
            

                { label: '模型名称',      name: 'name' },
                { label: '启用状态',      name: 'status', formatter: function (val) { return STATUS_MAP[val] || ''; } },
                { label: '优先级',        name: 'priority' },
                { label: '通道名称',      name: 'channelName' },
                { label: '通道中文名称',  name: 'channelCnName' },
                { label: '备注',          name: 'remark' },
                { label: '商户模型数',          name: 'mchtModleNum' }
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