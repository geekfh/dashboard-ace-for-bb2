define([
    'tpl!app/oms/param/sen/list/templates/confirm.tpl'

], function(tpl) {

    return Marionette.ItemView.extend({

        template: tpl,

        initialize: function(options) {
            this.options = options;

            this.render();
        },

        serializeData: function() {
            return {
                data: _.map(this.options.models, function(model) {
                    return model.toJSON();
                })
            };
        },

        onRender: function() {
            var options  = this.options;
            Opf.confirm(this.$el, function (result) {
                result ? options.yes && options.yes() : options.no && options.no();
            });
        }

    });


});