define(['App'],
  function(App) {
    //define sub app
    App.module('WkbSysApp', function(WkbSysApp) {

      var WkbSysRouter = Marionette.AppRouter.extend({
        appRoutes: {
          "tasks(/filter/kw::kw)": "listTasks"
        }
      });

      /////////////////////////////////////////////////////////////////
      // @API : define methods for interaction (with parent app) and router //
      /////////////////////////////////////////////////////////////////
      var API = {
        listTasks: function(kw) {
          var me = this;
          console.log('>>>>task.listTasks ' + (kw || ''));

          require(['app/oms/wkb/task/task-app'], function (TaskApp) {
            WkbSysApp.trigger('tasks:list');
          });
        },

        listMchtTasks: function(kw){//任务-商审
          console.log('>>>>listMchtTasks ' + (kw || ''));
          require(['app/oms/wkb/task/task-app'], function (TaskApp) {
            WkbSysApp.trigger('tasks:mcht:list');
          });
        },

        performTask: function (model) {
          require(['app/oms/wkb/task/task-app'], function (TaskApp) {
            WkbSysApp.trigger('task:perform', model);
          });
        },

        reviseTask: function (model) {
          require(['app/oms/wkb/task/task-app'], function (TaskApp) {
            WkbSysApp.trigger('task:revise', model);
          });
        },

        showTask: function (model) {
          require(['app/oms/wkb/task/task-app'], function (TaskApp) {
            WkbSysApp.trigger('task:show', model);
          });
        },

        showDeleteTask: function (model) {
          require(['app/oms/wkb/task/task-app'], function (TaskApp) {
            WkbSysApp.trigger('task:delete', model);
          });
        },

        showAddPic: function (model) {
          require(['app/oms/wkb/task/task-app'], function (TaskApp) {
            WkbSysApp.trigger('addPic:show', model);
          });
        },

        showTaskList: function () {
          require(['app/oms/wkb/task-list/list-controller'], function (ctl) {
            ctl.showTaskList();
          });
        }
        
      };

      //if it is not used to map the url first time typed in browser
      //u can new router anywhere before u want, otherwise, u should
      //add router before start Backbone history
      new WkbSysRouter({ controller: API });


      /////////////////////////////////////////////////
      //@RegisgerEvent : register events or command to parent app //////
      /////////////////////////////////////////////////
      App.on('tasks:list', function(kw) {
        API.listTasks(kw);
      });

      //任务-开放给商审人员
      App.on('tasks:mcht:list', function(kw){
        API.listMchtTasks(kw);
      });

      App.on('task:perform', function(model) {
        API.performTask(model);
      });

      App.on('task:revise', function(model) {
        API.reviseTask(model);
      });


      App.on('task:show', function(model) {
        API.showTask(model);
      });

      App.on('task:delete', function(model) {
        API.showDeleteTask(model);
      });

      App.on('addPic:show', function(model) {
        API.showAddPic(model);
      });

      App.on('tasksList:show', function() {
        API.showTaskList();
      });

      //this callback will be invoked before parent app:initilize:after
      App.addInitializer(function() {

        console.log('>>>>initializer WkbSysApp');

      });

    });

    return App.WkbSysApp;
  });