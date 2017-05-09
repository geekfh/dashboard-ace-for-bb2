/**
 * @author hefeng
 * @version OMS-Dev2.1.25
 * @date 2015/12/15
 * @description 商机查询
 */
define([
    'App', 'jquery.jqGrid'
], function(App) {
    var tableCtTpl = [
        '<div class="row">',
            '<div class="col-xs-12 jgrid-container">',
                '<table id="operate-business-grid-table"></table>',
                '<div id="operate-business-grid-pager" ></div>',
            '</div>',
        '</div>'].join('');

    var ORDER_STATUS_MAP = {
        "0": "待接单",
        "1": "已接单",
        "2": "已完成",
        "3": "已失效",
        "4": "已取消",
        "5": "已评价",
        "6": "系统取消",
        "7": "待确认"
    };

    function viewMcht(me, rowData) {
        if (rowData.phoneNo == null) {
            Opf.alert('商机提交人电话为空.');
            return false;
        }
        Opf.ajax({
            type: 'GET',
            url: url._('operate.business.user', {id: rowData.phoneNo}),
            success: function (resp) {
                var data = resp.data;
                if (resp.status == 1) {
                    var html = ['<form style="width: 400px; height: 500px;">',
                        '<label class="col-md-3 control-label" style="padding: 10px 2px 10px 10px;">姓名:</label><label style="padding: 10px;">' + data.name + '</label><br/>',
                        '<label class="col-md-3 control-label" style="padding: 10px 2px 10px 10px;">手机号:</label><label style="padding: 10px;">' + data.phoneNo + '</label><br/>',
                        '<label class="col-md-3 control-label" style="padding: 10px 2px 10px 10px;">身份证号码:</label><label style="padding: 10px;">' + data.idCard + '</label><br/>',
                        '<label class="col-md-3 control-label" style="padding: 10px 2px 10px 10px;">收款银行:</label><label style="padding: 10px;">' + data.acctBankNm + '</label><br/>',
                        '<label class="col-md-3 control-label" style="padding: 10px 2px 10px 10px;">收款账号:</label><label style="padding: 10px;">' + data.acctNo + '</label><br/>',
                        '<label class="col-md-3 control-label" style="padding: 10px 2px 10px 10px;">银行地区:</label><label style="padding: 10px;">' + data.bankRegionName + '</label><br/>',
                        '<label class="col-md-3 control-label" style="padding: 10px 2px 10px 10px;">支行名称:</label><label style="padding: 10px;">' + data.acctZbankNm + '</label>',
                        '</form>'].join('');
                    var $dialog = Opf.Factory.createDialog(html, {
                        title: '查看用户信息',
                        destroyOnClose: true,
                        autoOpen: true,
                        width: 450,
                        height: 480,
                        modal: true,
                        buttons: [{
                            type: 'cancel',
                            text: '取消'
                        }]
                    });
                } else {
                    Opf.alert(resp.msg);
                }
            },
        });
    }

    var opporStatusFormatter = function(value){
        return value? ORDER_STATUS_MAP[value]:"";
    };

    return Marionette.ItemView.extend({
        template: _.template(tableCtTpl),
        tabId: 'menu.operate.business',

        onRender: function () {
            var me = this;
            _.defer(function () {
                me.renderGrid();
            });
        },

        renderGrid: function () {
            var me = this;
            var grid = App.Factory.createJqGrid({
                rsId: 'operate.business',
                caption: '商机查询',
                filters: [
                    {
                        caption: '搜索',
                        defaultRenderGrid: false,
                        canSearchAll: true,
                        canClearSearch: true,
                        components: [
                            {
                                label: '商机联系人电话',
                                name: 'contactPhone',
                                options: {
                                    sopt: ['eq']
                                }
                            },
                            {
                                label: '商机接单人电话',
                                name: 'receivorPhone',
                                options: {
                                    sopt: ['eq']
                                }
                            },
                            {
                                label: '商机提交人电话',
                                name: 'submitPhone',
                                options: {
                                    sopt: ['eq']
                                }
                            },
                            {
                                label: '提交时间',
                                name: 'submitTime',
                                type: 'rangeDate'
                            },
                            {
                                label: '接单时间',
                                name: 'grabTime',
                                type: 'rangeDate'
                            },
                            {
                                label: '商机状态',
                                name: 'orderStatus',
                                type: 'select',
                                options: {
                                    sopt: ['eq'],
                                    value: ORDER_STATUS_MAP
                                }
                            }
                        ],
                        searchBtn: {
                            text: '搜索'
                        }
                    }
                ],
                nav: { actions: { search: false, add: false } },
                actionsCol: { edit: false, del: false ,
                    extraButtons: [
                        {
                            name: 'viewMcht',
                            icon: 'icon-male',
                            title: '查看用户信息',
                            click: function (name, opts, rowData) {
                                viewMcht(me, rowData);
                            }
                        }
                ]
                },
                gid: 'operate-business-grid',
                url: url._('operate.business.search'),
                colNames: {
                    id: 'ID',
                    orderNo: '订单号',
                    typeName: '商机类型',
                    contactName: '商机联系人姓名',
                    contactPhone: '商机联系人电话',
                    orderStatus: '商机状态',
                    province: '商机省份',
                    receivorName: '商机接单人姓名',
                    receivorPhone: '商机接单人电话',
                    opporSource: '商机来源',
                    submitTime: '商机提交时间',
                    grabTime: '商机接单时间',
                    phoneNo: '商机提交人电话',
                    amount: '奖励金额'
                },
                colModel: [
                    {name: 'id', hidden:true},
                    {name: 'orderNo'},
                    {name: 'typeName'},
                    {name: 'contactName'},
                    {name: 'contactPhone'},
                    {name: 'orderStatus', formatter: opporStatusFormatter},
                    {name: 'province'},
                    {name: 'receivorName'},
                    {name: 'receivorPhone'},
                    {name: 'opporSource'},
                    {name: 'submitTime'},
                    {name: 'grabTime'},
                    {name: 'phoneNo'},
                    {name: 'amount'}
                ]
            });
        }
    });
});