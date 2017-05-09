/**
 * @created 2014-3-12 19:27:28
 */



//此Controller对应于清分清算下的总账手动维护明细表
define(['App'], function(App) {


	var Controller = Marionette.Controller.extend({

		listTotalAccountDetails: function(kw) {

			require(['app/oms/settle/total-account-detail/list/list-view'], function(View) {

					console.info('new view totalAccountDetail');
					var totalAccountDetailsView =  new View.TotalAccountDetails({});
					App.show(totalAccountDetailsView);

			});


		}//@listTotalAccountDetails

	});


	var ctrl = new Controller();

    App.on('totalAccountDetails:list', function() {
        console.log('监听到 App触发的"totalAccountDetails:list"事件, 触发清分清算下的总账手动维护明细表');
        ctrl.listTotalAccountDetails();
    });


    return ctrl;


});