define([
    'tpl!app/oms/operate/txn/templates/txn-view.tpl'

], function(tpl) {

    var View = Marionette.ItemView.extend({
        template: tpl,
        initialize: function () {
            
        },
        serializeData: function () {
            return {
                data: this.getOption('data')
            };
        },
        
        onRender: function () {

        }
    });
    
    return View;
});