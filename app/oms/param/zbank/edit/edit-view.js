define([
    'App',
    'app/oms/param/zbank/add/add-view'
], function(App, AddView){

    var _onRender = AddView.prototype.onRender;

    return AddView.extend({
        onRender: function() {
            var me = this;

            //render html
            _onRender.call(this, arguments);

            //trigger events
            _.defer(function(){
                me.triggerSomething();
            })
        },
        triggerSomething: function(){
            $("#no").trigger('blur');
        }
    });
});