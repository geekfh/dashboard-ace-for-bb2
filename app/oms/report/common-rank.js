/**
 * 注意：
 * 每次生成报表后按钮都会灰掉，当某个参数修改后才会高亮可用
 * 因此界面上参数变化后都要调用 _onParamChange
 */
//TODO
//生成报表按钮，当可用的时候才高亮，不可用则灰掉
//生成一次报表后，灰掉，当参数改变后高亮
define([
    'tpl!app/oms/report/rank/templates/rank-view.tpl',
    'tpl!assets/scripts/fwk/component/templates/switchable-dropdown.tpl',
    'assets/scripts/fwk/component/SwitchableDropdown',
    'assets/scripts/fwk/component/RangeDatePicker',
    'app/oms/report/rank/org-select-view',
    'app/oms/report/common/common-filters',
    'app/oms/report/common/common-grid-fn',
    'i18n!app/oms/common/nls/report',
    'bootstrap-datepicker',
    'jquery.jqGrid'
], function(tpl, switchableDropdownTplFn, SwitchableDropdown, RangeDatePicker, OrgSelectView, Filters, CommonGrid, reportLang) {

    var TARGET_TYPE = { ORG: 'org', EXPLORER: 'explore' };
    
    var conditions = ['gt', 'eq', 'lt'];

    var FILTERS_ITEMS = [
		{ label: "新增商户数", name: "addedMchtAmt", oprs   : conditions}, 
        { label: "商户总量", name: "totalMchtAmt", oprs   : conditions}, 
        { label: "成功交易金额", name: "totalSucTradeAmt", oprs   : conditions, mask: 'decimal'}
	];

    var ajaxDeferr = null; // ajax 的异步请求对象

    var RankView = Marionette.ItemView.extend({
        tabId: '',
        className: 'report-rank report-panel',
        template: tpl,

        ui: {
            orderDropdown: '.order-dropdown',
            //TODO这个assessment相关的命名太恶心，后续改了他
            
            assessmentDropdown: '.assessment-dropdown',//商户范围
            targetSelect: '.mcht-range-btn',
            dateTrigger: '.date-range-btn',
            dateApprovedTrigger: '.date-approved-trigger',
            //筛选条件容器
            filters : '.filters',
            descr: '.filter-wrap .descr',

            expandFilterTrigger: '.expand-trigger',
            collapseFilterTrigger: '.collapse-trigger',
            resetFilterTrigger: '.reset-trigger',

            genReportBtn: '.btn-report-submit'
        },

        events: {
            //选择考核对象类型
            'click .mcht-range-btn': 'openOrgSelectView',
            //选择考核业绩
            'changed.bs.dropdown .assessment-dropdown': '_onAssetmentChange',
            //选择排序菜单
            'changed.bs.dropdown .order-dropdown': '_onOrderChange',
            //点击展开过滤条件
            'click .filter-wrap a.toggle-trigger': 'toggleFiltersVisible',            
            //产生报表
            'click input.btn-report-submit' : 'genReport',
            //清空筛选条件
            'click .reset-trigger': 'onResetFilterClick',
            //筛选条件中大于，小于，等于的切换
            'click .filters .dropdown-menu a': '_onParamChange'
        },

        onClose: function () {
            this.datePicker.remove();
            this.approvedDatePicker.remove();
        },

        initialize: function (options) {
            //界面上的日期
            this.momentStart = moment().subtract('day', 28);
            this.momentEnd = moment().subtract('day', 1);
            this.startDate = this.momentStart.format('YYYYMMDD');
            this.endDate = this.momentEnd.format('YYYYMMDD');
            //界面上的进驻日期
            this.startApprovedDate = null;
            this.endApprovedDate = null;

            this.targetType = options.type;//'org'/'explorer'
            this.targetId = null;//如果是org类型则为机构ID
            this.orgLevel = null;//如果是org类型则为机构级别

            this.orgSelectView = null;//机构选择对话框
            // this.shouldHideColNames = getHideColNames();
            this.canRenderGrid = false;

            if (options.type == 'org') {
                this.orgTreeType = 'rankBrh';
                this.tabId = 'menu.org.rank';
                this.gid = 'rank-org-grid';
            } else {
                this.orgTreeType = 'rankOpr';
                this.tabId = 'menu.staff.rank';
                this.gid = 'rank-usr-grid';
            }

            this.gridOptions = null;
            this.extraList = options.extraList;
        },

        /**
         * [setTarget description]
         * @param {[type]} type  当type为explor的时候，后面参数只有id
         */
        setTarget: function (type, id, name, level) {
            var targetDDText = name;
            var oldTargetId = this.targetId;

            this.targetId = id;
            this.orgLevel = parseInt(level, 10) + 1 || '下';  //统计的是下级机构的比较
            this.ui.targetSelect.find('.text').text(targetDDText);

            if(oldTargetId !== this.targetId) {
                this._onTargetTypeChange();
            }
        },

        //初始考核范围
        deferredTarget: function() {
            var me = this;
            ajaxDeferr = Opf.ajax({
                url: url._('report.rank.child.brh.init'),
                success: function(data) {
                    //  ruleType 的值
                    // 0-自定义规则，
                    // 1-本机构全部
                    // 2-下级全部机构，
                    // 3-本机构所有拓展员，
                    // 4-仅查看自己拓展的

                    // 如果没有 data 那么表明是 仅查看自己拓展员，不去默认生成数据
                    // 如果 ruleType 为 0 或者 2 ，传 id = '' 给后台默认生成数据
                    // 如果 ruleType 为 1，本机构全部, 取最顶层根节点的 id 给后台默认生成数据
                    // 其他 不会默认生成
                    if (data) {
                        var ruleType = Ctx.getUser().get('ruleType');
                        if (ruleType == 0 || ruleType == 2) {
                            me.setTarget(TARGET_TYPE.ORG, '', '统计所有的下级机构', '');
                            me.canRenderGrid = true;
                        }
                    }
                }
            });
        },

        onResetFilterClick: function () {
            if(this.filters) {
                this.filters.reset();
            }
        },

        onRender: function () {
            var me = this;
            me.renderDatePicker();
            me.renderFilters();

            this.$el.find('.rank-grid-table').attr('id', me.gid + '-table');
            this.$el.find('.rank-grid-pager').attr('id', me.gid + '-pager');

            setTimeout(function(){
                //在对考核范围进行初始化的时候涉及到ajax请求，因而需要用deferr进行处理
                if(me.targetType == TARGET_TYPE.ORG){
                    me.deferredTarget();
                    ajaxDeferr && ajaxDeferr.done(function(){
                        me.canRenderGrid && me.genReport();
                    });
                }else{
                    var brhCode = Ctx.getUser().get('brhCode');
                    var brhLevel = Ctx.getUser().get('brhLevel');
                    me.setTarget(TARGET_TYPE.EXPLORER, '', '当前机构的拓展员业绩', brhLevel);
                    _.defer(function(){
                        me.genReport();
                    });
                }
            },20);

        },

        // 视图被移除时中止 ajax 请求并且将对象置为空;
        onDestroy: function () {
            ajaxDeferr && ajaxDeferr.abort();
            ajaxDeferr = null;
        },

        renderFilters: function () {
            var me = this;
            var ui = me.ui;

        	this.filters = new Filters({
                renderTo: this.ui.filters,
                items: FILTERS_ITEMS
            });

            this.filters.on('effect:input', function () {
                //一旦有效输入后，不能收起，只能重置后再收起
                //目的是：一旦收起，意味着筛选条件不凑效
                ui.resetFilterTrigger.show();
                ui.collapseFilterTrigger.hide();

                me._onParamChange();

            });

            this.filters.on('reset', function () {
                //参考'effect:input'事件
                ui.resetFilterTrigger.hide();
                ui.collapseFilterTrigger.show();

                me._onParamChange();
            });
        },

        toggleFiltersVisible: function(e){
        	var $target = $(e.target);
            var ui = this.ui;
            ui.filters.toggle();
            ui.descr.toggle();
            ui.expandFilterTrigger.toggle();
            ui.collapseFilterTrigger.toggle();
            //TODO 更新文字
        },

        serializeData: function () {

            // _.each(this.shouldHideColNames, function(item) {
            //     var hideSelect = _.findWhere(ASSESSMENT_DD_DATA.menu, {value: item});
            //     if(hideSelect){
            //         hideSelect.hidden = true;
            //     }
            // });

            return {
                switchableDropdownTplFn: switchableDropdownTplFn,//提供渲染dropdown的模板方法
                assessmentTplData: {data: ASSESSMENT_DD_DATA},//考核业绩下拉列表模板数据
                orderTplData: {data: ORDER_DD_DATA}//排序下拉模板数据
            };
        },

        enableGenReportBtn: function (toBeEnable) {
            this.ui.genReportBtn.toggleClass('disabled', toBeEnable === false ? true : false);
        },

        _onParamChange: function (e) {
            e && e.preventDefault();
            this.enableGenReportBtn();
        },

        openOrgSelectView: function () {
            this.confirmOrgSelectView();
        },

        //保证机构选择视图已经创建
        confirmOrgSelectView: function () {
            var me = this;
            var title = this.orgTreeType == 'rankBrh' ? '统计机构之间的业绩比较' : '统计拓展员间的业绩比较';

            if(!this.orgSelectView) {

                this.orgSelectView = new OrgSelectView({
                    type: me.orgTreeType,
                    title: title,
                    orgTreeOptions: {
                        params: {
                            startApprovedDate: me.startApprovedDate || '',
                            endApprovedDate: me.endApprovedDate || ''
                        }
                    }
                });

                this.orgSelectView.on('select:target', function (orgInfoObj) {

                    console.log(orgInfoObj);
                    //TODO setTarget方法要不要改成接收对象信息
                    me.setTarget(TARGET_TYPE.ORG, orgInfoObj.id, orgInfoObj.simpleName, orgInfoObj.orgLevel);
                });
            }else{
                this.orgSelectView.open();
            }
            //bind events
        },

        clearTarget: function () {
            var me = this;

            this.targetId = null;
            this.orgLevel = null;  //统计的是下级机构的比较
            this.ui.targetSelect.find('.text').text('选择考核范围');

            me.destroyDialogView('orgSelectView');
            me._onDateChange();
        },

        destroyDialogView: function (dialogViewName) {
            if(this[dialogViewName]){
                this[dialogViewName].destroy();
                this[dialogViewName] = null;
            }
        },

        _onTargetTypeChange: function (type) {
            this._onParamChange();
        },

        _onAssetmentChange: function (newValue, oldValue) {
            this._onParamChange();
            console.log('考核业绩改变', arguments);
        },

        _onOrderChange: function (newValue, oldValue) {
            this._onParamChange();
            console.log('顺序改变', arguments);
        },

        _onDateChange: function () {
            this._onParamChange();
            console.log('日期改变');
        },

        renderDatePicker: function () {
            var me = this;

            me.datePicker = new RangeDatePicker({
                trigger: me.ui.dateTrigger,
                defaultValues: [me.momentStart, me.momentEnd],
                limitDate: moment().subtract('day', 1)
            });
            me.datePicker.on('submit', function(obj){
                if(!_.isEmpty(obj)){
                    me.startDate = obj.startDate;
                    me.endDate = obj.endDate;
                    me._onDateChange();
                }
            });

            me.approvedDatePicker = new RangeDatePicker({
                trigger: me.ui.dateApprovedTrigger,
                limitDate: moment().subtract('day', 1)
            }).on('submit', function (obj) {
                if(!_.isEmpty(obj)){
                    me.startApprovedDate = obj.startDate;
                    me.endApprovedDate = obj.endDate;
                    me.clearTarget();
                }
            });
        },

        //获取报表参数，同时作参数完整检测，如果不完整则返回null
        //如果后面维护觉得恶心，就把检测单独拉出来
        getReportParams: function () {
            var ui = this.ui;
            //TODO 测一下filter传过去null会不会出事
            var ret = {
            };
            //先做检测类参数获取

            //统计时间
            // if(!this.startDate || !this.endDate) {
            //     alert('请选择统计时间');
            //     return null;////////////////////////////////////////////
            // }
            ret.startDate = this.startDate;
            ret.endDate = this.endDate;
            //进驻时间
            ret.startApprovedDate = this.startApprovedDate || '';
            ret.endApprovedDate = this.endApprovedDate || '';
            //统计对象
            if(this.targetId === null) {
                Opf.alert('请选择考核范围');
                return null;////////////////////////////////////////////
            }
            ret.type = this.targetType;
            ret.id = this.targetId;
            ret.orgLevel = this.orgLevel;

            //商户范围
            ret.assessmentTarget = ui.assessmentDropdown.find('[ref]').attr('ref');

            //排序
            ret.sortBy = ui.orderDropdown.find('[ref]').attr('ref');

            //filter参数
            var rules = this.filters.getValue().rules;
            // postparam数据进行传递的时候，只能进行覆盖，当不存在的时候，以前的数据会保留。当数据为null的时候，参数不回家在上面
            ret.filters = null; 
            if (rules.length > 0) {
                ret.filters = JSON.stringify({
                    groupOp: 'AND',
                    rules: rules
                });
            }

            return ret;
        },
        
        genReport: function(e) {
            var me = this;
            var params = this.getReportParams();
            console.log('获取到报表参数', params);

            if(!params) {return;}
            if(!me.grid){
                me.setGridOptions(params);
                me.extraList && me.addGridList(me.extraList);
                me.renderGrid();
            }else{
                me.grid.clearGridData(true);
                me.grid.jqGrid('setGridParam', {
                    postData: params,
                    datatype: 'json',
                    title: me.getGridTitle(params)
                });

                me.grid.trigger("reloadGrid", [{page:1}]);
            }

            //生成报表后，让 生成 按钮不可用
            me.enableGenReportBtn(false);
        },
        
        getGridTitle: function (options) {
            //TODO  在这个title里拼字段
            var titleHtml = [
                '<span>',
                    _.findWhere(ASSESSMENT_DD_DATA.menu, {value: options.assessmentTarget}).label,
                    '排行' + (options.sortBy == '0' ? '↑': '↓'),
                '</span>',
                '<span>(',
                    moment(options.startDate, 'YYYYMMDD').formatYMD(),
                    '~',
                    moment(options.endDate, 'YYYYMMDD').formatYMD(),
                ')</span>'
            ].join('');
            
            return titleHtml;
        },

        getDownloadPostData: function () {
            var me = this;
            var reportParams = me.getReportParams();
            var titleText = me.getGridTitle(reportParams).replace(/<(\/)?span>/g, '');
            var postData = $.extend(reportParams, {
                reportName: encodeURIComponent(titleText)
            });
            return postData;
        },

        addGridList: function (gridList) {
            var me = this;
            if(me.gridOptions){
                _.each(gridList, function (item) {
                    // 处理列标题
                    var colNameObj = {};
                    colNameObj[item.key] = item.label;
                    $.extend(me.gridOptions.colNames, colNameObj);
                    // 处理列内容
                    var _colModel = _.clone(me.gridOptions.colModel);
                    _.each(_colModel, function (model, index) {
                        if(model.name == item.insertAfter){
                            var newModel = {name: item.key, index: item.key, _width: item._width};
                            me.gridOptions.colModel.splice(index+1, 0, newModel);
                        }
                    });
                });
            }
        },

        setGridOptions: function (params) {
            var me = this;
            me.gridOptions = {
                postData: params,
                rsId: me.targetType + '.rank',
                title: me.getGridTitle(me.getReportParams()),
                download: {
                    url: url._('pfms.rank.download'),
                    //必须返回对象
                    params: function () {
                        return me.getDownloadPostData();
                    },
                    queueTask: {//不配置就不在任务队列里生成一项，通常都要配置
                        name: function () {
                            var reportParams = me.getReportParams();
                            return me.getGridTitle(reportParams).replace(/<(\/)?span>/g, '');
                        }
                    }
                },
                autoResize: false,
                overflow: true,
                actionsCol: false,
                nav: {
                    actions: {
                        add: false,
                        view: false,
                        search: false,
                        refresh: false
                    }
                },
                gid: me.gid,
                url: url._('report.chart.ranking'),
                colNames: {
                    rank     : "排名",
                    orgName   : '机构',
                    totalMchtAmt: '商户总量',
                    addedMchtAmt: '新增商户数',
                    addedOneCertificates: '新增一证商户数',
                    addedThreeCertificates: '新增三证商户数',
                    activeTerminalAmt: '新增终端数',
                    terminalAmt:'终端总量',
                    totalSucTradeNum: '成功交易笔数',
                    totalFailTradeNum: '失败交易笔数',
                    numFailureRate: '笔数失败率',
                    totalSucTradeAmt: '成功交易金额',
                    totalFailTradeAmt: '失败交易金额',
                    amtFailureRate: '金额失败率',
                    txnFee: '商户手续费',
                    channelCost: '渠道成本',
                    profitCtribtn: '机构分润',
                    otherFee: '公司收益'
                },

                colModel: [
                    {name: 'rank', _width: 100, sortable: false/*,frozen: true*/},//排名
                    {name: 'orgName', _width: 140, sortable: false/*,frozen: true*/},//机构
                    {name: 'totalMchtAmt', width: 100, sortable: false/*, formatter: formatNum*//*,frozen: true*/},//商户总量
                    {name: 'addedMchtAmt', _width: 120, sortable: false/*, formatter: formatNum*//*,frozen: true*/},//新增商户数
                    {name: 'addedOneCertificates', _width: 140, sortable: false/*, formatter: formatNum*//*,frozen: true*/},//新增一证商户数
                    {name: 'addedThreeCertificates', _width: 140, sortable: false/*, formatter: formatNum*//*,frozen: true*/},//新增三证商户数
                    {name: 'activeTerminalAmt', _width: 100, sortable: false/*, formatter: formatNum*/},//销售终端
                    {name: 'terminalAmt', index: 'terminalAmt', _width: 150, sortable: false},//销售终端总量
                    {name: 'totalSucTradeNum', _width: 130, sortable: false/*, formatter: formatNum*/},//成功交易笔数
                    {name: 'totalFailTradeNum', _width: 130, sortable: false/*, formatter: formatNum*/},//失败交易笔数
                    {name: 'numFailureRate', _width: 120, sortable: false/*, formatter: formatNum*/},//笔数失败率
                    {name: 'totalSucTradeAmt', _width: 130, sortable: false/*, formatter: formatNum*/},//成功交易金额
                    {name: 'totalFailTradeAmt', _width: 130, sortable: false/*, formatter: formatNum*/},//失败交易金额
                    {name: 'amtFailureRate', _width: 120, sortable: false/*, formatter: formatNum*/},//金额失败率
                    {name: 'txnFee', _width: 120, sortable: false/*, formatter: formatNum*/},//商户手续费
                    {name: 'channelCost',  _width: 120, sortable: false/*, formatter: formatNum*/},//渠道成本
                    {name: 'profitCtribtn',  _width: 120, sortable: false/*, formatter: formatNum*/},//机构分润
                    {name: 'otherFee',  _width: 120, sortable: false/*, formatter: formatNum*/}//公司收益
                ],

                onInitGrid: function () {
                    setTimeout(function(){
                        me.setGroupHeaders();
                    },50);
                },

                loadComplete: function() {
                    setTimeout(function(){
                        CommonGrid.blendHeadBody(me.grid);
                        changeTitle(me, me.getReportParams());
                    },50);
                }
            }
        },

        renderGrid: function () {
            var me = this;
            var grid = me.grid = App.Factory.createJqGrid(me.gridOptions);
        },
        
        setGroupHeaders: function() {
            this.grid.jqGrid('setGroupHeaders', {
                useColSpanStyle : true, // 没有表头的列是否与表头列位置的空单元格合并
                groupHeaders : [{
                    startColumnName : 'totalSucTradeNum', // 对应colModel中的name
                    numberOfColumns : 3, // 跨越的列数
                    titleText : '交易笔数'
                },{
                    startColumnName : 'totalSucTradeAmt', // 对应colModel中的name
                    numberOfColumns : 3, // 跨越的列数
                    titleText : '交易金额'
                }]
            });
        }


    });

    //别手贱学我把静态变量写在下面，因为这个肯定是类初始化之后才用到
    
    var ASSESSMENT_DD_DATA  = {
        cls:'assessment-dropdown',
        defaultValue: 'addedMchtAmt',
        menu: [
            {value:'addedMchtAmt', label: '新增商户数'},
            {value:'activeTerminalAmt', label: '新增终端数'},
            {value:'totalSucTradeAmt', label: '成功交易金额'},
            // {value:'profitCtribtn', label: '机构分润'},
            // '-',
            {value:'totalMchtAmt', label: '商户总量'}//,
            // {value:'totalSucTradeNum', label: '成功交易笔数'},
            // {value:'totalFailTradeNum', label: '失败交易笔数'},
            // {value:'numfailureRate', label: '笔数失败率'},
            // {value:'totalFailTradeAmt', label: '失败交易金额'},
            // {value:'amtFailureRate', label: '金额失败率'},
            // {value:'txnFee', label: '商户手续费'},
            // {value:'channelCost', label: '渠道成本'}
    ]};

    var ORDER_DD_DATA = {
        cls: 'order-dropdown',
        defaultValue: '0',
        menu: [{value: '1', label: '从低到高'}, {value: '0', label: '从高到低'}]
    };
    
    function formatNum (cellvalue) {
        return Opf.currencyFormatter(cellvalue);
    }

    function changeTitle (me, params) {
        // 动态改变第一列和第二列表头的名称 
        //var $rowHeader = me.$el.find(".jqg-second-row-header"); //这个在第一次加载的时候，只有一个tr，不存在jqg-second-row-header   class
        var rankText = params.sortBy == 1? "排名(倒数)" : "排名";
        var orgNameText = params.type == "org" ? params.orgLevel + "级机构名称" : "拓展员姓名";

        $('#' + me.gid + '-table_rank').text(rankText);
        $('#' + me.gid + '-table_orgName').text(orgNameText);
    }

    //根据当前机构级别和规则， 返回要隐藏的列
    //后台已做了处理，前端不用再做
    // function getHideColNames() {
    //     var ret = [], 
    //         brhLevel = Ctx.getUser().get('brhLevel'),
    //         ruleType = Ctx.getUser().get('ruleType');

    //     switch (brhLevel) {
    //         case 1:
    //             //如果不是本机构全部
    //             if(ruleType != 1){
    //                 ret.push('channelCost');//隐藏渠道成本
    //             }
    //         break;
    //         case 2:
    //             ret.push('channelCost');//隐藏渠道成本
    //             //如果不是本机构全部
    //             if(ruleType != 1){
    //                 ret.push('profitCtribtn');//隐藏分润
    //             }
    //         break;
    //         default:
    //             ret.push('channelCost');//隐藏渠道成本
    //             ret.push('profitCtribtn');//隐藏分润
    //         break;
    //     }
    //     return ret;
    // }


    return RankView;
});