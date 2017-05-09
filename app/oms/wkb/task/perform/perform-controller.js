define(['App', 'app/oms/wkb/wkb-sys-app', 'app/oms/wkb/task/task-app'/*, 'entities/task'*/],
    function(App, WkbSysApp, TaskApp) {

    App.module('WkbSysApp.Task.Perform', function(Perform, App, Backbone, Marionette, $, _) {

        Perform.Controller = {

            performTask: function (model) {

                console.info('>>>performTask', model);

                require(['app/oms/wkb/task/perform/perform-view'], function (PerformView) {

                    Opf.ajax({
                        url: url._('task.target', {id: model.id}),
                        success: function (data) {
                            var view = new PerformView(data);
                            App.show(view);
                        }
                    });

                });

            }

        };

    });



    return App.WkbSysApp.Task.Perform.Controller;


});