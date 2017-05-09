define([
    'app/oms/wkb/task/revise/sub/revise-extra-view'
], function(EditExtraView){
    var _onRender = EditExtraView.prototype.onRender;

    return EditExtraView.extend({
        onRender: function(){
            _onRender.call(this, arguments);
            this.filterExtra();
        },
        filterExtra: function(){
            //TODO
        }
    });
});