define(['App'], function(App) {

    App.module('MchtSysApp.Add', function(Add, App, Backbone, Marionette, $, _) {

        Add.Controller = {

            reviseTask: function(model) {
                var me = this;
                var view;

                require(['app/oms/wkb/task/revise/revise-view'], function(View) {
                    console.info('new view mcht');

                    //获取录入时的信息
                    Opf.ajax({
                        url: url._('task.revise', {id: model.id}),
                        success: function (data) {
                            /**
                             * 修订提交的数据长这样
                             * {
                             * task: {xx},
                             * target: {xx商户信息}} 
                             */
                            var taskInfo = model.toJSON();
                            view = me.view = new View(data, taskInfo);

                            App.show(view);
                        }
                    });



                });


            }

        };

    });
    return App.MchtSysApp.Add.Controller;
});