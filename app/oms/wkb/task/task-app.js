define(['App', 'app/oms/wkb/wkb-sys-app'], //

  function(App, WkbSysApp) {

    //define sub app
    App.module('TaskApp', function(TaskApp) {

      var TaskAppRouter = Marionette.AppRouter.extend({
        appRoutes: {
          "tasks(/filter/kw::kw)": "listTasks"
        }
      });

      /////////////////////////////////////////////////////////////////
      // define methods for interaction (with parent app) and router //
      /////////////////////////////////////////////////////////////////
      var API = {

        listTasks: function(kw) {
          console.log('>>>>wkb-sys.listTasks ' + (kw || ''));

          require(['app/oms/wkb/task/list/list-controller'], function (ctrl) {
            ctrl.listTasks(kw);
          });
        },

        listMchtTasks: function(kw) {
          console.log('>>>>listMchtTasks ' + (kw || ''));

          require(['app/oms/wkb/mcht-task/list-controller'], function (ctrl) {
            ctrl.listMchtTasks(kw);
          });
        },

        performTask: function (model) {

          require(['app/oms/wkb/task/perform/perform-controller'], function (ctrl) {
            ctrl.performTask(model);
          });

        },

        reviseTask: function (model) {

          require(['app/oms/wkb/task/revise/revise-controller'], function (ctrl) {
            ctrl.reviseTask(model);
          });

        },

        showTask: function (model) {

          require(['app/oms/wkb/task/show/show-controller'], function (ctrl) {
            ctrl.showTask(model);
          });

        },

        showDeleteTask: function (model) {

          require(['app/oms/wkb/task/show/show-controller'], function (ctrl) {
            ctrl.showDeleteTask(model);
          });

        },

        showAddPic: function (model) {
          require(['app/oms/wkb/task/add-pic/complete-pic-controller'], function (ctrl) {
            ctrl.showAddPic(model);
          });
        }

      };

      //if it is not used to map the url first time typed in browser
      //u can new router anywhere before u want, otherwise, u should
      //add router before start Backbone history
      new TaskAppRouter({ controller: API });


      /////////////////////////////////////////////////
      //register events or command to parent app //////
      /////////////////////////////////////////////////
      WkbSysApp.on('tasks:list', function(kw) {
        API.listTasks(kw);
      });

      WkbSysApp.on('tasks:mcht:list', function(kw) {
        API.listMchtTasks(kw);
      });

      WkbSysApp.on('task:perform', function(model) {

        console.log('>>>task app on task:perform');

        API.performTask(model);
      });

      WkbSysApp.on('task:revise', function(model) {

        console.log('>>>task app on task:revise');

        API.reviseTask(model);
      });

      WkbSysApp.on('task:show', function(model) {

        console.log('>>>task app on task:show');

        API.showTask(model);
      });

      WkbSysApp.on('addPic:show', function(model) {
        API.showAddPic(model);
      });

      WkbSysApp.on('task:delete', function(model) {

        console.log('>>>task app on task:delete');

        API.showDeleteTask(model);
      });


      //this callback will be invoked before parent app:initilize:after
      App.addInitializer(function() {

        console.log('>>>>new TaskAppRouter');

      });

    });

    return App.TaskApp;

  });