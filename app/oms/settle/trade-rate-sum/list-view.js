define([
    'tpl!app/oms/settle/trade-rate-sum/templates/tradeRateSum.tpl',
    'assets/scripts/fwk/component/RangeDatePicker',
    'app/oms/report/rank/org-select-view',
    'app/oms/report/common/common-grid-fn',
    'jquery.jqGrid'
], function (tpl, RangeDatePicker, OrgSelectView, CommonGrid) {
    var View = Marionette.ItemView.extend({
        template: tpl,
        tabId: 'menu.trade.rate.sum',
        className: 'report-panel',
        ui: {
            dateRangeTrigger: '.range-trigger',
            targetDropdown: '.target-dropdown',
            genReportBtn: '.btn-report-submit'
        },

        events: {
            'click .target-dropdown .dropdown-menu a': 'openOrgSelectView',
            'click .btn-report-submit': 'genReport'
        },
        
        initialize: function () {
            // 交易月份
            this.momentStart = moment().subtract('month',1);
            this.momentEnd = moment();
            this.tradeMonthStart = this.momentStart.format('YYYYMM');
            this.tradeMonthEnd = this.momentEnd.format('YYYYMM');
            // 统计范围
            this.orgTreeType = null; // rankBrh 机构  rankOpr 拓展员，这是弹窗选择机构时传后台的参数
            this.selectType = null; // org 机构 explore 拓展员 这是生成报表时传后台的参数
            this.selectId = null;
            // 选择统计范围的view
            this.orgSelectView = null;
        },
        
        onRender: function () {
            var me = this;
            me.renderDatePicker();
            me.enableGenReportBtn(false);
        },

        renderDatePicker: function () {
            var me = this;
            var rangeDate = new RangeDatePicker({
                trigger: me.ui.dateRangeTrigger,
                defaultValues: [me.momentStart, me.momentEnd],
                displayFormat: 'YYYY/MM',
                valueFormat: 'YYYYMM'
            }).on('submit', function (obj) {
                if(!_.isEmpty(obj)){
                    me.tradeMonthStart = obj.startDate;
                    me.tradeMonthEnd = obj.endDate;
                    me._onParamChange();
                }
            });
        },

        openOrgSelectView: function (e) {
            var me = this, title;
            var type = me.selectType = $(e.target).attr('value');

            if(type == 'org'){
                me.orgTreeType = 'rankBrh';
                title = '统计机构之间的业绩比较';
            }else{
                me.orgTreeType = 'rankOpr';
                title = '统计拓展员间的业绩比较';
            }

            me.orgSelectView && me.orgSelectView.destroy();

            me.orgSelectView = new OrgSelectView({
                type: me.orgTreeType,
                title: title
            });

            me.orgSelectView.on('select:target', function (orgInfoObj) {
                console.log('>>>>orgInfoObj: ', orgInfoObj);
                me.setTarget(orgInfoObj);
            });
        },

        setTarget: function (options) {
            var id = options.id;
            var targetDDText = options.simpleName || '';

            this.selectId = id;
            this.ui.targetDropdown.find('.text').text(targetDDText);
            this._onParamChange();
        },

        enableGenReportBtn: function (toBeEnable) {
            this.ui.genReportBtn.toggleClass('disabled', toBeEnable === false ? true : false);
        },

        _onParamChange: function () {
            this.enableGenReportBtn();
        },

        getReportParams: function () {
            var params = {};
            // 没有选择统计范围
            if(!this.selectId){
                Opf.alert('请选择统计范围');
                return;
            }

            var filters = {
                "groupOp":"AND",
                "rules":[
                    {"field":"tradeMonth","op":"ge","data": this.tradeMonthStart},
                    {"field":"tradeMonth","op":"le","data": this.tradeMonthEnd}
                ]
            };

            params.filters = JSON.stringify(filters);
            params.type = this.selectType;
            params.id = this.selectId;

            return params;
        },

        genReport: function () {
            var params = this.getReportParams();

            if(!params){ return; }
            
            if(!this.grid){
                this.grid = this.renderGrid(params);
            }else{
                this.grid.clearGridData(true);
                this.hideSomeCols();
                this.grid.jqGrid('setGridParam', {postData: params});
                this.grid.trigger("reloadGrid", [{page:1}]);
            }

            this.enableGenReportBtn(false);
        },

        hideSomeCols: function () {
            var isOrgGrid = this.selectType == 'org';

            this.toggleCol('brhName', isOrgGrid);
            this.toggleCol('expandName', !isOrgGrid);
            this.toggleCol('belongBrhName', !isOrgGrid);
        },

        toggleCol: function (colName, toggle) {
            var $grid = this.grid;
            toggle = toggle === void 0 ? true : toggle;
            if(toggle){
                $grid.jqGrid('showCol', colName);
            }else{
                $grid.jqGrid('hideCol', colName);
            }
        }, 

        renderGrid: function (params) {
            var me = this;
            var grid = this.grid = App.Factory.createJqGrid({
                rsId: 'tradeRateSum',
                actionsCol: {
                    edit : false,
                    del: false
                },
                nav: {
                    actions: {
                        add: false,
                        search: false
                    }
                },
                download: {
                    url: url._('trade.rate.sum.download'),
                    //必须返回对象
                    params: function () {
                        return me.getReportParams();
                    },
                    queueTask: {//不配置就不在任务队列里生成一项，通常都要配置
                        name: function () {
                            return '交易额扣率汇总';
                        }
                    }
                },
                postData: params || '',
                gid: 'trade-rate-sum-grid',
                url: url._('trade.rate.sum'),
                colNames: {
                    id:            '',
                    tradeMonth:    '交易月份',
                    brhName:       '机构名称',
                    expandName:    '拓展员',
                    belongBrhName: '所属机构',
                    t0TradeNum:    'T+0交易笔数',  
                    t0TradeAmt:    'T+0交易金额',  
                    tnTradeNum:    'T+N交易笔数',  
                    tnTradeAmt:    'T+N交易金额',
                    sumFreeAmt:     '免扣交易金额',
                    rate:          '扣率'
                },
                colModel: [
                    { name: 'id', hidden: true },
                    { name: 'tradeMonth', _width: 80},                  //      '交易月份'
                    { name: 'brhName', _width: 100, hidden: params.type != 'org'},       //      '机构名称'
                    { name: 'expandName', _width: 100, hidden: params.type == 'org'},    //      '拓展员'
                    { name: 'belongBrhName', _width: 100, hidden: params.type == 'org'}, //      '所属机构'
                    { name: 't0TradeNum', _width: 110},    //      'T+0交易笔数'  
                    { name: 't0TradeAmt', _width: 110},    //      'T+0交易金额'  
                    { name: 'tnTradeNum', _width: 110},    //      'T+N交易笔数'  
                    { name: 'tnTradeAmt', _width: 110},    //      'T+N交易金额'
                    { name: 'sumFreeAmt', _width: 110},    //      '免扣交易金额'
                    { name: 'rate', _width: 50}           //      '扣率'
                ],

                onInitGrid: function () {
                    setTimeout(function(){
                        me.setGroupHeaders();
                    },100);
                },

                loadComplete: function() {
                    setTimeout(function(){
                        var params = me.getReportParams();
                        if(params && params.type == 'explore'){
                            me.grid.setGridParam().hideCol('sumFreeAmt');
                        } else {
                            me.grid.setGridParam().showCol('sumFreeAmt');
                        }
                        CommonGrid.blendHeadBody(me.grid);
                        $(window).trigger('resize');
                    },100);
                }
            });
            
            return grid;
        },

        setGroupHeaders: function() {
            this.grid.jqGrid('setGroupHeaders', {
                useColSpanStyle : true, // 没有表头的列是否与表头列位置的空单元格合并
                groupHeaders : [{
                    startColumnName : 't0TradeNum', // 对应colModel中的name
                    numberOfColumns : 2, // 跨越的列数
                    titleText : 'T+0'
                },{
                    startColumnName : 'tnTradeNum', // 对应colModel中的name
                    numberOfColumns : 2, // 跨越的列数
                    titleText : 'T+N'
                }]
            });
        }
    });
    
    App.on('trade:rate:sum', function () {
        App.show(new View());
    });
    
    return View;
});