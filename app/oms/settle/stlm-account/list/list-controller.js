/**
 * @created 2014-3-12 19:27:28
 */



//此Controller对应于清分清算下的清算收付款账户信息表
define(['App'], function(App) {


	var Controller = Marionette.Controller.extend({

		listStlmAccounts: function(kw) {

			require(['app/oms/settle/stlm-account/list/list-view'], function(View) {

					console.info('new view stlmAccount');
					var stlmAccountsView =  new View.StlmAccounts({}); 
        			App.show(stlmAccountsView);

			});


		}//@listStlmAccounts

	});


	var ctrl = new Controller();

    App.on('stlmAccounts:list', function() {
        console.log('监听到 App触发的"stlmAccounts:list"事件, 触发清分清算下的清算收付款账户信息表');
        ctrl.listStlmAccounts();
    });

    return ctrl;



});