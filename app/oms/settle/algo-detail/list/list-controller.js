/**
 * @created 2014-5-9 
 */



//此Controller对应于清分清算下的清分明细表
define(['App'], function(App) {

    var Controller = Marionette.Controller.extend({

        listAlgoDetail: function() {

            require(['app/oms/settle/algo-detail/list/list-view'], function(View) {

                    console.info('new view algo-detail');
                    var algoDetail =  new View.AlgoDetails({}); 
                    App.show(algoDetail);

            });


        },//@listBatMainCtlDetails
        listQueryAlgoDetail: function(data) {
            require(['app/oms/settle/algo-detail/list/list-view'], function(View) {
                var filters = {
                    "groupOp":"AND",
                    "rules":[{"field":"algoDate","op":"ge","data": data.algoDate},
                        {"field":"algoDate","op":"le","data": data.algoDate}]
                };
                var extraOptions = {
                    rsId:'query.algoDetail',
                    actionsCol: {
                        edit : false,
                        del: false
                    },
                    postData: {filters: JSON.stringify(filters)},
                    download: false
                };

                var SearchView = View.AlgoDetails.extend({
                    tabId: 'menu.query.algo.detail',
                    getGid: function () {
                        return 'query-algo-detail-grid';
                    },
                    gridOptions: function (defaultOptions) {
                        return $.extend(defaultOptions, extraOptions);
                    }
                });

                var algoDetail = new SearchView({algoDate: data.algoDate});
                App.show(algoDetail);
            });
        }
    });

    var ctrl = new Controller();

    App.on('algoDetail:list', function() {
        console.log('监听到 App触发的"algoDetail:list"事件, 触发清分清算下的清分明细表');
        ctrl.listAlgoDetail();
    });

    App.on('algoDetail:list:query', function(data) {
        console.log('监听到 App触发的"algoDetail:list:query"事件, 触发信息查询下的清分明细表');
        ctrl.listQueryAlgoDetail(data);
    });

    return ctrl;
});