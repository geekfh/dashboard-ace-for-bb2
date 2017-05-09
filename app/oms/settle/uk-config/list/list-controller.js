/**
 * @created 2014-5-23 
 */



//此Controller对应于清分清算下的清算账户UK配置表
define(['App'], function(App) {


    var Controller = Marionette.Controller.extend({

        listUkConfig: function(kw) {

            require(['app/oms/settle/uk-config/list/list-view'], function(View) {

                    console.info('new view trade-txn');
                    var ukConfigs =  new View.UkConfigs({}); 
                    App.show(ukConfigs);

            });


        }//@listBatMainCtlDetails


    });


    var ctrl = new Controller();

    App.on('ukConfig:list', function() {
        console.log('监听到 App触发的"ukConfig:list"事件, 触发清分清算下的清算账户UK配置表');
        ctrl.listUkConfig();
    });

    return ctrl;


});