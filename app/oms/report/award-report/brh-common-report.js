define([
    'tpl!app/oms/report/award-report/templates/brh-common-table.tpl',
    'assets/scripts/fwk/component/RangeDatePicker',
    'app/oms/report/rank/org-select-view',
    'jquery.jqGrid'
], function(tpl, RangeDatePicker, OrgSelectView) {
    var view = Marionette.ItemView.extend({
        className: 'report-panel',

        template: tpl,

        events: {
            'click .btn-report-submit': 'genReport',
            'click .mcht-range-btn': 'openOrgSelectView'
        },

        ui: {
            dateTrigger: '.date-range-btn',
            brhTarget: '.mcht-range-btn',
            genReportBtn: '.btn-report-submit'
        },
        
        initialize: function () {
            // 初始化默认日期
            this.momentStart = moment();//.subtract('day', 1)
            this.momentEnd = moment();
            // 统计条件上的范围日期
            this.initDate();
            // 统计机构
            this.targetId = null;

            this.orgSelectView = null;
        },

        serializeData: function () {
            return {
                gridName: this.getGridName()
            }
        },

        onRender: function () {
            this.renderDatePicker();
            this.enableGenReportBtn(false);
            this.initBrhTarget();
        },

        initBrhTarget: function () {
            var user = Ctx.getUser();

            // 如果当前规则是 3-本机构所有拓展员, 则默认显示本机构名称，不能进行选择
            if(user.get('ruleType') == '3'){
                this.ui.brhTarget.find('.text').text(user.get('brhName'));
                this.targetId = user.get('brhCode');

                this.ui.brhTarget.prop('disabled', true);
                this.enableGenReportBtn();
            }
        },

        enableGenReportBtn: function (toBeEnable) {
            this.ui.genReportBtn.toggleClass('disabled', toBeEnable === false ? true : false);
        },

        renderDatePicker: function () {
            var me = this;

            var rangeDatePickerConfig = me.getRangeDatePickerConf();

            var datePicker = new RangeDatePicker(rangeDatePickerConfig);

            datePicker.on('submit', function(obj){
                if(!_.isEmpty(obj)){
                    me.startDate = obj.startDate;
                    me.endDate = obj.endDate;
                    me.enableGenReportBtn();
                }
            });
        },
        //打开机构选择弹框
        openOrgSelectView: function () {
            var me = this;

            if(Ctx.getUser().get('ruleType') == '4'){
                Opf.alert('您只能查看自己拓展的商户信息');
                return;
            }

            if(!me.orgSelectView){
                me.orgSelectView = new OrgSelectView({
                    title: '统计机构',
                    type: 'rankBrh',
                    orgTreeOptions: {
                        // 谢斌提的需求: 只需要根节点和一级叶子节点, 干掉节点上的 '+' 号
                        leafDeep: 1,
                        award: true
                    }
                });

                me.orgSelectView.on('select:target', function (orgInfoObj) {
                    console.log(orgInfoObj);

                    me.setTarget(orgInfoObj);
                });
            }else{
                me.orgSelectView.open();
            }
        },
        //选择某个机构后设值
        setTarget: function (options) {
            if(options instanceof  Array){
                var targetIdArr = [];
                _.each(options,function(item){
                    targetIdArr.push(item.id);
                });

                this.targetId = targetIdArr;
            }else{
                this.targetId = options.id;
            }
            this.ui.brhTarget.find('.text').text('所选机构');
            this.enableGenReportBtn();
        },
        //拿到表格请求参数
        getReportParams: function () {
            return {
                startDate: this.startDate,
                endDate: this.endDate,
                brhList: this.wrapTargetId.call(this.targetId)
            }
        },
        wrapTargetId: function(){
            if(this instanceof  Array){
                var arr = [];
                _.each(this,function(item){
                    arr.push('"'+item+'"');
                })
                return '['+arr+']';

            }else{
                return '['+this+']';
            }
        },
        //点击生成报表按钮
        genReport: function () {
            if(!this.targetId){
                Opf.alert('请选择机构');
            }else{
                var param = this.getReportParams();
                if(!this.grid){
                    //param = JSON.stringify(param);
                    this.renderGrid(param);
                }else{
                    var postData = this.grid.jqGrid('getGridParam', 'postData');

                    $.extend(postData, param);
                    //postData = JSON.stringify(postData);
                    this.grid.trigger("reloadGrid", [{page:1}]);
                }
                this.enableGenReportBtn(false);
            }

        },
        //生成报表
        renderGrid: function (gridParam) {
            var me = this;

            var grid = me.grid = App.Factory.createJqGrid({
                rsId: me.getGridRsId(),
                caption: '机构业绩报表',
                actionsCol: false,
                nav: {
                    actions: {
                        add: false,
                        view: false,
                        search: false,
                        refresh: false
                    }
                },
                overflow: true,
                mtype:'POST',
                //datatype: "json",
                postData: gridParam,
                gid: me.getGridName() + '-grid',
                url: me.getGridUrl(),
                colNames: {
                    id:'',
                    brhNo: '机构号',
                    brhName: '机构名称',
                    date: '日期时间',
                    addedMchtCount: '新增商户量',
                    addedMchtCountValid: '新增有效商户量',
                    addedMchtCountOneCert: '新增一证商户数',
                    addedMchtCountThreeCert: '新增三证商户数',
                    addedOprCount: '新增地推数',
                    addedOprCountQuality: '新增优质地推数',
                    addedOprCountActive: '新增活跃地推数',
                    addedMchtCountValidActive:    '新增有效活跃商户量',
                    addedMchtCountActiveOneCert:  '新增活跃一证商户数',
                    addedMchtCountActiveThreeCert:'新增活跃三证商户数',
                    newMinshengActive: '民生类活跃商户数',
                    addedMchtCountRateValid:      '新增有效商户数环比',
                    addedMchtCountRateValidActive:'新增有效活跃商户数环比',
                    addedTermsValidActive603i:'603I',
                    addedTermsValidActive600602:'600/602'

                },

                colModel: [
                    {name: 'id', hidden: true},
                    {name: 'brhNo'}, //机构号
                    {name: 'brhName'}, //机构名称
                    {name: 'date', formatter: me.dateFormatter}, //日期时间
                    {name: 'addedMchtCount'}, //新增商户量
                    {name: 'addedMchtCountValid',_width: 120}, //新增有效商户量
                    {name: 'addedMchtCountOneCert',_width: 120}, //新增一证商户数
                    {name: 'addedMchtCountThreeCert',_width: 120}, //新增三证商户数
                    {name: 'addedOprCount'}, //新增地推数
                    {name: 'addedOprCountQuality',_width: 140, hidden: me.getGridName() == 'brh-day',viewable: me.getGridName() != 'brh-day'}, //新增优质地推数
                    {name: 'addedOprCountActive', _width: 140,hidden: me.getGridName() == 'brh-day',viewable: me.getGridName() != 'brh-day'}, //新增活跃地推数
                    {name: 'addedMchtCountValidActive',_width: 140, hidden: me.getGridName() == 'brh-day',viewable: me.getGridName() != 'brh-day'}, //新增有效活跃商户量
                    {name: 'addedMchtCountActiveOneCert',_width: 140, hidden: me.getGridName() == 'brh-day',viewable: me.getGridName() != 'brh-day'}, //新增活跃一证商户数
                    {name: 'addedMchtCountActiveThreeCert',_width: 140, hidden: me.getGridName() == 'brh-day',viewable: me.getGridName() != 'brh-day'}, //新增活跃三证商户数
                    {name:'newMinshengActive',_width: 140,hidden: me.getGridName() == 'brh-day',viewable: me.getGridName() != 'brh-day'},
                    {name: 'addedMchtCountRateValid',_width: 140, hidden: me.getGridName() == 'brh-day',viewable: me.getGridName() != 'brh-day'}, //新增有效商户数环比
                    {name: 'addedMchtCountRateValidActive',_width: 160, hidden: me.getGridName() == 'brh-day',viewable: me.getGridName() != 'brh-day'}, //新增有效活跃商户数环比
                    {name:'addedTermsValidActive603i',_width: 80,hidden: me.getGridName() == 'brh-day',viewable: me.getGridName() != 'brh-day'},//新增有效活跃商户终端603i'
                    {name:'addedTermsValidActive600602',_width: 80,hidden: me.getGridName() == 'brh-day',viewable: me.getGridName() != 'brh-day'}//新增有效活跃商户终端600,602'



                ],

                loadComplete: function() {

                },
                onInitGrid : function () {
                    _ . defer( function (){
                        me.setGroupHeaders () ;
                    }) ;
                }


            });

            return grid;
        },
        setGroupHeaders : function() {
            this . grid. jqGrid ('setGroupHeaders' , {
                useColSpanStyle : true, // 没有表头的列是否与表头列位置的空单元格合并
                groupHeaders : [{
                    startColumnName : 'addedTermsValidActive603i' , // 对应colModel中的name
                    numberOfColumns : 2, // 跨越的列数
                    titleText : '新增有效活跃商户终端'
                }]
            });
        }

    });

    return view;
});