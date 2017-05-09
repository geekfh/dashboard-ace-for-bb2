//此Controller对应于清分清算下的交易流水信息表
define(['App'], function(App) {

    var Controller = Marionette.Controller.extend({

        listTradeTxn: function(kw) {

            require(['app/oms/settle/trade-txn/list/list-view'], function(View) {
                console.info('new view trade-txn: listTradeTxn');

                var tradeTxns =  new View.TradeTxns({});
                App.show(tradeTxns);
            });


        },//@listBatMainCtlDetails

        listQueryTradeTxn: function(options) {

            require(['app/oms/settle/trade-txn/list/list-view'], function(View) {
                console.info('new view trade-txn: listQueryTradeTxn');

                var extraOptions = {
                    rsId: 'query.tradeTxn'
                };

                var searchView =  View.TradeTxns.extend({
                    gridOptions: function (defaultOptions) {

                        //来电弹屏自动触发查询配置
                        if(_.isArray(options)){
                            _.each(options, function(item, idx){
                                var components = defaultOptions.filters[0].components;
                                var componentItem = _.findWhere(components, {name: item.name});
                                !!componentItem && (_.extend(componentItem, item.params));
                            });
                        }

                        return $.extend(defaultOptions, extraOptions);
                    }
                });

                var tradeTxn = new searchView();
                App.show(tradeTxn);
            });
        }
    });


    var ctrl = new Controller();

    App.on('tradeTxn:list', function() {
        console.log('监听到 App触发的"tradeTxn:list"事件, 触发清分清算下的交易流水信息表');
        ctrl.listTradeTxn();
    });

    App.on('tradeTxn:list:query', function() {
        console.log('监听到 App触发的"tradeTxn:list:query"事件, 触发信息查询下的交易流水信息表');
        ctrl.listQueryTradeTxn();
    });

    return ctrl;
});