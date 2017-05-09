define(['App'], function(App) {

    App.module('MchtSysApp.AddPic', function(AddPic, App, Backbone, Marionette, $, _) {

        AddPic.Controller = {

            showAddPic: function(model) {
                var me = this;
                var view;

                console.log(model);

                require(['app/oms/wkb/task/add-pic/complete-pic-view'], function(View) {
                    Opf.ajax({
                        url: url._('task.revise', {id: model.id}),
                        success: function (data) {
                            
                            console.log(data);
                            var taskInfo = model.toJSON();
                            view = me.view = new View(data.target, model.id);

                            App.show(view);
                        }
                    });
                });


            }

        };

    });
    return App.MchtSysApp.AddPic.Controller;
});