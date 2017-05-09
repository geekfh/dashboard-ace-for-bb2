define([
    'app/oms/route/noCard/common/BaseDetailModelView',
    'tpl!app/oms/route/noCard/templates/view-model-detail.tpl'
], function(BaseDetailModelView, tpl) {

    var STATUS_MAP = {
        '0' : '启用',
        '1' : '不启用'
    };

    var View = BaseDetailModelView.extend({

        formTemplate: tpl,
 
        serializeFormData: function () {
            var formLayout = [
                { label: '模型名称',  name: 'name' },
                { label: '启用状态',  name: 'status', formatter: function (val) { return STATUS_MAP[val] || ''; } },
                { label: '优先级',    name: 'priority' },
                { label: '备注',      name: 'remark' }
            ];

            return { formLayout: formLayout, model: this.model };
        }
    });
    
    return View;
});