define([
    'app/oms/route/noCard/txn/add-txn-model-view'
], function(AddTxnModelView) {

    var EditTxnModelView = AddTxnModelView.extend({

        ajaxOptions: function () {
            return {
                type: 'PUT',
                url: url._('nocard.route.txn', {id: this.model.id})
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