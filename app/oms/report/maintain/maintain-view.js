define([
    'App',
    'tpl!app/oms/report/maintain/templates/maintain.tpl',
    'assets/scripts/fwk/component/RangeDatePicker',
    'app/oms/report/common/common-filters',
    'app/oms/report/common/common-grid-fn',
    'i18n!app/oms/common/nls/report',
    'moment.override',
    'jquery.jqGrid',
    'app/oms/mcht/mcht-sys-app'
], function(App, tpl, RangeDatePicker, Filters, CommonGrid, reportLang) {
    
    var conditions = ['gt', 'eq', 'lt'];
    var CONDITIONS_MAP = {
        'gt': '大于',
        'eq': '等于',
        'lt': '小于'
    };

    var FILTERS_ITEMS = [
        { label: "累计交易笔数", name: "tradeSum", oprs: conditions}, 
        { label: "累计交易金额", name: "tradeAmt", oprs: conditions, mask: 'decimal'}
    ];

    var view = Marionette.ItemView.extend({
        tabId: 'menu.report.maintain',
        className: 'report-maintain report-panel',
        template: tpl,

        events: {
            //生成报表
            'click .btn-report-submit': 'genReport',
            //筛选条件中大于，小于，等于的切换
            'click .filters .dropdown-menu a': '_onParamChange'
        },

        ui: {
            dateTrigger: '.range-trigger',
            filters: '.filters',
            genReportBtn: '.btn-report-submit'
        },

        initialize: function () {
            this.momentStart = moment().subtract('day', 6);
            this.momentEnd = moment().subtract('day', 1);
            this.startDate = this.momentStart.format('YYYYMMDD');
            this.endDate = this.momentEnd.format('YYYYMMDD');
        },

        onRender: function () {
            this.renderDatePicker();
            this.renderFilters();
        },

        renderFilters: function () {
            var me = this;
            var ui = this.ui;

            this.filters = new Filters({
                renderTo: this.ui.filters,
                items: FILTERS_ITEMS
            });
            this.filters.on('effect:input', function () {
                me._onParamChange();
            });
        },



        renderDatePicker: function () {
            var me = this;
            me.datePicker = new RangeDatePicker({
                trigger: me.ui.dateTrigger,
                limitDate: moment().subtract('day', 1),
                defaultValues: [me.momentStart, me.momentEnd]
            });
            me.datePicker.on('submit', function(obj){
                me.startDate = obj.startDate;
                me.endDate = obj.endDate;
                me._onParamChange();
            });
        },

        getReportParams: function () {
            var ui = this.ui;
            //TODO 测一下filter传过去null会不会出事
            var ret = {};

            //统计时间
            if(!this.startDate || !this.endDate) {
                Opf.alert('请选择统计时间！');
                return null;////////////////////////////////////////////
            }
            ret.startDate = this.startDate;
            ret.endDate = this.endDate;

            //filter参数
            var rules = this.filters.getValue().rules;
            // postparam数据进行传递的时候，只能进行覆盖，当不存在的时候，以前的数据会保留。当数据为null的时候，参数不回家在上面
            ret.filters = null; 
            if (rules.length) {
                if(!this.checkFilterValidate(rules)){
                    return null;
                }

                ret.filters = JSON.stringify({
                    groupOp: 'AND',
                    rules: rules
                });
            }else{
                Opf.alert('至少填写“累计交易笔数”或“累计交易金额”中的一项');
                return null;
            }

            return ret;
        },

        checkFilterValidate: function (rules) {
            var minusAlert, ltZeroAlert, validate = true;
            var match = /^\-\d*$/;
            _.each(rules, function(item){
                if(parseInt(item.data) == 0 && item.op == 'lt'){
                    ltZeroAlert = true;
                }
                if(match.test(item.data) || parseInt(item.data) < 0){
                    minusAlert = true;
                }
            });
            if(minusAlert){
                Opf.alert('不能输入负数！');
                validate = false;
            }
            if(ltZeroAlert){
                Opf.alert('输入的值不能小于0！');
                validate = false;
            }

            return validate;
        },

        genReport: function(e) {
            var me = this;
            var postData = this.getReportParams();
            console.log('获取到报表参数', postData);

            if(!postData) {return;}
            //生成报表后，让 生成 按钮不可用
            me.enableGenReportBtn(false);

            setTimeout(function(){
                if(!me.grid){
                    me.renderSummaryGrid();
                    me.renderMchtGrid();
                    me.grid = true;
                }
                reloadGrid(me.summaryGrid, {
                    title: '汇总情况',
                    postData: postData
                });
                reloadGrid(me.mchtGrid, {
                    title: me.getMchtGridTitle(),
                    postData: postData
                });
                
            },10);
        },

        enableGenReportBtn: function (toBeEnable) {
            this.ui.genReportBtn.toggleClass('disabled', toBeEnable === false ? true : false);
        },

        _onParamChange: function () {
            this.enableGenReportBtn();
        },

        getMchtGridTitle: function () {
            //拼接表头名称字段
            var me = this;
            var rules = me.filters.getValue().rules || [];

            var tradeSumObj = _.findWhere(rules, {field: 'tradeSum'}) || '',
                tradeSumSopt = tradeSumObj ? CONDITIONS_MAP[tradeSumObj.op] : '',
                tradeSum = tradeSumObj ? (tradeSumObj.data + '笔') : '';

            var tradeAmtObj = _.findWhere(rules, {field: 'tradeAmt'}) || '',
                tradeAmtSopt = tradeAmtObj ? CONDITIONS_MAP[tradeAmtObj.op] : '',
                tradeAmt = tradeAmtObj ? (tradeAmtObj.data + '元') : '';

            var titleText = [
                '<span>',
                    '['+ formateDateRangeText(me.startDate, me.endDate) + ']',
                '</span>',
                '<span>',
                    '累计交易'+ (tradeSumSopt || tradeAmtSopt) + (tradeSum || tradeAmt) + '的商户',
                '</span>'
            ].join('');
            return titleText;
        },

        renderSummaryGrid: function () {
            var me = this;
            me.summaryGrid = App.Factory.createJqGrid({
                datatype: 'local',
                rsId: 'summary',
                title: '汇总情况',
                download: {
                    url: url._('report.maintain.summary.download'),
                    //必须返回对象
                    params: function () {
                        return me.getReportParams();
                    },
                    queueTask: {//不配置就不在任务队列里生成一项，通常都要配置
                        name: function () {
                            return '汇总情况';
                        }
                    }
                },
                maxWidth: 1060,
                actionsCol: {
                    edit: false,
                    del: false
                },
                nav: {
                    actions: {
                        add: false,
                        search: false,
                        refresh: false
                    },
                    view: {
                        beforeShowForm: function (form) {
                            var $form = $(form);
                            $form.find('.CaptionTD').attr('width', '40%');
                        }
                    }
                },
                gid: 'summary-grid',
                url: url._('report.maintain.summary'),
                colNames: {
                    id: '',
                    mchtSource: reportLang._('report.mcht.source'),//商户来源
                    contName: '拓展员',//拓展员
                    contPhone: reportLang._('report.cont.phone'),//联系电话
                    mchtCount: reportLang._('report.mcht.count'),//符合条件的商户数
                    mchtRatio: reportLang._('report.mcht.ratio')//符合条件的商户比例
                },

                responsiveOptions: {
                    hidden: {
                        ss: ['contName','contPhone','mchtRatio'],
                        xs: ['contName','contPhone','mchtRatio'],
                        sm: ['contPhone'],
                        md: [],
                        ld: []
                    }
                },

                colModel: [
                    {name: 'id', index: 'id', hidden: true},
                    {name: 'mchtSource', index: 'mchtSource'},//商户来源
                    {name: 'contName', index: 'contName'},//拓展员
                    {name: 'contPhone', index: 'contPhone'},//联系电话
                    {name: 'mchtCount', index: 'mchtCount'},//符合条件的商户数
                    {name: 'mchtRatio', index: 'mchtRatio'}//符合条件的商户比例
                ],

                onInitGrid: function () {

                },
                
                loadComplete: function() {

                }
            });
        },

        attachEvents: function () {
            $('#mcht-grid-table').find('[data-mchtId]').each(function(){
                $(this).click(function(){
                    var mchtId = $(this).attr('data-mchtId');
                    App.trigger("mcht:show", mchtId);
                });
            });
        },

        renderMchtGrid: function () {
            var me = this;
            me.mchtGrid = App.Factory.createJqGrid({
                datatype: 'local',
                rsId: 'mcht',
                caption: 'abc',
                title: me.getMchtGridTitle().replace(/<(\/)?span>/g,''),
                download: {
                    url: url._('report.maintain.mcht.details.download'),
                    //必须返回对象
                    params: function () {
                        return me.getReportParams();
                    },
                    queueTask: {//不配置就不在任务队列里生成一项，通常都要配置
                        name: function () {
                            return me.getMchtGridTitle().replace(/<(\/)?span>/g,'');
                        }
                    }
                },
                actionsCol: {
                    edit: false,
                    del: false
                },
                nav: {
                    actions: {
                        add: false,
                        view: false,
                        search: false,
                        refresh: false
                    }
                },
                gid: 'mcht-grid',
                url: url._('report.maintain.mcht.details'),
                colNames: {
                    id: '',
                    mchtNo: reportLang._('report.mcht.no'),//商户编号
                    mchtName: reportLang._('report.mcht.name'),//商户名称
                    belongBrhName: reportLang._('report.brh.name'),//所属机构
                    oneLevelProxyName: reportLang._('report.one.agent'),//所属一级代理商
                    disc: reportLang._('report.disc'),//费率
                    tradeSum: reportLang._('report.trade.sum'),//交易笔数
                    tradeAmt: reportLang._('report.amt'),//交易金额
                    contName: reportLang._('report.cont.name'),//联系人
                    contPhone: reportLang._('report.cont.phone'),//联系电话
                    explorer: reportLang._('report.explorer'),//拓展员
                    inlineTime: reportLang._('report.inline.time'),//入网时间
                    lastTradeTime: reportLang._('report.last.trade.time')//上次交易时间
                },

                responsiveOptions: {
                    hidden: {
                        ss: ['mchtNo','disc','tradeSum','contName','contPhone','explorer','inlineTime','lastTradeTime'],
                        xs: ['mchtNo','disc','tradeSum','contName','contPhone','explorer','inlineTime','lastTradeTime'],
                        sm: ['mchtNo','disc','tradeSum','contName','inlineTime','lastTradeTime'],
                        md: ['mchtNo','disc','inlineTime','lastTradeTime'],
                        ld: []
                    }
                },

                colModel: [
                    {name: 'id', index: 'id', hidden: true},
                    {name: 'mchtNo', index: 'mchtNo'},//商户编号
                    {name: 'mchtName', index: 'mchtName'},//商户名称
                    {name: 'belongBrhName', index: 'belongBrhName'},//所属机构
                    {name: 'oneLevelProxyName', index: 'oneAgent'},//所属一级代理商
                    {name: 'disc', index: 'disc'},//费率
                    {name: 'tradeSum', index: 'tradeSum'},//交易笔数
                    {name: 'tradeAmt', index: 'tradeAmt'},//交易金额
                    {name: 'contName', index: 'contName'},//联系人
                    {name: 'contPhone', index: 'contPhone'},//联系电话
                    {name: 'explorer', index: 'explorer'},//拓展员
                    {name: 'inlineTime', index: 'inlineTime', formatter: inlineTimeFormatter},//入网时间
                    {name: 'lastTradeTime', index: 'lastTradeTime', width: 200, formatter: lastTradeTimeFormatter}//上次交易时间
                ],

                onInitGrid: function () {

                },
                
                loadComplete: function() {
                    setTimeout(function(){
                        $(window).trigger('resize');
                        me.attachEvents();
                    },100);
                }
            });
        }

    });

    function formateDateRangeText (start, end) {
        if(start === end) {
            return Opf.String.replaceYMD(start, 'YYYY/MM/DD');
        }else {
            return Opf.String.replaceYMD(start, 'YYYY/MM/DD') + ' ~ ' +
                    Opf.String.replaceYMD(end, 'YYYY/MM/DD');
        }
    }

    function reloadGrid (grid, options) {
        grid.clearGridData(true);
        grid.jqGrid('setGridParam', {
            title: options.title,
            postData: options.postData, 
            datatype:'json'
        });
        grid.trigger("reloadGrid", [{page:1}]);
    }

    function mchtNameFormatter (cellvalue, options, rowObject){
        return '<a style="cursor:pointer" data-mchtId='+ rowObject.mchtId + '>'+ cellvalue +'</a>';
    }
    function inlineTimeFormatter (cellvalue, options, rowObject){
        if(cellvalue){
            return moment(cellvalue, 'YYYYMMDD').formatCnYMD();
        }else{
            return '';
        }
    }
    function lastTradeTimeFormatter (cellvalue, options, rowObject){
        if(cellvalue){
            return moment(cellvalue, 'YYYYMMDD').formatCnYMD();
        }else{
            return '';
        }
    }


    return view;

});
