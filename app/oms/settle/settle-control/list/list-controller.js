/**
 * @created 2014-3-14 11:37:52
 */



//此Controller对应于清分清算下的清算控制表
define(['App', 'app/oms/settle/settle-control/list/list-view'], function(App, AbstratView) {


    var SettleControlT0 = AbstratView.extend({
        tabId: 'menu.t0.settle.control',
        serializeData: function () {
            return {data: {gridId: 'settle-controls-grid-t0'}};
        },

        getTransferUrl: function () {
            return 'settle.t0.ctrl.transfer';
        },

        getCheckUrl: function () {
            return 'settle.t0.ctrl.check';
        },

        getConfirmUrl: function () {
            return 'settle.t0.ctrl.confirm';
        },
        
        gridOptions: function (defaultOptions) {
            return $.extend(defaultOptions, {
                rsId:'settleControl.t0',
                gid: 'settle-controls-grid-t0',
                url: url._('settle.control.zero'),
                tableCenterTitle: 'T+0 控制表'

            });
        }
    });
    var SettleControlOne = AbstratView.extend({
        tabId: 'menu.tc.settle.control',
        serializeData: function () {
            return {data: {gridId: 'settle-controls-grid-one'}};
        },

        getTransferUrl: function () {
            return 'settle.one.ctrl.transfer';
        },

        getCheckUrl: function () {
            return 'settle.one.ctrl.check';
        },

        getConfirmUrl: function () {
            return 'settle.one.ctrl.confirm';
        },

        gridOptions: function (defaultOptions) {
            return $.extend(defaultOptions, {
                rsId:'settleControl.tc',
                gid: 'settle-controls-grid-one',
                url: url._('settle.control.one'),
                tableCenterTitle: 'T+C 控制表'

            });
        }
    });

    var SettleControlrViewT1 = AbstratView.extend({
        tabId: 'menu.settle.control',
        
        gridOptions: function (defaultOptions) {
            return $.extend(defaultOptions, {
                responsiveOptions: {
                    hidden: {
                        ss: ['settleNum', 'ctlFlag', 'custNo', 'inDate', 'payBank', 'acctNo', 'acctUn', 'acctName', 'settleMode', 'hostName', 'hostPort', 'totalNum', 'totalAmt', 'succNum', 'succAmt', 'failNum', 'failAmt', 'unknowNum', 'unknowAmt', 'oprId1', 'oprId2', 'recCreateTime', 'recOprTime1', 'recOprTime2', 'recInTime', 'nodeTime'],
                        xs: ['settleNum', 'ctlFlag', 'custNo', 'inDate', 'payBank', 'acctUn', 'settleMode', 'hostName', 'hostPort', 'totalNum', 'totalAmt', 'succNum', 'succAmt', 'failNum', 'failAmt', 'unknowNum', 'unknowAmt', 'oprId1', 'oprId2', 'recCreateTime', 'recOprTime1', 'recOprTime2', 'recInTime', 'nodeTime'],
                        sm: ['inDate', 'payBank', 'acctUn', 'settleMode', 'hostName', 'hostPort', 'failNum', 'failAmt', 'unknowNum', 'unknowAmt', 'oprId1', 'oprId2', 'recCreateTime', 'recOprTime1', 'recOprTime2', 'recInTime', 'nodeTime'],
                        md: ['inDate', 'payBank', 'acctUn', 'settleMode', 'hostName', 'hostPort', 'oprId1', 'oprId2', 'recCreateTime', 'recOprTime1', 'recOprTime2', 'recInTime', 'nodeTime'],
                        ld: ['inDate', 'payBank', 'acctUn', 'settleMode', 'hostName', 'hostPort', 'oprId1', 'oprId2', 'recCreateTime', 'recOprTime1', 'recOprTime2', 'recInTime', 'nodeTime']
                    }
                }
            });
        }
    });


	var Controller = Marionette.Controller.extend({

		listSettleControls: function(kw) {
			console.info('new view settleControl');
			App.show(new SettleControlrViewT1());

		},//@listSettleControls

        listT0SettleControls: function () {
            console.info('new view settleControl');
            App.show(new SettleControlT0());

        },
        listOneSettleControls: function () {
            console.info('new view settleControl');
            App.show(new SettleControlOne());

        }

	});


	var ctrl = new Controller();

    App.on('settleControls:list', function() {
        console.log('监听到 App触发的"settleControls:list"事件, 触发清分清算下的清算控制表');
        ctrl.listSettleControls();
    });

    App.on('settleControls:t0:list', function() {
        console.log('监听到 App触发的"settleControls:list"事件, 触发清分清算下的清算控制表');
        ctrl.listT0SettleControls();
    });

    App.on('settleControls:one:list', function() {
        console.log('监听到 App触发的"settleControls:list"事件, 触发清分清算下的清算控制表');
        ctrl.listOneSettleControls();
    });

    return ctrl;


});