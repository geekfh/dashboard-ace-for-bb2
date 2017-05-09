/**
 * Created by liliu on 2016/8/23.
 */
define([
	'App'
], function(App){
	//有卡支付应答码
	App.on('operate:replyCodeQuery:hasCard', function(){
		require(['app/oms/operate/replyCodeQuery/controller/controller'], function(Controller){
			Controller.showHasCard();
		});
	});
	//无卡支付应答码
	App.on('operate:replyCodeQuery:noCard', function(){
		require(['app/oms/operate/replyCodeQuery/controller/controller'], function(Controller){
			Controller.showNoCard();
		});
	});
});
