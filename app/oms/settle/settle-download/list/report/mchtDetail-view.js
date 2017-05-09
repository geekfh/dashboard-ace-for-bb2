/**
 * @created 2014-5-29
 */
define(['App',
    'tpl!app/oms/settle/settle-download/list/templates/mchtdetail-download.tpl',
    'i18n!app/oms/common/nls/settle',
    'bootstrap',
    'jquery.jqGrid',
    'bootstrap-datepicker'
], function(App, downloadTpl, settleLang) {

    App.module('SettleApp.SettleDownload.List', function(View, App, Backbone, Marionette, $, _) {

        View.mchtDetailReport = Marionette.ItemView.extend({
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
                    rsId:'mcthDetail',
                    caption: settleLang._("mcht.detail.txt"),
                    download: {
                        url: url._('export.report.mcht.detail'),
                        //必须返回对象
                        params: function () {
                            return { filters: me.queryFilters };
                        },
                        queueTask: {//不配置就不在任务队列里生成一项，通常都要配置
                            name: function () {
                                return '商户交易明细报表';
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
                    gid: 'mchtDetail',
                    url: url._("report.mcht.detail"),
                    colNames: {
                        mchtNo: settleLang._("mcht.detail.mch.no"),
                        mchtName: settleLang._("mcht.detail.mcht.name"),
                        txName: settleLang._("mcht.detail.tx.name"),
                        txAmt: settleLang._("mcht.detail.tx.amt"),
                        feeType: settleLang._("mcht.detail.fee.type"),
                        feeValue: settleLang._("mcht.detail.fee.value"),
                        feeAmt: settleLang._("mcht.detail.fee.amt"),
                        feeSettle: settleLang._("mcht.detail.fee.settle"),
                        cupFee: settleLang._("mcht.detail.cup.fee"),
                        outAmt: settleLang._("mcht.detail.out.amt"),
                        inAmt: settleLang._("mcht.detail.in.amt"),
                        traceNo: settleLang._("mcht.detail.trace.no"),
                        acNo: settleLang._("mcht.detail.ac.no"),
                        txDateTime: settleLang._("mcht.detail.tx.date.time"),
                        settleDate: settleLang._("mcht.detail.settle.date"),
                        stat: settleLang._("mcht.detail.stat"),
                        iboxNo: settleLang._("mcht.detail.ibox.no"),
                        orderNo: settleLang._("mcht.detail.order.no"),
                        sysRefNum: settleLang._("mcht.detail.sys.ref.num"),
                        termNo: settleLang._("mcht.detail.term.no"),
                        txnMchtNo: settleLang._("mcht.detail.txn.mcht.no"),
                        brhCode: settleLang._("mcht.detail.brh.code"),
                        brhName: settleLang._("mcht.detail.brh.name"),
                        discCycle: settleLang._("mcht.detail.disc.cycle"),
                        cupsNo: settleLang._("mcht.detail.cups.no")
                    },

                    responsiveOptions: {
                        hidden: {
                            ss: ['mchtNo','txName','txAmt','feeType','feeValue','feeAmt','feeSettle','cupFee','outAmt','inAmt','traceNo','acNo','txDateTime','stat','iboxNo','orderNo','sysRefNum','termNo','txnMchtNo','brhCode','brhName','discCycle','cupsNo'],
                            xs: ['txName','txAmt','feeType','feeValue','feeAmt','feeSettle','cupFee','inAmt','traceNo','acNo','txDateTime','stat','iboxNo','orderNo','sysRefNum','termNo','txnMchtNo','brhCode','brhName','discCycle','cupsNo'],
                            sm: ['txName','txAmt','feeType','feeValue','feeAmt','feeSettle','cupFee','inAmt','traceNo','acNo','txDateTime','stat','iboxNo','orderNo','sysRefNum','termNo','txnMchtNo','brhCode','brhName','discCycle','cupsNo'],
                            md: ['txName','txAmt','feeType','feeValue','feeAmt','feeSettle','cupFee','inAmt','traceNo','acNo','txDateTime','stat','iboxNo','orderNo','sysRefNum','termNo','txnMchtNo','brhCode','brhName','discCycle','cupsNo'],
                            ld: ['txName','feeType','feeValue','feeSettle','cupFee','inAmt','acNo','stat','iboxNo','orderNo','termNo','txnMchtNo','brhCode','brhName','discCycle','cupsNo']
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
                        {name: 'mchtNo',             index: 'mchtNo', search: true},
                        {name: 'mchtName',             index: 'mchtName', search: true},
                        {name: 'sysRefNum',             index: 'sysRefNum', search: true},
                        {name: 'txDateTime',             index: 'txDateTime', search: true,
                        searchoptions: {
                            dataInit : function (elem) {
                                $(elem).datepicker({autoclose: true,format: 'yyyymmdd'});
                            },
                            sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge']
                        }},
                        {name: 'traceNo',             index: 'traceNo', search: true},
                        {name: 'txName',             index: 'txName'},
                        {name: 'txAmt',             index: 'txAmt', search: true},
                        {name: 'feeType',             index: 'feeType'},
                        {name: 'feeValue',             index: 'feeValue'},
                        {name: 'feeAmt',             index: 'feeAmt', search: true},
                        {name: 'feeSettle',             index: 'feeSettle'},
                        {name: 'cupFee',             index: 'cupFee'},
                        {name: 'outAmt',             index: 'outAmt', search: true},
                        {name: 'inAmt',             index: 'inAmt'},
                        {name: 'acNo',             index: 'acNo', search: true},
                        {name: 'stat',             index: 'stat'},
                        {name: 'iboxNo',             index: 'iboxNo'},
                        {name: 'orderNo',             index: 'orderNo', search: true},
                        {name: 'termNo',             index: 'termNo'},
                        {name: 'txnMchtNo',             index: 'txnMchtNo'},
                        {name: 'brhCode',             index: 'brhCode', search: true},
                        {name: 'brhName',             index: 'brhName', search: true},
                        {name: 'discCycle',             index: 'discCycle', search: true},
                        {name: 'cupsNo',             index: 'cupsNo', search: true}
                    ]
                });              

                setTimeout(function() {
                    var td = ['<td>',
                                '<div class="choseReport">',
                                    '<span>选择报表 </span>',
                                    '<select class="ui-pg-selbox choseReportSel" role="listbox">',
                                    '<option role="option" value="brhFee">代理商结算分润报表</option>',
                                    '<option role="option" value="mchtDetail" selected="true">商户交易明细报表</option>',
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

    return App.SettleApp.SettleDownload.List;

});