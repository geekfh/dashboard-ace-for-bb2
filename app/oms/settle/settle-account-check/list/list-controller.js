define(['App'], function(App) {

	var Controller = Marionette.Controller.extend({

        listAccountCheck: function() {

			require(['app/oms/settle/settle-account-check/list/list-view'], function(View) {

                console.info('new view accountCheck');
                var view =  new View();
                App.show(view);

			});

		}

	});

	var ctrl = new Controller();

    App.on('accountCheck:list', function() {
        console.log('监听到 App触发的"accountCheck:list"事件, 触发清分清算下的账户审核表');
        ctrl.listAccountCheck();
    });

    return ctrl;

});