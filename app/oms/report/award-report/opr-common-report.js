define([
    'tpl!app/oms/report/award-report/templates/opr-common-table.tpl',
    'assets/scripts/fwk/component/RangeDatePicker',
    'jquery.jqGrid'
], function(tpl, RangeDatePicker) {
    var view = Marionette.ItemView.extend({
        className: 'report-panel',

        template: tpl,

        events: {
            'click .btn-report-submit': 'genReport'
        },

        ui: {
            dateTrigger: '.date-range-btn',
            genReportBtn: '.btn-report-submit'
        },
        
        initialize: function () {
            // 初始化默认日期
            this.momentStart = moment();//.subtract('day', 1)
            this.momentEnd = moment();
            // 统计条件上的范围日期
            this.initDate();
        },

        serializeData: function () {
            return {
                gridName: this.getGridName()
            }
        },
        onRender: function () {
            this.renderDatePicker();
            //this.enableGenReportBtn(false);
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
        //拿到表格请求参数
        getReportParams: function () {
            return {
                startDate: this.startDate,
                endDate: this.endDate
            }
        },
        //点击生成报表按钮
        genReport: function () {
            var param = this.getReportParams();

            if(!this.grid){
                this.renderGrid(param);
            }else{
                var postData = this.grid.jqGrid('getGridParam', 'postData');

                $.extend(postData, param);
                this.grid.trigger("reloadGrid", [{page:1}]);
            }
            this.enableGenReportBtn(false);

        },
        //生成报表
        renderGrid: function (gridParam) {
            var me = this;
            console.log(me.getGridRsId()+'------------');
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
                postData: gridParam,
                gid: me.getGridName() + '-grid',
                url: me.getGridUrl(),
                colNames: {
                    id:'',
                    expandId:'拓展员ID',
                    expandName:'拓展员名称',
                    brhNo:'机构号',
                    date: '日期时间',
                    addedMchtCount: '新增商户量',
                    addedMchtCountValid: '新增有效商户量',
                    addedMchtCountOneCert: '新增一证商户数',
                    addedMchtCountThreeCert: '新增三证商户数',
                    addedMchtCountValidActive:    '新增有效活跃商户量',
                    addedMchtCountActiveOneCert:  '新增活跃一证商户数',
                    addedMchtCountActiveThreeCert:'新增活跃三证商户数',
                    addedMchtCountRateValid:      '新增有效商户数环比',
                    addedMchtCountRateValidActive:'新增有效活跃商户数环比',
                    addedTermsValidActive603i:'603I',
                    addedTermsValidActive600602:'600/602'
                },

                colModel: [
                    {name: 'id', hidden: true},
                    {name: 'expandId'}, //拓展员ID
                    {name: 'expandName'}, //拓展员名称
                    {name: 'brhNo'}, //机构号
                    {name: 'date', formatter: me.dateFormatter}, //日期时间
                    {name: 'addedMchtCount'}, //新增商户量
                    {name: 'addedMchtCountValid'}, //新增有效商户量
                    {name: 'addedMchtCountOneCert'}, //新增一证商户数
                    {name: 'addedMchtCountThreeCert'}, //新增三证商户数
                    {name:'addedMchtCountValidActive',_width: 140,hidden: me.getGridName() == 'opr-day',viewable: me.getGridName() != 'opr-day'},//新增有效活跃商户量',
                    {name:'addedMchtCountActiveOneCert',_width: 140,hidden: me.getGridName() == 'opr-day',viewable: me.getGridName() != 'opr-day'},//新增活跃一证商户数',
                    {name:'addedMchtCountActiveThreeCert',_width: 140,hidden: me.getGridName() == 'opr-day',viewable: me.getGridName() != 'opr-day'},//新增活跃三证商户数',
                    {name:'addedMchtCountRateValid',_width: 140,hidden: me.getGridName() == 'opr-day',viewable: me.getGridName() != 'opr-day'},//新增有效商户数环比',
                    {name:'addedMchtCountRateValidActive',_width: 160,hidden: me.getGridName() == 'opr-day',viewable: me.getGridName() != 'opr-day'},//新增有效活跃商户数环比'
                    {name:'addedTermsValidActive603i',_width: 80,hidden: me.getGridName() == 'opr-day',viewable: me.getGridName() != 'opr-day'},//新增有效活跃商户终端603i'
                    {name:'addedTermsValidActive600602',_width: 80,hidden: me.getGridName() == 'opr-day',viewable: me.getGridName() != 'opr-day'}//新增有效活跃商户终端600,602'

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