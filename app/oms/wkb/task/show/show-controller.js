define(['App', 'app/oms/wkb/wkb-sys-app', 'app/oms/wkb/task/task-app'],
    function(App, WkbSysApp, TaskApp) {

    App.module('WkbSysApp.Task.Show', function(Show, App, Backbone, Marionette, $, _) {

        Show.Controller = {

            showTask: function (model) {

                console.info('>>>showTask', model);

                require(['app/oms/wkb/task/show/show-view'], function (ShowView) {

                    Opf.ajax({
                        url: url._('task.target', {id: model.id}),
                        success: function (data) {
                            var view = new ShowView(data, model);
                            App.show(view);

                            var userId = Ctx.getUser().get('id');
                            var beginOprId = data.taskInfo.beginOprId;
                            var status = data.taskInfo.status;

                            if(userId === beginOprId && status === '1'){
                                view.$el.find('.takeback').show();
                            }
                        }
                    });

                });

            },

            showDeleteTask: function (model) {

                console.info('>>>showDeleteTask', model);

                require(['app/oms/wkb/task/show/show-delete-view'], function (showDelete) {
                    Opf.ajax({
                        url: url._('task.history', {id: model.id}),
                        success: function (data){
                            var view = new showDelete(data);
                            App.show(view);
                        }
                    });
                });
            }

        };

    });



    return App.WkbSysApp.Task.Show.Controller;


});