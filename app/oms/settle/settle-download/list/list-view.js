/**
 * @created 2014-5-29
 */
define(['App',
    'tpl!app/oms/settle/settle-download/list/templates/brhfee-download.tpl',
    'i18n!app/oms/common/nls/settle',
    'bootstrap',
    'jquery.jqGrid',
    'bootstrap-datepicker'
], function(App, downloadTpl, settleLang) {

    var RESULTFLAG_MAP = {
        '0': '入账成功',
        '1': '入账失败',
        '2': '已汇总未付款',
        '3': '直接插入入账错误表进行手工清算',
        '8': '已人工选择可付款',
        '9': '初始化待选择'
    };

    App.module('SettleApp.SettleDownload.List', function(View, App, Backbone, Marionette, $, _) {

        View.SettleDownloads = Marionette.ItemView.extend({
            tabId: 'menu.settle.download',
            template: downloadTpl,

            events: {
                "change .choseReportSel" : "renderSelectedReport"
            },

            renderSelectedReport: function(){
                this.trigger($(".choseReportSel").find('option:selected').attr("value") + ":list");
                // console.log($(".choseReportSel").find('option:selected').attr("value") + ":list");
            },

            onRender: function() {
                var me = this;
                setTimeout(function() {
                    me.renderGrid();
                }, 1);
            },

            renderGrid: function() {
                var me = this;
                
                var grid = App.Factory.createJqGrid({
                    rsId:'brhFee',
                    caption: settleLang._("brh.fee.txt"),
                    download: {
                        url: url._('export.report.brh.fee'),
                        //必须返回对象
                        params: function () {
                            return { filters: me.queryFilters };
                        },
                        queueTask: {//不配置就不在任务队列里生成一项，通常都要配置
                            name: function () {
                                return '代理商结算分润报表';
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
                            beforeShowForm: function(form){
                                
                            }
                        },
                        search: {
                            onSearch: function() {
                                var $grid = $(this), postData = $grid.jqGrid('getGridParam', 'postData');
                                me.queryFilters = postData.filters;
                            }
                        }
                        
                    },
                    gid: 'brhFee',
                    url: url._("report.brh.fee"),
                    colNames: {
                        settleBrhCode: settleLang._("brh.fee.settle.brh.code"),
                        brhName: settleLang._("brh.fee.brh.name"),
                        settleDate: settleLang._("brh.fee.settle.date"),
                        txDate: settleLang._("brh.fee.tx.date"),
                        resultFlag: settleLang._("brh.fee.result.flag"),
                        txAmt: settleLang._("brh.fee.tx.amt"),
                        inDate: settleLang._("brh.fee.in.date"),
                        txNum: settleLang._("brh.fee.tx.num"),
                        feeAmt: settleLang._("brh.fee.fee.amt"),
                        baseAmt: settleLang._("brh.fee.base.amt"),
                        settlefee: settleLang._("brh.fee.settlefee"),
                        rate: settleLang._("brh.fee.rate"),
                        settleAmt: settleLang._("brh.fee.settle.amt"),
                        repairAmt: settleLang._("brh.fee.repair.amt"),
                        uprepairAmt: settleLang._("brh.fee.uprepair.amt"),
                        uperrAmt: settleLang._("brh.fee.uperr.amt"),
                        pk: settleLang._("brh.fee.pk")
                    },

                    responsiveOptions: {
                        hidden: {
                            ss: ['settleBrhCode', 'txDate','resultFlag', 'txAmt','inDate','txNum','feeAmt','baseAmt','settlefee','rate', 'settleAmt','repairAmt','uprepairAmt','uperrAmt'],
                            xs: ['resultFlag', 'txAmt','inDate','txNum','feeAmt','baseAmt','settlefee','rate','repairAmt','uprepairAmt','uperrAmt'],
                            sm: ['resultFlag', 'txAmt','inDate','txNum','feeAmt','baseAmt','settlefee','rate','repairAmt','uprepairAmt','uperrAmt'],
                            md: ['resultFlag', 'txAmt','inDate','txNum','feeAmt','baseAmt','settlefee','rate','repairAmt','uprepairAmt','uperrAmt'],
                            ld: ['resultFlag', 'inDate','txNum','baseAmt','rate','repairAmt','uprepairAmt','uperrAmt']
                        }
                    },

                    colModel:[
                        {name: 'settleDate',             index: 'settleDate', search: true,
                        searchoptions: {
                            dataInit : function (elem) {
                                $(elem).datepicker({autoclose: true,format: 'yyyymmdd'});
                            },
                            sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge']
                        }},
                        //代理商ID
                        {name: 'settleBrhCode',             index: 'settleBrhCode', search: true, formatter: settleBrhCodeFormatter,searchoptions : {sopt : [ 'eq']}},
                        {name: 'brhName',             index: 'brhName', search: true},
                        {name: 'txDate',             index: 'txDate', search: true,
                        searchoptions: {
                            dataInit : function (elem) {
                                $(elem).datepicker({autoclose: true,format: 'yyyymmdd'});
                            },
                            sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge']
                        }, formatter: txDateFormatter},
                        {name: 'resultFlag',             index: 'resultFlag', formatter: resultFlagFormatter},
                        {name: 'txAmt',             index: 'txAmt', search: true,searchoptions : {sopt : [ 'eq']}},
                        {name: 'inDate',             index: 'inDate'},
                        {name: 'txNum',             index: 'txNum'},
                        {name: 'feeAmt',             index: 'feeAmt', search: true,searchoptions : {sopt : [ 'eq']}},
                        {name: 'baseAmt',             index: 'baseAmt'},
                        {name: 'settlefee',             index: 'settlefee', search: true},
                        {name: 'rate',             index: 'rate'},
                        {name: 'settleAmt',             index: 'settleAmt', search: true},
                        {name: 'repairAmt',             index: 'repairAmt', search: true},
                        {name: 'uprepairAmt',             index: 'uprepairAmt'},
                        {name: 'uperrAmt',             index: 'uperrAmt'},
                        {name: 'pk',             index: 'pk', hidden: true, viewable: false}
                    ]
                });              

                setTimeout(function() {
                    var td = ['<td>',
                                '<div class="choseReport">',
                                    '<span>选择报表 </span>',
                                    '<select class="ui-pg-selbox choseReportSel" role="listbox">',
                                    '<option role="option" value="brhFee" selected="true">代理商结算分润报表</option>',
                                    '<option role="option" value="mchtDetail">商户交易明细报表</option>',
                                    '<option role="option" value="batchPayment">批量支付报表</option>',
                                    '</select>',
                                '</div>',
                              '</td>'
                             ].join('');
                    me.$el.find('.icon-download').closest("tr").append($(td));
                    
                }, 100);
            }

        });

    });

    function settleBrhCodeFormatter(cellvalue, options, rowObject){
        return rowObject.pk.settleBrhCode || '';
    }

    function txDateFormatter(cellvalue, options, rowObject){
        return rowObject.pk.txDate || '';
    }

    function resultFlagFormatter(cellvalue, options, rowObject){
        return RESULTFLAG_MAP[cellvalue];
    }
    return App.SettleApp.SettleDownload.List;

});