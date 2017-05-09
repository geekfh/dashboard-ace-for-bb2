/**
 * @created 2014-3-12 19:27:28
 */



//此Controller对应于清分清算下的差错交易信息表
define(['App'], function(App) {

	var Controller = Marionette.Controller.extend({

		listStlmErrors: function(kw) {

			require(['app/oms/settle/stlm-error/list/list-view'], function(View) {

					console.info('new view stlmError');
					var stlmErrorsView =  new View.StlmErrors({}); 
        			App.show(stlmErrorsView);

			});


		},//@listStlmErrors

        listExceptionStlmErrors: function () {
            require(['app/oms/settle/stlm-error/list/list-view'], function(View) {
                    console.info('new view stlmError');
                    var SubView = View.StlmErrors.extend({
                        tabId: 'menu.exception.stlmerror',
                        getGid: function () {
                            return 'exception-stlm-errors-grid';
                        }
                    });

                    var stlmErrorsView =  new SubView({}); 
                    App.show(stlmErrorsView);

            });

        }

	});

	var ctrl = new Controller();

    App.on('stlmErrors:list', function() {
        console.log('监听到 App触发的"stlmErrors:list"事件, 触发清分清算下的差错交易信息表');
        ctrl.listStlmErrors();
    });

    App.on('exception:stlmErrors:list', function() {
        console.log('监听到 App触发的"exception:stlmErrors:list"事件, 触发清分清算下的差错交易信息表');
        ctrl.listExceptionStlmErrors();
    });

    

    return ctrl;


});