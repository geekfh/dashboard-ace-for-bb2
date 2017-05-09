/**
 * Created by wupeiying on 2015/9/11.
 */
 
define(['App'], function(App){
    App.module('AccountApp', function(AccountApp){

        var AccountAppRouter = Marionette.AppRouter.extend({
            appRoutes: {
                "account(/filter/kw::kw)": "listAccountConfig"//第一步 跳到账户管理界面
            }
        });

        var API = {
            listAccountConfig: function(kw){
                require(['app/oms/account/list/list-controller'], function (ctrl) {
                    ctrl.listAccountConfig(kw);
                });
            },
            listAccountInfo: function(kw){
                require(['app/oms/account/list/list-controller'], function (ctrl) {
                    ctrl.listAccountInfo(kw);
                });
            }
        };

        new AccountAppRouter({ controller: API });

        //账户管理
        App.on('account:config:list', function(kw) {
            API.listAccountConfig(kw);
        });

        //主账户
        App.on('account:info:list', function(kw) {
            API.listAccountInfo(kw);
        });

        App.addInitializer(function() {
            console.log('>>>>initializer AccountApp');
        });
    });

    return App.AccountApp;
});