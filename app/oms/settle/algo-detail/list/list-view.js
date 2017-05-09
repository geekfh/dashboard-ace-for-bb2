/**
 * @created 2014-5-10 
 */

define(['App',
    'tpl!app/oms/settle/algo-detail/list/templates/table-ct.tpl',
    'i18n!app/oms/common/nls/settle',
    'app/oms/report/component/OrgTargetSelectDialog',
    'assets/scripts/fwk/component/common-search-date',
    'jquery.jqGrid',
    'jquery.validate',
    'bootstrap-datepicker',
    'moment.override'
], function(App, tableCtTpl, settleLang, OrgSelectView, SearchDate) {

    var ORG_SELECT_BTN = [
        '<button class="mcht-range-btn picker-btn">',
            '<span class="text">请选择机构</span>',
        '</button>'
    ].join('');

    var MCHTFLAG_MAP = {
        '0': settleLang._('algo.detail.mchtFlag0'),  //已清算
        '1': settleLang._('algo.detail.mchtFlag1')   //未清算
    },

    BRHFLAG_MAP = {
        '0': settleLang._('algo.detail.brhFlag0'),   //已清算
        '1': settleLang._('algo.detail.brhFlag1')    //未清算
    },

    ACTTPE_MAP = {
        '0' : settleLang._('algo.detail.acType.0'),  //对公
        '1' : settleLang._('algo.detail.acType.1')   //对私
    },

    STAT_MAP = {
        totalDebitAmt: "借记卡交易金额",
        totalDebitNum: "借记卡交易笔数",
        totalDebitPercent: "借记卡交易占比",
        totalCreditPercent: "贷记卡交易占比",
        totalCreditAmt: "贷记卡交易金额",
        totalCreditNum: "贷记卡交易笔数",
        "totalTxAmt":"交易金额",
        "totalFeeAmt":"手续费",
        "totalbrhFee":"机构服务费",
        "totalCupFee":"第三方手续费",
        "totalServFee":"服务费分润汇总金额",
        "totalOtherFee":"其它费用"
    },
    PAYMENT_METHOD_MAP = {
        "200": "全部",
        "201": "刷卡",
        "202": "微信",
        "203": "支付宝"
    },
    ACTYPENAME_MAP = {
        "": "无",
        "借记卡":"借记卡",
        "贷记卡":"贷记卡"
    };


    var DEFAULT_SEARCH_PARAM = {
        "groupOp": "AND",
        "rules": [{
            "field": "algoDate",
            "op": "eq",
            "data": moment().format('YYYYMMDD')
        }/*, {
            "field": "traceNo",
            "op": "lk",
            "data": ""
        }, {
            "field": "tradeMchtNo",
            "op": "lk",
            "data": ""
        }, {
            "field": "settleMchtName",
            "op": "lk",
            "data": ""
        }, {
            "field": "settleMchtNO",
            "op": "lk",
            "data": ""
        }, {
            "field": "settleMchtName",
            "op": "lk",
            "data": ""
        }, {
            "field": "brno",
            "op": "eq",
            "data": ""
        }, {
            "field": "brName",
            "op": "lk",
            "data": ""
        }, {
            "field": "settleBrhCode",
            "op": "lk",
            "data": ""
        }, {
            "field": "settleBrhName",
            "op": "lk",
            "data": ""
        }, {
            "field": "expandName",
            "op": "lk",
            "data": ""
        }*/]
    };

    App.module('SettleApp.AlgoDetail.List.View', function(View, App, Backbone, Marionette, $, _) {

        View.AlgoDetails = Marionette.ItemView.extend({
            tabId: 'menu.algo.detail',
            template: tableCtTpl,

            events: {

            },

            beforeRenderGridView: function () {
                var me = this;

                this.$el.find('.set-grid-table').attr('id', me.getGid() + '-table');
                this.$el.find('.set-grid-pager').attr('id', me.getGid() + '-pager');
            },

            getGid: function () {
                return 'algo-detail-grid';
            },

            onRender: function() {
                var me = this;
                me.beforeRenderGridView();

                _.defer(function() {

                    me.renderGrid();

                    setTimeout(function () {
                        me.setupBrhCodeUI();
                    },100);

                });
            },

            gridOptions: function (defaultOptions) {
                return defaultOptions;
            },

            setupBrhCodeUI: function () {
                //  ruleType: 0-自定义,1-本机构全部,2-下级全部机构,3-本机构所有拓展员,4-仅查看自己的拓展
                var ruleType = Ctx.getUser().get('ruleType');
                var $brhCodeGroup = this.$el.find('.brhCode-form-group');

                if(ruleType == 3){
                    //当规则为3（本机构所有拓展员），所属机构的选项为当前机构，且不能编辑（业管后台会忽略 前端brhCode参数）
                    $brhCodeGroup.find('.mcht-range-btn').text('当前机构').prop('disabled', true);
                }else if(ruleType == 4){
                    //当规则为4（仅查看自己），不出现 “所属机构”（业管后台会忽略 前端brhCode参数）
                    $brhCodeGroup.hide();
                }
            },

            renderGrid: function() {
                var me = this;
                var txDateFilter = [moment().subtract('day',1),moment()];
                var algoDateFilter = moment(me.options.algoDate, 'YYYYMMDD');
                if(me.options.algoDate != undefined){
                    txDateFilter = [algoDateFilter.subtract('day',2),moment(me.options.algoDate, 'YYYYMMDD')];
                }
                var grid = View.grid = App.Factory.createJqGrid(me.gridOptions({
                    rsId:'algoDetail',
                    caption: settleLang._('algoDetail.txt'),
                    overflow: true,
                    //beforeRequest: function (filters) {
                    //    if(filters != null){
                    //        return this.p.postData.filters=JSON.stringify(filters);
                    //    }
                    //    else if(!this.p.postData.filters) {
                    //        return false;
                    //    }
                    //},
                    filters: [
                        /*{
                            caption: '精准搜索',
                            components: [
                                {
                                    type: 'date',
                                    label: '交易日期',
                                    ignoreFormReset: true,
                                    defaultValue: moment(),
                                    name: 'txDate'
                                },{
                                    label: '商户号',
                                    name: 'settleMchtNO',
                                    inputmask: {
                                        integer: true
                                    }
                                },{
                                    label: '交易商户名称',
                                    name: 'tradeMchtName'
                                }
                            ],
                            searchBtn: {
                                text: '搜索'
                            }
                        },*/{
                            caption: '条件过滤',
                            canClearSearch: true,
                            defaultRenderGrid: false,
                            isSearchRequired: 2,
                            //isSearchRequiredMsg: '还需输入至少一项查询条件',
                            components: [{
                                    type: 'date',
                                    defaultValue: me.options.algoDate == undefined ? '' : moment(me.options.algoDate, 'YYYYMMDD').format('YYYYMMDD'),
                                    label: '清分日期',
                                    name: 'algoDate'
                                },{
                                    type: 'rangeDate',
                                    limitRange: 'month',
                                    //ignoreFormReset: true,
                                    defaultValue: txDateFilter,
                                    label: '交易日期',
                                    name: 'txDate'
                                },{
                                    label: '清算商户号',
                                    name: 'settleMchtNO',
                                    inputmask: {
                                        integer: true
                                    },
                                    options:{
                                        sopt:['eq']
                                    }
                                },{
                                    label: '所属机构',
                                    name: 'brhCode',
                                    options: {
                                        sopt:['lk'],
                                        dataInit: function (elem) {
                                            var $input = $(elem);
                                            me.$orgSelectBtn = $(ORG_SELECT_BTN);
                                            $input.after(me.$orgSelectBtn).hide();

                                            $input.on('input.settleBrh', function(){
                                                !$(this).val() && me.$orgSelectBtn.find('.text').text('请选择机构');
                                            });

                                            me.$orgSelectBtn.on('click', function(){
                                                if(!me.orgSelectView) {
                                                    me.orgSelectView = new OrgSelectView({
                                                        title: '统计某个机构的所有下属机构',
                                                        orgTreeOptions: {
                                                            descLabel: '的下属机构',
                                                            getInitOrgDataAjaxOptions: {
                                                                data: null,
                                                                url: url._('pointpay.report.org.tree.brh.init')
                                                            }
                                                        }
                                                    });

                                                    me.orgSelectView.on('select:target', function (orgInfoObj) {
                                                        console.log(orgInfoObj);
                                                        var $btnLabel = me.$orgSelectBtn.find('.text');

                                                        $input.val(orgInfoObj.id).trigger('input');
                                                        $btnLabel.text(formatTargetName(orgInfoObj.name));
                                                    });
                                                }else{
                                                    me.orgSelectView.open();
                                                }
                                            });
                                        }
                                    }
                                },{
                                    label: '拓展员姓名',
                                    name: 'expandName'
                                },{
                                    label: '支付方式',
                                    name: 'paymentMethod',
                                    type: 'select',
                                    options: {
                                        value: PAYMENT_METHOD_MAP,
                                        sopt: ['eq']
                                    }
                                }
                            ],
                            searchBtn: {
                                text: '过滤',
                                onClickSubmit: function (postData) {
                                    var _filters = !_.isEmpty(postData.filters) ? $.parseJSON(postData.filters) : {};

                                    if(_filters.rules && _filters.rules.length){
                                        //条件过滤请求后台时需要对rules里面的字段 brhCode 进行处理；
                                        var brhCodeObj = _.findWhere(_filters.rules, {field: 'brhCode'});

                                        if(brhCodeObj){
                                            //将 brhCode字段加到与 filters 同级别上
                                            postData.brhCode = brhCodeObj.data;

                                            //将 brhCode字段从 filters 里面的 rules 去掉
                                            _filters.rules = _.filter(_filters.rules, function(item){
                                                return item.field !== 'brhCode';
                                            });

                                            postData.filters = JSON.stringify(_filters);

                                        }
                                        else{
                                            delete postData.brhCode;
                                    }
                                    }

                                    return postData;
                                }
                            }
                        }
                    ],
                    stats:{
                        labelConfig:STAT_MAP,
                        items:[
                            {name: 'totalDebitAmt', type:'currency'},
                            {name: 'totalDebitNum', type:'count'},
                            {name: 'totalDebitPercent', value: function(val){
                                return val;
                            }},
                            {name: 'totalCreditPercent', value: function(val){
                                return val;
                            }},
                            {name: 'totalCreditAmt', type:'currency'},
                            {name: 'totalCreditNum', type:'count'},
                            {name: 'totalTxAmt', type:'currency'},
                            {name: 'totalFeeAmt', type:'currency'},
                            {name: 'totalbrhFee', type:'currency'},
                            {name: 'totalCupFee', type:'currency'},
                            {name: 'totalServFee', type:'currency'},
                            {name: 'totalOtherFee', type:'currency'}
                        ]
                    },
                    actionsCol: {
                        edit: false,
                        del : false
                    },
                    download: {
                        url: url._('algo.detail.download'),
                        //必须返回对象
                        params: function () {
                            var postData = $(View.grid).jqGrid('getGridParam', 'postData');
                            return {filters: postData.filters};
                        },
                        queueTask: {//不配置就不在任务队列里生成一项，通常都要配置
                            name: function () {
                                return '清算明细信息';
                            }
                        }
                    },
                    nav: {
                        actions: {
                            add: false
                        },
                        search: {
                            customComponent: {
                                items: [
                                    {
                                        type: 'singleOrRangeDate',
                                        label: '交易日期',
                                        name: 'txDate',
                                        limitRange: 'month',
                                        defaultValue: false
                                    },
                                    {
                                        type: 'singleOrRangeDate',
                                        label: '清分日期',
                                        name: 'algoDate',
                                        limitRange: 'month',
                                        defaultValue: false
                                    }
                                ]
                            },
                            onReset: function () {
                                grid._resetFlag = true; //重置标志，方便customComponent里的过滤器的重置
                                return false;
                            },
                            // 以下实现了默认查询条件，查看demo http://www.trirand.com/blog/jqgrid/jqgrid.html ---> Search Templates
                            tmplNames: ["customDefaultSearch"],
                            //tmplFilters: [DEFAULT_SEARCH_PARAM],
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
                            afterRedraw: function(){
                                var me = this;
                                $(this).find('table.ui-widget-content').css('width', 400);
                                $(this).find('.operators').find('select').trigger('change');
                                $(this).find('select.opsel').prop('disabled',true);
                                addSearchSelect2($(this));

                                /*
                                * 设置10毫秒的延迟，保证filter的视图都加载进来了
                                * 以下代码是为了保证重置时，把customComponent里的条目值置空
                                * */
                                setTimeout(function(){
                                    if(grid._resetFlag){
                                        _.each($(me).find('.search-date .operators .selectopts'), function(selectItem){
                                            $(selectItem).find('option[value="range"]').removeAttr('selected');
                                            $(selectItem).trigger('change');
                                        });
                                        _.map($(me).find('.col-value input'), function(inputItem){
                                            $(inputItem).val('');
                                        });
                                        grid._resetFlag = false;
                                    }
                                }, 10, me);
                            },
                            onSearch: function(){
                                var $grid = $(this),
                                    postData = $grid.jqGrid('getGridParam', 'postData'),
                                    rules = JSON.parse($grid.jqGrid('getGridParam', 'postData').filters).rules;
                                if(!rules.length){
                                    Opf.alert('请至少输入 １ 项查询条件')
                                    return false;
                                }
                            }
                        }

                    },
                    gid: me.getGid(),
                    url: url._('algo.detail'),
                    //postData: {filters: JSON.stringify(me.options.algoDate)},
                    colNames: {
                        id:             settleLang._('id'), // id
                        algoDate:       settleLang._('algo.detail.algoDate'),  // 清分日期
                        txDate:         settleLang._('algo.detail.txDate'),  // 交易日期
                        txTime:         settleLang._('algo.detail.txTime'),  // 交易时间
                        traceNo:        settleLang._('algo.detail.traceNo'),  // 平台流水
                        orderNo:        settleLang._('algo.detail.orderNo'),  // 订单号
                        settleMchtNO:   settleLang._('algo.detail.settleMchtNO'),  // 清算商户号
                        settleMchtName: settleLang._('algo.detail.settleMchtName'),  // 清算商户名称
                        tradeMchtNo:    settleLang._('algo.detail.tradeMchtNo'),  // 交易商户编号
                        tradeMchtName:  settleLang._('algo.detail.tradeMchtName'),  // 交易商户名称
                        paymentMethod:  settleLang._('algo.detail.paymentMethod'),  // 支付方式
                        mchtBatchNo:    settleLang._('algo.detail.mchtBatchNo'),  // 商户清算批次号
                        mchtTraceNo:    settleLang._('algo.detail.mchtTraceNo'),  // 商户清算流水号
                        mchtFlag:       settleLang._('algo.detail.mchtFlag'),  // 商户清算标示    (1-未清算,0-已清算)
                        brhBatchNo:     settleLang._('algo.detail.brhBatchNo'),  // 机构清算批次号
                        brhTraceNo:     settleLang._('algo.detail.brhTraceNo'),  // 机构清算流水号
                        brhFlag:        settleLang._('algo.detail.brhFlag'),  // 机构清算标示 (1-未清算,0-已清算)
                        settleBrhCode:  settleLang._('algo.detail.settleBrhCode'),  // 清算机构号
                        settleBrhName:  settleLang._('algo.detail.settleBrhName'),  // 清算机构名称
                        txName:         settleLang._('algo.detail.txName'),  // 交易名称
                        ibox41:         settleLang._('algo.detail.ibox41'),  // 终端编号
                        acNo:           settleLang._('algo.detail.acNo'),  // 消费卡号
                        acType:         settleLang._('algo.detail.acType'),  // 账户类型
                        acBankNo:       settleLang._('algo.detail.acBankNo'),  // 账户开户行
                        txAmt:          settleLang._('algo.detail.txAmt'),  // 交易金额
                        //totalDebitAmt:   '借记卡交易额',
                        //totalDebitNum:   '借记卡交易笔数',
                        //totalDebitPercent:  '借记卡交易占比',
                        feeAmt:         settleLang._('algo.detail.feeAmt'),  // 手续费金额
                        baseAmt:        settleLang._('algo.detail.baseAmt'), // 基准手续费
                        cupFee:         settleLang._('algo.detail.cupFee'),  // 第三方手续费
                        servFee:         settleLang._('algo.detail.servFee'),  // 服务费分润
                        brhFee:         settleLang._('algo.detail.brhFee'),  // 机构服务费
                        otherFee:       settleLang._('algo.detail.txCode'),  // 其它费用
                        iboxNo:         settleLang._('algo.detail.iboxNo'),  // 盒子编号
                        discCycle:      settleLang._('algo.detail.discCycle'),  // 结算周期
                        recCreateTime:  settleLang._('algo.detail.recCreateTime'),  // 记录创建时间
                        recUpdTime:     settleLang._('algo.detail.recUpdTime'),  // 记录修改时间
                        brno:           settleLang._('algo.detail.brno'),  //签约机构号
                        brName:         settleLang._('algo.detail.brName'), //签约机构名
                        expandName:     settleLang._('algo.detail.expandName'), //拓展员
                        cupsNo:  '交易渠道',
                        acTypeName: '卡类型'
                    },
                    responsiveOptions: {
                        hidden: {
                            ss: ['id', 'orderNo', 'settleMchtNO', 'mchtBatchNo', 'mchtTraceNo', 'mchtFlag', 'brhBatchNo', 'brhTraceNo', 'brhFlag', 'settleBrhCode', 'settleBrhName', 'txName', 'ibox41', 'acNo', 'acType', 'acBankNo', 'txAmt', 'feeAmt', 'brhFee', 'iboxNo', 'discCycle', 'recCreateTime', 'recUpdTime', 'baseAmt'],
                            xs: ['id', 'orderNo', 'mchtBatchNo', 'mchtTraceNo', 'mchtFlag', 'brhBatchNo', 'brhTraceNo', 'brhFlag', 'settleBrhName', 'txName', 'ibox41', 'acNo', 'acType', 'acBankNo', 'txAmt', 'feeAmt', 'brhFee', 'iboxNo', 'discCycle', 'recCreateTime', 'recUpdTime', 'baseAmt'],
                            sm: ['id', 'mchtBatchNo', 'mchtTraceNo', 'mchtFlag', 'brhBatchNo', 'brhTraceNo', 'brhFlag', 'settleBrhName', 'txName', 'ibox41', 'acNo', 'acType', 'acBankNo', 'txAmt', 'feeAmt', 'brhFee', 'iboxNo', 'discCycle', 'recCreateTime', 'recUpdTime', 'baseAmt'],
                            md: ['id', 'mchtBatchNo', 'mchtTraceNo', 'mchtFlag', 'brhBatchNo', 'brhTraceNo', 'brhFlag', 'settleBrhName', 'txName', 'ibox41', 'acNo', 'acType', 'acBankNo', 'txAmt', 'feeAmt', 'brhFee', 'iboxNo', 'discCycle', 'recCreateTime', 'recUpdTime', 'baseAmt'],
                            ld: ['id', 'mchtBatchNo', 'mchtTraceNo', 'brhBatchNo', 'brhTraceNo', 'settleBrhName', 'txName', 'ibox41', 'acNo', 'acType', 'acBankNo', 'iboxNo', 'discCycle', 'recCreateTime', 'recUpdTime', 'baseAmt']
                        }
                    },
                    colModel: [
                        {name: 'id',             index: 'id',             editable: true, sortable: false},  // id
                        {name: 'algoDate',       index: 'algoDate',       editable: true, sortable: false, search: false,
                            formatter: algoDateFormatter,
                            searchoptions: {
                                dataInit : function (elem) {
                                    $(elem).datepicker({autoclose: true,format: 'yyyymmdd'});
                                },
                                sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge']
                            }
                        },  // 清分日期
                        {name: 'txDate',         index: 'txDate',         editable: true, sortable: false,  formatter: txDateFormatter, search: false, _searchType:'date', searchoptions: {
                                dataInit : function (elem) {
                                    $(elem).datepicker( {autoclose: true, format: "yyyymmdd"} );
                                }
                            }},  // 交易日期
                        {name: 'txTime',         index: 'txTime',         viewable: false, sortable: false, hidden: true},//交易时间
                        {name: 'traceNo',        index: 'traceNo',        editable: true, sortable: false, search: true, hidden: true,
                            _searchType:'string'
                        },  // 平台流水
                        {name: 'orderNo',        index: 'orderNo',        editable: true, sortable: false, search: true,
                            _searchType:'string'
                        },  // 订单号
                        {name: 'settleMchtNO',   index: 'settleMchtNO',   editable: true, sortable: false, search: true,
                            _searchType:'string',searchoptions : {sopt : [ 'eq']}
                        },  // 清算商户号
                        {name: 'mchtFlag',       index: 'mchtFlag',       editable: true, sortable: false, search: true, formatter: mchtFlagFormatter,
                            stype: 'select', hidden: true,
                            searchoptions: {
                                value: MCHTFLAG_MAP,
                                sopt: ['eq','ne']
                            }
                        },  // 商户清算标示
                        {name: 'settleMchtName', index: 'settleMchtName', editable: true, sortable: false, search: true,
                            _searchType:'string'
                        },  // 清算商户名称
                        {name: 'tradeMchtNo',    index: 'tradeMchtNo',    editable: true, sortable: false, search: true,
                            _searchType:'string'
                        },  // 交易商户编号
                        {name: 'tradeMchtName',  index: 'tradeMchtName',  editable: true, sortable: false, search: true,
                            _searchType:'string'
                        },  // 交易商户名称
                        {name: 'paymentMethod',  index: 'paymentMethod',  editable: true, sortable: false, search: true,
                            stype: 'select',
                            searchoptions: {
                                value: PAYMENT_METHOD_MAP,
                                sopt: ['eq']
                            }
                        },  // 支付方式
                        {name: 'mchtBatchNo',    index: 'mchtBatchNo',    editable: true, sortable: false, search: true,
                            _searchType:'string'
                        },  // 商户清算批次号
                        {name: 'mchtTraceNo',    index: 'mchtTraceNo',    editable: true, sortable: false, search: true,
                            _searchType:'string'
                        },  // 商户清算流水号
                        {name: 'brhBatchNo',     index: 'brhBatchNo',     editable: true, sortable: false, search: true,
                            _searchType:'string'
                        },  // 机构清算批次号
                        {name: 'brhTraceNo',     index: 'brhTraceNo',     editable: true, sortable: false, search: true,
                            _searchType:'string'
                        },  // 机构清算流水号
                        {name: 'settleBrhCode',  index: 'settleBrhCode',  editable: true, sortable: false, search: true, hidden: true,
                            _searchType:'string'
                        },  // 清算机构号
                        {name: 'brhFlag',        index: 'brhFlag',        editable: true, sortable: false, search: true, formatter: brhFlagFormatter,
                            stype: 'select', hidden: true,
                            searchoptions: {
                                value: BRHFLAG_MAP,
                                sopt: ['eq','ne']
                            }
                        },  // 机构清算标示
                        {name: 'settleBrhName',  index: 'settleBrhName',  editable: true, sortable: false, search: true,
                            _searchType:'string'
                        },  // 清算机构名称
                        {name: 'txName',         index: 'txName',         editable: true, sortable: false},  // 交易名称
                        {name: 'ibox41',         index: 'ibox41',         editable: true, sortable: false},  // 终端编号
                        {name: 'acNo',           index: 'acNo',           editable: true, sortable: false},  // 消费卡号
                        {name: 'acType',         index: 'acType',         editable: true, sortable: false, formatter: acTypeFormatter, viewable: false},  // 账户类型
                        {name: 'acBankNo',       index: 'acBankNo',       editable: true, sortable: false, viewable: false},  // 账户开户行
                        {name: 'txAmt',          index: 'txAmt',          editable: true, sortable: false},  // 交易金额
                        //{name: 'totalDebitAmt'},
                        //{name: 'totalDebitNum'},
                        //{name: 'totalDebitPercent'},
                        {name: 'feeAmt',         index: 'feeAmt',         editable: true, sortable: false},  // 手续费金额
                        {name: 'baseAmt',        index: 'baseAmt',        editable: true, sortable: false},   // 基准手续费
                        {name: 'cupFee',         index: 'cupFee',         editable: true, sortable: false},  // 第三方手续费
                        {name: 'servFee',         index: 'servFee',         editable: true, sortable: false},  // 服务费分润
                        {name: 'brhFee',         index: 'brhFee',         editable: true, sortable: false},  // 机构服务费
                        {name: 'otherFee',       index: 'otherFee',       editable: true, sortable: false},  // 其它费用
                        {name: 'iboxNo',         index: 'iboxNo',         editable: true, sortable: false},  // 盒子编号
                        {name: 'discCycle',      index: 'discCycle',      editable: true, sortable: false, search: true,
                            _searchType:'num'
                        },  // 结算周期
                        {name: 'recCreateTime',  index: 'recCreateTime',  editable: true, sortable: false},  // 记录创建时间
                        {name: 'recUpdTime',     index: 'recUpdTime',     editable: true, sortable: false},  // 记录修改时间


                        {name: 'brno',     index: 'brno',     editable: true, sortable: false, search: true, _searchType:'num', hidden: true},  // 签约机构号
                        {name: 'brName',     index: 'brName',     editable: true, sortable: false, search: true, _searchType:'string', hidden: true}, //签约机构名
                        {name: 'expandName',     index: 'expandName',     editable: true, sortable: false, search: true, _searchType:'string', hidden: true}, //拓展员
                        {name: 'cupsNo', index: 'cupsNo',search: true,hidden: true,
                            searchoptions: {
                                sopt: ['eq']
                            }
                        },
                        {name: 'acTypeName', search: true, stype: 'select', searchoptions: {sopt: ['eq'], value: ACTYPENAME_MAP}, formatter: function (val) {return ACTYPENAME_MAP[val] || '';}}
                    ]
                })); 
            },

            setGroupHeaders: function () {
                View.grid.jqGrid('setGroupHeaders', {
                    useColSpanStyle: true,
                    groupHeaders: [{
                        startColumnName: 'totalDebitAmt',
                        numberOfColumns: 3,
                        titleText: '<font style="color: #2A7CCE; margin-left: 105px;">借记卡</font>'
                    }]
                });
            }

        });

    });

    function addSearchSelect2 (form) {
        var $form = $(form);
        var $select = $form.find('.columns select');

        //找到所有应该放select2的input，重新加上select2；
        _.each($select, function(item){
            var value = $(item).find('option:checked').attr('value');
            var $dataSel;
            if(value == 'cupsNo'){
                $dataSel = $(item).closest('tr').find('.data .input-elm');
                buildcupsNoSelectUI($dataSel);
            }
        });

        //找到所有的搜索条件下拉框重新绑定事件
        $select.on('change.addSelect2',function(){
            var me = $(this);
            var value = me.find('option:checked').attr('value');
            var $dataSel;

            if (value === 'cupsNo') {
                $dataSel = me.closest('tr').find('.data .input-elm');
                buildcupsNoSelectUI($dataSel);
            }
        });

    }

    function buildcupsNoSelectUI ($el) {
        $el.parent().width(200);
        $el.css({'height':'100%'});
        $el.select2({
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
                return data.value + '_' + data.name;
            },
            formatSelection: function(data){
                return data.value + '_' + data.name;
            }
        });
        $el.closest('tr').data('cached.select2', $el.data('select2'));
    }

    function mchtFlagFormatter (val) {
        return MCHTFLAG_MAP[val] || '';
    }

    function brhFlagFormatter (val) {
        return BRHFLAG_MAP[val] || '';        
    }

    function algoDateFormatter (val, options, rowData) {
        return val ? moment(val, 'YYYYMMDD').format('YYYY/MM/DD') : '';
    }

    function txDateFormatter (val, options, rowData) {
        return val ? moment(val, 'YYYYMMDD').format('YYYY/MM/DD') : '';
    }

    function acTypeFormatter (val) {
        return ACTTPE_MAP[val] || '';
    }

    function formatTargetName (name) {
        return name.replace(/\<span.+/, '');
    }

    return App.SettleApp.AlgoDetail.List.View;

});










