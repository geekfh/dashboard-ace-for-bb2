//此Controller对应于清分清算下的商户清算明细表
define(['App'], function(App) {
    var Controller = Marionette.Controller.extend({
        listMchtSettleDetail: function(kw) {
            require(['app/oms/settle/mcht-settle-detail/list/list-view'], function(View) {
                console.info('new view mcht-settle-detail');

                var MchtSettleDetails = View.MchtSettleDetails.extend({
                    gridOptions: function (defaultOptions) {
                        var me = this;
                        var downloadOptions = {
                            download: {
                                url: url._('mcht.settle.detail.download'),
                                //必须返回对象
                                params: function () {
                                    return {filters: me.queryFilters};
                                },
                                queueTask: {//不配置就不在任务队列里生成一项，通常都要配置
                                    name: function () {
                                        return '商户清算明细';
                                    }
                                }
                            },
                            loadComplete: function(){
                                var postData = $(me.grid).jqGrid('getGridParam', 'postData') || {};
                                me.queryFilters = postData.filters||"";
                            }
                        };
                        return $.extend(defaultOptions, downloadOptions);
                    }
                });

                var mchtSettleDetail =  new MchtSettleDetails({});
                App.show(mchtSettleDetail);
            });
        },//@listBatMainCtlDetails

        listQueryMchtSettleDetail: function(options) {
            require(['app/oms/settle/mcht-settle-detail/list/list-view'], function(View) {
                console.info('new view mcht-settle-detail');
                var extraOptions = {
                    rsId:'query.mchtSettleDetail'
                    //actionsCol: {
                    //    width: 130,
                    //    edit : false,
                    //    del: false,
                    //    canButtonRender: function (name, opts, rowData) {
                    //        // 0-大额拆分  1-不是大额拆分
                    //        var status = rowData.flag;
                    //        //status 等于 状态 0,就显示按钮
                    //        if(name === 'maxAmountList' && status != '0' ){
                    //            return false;
                    //        }
                    //    },
                    //    extraButtons: [
                    //        {
                    //            name: 'maxAmountList', caption:'大额拆分列表', title:'大额拆分', icon: '',
                    //            click: function(name, opts, rowData) {
                    //                require(['app/oms/settle/mcht-settle-detail/list/list-maxAmount'], function(View){
                    //                    var maxAmountView = new View({id: rowData.id}).render();
                    //                    maxAmountView.showDialog(maxAmountView);
                    //                    maxAmountView.$el.on('reloadParentGrid',function(){
                    //                        me.grid.trigger('reloadGrid');
                    //                    });
                    //                });
                    //            }
                    //        }
                    //    ]
                    //}
                };

                var SearchView = View.MchtSettleDetails.extend({
                    tabId: 'menu.query.mcht.settle.detail',
                    getGid: function () {
                        return 'query-mcht-settle-detail-grid';
                    },
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

                var mchtSettleDetail = new SearchView({});
                App.show(mchtSettleDetail);

            });
        }
    });

    var ctrl = new Controller();

    App.on('mchtSettleDetail:list', function() {
        console.log('监听到 App触发的"mchtSettleDetail:list"事件, 触发清分清算下的商户清算明细表');
        ctrl.listMchtSettleDetail();
    });

    App.on('mchtSettleDetail:list:query', function() {
        console.log('监听到 App触发的"mchtSettleDetail:list:query"事件, 触发信息查询下的商户清算明细表');
        ctrl.listQueryMchtSettleDetail();
    });

    return ctrl;
});