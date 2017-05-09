define([
    'tpl!app/oms/route/oneSettle/templates/route-conf-head.tpl'
], function(tpl) {
    var View = Marionette.ItemView.extend({
        template: tpl,
        tagName: 'span',
        className: 'route-conf-head',

        ui: {
            confEdit:    '.route-conf-edit',
            confOk:      '.route-conf-ok',
            confCancel:  '.route-conf-cancel'
        },

        triggers: {
            'click .route-conf-edit': 'click:edit',
            'click .route-conf-ok': 'click:ok',
            'click .route-conf-cancel': 'click:cancel'
        },

        initialize: function () {
            this.render();

            if (!Ctx.avail('route.config.editbind')) {
                this.$el.empty();    
            }
        }

    });
    
    return View;
});