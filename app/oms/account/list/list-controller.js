/**
 * Created by wupeiying on 2015/9/11.
 */
define(['App'], function(App) {

    App.module('AccountApp.List', function(List, App, Backbone, Marionette, $, _) {

        List.Controller = {
            listAccountInfo: function(kw) {
                //require(['app/oms/account/list/list-view'], function(View) {
                //    var infoView = new View.Info({});
                //    App.show(infoView);
                //
                //});
            },

            listAccountConfig: function(kw) {
                require(['app/oms/account/list/accountConfig-list'], function(View) {
                    var configView = new View.Config({kw: kw});
                    App.show(configView);

                });
            }
        };

    });
    return App.AccountApp.List.Controller;
});