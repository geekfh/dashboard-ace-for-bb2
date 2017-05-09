/**
 * @created 2014-3-12 19:27:28
 */



//此Controller对应于清分清算下的清算批次锁表
define(['App'], function(App) {


	var Controller = Marionette.Controller.extend({

		listSettleLock: function(kw) {

			require(['app/oms/settle/settle-lock/list/list-view'], function(View) {

					console.info('new view settleLock');
					var settleLockView =  new View.settleLock({}); 
        			App.show(settleLockView);

			});


		}//@listSettleLock

	});


	var ctrl = new Controller();

    App.on('settleLock:list', function() {
        console.log('监听到 App触发的"settleLock:list"事件, 触发清分清算下的清算批次锁表');
        ctrl.listSettleLock();
    });


    return ctrl;


});