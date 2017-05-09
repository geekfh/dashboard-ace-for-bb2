define([
    'tpl!app/oms/route/noCard/templates/pager.tpl'
], function(tpl) {

    //分页栏
    var PagerView =  Marionette.ItemView.extend({

        template: tpl,
        className:'pager-tool',

        ui: {
        },

        events: {
            'click .btn-previous': function (e) {
                e.preventDefault();
                $(e.target).closest('li').hasClass('disabled') || this.trigger('previous:page');
            },

            'click .btn-page': function (e) {
                e.preventDefault();
                var $btnPage = $(e.target);
                if($btnPage.closest('li').hasClass('active')) {
                    return;
                }

                var toPage = parseInt($btnPage.attr('toPage'));
                this.trigger('to:page', toPage);
            },

            'click .btn-next': function (e) {
                e.preventDefault();
                $(e.target).closest('li').hasClass('disabled') || this.trigger('next:page');
            }
        },

        initialize: function () {
            var me = this;
            this.render();

            this.collection.on('sync', function (collection) {
                if(collection instanceof Backbone.Collection) {
                    me.render();
                }
            });
        },

        serializeData: function () {
            return {state: this.collection.state};
        },

        onRender: function () {

        }

    });
    
    return PagerView;
});