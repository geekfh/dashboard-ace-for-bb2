define([
    'app/oms/route/noCard/common/ConditionPanel',
    'app/oms/route/noCard/common/DetailFieldsetGroup'
], function(ConditionPanel, DetailFieldsetGroup) {

    var View = ConditionPanel.extend({
        template: _.template( '<div class="fieldset-groups-sit"></div>' ),

        initialize: function () {
            // this.collection = new Backbone.Collection();
        },

        getChildView: function (model) {
            return DetailFieldsetGroup.extend({
                conditions:  this.getOption('conditions'),
                collection: new Backbone.Collection(model.get('details'))
            });
        }

        
    });
    
    return View;
});