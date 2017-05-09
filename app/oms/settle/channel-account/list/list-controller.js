/**
 * @created 2014-3-12 19:27:28
 */



//此Controller对应于清分清算下的渠道账务信息表
define(['App'], function(App) {


	var Controller = Marionette.Controller.extend({
	
		listChannelAccounts: function(kw) {

			require(['app/oms/settle/channel-account/list/list-view'], function(View) {

					console.info('new view channelAccount');
					var channelAccountsView =  new View.ChannelAccounts({}); 
        			App.show(channelAccountsView);

			});


		}//@listChannelAccounts

	});

	var ctrl = new Controller();

    App.on('channelAccounts:list', function() {
        console.log('监听到 App触发的"channelAccounts:list"事件, 触发清分清算下的渠道账务信息表');
        ctrl.listChannelAccounts();
    });


    return ctrl;

});