define(['App'], function(App) {

    //清算周期
    var DISCCYCLE_MAP = {
        "T0": "T0",
        "T1": "T1",
        "S0": "S0"
    }

	var Controller = Marionette.Controller.extend({

		listSettleErrors: function(options) {
            require(['app/oms/settle/settle-error/list/list-view'], function(View) {
                var SubView = View.SettleErrors.extend({
                    url: 'settle.tn.error',
                    rsId:'settleError',
                    tabId: 'menu.settle.error',
                    getGid: function () {
                        return 'settle-errors-grid';
                    },
                    autoBatch: function (type){
                        var val = '';
                        switch (type)
                        {
                            case 'ctx':
                                val = 'settleError.autoDo';
                                break;
                            case 'url':
                                val = 'settle.tn.error.autoBatch';
                                break;
                            default:
                                val = '';
                        }
                        return val;
                    },
                    getFilters: function (defaultFilters) {
                        //来电弹屏自动触发查询配置
                        if(_.isArray(options)){
                            _.each(options, function(item, idx){
                                var components = defaultFilters[0].components;
                                var componentItem = _.findWhere(components, {name: item.name});
                                !!componentItem && (_.extend(componentItem, item.params));
                            });
                        }
                        return defaultFilters;
                    },
                    download: function (){
                        return 'settle.tn.error.download';
                    },
                    update: function(){
                        return 'api/settle/errors/';
                    },
                    addCtx: function (){
                        return 'settleError.newAdd';//权限
                    }
                });
                var settleErrorsView =  new SubView({});
                App.show(settleErrorsView);
            });
		},
        //异常处理--清算失败
        listExceptionSettleErrors: function () {
            require(['app/oms/settle/settle-error/list/list-view'], function(View) {
                var SubView = View.SettleErrors.extend({
                    url: 'settle.error',
                    rsId:'settleError',
                    tabId: 'menu.exception.settleerror',
                    getGid: function () {//gid名称
                        return 'exception-settle-errors-grid';
                    },
                    autoBatch: function (type){//自动成批
                        var val = '';
                        switch (type)
                        {
                            case 'ctx':
                              val = 'settleError.autoDo';
                              break;
                            case 'url':
                                val = 'settle.error.genarate';
                                break;
                            default:
                                val = '';
                        }
                        return val;
                    },
                    download: function (){
                        return 'settle.error.download';
                    },
                    update: function(){
                        return 'api/settle/errors/';
                    },
                    addCtx: function (){
                        return 'settleError.newAdd';
                    },
                    getFilters: function (defaultFilters) {//注意： 现在只有异常处理-失败表才有这个结算周期查询
                        var components = defaultFilters[0].components;
                        var componentItem = {
                            label: '结算周期',
                            name: 'discCycle',
                            type: 'select',
                            options: {
                                sopt: ['eq'],
                                value: DISCCYCLE_MAP
                            }
                        };
                        components.push(componentItem);

                        return defaultFilters;
                    }
                });
                var settleErrorsView =  new SubView({});
                App.show(settleErrorsView);
            });
        },
        //S0秒到--清算失败
        listFasterSettleErrors: function () {
            require(['app/oms/settle/settle-error/list/list-view'], function(View) {
                var SubView = View.SettleErrors.extend({
                    tabId: 'menu.t0.faster.error',
                    rsId:'settleFasterError',
                    url: 'settle.faster.error',
                    getGid: function () {
                        return 'settle-faster-error-grid';
                    },
                    autoBatch: function (type){
                        var val = '';
                        switch (type)
                        {
                            case 'ctx':
                                val = 'settleFasterError.autoDo';
                                break;
                            case 'url':
                                val = 'settle.faster.genarate';
                                break;
                            default:
                                val = '';
                        }
                        return val;
                    },
                    download: function (){
                        return 'settle.faster.error.download';
                    },
                    update: function(){
                        return 'api/settle/errors/';
                    },
                    addCtx: function (){
                        return 'settleFasterError.add';
                    }
                });
                var settleErrorsView =  new SubView({});
                App.show(settleErrorsView);
            });
        },
        //T0清算--清算失败
        listSettleT0Errors: function () {
            require(['app/oms/settle/settle-error/list/list-view'], function(View) {
                var SubView = View.SettleErrors.extend({
                    tabId: 'menu.settle.t0.error',
                    rsId: 'settleT0Error',
                    url: 'settle.T0.error',
                    getGid: function () {
                        return 'settle-T0-error-grid';
                    },
                    autoBatch: function (type){
                        var val = '';
                        switch (type)
                        {
                            case 'ctx':
                                val = 'settleT0Error.autoDo';
                                break;
                            case 'url':
                                val = 'settle.T0.genarate';
                                break;
                            default:
                                val = '';
                        }
                        return val;
                    },
                    download: function (){
                        return 'settle.T0.error.download';
                    },
                    update: function(){
                        return 'api/settle/errors/';
                    },
                    addCtx: function (){
                        return 'settleT0Error.add';
                    }
                });
                var settleErrorsView =  new SubView({});
                App.show(settleErrorsView);
            });
        }
	});

	var ctrl = new Controller();

    App.on('settleErrors:list', function() {
        ctrl.listSettleErrors();
    });

    App.on('exception:settleErrors:list', function() {
        ctrl.listExceptionSettleErrors();
    });

    App.on('settleFaster:t0:error:list', function() {
        ctrl.listFasterSettleErrors();
    });

    App.on('settle:t0:error:list', function() {
        ctrl.listSettleT0Errors();
    });

    return ctrl;

});