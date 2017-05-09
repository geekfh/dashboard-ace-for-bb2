define([
    'app/oms/mcht/wildcard/add/sub/info-view',
    'app/oms/mcht/edit/sub/info-view'
], function(wildcardInfoView, EditInfoView){
    var _onRender = EditInfoView.prototype.onRender;
    var _doRender = wildcardInfoView.prototype.doRender;

    return EditInfoView.extend({
        ui: _.extend({}, wildcardInfoView.prototype.ui),
        onRender: function(){
            _onRender.call(this, arguments);
            _doRender.call(this, arguments);
        }
    });
});