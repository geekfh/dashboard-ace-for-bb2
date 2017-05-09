define(['App'], function(App) {


	var Controller = Marionette.Controller.extend({

		listRulePoints: function(kw) {

			require(['app/oms/auth/rule-point/list/list-view'/*,'entities/user'*/], function(View) {

					console.info('new view rule-point');
					var rulePointsView =  new View.RulePoints({}); 
        			App.show(rulePointsView);

			});


		}//@listRulePoints

	});


	var ctrl = new Controller();

    App.on('rule-points:list', function() {
        console.log('监听到 App触发的"log:list"事件');
        ctrl.listRulePoints();
    });

    return ctrl;

});