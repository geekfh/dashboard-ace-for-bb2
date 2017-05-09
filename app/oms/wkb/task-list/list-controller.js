/**
 * @created 2014-5-23 
 */
define(['App'], function(App) {

    App.module('WkbSysApp.TaskList.List', function(List, App, Backbone, Marionette, $, _) {

        List.Controller = {

            showTaskList: function(kw) {
               require(['app/oms/wkb/task-list/list-view'], function(View) {
                    console.info('new view task-list');
                    var taskList =  new View.TaskList({}); 
                    App.show(taskList);

               });

            }//@listBatMainCtlDetails

        };

    });

    return App.WkbSysApp.TaskList.List.Controller;
});