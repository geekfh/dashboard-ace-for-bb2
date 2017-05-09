/**
 * Created by wupeiying on 2015/12/1.
 */
define(['App',
    'jquery.jqGrid'
], function(App) {

    var tableCtTpl = [
        '<div class="row">',
        '<div class="col-xs-12 jgrid-container">',
        '<table id="account-trade-grid-table"></table>',
        '<div id="account-trade-grid-pager" ></div>',
        '</div>',
        '</div>'].join('');

    var TRADETYPE_MAP = null;

    var CUSTTYPE_MAP = {
        1:'商户',
        2:'地推',
        3:'代理商'
        //4:'个人',
        //5:'互金',
        //6:'O2O'
    };

    var View = Marionette.ItemView.extend({
        template: _.template(tableCtTpl),
        tabId: 'menu.accountTrade.list',
        events: {},

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
            var param = '';
            if(me.options.tradeNo != undefined){
                param = {"groupOp":"AND","rules":[{"field":"tradeNo","op":"eq","data":""+me.options.tradeNo+""}]};
            }
            var grid = App.Factory.createJqGrid({
                rsId: 'accountTradeDetail',
                caption: '',
                nav: {
                    actions: {
                        search: false,
                        add: false
                    }
                },
                actionsCol: {
                    edit: false,
                    del: false,
                    extraButtons: [
                        {
                            name: 'AccountRecord', icon: '', title: '新增', caption: '新增',
                            click: function (name, opts, rowData) {
                                showAccountingRecordDialog(me, rowData);
                            }
                        }
                    ]
                },
                filters: [{
                    caption: '调账搜索',
                    //defaultRenderGrid: false,
                    canSearchAll: true,
                    canClearSearch: true,
                    components: [
                        {
                            label: '交易类型',
                            name: 'tradeType',
                            type: 'select',
                            options: {
                                value: TRADETYPE_MAP,
                                sopt: ['lk']
                            }
                        },
                        {
                            label: '交易日期',
                            name: 'orderTime',
                            type: 'rangeDate',
                            //ignoreFormReset: true,
                            limitRange: 'month',
                            limitDate: moment(),
                            //defaultValue: [moment(), moment()],
                            options: {
                                sopt: ['lk']
                            }
                        },
                        {
                            label: '用户类型',
                            name: 'custType',
                            type: 'select',
                            options: {
                                value: CUSTTYPE_MAP,
                                sopt: ['eq']
                            }
                        },
                        {
                            label: '用户编号',
                            name: 'custNo',
                            type: 'text',
                            options: {
                                sopt: ['lk']
                            }
                        },
                        {
                            label: '用户名称',
                            name: 'custName',
                            type: 'text',
                            options: {
                                sopt: ['lk']
                            }
                        },
                        {
                            label: '交易流水号',
                            name: 'outTrandeNo',
                            type: 'text',
                            options: {
                                sopt: ['lk']
                            }
                        }
                        //{
                        //    label: '账务流水号',
                        //    name: 'tradeNo',
                        //    defaultValue: me.options.tradeNo == undefined ? '' : me.options.tradeNo,
                        //    type: 'text',
                        //    options: {
                        //        sopt: ['lk']
                        //    }
                        //}
                    ],
                    searchBtn: {
                        text: '搜索'
                    }
                }],
                gid: 'account-trade-grid',
                url: url._('adjust.account.tradeDetails'),
                postData: function(){
                    var postData = $(this).jqGrid('getGridParam', 'postData');
                    if(postData.filters == null){
                        return '';
                    }
                    else if(param == ''){
                        return '';
                    }
                    else{
                        return {filters: JSON.stringify(param)};
                    }
                },
                //postData: param == '' ? null : { filters: JSON.stringify(param) },
                colNames: {
                    id	            :  '',
                    outTradeNo	    :  '交易流水号',
                    tradeNo	        :  '账务流水号',
                    orderTimeFormat :  '交易日期',
                    custNo          :  '客户名称ID',
                    custName        :  '客户名称',
                    tradeType	    :  '交易类型ID',
                    tradeTypeName	:  '交易类型',
                    tradeStatusName :  '交易状态',
                    amount	        :  '交易金额'
                },
                colModel: [
                    {name: 'id', hidden: true},
                    {name: 'outTradeNo'},
                    {name: 'tradeNo'},//, hidden: true
                    {name: 'orderTimeFormat', formatter: dateFormatter},
                    {name: 'custNo', hidden: true},
                    {name: 'custName'},
                    {name: 'tradeType', hidden: true},
                    {name: 'tradeTypeName'},
                    {name: 'tradeStatusName'},
                    {name: 'amount'}
                ],
                loadComplete: function () {}
            });
            return grid;
        }
    });

    function showAccountingRecordDialog(me, rowData){
        require(['app/oms/account/adjustAccount/record/accountingRecords-view'], function(recordView){
            var recordView = new recordView({tradeNo: rowData.tradeNo, custType: rowData.custType, tradeType: rowData.tradeType, custNo: rowData.custNo}).render();
            recordView.showDialog(recordView);
            recordView.$el.on('reloadParentGrid',function(){
                me.grid.trigger('reloadGrid');
            });
        });
    }

    function dateFormatter(val) {
        return val ? moment(val, 'YYYYMMDDHHmm').format('YYYY/MM/DD HH:mm') : '';
    }

    App.on('account:trade:list', function (data) {
        App.show(new View(data));
    });

    return View;
});