

//此Controller对应于权限管理菜单下的日志表
define(['App'], function(App) {

    var Controller = Marionette.Controller.extend({

        listLog: function(kw) {
            var me = this;
            require(['app/oms/auth/log/list/list-view' /*,'entities/org'*/ ], function(View) {

                console.info('new view log');
                var logView = new View.Log({});

                App.show(logView);

                me.logView = logView;

            });


        } //@listOrgs


    });


    var ctrl = new Controller();

    App.on('log:list', function() {
        console.log('监听到 App触发的"log:list"事件, 触发权限管理菜单下的日志表');
        ctrl.listLog();
    });

    return ctrl;

});