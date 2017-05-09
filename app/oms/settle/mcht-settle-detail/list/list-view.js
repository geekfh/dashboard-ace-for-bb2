/**
 * 清分清算/商户清算明细
 */
define(['App',
    'tpl!app/oms/settle/mcht-settle-detail/list/templates/table-ct.tpl',
    'i18n!app/oms/common/nls/settle',
    'assets/scripts/fwk/component/common-search-date',
    'jquery.jqGrid',
    'jquery.validate',
    'bootstrap-datepicker',
    'moment.override'
], function(App, tableCtTpl, settleLang, SearchDate) {

    var RESULTSTATUS_MAP = {
        '0' : settleLang._('mcht.settle.detail.result.flag0'),  //入账成功
        '1' : settleLang._('mcht.settle.detail.result.flag1'),  //入账失败
        '2' : settleLang._('mcht.settle.detail.result.flag2'),  //未处理
        '3' : '直接插入入账差错表进行手工清算'   //入账失败
    };

    var STAT_MAP = {
        totalDebitAmt: "借记卡交易金额",
        totalDebitNum: "借记卡交易笔数",
        totalDebitPercent: "借记卡交易占比",
        "totalTxAmt":"交易金额",
        "totalSettleAmt":"清算金额",
        "totalTxNum":"交易笔数",
        "totalCreditAmt":"贷记卡交易金额",
        "totalCreditNum":"贷记卡交易笔数",
        "totalCreditPercent":"贷记卡交易占比"
    };

    App.module('SettleApp.MchtSettleDetail.List.View', function(View, App, Backbone, Marionette, $, _) {

        View.MchtSettleDetails = Marionette.ItemView.extend({
            tabId: 'menu.mcht.settle.detail',
            template: tableCtTpl,
            events: {},
            initialize: function () {},

            beforeRenderGridView: function () {
                var me = this;

                this.$el.find('.set-grid-table').attr('id', me.getGid() + '-table');
                this.$el.find('.set-grid-pager').attr('id', me.getGid() + '-pager');
            },

            getGid: function () {
                return 'mcht-settle-detail-grid';
            },

            onRender: function() {
                var me = this;
                this.beforeRenderGridView();
                _.defer(function(){
                    me.renderGrid();
                });
            },

            gridOptions: function (defaultOptions) {
                return defaultOptions;
            },

            renderGrid: function() {
                var me = this;
                
                var grid = me.grid = App.Factory.createJqGrid(me.gridOptions({
                    rsId:'mchtSettleDetail',
                    caption: settleLang._('MchtSettleDetail.txt'),
                    filters: [
                        {
                            caption: '精准搜索',
                            defaultRenderGrid: false,
                            canSearchAll: true,
                            canClearSearch: true,
                            components: [
                                {
                                    type: 'date',
                                    ignoreFormReset: true,
                                    defaultValue: moment(),
                                    label: '清算日期',
                                    name: 'settleDate'
                                }, {
                                    label: '商户名称',
                                    name: 'mchtName'
                                }, {
                                    label: '商户编号',
                                    name: 'mchtNo',
                                    inputmask: {
                                        integer: true
                                    },options: {
                                        sopt: ['eq']
                                    }
                                }
                            ],
                            searchBtn: {
                                text: '搜索'
                            }
                        }
                    ],
                    stats:{
                        labelConfig:STAT_MAP,
                        items:[
                            {name: 'totalDebitAmt', type:'currency'},
                            {name: 'totalDebitNum', type:'count'},
                            {name: 'totalDebitPercent', type:'percent'},
                            {name: 'totalTxAmt', type:'currency'},
                            {name: 'totalSettleAmt', type:'currency'},     
                            {name: 'totalTxNum', type:'count'},
                            {name: 'totalCreditAmt', type:'currency'},     
                            {name: 'totalCreditNum', type:'count'},       
                            {name: 'totalCreditPercent', type:'percent'}           
                        ]
                    },
                    actionsCol: {
                        width: 130,
                        edit: false,
                        del : false,
                        canButtonRender: function (name, opts, rowData) {
                            // 0-大额拆分  1-不是大额拆分
                            var status = rowData.flag;
                            //status 等于 状态 0,就显示按钮
                            if(name === 'maxAmountList' && status != '0' ){
                                return false;
                            }
                        },
                        extraButtons: [
                            {
                                name: 'maxAmountList', caption:'大额拆分列表', title:'大额拆分', icon: '',
                                click: function(name, opts, rowData) {
                                    require(['app/oms/settle/mcht-settle-detail/list/list-maxAmount'], function(View){
                                        var maxAmountView = new View({id: rowData.id}).render();
                                        maxAmountView.showDialog(maxAmountView);
                                        maxAmountView.$el.on('reloadParentGrid',function(){
                                            me.grid.trigger('reloadGrid');
                                        });
                                    });
                                }
                            },
                            {
                                name: 'history', title: '出款历史记录', icon: 'icon-table',
                                click: function(name, opts, rowData){
                                    require(['app/oms/settle/common/settle-common'], function(View){
                                        var view = new View({id: rowData.id}).render();
                                        view.showDialog(view);
                                        view.$el.on('reloadParentGrid',function(){
                                            me.grid.trigger('reloadGrid');
                                        });
                                    });
                                }
                            }
                        ]
                    },
                    nav: {
                        actions: {
                            add: false
                        },

                        view: {
                            width: Opf.Config._('ui', 'mchtSettleDetail.grid.viewform.width'),
                            height: Opf.Config._('ui', 'mchtSettleDetail.grid.viewform.height')
                        },

                        search: {
                            customComponent: {
                                items: [{//放大镜面板里，外部filter组件
                                    type: 'singleOrRangeDate',
                                    label: '清算日期',
                                    limitRange: 'month',
                                    name: 'settleDate'
                                }]
                            },
                            // 点击重置按钮时，搜索条件保留以下值
                            resetReserveValue: [
                                {
                                    field: 'settleDate',
                                    op: 'eq',
                                    data: moment().format('YYYYMMDD')
                                }
                            ],
                            afterRedraw: function(){
                                $(this).find('select.opsel').prop('disabled',true);
                            },
                            onSearch: function(){
                                var postData = $(this).jqGrid('getGridParam', 'postData');
                                var filters = $.parseJSON(postData.filters) || {};
                                var rules = filters.rules;
                                if(_.filter(rules, function(rule){return rule.field == 'settleDate'}).length == 2){
                                    var days = getDateRange(rules);
                                    if(days > 0 && !_.find(rules, function(rule){return rule.field == 'mchtNo'})){
                                        Opf.alert('请输入商户编号！');
                                        return false;
                                    }
                                }
                            }
                        }
                        
                    },
                    quickSearch: {
                        placeholder: '-快速搜索-',
                        searchoptions: [{
                            id: 't0',
                            text:'T+0',
                            rules: [{field: 'discCycle', op: 'rlk', data: 'T0'}]
                        }, {
                            id: 't1',
                            text:'T+1',
                            rules: [{field: 'discCycle', op: 'rlk', data: 'TN'}]
                        }, {
                            id: 'all',
                            text:'全部',
                            rules: []
                        }
                    ]},
                    gid: me.getGid(),
                    url: url._('mcht.settle.detail'),
                    colNames: {
                        id           :  settleLang._('mcht.settle.detail.id'),  //唯一键值
                        settleDate   :  settleLang._('mcht.settle.detail.settle.date'),  //清算日期
                        nodeTime     :  settleLang._('mcht.settle.detail.timeNode'),
                        settleNum    :  settleLang._('mcht.settle.detail.settleNum'),
                        inDate       :  settleLang._('mcht.settle.detail.in.date'),  //入账日期
                        // txDate       :  settleLang._('mcht.settle.detail.tx.date'),  //交易日期
                        batchNo      :  settleLang._('mcht.settle.detail.batch.no'),  //批次号
                        traceNo      :  settleLang._('mcht.settle.detail.trace.no'),  //流水号
                        mchtNo       :  settleLang._('mcht.settle.detail.mcht.no'),  //商户编号
                        mchtName     :  settleLang._('mcht.settle.detail.mcht.name'),  //商户名称
                        txNum        :  settleLang._('mcht.settle.detail.tx.num'),  //交易笔数
                        txAmt        :  settleLang._('mcht.settle.detail.tx.amt'),  //本金
                        acctNo       : '清算卡号',
                        settleAmt    :  settleLang._('mcht.settle.detail.settle.amt'),  //清算金额
                        resultStatus :  settleLang._('mcht.settle.detail.result.flag'),  //结果标示
                        cupsNo:  '交易渠道',

                        // 还需要商户名称，商户编号，扩展员，签约机构号。签约机构名
                        expandName   :  settleLang._('mcht.settle.detail.expand.name'),  //拓展员
                        branchNo     :  settleLang._('mcht.settle.detail.branch.no'),  //签约机构号
                        branchName   :  settleLang._('mcht.settle.detail.branch.name'),  //签约机构名
                        // 

                        feeAmt       :  settleLang._('mcht.settle.detail.fee.amt'),  //手续费金额
                        freeAmt      :  settleLang._('mcht.settle.detail.free.amt'),  //手续费金额
                        otherFee     :  settleLang._('mcht.settle.detail.other.fee'),  //其他费用
                        repairAmt    :  settleLang._('mcht.settle.detail.repair.fee'),  //补帐金额
                        unrepairAmt  :  settleLang._('mcht.settle.detail.unrepair.fee'),  //补帐处理后继续清算金额
                        uperrAmt     :  settleLang._('mcht.settle.detail.uperr.amt'),  //上周期入账失败金额
                        resultDesc   :  settleLang._('mcht.settle.detail.result.desc'),  //清算处理描述
                        creditNum    :  settleLang._('mcht.settle.detail.credit.num'),  //贷记卡交易笔数
                        creditAmt    :  settleLang._('mcht.settle.detail.credit.amt'),  //贷记卡交易金额
                        creditPercent:  settleLang._('mcht.settle.detail.credit.percent'),  //贷记卡交易占比
                        createTime   :  settleLang._('mcht.settle.detail.rec.crt.ts'),  //记录创建时间
                        updateTime   :  settleLang._('mcht.settle.detail.rec.upd.ts'),  //记录修改时间
                       // flag         :  settleLang._('mcht.settle.detail.flag')  //大额拆分状态 0-大额拆分  1-不是大额拆分
                        payCupsNo    : settleLang._('mcht.settle.detail.pay.cups.no')//出款通道编码

                        
                    },
                    responsiveOptions: {
                        hidden: {
                            ss: ['id', 'inDate', 'txDate', 'batchNo', 'traceNo', 'resultStatus', 'mchtName', 'expandName', 'branchNo', 'branchName', 'txNum', 'txAmt', 'settleAmt', 'feeAmt', 'otherFee', 'repairAmt', 'unrepairAmt', 'uperrAmt', 'resultDesc', 'creditNum', 'creditAmt', 'creditPercent', 'createTime', 'updateTime'],
                            xs: ['id', 'inDate', 'txDate', 'batchNo', 'traceNo', 'mchtName', 'expandName', 'branchNo', 'branchName', 'txNum', 'txAmt', 'feeAmt', 'otherFee', 'repairAmt', 'unrepairAmt', 'uperrAmt', 'resultDesc', 'creditNum', 'creditAmt', 'creditPercent', 'createTime', 'updateTime'],
                            sm: ['id', 'inDate', 'txDate', 'batchNo', 'mchtName', 'expandName', 'branchNo', 'branchName', 'txNum', 'txAmt', 'feeAmt', 'otherFee', 'repairAmt', 'unrepairAmt', 'uperrAmt', 'resultDesc', 'creditNum', 'creditAmt', 'creditPercent', 'createTime', 'updateTime'],
                            md: ['id', 'inDate', 'txDate', 'mchtName', 'expandName', 'branchNo', 'branchName', 'txNum', 'txAmt', 'feeAmt', 'otherFee', 'repairAmt', 'unrepairAmt', 'uperrAmt', 'resultDesc', 'creditNum', 'creditAmt', 'creditPercent', 'createTime', 'updateTime'],
                            ld: ['id', 'txDate', 'expandName', 'branchNo', 'branchName', 'feeAmt', 'otherFee', 'repairAmt', 'unrepairAmt', 'uperrAmt', 'resultDesc', 'creditNum', 'creditAmt', 'creditPercent', 'createTime', 'updateTime']
                        }
                    },
                    colModel: [
                        {name: 'id',            index: 'id',            editable: true, sortable: false, hidden: true},  //唯一键值 
                        {name: 'settleDate',    index: 'settleDate',    editable: true, sortable: false, search: false,
                            searchoptions: {
                                dataInit : function (elem) {
                                    $(elem).datepicker({autoclose: true,format: 'yyyymmdd'});
                                },
                                sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge']
                            }
                        },  //清算日期 
                        {name: 'nodeTime',      index: 'nodeTime',      sortable: false},
                        {name: 'settleNum',     index: 'settleNum',     sortable: false},
                        {name: 'inDate',        index: 'inDate',        editable: true, sortable: false},  //入账日期 
                        // {name: 'txDate',        index: 'txDate',        editable: true},  //交易日期 
                        {name: 'batchNo',       index: 'batchNo',       editable: true, sortable: false, search: true,
                            searchoptions: {
                                sopt: ['eq']
                            }
                        },  //批次号 
                        {name: 'traceNo',       index: 'traceNo',       editable: true, sortable: false, search: true,
                            searchoptions: {
                                sopt: ['eq']
                            }
                        },  //流水号 

                        {name: 'mchtNo',        index: 'mchtNo',        editable: true, sortable: false, search: true,  _searchType:'string',searchoptions : {sopt : [ 'eq']}
                        },  //商户编号 
                        {name: 'mchtName',      index: 'mchtName',      editable: true, sortable: false, search: true,
                            searchoptions: {
                                sopt: ['eq']
                            }
                        },  //商户名称 
                        {name: 'txNum',         index: 'txNum',         editable: true, sortable: false},  //交易笔数
                        {name: 'acctNo',        index: 'acctNo',        search: true,   sortable: false,
                            searchoptions: {
                                sopt: ['eq']
                            }},//清算卡号
                        {name: 'txAmt',         index: 'txAmt',         editable: true, sortable: false},  //本金 
                        {name: 'settleAmt',     index: 'settleAmt',     editable: true, sortable: false},  //清算金额 
                        {name: 'resultStatus',  index: 'resultStatus',  editable: true, sortable: false, search: true, formatter: resultStatusFormatter,
                            stype: 'select',
                            searchoptions: {
                                value: RESULTSTATUS_MAP,
                                sopt: ['eq']
                            }
                        },  //结果标示
                        {name: 'cupsNo', index: 'cupsNo',search: false},
                        {name: 'expandName',    index: 'expandName',    editable: true, sortable: false, search: true,
                            searchoptions: {
                                sopt: ['eq']
                            }
                        },  //拓展员 
                        {name: 'branchNo',      index: 'branchNo',      editable: true, sortable: false, search: true,
                            searchoptions: {
                                sopt: ['eq']
                            }},  //签约机构号
                        {name: 'branchName',    index: 'branchName',    editable: true, sortable: false, search: true,
                            searchoptions: {
                                sopt: ['eq']
                            }
                        },  //签约机构名 


                        {name: 'feeAmt',        index: 'feeAmt',        editable: true, sortable: false},  //手续费金额 
                        {name: 'freeAmt',       index: 'freeAmt',       editable: true, sortable: false},  //优惠金额
                        {name: 'otherFee',      index: 'otherFee',      editable: true, sortable: false},  //其他费用 
                        {name: 'repairAmt',     index: 'repairAmt',     editable: true, sortable: false},  //补帐金额 
                        {name: 'unrepairAmt',   index: 'unrepairAmt',   editable: true, sortable: false},  //补帐处理后继续清算金额 
                        {name: 'uperrAmt',      index: 'uperrAmt',      editable: true, sortable: false},  //上周期入账失败金额 
                        {name: 'resultDesc',    index: 'resultDesc',    editable: true, sortable: false},  //清算处理描述 
                        {name: 'creditNum',     index: 'creditNum',     editable: true, sortable: false},  //贷记卡交易笔数 
                        {name: 'creditAmt',     index: 'creditAmt',     editable: true, sortable: false},  //贷记卡交易金额 
                        {name: 'creditPercent', index: 'creditPercent', editable: true, sortable: false, search: true,
                            _searchType:'num'
                        },  //贷记卡交易占比 
                        {name: 'createTime',    index: 'createTime',    editable: true, sortable: false},  //记录创建时间
                        {name: 'updateTime',    index: 'updateTime',    editable: true, sortable: false},  //记录修改时间
                        //{name: 'flag',          index: 'flag',          editable: true, sortable: false}  //大额拆分状态
                        {name: 'payCupsNo',    index: 'payCupsNo',    editable: true, sortable: false}  //出款通道编码

                    ],
                    loadComplete: function() {}

                }));
            }
        });
    });

    function getDateRange(rules){
        var dateRange =_.pluck(rules, 'data');
        var dateBegin = new Date(dateRange[0].substring(0,4)+'/'+dateRange[0].substring(4,6)+'/'+dateRange[0].substring(6,8));
        var dateEnd = new Date(dateRange[1].substring(0,4)+'/'+dateRange[1].substring(4,6)+'/'+dateRange[1].substring(6,8));
        var daysTime = dateEnd.getTime() - dateBegin.getTime();
        var days = parseInt(daysTime / (1000 * 60 * 60 * 24));
        return days;
    }

    function resultStatusFormatter(val) {
        return RESULTSTATUS_MAP[val] || '';
    }

    return App.SettleApp.MchtSettleDetail.List.View;

});