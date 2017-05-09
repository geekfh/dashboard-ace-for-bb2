/**
 * 注意：
 * 每次生成报表后按钮都会灰掉，当某个参数修改后才会高亮可用
 * 因此界面上参数变化后都要调用 _onParamChange
 */
//TODO
//生成报表按钮，当可用的时候才高亮，不可用则灰掉
//生成一次报表后，灰掉，当参数改变后高亮
define([
    'tpl!app/oms/report/bank-bundle/templates/bank-bundle.tpl',
    'assets/scripts/fwk/component/RangeDatePicker',
    'app/oms/report/component/OrgTargetSelectDialog',
    'app/oms/report/component/ExplorerTargetSelectDialog',
    'app/oms/report/component/MchtSelectDialog',
    'bootstrap-datepicker',
    'jquery.jqGrid'
], function(tpl, RangeDatePicker, OrgSelectView, ExplorerTargetSelectDialog, MchtSelectView) {

    var TARGET_TYPE = { ORG: 'org', EXPLORER: 'explore', MCHT: 'mcht'};

    var SUB_GRID_PATH_MAP = {
        mchtTxn: {
            belong: 'mcht',
            path: 'app/oms/report/bank-bundle/MchtFlowSettleCheckGrid'
        },
        orgTxn: {
            belong: 'exploreOrBrh',
            path: 'app/oms/report/bank-bundle/OrgFlowSettleCheckGrid'
        },
        orgMchtSum: {
            belong: 'exploreOrBrh',
            path: 'app/oms/report/bank-bundle/OrgMchtTxnSummaryGrid'
        },
        orgExploreSum: {
            belong: 'exploreOrBrh',
            path: 'app/oms/report/bank-bundle/OrgExplorerTxnSummaryGrid'
        }
    };

    var exportView = Marionette.ItemView.extend({
        tabId: 'menu.report.bank.bundle',
        className: 'report-export report-panel',
        template: tpl,

        ui: {
            targetDropdown: '.target-dropdown',
            dateTrigger: '.range-trigger',
            mchtTrigger: '.mcht-trigger',
            genReportBtn: '.btn-report-submit',

            orgTxn: '[name="orgTxn"]',
            orgMchtSum: '[name="orgMchtSum"]',
            orgExploreSum: '[name="orgExploreSum"]',
            mchtTxn: '[name="mchtTxn"]'
        },

        events: {
            //选择商户范围
            'click .target-dropdown .dropdown-menu a': '_onTargetChange',
            'click .mcht-trigger': '_onMchtTargetTrigger',
            //选择报表类型
            'click .type-dropdown .dropdown-menu a': '_onTypeChange',
            //产生报表
            'click input.btn-report-submit' : 'genReport'
        },


        initialize: function () {
            //界面上的日期
            this.startDate = null;
            this.endDate = null;
            //商户范围
            this.targetId = null;//如果是org类型则为机构ID
            this.orgLevel = null;//如果是org类型则为机构级别

            this.reportType = null;//报表类型

            this.orgSelectView = null;//机构选择对话框

            this.mchtSelectView = null;//商户选择对话框

            this.explorerSelectView = null;//拓展员选择界面

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
            this.targetType = type;

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
                targetDDText = name;
                this.ui.targetDropdown.find('.text').text(targetDDText).val(id);

            }else if (type === TARGET_TYPE.EXPLORER) {
                console.log('设置考核对象为拓展员');

                this.targetId = id;
                this.orgLevel = null;
                targetDDText = name;
                this.ui.targetDropdown.find('.text').text(targetDDText).val(id);

            }else if (type === TARGET_TYPE.MCHT) {
                console.log('设置考核对象为商户');

                this.targetId = id;
                this.orgLevel = null;
                targetDDText = name;
                this.ui.mchtTrigger.find('.text').text(targetDDText).val(id);
            }else {
                console.error('设置考核对象类型出错', arguments);
            }

            if(oldTargetId !== this.targetId) {
                this._onParamChange();
            }
        },

        onRender: function () {
            var me = this;
            this.renderDatePicker();
            this.checkPermission();
        },

        checkPermission: function () {
            var ui = this.ui;

            ui.mchtTxn.toggle(Ctx.avail('mcht.txn.grid'));
            ui.orgTxn.toggle(Ctx.avail('org.txn.grid'));
            ui.orgExploreSum.toggle(Ctx.avail('org.explore.sum.grid'));
            ui.orgMchtSum.toggle(Ctx.avail('org.mcht.sum.grid'));
        },

        enableGenReportBtn: function (toBeEnable) {
            this.ui.genReportBtn.toggleClass('disabled', toBeEnable === false ? true : false);
        },

        _onParamChange: function () {
            this.enableGenReportBtn();
        },

        _onTargetChange: function (e) {
            var val = $(e.target).closest('li').find('a').attr('value');

            console.log('点击考核对象',  val);

            if(val === TARGET_TYPE.ORG) {
                this.openOrgSelectView();

            }else if(val === TARGET_TYPE.EXPLORER){
                // this.setTarget(TARGET_TYPE.EXPLORER);
                this.openExplorerSelectView();
            }
        },

        openExplorerSelectView: function () {
            this.renderExplorerSelectView();
            this.explorerSelectView.open();
        },

        renderExplorerSelectView: function () {
            var me = this;
            if(!this.explorerSelectView) {

                this.explorerSelectView = new ExplorerTargetSelectDialog({
                    orgTreeOptions: {
                        getInitOrgDataAjaxOptions: {
                            data: null,
                            url: url._('pointpay.report.org.tree.opr.init')
                        }
                    }
                });

                this.explorerSelectView.on('select:target', function (infoObj) {
                    me.setTarget(TARGET_TYPE.EXPLORER, infoObj);
                });
            }
        },

        openOrgSelectView: function () {
            this.confirmOrgSelectView();
            this.orgSelectView.open();
        },

        //保证机构选择视图已经创建
        confirmOrgSelectView: function () {
            var me = this;

            if(!me.orgSelectView) {

                me.orgSelectView = new OrgSelectView({
                    orgTreeOptions: {
                        getInitOrgDataAjaxOptions: {
                            data: null,
                            url: url._('pointpay.report.org.tree.brh.init')
                        }
                    }
                });

                me.orgSelectView.on('select:target', function (orgInfoObj) {
                    me.setTarget(TARGET_TYPE.ORG, orgInfoObj);
                });
            }
            //bind events
        },

        onDestroy: function () {
            console.log('>>>销毁bank-bundle-view');
            this.datePicker.remove();
            this.orgSelectView && this.orgSelectView.destroy();
            this.ExplorerTargetSelectDialog && this.ExplorerTargetSelectDialog.destroy();
        },

        _onTypeChange: function (e) {
            this.setDropdownVal($(e.target));
            this.reportType = $(e.target).attr('name');
            this.changeTargetSelectDOM(this.reportType);
        },

        _onDateChange: function () {
            this._onParamChange();
            console.log('日期改变');
        },

        _onMchtTargetTrigger: function () {
            //TODO 这是点击统计对象为商户的时候所触发发生的事件
            this.openMchtSelectView();
        },

        openMchtSelectView: function () {
            var me = this;
            if(!me.mchtSelectView){
                me.mchtSelectView = new MchtSelectView({
                    type: 'mcht',
                    title: '统计商户'
                });

                me.mchtSelectView.on('select:target', function (mchtInfoObj) {
                    console.log(mchtInfoObj);
                    //TODO setTarget方法要不要改成接收对象信息
                    me.setTarget(TARGET_TYPE.MCHT, {
                        id: mchtInfoObj.mchtNo,
                        name: mchtInfoObj.mchtName
                    });
                });
            }
            me.mchtSelectView.open();
        },

        setDropdownVal: function ($target) {
            var $label = $target.closest('.dropdown').find('.text');
            var oldVal = $label.text();
            var newVal = $target.text();

            $label.text(newVal);

            oldVal != newVal && this._onParamChange();
        },

        destroyDatePicker: function () {
            this.datePicker.destroy();
            this.ui.dateTrigger.text('- 请选择统计时间 -');
            this.startDate = null;
            this.endDate = null;
        },

        // 报表类型为 mchtTxn 或者 orgTxn 时要选择同一个月内的日期范围
        renderDatePicker: function (reportType) {
            var me = this;
            var options = {
                trigger: me.ui.dateTrigger,
                defaultValues: false,
                limitDate: moment().subtract('day', 1)
            };
            if(reportType === 'mchtTxn' || reportType === 'orgTxn'){
                options.limitRange = 'month';
            }

            me.datePicker = new RangeDatePicker(options);

            me.datePicker.on('submit', function(obj){
                if(!_.isEmpty(obj)){
                    me.startDate = obj.startDate;
                    me.endDate = obj.endDate;
                    me._onDateChange();
                }
            });
        },

        changeTargetSelectDOM: function (reportType) {
            //TODO 如果是商户流水对账, 则点击商户范围为纯粹的按钮，否则为下拉列表
            var typeBelong = SUB_GRID_PATH_MAP[reportType].belong;
            var isExploreOrBrh = typeBelong == 'exploreOrBrh';
            var isMcht = typeBelong == 'mcht';
            this.ui.targetDropdown.toggle(isExploreOrBrh);

            this.ui.mchtTrigger.toggle(isMcht);
            this.resetTargetSelect();

            // 切换报表类型时候重新构造范围日期选择
            // 报表类型为 mchtTxn 或者 orgTxn 时要选择同一个月内的日期范围
            this.destroyDatePicker();
            this.renderDatePicker(reportType);
        },

        resetTargetSelect: function () {
            this.$el.find('.targetVal').text('- 请选择商户范围 -');
            this.targetId = null;
            this.orgLevel = null;
        },

        //获取报表参数，同时作参数完整检测，如果不完整则返回null
        //如果后面维护觉得恶心，就把检测单独拉出来
        getReportParams: function () {
            var ui = this.ui;
            //TODO 测一下filter传过去null会不会出事
            var ret = {};

            //不提供默认值，必须选择，如果没有则弹窗提示
            //报表类型
            if(!this.reportType){
                Opf.alert('请选择报表类型');
                return null;////////////////////////////////////////////
            }
            //统计时间
            if(!this.startDate || !this.endDate) {
                Opf.alert('请选择统计时间');
                return null;////////////////////////////////////////////
            }

            //统计对象
            if(!this.targetId) {
                Opf.alert('请选择考核范围');
                return null;////////////////////////////////////////////
            }

            //统计日期
            ret.startDate = this.startDate;
            ret.endDate = this.endDate;

            //商户范围
            //如果报表类型是商户流水对账则不传 type
            ret.type = this.targetType == 'mcht' ? undefined : this.targetType;
            ret.id = this.targetId;

            return ret;
        },

        genReport: function(e) {
            var me = this;
            var params = this.getReportParams();
            console.log('获取到报表参数', params);

            if(!params) {return;}

            require([SUB_GRID_PATH_MAP[me.reportType].path], function(GridView){
                var gridView = new GridView(params);
                gridView.render();
                me.$el.find('.row').remove();
                me.$el.append(gridView.$el);
            });


            //生成报表后，让 生成 按钮不可用
            me.enableGenReportBtn(false);
        }

    });


    return exportView;
});