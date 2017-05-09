define(['App'], function(App) {
    App.module('MchtSysApp.Add', function(Add, App, Backbone, Marionette, $, _) {
        Add.Controller = {
            addMcht: function(kw) {
                var me = this, view;
                require(['app/oms/mcht/add/add-view'], function(View) {
                    console.info('new view mcht', kw);
                    view = me.view = new View.PersonalMcht({});
                    App.show(view);
                });
            }
        };
    });
    return App.MchtSysApp.Add.Controller;
});