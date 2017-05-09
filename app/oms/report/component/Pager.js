define([
    'tpl!app/oms/report/component/templates/pager.tpl'],
function (tpl) {

    var View = Marionette.ItemView.extend({

        initialize: function (options) {
            this.collection = options.collection;

            this.render();
        },

        triggers: {
        },

        events: {
            'click .previous': function (e) {
                if(!$(e.target).closest('li').hasClass('disabled')) {
                    this.trigger('previous:page', e);
                }
            },
            'click .next': function (e) {
                if(!$(e.target).closest('li').hasClass('disabled')) {
                    this.trigger('next:page', e);
                }
            }
        },

        template: tpl,
        className: "pager",

        ui: {
            preBtn     : '.previous',
            nextBtn    : '.next'
        },

        onRender: function () {
            var ui = this.ui;

            this.collection.on('sync', function (collection, resp) {
                
                ui.preBtn.toggleClass('disabled', !collection.state.hasPreviousPage);
                ui.nextBtn.toggleClass('disabled', !collection.state.hasNextPage);
                
            });
        }
    });

    return View;
});
