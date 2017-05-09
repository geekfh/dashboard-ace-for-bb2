/**
 * @created 2014-4-10 
 */



//此Controller对应于清分清算下的机构清算明细表
define(['App'], function(App) {

    var Controller = Marionette.Controller.extend({

        listBranchSettleDetails: function(kw) {

            require(['app/oms/settle/branch-settle-details/list/list-view'], function(View) {

                    console.info('new view branch-settle-details');
                    var branchSettleDetails =  new View.BranchSettleDetails({}); 
                    App.show(branchSettleDetails);

            });


        },//@listBatMainCtlDetails


        listQueryBranchSettleDetails: function(kw) {
            require(['app/oms/settle/branch-settle-details/list/list-view'], function(View) {

                    console.info('new view branch-settle-details');
                    var extraOptions = {
                        rsId:'query.BranchSettleDetails',
                        actionsCol: {
                            edit : false,
                            del: false
                        }
                    };

                    var SearchView = View.BranchSettleDetails.extend({
                        tabId: 'menu.query.branch.settle.details',
                        getGid: function () {
                            return 'query-branch-settle-details-grid';
                        },
                        gridOptions: function (defaultOptions) {
                            return $.extend(defaultOptions, extraOptions);
                        }
                    });

                    var branchSettleDetails = new SearchView({});
                    App.show(branchSettleDetails);

            });
        }

    });



    var ctrl = new Controller();

    App.on('branchSettleDetails:list', function() {
        console.log('监听到 App触发的"branchSettleDetails:list"事件, 触发清分清算下的机构清算明细表');
        ctrl.listBranchSettleDetails();
    });

    App.on('branchSettleDetails:list:query', function() {
        console.log('监听到 App触发的"branchSettleDetails:list:query"事件, 触发信息查询下的机构清算明细表');
        ctrl.listQueryBranchSettleDetails();
    });

    return ctrl;

});