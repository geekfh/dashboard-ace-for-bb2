define([
    'tpl!app/oms/operate/txn/templates/txn.tpl',
    'tpl!app/oms/settle/trade-txn/list/templates/detail-dialog.tpl',
    'app/oms/operate/txn/transaction-edit',
    'app/oms/operate/txn/transaction-view',
    'i18n!app/oms/common/nls/settle',
    'assets/scripts/fwk/component/common-search-date',
    'jquery.jqGrid',
    'jquery.validate',
    'bootstrap-datepicker',
    'moment.origin'
], function(tpl, detailDialogTpl, TransactionEdit, Preview, settleLang) {

    var DIR_DISCCYCLE = {
        '0': 'T+0',
        '1': 'T+1',
        '2': 'T+2'
    };

    var STAT_MAP = {
        '0' : settleLang._('trade.txn.stat.0'),  //成功应答
        '1' : settleLang._('trade.txn.stat.1'),  //请求
        '2' : settleLang._('trade.txn.stat.2'),  //已冲正
        '3' : settleLang._('trade.txn.stat.3'),  //已撤销
        '4' : settleLang._('trade.txn.stat.4'),  //已确认
        '5' : settleLang._('trade.txn.stat.5'),  //部分退货
        '6' : settleLang._('trade.txn.stat.6'),  //全部退货
        '7' : settleLang._('trade.txn.stat.7'),   //交易异常
        '9' : '交易取消'
    },

    SUBCODE_MAP = {
        '31,51' : settleLang._('trade.txn.sub.code.31'), //消费
        '30,50' : settleLang._('trade.txn.sub.code.30'), //余额查询
        '32,52' : settleLang._('trade.txn.sub.code.32'), //消费冲正
        '33,53' : settleLang._('trade.txn.sub.code.33'), //消费撤销
        '34,54' : settleLang._('trade.txn.sub.code.34'), //消费撤销冲正
        '35,55' : settleLang._('trade.txn.sub.code.35')  //退货
    };


    var View = Marionette.ItemView.extend({
        tabId: 'menu.operate.txn',
        template: tpl,

        events: {
            'click .btn-preview': 'showPreviewView',
            'click .btn-download': 'downloadPreviewView'
        },

        initialize: function () {

        },

        onRender: function() {
            var me = this;

            _.defer(function () {
                me.renderGrid();
                me.showEditTransaction();
                setTimeout(function() {
                    me.bindMchtNoSingleEvent();
                },1000);
            });

        },

        showPreviewView: function () {
            var data = this.getFormData();
            var view = this.editPreview = new Preview({data: data});
            view.render();
            this.$el.find('.view-right').empty().append(view.$el);
        },

        downloadPreviewView: function () {
            this.transEdit && this.transEdit.submitTrans();

            this.showEditTransaction();
        },

        getFormData: function () {
            var $form = this.$el.find('.edit-left').find('form.edit-txn');
            var result = {};

            $form.find(':input').each(function (index, el) {
                if("radio" == $(el).attr("type")){
                    result[$(el).attr('name')] = $("input[name='"+$(el).attr('name')+"']:checked").val();
                }else{
                    result[$(el).attr('name')] = $(el).val();
                }
            });
            result['reference'] = $('label[name="reference"]').html();

            return result;
        },

        showDetailDialog: function (data) {
            var $el = $(detailDialogTpl({respData: data}));

            Opf.Factory.createDialog($el, {
                destroyOnClose: true,
                title: '查看记录',
                autoOpen: true,
                width: 500,
                height: 550,
                modal: true
            });
        },

        showQiangoudan: function (data) {
            var view = this.transEdit = new TransactionEdit({data: data});
            view.render();
            this.$el.find('.edit-left').empty().append(view.$el);
        },

        showEditTransaction: function (data) {
            if (data) {
                var me = this;
                Opf.ajax({
                    type: 'GET',
                    url: url._('operate.txn.detail', {id: data.id}),
                    success: function (respData) {
                        var resp = respData.content[0] || {};
                        resp.tradeTime = dateFormatter(resp.date) + ' ' + timeFormatter(resp.time);
                        if (resp.acNo) {
                            resp.acNo = resp.acNo.replace(/(\d{6})(.*)(\d{4})/, '$1******$3');
                        }
                        me.showQiangoudan(resp);
                    }

                });

            } else {
                data = {};
                this.showQiangoudan(data);
            }

        },

        gridOptions: function (defaultOptions) {
            return defaultOptions;
        },

        bindMchtNoSingleEvent: function () {
            var $el = this.$el;
            var $filterWrap = $el.find('.filters');

            var $mchtNo = $filterWrap.find('input.ibox42-filter-input').eq(0);
            var $mchtName = $filterWrap.find('input.ibox42-filter-input').eq(1);

            $mchtNo.on('input.mchtchange', function () {
                $mchtName.select2('data', null);
            });

            $mchtName.on('change.mchtchange', function () {
                $mchtNo.val('');
            });
        },

        renderGrid: function() {
            var me = this;
            //小心这个me.gridOptions 函数，历史上存在两个 内容一样的交易流水表（目前只剩下一个），但拥有不同的权限，所以在controller上面会重新覆盖与权限有关的设置，包括rsId/actionsCol/nav等
            var grid = App.Factory.createJqGrid(me.gridOptions({
                    rsId:'operate.txn.export',
                    caption: settleLang._('tradeTxn.txt'),
                    
                    beforeRequest: function () {
                        //如果 filters 参数为空不发请求

                        //这个回调会调用两次，不知道后续逻辑会不会受影响,目前第一次回调的时候
                        //类型是 local 不会发送请求
                        if(!this.p.postData.filters) {
                            return false;
                        }
                    },
                    actionsCol: {
                        width: 100,
                        edit: false,
                        del : false,
                        extraButtons:[
                            {name: 'transaction', caption:'导出签购单',  title:'导出签购单', icon: '', click: function(btn, obj, model) {
                                me.showEditTransaction(model);
                            }}
                        ]
                    },
                    nav: {
                        actions: {
                            add: false,
                            search: false,
                            viewfunc: function (id) {
                                Opf.ajax({
                                    type: 'GET',
                                    url: url._('operate.txn.detail', {id: id}),
                                    success: function (resp) {
                                        me.showDetailDialog(resp);
                                    }

                                });
                            }
                        }
                    },
                    filters: [
                       {
                            caption: '条件过滤',
                            canClearSearch: true,
                            defaultRenderGrid: false,
                            components: [
                                {
                                    type: 'rangeDate',
                                    label: '时间范围',
                                    ignoreFormReset: true,
                                    limitRange: 'month',
                                    limitDate: moment(),
                                    defaultValue: [moment(), moment()],
                                    name: 'date'
                                },{
                                    label: '商户编号',
                                    name: 'ibox42',
                                    options: {
                                        sopt: ['eq']
                                    },
                                    inputmask: {
                                        integer: true
                                    }
                                },{
                                    label: '商户名称',
                                    name: 'ibox42',
                                    type: 'select2',
                                    options: {
                                        sopt: ['eq'],
                                        select2Config: {
                                            placeholder: '搜索商户',
                                            minimumInputLength: 1,
                                            width: 200,
                                            ajax: {
                                                type: 'get',
                                                url: url._('mcht.name'),
                                                dataType: 'json',
                                                data: function (term) {
                                                    return {
                                                        kw: encodeURIComponent(term)
                                                    };
                                                },
                                                results: function (data) {
                                                    return {
                                                        results: data
                                                    };
                                                }
                                            },
                                            id: function (e) {
                                                return e.value;
                                            },
                                            formatResult: function(data){
                                                return data.value + '_' + data.name;
                                            },
                                            formatSelection: function(data){
                                                return data.value + '_' + data.name;
                                            }
                                        },
                                        valueFormat: function (select2Data) {
                                            return select2Data.value;
                                        }
                                    }
                                },{
                                    label: '检索参考号',
                                    name: 'fd37',
                                    options: {
                                        sopt: ['eq']
                                    },
                                    inputmask: {
                                        integer: true
                                    }
                                },{
                                    label: '订单号',
                                    name: 'orderNo',
                                    options: {
                                        sopt: ['eq']
                                    },
                                    inputmask: {
                                        integer: true
                                    }
                                },{
                                    label: '卡号',
                                    name: 'acNo',
                                    options: {
                                        sopt: ['eq']
                                    },
                                    inputmask: {
                                        integer: true
                                    }
                                },{
                                    label: '金额',
                                    name: 'amt',
                                    options:{
                                        sopt: ['eq', 'gt', 'ge', 'lt', 'le'] 
                                    }
                                }
                            ],
                            searchBtn: {
                                text: '过滤'
                            }
                        }
                    ],
                    gid: 'operate-txn-grid',
                    url: url._('txn.transaction'),  //api/settle/trade-water
                    colNames: {
                        id         : settleLang._('trade.txn.id'), //id
                        orderNo    : settleLang._('trade.txn.orderNo'), //订单号

                        // dateAndTime: settleLang._('交易时间'),

                        date:         settleLang._('trade.txn.date'), //交易日期
                        time:         settleLang._('trade.txn.time'), //交易时间
                        traceNo:      settleLang._('trade.txn.traceNo'), //交易凭证号
                        amt:          settleLang._('trade.txn.amt'), //交易金额
                        acNo:         settleLang._('trade.txn.acNo'), //消费卡号
                        iboxNo:       settleLang._('trade.txn.iboxNo'), //终端编号
                        branchName:   settleLang._('trade.txn.branchName'), //机构名称
                        brNo:         settleLang._('trade.txn.brNo'), //机构号
                        ibox43:       settleLang._('trade.txn.ibox43'), //商户名称
                        ibox42:       settleLang._('trade.txn.ibox42'), //商户编号
                        userId:       settleLang._('trade.txn.userId'), //用户编号
                        userName:     settleLang._('trade.txn.userName'), //用户名称
                        userAccNo:    settleLang._('trade.txn.userAccNo'), //用户账号
                        expandName:   settleLang._('trade.txn.expandName'), //拓展员
                        cupsNo:       settleLang._('trade.txn.cupsNo'), //交易渠道
                        cupsName:     settleLang._('trade.txn.cupsName'), //交易渠道
                        cupsMchtNo:   settleLang._('trade.txn.cupsMchtNo'), //渠道商户号
                        cupsMchtName: settleLang._('trade.txn.cupsMchtName'), //渠道商户名
                        name:         settleLang._('trade.txn.name'), //交易类型  
                        subCode:      settleLang._('trade.txn.name'), //subCode  
                        stat:         settleLang._('trade.txn.stat'), //交易状态
                        fdxxx:        settleLang._('trade.txn.fdxxx'), //交易描叙
                        fd37:         settleLang._('trade.txn.fd37'), //检索参考号
                        fd12:         settleLang._('trade.txn.fd12'), //受卡方所在地时间
                        fd13:         settleLang._('trade.txn.fd13'), //受卡方所在地日期
                        fd39:         settleLang._('trade.txn.fd39'),  //'第三方响应码'
                        discCycle:    settleLang._('trade.txn.discCycle'), //结算周期,
                        errStr:    settleLang._('trade.txn.errStr') //失败原因,
                    },

                    responsiveOptions: {
                        hidden: {
                            ss: ['id', 'date', 'traceNo', 'amt', 'acNo', 'iboxNo', 'branchName', 'brNo', 'ibox43', 'ibox42', 'userId', 'userName', 'userAccNo', 'expandName', 'cupsNo', 'cupsName', 'name', 'stat', 'fdxxx', 'fd37', 'fd12', 'fd13'],
                            xs: ['id', 'date', 'acNo', 'iboxNo', 'branchName', 'brNo', 'ibox43', 'ibox42', 'userId', 'userName', 'userAccNo', 'expandName', 'cupsNo', 'cupsName', 'name', 'stat', 'fdxxx', 'fd37', 'fd12', 'fd13'],
                            sm: ['id', 'date', 'acNo', 'iboxNo', 'branchName', 'brNo', 'ibox43', 'ibox42', 'userId', 'userName', 'userAccNo', 'expandName', 'cupsNo', 'cupsName', 'stat', 'fdxxx', 'fd37', 'fd12', 'fd13'],
                            md: ['id', 'date', 'acNo', 'iboxNo', 'branchName', 'brNo', 'ibox43', 'ibox42', 'userId', 'userName', 'userAccNo', 'expandName', 'cupsNo', 'cupsName', 'fdxxx', 'fd37', 'fd12', 'fd13'],
                            ld: ['id', 'date', 'iboxNo', 'branchName', 'brNo', 'ibox42', 'userId', 'userName', 'userAccNo', 'expandName', 'cupsNo', 'cupsName', 'fdxxx', 'fd37', 'fd12', 'fd13']
                        }
                    },

                    colModel: [
                        {name: 'id',            index: 'id',            editable: true, sortable: false, hidden: true},  //id

                        // {name: 'dateAndTime',   index: 'dateAndTime',   editable: false, formatter: dateAndTimeFormatter},

                        {name: 'date',          index: 'date',          editable: true, sortable: false, viewable: false, hidden: true},  //交易日期
                        {name: 'time',          index: 'time',          editable: true, sortable: false, search: true,
                            _searchType:'num', formatter: dateAndTimeFormatter
                        },  //交易时间
                        {name: 'traceNo',       index: 'traceNo',       editable: true, sortable: false, search: true,
                            _searchType:'string'
                        },  //交易凭证号
                        {name: 'orderNo',       index: 'orderNo',       editable: true, sortable: false, search: true,
                            searchoptions: {
                                sopt: ['eq', 'ne', 'lk', 'nlk']
                            }
                        },  //订单号
                        {name: 'amt',           index: 'amt',           editable: true, sortable: false,  search: true,
                            _searchType:'num'
                        },  //交易金额
                        {name: 'name',          index: 'name',          editable: true, sortable: false, search: false },  //交易类型
                        {name: 'subCode',          index: 'subCode',    hidden: true,    editable: false, sortable: false, search: true, viewable: false,
                            stype: 'select',
                            searchoptions: {
                                value: SUBCODE_MAP,
                                sopt: ['in', 'ni']
                            }
                        },  //subCode
                        {name: 'stat',          index: 'stat',          editable: true, sortable: false, formatter: statFormatter, search: true,
                            stype: 'select',
                            searchoptions: {
                                value: STAT_MAP,
                                sopt: ['eq', 'ne']
                            }
                        },  //交易状态
                        {name: 'acNo',          index: 'acNo',          editable: true, sortable: false, search: true,
                            _searchType:'string'
                        },  //消费卡号
                        {name: 'iboxNo',        index: 'iboxNo',        editable: true, sortable: false, search: true,
                            _searchType:'string'
                        },  //终端编号
                        {name: 'branchName',    index: 'branchName',    editable: true, sortable: false, search: true,
                            _searchType:'string'
                        },  //机构名称
                        {name: 'brNo',          index: 'brNo',          editable: true, sortable: false},  //机构号
                        {name: 'ibox43',        index: 'ibox43',        editable: true, sortable: false, search: true,
                            _searchType:'string'
                        },  //商户名称
                        {name: 'ibox42',        index: 'ibox42',        editable: true, sortable: false, search: true,
                            _searchType:'string'
                        },  //商户编号
                        {name: 'userId',        index: 'userId',        editable: true, sortable: false},  //用户编号
                        {name: 'userName',      index: 'userName',      editable: true, sortable: false, search: true,
                            _searchType:'string'
                        },  //用户名称
                        {name: 'userAccNo',     index: 'userAccNo',     editable: true, sortable: false, search: true,
                            _searchType:'string'
                        },  //用户账号
                        {name: 'expandName',    index: 'expandName',    editable: true, sortable: false, search: true,
                            _searchType:'string'
                        },  //拓展员
                        {name: 'cupsNo',        index: 'cupsNo',        editable: true, sortable: false, viewable: false},  //交易渠道号
                        {name: 'cupsName',      index: 'cupsName',      editable: true, sortable: false, search: true, viewable: true,
                            _searchType:'string'
                        },  //交易渠道名称
                        {name: 'cupsMchtNo',      index: 'cupsMchtNo',      editable: false, sortable: false, search: false, viewable: true, hidden: true
                        },  //渠道商户号
                        {name: 'cupsMchtName',      index: 'cupsMchtName',      editable: false, sortable: false, search: false, viewable: true, hidden: true
                        },  //渠道商户名
                        {name: 'fdxxx',         index: 'fdxxx',         editable: true, sortable: false},  //交易描叙
                        {name: 'fd37',          index: 'fd37',          editable: true, sortable: false},  //检索参考号
                        {name: 'fd12',          index: 'fd12',          editable: true, sortable: false},  //受卡方所在地时间
                        {name: 'fd13',          index: 'fd13',          editable: true, sortable: false},  //受卡方所在地日期
                        {name: 'fd39',          index: 'fd39',          editable: true, sortable: false, hidden: true},   //受卡方所在地日期
                        {name: 'discCycle',     index: 'discCycle', sortable: false, formatter: discCycleFormatter},
                        {name: 'errStr',     index: 'errStr', sortable: false, hidden:true, viewable:true, editable:false, search:false} //失败原因
                    ]
                }));
        } 

    });



    function dateAndTimeFormatter(val, options, rowData) {
        return (rowData.date || '') + ' ' + (timeFormatter(rowData.time) || '');
    }

    function timeFormatter(time) {
        return time.replace(/(\d{2})(\d{2})/g,'$1:$2:');
    }

    function dateFormatter(date) {
        return date.replace(/(\d{4})(\d{2})/g,'$1-$2-');
    }

    function statFormatter(val) {
        return STAT_MAP[val] || '';
    }

    function discCycleFormatter(val){
        return DIR_DISCCYCLE[val] || '';
    }

    App.on('operate:txn', function () {
        App.show(new View());
    });


    return View;

});










