/**
 * Created by wupeiying on 2016/6/29.
 */
define(['App',
    'tpl!app/oms/settle/settle-error/error-view/list-view.tpl',
    'jquery.jqGrid',
    'jquery.validate'
], function(App, tableCtTpl) {

    var INALIENABLE_MAP = {
        0: '不能',
        1: '能'
    };

    var SETTLEACCTTYPE_MAP = {
        1: '对公',
        2: '对私'
    };

    var postUrl = {
        0: 'settle.error.existData.import',
        1: 'settle.error.notTxnData.import',
        2: 'settle.error.RepeatData.import'
    };

    //var item_map = [
    //    {name: 'totalSum', type:'count'},
    //    {name: 'totalAmt', type:'count'}
    //];
    //
    //var STAT_MAP = {
    //    importTotalCount: "总数量",
    //    importNoTxnCount: "总金额"
    //};

    var colModel_map = {
        id:'',
        traceNo:'流水号',
        payTime:'出款日期',
        mchtNo:'商户号',
        mchtNm: '商户名称',
        settleBrhId:'机构号',
        settleBrhName:'机构名称',
        settleAcctNm:'姓名',
        settleAcct:'卡号',
        settleAmt:'金额',
        retMsg:'退回原因',
        existError:'是否已存在差错记录',
        mchtOrBrhNo:'商户号/机构号',
        mchtOrBrhNm:'商户名称/机构名称'
    };

    var View = Marionette.ItemView.extend({
        template: tableCtTpl,
        tabId: 'menu.errorSub.management',
        events: {
            'click .exist-import': 'clickExistImport',
            'click .notTxn-import': 'clickNotTxnImport'
        },

        onRender: function () {
            var me = this;
            _.defer(function () {
                me.renderMainGrid();
                me.renderExistGrid();
                me.renderNotTxnGrid();
            });
        },

        showDialog: function (){
            var me = this;
            var $dialog = Opf.Factory.createDialog(this.$el, {
                dialogClass: 'ui-jqdialog',
                open: true,
                destroyOnClose: true,
                width: 1250,
                height: 500,
                modal: true,
                title: '重复信息导入',
                buttons: [{
                    type: 'submit',
                    text: '确认提交',
                    click: function (e) {
                        var result = null;
                        var msg = null;
                        var gridId = me.grid.jqGrid('getGridParam', 'selarrrow');
                        var updateExistError = $(this).find('[name="updateExistError"]').is(':checked') == true ? 1 : 0;
                        var idsValue = [];
                        if(gridId == ''){
                            idsValue = [];
                            //Opf.alert('没有选择数据.');
                            //return false;
                        }
                        _.each(gridId, function(v, i){
                            idsValue.push(v);
                        });
                        Opf.ajax({
                            type: 'POST',
                            async: false,
                            url: 'api/settle/errors/create-bounce',
                            jsonData: {
                                bounceId: me.options.bounceId,
                                ids: idsValue,
                                updateExistError: updateExistError
                            },
                            success: function(resp){
                                result = resp.success;
                                msg = resp.msg;
                            }
                        });
                        if(result){
                            $dialog.dialog('destroy');
                            Opf.alert(msg);
                        }
                        else{
                            $dialog.dialog('destroy');
                            Opf.alert(msg);
                        }
                    }
                },{
                    type: 'cancel',
                    text: '关闭'
                }]
            });
            $('.ui-jqdialog-content').attr("style","overflow-x:hidden!important;");
        },

        clickExistImport: function (){
            var me = this;
            Opf.ajax({
                type: 'GET',
                async: false,
                url: 'api/settle/errors/download-exist-error/' + me.options.bounceId,
                success: function(resp){
                    Opf.download(resp.data.url);
                }
            });
        },

        clickNotTxnImport: function (){
            var me = this;
            Opf.ajax({
                type: 'GET',
                async: false,
                url: 'api/settle/errors/download-not-txn/' + me.options.bounceId,
                success: function(resp){
                    Opf.download(resp.data.url);
                }
            });
        },

        renderExistGrid: function () {
            var me = this;
            var totalSum = 0;
            var totalAmt = 0;

            var existGrid = App.Factory.createJqGrid({
                rsId: 'errorExist',
                caption: '',
                nav: {
                    actions: {
                        search: false,
                        add: false
                    }
                },
                actionsCol: {
                    view: false,
                    edit: false,
                    del: false,
                    width: 110
                },
                gid: 'error-exist-grid',
                url: url._(postUrl[0], {bounceId: me.options.bounceId}),
                colNames: colModel_map,
                colModel: [
                    {name: 'id', hidden: true},
                    {name: 'traceNo'},
                    {name: 'payTime', formatter: dateFormatter},
                    {name: 'mchtOrBrhNo', formatter:mchtOrBrhNoFormatter},
                    {name: 'mchtOrBrhNm', formatter:mchtOrBrhNmFormatter},
                    {name: 'mchtNo', hidden: true},
                    {name: 'mchtNm', hidden: true},
                    {name: 'settleBrhId', hidden: true},
                    {name: 'settleBrhName', hidden: true},
                    {name: 'settleAcctNm'},
                    {name: 'settleAcct'},
                    {name: 'settleAmt'},
                    {name: 'retMsg'},
                    {name: 'existError', hidden: true}
                ],
                loadComplete: function (resp) {
                    totalSum = resp.statDataMap.totalSum;
                    totalAmt = resp.statDataMap.totalAmt;
                    $('#exist-message').find('font:gt(0)').remove();
                    $('#exist-message').append('<font style="color: red;">已存在信息'+totalSum+'条，共计'+totalAmt+'元</font>');
                }
            });

            return existGrid;
        },

        renderNotTxnGrid: function () {
            var me = this;
            var totalSum = 0;
            var totalAmt = 0;

            var notTxnGrid = App.Factory.createJqGrid({
                rsId: 'errorNotTxn',
                caption: '',
                //pager: false,
                nav: {
                    actions: {
                        search: false,
                        add: false
                    }
                },
                actionsCol: {
                    view: false,
                    edit: false,
                    del: false,
                    width: 110
                },
                gid: 'error-notTxn-grid',
                url: url._(postUrl[1], {bounceId: me.options.bounceId}),
                colNames: colModel_map,
                colModel: [
                    {name: 'id', hidden: true},
                    {name: 'traceNo', hidden: true},
                    {name: 'payTime', formatter: dateFormatter},
                    {name: 'mchtOrBrhNo', formatter:mchtOrBrhNoFormatter, hidden: true},
                    {name: 'mchtOrBrhNm', formatter:mchtOrBrhNmFormatter, hidden: true},
                    {name: 'mchtNo', hidden: true},
                    {name: 'mchtNm', hidden: true},
                    {name: 'settleBrhId', hidden: true},
                    {name: 'settleBrhName', hidden: true},
                    {name: 'settleAcctNm'},
                    {name: 'settleAcct'},
                    {name: 'settleAmt'},
                    {name: 'retMsg'},
                    {name: 'existError', hidden: true}
                ],
                loadComplete: function (resp) {
                    totalSum = resp.statDataMap.totalSum;
                    totalAmt = resp.statDataMap.totalAmt;
                    $('#notTxn-message').find('font:gt(0)').remove();
                    $('#notTxn-message').append('<font style="color: red;padding">未查询实到的'+totalSum+'条，总金额'+totalAmt+'元</font>');
                }
            });

            return notTxnGrid;
        },

        renderMainGrid: function () {
            var me = this;
            var totalSum = 0;
            var totalAmt = 0;
            var totalUpload = 0;
            var totalNoRepeat = 0;
            var totalAmount = 0;

            var grid = me.grid = App.Factory.createJqGrid({
                rsId: 'errorMain',
                caption: '',
                rowNum: "totalElements",
                pager: false,
                multiselect: true,
                nav: {
                    actions: {
                        search: false,
                        add: false
                    }
                },
                actionsCol: {
                    view: false,
                    edit: false,
                    del: false,
                    width: 110
                },
                gid: 'error-subMain-grid',
                url: url._(postUrl[2], {bounceId: me.options.bounceId}),
                colNames: colModel_map,
                colModel: [
                    {name: 'id', hidden: true},
                    {name: 'traceNo'},
                    {name: 'payTime', formatter: dateFormatter},
                    {name: 'mchtOrBrhNo', formatter:mchtOrBrhNoFormatter},
                    {name: 'mchtOrBrhNm', formatter:mchtOrBrhNmFormatter},
                    {name: 'mchtNo', hidden: true},
                    {name: 'mchtNm', hidden: true},
                    {name: 'settleBrhId', hidden: true},
                    {name: 'settleBrhName', hidden: true},
                    {name: 'settleAcctNm'},
                    {name: 'settleAcct'},
                    {name: 'settleAmt'},
                    {name: 'retMsg'},
                    {name: 'existError', formatter:existErrorFormatter}
                ],
                loadComplete: function (resp) {
                    totalSum = resp.statDataMap.totalSum;
                    totalAmt = resp.statDataMap.totalAmt;
                    totalUpload = resp.statDataMap.totalUpload;
                    totalNoRepeat = resp.statDataMap.totalNoRepeat;
                    totalAmount = resp.statDataMap.totalAmount;
                    $('#subMain-message').append('<font style="color: red;">存在重复的信息' + totalSum + '条，共计' + totalAmt + '元（导入存在重复的数据之和）</font>');
                    $('#error-subMain-grid').append('<font style="color: red;padding: 10px;float: right;">共上传' + totalUpload + '条数据，其中核实正确不重复的' + totalNoRepeat + '条，总金额：' + totalAmount + '元</font>');
                }
            });

            return grid;
        }

    });

    function existErrorFormatter(val){
        return val == 0 ? '不存在' : '存在';
    }

    function dateFormatter(val) {
        return val ? moment(val, 'YYYYMMDDHHmm').format('YYYY/MM/DD HH:mm') : '';
    }

    function inalienableFormatter(val) {
        return INALIENABLE_MAP[val] || '';
    }

    function settleAcctTypeFormatter(val) {
        return SETTLEACCTTYPE_MAP[val] || '';
    }

    function mchtOrBrhNoFormatter(cellvalue, options, rowObject) {
        return rowObject.mchtNo || rowObject.settleBrhId || '';
    }

    function mchtOrBrhNmFormatter(cellvalue, options, rowObject) {
        return rowObject.mchtNm || rowObject.settleBrhName || '';
    }

    return View;
});