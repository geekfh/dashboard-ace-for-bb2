define(['App'], function(App) {
    App.module('MchtSysApp.Add', function(Add, App, Backbone, Marionette, $, _) {
        Add.Controller = {
            addWildCardMcht: function(kw) {
                var me = this, view;
                require(['app/oms/mcht/wildcard/add/add-view'], function(View) {
                    console.info('new view wild card mcht', kw);
                    view = me.view = new View.WildCardMcht({});
                    App.show(view);
                });
            }
        };
    });
    return App.MchtSysApp.Add.Controller;
});