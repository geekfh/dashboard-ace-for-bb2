/**
 * @created 2014-3-12 19:27:28
 */



//此Controller对应于清分清算下的账单调整表
define(['App'], function(App) {


	var Controller = Marionette.Controller.extend({

		listStlmRepairs: function(kw) {

			require(['app/oms/settle/stlm-repair/list/list-view'], function(View) {

					console.info('new view stlmRepair');
					var stlmRepairsView =  new View.StlmRepairs({}); 
        			App.show(stlmRepairsView);

			});


		},//@listStlmRepairs
        listExceptionStlmRepairs: function () {
            require(['app/oms/settle/stlm-repair/list/list-view'], function(View) {

                    console.info('new view stlmRepair');
                    var SubView = View.StlmRepairs.extend({
                        tabId: 'menu.exception.stlmrepair',
                        getGid: function () {
                            return 'exception-stlm-repairs-grid';
                        }
                    });
                    
                    var stlmRepairsView =  new SubView({}); 
                    App.show(stlmRepairsView);

            });
        }

	});


	var ctrl = new Controller();

    App.on('stlmRepairs:list', function() {
        console.log('监听到 App触发的"stlmRepairs:list"事件, 触发清分清算下的账单调整表');
        ctrl.listStlmRepairs();
    });

    App.on('exception:stlmRepairs:list', function () {
        ctrl.listExceptionStlmRepairs();
    });

    return ctrl;


});