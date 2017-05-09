define(['App',
    'tpl!app/oms/settle/channel-txn/list/templates/channel-txn.tpl',
    'i18n!app/oms/common/nls/settle',
    'jquery.jqGrid',
    'jquery.validate',
    'bootstrap-datepicker',
    'moment.origin',
    'select2',
    'common-ui'
], function(App, ChannelTxnTpl, settleLang) {

    var RECVFLAG_MAP = {
        "0" : settleLang._("channel-txn.recvFlag.0"),
        "1" : settleLang._("channel-txn.recvFlag.1"),
        "2" : settleLang._("channel-txn.recvFlag.2"),
        "3" : settleLang._("channel-txn.recvFlag.3")
    },
    STAT_MAP = {
        "txAmt":"交易金额",
        "cupFee":"渠道手续费",
        "txCnt":"笔数"
    };
    App.module('SettleApp.ChannelTxnApp.List.View', function(View, App, Backbone, Marionette, $, _) {

        View.ChannelTxn = Marionette.ItemView.extend({
            tabId: 'menu.channel.txn',
            template: ChannelTxnTpl,
            events: {},
            onRender: function() {
                var me = this;
                _.defer(function(){
                    me.renderGrid();
                });
            },
            initialize: function () {
                this.queryFilters = null;
            },
            renderGrid: function() {
                var me = this;
                var grid = this.grid = App.Factory.createJqGrid({
                    datatype: 'local',
                    rsId:'channelTxn',
                    caption: settleLang._('channelTxn.txt'),
                    filters: [
                        {
                            caption: '条件过滤',
                            defaultRenderGrid: false,
                            canSearchAll: true,
                            canClearSearch: true,
                            components: [
                                {
                                    label: settleLang._('channel.txn.stlm.date'),
                                    name: 'stlmDate',
                                    ignoreFormReset: true,
                                    defaultValue: [moment().subtract('day',1),moment()],
                                    limitRange: 'month',
                                    type: 'rangeDate'
                                },{
                                    label: settleLang._('channel.txn.tx.date'),
                                    name: 'txDate',
                                    type: 'date',
                                    options: {
                                        sopt: ['eq']
                                    }
                                },{
                                    label: settleLang._('channel.txn.result.flag'),
                                    name: 'resultFlag',
                                    type: 'select',
                                    options: {
                                        sopt: ['eq'],
                                        value: RECVFLAG_MAP
                                    }
                                },{
                                    label: settleLang._('channel.txn.cup.name'),
                                    name: 'cupName',
                                    options: {
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
                            {name: 'txAmt', type:'currency'},
                            {name: 'cupFee', type:'currency'},     
                            {name: 'txCnt', type:'count'}         
                        ]
                    },
                    download: {
                        url: url._('channel.txn.download'),
                        //必须返回对象
                        params: function () {
                            var postData = me.grid.jqGrid('getGridParam', 'postData');
                            return {filters: postData.filters};
                        },
                        queueTask: {//不配置就不在任务队列里生成一项，通常都要配置
                            name: function () {
                                return '渠道流水信息';
                            }
                        }
                    },
                    actionsCol: {
                        edit: false,
                        del : false
                    },
                    nav: {
                        actions: {
                            add: false
                        },
                        view: {
                        },
                        search: {
                            customComponent: {
                                items: [{//放大镜面板里，外部filter组件
                                    type: 'singleOrRangeDate',
                                    label: '清算日期',
                                    limitRange: 'month',
                                    name: 'stlmDate'
                                }]
                            },
                            // 点击重置按钮时，搜索条件保留以下值
                            resetReserveValue: [
                                {
                                    field: 'stlmDate',
                                    op: 'eq',
                                    data: moment().format('YYYYMMDD')
                                }
                            ],
                            width: 450,
                            afterRedraw: function (){
                                return CommonUI.searchFormBySelect2($(this), 'cupsNo');
                            },
                            onSearch: function() {
                                var $grid = $(this), postData = $grid.jqGrid('getGridParam', 'postData');
                                var gid = $grid.jqGrid('getGridParam', 'gid');
                                var tableId = $('#fbox_'+gid+'-table');

                                return me.queryFilters = CommonUI.searchFilterBySelect2(tableId, postData, 'cupsNo');
                            }
                        }

                    },
                    gid: 'channelTxn',
                    url: url._('channel.txn'),
                    colNames: {
                        id               : 'id',
                        stlmDate         : settleLang._('channel.txn.stlm.date'),
                        txDate           : settleLang._('channel.txn.tx.date'),
                        txTime           : settleLang._('channel.txn.tx.time'),
                        traceNo          : settleLang._('channel.txn.trace.no'),
                        resultFlag      : settleLang._('channel.txn.result.flag'),
                        cupName          : settleLang._('channel.txn.cup.name'),
                        cupKey           : settleLang._('channel.txn.cup.key'),
                        cupsNo           : settleLang._('channel.txn.cups.no'),
                        termNo           : settleLang._('channel.txn.term.no'),
                        sysRefNo         : settleLang._('channel.txn.sys.ref.no'),
                        acNo             : settleLang._('channel.txn.ac.no'),
                        acBankNo         : settleLang._('channel.txn.ac.bank.no'),
                        bankName         : settleLang._('channel.txn.bank.name'),
                        txAmt            : settleLang._('channel.txn.tx.amt'),
                        cupFee           : settleLang._('channel.txn.cup.fee'),
                        txCode           : settleLang._('channel.txn.tx.code'),
                        brf              : settleLang._('channel.txn.brf'),
                        fill             : settleLang._('channel.txn.fill'),
                        recCrtTs         : settleLang._('channel.txn.rec.crt.ts'),
                        recUpdTs         : settleLang._('channel.txn.rec.upd.ts')
                    },

                    responsiveOptions: {
                        hidden: {
                            ss: ['id', 'txDate', 'txTime', 'traceNo', 'bankName', 'txAmt', 'cupFee', 'txCode', 'cupKey', 'result_flag', 'cupsNo', 'termNo', 'brf', 'fill', 'recCrtTs', 'recUpdTs', 'acNo', 'cupName'],
                            xs: ['id', 'txDate', 'txTime', 'traceNo', 'bankName', 'txAmt', 'cupFee', 'txCode', 'cupKey', 'result_flag', 'cupsNo', 'termNo', 'brf', 'fill', 'recCrtTs', 'recUpdTs'],
                            sm: ['id', 'txDate', 'txTime', 'traceNo', 'bankName', 'cupFee', 'txCode', 'cupKey', 'result_flag', 'cupsNo', 'termNo', 'brf', 'fill', 'recCrtTs', 'recUpdTs'],
                            md: ['id', 'txDate', 'txTime', 'traceNo', 'bankName', 'cupFee', 'txCode', 'cupKey', 'cupsNo', 'termNo', 'brf', 'fill', 'recCrtTs', 'recUpdTs'],
                            ld: ['id', 'cupKey', 'cupsNo', 'termNo', 'brf', 'fill', 'recCrtTs', 'recUpdTs']
                        }
                    },

                    colModel: [
                        {name: 'id',             index: 'id',             editable: true, hidden:true},
                        {name: 'stlmDate',       index: 'stlmDate',       search:false},  // model
                        {name: 'txDate',         index: 'txDate',         search:true,
                        searchoptions: {
                            dataInit : function (elem) {
                                $(elem).datepicker({autoclose: true,format: 'yyyymmdd'});
                            },
                            sopt: ['eq']
                        },
                         formatter: txDateFormatter},
                        {name: 'txTime',         index: 'txTime',         editable: true, hidden: true},  // 交易日期
                        {name: 'traceNo',        index: 'traceNo',        search:true,    editable: true,searchoptions: {sopt: ['eq']}},  // 平台流水
                        {name: 'resultFlag',     index: 'resultFlag',     search:true, stype: 'select', searchoptions: {sopt: ['eq', 'ne'], value: RECVFLAG_MAP}, editable: true, formatter: recvFlagFormatter},
                        {name: 'cupName',        index: 'cupName',        editable: true},  // 渠道名称
                        {name: 'cupKey',         index: 'cupKey',         viewable: false,  editable: true},
                        {name: 'cupsNo',         index: 'cupsNo',         search: true, _searchType: 'string', editable: true, hidden:true},
                        {name: 'termNo',         index: 'termNo',         editable: true},
                        {name: 'sysRefNo',       index: 'sysRefNo',       search:true,   editable: true, searchoptions: {sopt: ['eq']}}, //系统检索号
                        {name: 'acNo',           index: 'acNo',           search:true,      editable: true},  //交易卡号
                        {name: 'acBankNo',       index: 'acBankNo',       editable: true, hidden:true},
                        {name: 'bankName',       index: 'bankName',       editable: true},
                        {name: 'txAmt',          index: 'txAmt',          editable: true},
                        {name: 'cupFee',         index: 'cupFee',         editable: true},
                        {name: 'txCode',         index: 'txCode',         editable: true},
                        {name: 'brf',            index: 'brf',            editable: true},
                        {name: 'fill',           index: 'fill',           editable: true},
                        {name: 'recCrtTs',       index: 'recCrtTs',       editable: true},
                        {name: 'recUpdTs',       index: 'recUpdTs',       editable: true}
                    ]
                });              
                
            }

        });

    });

    function txDateFormatter(val, options, rowData){
        var txTime = rowData.txTime == null ? '' : rowData.txTime.replace(/(\d{2})(\d{2})/g,'$1:$2:');
        //return txTime;
        return (val || '') +' '+ (txTime || '');
    }

    function recvFlagFormatter(val){
        return RECVFLAG_MAP[val]||"";
    }

    function getTodaySearchParam () {
        return JSON.stringify({
            groupOp:'AND',
            rules:[{
                field: 'stlmDate',
                op: 'eq',
                data: moment().format('YYYYMMDD') + ''
            }]
        });

    }

    return App.SettleApp.ChannelTxnApp.List.View;

});