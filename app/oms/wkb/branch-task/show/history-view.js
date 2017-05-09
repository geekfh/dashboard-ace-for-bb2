define([
    'tpl!app/oms/wkb/task/perform/templates/history.tpl'
], function(tpl) {

    var View = Marionette.ItemView.extend({
        className: 'history-view',
        template: tpl,

        initialize: function (data) {
            this.data = data;
        },

        serializeData: function(){
            return this.data;
        },

        onRender: function () {

        }
    });

    return View;
})