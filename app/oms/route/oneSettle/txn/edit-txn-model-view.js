define([
    'app/oms/route/oneSettle/txn/add-txn-model-view'
], function(AddTxnModelView) {

    var EditTxnModelView = AddTxnModelView.extend({

        ajaxOptions: function () {
            return {
                type: 'PUT',
                url: url._('route.txn', {id: this.model.id})
            };
        },

        serializeFormData: function () {
            return {
                data: this.model.toJSON()
            };
        }
    });

    
    return EditTxnModelView;
});