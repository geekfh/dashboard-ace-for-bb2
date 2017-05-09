/**
 * Created by liliu on 2016/8/23.
 */
define([
	'App',
	'app/oms/operate/replyCodeQuery/view/hasCard-view',
	'app/oms/operate/replyCodeQuery/view/noCard-view'
], function(App, HasCardView, NoCardView){
	var Controller = {
		showHasCard: function(){
			var hasCardView = new HasCardView;
			App.show(hasCardView);
		},
		showNoCard: function(){
			var noCardView = new NoCardView;
			App.show(noCardView);
		}
	};
	return Controller;
});
