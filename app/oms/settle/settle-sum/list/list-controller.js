/**
 * @created 2014-3-12 19:27:28
 */



//此Controller对应于清分清算下的清算汇总表
define(['App', 'app/oms/settle/settle-sum/list/list-view'], function(App, AbstratView) {

    var ViewT0 = AbstratView.extend({
        tabId: 'menu.t0.settle.sum',
        serializeData: function () {
            return {data: {gridId: 'settle-sums-grid-t0'}};
        },
        
        gridOptions: function (defaultOptions) {
            return $.extend(defaultOptions, {
                // TODO
                rsId:'settleSum.t0',
                gid: 'settle-sums-grid-t0',
                url: url._('settle.sum.zero'),
                tableCenterTitle: 'T+0 汇总表'

            });
        }
    });
    var ViewTC = AbstratView.extend({
        tabId: 'menu.tc.settle.sum',
        serializeData: function () {
            return {data: {gridId: 'settle-sums-grid-tc'}};
        },

        gridOptions: function (defaultOptions) {
            return $.extend(defaultOptions, {
                // TODO
                rsId:'settleSum.tc',
                gid: 'settle-sums-grid-tc',
                url: url._('settle.sum.one'),
                tableCenterTitle: '一清 汇总表'

            });
        }
    });
    var ViewT1 = AbstratView.extend({
        tabId: 'menu.settle.sum',
        
        gridOptions: function (defaultOptions) {
            return $.extend(defaultOptions, {
                // TODO
                tableCenterTitle: 'T+1 汇总表',
                responsiveOptions: {
                    hidden: {
                        ss: ['nodeTime', 'id','settleDesc','settleNum','settleDesc','doFlag','totalNum','succNum','failNum','failAmt','unknowNum','unknowAmt','doneNum','settleMode','sameBankFlag','batchNum','sortLevel','oprId','oprMsg1','recCreateTime','recOprTime','recInTime', 'succAmt'],
                        xs: ['nodeTime', 'id','settleDesc','settleNum','settleDesc','doFlag','totalNum','succNum','failNum','failAmt','unknowNum','unknowAmt','doneNum','settleMode','sameBankFlag','batchNum','sortLevel','oprId','oprMsg1','recCreateTime','recOprTime','recInTime'],
                        sm: ['nodeTime', 'id','doFlag','succNum','failNum','failAmt','unknowNum','unknowAmt','doneNum','settleMode','sameBankFlag','batchNum','sortLevel','oprId','oprMsg1','recCreateTime','recOprTime','recInTime'],
                        md: ['nodeTime', 'id','doneNum','settleMode','sameBankFlag','batchNum','sortLevel','oprId','oprMsg1','recCreateTime','recOprTime','recInTime'],
                        ld: ['nodeTime', 'id','doneNum','settleMode','sameBankFlag','batchNum','sortLevel','oprId','oprMsg1','recCreateTime','recOprTime','recInTime']
                    }

                }
            });
        }
    });


	var Controller = Marionette.Controller.extend({

		listSettleSums: function(kw) {
			App.show(new ViewT1());

		}, 

        listT0SettleSums: function () {
            App.show(new ViewT0());
        },
        listTCSettleSums: function () {
            App.show(new ViewTC());
        }

	});


	var ctrl = new Controller();

    App.on('settleSums:list', function() {
        console.log('监听到 App触发的"settleSums:list"事件, 触发清分清算下的清算汇总表');
        ctrl.listSettleSums();
    });

    App.on('settleSums:t0:list', function() {
        console.log('监听到 App触发的"settleSums:list"事件, 触发清分清算下的清算汇总表');
        ctrl.listT0SettleSums();
    });
    App.on('settleSums:tc:list', function() {
        console.log('监听到 App触发的"settleSums:list"事件, 触发清分清算下的清算汇总表');
        ctrl.listTCSettleSums();
    });
    return ctrl;


});