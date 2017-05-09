define(['App',
    'tpl!app/oms/report/performance/templates/performance.tpl',
    'assets/scripts/fwk/component/RangeDatePicker',
    'i18n!app/oms/common/nls/report',
    'app/oms/report/component/OrgTargetSelectDialog',
    'app/oms/report/component/ExplorerTargetSelectDialog',
    'app/oms/report/component/MchtSelectDialog',
    'app/oms/report/common/common-grid-fn',
    'jquery.jqGrid'
], function(App, tpl, RangeDatePicker, reportLang, OrgSelectView, ExplorerTargetSelectDialog, MchtSelectView, CommonGrid) {

    var TARGET_TYPE = { ORG: 'org', EXPLORER: 'explore'};

    var ajaxDeferr = null; // ajax 的异步请求对象

    var FREQUENCY_MAP = {
        daily: '业绩日报',
        weekly: '业绩周报',
        monthly: '业绩月报',
        quarterly: '业绩季报',
        annually: '业绩年报'
    };

    var View = Marionette.ItemView.extend({
        tabId: '',
        className: 'report-panel',
        template: tpl,

        events: {
            //选择统计周期
            'click .frequency-dropdown .dropdown-menu a': '_onFrequencyChange',
            //选择商户范围
            'click .mcht-range-btn': '_onTargetChange',
            //生成报表
            'click input.btn-report-submit': 'genReport'
        },

        ui: {
            frequencyDropdown: '.frequency-dropdown',
            targetBtn: '.target-btn-group',
            targetSelect: '.mcht-range-btn',
            dateTrigger: '.date-range-trigger',
            dateApprovedTrigger: '.date-approved-trigger',
            genReportBtn: '.btn-report-submit'
        },

        initialize: function (options) {
            //是否可以默认生成报表；
            this.canGenReport = false;

            //界面上的周期
            this.frequency = null;
            //界面上的日期
            this.momentStart = moment().subtract('day', 28);
            this.momentEnd = moment().subtract('day', 1);
            this.startDate = this.momentStart.format('YYYYMMDD');
            this.endDate = this.momentEnd.format('YYYYMMDD');
            //界面上的进驻日期
            this.startApprovedDate = null;
            this.endApprovedDate = null;
            //界面上的商户范围
            this.targetId = null;
            this.targetName = null;
            this.orgLevel = null;

            this.orgSelectView = null;//机构选择对话框

            this.explorerSelectView = null;//拓展员选择界面

            this.targetType = options.type;

            if (options.type == 'org') {
                this.tabId = 'menu.org.perform';
                this.gid = 'report-org-grid';

            } else {
                this.tabId = 'menu.staff.perform';
                this.gid = 'report-usr-grid';

            }

            this.gridOptions = null;
            this.extraList = options.extraList;
        },

        // 视图被移除时中止 ajax 请求并且将对象置为空;
        onDestroy: function () {
            ajaxDeferr && ajaxDeferr.abort();
            ajaxDeferr = null;
        },

        onRender: function () {
            var me = this;
            me.renderDatePicker();
            me.updateTargetUi();
            me.setDefaultVal();

            this.$el.find('.report-grid-table').attr('id', me.gid + '-table');
            this.$el.find('.report-grid-pager').attr('id', me.gid + '-pager');

            setTimeout(function(){
                //在对考核范围进行初始化的时候涉及到ajax请求，因而需要用deferr进行处理
                if(me.targetType == TARGET_TYPE.ORG){
                    me.deferredTarget();
                    ajaxDeferr && ajaxDeferr.done(function(){
                        me.canGenReport && me.genReport();
                    });
                }else{
                    me.setExplorerTarget();
                    _.defer(function(){
                        me.canGenReport && me.genReport();
                    });
                }
            },20);
        },

        setDefaultVal: function () {
            this.ui.frequencyDropdown.find('.text').text('按日统计');
            this.frequency = 'daily';
        },

        updateTargetUi: function () {
            var ui = this.ui;
            var btnText = this.targetType == TARGET_TYPE.ORG ? '统计某个机构的业绩' : '统计某个拓展员的业绩';
            ui.targetBtn.find('.text').text(btnText);
        },

        //初始考核范围
        deferredTarget: function(){
            var me = this;
            var currUser = Ctx.getUser();
            if(currUser.get('isExplorer') == "1") {
                ajaxDeferr = Opf.ajax({
                    url: url._('report.performance.child.brh.init'),
                    success: function(data){
                        if (data && data.accessable === true) {
                            me.setTarget(TARGET_TYPE.ORG, data);
                            me.canGenReport = true;
                        }
                    }
                });
            }
        },

        setExplorerTarget: function () {
            var me = this;
            var currUser = Ctx.getUser();
            if(currUser.get('isExplorer') == "1"){
                me.setTarget(TARGET_TYPE.EXPLORER, {
                    id: currUser.get('id'),
                    name: currUser.get('name')
                });
                me.canGenReport = true;
            }
        },

        onClose: function () {
            this.datePicker.remove();
            this.throughTimePicker.remove();
        },

        //界面周期变化
        _onFrequencyChange: function (e) {
            this.setDropdownVal($(e.target));
            this.frequency = $(e.target).attr('name');
            this.datePicker.updateRangesByName(this.frequency);
        },

        _onTargetChange: function () {
            if(this.targetType === TARGET_TYPE.ORG) {
                this.openOrgSelectView();

            }else if(this.targetType === TARGET_TYPE.EXPLORER){
                // this.setTarget(TARGET_TYPE.EXPLORER);
                this.openExplorerSelectView();
            }
        },

        openOrgSelectView: function () {
            var me = this;

            if(!me.orgSelectView) {

                me.orgSelectView = new OrgSelectView({
                    orgTreeOptions: {
                        params: {
                            startApprovedDate: me.startApprovedDate || '',
                            endApprovedDate: me.endApprovedDate || ''
                        }
                    }
                });

                me.orgSelectView.on('select:target', function (orgInfoObj) {

                    console.log(orgInfoObj);
                    //TODO setTarget方法要不要改成接收对象信息
                    me.setTarget(TARGET_TYPE.ORG, orgInfoObj);
                });
            }else{
                me.orgSelectView.open();
            }
        },

        openExplorerSelectView: function () {
            var me = this;
            if(!me.explorerSelectView) {

                me.explorerSelectView = new ExplorerTargetSelectDialog({
                    orgTreeOptions: {
                        params: {
                            startApprovedDate: me.startApprovedDate || '',
                            endApprovedDate: me.endApprovedDate || ''
                        }
                    }
                });

                me.explorerSelectView.on('select:target', function (infoObj) {
                    me.setTarget(TARGET_TYPE.EXPLORER, infoObj);
                });
            }else{
                me.explorerSelectView.open();
            }
        },

                    /**
         * 设置考核对象，更新UI
         * @param {String} type    org/explore/mcht
         * @param {[type]} options
         *        当 type 为 explorer {id:xx, name:xx}
         *        当 type 为 org {id:xx, name:xx, level:xx}
         *        当 type 为 mcht {name:xx, mchtNo:xx}
         */
        setTarget: function (type, options) {
            var id = options.id;
            var name = options.name;
            var level = options.level;

            var targetDDText = '';
            var oldTargetId = this.targetId;

            //targetId只有选择机构的时候才有
            if(type === TARGET_TYPE.ORG) {
                console.log('设置考核对象类型为机构');

                this.targetId = id;
                this.orgLevel = parseInt(level, 10);
                targetDDText = formatTargetName(name);
                this.ui.targetSelect.find('.text').text(targetDDText).val(id);

            }else if (type === TARGET_TYPE.EXPLORER) {
                console.log('设置考核对象为拓展员');

                this.targetId = id;
                this.orgLevel = null;
                targetDDText = formatTargetName(name);
                this.ui.targetSelect.find('.text').text(targetDDText).val(id);

            }

            this.targetName = targetDDText;

            if(oldTargetId !== this.targetId) {
                this._onParamChange();
            }
        },


        setDropdownVal: function ($target) {
            var $label = $target.closest('.dropdown').find('.text');
            var oldVal = $label.text();
            var newVal = $target.text();

            $label.text(newVal);

            oldVal != newVal && this._onParamChange();
        },

        enableGenReportBtn: function (toBeEnable) {
            this.ui.genReportBtn.toggleClass('disabled', toBeEnable === false ? true : false);
        },

        _onParamChange: function () {
            this.enableGenReportBtn();
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

            me.throughTimePicker = new RangeDatePicker({
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

        clearTarget: function () {
            var me = this;

            this.targetId = null;
            this.orgLevel = null;
            this.ui.targetSelect.find('.text').text('选择商户范围').val('');

            me.destroyDialogView('orgSelectView');
            me.destroyDialogView('explorerSelectView');
            me._onDateChange();
        },

        destroyDialogView: function (dialogViewName) {
            if(this[dialogViewName]){
                this[dialogViewName].destroy();
                this[dialogViewName] = null;
            }
        },

        _onDateChange: function () {
            this._onParamChange();
            console.log('日期改变');
        },

        //获取报表参数，同时作参数完整检测，如果不完整则返回null
        //如果后面维护觉得恶心，就把检测单独拉出来
        getReportParams: function () {
            var ui = this.ui;
            //TODO 测一下filter传过去null会不会出事
            var ret = {};

            //不提供默认值，必须选择，如果没有则弹窗提示
            //报表类型
            if(!this.frequency){
                Opf.alert('请选择统计周期');
                return null;////////////////////////////////////////////
            }
            //统计时间
            if(!this.startDate || !this.endDate) {
                Opf.alert('请选择统计时间');
                return null;////////////////////////////////////////////
            }

            //统计对象
            if(!this.targetId) {
                Opf.alert('请选择商户范围');
                return null;////////////////////////////////////////////
            }

            //统计周期
            ret.frequency = this.frequency;
            //统计日期
            ret.startDate = this.startDate;
            ret.endDate = this.endDate;
            //进驻时间
            ret.startApprovedDate = this.startApprovedDate || '';
            ret.endApprovedDate = this.endApprovedDate || '';
            //商户范围
            //如果报表类型是商户流水对账则不传 type
            ret.type = this.targetType;
            ret.id = this.targetId;

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
                    datatype:'json',
                    title: me.getGridTitle()
                 });
                me.grid.trigger("reloadGrid", [{page:1}]);
            }

            //生成报表后，让 生成 按钮不可用
            me.enableGenReportBtn(false);
        },

        getGridTitle: function () {
            var titleHtml = [
                '<span>' + this.targetName + ' </span>',
                '<span>(',
                    moment(this.startDate, 'YYYYMMDD').formatYMD(),
                    '~',
                    moment(this.endDate, 'YYYYMMDD').formatYMD(),
                ')</span>'
            ].join('');

            return titleHtml;

        },

        getDownloadPostData: function () {
            var me = this;
            var titleText = me.getGridTitle().replace(/<(\/)?span>/g,'');
            var postData = $.extend(me.getReportParams(), {
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
                download: {
                    url: url._('pfms.report.download'),
                    //必须返回对象
                    params: function () {
                        return me.getDownloadPostData();
                    },
                    queueTask: {//不配置就不在任务队列里生成一项，通常都要配置
                        name: function () {
                            return me.getGridTitle().replace(/<(\/)?span>/g,'');
                        }
                    }
                },
                postData: params,
                rsId: me.targetType + '.report',
                title: me.getGridTitle(),
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
                url: url._('pfms-report'),
                colNames: {
                    timeRange: '时间',
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
                    {name: 'timeRange', index: 'timeRange', _width: 200, sortable: false},//时间
                    {name: 'totalMchtAmt', index: 'totalMchtAmt', _width: 100, sortable: false},//商户总量
                    {name: 'addedMchtAmt', index: 'addedMchtAmt', _width: 110, sortable: false},//新增商户数
                    {name: 'addedOneCertificates', _width: 140, sortable: false/*, formatter: formatNum*//*,frozen: true*/},//新增一证商户数
                    {name: 'addedThreeCertificates', _width: 140, sortable: false/*, formatter: formatNum*//*,frozen: true*/},//新增三证商户数
                    {name: 'activeTerminalAmt', index: 'activeTerminalAmt', _width: 100, sortable: false},//销售终端
                    {name: 'terminalAmt', index: 'terminalAmt', _width: 150, sortable: false},//销售终端总量
                    {name: 'totalSucTradeNum', index: 'totalSucTradeNum',  _width: 130, sortable: false},//成功交易笔数
                    {name: 'totalFailTradeNum', index: 'totalFailTradeNum', _width: 130, sortable: false},//失败交易笔数
                    {name: 'numFailureRate', index: 'numFailureRate', _width: 110,  sortable: false},//笔数失败率
                    {name: 'totalSucTradeAmt', index: 'totalSucTradeAmt', _width: 130, sortable: false},//成功交易金额
                    {name: 'totalFailTradeAmt', index: 'totalFailTradeAmt', _width: 130, sortable: false},//失败交易金额
                    {name: 'amtFailureRate', index: 'amtFailureRate', _width: 110, sortable: false},//金额失败率
                    {name: 'txnFee', index: 'txnFee', _width: 110, sortable: false},//商户手续费
                    {name: 'channelCost', index: 'channelCost', _width: 100 ,sortable: false},//渠道成本
                    {name: 'profitCtribtn', index: 'profitCtribtn', _width: 110, sortable: false},//机构分润
                    {name: 'otherFee', index: 'otherFee', _width: 110, sortable: false}//公司收益
                ],

                onInitGrid: function () {
                    setTimeout(function(){
                        me.setGroupHeaders();
                    },50);
                },

                loadComplete: function() {
                    setTimeout(function(){
                        CommonGrid.blendHeadBody(me.grid);
                    },50);
                }
            };
        },

        renderGrid: function() {
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

    function formatTargetName (name) {
        return name.replace(/\<span.+/, '');
    }


    return View;

});
