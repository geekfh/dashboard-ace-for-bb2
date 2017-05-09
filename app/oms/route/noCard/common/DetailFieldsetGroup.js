define([
    'tpl!app/oms/route/noCard/common/templates/detail-fieldset-group.tpl',
    'app/oms/route/noCard/common/FieldsetGroup',
    'app/oms/route/noCard/common/DetailField'
], function(tpl, FieldsetGroup, DetailField) {

    var View = FieldsetGroup.extend({
        template: tpl,

        
        // @override, please not remove this method
        initialize: function () {

        },

        getChildView: function(model) {
            return DetailField;
        }

    });
    
    return View;
});