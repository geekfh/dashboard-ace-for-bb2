/**
 * @created 2014-3-12 19:27:28
 */



//此Controller对应于清分清算下的报表导出
define(['App'], function(App) {


    var Controller = Marionette.Controller.extend({

        _attachViewEvent: function(){
            var me = this;

            me.view.on("brhFee:list",function(){
                console.log("brhfee:list trigger!");


                require(['app/oms/settle/settle-download/list/report/brhFee-view'], function(View) {

                    console.info('new view brhFeeReport');
                    var brhFeeReportView = me.view = new View.brhFeeReport({});
                    me._attachViewEvent();
                    App.show(brhFeeReportView);

                });
            });

            me.view.on("mchtDetail:list",function(){
                console.log("mchtDetail:list trigger!");


                require(['app/oms/settle/settle-download/list/report/mchtDetail-view'], function(View) {

                    console.info('new view mchtDetailReport');
                    var mchtDetailReportView = me.view = new View.mchtDetailReport({});
                    me._attachViewEvent();
                    App.show(mchtDetailReportView);

                });
            });

            me.view.on("batchPayment:list",function(){
                console.log("batchpayment:list trigger!");

                require(['app/oms/settle/settle-download/list/report/batchPayment-view'], function(View) {

                    console.info('new view batchPaymentReport');
                    var batchPaymentReportView = me.view = new View.batchPaymentReport({});
                    me._attachViewEvent();
                    App.show(batchPaymentReportView);

                });
            });

        },

        listSettleDownload: function(kw) {

            var me = this;
            // console.log('进入controller')

            require(['app/oms/settle/settle-download/list/list-view'], function(View) {

                    console.info('new view SettleDownload');
                    var settleDownloadsView = me.view =  new View.SettleDownloads({}); 
                    me._attachViewEvent();
                    App.show(settleDownloadsView);

            });


        }//@listSettleDownloads

    });


    var ctrl = new Controller();

    App.on('settleDownload:list', function() {
        console.log('监听到 App触发的"settleDownload:list"事件, 触发清分清算下的报表导出');
        ctrl.listSettleDownload();
    });

    return ctrl;


});