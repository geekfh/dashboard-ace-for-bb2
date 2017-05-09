define(['App',
    'tpl!app/oms/settle/trade-txn/list/templates/table-ct.tpl',
    'tpl!app/oms/settle/trade-txn/list/templates/detail-dialog.tpl',
    'app/oms/settle/trade-txn/list/transaction-view',
    'i18n!app/oms/common/nls/settle',
    'assets/scripts/fwk/component/common-search-date',
    'app/oms/operate/coupon/list-view',
    'jquery.jqGrid',
    'jquery.validate',
    'bootstrap-datepicker',
    'moment.origin'
], function(App, tableCtTpl, detailDialogTpl, TransactionView, settleLang, SearchDate) {

    var DIR_DISCCYCLE = {
        '0': 'T+0',
        '1': 'T+1',
        '2': 'T+2'
    };

    var STAT_MAP = {
        '0' : settleLang._('trade.txn.stat.0'),  //成功应答
        '1' : settleLang._('trade.txn.stat.1'),  //请求
        '2' : settleLang._('trade.txn.stat.2'),  //已冲正
        '3' : settleLang._('trade.txn.stat.3'),  //已撤销
        '4' : settleLang._('trade.txn.stat.4'),  //已确认
        '5' : settleLang._('trade.txn.stat.5'),  //部分退货
        '6' : settleLang._('trade.txn.stat.6'),  //全部退货
        '7' : settleLang._('trade.txn.stat.7'),  //交易异常
        '9' : '交易取消'
    },

    _STAT_MAP = {
        "totalNum":"交易笔数",
        "totalAmt":"交易金额"
    },
    //条件查询，过滤等于为in！配合后端 = = ||||
    SUBCODE_MAP = {
        '31,51' : settleLang._('trade.txn.sub.code.31'), //消费
        '30,50' : settleLang._('trade.txn.sub.code.30'), //余额查询
        '32,52' : settleLang._('trade.txn.sub.code.32'), //消费冲正
        '33,53' : settleLang._('trade.txn.sub.code.33'), //消费撤销
        '34,54' : settleLang._('trade.txn.sub.code.34'), //消费撤销冲正
        '35,55' : settleLang._('trade.txn.sub.code.35')  //退货
    },

    TXSUBCODE_MAP = {
        '0033':'POS消费撤销',
        '0053':'POS消费撤销',
        '0032':'POS消费冲正',
        '0052':'POS消费冲正',
        '0031':'POS消费',
        '0051':'POS消费',
        '9090':'代扣',
        '7051':'电子现金脱机消费',
        '1033':'微信收款撤销',
        '1133':'慧收银微信收款撤销',
        '1233':'好哒微信收款撤销',
        '2033':'支付宝收款撤销',
        '2133':'慧收银支付宝收款撤销',
        '2233':'好哒支付宝收款撤销',
        '2333':'支付宝APP支付撤销',
        '6033':'钱包信用消费撤销',
        '6333':'好哒白条支付撤销',
        '6133':'钱包快捷消费撤销',
        '6233':'钱包余额消费撤销',
        '8033':'快捷支付无卡撤销',
        '1031':'微信收款',
        '1131':'慧收银微信收款',
        '1231':'好哒微信收款',
        '2031':'支付宝收款',
        '2131':'慧收银支付宝收款',
        '2231':'好哒支付宝收款',
        '2331':'支付宝APP支付',
        '6031':'钱包信用消费',
        '6331':'好哒白条支付',
        '6131':'钱包快捷消费',
        '6231':'钱包余额消费',
        '8031':'快捷支付无卡消费'
    };

    TXSUBCODENAME_MAP = {
        'POS消费撤销' : 'POS消费撤销',
        'POS消费冲正' : 'POS消费冲正',
        'POS消费' : 'POS消费',
        '代扣' : '代扣',
        '电子现金脱机消费' : '电子现金脱机消费',
        '微信收款撤销' : '微信收款撤销',
        '慧收银微信收款撤销' : '慧收银微信收款撤销',
        '好哒微信收款撤销' : '好哒微信收款撤销',
        '支付宝收款撤销' : '支付宝收款撤销',
        '慧收银支付宝收款撤销' : '慧收银支付宝收款撤销',
        '好哒支付宝收款撤销' : '好哒支付宝收款撤销',
        '支付宝APP支付撤销' : '支付宝APP支付撤销',
        '钱包信用消费撤销' : '钱包信用消费撤销',
        '好哒白条支付撤销' : '好哒白条支付撤销',
        '钱包快捷消费撤销' : '钱包快捷消费撤销',
        '钱包余额消费撤销' : '钱包余额消费撤销',
        '快捷支付无卡撤销' : '快捷支付无卡撤销',
        '微信收款' : '微信收款',
        '慧收银微信收款' : '慧收银微信收款',
        '好哒微信收款' : '好哒微信收款',
        '支付宝收款' : '支付宝收款',
        '慧收银支付宝收款' : '慧收银支付宝收款',
        '好哒支付宝收款' : '好哒支付宝收款',
        '支付宝APP支付' : '支付宝APP支付',
        '钱包信用消费' : '钱包信用消费',
        '好哒白条支付' : '好哒白条支付',
        '钱包快捷消费' : '钱包快捷消费',
        '钱包余额消费' : '钱包余额消费',
        '快捷支付无卡消费' : '快捷支付无卡消费'
    };
    DISC_CYCLE_MAP = {
        '0': 'T+0',
        '1': 'T+1',
        's0': 'S+0'
    },

    TRADE_TERMINAL_MAP = {
        "100": "全部",
        "101": "传统POS",
        "102": "MPOS"
    },

    PAYMENT_METHOD_MAP = {
        "200": "全部",
        "201": "刷卡",
        "202": "微信支付",
        "203": "支付宝支付"
    },

    todayDate = moment().format("YYYYMMDD"),

    DEFAULT_SEARCH_FILTERS = {
        groupOp:"AND",
        rules: [
            {field: 'stat',    op: 'eq', data: '0'}
            //{field: 'subCode', op: 'in', data: '31,51'}
        ]
    },

    ACTYPE_MAP = {
        "1": "借记卡",
        "2": "贷记卡",
        "3": "准贷记卡",
        "4": "预付费卡"
    };

    App.module('SettleApp.TradeTxn.List.View', function(View, App, Backbone, Marionette, $, _) {

        View.TradeTxns = Marionette.ItemView.extend({
            tabId: 'menu.query.trade.txn',
            template: tableCtTpl,

            onRender: function() {
                var me = this;

                _.defer(function () {
                    me.renderGrid();
                    setTimeout(function() {
                        me.bindMchtNoSingleEvent();

                        //显示默认下拉列表项
                        var condition_group = $(".condition-group");
                        $('a.cleanSearch', condition_group).on('click', function(){
                            var $paymentMethod = $(".paymentMethod-dropdown");
                            var $tradeTerminal = $(".tradeTerminal-dropdown");
                            $paymentMethod.find("li").show();
                            $tradeTerminal.find("li").show();
                        })

                    },1000);
                    // me.showTransactionDialog();
                });

            },

            gridOptions: function (defaultOptions) {
                return defaultOptions;
            },

            showDetailDialog: function (data) {
                var $el = $(detailDialogTpl({respData: data}));

                var $dialog = Opf.Factory.createDialog($el, {
                    destroyOnClose: true,
                    title: '查看记录',
                    autoOpen: true,
                    width: 500,
                    height: 550,
                    modal: true
                });
            },

            // showTransactionDialog: function (grid, model) {
            //     var dialogView = new TransactionView({rowData: model});
            //     dialogView.render();

            //     var $dialog = Opf.Factory.createDialog(dialogView.$el, {
            //         destroyOnClose: true,
            //         title: '签购单',
            //         autoOpen: true,
            //         width: 420,
            //         height: 700,
            //         modal: true,
            //         buttons: [{
            //             type: 'submit',
            //             text: '导出',
            //             click: function () {
            //                 dialogView.submitTrans();
            //             }
            //         },{
            //             type: 'cancel'
            //         }]
            //     });
            // },

            bindMchtNoSingleEvent: function () {
                var $el = this.$el;
                var $filterWrap = $el.find('.filters');

                var $mchtNo = $filterWrap.find('input.ibox42-filter-input').eq(0);
                var $mchtName = $filterWrap.find('input.ibox42-filter-input').eq(1);

                $mchtNo.on('input.mchtchange', function () {
                    $mchtName.select2('data', null);
                });

                $mchtName.on('change.mchtchange', function () {
                    $mchtNo.val('');
                });
            },

            renderGrid: function() {
                var me = this;
                //小心这个me.gridOptions 函数， 内容一样的交易流水表（目前只剩下一个），但拥有不同的权限，所以在controller上面会重新覆盖与权限有关的设置，包括rsId/actionsCol/nav等
                var grid = App.Factory.createJqGrid(
                    me.gridOptions({
                        rsId:'query.tradeTxn',
                        caption: settleLang._('tradeTxn.txt'),
                        beforeRequest: function () {
                            //如果 filters 参数为空不发请求

                            //这个回调会调用两次，不知道后续逻辑会不会受影响,目前第一次回调的时候
                            //类型是 local 不会发送请求
                            //if(filters != null){
                            //    return this.p.postData.filters=JSON.stringify(filters);
                            //}
                            //else if(!this.p.postData.filters) {
                            //    return false;
                            //}
                        },
                        filters: [
                            /*{
                                caption: '精准搜索',
                                components: [
                                    {
                                        type: 'date',
                                        label: '交易日期',
                                        ignoreFormReset: true,
                                        defaultValue: moment(),
                                        name: 'date'
                                    },{
                                        label: '交易凭证号',
                                        name: 'traceNo',
                                        options: {
                                            sopt: ['eq']
                                        },
                                        inputmask: {
                                            integer: true
                                        }
                                    }
                                ],
                                searchBtn: {
                                    text: '搜索'
                                }
                            },*/
                            {
                                caption: '条件过滤',
                                canClearSearch: true,
                                defaultRenderGrid: false,
                                //isSearchRequired: 2,
                                components: [
                                    {
                                        type: 'rangeDate',
                                        label: '时间范围',
                                        ignoreFormReset: true,
                                        limitRange: 'month',
                                        limitDate: moment(),
                                        defaultValue: [moment(), moment()],
                                        name: 'date'
                                    },{
                                        type: 'select',
                                        label: '交易类型',
                                        name: 'txSubCode',
                                        options: {
                                            value: TXSUBCODENAME_MAP,
                                            sopt: ['in', 'ni']
                                        }
                                    },{
                                        type: 'select',
                                        label: '交易状态',
                                        name: 'stat',
                                        options: {
                                            value: STAT_MAP
                                        }
                                    },{
                                        label: '商户号',
                                        name: 'ibox42',
                                        inputmask: {
                                            integer: true
                                        },
                                        options: {
                                            sopt: ['eq']
                                        }
                                    },{
                                        label: '商户名称',
                                        name: 'ibox43',
                                        type: 'select2',
                                        options: {
                                            sopt: ['eq'],
                                            select2Config: {
                                                placeholder: '搜索商户',
                                                minimumInputLength: 1,
                                                width: 200,
                                                ajax: {
                                                    type: 'get',
                                                    url: url._('mcht.name'),
                                                    dataType: 'json',
                                                    data: function (term) {
                                                        return {
                                                            kw: encodeURIComponent(term)
                                                        };
                                                    },
                                                    results: function (data) {
                                                        return {
                                                            results: data
                                                        };
                                                    }
                                                },
                                                id: function (e) {
                                                    return e.value;
                                                },
                                                formatResult: function(data){
                                                    return data.value + '_' + data.name;
                                                },
                                                formatSelection: function(data){
                                                    return data.value + '_' + data.name;
                                                }
                                            },
                                            valueFormat: function (select2Data) {
                                                return select2Data.value;
                                            }
                                        }
                                    },{
                                        label: '机构名称',
                                        name: 'brhNo',
                                        type: 'select2',
                                        options: {
                                            sopt: ['eq'],
                                            select2Config: {
                                                placeholder: '搜索机构',
                                                minimumInputLength: 1,
                                                width: 150,
                                                ajax: {
                                                    type: 'get',
                                                    url: url._('org.name'),
                                                    dataType: 'json',
                                                    data: function (term) {
                                                        return {
                                                            kw: encodeURIComponent(term)
                                                        };
                                                    },
                                                    results: function (data) {
                                                        return {
                                                            results: data
                                                        };
                                                    }
                                                },
                                                id: function (e) {
                                                    return e.value;
                                                },
                                                formatResult: function(data){
                                                    return data.name;
                                                },
                                                formatSelection: function(data){
                                                    return data.name;
                                                }
                                            },
                                            valueFormat: function (select2Data) {
                                                return select2Data.value;
                                            }
                                        }
                                    },
                                    /*{
                                        label: '扩展员',
                                        name: 'expand',
                                        type: 'select2',
                                        options: {
                                            sopt: ['eq'],
                                            select2Config: {
                                                placeholder: '搜索扩展员',
                                                minimumInputLength: 1,
                                                width: 150,
                                                ajax: {
                                                    type: 'get',
                                                    url: url._('operateor.name'),
                                                    dataType: 'json',
                                                    data: function (term) {
                                                        return {
                                                            kw: encodeURIComponent(term)
                                                        };
                                                    },
                                                    results: function (data) {
                                                        return {
                                                            results: data
                                                        };
                                                    }
                                                },
                                                id: function (e) {
                                                    return e.value;
                                                },
                                                formatResult: function(data){
                                                    return data.oprName + '(' + data.brhName + ')';
                                                },
                                                formatSelection: function(data){
                                                    return data.oprName + '(' + data.brhName + ')';
                                                }
                                            },
                                            valueFormat: function (select2Data) {
                                                return select2Data.value;
                                            }
                                        }
                                    },{
                                        label: '交易渠道',
                                        name: 'cupsNo',
                                        type: 'select2',
                                        options: {
                                            sopt: ['eq'],
                                            select2Config: {
                                                placeholder: '搜索交易渠道',
                                                minimumInputLength: 1,
                                                width: 150,
                                                ajax: {
                                                    type: 'get',
                                                    url: url._('cups.name'),
                                                    dataType: 'json',
                                                    data: function (term) {
                                                        return {
                                                            kw: encodeURIComponent(term)
                                                        };
                                                    },
                                                    results: function (data) {
                                                        return {
                                                            results: data
                                                        };
                                                    }
                                                },
                                                id: function (e) {
                                                    return e.value;
                                                },
                                                formatResult: function(data){
                                                    return data.name;
                                                },
                                                formatSelection: function(data){
                                                    return data.name;
                                                }
                                            },
                                            valueFormat: function (select2Data) {
                                                return select2Data.value;
                                            }
                                        }
                                    },*/
                                    {
                                        label: '结算周期',
                                        name: 'discCycle',
                                        type: 'select',
                                        options: {
                                            value: DISC_CYCLE_MAP,
                                            sopt: ['eq']
                                        }
                                    },{
                                        label: '交易终端',
                                        name: 'tradeTerminal',
                                        type: 'select',
                                        options: {
                                            value: TRADE_TERMINAL_MAP
                                        },
                                        onClickFn: function(e){
                                            var $target = $(e.target);
                                            if($target.is("a")){
                                                var $source = $(".paymentMethod-dropdown");
                                                var text = $target.text();
                                                if(text=="传统POS"){
                                                    $source.find('li:not(:contains("刷卡"))').hide();
                                                    !$source.find('button:contains("刷卡")').length&&cleanSelect($source);
                                                } else {
                                                    $source.find("li").show();
                                                }
                                            }
                                        }
                                    },{
                                        label: '支付方式',
                                        name: 'paymentMethod',
                                        type: 'select',
                                        options: {
                                            value: PAYMENT_METHOD_MAP
                                        },
                                        onClickFn: function(e){
                                            var $target = $(e.target);
                                            if($target.is("a")){
                                                var $source = $(".tradeTerminal-dropdown");
                                                var text = $target.text();
                                                if(text=="微信支付"||text=="支付宝支付") {
                                                    $source.find('li:not(:contains("MPOS"))').hide();
                                                    !$source.find('button:contains("MPOS")').length&&cleanSelect($source);
                                                } else {
                                                    $source.find("li").show();
                                                }
                                            }

                                        }
                                    },{
                                        label: '卡类型',
                                        name: 'acType',
                                        type: 'select',
                                        options: {
                                            value: ACTYPE_MAP
                                        }
                                    }
                                ],
                                searchBtn: {
                                    text: '过滤',
                                    onClickSubmit: function(postData){
                                        var filters = postData&&postData.filters;
                                            filters = filters? JSON.parse(filters):{rules:[]};
                                        var rules = filters.rules;
                                        var filterNameArr = ['tradeTerminal', 'paymentMethod'];

                                        //首先清除掉上一次查询条件
                                        try{
                                            delete postData.tradeTerminal;
                                            delete postData.paymentMethod;
                                        }
                                        catch(e){}

                                        for(var i=0; i<rules.length; i++){
                                            var rule = rules[i];
                                            for(var j=0; j<filterNameArr.length; j++){
                                                var filterName = filterNameArr[j];
                                                if(rule.field==filterName){
                                                    postData[filterName] = rule.data||"";
                                                    rules.splice(i--,1);
                                                    break;
                                                }
                                            }
                                        }

                                        //查到是否有txName改成txSubCode
                                        searchByTxName(rules, postData, filters);

                                        //postData.filters = JSON.stringify(filters);

                                        return postData;
                                    }
                                },
                                beforeSubmit: function(postData){
                                    var filters = postData && postData.filters;
                                    filters = filters? JSON.parse(filters):{rules:[]};
                                    var rules = filters.rules;

                                    //如日期条件按单日查询（等于），则不做任何限制；
                                    //如日期条件按范围查询，则要求必须输入商户号
                                    var days = getDateRange(rules);
                                    if(_.filter(rules, function(rule){return rule.field == 'date'}).length > 1 && days > 0 && !_.find(rules, function(rule){return rule.field == 'ibox42'})){
                                        Opf.alert('请输入商户编号！');
                                        return false;
                                    }
                                }
                            }
                        ],
                        
                        stats:{
                            labelConfig:_STAT_MAP,
                            items:[
                                {name: 'totalNum', type:'count'},
                                {name: 'totalAmt', type:'currency'}        
                            ]
                        },
                        
                        actionsCol: {
                            edit: false,
                            del : false,
                            extraButtons:[
                                //2017年4月份需求
                                // {
                                //     name: 'refreshStatus',
                                //     caption: '状态查询更新',
                                //     title: '状态查询更新',
                                //     icon: '',
                                //     click: function (name, opts, rowData) {
                                //         Opf.confirm('是否确定更新？<br><br> ', function (result) {
                                //             if (result) {
                                //                 Opf.ajax({
                                //                     type: 'put',
                                //                     url: 'api/settle/trade-water/status/refresh',
                                //                     jsonData: {
                                //                         tradeNo: rowData.orderNo,
                                //                         source: rowData.fill,
                                //                         tradeType: rowData.subCode
                                //                     },
                                //                     success: function () {
                                //                         grid.trigger('reloadGrid', {current: true});
                                //                     }
                                //                 });
                                //             }
                                //         });
                                //     }
                                // }
                                /*{name: 'transaction', caption:'导出签购单',  title:'导出签购单', icon: '', click: function(btn, obj, model) {
                                    // var submitUrl = url._(me.getTransferUrl(), {id: model.id});
                                    // me.onClickExtraOperate(submitUrl);
                                
                                    me.showTransactionDialog(grid, model);
                                }}*/
                            ],
                            canButtonRender: function(name, opts, rowData) {
                                // if(name == 'refreshStatus' && rowData.stat == 1 || name == 'refreshStatus' && rowData.date == moment().format('YYYYMMDD')){
                                //         return false;
                                // }
                            }
                        },
                        nav: {
                            formSize: {
                                width: Opf.Config._('ui', 'query.tradeTxn.grid.form.width'),
                                height: Opf.Config._('ui', 'query.tradeTxn.grid.form.height')
                            },
                            actions: {
                                add: false,
                                viewfunc: function (id) {
                                    Opf.ajax({
                                        type: 'GET',
                                        url: url._('trade.txn.detail', {id: id}),
                                        success: function (resp) {
                                            me.showDetailDialog(resp);
                                        }

                                    });
                                }
                            },
                            search: {
                                width: 500,
                                customComponent: {
                                    items: [{//放大镜面板里，外部filter组件
                                        type: 'singleOrRangeDate',
                                        label: '交易日期',
                                        limitRange: 'month',
                                        name: 'date'
                                    }]
                                },
                                // 点击重置按钮时，搜索条件保留以下值
                                resetReserveValue: [
                                    {
                                        field: 'date',
                                        op: 'ge',
                                        data: moment().subtract('day',1).format('YYYYMMDD')
                                    },{
                                        field: 'date',
                                        op: 'le',
                                        data: moment().format('YYYYMMDD')
                                    }
                                ],
                                // 以下实现了默认查询条件，查看demo http://www.trirand.com/blog/jqgrid/jqgrid.html ---> Search Templates
                                tmplNames: ["customDefaultSearch"],
                                tmplFilters: [DEFAULT_SEARCH_FILTERS],
                                tmplLabel: "",
                                beforeShowSearch: function(form){
                                    // 查看 jquery.jqgrid.js 中的 showFilter 函数，发现：
                                    // form 参数在 beforeShowSearch 第一次执行时有值，之后执行都为空数组
                                    if (form.length) {
                                        me.form = form;
                                    }
                                    //选中定制的搜索模板并触发change事件
                                    $(me.form).parent().find('select.ui-template').val("0").trigger('change').hide();

                                    return true;
                                },

                                onSearch: function() {
                                    var postData = $(this).jqGrid('getGridParam', 'postData');
                                    var filters = postData && postData.filters;
                                        filters = filters? JSON.parse(filters):{rules:[]};
                                    var rules = filters.rules;
                                    var filterNameArr = ['tradeTerminal', 'paymentMethod'];

                                    //首先清除掉上一次查询条件
                                    try{
                                        delete postData.tradeTerminal;
                                        delete postData.paymentMethod;
                                    }
                                    catch(e){}

                                    for(var i=0; i<rules.length; i++){
                                        var rule = rules[i];
                                        for(var j=0; j<filterNameArr.length; j++){
                                            var filterName = filterNameArr[j];
                                            if(rule.field==filterName){
                                                postData[filterName] = rule.data||"";
                                                rules.splice(i--,1);
                                                break;
                                            }
                                        }
                                    }

                                    if(_.filter(rules, function(rule){return rule.field == 'date'}).length == 2){
                                        var days = getDateRange(rules);
                                        if(days > 0  && rules.length < 3){
                                            Opf.alert('请输入两项以上的查询条件！');
                                            return false;
                                        }
                                    }

                                    //查找到rules有paymentMethod字段，排除paymentMethod，放入rules
                                    /*var arrT = _.filter(rules, function(rule){return (rule.field == 'paymentMethod'||rule.field == 'tradeTerminal') });
                                    if(arrT.length > 0){
                                        rules = filters.rules = _.filter(rules, function(rule){return (rule.field != 'paymentMethod'&&rule.field != 'tradeTerminal') });
                                        for(var i=0; i<arrT.length; i++) {
                                        	var item = arrT[i];
                                        	postData[item.field] = item.data;
                                        }
                                        postData.filters = JSON.stringify(filters);
                                    }*/

                                    //查找到rules有tradeTerminal字段，排除tradeTerminal，放入rules
                                    /*var arrT = _.filter(rules, function(rule){return rule.field == 'tradeTerminal'});
                                    if(arrT.length > 0){
                                        filters.rules = _.filter(rules, function(rule){return rule.field != 'tradeTerminal'});
                                        postData["tradeTerminal"] = arrT[0].data;
                                        postData.filters = JSON.stringify(filters);
                                    }*/

                                    //查到是否有txName
                                    searchByTxName(rules, postData, filters);
                                },

                                beforeRedraw: function() {

                                },

                                afterRedraw: function(){
                                    $(this).find('.operators').find('select').trigger('change');
                                    $(this).find('select.opsel').prop('disabled',true);

                                    addSearchSelect2($(this));

                                }
                            }
                        },
                        gid: 'trade-txn-grid',
                        url: url._('trade.txn'),  //api/settle/trade-water
                        colNames: {
                            id         : settleLang._('trade.txn.id'), //id
                            orderNo    : settleLang._('trade.txn.orderNo'), //订单号
                            date:         settleLang._('trade.txn.date'), //交易日期
                            time:         settleLang._('trade.txn.time'), //交易时间
                            traceNo:      settleLang._('trade.txn.traceNo'), //交易凭证号
                            amt:          settleLang._('trade.txn.amt'), //交易金额
                            acNo:         settleLang._('trade.txn.acNo'), //消费卡号
                            acType:       '卡类型',
                            iboxNo:       settleLang._('trade.txn.iboxNo'), //终端编号
                            branchName:   settleLang._('trade.txn.branchName'), //机构名称
                            brhNo:        settleLang._('trade.txn.brNo'), //机构号
                            ibox42:       settleLang._('trade.txn.ibox42'), //商户号
                            ibox43:       settleLang._('trade.txn.ibox43'), //商户名称
                            userId:       settleLang._('trade.txn.userId'), //用户编号
                            userName:     settleLang._('trade.txn.userName'), //用户名称
                            userAccNo:    settleLang._('trade.txn.userAccNo'), //用户账号
                            expandName:   settleLang._('trade.txn.expandName'), //拓展员
                            cupsNo:       settleLang._('trade.txn.cupsNo'), //交易渠道
                            cupsName:     settleLang._('trade.txn.cupsName'), //交易渠道
                            cupsMchtNo:   settleLang._('trade.txn.cupsMchtNo'), //渠道商户号
                            cupsMchtName: settleLang._('trade.txn.cupsMchtName'), //渠道商户名
                            tradeTerminal: '交易终端',
                            paymentMethod: '支付方式',
                            txName:       '交易名称',
                            txSubCode:    '交易类型',
                            subCode:      settleLang._('trade.txn.name'), //subCode
                            stat:         settleLang._('trade.txn.stat'), //交易状态
                            fdxxx:        settleLang._('trade.txn.fdxxx'), //交易描叙
                            fd37:         settleLang._('trade.txn.fd37'), //检索参考号
                            fd12:         settleLang._('trade.txn.fd12'), //受卡方所在地时间
                            fd13:         settleLang._('trade.txn.fd13'), //受卡方所在地日期
                            fd39:         settleLang._('trade.txn.fd39'),  //'第三方响应码'
                            discCycle:    settleLang._('trade.txn.discCycle'), //结算周期,
                            expand: '扩展员',
                            errStr:    settleLang._('trade.txn.errStr'), //失败原因,
                            fill: '交易来源'
                        },

                        responsiveOptions: {
                            hidden: {
                                ss: ['id', 'date', 'traceNo', 'amt', 'acNo', 'iboxNo', 'branchName', 'brhNo', 'ibox43', 'ibox42', 'userId', 'userName', 'userAccNo', 'expandName', 'cupsNo', 'cupsName', 'txName', 'stat', 'fdxxx', 'fd37', 'fd12', 'fd13'],
                                xs: ['id', 'date', 'acNo', 'iboxNo', 'branchName', 'brhNo', 'ibox43', 'ibox42', 'userId', 'userName', 'userAccNo', 'expandName', 'cupsNo', 'cupsName', 'txName', 'stat', 'fdxxx', 'fd37', 'fd12', 'fd13'],
                                sm: ['id', 'date', 'acNo', 'iboxNo', 'branchName', 'brhNo', 'ibox43', 'ibox42', 'userId', 'userName', 'userAccNo', 'expandName', 'cupsNo', 'cupsName', 'stat', 'fdxxx', 'fd37', 'fd12', 'fd13'],
                                md: ['id', 'date', 'acNo', 'iboxNo', 'branchName', 'brhNo', 'ibox43', 'ibox42', 'userId', 'userName', 'userAccNo', 'expandName', 'cupsNo', 'cupsName', 'fdxxx', 'fd37', 'fd12', 'fd13'],
                                ld: ['id', 'date', 'iboxNo', 'branchName', 'brhNo', 'ibox42', 'userId', 'userName', 'userAccNo', 'expandName', 'cupsNo', 'cupsName', 'fdxxx', 'fd37', 'fd12', 'fd13']
                            }
                        },

                        colModel: [
                            {name: 'id',            index: 'id',            editable: true, sortable: false, hidden: true},
                            {name: 'date',          index: 'date',          editable: true, sortable: false, viewable: false, hidden: true},
                            {name: 'time',          index: 'time',          editable: true, sortable: false, search: true,
                                searchoptions: {
                                    sopt: ['eq']
                                },
                                formatter: dateAndTimeFormatter
                            },  //交易时间
                            {name: 'traceNo',       index: 'traceNo',       editable: true, sortable: false, search: true,
                                searchoptions: {
                                    sopt: ['eq']
                                }
                            },  //交易凭证号
                            {name: 'orderNo',       index: 'orderNo',       editable: true, sortable: false, search: true,
                                searchoptions: {
                                    sopt: ['eq']
                                }
                            },  //订单号
                            {name: 'amt',           index: 'amt',           editable: true, sortable: false,  search: true,
                                searchoptions: {
                                    sopt: ['eq']
                                }
                            },  //交易金额
                            {name: 'tradeTerminal',  index: 'tradeTerminal',  sortable: false, hidden: true,
                                search: true,
                                stype: 'select',
                                searchoptions: {
                                    sopt: ['eq'],
                                    value: TRADE_TERMINAL_MAP
                                },
                                formatter: function (val){
                                    return TRADE_TERMINAL_MAP[val] || '';
                                }
                            },//交易终端
                            {name: 'paymentMethod',  index: 'paymentMethod',  sortable: false, hidden: true,
                                search: true,
                                stype: 'select',
                                searchoptions: {
                                    sopt: ['eq'],
                                    value: PAYMENT_METHOD_MAP
                                },
                                formatter: function (val){
                                    return PAYMENT_METHOD_MAP[val] || '';
                                }
                            },//支付方式
                            {name: 'txName',  index: 'txName',  editable: true, sortable: false},//交易名称
                            {name: 'txSubCode',  index: 'txSubCode',  editable: true, sortable: false, formatter: function (val) { return TXSUBCODE_MAP[val] || ''; },
                                search: true,
                                stype: 'select',
                                searchoptions: {
                                    value: TXSUBCODENAME_MAP,
                                    sopt: ['eq']
                                }
                            },//交易类型
                            // {name: 'subCode', index: 'subCode',    hidden: true,    editable: false, sortable: false, search: false, viewable: false},
                            {name: 'stat',    index: 'stat',          editable: true, sortable: false, formatter: statFormatter, search: true,
                                stype: 'select',
                                searchoptions: {
                                    value: STAT_MAP,
                                    sopt: ['eq']
                                }
                            },  //交易状态
                            {name: 'acNo',          index: 'acNo',          editable: true, sortable: false, search: true,
                                searchoptions: {
                                    sopt: ['eq','lk']
                                }
                            },  //消费卡号
                            {name: 'acType', search: true, stype: 'select', searchoptions: { value: ACTYPE_MAP, sopt: ['eq'] }, formatter: function(val){ return ACTYPE_MAP[val] || ''; }},
                            {name: 'iboxNo',        index: 'iboxNo',        editable: true, sortable: false, search: true,
                                searchoptions: {
                                    sopt: ['eq']
                                }
                            },  //终端编号
                            {name: 'branchName',    index: 'branchName',    editable: true, sortable: false, /*search: true,*/
                                searchoptions: {
                                    sopt: ['eq']
                                }
                            },  //机构名称
                            {name: 'brhNo',          index: 'brhNo',          editable: true, search: true, sortable: false,
                                searchoptions: {
                                    sopt: ['eq']
                                }
                            },  //机构号
                            {name: 'ibox42',        index: 'ibox42',        editable: true, sortable: false, search: true,
                                searchoptions: {
                                    sopt: ['eq']
                                }
                            },  //商户号
                            {name: 'ibox43',        index: 'ibox43',        editable: true, sortable: false, search: true,
                                searchoptions: {
                                    sopt: ['eq']
                                }
                            },  //商户名称
                            {name: 'userId',        index: 'userId',        editable: true, sortable: false},  //用户编号
                            {name: 'userName',      index: 'userName',      editable: true, sortable: false, /*search: true,*/
                                searchoptions: {
                                    sopt: ['eq']
                                }
                            },  //用户名称
                            {name: 'userAccNo',     index: 'userAccNo',     editable: true, sortable: false, /*search: true,*/
                                searchoptions: {
                                    sopt: ['eq']
                                }
                            },  //用户账号
                            {name: 'expandName',    index: 'expandName',    editable: true, sortable: false, /*search: true,*/
                                searchoptions: {
                                    sopt: ['eq']
                                }
                            },  //拓展员
                            {name: 'cupsNo',        index: 'cupsNo',        editable: true, sortable: false, search: true, viewable: false,
                                searchoptions: {
                                    sopt: ['eq']
                                }
                            },  //交易渠道号
                            {name: 'cupsName',      index: 'cupsName',      editable: true, sortable: false, /*search: true,*/ viewable: true,
                                searchoptions: {
                                    sopt: ['eq']
                                }
                            },  //交易渠道名称
                            {name: 'cupsMchtNo',      index: 'cupsMchtNo',      editable: false, sortable: false, search: false, viewable: true, hidden: true
                            },  //渠道商户号
                            {name: 'cupsMchtName',      index: 'cupsMchtName',      editable: false, sortable: false, search: false, viewable: true, hidden: true
                            },  //渠道商户名
                            {name: 'fdxxx',         index: 'fdxxx',         editable: true, sortable: false},  //交易描叙
                            {name: 'fd37',          index: 'fd37',          editable: true, sortable: false},  //检索参考号
                            {name: 'fd12',          index: 'fd12',          editable: true, sortable: false},  //受卡方所在地时间
                            {name: 'fd13',          index: 'fd13',          editable: true, sortable: false},  //受卡方所在地日期
                            {name: 'fd39',          index: 'fd39',          editable: true, sortable: false, hidden: true},   //受卡方所在地日期
                            {name: 'discCycle',     index: 'discCycle', sortable: false, formatter: discCycleFormater,
                                search: true,
                                stype: 'select',
                                searchoptions: {
                                    value: DISC_CYCLE_MAP,
                                    sopt: ['eq']
                                }
                            },
                            {name: 'expand', editable: false, viewable: false, hidden: true, search: true,
                                searchoptions: {
                                    sopt: ['eq']
                                }
                            },
                            {name: 'errStr',     index: 'errStr', sortable: false, hidden:true, viewable:true, editable:false, search:false}, //失败原因
                            {name: 'fill', hidden: true}

                        ],

                        loadComplete: function () {

                        },

                        quickSearch: {
                            placeholder: '-快速查询-',
                            searchoptions: [{
                                id: 'todaySucccessTrade',
                                text: '当天成功交易',
                                rules: [{field: 'date', op: 'eq', data: todayDate},
                                        {field: 'stat', op: 'eq', data: '0'},
                                        {field: 'subCode', op: 'in', data: encodeURIComponent("31,51")}]
                            },{
                                id: 'todayFailTrade',
                                text: '当天失败交易',
                                rules: [{field: 'date', op: 'eq', data: todayDate},
                                        {field: 'stat', op: 'eq', data: '4'},
                                        {field: 'subCode', op: 'in', data: encodeURIComponent("31,51")}]
                            },{
                                id: 'todayReversalTrade',
                                text: '当天冲正交易',
                                rules: [{field: 'date', op: 'eq', data: todayDate},
                                        {field: 'stat', op: 'eq', data: encodeURIComponent("2,7")},
                                        {field: 'subCode', op: 'in', data: encodeURIComponent("31,51")}]
                            }]
                        }
                    }));
            } 

        });

    });

    function cleanSelect($select) {
        $select.find('[ref]').attr('ref', null);
        $select.find('.btn-text').text('- 请选择 -');
    }

    function discCycleFormater(val,options,rowData){
        return val == 's0' ? 'S+0' : 'T+' + val;
    }
    function dateAndTimeFormatter(val, options, rowData) {
        return (rowData.date || '') + ' ' + (timeFormatter(rowData.time) || '');
    }

    function timeFormatter(time) {
        return time.replace(/(\d{2})(\d{2})/g,'$1:$2:');
    }

    function statFormatter(val, options, rowData) {
        // 如果是状态为 0（交易成功），则要针对一下情况进行翻译
        if(val == '0'){
            if(rowData.name == 'POS消费冲正'){
                return '冲正成功';
            }else if(rowData.name == 'POS消费撤销'){
                return '撤销成功';
            }
        }

        return STAT_MAP[val] || '';
    }

/*
    function buildOrgSelectUI ($el) {
        $el.parent().width(150);
        $el.css({'height':'100%'});
        $el.select2({
            data: [{id: '1', text: '123'}],
            width: 300,
            placeholder: '- 选择适用机构 -'
        });
        $el.closest('tr').data('cached.select2', $el.data('select2'));
    }*/

    //检测表单是否需要select2，由于新增选择条件的时候会重绘
    function addSearchSelect2 (form) {
        var $form = $(form);
        var $select = $form.find('.columns select');

        //找到所有应该放select2的input，重新加上select2；
        _.each($select, function(item){
            var value = $(item).find('option:checked').attr('value');
            var $dataSel;

            // if(value == 'ibox42'){
            //     $dataSel = $(item).closest('tr').find('.data .input-elm');
            //     buildibox42SelectUI($dataSel, 'ibox42');
            // }
            if (value == 'ibox43') {
                $dataSel = $(item).closest('tr').find('.data .input-elm');
                buildibox42SelectUI($dataSel, 'ibox43');

            }
            if(value == 'brhNo'){
                $dataSel = $(item).closest('tr').find('.data .input-elm');
                buildbrhNoSelectUI($dataSel);
            }

            if(value == 'expand'){
                $dataSel = $(item).closest('tr').find('.data .input-elm');
                buildexpandSelectUI($dataSel);
            }

            if(value == 'cupsNo'){
                $dataSel = $(item).closest('tr').find('.data .input-elm');
                buildcupsNoSelectUI($dataSel);
            }
        });

        //找到所有的搜索条件下拉框重新绑定事件
        $select.on('change.addSelect2',function(){
            var me = $(this);
            var value = me.find('option:checked').attr('value');
            var $dataSel, $cachedSelect2;

            // if (value == 'ibox42') {
            //     $dataSel = me.closest('tr').find('.data .input-elm');
            //     buildibox42SelectUI($dataSel, 'ibox42');
            //
            // }
            if (value == 'ibox43') {
                $dataSel = me.closest('tr').find('.data .input-elm');
                buildibox42SelectUI($dataSel, 'ibox43');

            }else if (value === 'brhNo') {
                $dataSel = me.closest('tr').find('.data .input-elm');
                buildbrhNoSelectUI($dataSel);

            } else if (value === 'expand') {
                $dataSel = me.closest('tr').find('.data .input-elm');
                buildexpandSelectUI($dataSel);

            } else if (value === 'cupsNo') {
                $dataSel = me.closest('tr').find('.data .input-elm');
                buildcupsNoSelectUI($dataSel);

            } else {
                $cachedSelect2 = me.closest('tr').data('cached.select2');
                $cachedSelect2 && $cachedSelect2.destroy();

            }
        });

    }


    // 商户
    function buildibox42SelectUI ($el, type) {
        var urlValue = type == 'ibox42' ? 'mcht.ibox42' : 'mcht.name';
        $el.parent().width(200);
        $el.css({'height':'100%'});
        $el.select2({
            placeholder: '搜索商户',
            minimumInputLength: 1,
            width: 150,
            ajax: {
                type: 'GET',
                url: url._(urlValue),
                dataType: 'json',
                data: function (term) {
                    return {
                        kw: encodeURIComponent(term)
                    };
                },
                results: function (data) {
                    return {
                        results: data
                    };
                }
            },
            id: function (e) {
                return e.value;
            },
            formatResult: function(data){
                return data.value + '_' + data.name;
            },
            formatSelection: function(data){
                return data.value + '_' + data.name;
            }
        });
        $el.closest('tr').data('cached.select2', $el.data('select2'));        
    }

    // 机构
    function buildbrhNoSelectUI ($el) {
        $el.parent().width(200);
        $el.css({'height':'100%'});
        $el.select2({
            placeholder: '搜索机构',
            minimumInputLength: 1,
            width: 150,
            ajax: {
                type: 'get',
                url: url._('org.name'),
                dataType: 'json',
                data: function (term) {
                    return {
                        kw: encodeURIComponent(term)
                    };
                },
                results: function (data) {
                    return {
                        results: data
                    };
                }
            },
            id: function (e) {
                return e.value;
            },
            formatResult: function(data){
                return data.value + '_' + data.name;
            },
            formatSelection: function(data){
                return data.value + '_' + data.name;
            }
        });
        $el.closest('tr').data('cached.select2', $el.data('select2'));
    }

    function buildexpandSelectUI ($el) {
        $el.parent().width(200);
        $el.css({'height':'100%'});
        $el.select2({
            placeholder: '搜索扩展员',
            minimumInputLength: 1,
            width: 150,
            ajax: {
                type: 'get',
                url: url._('operateor.name'),
                dataType: 'json',
                data: function (term) {
                    return {
                        kw: encodeURIComponent(term)
                    };
                },
                results: function (data) {
                    return {
                        results: data
                    };
                }
            },
            id: function (e) {
                return e.value;
            },
            formatResult: function(data){
                return data.brhName + '_' + data.oprName;
            },
            formatSelection: function(data){
                return data.brhName + '_' + data.oprName;
            }
        });
        $el.closest('tr').data('cached.select2', $el.data('select2'));
    }

    function buildcupsNoSelectUI ($el) {
        $el.parent().width(200);
        $el.css({'height':'100%'});
        $el.select2({
            placeholder: '搜索交易渠道',
            minimumInputLength: 1,
            width: 150,
            ajax: {
                type: 'GET',
                url: url._('cups.name'),
                dataType: 'json',
                data: function (term) {
                    return {
                        kw: encodeURIComponent(term)
                    };
                },
                results: function (data) {
                    return {
                        results: data
                    };
                }
            },
            id: function (e) {
                return e.value;
            },
            formatResult: function(data){
                return data.name;//data.value + '_' +
            },
            formatSelection: function(data){
                return data.name;//data.value + '_' +
            }
        });
        $el.closest('tr').data('cached.select2', $el.data('select2'));
    }

    function getDateRange(rules){
        var dateRange =_.pluck(rules, 'data');
        var dateBegin = new Date(dateRange[0].substring(0,4)+'/'+dateRange[0].substring(4,6)+'/'+dateRange[0].substring(6,8));
        var dateEnd = new Date(dateRange[1].substring(0,4)+'/'+dateRange[1].substring(4,6)+'/'+dateRange[1].substring(6,8));
        var daysTime = dateEnd.getTime() - dateBegin.getTime();
        var days = parseInt(daysTime / (1000 * 60 * 60 * 24));
        return days;
    }

    //搜索查询[交易类型]，规则：带subCode、txCode、txName
    var TXNAME_BY_SEARCH_MAP = [{
        txCode: '00',
        subCode: '33,53',
        txName: 'POS消费撤销'
    },{
        txCode: '00',
        subCode: '32,52',
        txName: 'POS消费冲正'
    },{
        txCode: '00',
        subCode: '31,51',
        txName: 'POS消费'
    },{
        txCode: '90',
        subCode: '90',
        txName: '代扣'
    },{
        txCode: '70',
        subCode: '51',
        txName: '电子现金脱机消费'
    },{
        txCode: '10',
        subCode: '33',
        txName: '微信收款撤销'
    },{
        txCode: '11',
        subCode: '33',
        txName: '慧收银微信收款撤销'
    },{
        txCode: '12',
        subCode: '33',
        txName: '好哒微信收款撤销'
    },{
        txCode: '20',
        subCode: '33',
        txName: '支付宝收款撤销'
    },{
        txCode: '21',
        subCode: '33',
        txName: '慧收银支付宝收款撤销'
    },{
        txCode: '22',
        subCode: '33',
        txName: '好哒支付宝收款撤销'
    },{
        txCode: '23',
        subCode: '33',
        txName: '支付宝APP支付撤销'
    },{
        txCode: '60',
        subCode: '33',
        txName: '钱包信用消费撤销'
    },{
        txCode: '63',
        subCode: '33',
        txName: '好哒白条支付撤销'
    },{
        txCode: '61',
        subCode: '33',
        txName: '钱包快捷消费撤销'
    },{
        txCode: '62',
        subCode: '33',
        txName: '钱包余额消费撤销'
    },{
        txCode: '80',
        subCode: '33',
        txName: '快捷支付无卡撤销'
    },{
        txCode: '10',
        subCode: '31',
        txName: '微信收款'
    },{
        txCode: '11',
        subCode: '31',
        txName: '慧收银微信收款'
    },{
        txCode: '12',
        subCode: '31',
        txName: '好哒微信收款'
    },{
        txCode: '20',
        subCode: '31',
        txName: '支付宝收款'
    },{
        txCode: '21',
        subCode: '31',
        txName: '慧收银支付宝收款'
    },{
        txCode: '22',
        subCode: '31',
        txName: '好哒支付宝收款'
    },{
        txCode: '23',
        subCode: '31',
        txName: '支付宝APP支付'
    },{
        txCode: '60',
        subCode: '31',
        txName: '钱包信用消费'
    },{
        txCode: '63',
        subCode: '31',
        txName: '好哒白条支付'
    },{
        txCode: '61',
        subCode: '31',
        txName: '钱包快捷消费'
    },{
        txCode: '62',
        subCode: '31',
        txName: '钱包余额消费'
    },{
        txCode: '80',
        subCode: '31',
        txName: '快捷支付无卡消费'
    }];

    function searchByTxName(rules, postData, filters){
        var arrTxName = _.filter(rules, function(rule){return rule.field == 'txSubCode'});
        if(arrTxName.length > 0){
            var result = _.findWhere(TXNAME_BY_SEARCH_MAP, {txName: decodeURIComponent(arrTxName[0].data)});//查出对应txName集合
            filters.rules.push({field: "txCode",op: 'eq', data: result.txCode});
            filters.rules.push({field: "subCode",op: 'in', data: result.subCode});
            //移除txName
            filters.rules = _.filter(rules, function(rule){return rule.field != 'txSubCode'});

            postData.filters = JSON.stringify(filters);
        }
        else{
            postData.filters = JSON.stringify(filters);
        }
    }

    //验证数字
    function isTrueByNum(val){
    	if (val){return val.replace(/[-][0-9]*$/g, '');}
    	else
    		return "";
    }

    App.__events__.jumpTo_coupon = function(self){
        var $self = $(self);
        var couponId = $self.attr('data-value');
        var filters = {"groupOp":"AND", "rules":[
            {"field":"couponId","op":"eq","data":couponId}
        ]};

        //设置默认查询信息
        var setDefaultValue = function(gridId, params){
            var timeout = setInterval(function(){
                var currentPanel = App.getCurTabPaneEl();
                var $grid = currentPanel.find('table#'+gridId);
                var gridParam = $grid.jqGrid('getGridParam');

                if(_.isObject(gridParam)){
                    clearInterval(timeout);

                    $grid.jqGrid('setGridParam', {
                        datatype: 'json'
                    });

                    _.defer(function(){
                        var postData = gridParam.postData;
                            postData.filters = params;

                        $grid.trigger("reloadGrid", {page:1});
                    });
                }
            }, 100);
        };

        App.trigger('operate:discountCoupon:list');
        setDefaultValue('discount-coupon-grid-table', JSON.stringify(filters));
    };

    return App.SettleApp.TradeTxn.List.View;

});
