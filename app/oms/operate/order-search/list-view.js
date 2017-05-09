define([
    'tpl!app/oms/operate/order-search/templates/table-ct.tpl',
    'tpl!app/oms/operate/order-search/templates/order-deal.tpl',
    'jquery.jqGrid',
    'bootstrap-datepicker',
    'moment.origin'
], function(tpl,orderDealTpl) {
    var STATUS_MAP = {
        '0': '未处理',
        '1': '已处理',
        '2': '已受理-走退款流程',
        '3': '已受理-原交易未扣款或已冲正'
    };
    var Grid;
    var View = Marionette.ItemView.extend({
        tabId: 'menu.order.search',
        template: tpl,

        events: {

        },

        initialize: function () {

        },

        onRender: function() {
            var me = this;

            _.defer(function () {
                me.renderGrid();
            });

        },

        renderGrid: function() {
            var me = this;
            var grid = App.Factory.createJqGrid({
                rsId:'operate.order.search',
                caption: '表头',
                download: {
                    url: url._('order.search.download'),
                    //必须返回对象
                    params: function () {
                        var postData = $(grid).jqGrid('getGridParam', 'postData');
                        return {filters: postData.filters};
                    },
                    queueTask: {//不配置就不在任务队列里生成一项，通常都要配置
                        name: function () {
                            return '工单查询';
                        }
                    }
                },
                actionsCol: {
                    // width: Opf.Config._('ui', 'stlmError.grid.form.actionsCol.width'),   //130,
                    del: false,
                    edit: false,
                    extraButtons: [
                        {name: 'work', title:'处理', icon: 'icon-opf-process-account icon-opf-process-account-color', click: function() {
                            var rowData = grid._getRecordByRowId(Opf.Grid.getSelRowId(grid));
                            dealOrder(rowData.id);
                        }}
                    ],
                    canButtonRender: function(name, opts, rowData) {
                        // return true;
                        // 只有在已处理的情况下才可以显示处理按钮
                        if(name === 'work' && rowData.status != 0) {
                            return false;
                        }
                    }
                },
                nav: {
                    actions: {
                        add: false
                    }
                },
                gid: 'order-search-grid',
                url: url._('order.search'),
                colNames: {
                    id: '', //id
                    orderId: '订单号',
                    txTime: '订单交易时间',
                    status: '工单状态',
                    ibox42: '商户编号',
                    ibox43: '商户名称',
                    mchtUserName: '商户用户名称',
                    customerName: '联系人姓名',
                    customerMobileNo: '联系人电话',
                    remark: '异常原因备注',
                    createTime: '工单提及时间',
                    txnAccountNo: '卡号',
                    txnAmt: '订单交易金额',
                    fd42: '通道商户号',
                    fd43: '通道商户名',
                    batchNo: '批次号',
                    fd11: '流水号'
                },

                colModel: [
                    {name: 'id',     index: 'id',     sortable: false, hidden: true},  //id
                    {name: 'orderId', index: 'orderId', sortable: false, search: true},  //订单号
                    {name: 'txTime', index: 'txTime', sortable: false, search: true, width: 180, formatter: timeFormatter,
                        searchoptions: {
                            dataInit : function (elem) {
                                $(elem).datepicker({autoclose: true,format: 'yyyymmdd'});
                            },
                            sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge']
                        }
                    },  //订单交易时间
                    {name: 'status', index: 'status', sortable: false, formatter: statusFormatter,search: true,
                        stype: 'select',
                        searchoptions: {
                            sopt: ['eq'],
                            value: STATUS_MAP
                        }},  //工单状态
                    {name: 'ibox42', index: 'ibox42', sortable: false, search: true},  //商户编号
                    {name: 'ibox43', index: 'ibox43', sortable: false, search: true},  //商户名称
                    {name: 'mchtUserName', index: 'mchtUserName', sortable: false},  //商户用户名称
                    {name: 'customerName', index: 'customerName', sortable: false},  //联系人姓名
                    {name: 'customerMobileNo', index: 'customerMobileNo', sortable: false},  //联系人电话
                    {name: 'remark', index: 'remark', sortable: false},  //异常原因备注
                    {name: 'createTime', index: 'createTime', sortable: false, width: 180, formatter: timeFormatter},  //工单提及时间
                    {name: 'txnAccountNo', index: 'txnAccountNo', sortable: false, hidden: true},  //卡号
                    {name: 'txnAmt', index: 'txnAmt', sortable: false, hidden: true},  //订单交易金额
                    {name: 'fd42', index: 'fd42', sortable: false, hidden: true},  //通道商户号
                    {name: 'fd43', index: 'fd43', sortable: false, hidden: true},  //通道商户名
                    {name: 'batchNo', index: 'batchNo', sortable: false, hidden: true},  //批次号
                    {name: 'fd11', index: 'fd11', sortable: false, hidden: true}  //流水号
                ]
            });
            Grid = grid;
        }

    });

    function timeFormatter (value) {
        return value ? Opf.String.replaceFullDate(value, '$1-$2-$3 $4:$5:$6') : '';
    }

    function statusFormatter (value) {
        return value ? STATUS_MAP[value] : '';
    }

    function dealOrder(rowId) {
        var dealUrl = url._('order.search.deal');
        var $dialog = Opf.Factory.createDialog(orderDealTpl(), {
            destroyOnClose: true,
            title: '处理',
            autoOpen: true,
            width: 400,
            height: 250,
            modal: true,
            buttons: [{
                type: 'submit',
                click: function (e) {
                    var valid = $(this).find('form').valid();

                    if(valid) {
                        var $button = $($(e.target).closest('button'));
                        $button.addClass('disabled').find('span.text').html("正在提交...");
                        submitForm(rowId, dealUrl, this);

                    }
                }
            }, {
                type: 'cancel'
            }],
            create: function() {
                Opf.Validate.addRules($(this).find('form'), {
                    rules: {
                        nextDo: {
                            required: true,
                            maxlength: 300
                        }
                    }
                });
            }
        });
    }


    function submitForm(postId, postUrl, dialog) {
        var postData = getFormValues($(dialog).find('form'));
            postData['id'] = postId;
        Opf.ajax({
            url: postUrl,
            type:'PUT',
            jsonData: postData,
            success: function(resp) {
                console.log(resp);
                $(Grid).trigger("reloadGrid", [{current:true}]);
                if(resp.success) {
                    Opf.Toast.success('操作成功');
                }
            },
            error: function(resp) {
                console.log(resp);
            },
            complete: function(resp) {
                $(dialog).dialog('destroy');
            }
        })
    }

    function getFormValues (form) {
        var $form = $(form);
        var resultData = {};
        $form.find(':input').each(function(val) {
            resultData[$(this).attr('name')] = $(this).val();
        });

        return resultData;
    }
    App.on('order:search', function () {
        App.show(new View());
    });

    return View;

});











