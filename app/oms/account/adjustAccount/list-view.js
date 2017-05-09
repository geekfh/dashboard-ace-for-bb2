/**
 * Created by wupeiying on 2015/11/10.
 */

define(['App',
    'assets/scripts/fwk/component/common-search-date',
    'jquery.jqGrid',
    'bootstrap-datepicker'
], function (App) {

    var tableTpl = [
        '<div class="row">',
        '<div class="col-xs-12 jgrid-container">',
        '<table id="adjust-account-grid-table"></table>',
        '<div id="adjust-account-grid-pager" ></div>',
        '</div>',
        '</div>'
    ].join('');

    var STATUS_MAP = {
        1: '待审核',
        2: '审核通过',
        3: '审核拒绝'
    };

    var TRADETYPE_MAP = null;

    var View = Marionette.ItemView.extend({
        template: _.template(tableTpl),
        tabId: 'menu.adjustAccount.list',
        onRender: function () {
            var me = this;
            //加载交易类型数据
            Opf.ajax({
                type: 'GET',
                async: false,
                url: url._('adjust.account.tradeType'),
                success: function(resp){
                    var str = '';
                    _.each(resp, function(v ,i){
                        str += v.codeId + ': "' + v.codeName + '",';
                    });
                    str = JSON.stringify('{'+str+'}');
                    TRADETYPE_MAP = JSON.parse(str);
                    TRADETYPE_MAP = eval("("+TRADETYPE_MAP+")");
                }
            });
            _.defer(function () {
                me.renderGrid();
            });
        },
        renderGrid: function () {
            var me = this;
            var grid = this.grid = App.Factory.createJqGrid({
                rsId: 'adjustAccount',
                caption: '调账',
                gid: 'adjust-account-grid',
                url: url._('adjust.account.list'),
                actionsCol: {
                    width: 100,
                    canButtonRender: function (name, options, rowData) {
                        if(name === 'edit' && rowData.status == 2){
                            return false;
                        }
                        if(name == 'manualCheck' && rowData.status == 2){
                            return false;
                        }
                    },
                    extraButtons: [
                        {
                            name: 'manualCheck', icon: 'icon-file-text', title: '审核',
                            click: function (name, opts, rowData) {
                                onCheckDialog(me, rowData);
                            }
                        }
                    ],
                    del: false
                },
                nav: {
                    actions: {
                        search: false,
                        add: false
                    }
                },
                filters: [{
                    caption: '调账搜索',
                    //defaultRenderGrid: false,
                    canSearchAll: true,
                    canClearSearch: true,
                    components: [
                        {//介个字段不是在列表里，单独查询这个字段的
                            label: '业务流水号',
                            name: 'bussTradeNo',
                            type: 'text',
                            options: {
                                sopt: ['lk']
                            }
                        },
                        {
                            label: '申请日期',
                            name: 'applyDate',
                            type: 'rangeDate',
                            //ignoreFormReset: true,清空的时候 false的话 是跟着清空
                            limitRange: 'month',
                            limitDate: moment(),
                            //defaultValue: [moment(), moment()],
                            options: {
                                sopt: ['lk']
                            }
                        },
                        {
                            label: '审核状态',
                            name: 'status',
                            type: 'select',
                            options: {
                                value: STATUS_MAP,
                                sopt: ['eq']
                            }
                        },
                        {
                            label: '申请人',
                            name: 'applyOprName',
                            type: 'text',
                            options: {
                                sopt: ['lk']
                            }
                        },
                        {
                            label: '审核人',
                            name: 'auditOprName',
                            type: 'text',
                            options: {
                                sopt: ['lk']
                            }
                        },
                        {
                            label: '调账金额',
                            name: 'amount',
                            type: 'text',
                            options: {
                                sopt: ['lk']
                            }
                        }
                    ],
                    searchBtn: {
                        id: 'adjustAccountSearch',
                        text: '搜索'
                    }
                }],
                colNames: {
                    id: '',
                    applyDate: '申请日期',
                    applyOprName: '申请人',
                    tradeNo: '财务流水号',
                    tradeTypeName: '交易类型',
                    amount: '调账金额',
                    status: '审核状态', //1：待审核2：审核通过3：审核拒绝
                    auditOprName: '审核人',
                    refuseReason: '审核拒绝原因',
                    auditDate: '审核日期',
                    remarks: '备注'
                },
                colModel: [
                    {name: 'id', hidden: true},
                    {name: 'applyDate', formatter: dateFormatter},
                    {name: 'applyOprName'},
                    {name: 'tradeNo'},
                    {name: 'tradeTypeName'},//, formatter: tradeTypeFormatter
                    {name: 'amount', editable: true},
                    {name: 'status', formatter: statusFormatter},
                    {name: 'auditOprName'},
                    {name: 'refuseReason', hidden: true},
                    {name: 'auditDate', formatter: dateFormatter, hidden: true},
                    {name: 'remarks', hidden: true}
                ],
                loadComplete: function(data) {}
            });

            me.loadAdjustAccountHandle(grid);

            return grid;
        },
        loadAdjustAccountHandle: function(grid){
            if(!Ctx.avail('accountRecord.addAdjust')){
                return false;
            }
            _.defer(function () {
                var addHtml = '<div style="border: 1px solid #ffffff;color: #ffffff;border-radius: 3px;">' +
                    '<div style="padding: 5px 10px 5px 10px;">' +
                    '<i class="icon-plus smaller-80"></i>' +
                    '新增调账' +
                    '</div>' +
                    '</div>';
                Opf.Grid.navButtonAdd(grid, {caption: addHtml, id: 'addAdjust', name: 'addAdjust', title:'新增调账', buttonicon: '', position: 'last',
                    onClickButton: function() {
                        require(['app/oms/account/adjustAccount/record/trade-view'], function () {
                            App.trigger('account:trade:list');
                        });
                    }
                });
            });
        }

    });

    function onCheckDialog(me2, rowData){
        var html = _.template(['<div>' ,
            '<div class="div_hd_error" style="border-color: #eed3d7;background-color: #f2dede;margin-top: -4px;padding: 10px 0 10px 0;display: none;">' ,
            '<center><a class="hd_error" style="color: #b94a48;"></a></center>' ,
            '</div>' ,
            '<div id="div-check" style="padding: 20px 40px;">' ,
            '<div style="padding: 10px;">审核状态：&nbsp;&nbsp;<select id="sl-status"><option value="2">审核通过</option><option value="3">审核拒绝</option></select>' ,
            '<div style="padding: 20px 0 0 0;">拒绝描述：&nbsp;&nbsp;<textarea id="tx-reason" style="min-width: 150px; min-height: 80px;"></textarea></div>' ,
            '</div>' ,
            '</div></div></div>'].join(''));
        var $dialog = Opf.Factory.createDialog(html(), {
            title: '审核操作',
            destroyOnClose: true,
            autoOpen: true,
            width: 350,
            height: 330,
            modal: true,
            buttons: [{
                type: 'submit',
                click: function () {
                    var me = this;
                    var status = $(me).find('#sl-status').val();
                    var reason = $(me).find('#tx-reason').val().trim();
                    if(status == 3 && reason == ''){
                        CommonUI.loadError($(me), '审核拒绝需填写拒绝描述.');
                        return false;
                    }
                    Opf.ajax({
                        type: 'POST',
                        async: false,
                        url: url._('adjust.account.check'),
                        jsonData: {
                            "id": rowData.id,
                            "status": status,
                            "refuseReason": reason
                        },
                        success: function (resp) {
                            if(resp.success){
                                $dialog.dialog('close');
                                Opf.Toast.success('审核成功.');
                                me2.grid.trigger('reloadGrid', {current: true});
                            }
                            else{
                                Opf.Toast.success('审核失败.');
                            }
                        }
                    });
                }
            },{
                type: 'cancel'
            }]
        });
    }

    function tradeTypeFormatter(val){
        return TRADETYPE_MAP[val] || '';
    }

    function statusFormatter(val){
        return STATUS_MAP[val] || '';
    }

    function dateFormatter(val) {
        return val ? moment(val, 'YYYYMMDDHHmm').format('YYYY/MM/DD HH:mm') : '';
    }

    App.on('adjust:account:list', function () {
        App.show(new View());
    });

    return View;

});