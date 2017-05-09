


//此Controller对应于参数设置菜单下的mcc表
define(['App'], function(App) {


    var Controller = Marionette.Controller.extend({

        listTaskMap: function(kw) {

            require(['app/oms/param/task-map/list/list-view'/*,'entities/user'*/], function(View) {

                    console.info('new view task-map');
                    var taskMapView =  new View.TaskMaps({}); 
                    App.show(taskMapView);

            });


        }//@listMccs

    });

    var ctrl = new Controller();

    App.on('task-map:list', function() {
        console.log('监听到 App触发的"task-map:list"事件, 触发参数设置菜单下的任务配置表');
        ctrl.listTaskMap();
    });

    return ctrl;

});