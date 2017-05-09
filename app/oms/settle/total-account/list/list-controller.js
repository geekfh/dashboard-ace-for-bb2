/**
 * @created 2014-3-12 19:27:28
 */



//此Controller对应于清分清算下的总账信息表
define(['App'], function(App) {


	var Controller = Marionette.Controller.extend({

		listTotalAccounts: function(kw) {

			require(['app/oms/settle/total-account/list/list-view'], function(View) {

					console.info('new view totalAccount');
					var totalAccountsView =  new View.TotalAccounts({}); 
        			App.show(totalAccountsView);

			});


		}//@listTotalAccounts

	});


	var ctrl = new Controller();

    App.on('totalAccounts:list', function() {
        console.log('监听到 App触发的"totalAccounts:list"事件, 触发清分清算下的总账信息表');
        ctrl.listTotalAccounts();
    });

    return ctrl;


});