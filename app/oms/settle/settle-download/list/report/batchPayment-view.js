/**
 * @created 2014-5-29
 */
define(['App',
    'tpl!app/oms/settle/settle-download/list/templates/batchpayment-download.tpl',
    'i18n!app/oms/common/nls/settle',
    'bootstrap',
    'jquery.jqGrid',
    'bootstrap-datepicker'
], function(App, downloadTpl, settleLang) {

    App.module('SettleApp.SettleDownload.List', function(View, App, Backbone, Marionette, $, _) {

        View.batchPaymentReport = Marionette.ItemView.extend({
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
                    rsId:'batchPayment',
                    caption: settleLang._("batch.payment.txt"),
                    download: {
                        url: url._('export.report.batch.payment'),
                        //必须返回对象
                        params: function () {
                            return { filters: me.queryFilters };
                        },
                        queueTask: {//不配置就不在任务队列里生成一项，通常都要配置
                            name: function () {
                                return '批量支付报表';
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
                    gid: 'batchPayment',
                    url: url._("report.batch.payment"),
                    colNames: {
                        seq: settleLang._("batch.payment.seq"),
                        ibox42: settleLang._("batch.payment.ibox42"),
                        mchtName: settleLang._("batch.payment.mcht.name"),
                        txAmt: settleLang._("batch.payment.tx.amt"),
                        txNum: settleLang._("batch.payment.tx.num"),
                        feeAmt: settleLang._("batch.payment.fee.amt"),
                        repairAmt: settleLang._("batch.payment.repair.amt"),
                        unrepairAmt: settleLang._("batch.payment.unrepair.amt"),
                        uperrAmt: settleLang._("batch.payment.uperr.amt"),
                        creditNum: settleLang._("batch.payment.credit.num"),
                        creditAmt: settleLang._("batch.payment.credit.amt"),
                        creditPercent: settleLang._("batch.payment.credit.percent"),
                        settleAmt: settleLang._("batch.payment.settle.amt"),
                        settleAcctNm: settleLang._("batch.payment.settle.acct.amt"),
                        settleAcct: settleLang._("batch.payment.settle.acct"),
                        zbankName: settleLang._("batch.payment.zbank.name"),
                        inDate: settleLang._("batch.payment.in.date"),
                        settleDate: settleLang._("batch.payment.settle.date"),
                        resultStatus: settleLang._("batch.payment.result.status")
                    },

                    responsiveOptions: {
                        hidden: {
                            ss: ['seq','ibox42','txAmt','txNum','feeAmt','repairAmt','unrepairAmt','uperrAmt','creditNum', 'reditAmt','creditPercent','settleAmt','settleAcctNm','settleAcct','zbankName','inDate','resultStatus','creditAmt'],
                            xs: ['seq','txAmt','txNum','feeAmt','repairAmt','unrepairAmt','uperrAmt','creditNum', 'reditAmt','creditPercent','settleAcctNm','settleAcct','zbankName','inDate','resultStatus','creditAmt'],
                            sm: ['seq','txAmt','txNum','feeAmt','repairAmt','unrepairAmt','uperrAmt','creditNum', 'reditAmt','creditPercent','settleAcctNm','settleAcct','zbankName','inDate','resultStatus','creditAmt'],
                            md: ['seq','txAmt','txNum','feeAmt','repairAmt','unrepairAmt','uperrAmt','creditNum', 'reditAmt','creditPercent','settleAcctNm','settleAcct','zbankName','inDate','resultStatus','creditAmt'],
                            ld: ['seq','txNum','repairAmt','unrepairAmt','uperrAmt','creditNum', 'reditAmt','creditPercent','zbankName','inDate','resultStatus','creditAmt']
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
                        {name: 'seq',             index: 'seq',              hidden: true},
                        {name: 'ibox42',             index: 'ibox42', search: true},
                        {name: 'mchtName',             index: 'mchtName', search: true},
                        {name: 'settleAcctNm',             index: 'settleAcctNm', search: true},
                        {name: 'settleAcct',             index: 'settleAcct', search: true},
                        {name: 'txAmt',             index: 'txAmt', search: true},
                        {name: 'txNum',             index: 'txNum'},
                        {name: 'feeAmt',             index: 'feeAmt', search: true},
                        {name: 'repairAmt',             index: 'repairAmt', search: true},
                        {name: 'unrepairAmt',             index: 'unrepairAmt'},
                        {name: 'uperrAmt',             index: 'uperrAmt'},
                        {name: 'creditNum',             index: 'creditNum'},
                        {name: 'creditAmt',             index: 'creditAmt'},
                        {name: 'creditPercent',             index: 'creditPercent'},
                        {name: 'settleAmt',             index: 'settleAmt', search: true},
                        {name: 'zbankName',             index: 'zbankName'},
                        {name: 'inDate',             index: 'inDate'},
                        {name: 'resultStatus',             index: 'resultStatus'}
                    ]
                });              

                setTimeout(function() {
                    var td = ['<td>',
                                '<div class="choseReport">',
                                    '<span>选择报表 </span>',
                                    '<select class="ui-pg-selbox choseReportSel" role="listbox">',
                                    '<option role="option" value="brhFee">代理商结算分润报表</option>',
                                    '<option role="option" value="mchtDetail">商户交易明细报表</option>',
                                    '<option role="option" value="batchPayment" selected="true">批量支付报表</option>',
                                    '</select>',
                                '</div>',
                              '</td>'
                             ].join('');
                    me.$el.find('.icon-download').closest("tr").append($(td));

                }, 100);
            }

        });

    });

    return App.SettleApp.SettleDownload.List;

});