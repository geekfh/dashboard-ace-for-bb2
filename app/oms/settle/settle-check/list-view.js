define([
    'tpl!app/oms/settle/settle-check/templates/table-ct.tpl',
    'jquery.jqGrid',
    'jquery.validate',
    'bootstrap-datepicker',
    'moment.override'
],function(tpl){
    var grid;

    //审核状态
    var STATUS_MAP = {
        "0": "审核通过",
        "1": "审核拒绝",
        "2": "入账失败(待审)",
        "3": "原入账成功(待审)",
        "4": "未审核"
    };

    //账户类型
    var ACCOUNT_MAP = {
        "0": "对公",
        "1": "对私"
    };

    //调账标示
    var TYPE_MAP = {
        "1": "商户调账",
        "2": "机构调账"
    };

    var ERRTYPE_MAP = {
        "1": "对账不平",
        "2": "风控拦截延迟清算",
        "3": "手工延迟清算",
        "4": "商户不正常延迟清算",
        "5": "商户信息不全"
    };
    var STLMTYPE_MAP = {
        "0": "对账平，处理异常",
        "1": "本地有，渠道没有",
        "2": "本地无，渠道有",
        "3": "本地与渠道金额不一致",
        "4": "本地与渠道账号不一致"
    };
    var RES_MAP = {
        "1": '清算失败',
        "3": '资金解冻',
        "4": '差错交易',
        "5": '退票'
    };
    var STAT_MAP = {
        "totalSum":"总笔数",
        "totalAmt":"总金额"
    }

    //审核
    var checkStatus = function (name, opts, rowData) {
        var tpl = null;
        if(opts.name == "view"){
            tpl = [
                '<form class="form-settle-check"><div class="container">',
                '<style type="text/css">.form-settle-check .col-xs-3{text-align: right;}</style>',
                '<div id="J_checkInfo" class="container">',
                '<div class="row settle-styles-row">',
                '<div class="col-xs-3">审核状态：</div>',
                '<div class="col-xs-9">',
                '<select name="resultFlag" disabled="disabled">',
                '<option value="0">通过</option>',
                '<option value="1">拒绝</option>',
                '</select>',
                '</div>',
                '</div>',
                '<div class="row settle-styles-row">',
                '<div class="col-xs-3">备注(选填)：</div>',
                '<div class="col-xs-9">',
                '<textarea name="nextDo" style="width:90%;height:62px;" disabled="disabled"></textarea>',
                '</div>',
                '</div>',
                '</div>',
                '</div></form>'
            ].join('');
        }
        else{
            tpl = [
                '<form class="form-settle-check"><div class="container">',
                '<style type="text/css">.form-settle-check .col-xs-3{text-align: right;}</style>',
                '<div id="J_checkInfo" class="container">',
                '<div class="row settle-styles-row">',
                '<div class="col-xs-3">审核状态：</div>',
                '<div class="col-xs-9">',
                '<select name="resultFlag">',
                '<option value="0">通过</option>',
                '<option value="1">拒绝</option>',
                '</select>',
                '</div>',
                '</div>',
                '<div class="row settle-styles-row">',
                '<div class="col-xs-3">备注(选填)：</div>',
                '<div class="col-xs-9">',
                '<textarea name="nextDo" style="width:90%;height:62px;"></textarea>',
                '</div>',
                '</div>',
                '</div>',
                '</div></form>'
            ].join('');
        }

        var rules = {
            nextDo: { maxlength: 200 }
        };
        var $dialogForm = $(tpl);

        var buttonsContent = null;
        if(opts.name == 'view'){
            buttonsContent = [{
                type: 'cancel'
            }]
        }
        else{
            buttonsContent = [
                {
                    type: 'submit',
                    text: '提交',
                    className: 'submit',
                    icons: { primary: 'icon-ok' },
                    click: function () {
                        //发送审核通过/拒绝的描述信息
                        var isValid = $dialogForm.validate().form();
                        if(isValid){
                            //提交审核信息
                            var ajaxOptions = {
                                url: url._("settle.check.submit"),
                                type: 'post',
                                contentType: "application/json",
                                jsonData: $.extend({
                                    id: rowData.id,
                                    settleId: rowData.settleId,
                                    accountNo: rowData.rsp.settleAcct||"",
                                    settleDate: rowData.rsp.settleDate||"",
                                    amt: rowData.rsp.settleAmt||"",
                                    accountName: rowData.rsp.settleAcctName||"",
                                    traceNo: rowData.rsp.traceNo||""
                                }, Opf.Util.getFormData($dialogForm)),
                                success: function(){
                                    $dialog.trigger('dialogclose');
                                    grid.trigger("reloadGrid", [{current: true}]);
                                }
                            };
                            Opf.ajax(ajaxOptions);
                        }
                    }
                },
                {
                    type: 'cancel'
                }
            ];
        }

        var $dialog = Opf.Factory.createDialog($dialogForm, {
            destroyOnClose: true,
            title: "审核信息",
            width: 480,
            height: 600,
            autoOpen: true,
            modal: true,
            buttons: buttonsContent
        });
        $dialog.find('[name="resultFlag"]').val(rowData.status);
        $dialog.find('[name="nextDo"]').text(rowData.checkDesc || '');

        Opf.Validate.addRules($dialogForm, {rules: rules});

        //填写审核信息
        var ajaxOptions = {
            url: url._("settle.check.detail",{id: rowData.id}),
            type: 'get',
            //data: {settleId:rowData.settleId},
            success: function(rsp){
                //缓存数据
                rowData.rsp = rsp;
                var tpl ;
                if(rowData.addResource == '3'){
                    tpl = [
                        //调账标示
                        '<div class="row settle-styles-row">',
                        '<div class="col-xs-3">调账标示：</div>',
                        '<div class="col-xs-9">'+TYPE_MAP[rsp.appType]+'</div>',
                        '</div>',

                        //机构/商户号
                        '<div class="row settle-styles-row">',
                        '<div class="col-xs-3">机构/商户号：</div>',
                        '<div class="col-xs-9">'+rsp.appId+'</div>',
                        '</div>',

                        //机构/商户名
                        '<div class="row settle-styles-row">',
                        '<div class="col-xs-3">机构/商户名：</div>',
                        '<div class="col-xs-9">'+rsp.appName+'</div>',
                        '</div>',

                        //本次申请解冻金额
                        '<div class="row settle-styles-row">',
                        '<div class="col-xs-3">申请解冻金额：</div>',
                        '<div class="col-xs-9">'+rsp.unfreezeAmount+'</div>',
                        '</div>'
                    ].join('');
                }
                else if (rowData.addResource == '4'){
                    tpl = [
                        //交易时间
                        '<div class="row settle-styles-row">',
                        '<div class="col-xs-3">交易时间：</div>',
                        '<div class="col-xs-9">'+dateFormatter(rsp.txTime)+'</div>',
                        '</div>',

                        //平台流水
                        '<div class="row settle-styles-row">',
                        '<div class="col-xs-3">平台流水：</div>',
                        '<div class="col-xs-9">'+rsp.traceNo+'</div>',
                        '</div>',

                        //订单号
                        '<div class="row settle-styles-row">',
                        '<div class="col-xs-3">订单号：</div>',
                        '<div class="col-xs-9">'+rsp.orderNo+'</div>',
                        '</div>',

                        //系统参考号
                        '<div class="row settle-styles-row">',
                        '<div class="col-xs-3">系统参考号：</div>',
                        '<div class="col-xs-9">'+rsp.sysRefNo+'</div>',
                        '</div>',



                        //差错类型
                        '<div class="row settle-styles-row">',
                        '<div class="col-xs-3">差错类型：</div>',
                        '<div class="col-xs-9">'+ERRTYPE_MAP[rsp.errType]+'</div>',
                        '</div>',

                        //差错描述
                        '<div class="row settle-styles-row">',
                        '<div class="col-xs-3">差错描述：</div>',
                        '<div class="col-xs-9">'+rsp.errDesc+'</div>',
                        '</div>',

                        //对账不平类型
                        '<div class="row settle-styles-row">',
                        '<div class="col-xs-3">对账不平类型：</div>',
                        '<div class="col-xs-9">'+stlmTypeFormatter(rsp.stlmType)+'</div>',
                        '</div>',

                        //交易金额
                        '<div class="row settle-styles-row">',
                        '<div class="col-xs-3">交易金额：</div>',
                        '<div class="col-xs-9">'+rsp.txAmt+'</div>',
                        '</div>',


                        //交易卡号
                        '<div class="row settle-styles-row">',
                        '<div class="col-xs-3">交易卡号：</div>',
                        '<div class="col-xs-9">'+rsp.acctNo+'</div>',
                        '</div>',

                        //商户号
                        '<div class="row settle-styles-row">',
                        '<div class="col-xs-3">商户号：</div>',
                        '<div class="col-xs-9">'+rsp.mchtNo+'</div>',
                        '</div>',

                        //商户名
                        '<div class="row settle-styles-row">',
                        '<div class="col-xs-3">商户名：</div>',
                        '<div class="col-xs-9">'+rsp.mchtName+'</div>',
                        '</div>'

                    ].join('');
                }
                else{
                    tpl = [
                        //清算日期
                        '<div class="row settle-styles-row">',
                        '<div class="col-xs-3">清算日期：</div>',
                        '<div class="col-xs-9">'+dateFormatter(rsp.settleDate)+'</div>',
                        '</div>',

                        //入账日期
                        '<div class="row settle-styles-row">',
                        '<div class="col-xs-3">入账日期：</div>',
                        '<div class="col-xs-9">'+dateFormatter(rsp.inDate)+'</div>',
                        '</div>',

                        //流水号
                        '<div class="row settle-styles-row">',
                        '<div class="col-xs-3">流水号：</div>',
                        '<div class="col-xs-9">'+rsp.traceNo+'</div>',
                        '</div>',

                        //商户号
                        '<div class="row settle-styles-row">',
                        '<div class="col-xs-3">机构/商户号：</div>',
                        '<div class="col-xs-9">'+rsp.mchtNo+'</div>',
                        '</div>',

                        //商户名
                        '<div class="row settle-styles-row">',
                        '<div class="col-xs-3">机构/商户名：</div>',
                        '<div class="col-xs-9">'+rsp.mchtName+'</div>',
                        '</div>',

                        //账户类型
                        '<div class="row settle-styles-row">',
                        '<div class="col-xs-3">账户类型：</div>',
                        '<div class="col-xs-9">'+ACCOUNT_MAP[rsp.settleAcctType]+'</div>',
                        '</div>',

                        //开户行
                        '<div class="row settle-styles-row">',
                        '<div class="col-xs-3">开户行：</div>',
                        '<div class="col-xs-9">'+rsp.settleBankName+'</div>',
                        '</div>',

                        //开户名
                        '<div class="row settle-styles-row">',
                        '<div class="col-xs-3">开户名：</div>',
                        '<div class="col-xs-9">'+rsp.settleAcctName+'</div>',
                        '</div>',

                        //卡号
                        '<div class="row settle-styles-row">',
                        '<div class="col-xs-3">卡号：</div>',
                        '<div class="col-xs-9">'+rsp.settleAcct+'</div>',
                        '</div>',

                        //清算金额
                        '<div class="row settle-styles-row">',
                        '<div class="col-xs-3">清算金额：</div>',
                        '<div class="col-xs-9">'+rsp.settleAmt+'</div>',
                        '</div>'
                    ].join('');
                }


                $("#J_checkInfo", $dialogForm).before(tpl);
            },
            complete: function(){
                if(typeof rowData.rsp == "undefined"){
                    rowData.rsp = {};
                }
            }
        };
        Opf.ajax(ajaxOptions);
    };

    //格式化日期
    var dateFormatter = function(value) {
        return value ? moment(value, 'YYYYMMDD').format('YYYY/MM/DD') : '';
    };
    var stlmTypeFormatter = function(val) {
        return STLMTYPE_MAP[val] ? STLMTYPE_MAP[val] : '未对账';
    }

    //带时分秒日期
    var dateFormatterWithTime = function(value) {
        return value ? moment(value, 'YYYYMMDDhhmmss').format('YYYY/MM/DD hh:mm:ss') : '';
    };

    var sourceTypeFormatter = function(value) {
        if (value) {
            value = value.toLowerCase().substr(0, 2);
            if (value == 'js' || value == 'qf') {
                value = '系统记录';
            } else if (value == 'st' || value == 'sq') {
                value = '手工导入';
            } else {
                value = '';
            }
        } else {
            value = '';
        }
        return value;
    }

    return Marionette.ItemView.extend({
        tabId: 'menu.settle.check',
        template: tpl,

        initialize: function (options) {
            //TODO
        },

        onRender: function () {
            var me = this;

            _.defer(function () {
                me.renderGrid();
            });
        },

        renderGrid: function () {
            var me = this;
            var extParams = {};
            if(Ctx.avail('settle.check.search')){
                extParams.filters = [
                    {
                        caption: '查询条件',
                        defaultRenderGrid: false,
                        canSearchAll: true,
                        canClearSearch: true,
                        components: [
                            {
                                label: '审核人',
                                name: 'oprName'
                            },
                            {
                                label: '审核状态',
                                name: 'status',
                                type: 'select',
                                options: {
                                    value: STATUS_MAP
                                }
                            },
                            {
                                label: '申请来源',
                                name: 'addResource',
                                type: 'select',
                                options: {
                                    value: RES_MAP
                                }
                            }
                        ],
                        searchBtn: {
                            text: '搜索'
                        }
                    }
                ]
            }
            grid = App.Factory.createJqGrid($.extend({}, extParams, {
                caption: '操作审核',
                multiselect: true,
                tableCenterTitle: '清分清算操作审核列表',
                rsId:'settle.check',
                gid: 'settle-check-grid',
                stats: {
                    labelConfig:STAT_MAP,
                    items:[
                        {name: 'totalAmt', type: 'currency'},
                        {name: 'totalSum', type: 'count'}
                    ]
                },
                url: url._('settle.check.list'),
                rowList: [10, 50, 100, 500],
                datatype: 'json',
                download: {
                    url: url._('settle.check.download'),
                    params: function () {
                        var postData = $(grid).jqGrid('getGridParam', 'postData');
                        return { filters: postData.filters };
                    },
                    queueTask: {
                        name: function () {
                            return '提供权限码标识';
                        }
                    }
                },
                actionsCol: {
                    view: false,
                    edit: false,
                    del : false,
                    canButtonRender: function (name, opts, rowData) {
                        /**
                         * "1": '清算失败',
                         "3": '资金解冻',
                         "4": '差错交易',
                         "5": '退票'
                         */

                        var addResource = rowData.addResource;
                        var status = rowData.status;

                        if(name == 'view') {
                            return true;
                        }
                        if (name == "checkstatus1"  && status >=2 && (addResource == 1 || addResource == null)) {
                            return true;
                        }

                        if (name == "checkstatus3" && status >=2 && addResource == 3) {
                            return true;
                        }

                        if (name == "checkstatus4"  && status >=2 && addResource == 4 ) {
                            return true;
                        }

                        if (name == "checkstatus5"  && status >=2 && addResource == 5 ) {
                            return true;
                        }
                        return false;

                    },
                    extraButtons: [
                        {
                            name: 'view', title: '查看',
                            icon:'ui-icon icon-zoom-in grey',
                            click: checkStatus
                        },
                        {
                            name: 'checkstatus1', title: '审核',//清算失败审核按钮
                            icon:'icon-opf-process-account icon-opf-process-account-color',
                            click: checkStatus
                        },
                        {
                            name: 'checkstatus3', title: '审核',//资金解冻审核按钮
                            icon:'icon-opf-process-account icon-opf-process-account-color',
                            click: checkStatus
                        },
                        {
                            name: 'checkstatus4', title: '审核',//差错交易审核按钮
                            icon:'icon-opf-process-account icon-opf-process-account-color',
                            click: checkStatus
                        },
                        {
                            name: 'checkstatus5', title: '审核',//退票审核按钮
                            icon:'icon-opf-process-account icon-opf-process-account-color',
                            click: checkStatus
                        }

                    ]
                },
                nav: {
                    actions: {
                        add: false,
                        search: true,
                        refresh: true
                    }
                },
                colNames: {
                    id:              'id',
                    addResource:    '申请来源',
                    dataTime:       '申请时间',
                    mchtName:       '申请人',
                    appDesc:        '申请描述',
                    appContent:     '申请内容',
                    status:         '审核状态',
                    oprName:        '审核人',
                    checkTime:      '审核时间',
                    checkDesc:      '审核描述',
                    sourceType:     '数据来源'
                },
                colModel: [
                    //ID
                    {
                        name: 'id',
                        index:'id',
                        hidden: true
                    },
                    {
                        name: 'addResource',
                        index: 'addResource',
                        search: true,
                        stype: 'select',
                        searchoptions: {
                            value: RES_MAP,
                            sopt: ['eq']
                        },
                        formatter: function(val){
                            return RES_MAP[val]||"清算失败";
                        }
                    },
                    //申请时间
                    {
                        name: 'dataTime',
                        index: 'dataTime',
                        search: true,
                        searchoptions: {
                            dataInit : function (elem) {
                                $(elem).datepicker({autoclose: true,format: 'yyyymmdd'});
                            },
                            sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge']
                        },
                        formatter: function(value){
                            return dateFormatter(value);
                        }
                    },

                    //申请人
                    {
                        name: 'mchtName',
                        index: 'mchtName',
                        search: true,
                        _searchType:'string',
                        searchoptions : {
                            sopt : [ 'lk', 'nlk', 'eq', 'ne']
                        }
                    },

                    //申请描述
                    {
                        name: 'appDesc',
                        index: 'appDesc'
                    },

                    //申请内容
                    {
                        name: 'appContent',
                        index: 'appContent'
                    },

                    //审核状态
                    {
                        name: 'status',
                        index: 'status',
                        search: true,
                        stype: 'select',
                        searchoptions: {
                            value: STATUS_MAP,
                            sopt: ['eq']
                        },
                        formatter: function(value){
                            return STATUS_MAP[value]||"";
                        }
                    },

                    //审核人
                    {
                        name: 'oprName',
                        index: 'oprName',
                        search: true,
                        _searchType:'string',
                        searchoptions : {
                            sopt : [ 'lk' ]
                        }
                    },

                    //审核描述


                    //审核时间
                    {
                        name: 'checkTime',
                        index: 'checkTime',
                        search: true,
                        searchoptions: {
                            dataInit : function (elem) {
                                $(elem).datepicker({autoclose: true,format: 'yyyymmdd'});
                            },
                            sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge']
                        },
                        formatter: function(value){
                            return dateFormatter(value);
                        }
                    },

                    //审核描述
                    {
                        name: 'checkDesc',
                        index: 'checkDesc'
                    },

                    {
                        name: 'sourceType',
                        index:'sourceType',
                        formatter: function(value){
                            return sourceTypeFormatter(value);
                        }
                    } //来源类型
                ]
            }));

            me.checkStatusBatchBtn(grid);
        },
        checkStatusBatchBtn: function (grid) {
            if (!Ctx.avail('settle.check.checkstatus1') || !Ctx.avail('settle.check.checkstatus3') || !Ctx.avail('settle.check.checkstatus4') || !Ctx.avail('settle.check.checkstatus5')) {
                return;
            }
            Opf.Grid.navButtonAdd(grid, {
                caption: '',
                id: 'checkstatus',
                name: 'checkstatus',
                title: '批量审核',
                buttonicon: 'icon-user white',
                position: 'last',
                onClickButton: function () {
                    checkstatusBatchDialog(grid);
                }
            });
        }
    });

    function checkstatusBatchDialog(grid){
        if (grid.find('input.cbox:checked').length === 0) {
            Opf.alert({title: "警告", message: "请至少选中一条记录!"});
            return false;
        }
        var rowsData = _.map(grid.jqGrid('getGridParam', 'selarrrow'), function(id){
            return grid._getRecordByRowId(id);
        });

        if(rowsData != null){
            var flag = true;
            var result = null;
            var amountNum = 0;//统计笔数
            var amount = 0;//统计金额
            var settleChecks = [];
            var addRes = null;
            $.each(rowsData, function(i, v){
                if(rowsData[i].addResource == null){
                    rowsData[i].addResource = '1';
                }

                if(rowsData[0].addResource != rowsData[i].addResource){
                    result = 1;
                    flag = false;
                }
                else if(rowsData[0].status != rowsData[i].status){
                    result = 2;
                    flag = false;
                    //if(rowsData[0].status != rowsData[i].status){
                    //
                    //}
                }
                else if (rowsData[0].addResource == 1 && !Ctx.avail('settle.check.checkstatus1')){
                    result = 3;
                    flag = false;
                }
                else if(rowsData[0].addResource == 3 && !Ctx.avail('settle.check.checkstatus3')){
                    result = 4;
                    flag = false;
                }
                else if(rowsData[0].addResource == 4 && !Ctx.avail('settle.check.checkstatus4')){
                    result = 5;
                    flag = false;
                }
                else if (rowsData[0].addResource == 5 && !Ctx.avail('settle.check.checkstatus5')){
                    result = 6;
                    flag = false;
                }
                else{
                    addRes = rowsData[0].addResource;
                    Opf.ajax({
                        type: 'GET',
                        async: false,
                        url: url._('settle.check.detail', {id: rowsData[i].id}),
                        success: function(resp){
                            switch(rowsData[0].addResource)
                            {
                                case "1"://清算失败 settleAmt
                                    amount += resp.settleAmt;
                                    break;

                                case "3"://资金解冻 unfreezeAmount
                                    amount += resp.unfreezeAmount;
                                    break;

                                case "4"://差错交易 txAmt
                                    amount += resp.txAmt;
                                    break;

                                case "5"://退票 settleAmt
                                    amount += resp.settleAmt;
                                    break;

                                default :
                                    amount = 0;
                            }
                        },
                        error: function(resp){
                            flag = false;
                        }
                    });
                    amountNum += 1;
                }

                return flag;
            });

            if(flag == true){
                var tpl = [
                    '<form class="form-settle-check"><div class="container">',
                    '<style type="text/css">.form-settle-check .col-xs-3{text-align: right;}</style>',
                    '<div id="checkInfo" class="container">',

                    '<div class="row settle-styles-row">',
                    '<div class="col-xs-3">共计交易笔数：</div>',
                    '<div class="col-xs-9">',
                    '<label id="lb_amountNum">'+amountNum+'笔数</label>',
                    '</div>',
                    '</div>',

                    '<div class="row settle-styles-row">',
                    '<div class="col-xs-3">共计交易金额：</div>',
                    '<div class="col-xs-9">',
                    '<label id="lb_amountNum">'+amount+'元</label>',
                    '</div>',
                    '</div>',

                    '<div class="row settle-styles-row">',
                    '<div class="col-xs-3">审核状态：</div>',
                    '<div class="col-xs-9">',
                    '<select name="resultFlag">',
                    '<option value="0">通过</option>',
                    '<option value="1">拒绝</option>',
                    '</select>',
                    '</div>',
                    '</div>',

                    '<div class="row settle-styles-row">',
                    '<div class="col-xs-3">备注(选填)：</div>',
                    '<div class="col-xs-9">',
                    '<textarea name="nextDo" style="width:90%;height:62px;"></textarea>',
                    '</div>',
                    '</div>',

                    '</div>',

                    '</form>'
                ].join('');
                var $dialog = Opf.Factory.createDialog(tpl, {
                    destroyOnClose: true,
                    title: '批量审核',
                    autoOpen: true,
                    width: 510,
                    modal: true,
                    buttons: [{
                        type: 'submit',
                        text: '确定',
                        click: function () {
                            var resultFlag = $(this).find('[name="resultFlag"]').val();
                            var nextDo = $(this).find('[name="nextDo"]').val();
                            $.each(rowsData, function(i, v){
                                settleChecks.push({
                                    id: rowsData[i].id,
                                    settleId: rowsData[i].settleId,
                                    resultFlag: resultFlag,
                                    nextDo: nextDo
                                });
                            });
                            Opf.ajax({
                                type: 'PUT',
                                url: 'api/settle/check/change-status-bat',
                                jsonData: {settleChecks: settleChecks},
                                success: function () {
                                    Opf.Toast.success('审核成功.');
                                    grid.trigger('reloadGrid', {current: true});
                                },
                                complete: function () {
                                    $dialog.dialog('close');
                                }
                            });
                        }
                    }, {
                        type: 'cancel'
                    }],
                    create: function() {}
                });
            }
            else if(result == 1){
                Opf.alert({title: "警告", message: "选择申请来源需一致."});
            }
            else if(result == 2){
                Opf.alert({title: "警告", message: "选择审核状态需一致."});//针对[入账失败(待审)、原入账成功(待审)、未审核]状态修改
            }
            else if(result == 3){
                Opf.alert({title: "警告", message: "没有[清算失败]权限."});
            }
            else if(result == 4){
                Opf.alert({title: "警告", message: "没有[资金解冻]权限."});
            }
            else if(result == 5){
                Opf.alert({title: "警告", message: "没有[差错交易]权限."});
            }
            else if(result == 6){
                Opf.alert({title: "警告", message: "没有[退票]权限."});
            }
        }
    }

    function getId(rowDataArray){
        return _.map(rowDataArray, function(rowData){
            return rowData.id;
        });
    }
});