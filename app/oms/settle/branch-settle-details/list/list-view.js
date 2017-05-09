/**
 * @created 2014-3-12 19:27:29
 */



define(['App',
    'tpl!app/oms/settle/branch-settle-details/list/templates/table-ct.tpl',
    'i18n!app/oms/common/nls/settle',
    'jquery.jqGrid',
    'jquery.validate',
    'bootstrap-datepicker',
    'moment.override'
], function(App, tableCtTpl, settleLang) {

    var RESULTFLAG_MAP = {
        '0': settleLang._('branch.settle.details.result.flag.0'),  //'入账成功'
        '1': settleLang._('branch.settle.details.result.flag.1'),  //'入账失败'
        '2': settleLang._('branch.settle.details.result.flag.2'),  //'已汇总未付款'
        '3': settleLang._('branch.settle.details.result.flag.3'),  //'直接插入入账错误表进行手工清算'
        '8': settleLang._('branch.settle.details.result.flag.8'),  //'已人工选择可付款'
        '9': settleLang._('branch.settle.details.result.flag.9')  //'初始化待选择'
    };

    var STAT_MAP = {
        "totalTxAmt":"交易总金额",
        "totalFeeAmt":"手续费",
        "totalCupsFee":"第三方手续费",
        "totalTxNum":"交易总笔数",
        "totalSettleAmt":"分润金额"
    };


    App.module('SettleApp.BranchSettleDetails.List.View', function(View, App, Backbone, Marionette, $, _) {

        View.BranchSettleDetails = Marionette.ItemView.extend({
            tabId: 'menu.branch.settle.details',
            template: tableCtTpl,

            events: {

            },

            beforeRenderGridView: function () {
                var me = this;

                this.$el.find('.set-grid-table').attr('id', me.getGid() + '-table');
                this.$el.find('.set-grid-pager').attr('id', me.getGid() + '-pager');
            },

            getGid: function () {
                return 'branch-settle-details-grid';
            },

            onRender: function() {
                var me = this;
                me.beforeRenderGridView();

                setTimeout(function() {

                    me.renderGrid();

                },1);
            },

            gridOptions: function (defaultOptions) {
                return defaultOptions;
            },


            renderGrid: function() {

                var me = this;

                var grid = App.Factory.createJqGrid(me.gridOptions({
                    caption: settleLang._('BranchSettleDetails.txt'),
                    rsId:'BranchSettleDetails',
                    filters: [
                        {
                            caption: '精准搜索',
                            components: [
                                {
                                    type: 'rangeDate',
                                    label: '交易月份',
                                    ignoreFormReset: true,
                                    defaultValue: [moment().subtract('month',1),moment()],
                                    displayFormat: 'YYYY/MM',
                                    valueFormat: 'YYYYMM',
                                    name: 'txDate'
                                }, {
                                    label: '清算机构名称',
                                    name: 'settleBrhName'
                                }, {
                                    label: '清算机构号',
                                    name: 'settleBrhId',
                                    inputmask: {
                                        integer: true
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
                            {name: 'totalTxAmt', type:'currency'},
                            {name: 'totalFeeAmt', type:'currency'},
                            {name: 'totalCupsFee', type:'currency'},
                            {name: 'totalTxNum', type:'count'},
                            {name: 'totalSettleAmt', type:'currency'}
                        ]
                    },
                    actionsCol: {
                        // width: Opf.Config._('ui', 'BranchSettleDetails.grid.form.actionCol.width'),
                        edit : false,
                        del: false,
                        extraButtons: [
                            {name: 'join', title:'参与清算', icon: 'icon-opf-join-settle icon-opf-join-settle-color', click: function(e) {
                                $(e).hide();
                                getJoinOrNotJoinAjax(grid);
                            }},
                            {name: 'notJoin', title:'不参与清算', icon: 'icon-opf-notjoin-settle icon-opf-notjoin-settle-color', click: function(e) {
                                $(e).hide();
                                getJoinOrNotJoinAjax(grid);
                            }}
                        ],
                        canButtonRender: function(name, opts, rowData) {


                            //初始化待选择的情况下才可以显示参与清算的按钮
                            if(name === 'join' && rowData.resultFlag !== '9') {
                                return false;
                            }

                            //已人工选择可付款的情况下才显示不参与清算的按钮
                            if(name === 'notJoin' && rowData.resultFlag !== '8') {
                                return false;
                            }
                        }
                    },

                    nav: {

                        actions: {
                            add: false,
                            search: false
                            // refresh: false
                        },

                        formSize: {
                            width: Opf.Config._('ui', 'BranchSettleDetails.grid.form.width'),
                            height: Opf.Config._('ui', 'BranchSettleDetails.grid.form.height')
                        },
                        view: {
                            width: Opf.Config._('ui', 'BranchSettleDetails.grid.viewform.width'),
                            height: Opf.Config._('ui', 'BranchSettleDetails.grid.viewform.height')
                        }/*,

                         search: {
                         afterRedraw: function () {
                         $(this).find('select.opsel').prop('disabled',true);
                         }
                         }*/

                    },
                    gid: me.getGid(),//innerly get corresponding ct '#bat-main-ctl-details-grid-table' '#bat-main-ctl-details-grid-pager'
                    url: url._('branch.settle.details'),

                    helpers: {
                        info: "点击数据行左侧的三角形可以查看更多信息。"
                    },

                    colNames: {
                        id       : settleLang._('id'),  //ID
                        settleDate  :  settleLang._('branch.settle.details.settle.date'),  //清算日期
                        inDate  :  settleLang._('branch.settle.details.in.date'),  //入账日期
                        txDate  :  settleLang._('branch.settle.details.tx.date'),  //交易月份
                        batchNo  :  settleLang._('branch.settle.details.batch.no'),  //批次号
                        traceAll  :  settleLang._('branch.settle.details.trace.all'),  //总流水
                        traceNo  :  settleLang._('branch.settle.details.trace.no'),  //流水号
                        resultFlag  :  settleLang._('branch.settle.details.result.flag'),  //结果标示(0-入账成功，1-入账失败，2-未处理)
                        resultDesc  :  settleLang._('branch.settle.details.result.desc'),  //清算处理描述
                        txNum  :  settleLang._('branch.settle.details.tx.num'),  //交易总笔数
                        txAmt  :  settleLang._('branch.settle.details.tx.amt'),  //交易总金额
                        feeAmt  :  settleLang._('branch.settle.details.fee.amt'),  //手续费金额
                        baseAmt  :  settleLang._('branch.settle.details.base.amt'), //基准手续费
                        cupsFee  :  settleLang._('branch.settle.details.cups.fee'),  //第三方手续费
                        inFee  :  settleLang._('branch.settle.details.in.fee'),  //手续费净额
                        // otherFee  :  settleLang._('branch.settle.details.other.fee'),  //其它费用
                        rate  :  settleLang._('branch.settle.details.rate'),  //手续费净额扣率
                        repairAmt  :  settleLang._('branch.settle.details.repair.amt'),  //补账金额
                        unrepairAmt  :  settleLang._('branch.settle.details.unrepair.amt'),  //补账处理后继续清算金额
                        uperrAmt  :  settleLang._('branch.settle.details.uperr.amt'),  //上周期入账失败金额
                        // dcFlag  :  settleLang._('branch.settle.details.do.flag'),  //借贷标示(D-贷，C-借)
                        settleAmt  :  settleLang._('branch.settle.details.settle.amt'),  //分润金额
                        settleBrhId  :  settleLang._('branch.settle.details.settle.brh.id'),  //清算机构号
                        settleBrhName : settleLang._('branch.settle.details.settle.brh.name'),  //清算机构名称
                        recCreateTime  :  settleLang._('branch.settle.details.rec.create.time'),  //记录创建时间
                        recUpdTime  :  settleLang._('branch.settle.details.rec.upd.time')  //记录修改时间

                    },

                    responsiveOptions: {
                        hidden: {
                            ss: ['txDate', 'settleAmt', 'inDate', 'batchNo', 'traceAll', 'traceNo', 'resultFlag', 'resultDesc', 'feeAmt', 'cupsFee', 'inFee', 'otherFee', 'rate', 'repairAmt', 'unrepairAmt', 'uperrAmt', 'dcFlag', 'recCreateTime', 'recUpdTime', 'settleBrhName', 'settleBrhId', 'txNum', 'txAmt'],
                            xs: ['inDate', 'batchNo', 'traceAll', 'traceNo', 'resultFlag', 'resultDesc', 'feeAmt', 'cupsFee', 'inFee', 'otherFee', 'rate', 'repairAmt', 'unrepairAmt', 'uperrAmt', 'dcFlag', 'recCreateTime', 'recUpdTime', 'settleBrhName', 'settleBrhId', 'settleAmt', 'txAmt', 'txNum'],
                            sm: ['inDate', 'batchNo', 'traceAll', 'traceNo', 'resultFlag', 'resultDesc', 'feeAmt', 'cupsFee', 'inFee', 'otherFee', 'rate', 'repairAmt', 'unrepairAmt', 'uperrAmt', 'dcFlag', 'recCreateTime', 'recUpdTime', 'settleBrhName', 'settleBrhId', 'settleAmt'],
                            md: ['inDate', 'batchNo', 'traceAll', 'traceNo', 'resultFlag', 'resultDesc', 'feeAmt', 'cupsFee', 'inFee', 'otherFee', 'rate', 'repairAmt', 'unrepairAmt', 'uperrAmt', 'dcFlag', 'recCreateTime', 'recUpdTime', 'settleBrhName', 'settleBrhId'],
                            ld: ['inDate', 'batchNo', 'traceAll', 'traceNo', 'resultFlag', 'resultDesc', 'feeAmt', 'cupsFee', 'inFee', 'otherFee', 'rate', 'repairAmt', 'unrepairAmt', 'uperrAmt', 'dcFlag', 'recCreateTime', 'recUpdTime']
                        }
                    },

                    colModel: [
                        {name:         'id', index:         'id', editable: true, sortable: false, hidden:true},  //ID
                        {name:         'settleDate', index:         'settleDate', editable: true, sortable: false, search: true,
                            width:75, fixed: true,
                            searchoptions: {
                                dataInit : function (elem) {
                                    $(elem).datepicker( {autoclose: true, format: "yyyymmdd"} );
                                },
                                sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge']
                            }
                        },  // 清算日期
                        {name:         'inDate', index:         'inDate', editable: true, sortable: false},  // 入账日期
                        {name:         'txDate', index:         'txDate', editable: true, sortable: false, width:75, fixed: true},  // 交易月份
                        {name:         'batchNo', index:         'batchNo', editable: true, sortable: false},  // 批次号
                        {name:         'traceAll', index:         'traceAll', editable: true, sortable: false},  // 总流水
                        {name:         'traceNo', index:         'traceNo', editable: true, sortable: false},  // 流水号
                        {name:         'resultFlag', index:         'resultFlag', editable: true, sortable: false, formatter: resultFlagFormatter},  // 结果标示(0-入账成功，1-入账失败，2-未处理)
                        {name:         'resultDesc', index:         'resultDesc', editable: true, sortable: false},  // 清算处理描述
                        {name:         'txNum', index:         'txNum', editable: true, sortable: false},  // 交易总笔数
                        {name:         'txAmt', index:         'txAmt', editable: true, sortable: false, formatter: Opf.currencyFormatter},  // 交易总金额
                        {name:         'feeAmt', index:         'feeAmt', editable: true, sortable: false, formatter: Opf.currencyFormatter},  // 手续费金额
                        {name:         'baseAmt', index:        'baseAmt', editable: false, sortable: false, hidden: true}, //baseAmt
                        {name:         'cupsFee', index:         'cupsFee', editable: true, sortable: false, formatter: Opf.currencyFormatter},  // 第三方手续费
                        {name:         'inFee', index:         'inFee', editable: true, sortable: false},  // 手续费净额
                        // {name:         'otherFee', index:         'otherFee', editable: true, formatter: Opf.currencyFormatter},  // 其它费用
                        {name:         'rate', index:         'rate', editable: true, sortable: false},  // 手续费净额扣率
                        {name:         'repairAmt', index:         'repairAmt', editable: true, sortable: false, formatter: Opf.currencyFormatter},  // 补账金额
                        {name:         'unrepairAmt', index:         'unrepairAmt', editable: true, sortable: false, formatter: Opf.currencyFormatter},  // 补账处理后继续清算金额
                        {name:         'uperrAmt', index:         'uperrAmt', editable: true, sortable: false, formatter: Opf.currencyFormatter},  // 上周期入账失败金额
                        // {name:         'dcFlag', index:         'dcFlag', editable: true},  // 借贷标示(D-贷，C-借)
                        {name:         'settleAmt', index:         'settleAmt', editable: true, sortable: false, formatter: Opf.currencyFormatter},  // 分润金额
                        {name:         'settleBrhId', index:         'settleBrhId', search: true, editable: true, sortable: false,
                            _searchType:'string'

                        },  // 清算机构号
                        {name:         'settleBrhName', index:        'settleBrhName', search: true, editable:true,
                            _searchType:'string'
                        },
                        {name:         'recCreateTime', index:         'recCreateTime', editable: true},  // 记录创建时间
                        {name:         'recUpdTime', index:         'recUpdTime', editable: true}  // 记录修改时间

                    ],

                    subGrid: true,

                    subGridOptions: {
                        "plusicon"  : "icon icon-caret-right",
                        "minusicon" : "icon icon-caret-down",
                        // "openicon"  : "ui-icon-arrowreturn-1-e",
                        // load the subgrid data only once
                        // and the just show/hide
                        "reloadOnExpand" : false,
                        // select the row when the expand column is clicked
                        "selectOnExpand" : true
                    },

                    subGridRowExpanded: function(subgrid_id, row_id) {
                        var subgrid_table_id, pager_id;
                        subgrid_table_id = subgrid_id+"_t";
                        pager_id = "p_"+subgrid_table_id;
                        $("#"+subgrid_id).html("<table id='"+subgrid_table_id+"' class='scroll'></table><div id='"+pager_id+"' class='scroll'></div>");

                        var r = $(this)._getRecordByRowId(row_id);

                        if(!r.txDate || !r.settleBrhId) {
                            return;
                        }

                        App.Factory.createJqGrid({
                            rowNum: 20,//坤哥说最多11，那这里设22，保证取满，不用分页
                            serializeGridData: function (postData) {
                                postData.txDate = r.txDate;
                                postData.settleBrhId = r.settleBrhId;
                                return $.extend({}, postData, {
                                    txDate: r.txDate,
                                    settleBrhId: r.settleBrhId
                                });
                            },
                            rsId: subgrid_table_id,//TODO 临时，反正不涉及权限
                            tableRenderTo: "#"+subgrid_table_id,
                            actionsCol: false,
                            className: 'sub-grid',
                            nav: false,
                            toppager: false,
                            url: url._('branch.settle.sub.details'),
                            colNames: {
                                tradeMonth: '交易月份',
                                tradeAmt: '交易金额',
                                tradeNum: '交易笔数',

                                profitAmt: '分润金额',
                                baseRate: '基准费率',
                                profitRatio: '分润比例（%）',
                                feeAmt: '商户手续费',
                                classRemark: '分类描述'
                            },

                            responsiveOptions: {
                                hidden: {
                                    ss: ['tradeAmt', 'profitAmt', 'profitRatio', 'baseRate'],
                                    xs: [ 'profitAmt', 'profitRatio', 'baseRate'],
                                    sm: [ 'profitRatio', 'baseRate'],
                                    md: [ 'baseRate'],
                                    ld: []
                                }
                            },
                            colModel: [
                                {name:'tradeMonth', sortable: false},//交易月份
                                {name:'tradeNum', sortable: false},//交易笔数
                                {name:'tradeAmt', sortable: false},//交易金额
                                {name:'profitAmt', sortable: false},//分润金额
                                {name:'profitRatio', sortable: false},//分润比例
                                {name:'baseRate', sortable: false},//基准费率
                                {name:'feeAmt', sortable: false},//商户手续费
                                {name:'classRemark', sortable: false}//分类描述
                            ]
                        });
                    },


                    onInitGrid: function() {
                        // console.log($(grid).jqGrid('getGridParam', 'postData'))
                    },

                    loadComplete: function(row) {

                        // var $select = $('#select-for-view-data');

                        // var xxx = $select.val();

                        // $.each(row.content, function(key,value){
                        //     if(value.resultFlag === xxx) {
                        //         $('#' + value.id).hide();
                        //     }
                        // });
                        // console.log('>>>>>>loadComplete function doing ');
                    }
                }));


                // setTimeout(function () {

                //     grid.navButtonAdd('#pg_branch-settle-details-grid-table_toppager', {
                //         caption: "", //
                //         name: "doRefresh",
                //         buttonicon: "icon-refresh white",
                //         onClickButton: function() {
                //             $(grid).trigger("reloadGrid", [{page:1}]);
                //         },
                //         position: "last" //first
                //     });
                // }, 10);


                // setTimeout(function(){

                //     $($('#branch-settle-details-grid-table_toppager_left').find('tr')).append('<td><select id="select-for-view-data"><option value="9">不参与清算</option><option value="8">参与清算</option><option value="">显示全部</option></select></td>');

                //     var $select = $('#select-for-view-data');
                //     $select.on('change', function(){
                //         var postData = $(grid).jqGrid('getGridParam', 'postData');

                //         if($(this).val()) {
                //             var resultFlag = $(this).val();
                //             var filters = JSON.stringify({groupOp:"AND",rules:[{field:"resultFlag",op:"eq",data:resultFlag}]});
                //             postData.filters = filters;

                //         } else {
                //             delete postData.filters;
                //             $(grid).jqGrid('setGridParam', {search: false});

                //         }
                //         $(grid).jqGrid('setGridParam', { search: true, postData: postData} );
                //         $(grid).trigger("reloadGrid", [{page:1}]);
                //     });

                //     $select.trigger('change');


                // }, 500);

                // setTimeout(function() {

                //     $(window).on('resize',function(){
                //         var scrollWidth = $(this).width();
                //         var $right = $('#branch-settle-details-grid-table_toppager_right');
                //         if(scrollWidth<400){
                //             $right.hide();
                //         }else{
                //             $right.show();
                //         }
                //     });

                //     $(window).trigger('resize');

                // },1);





            }

        });

    });



    function getJoinOrNotJoinAjax(grid) {
        // $(grid).search = true;
        // var postData = $(grid).jqGrid('getGridParam', 'postData');
        // postData.ideagood = '10086';
        // $(grid).jqGrid('setGridParam', postData);
        // console.log($(grid).jqGrid('getGridParam', 'postData'));
        // postData.search = true;
        // console.log(postData.filters);
        // var filters = {
        //     "groupOp":"AND",
        //     "rules":[{"field":"settleDate","op":"eq","data":"20140404"}]
        // };
        // postData.filters = filters;
        // $(grid).trigger("reloadGrid", [{page:1}]);
        // console.log(postData);
        // console.log(filters);
        // $(grid).trigger("reloadGrid", [{ideagood:'10010'}]);
        // return;


        // var id1 = $(grid).jqGrid('getGridParam', 'selarrrow')[0];
        // var id2 = $(grid).jqGrid('getGridParam', 'selrow');

        // console.log('id11111111111111:  ', id1);
        // console.log('id22222222222222:  ', id2);return;



        var rowData = grid._getRecordByRowId(Opf.Grid.getSelRowId(grid));
        var resultFlag = rowData.resultFlag;
        var id = rowData.id;
        var nextUrl = '';

        if(resultFlag !== '9' && resultFlag !== '8') {
            return;
        }

        if(resultFlag === '8') {
            resultFlag = '9';
            nextUrl = '/nonparticipation';

        } else {
            resultFlag = '8';
            nextUrl = '/participation';

        }


        $.ajax({
            url: 'api/settle/branch-settle-details/' + id + nextUrl,
            type: 'PUT',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({id: id, resultFlag: resultFlag}),
            success: function(resp) {
                $(grid).trigger("reloadGrid", [{current:true}]);
                if(resp.success) {
                    if(resp.data) {
                        Opf.Toast.success(resp.data);
                    } else {
                        Opf.Toast.success('操作成功');

                    }
                }
                console.log(resp);
            }
        });
    }




    function resultFlagFormatter(val) {
        return RESULTFLAG_MAP[val] || '';
    }



    return App.SettleApp.BranchSettleDetails.List.View;

});