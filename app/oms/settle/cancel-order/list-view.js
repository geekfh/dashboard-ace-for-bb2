/**
 * Created by wangdongdong on 2015/7/16.
 */
define([
    'tpl!assets/scripts/fwk/component/templates/switchable-dropdown.tpl',//'tpl!assets/scripts/fwk/component/templates/radio.tpl',
    'tpl!app/oms/settle/cancel-order/templates/table-list.tpl',
    'app/oms/common/moduleUI',
    'jquery.jqGrid',
    'bootstrap-datepicker',
    'assets/scripts/fwk/component/RangeDatePicker',
    'common-ui'
],function(switchableDropdownTplFn,tpl, ModuleUI, commonFiltersFieldset){

    var TYPE_MAP = {
        '0': '全部',
        '1': '调单',
        '2': '退单',
        '3': '退货',
        '4': '短款请款',
        '5': '例外处理'
    },
    CHECK_STATUS_MAP = {//调单状态翻译
        '0': '全部',
        '6': '未扣款',
        '7': '调单暂扣',
        '8': '风险冻结',
        '9': '调单释放',
        '17': '风险协查'
    },RETURN_ORDER_STATUS_MAP = {//退单状态翻译
        '0': '全部',
        '10': '未请款',
        '11': '请款成功',
        '12': '请款失败',
        '13': '请款中',
        '14': '退单释放'
    },RETURN_GOODS_STATUS_MAP = {//退货状态翻译
        '0': '全部',
        '15': '通道长款退货',
        '16': '线下商户退货'
    },RETURN_PAYOFF_STATUS_MAP = {//短款请款状态翻译
        '0': '全部',
        '18': '手工处理请款'
    },RETURN_EXCEPTION_STATUS_MAP = {//例外处理状态翻译
        '0': '全部',
        '22': '已退款',
        '19': '未退款',
        '20': '暂扣',
        '21': '单据释放'
    };
    //    CHECK_STATUS_MAP_U = {//修改时 调单状态
    //    '2': '已确认正常交易',
    //    '3': '拒付'
    //},CHECK_STATUS_MAP_4 = {//修改时 调单状态 拒付时
    //    '4': '已退款'
    //},RETURN_ORDER_STATUS_MAP_U = {//修改时 退单状态
    //    '2': '已确认正常交易',
    //    '3': '退款'
    //},RETURN_ORDER_STATUS_MAP_4 = {//修改时 退单状态 已退款
    //    '4': '已退款'
    //},RETURN_GOODS_STATUS_MAP_2 = {//修改时 退货状态翻译 未退款
    //    '2': '待退款'
    //},RETURN_GOODS_STATUS_MAP_U = {//修改时 退货状态翻译 待退款，退款中，退款失败
    //    '3': '退款中',
    //    '4': '已退款',
    //    '5': '退款失败'
    //};

    //联系状态
    var CONTACT_STATUS = {"1":"待联系", "2":"停机空号", "3":"电话畅通", "4":"商户挂机", "5":"无人接听"};
    //退单原因
    var CANCEL_REASON_CODE = {
        "4502": "4502-交易未成功，已扣账",
        "4503": "4503-对请款交易有异议",
        "4507": "4507-持卡人对交易金额有争议",
        "4508": "4508-交易金额超过授权金额",
        "4512": "4512-交易重复提交清算",
        "4514": "4514-疑似欺诈多笔交易",
        "4515": "4515-持卡人否认交易",
        "4522": "4522-交易未被批准",
        "4526": "4526-收单机构提供资料不清晰",
        "4527": "4527-收单机构查复超过时限或回复码为04",
        "4531": "4531-持卡人对消费签单其他内容有争议",
        "4532": "4532-退货交易未清算",
        "4536": "4536-逾期提交结算",
        "4544": "4544-已撤销的交易",
        "4557": "4557-已扣账，但客户未收到商户承诺的服务或订购的商品",
        "4558": "4558-交易证书（TC验证失败",
        "4559": "4559-不能提供交易证书（TC及相关计算数据",
        "4562": "4562-伪卡欺诈",
        "4570": "4570-再请款不正确",
        "4572": "4572-发卡行纠正一次退单原因",
        "4752": "4752-余额查询未成功，索还手续费",
        "4802": "4802-风险交易",
        "4803": "4803-风险商户",
        "4806": "4806-以其他方式支付",
        "4810": "4810-补偿申请",
        "4571": "4571-发卡机构能够提供一次退单中缺少的证明材料",
        "9700": "9700-收单机构借记卡贷记调整失误",
        "9701": "9701-对发卡机构借记卡一次退单有疑义",
        "9702": "9702-收单机构原始交易短款",
        "9703": "9703-超过差错交易的提交时限",
        "9704": "9704-差错处理流程已经结束但仍未解决",
        "9705": "9705-中心无记录的交易",
        "9706": "9706-其它经协商同意付款的交易",
        "9710": "9710-争议协商备案"
    };
    //退单类型
    var CANCEL_TYPE = {"1":"一次退单", "2":"二次退单", "3":"风险退单"};
    var ORDER_TYPE={"1":"调单", "2":"退单", "3":"退货", "4": "短款请款", "5": "例外处理"};

    //处理结果
    var DEALRESULT_MAP = {
        '0': '全部',
        '1': '处理完成',
        '2': '处理未完成'
    };

    var View = Marionette.ItemView.extend({
        tabId: 'menu.exception.cancelorder',
        template: tpl,
        events:{
            'changed.bs.dropdown .type-dropdown' : 'typeChange'
        },
        onRender: function(){
            var me = this;
            _.defer(function(){
                me.renderGrid();
            });
        },
        doSetUpUI: function(){
            $('input[name="type-radio"]:eq(0)').attr('checked','checked');
            this.typeChange();
        },
        onAddModel: function() {
            var me = this;
            require(['app/oms/settle/cancel-order/add-view'], function (AddView) {
                var AddOrderView = new AddView().render();
                AddOrderView.showDialog(AddOrderView);
                //App.searchOrderRegion.show(AddOrderView);

                $('.ui-dialog-buttonset').prepend(getTypeTpl());
                AddOrderView.$el.on('reloadParentGrid', function () {
                    me.grid.trigger('reloadGrid');
                });

                function getTypeTpl() {
                    return ['<div style="float: left">',
                        '<span><input type="radio" name = "orderType" value = "1">调单录入</input></span>',
                        '<span><input type="radio" name = "orderType" value = "2">退单录入</input></span>',
                        '<span><input type="radio" name = "orderType" value = "3">退货录入</input></span>',
                        '<span><input type="radio" name = "orderType" value = "5">例外处理</input></span>'
                    ].join('');
                }
            });
        },
        gridOptions: function (options) {
            //20170317改动 3.3.2需求 之前有个权限判断，暂时不用if(Ctx.avail('menu.exception.cancelorder.finance') && Ctx.getBrhCode() != '000'){//财务权限
            return $.extend(options, {
                filters: [{
                    caption: '条件过滤',
                    defaultRenderGrid: false,
                    canClearSearch: true,
                    canSearchAll: true,
                    isSearchRequired: 3, //true/false/number:最少{number}项
                    isSearchRequiredMsg: '请至少输入三项查询条件，还需要输入一项查询条件',
                    components: [
                        {
                            label: '交易卡号/尾号',
                            name: 'tradeCardNo',
                            options: {
                                sopt:['llk']
                            }
                        },
                        {
                            type: 'rangeDate',
                            label: '录入日期',
                            ignoreFormReset: true,
                            limitDate: moment(),
                            defaultValue: '',
                            name: 'createTime'
                        },
                        {
                            type: 'rangeDate',
                            label: '交易时间',
                            limitDate: moment(),
                            defaultValue: '',
                            name: 'tradeTime'

                        },
                        {
                            label: '类型',
                            name: 'type',
                            type: 'select',
                            defaultValue: '0',
                            options: {
                                sopt: ['eq'],
                                value: TYPE_MAP
                            }
                        },
                        {
                            label: '处理状态',
                            name: 'dealStatus',
                            type: 'select',
                            defaultValue: '0',
                            options: {
                                sopt: ['eq'],
                                value: CHECK_STATUS_MAP
                            }
                        },
                        {
                            label: '处理结果',
                            name: 'dealResult',
                            type: 'select',
                            defaultValue: '0',
                            options: {
                                sopt: ['eq'],
                                value: DEALRESULT_MAP
                            }
                        }
                    ],
                    searchBtn: {text: '搜索'}
                }]
            });
        },
        //showEditView: function(rowData){
        //    var me = this;
        //    require(['app/oms/settle/cancel-order/edit-view'],function(EditView){
        //        if(rowData.type == '1' && rowData.dealStatus == '1'){
        //            rowData.statusMap = CHECK_STATUS_MAP_U;
        //        }
        //        else if(rowData.type == '1' && rowData.dealStatus == '3'){
        //            rowData.statusMap = CHECK_STATUS_MAP_4;
        //        }
        //        else if(rowData.type == '2' && rowData.dealStatus == '1'){
        //            rowData.statusMap = RETURN_ORDER_STATUS_MAP_U;
        //        }
        //        else if(rowData.type == '2' && rowData.dealStatus == '3'){
        //            rowData.statusMap = RETURN_ORDER_STATUS_MAP_4;
        //        }
        //        else if(rowData.type == '3' && rowData.dealStatus == '1'){
        //            rowData.statusMap = RETURN_GOODS_STATUS_MAP_2;
        //        }
        //        else if(rowData.type == '3' && rowData.dealStatus != '4'){
        //            rowData.statusMap = RETURN_GOODS_STATUS_MAP_U;
        //        }
        //        else{
        //            Opf.Toast.warning('无法修改.');
        //            return;
        //        }
        //        //rowData.statusMap = rowData.type == '1' ? CHECK_STATUS_MAP_U : rowData.type == '2' ? RETURN_ORDER_STATUS_MAP_U :RETURN_GOODS_STATUS_MAP_U;
        //        var model = new Backbone.Model(rowData);
        //        var editView = new EditView({model: model}).render();
        //        var $dialog = Opf.Factory.createDialog(editView.$el, {
        //            modal: true,
        //            width: 400,
        //            title: '编辑操作',
        //            appendTo: document.body,
        //            buttons: [{
        //                type: 'submit',
        //                text: '保存',
        //                click: function(){
        //                    editView.submit(rowData.id,function(){
        //                        $dialog.dialog('close');
        //                        me.grid.trigger('reloadGrid');
        //                    });
        //                }
        //
        //            },{
        //                type: 'cancel',
        //                text:'关闭'
        //            }],
        //            close: function() {
        //                $(this).dialog('destroy');
        //            }
        //        });
        //    });
        //},
        showDetailView:function(rowData){
            require(['app/oms/settle/cancel-order/detail-view'], function(DetailView){
                var model = new Backbone.Model(rowData);
                new DetailView({model:model}).render();
            });
        },
        renderGrid: function() {
            var me = this;
            var ck_type;
            var ck_skip_num = 0;
            var ck_skip_num2 = 0;
            var DEALSTATUS_MAP = '';
            me.grid = App.Factory.createJqGrid(me.gridOptions({
                rsId:'menu.exception.cancelorder',
                gid: 'exception-cancelorder-grid',
                caption: '调单退单管理',
                nav: {
                    actions:{
                        addfunc: function () {
                            me.onAddModel();
                        },
                        editfunc: function(id){
                            var rowData = me.grid._getRecordByRowId(id);
                            me.showEditView(rowData);
                        },
                        viewfunc:function(id){
                            var rowData = me.grid._getRecordByRowId(id);
                            me.showDetailView(rowData);
                        }
                    },
                    search: {
                        width: 500,
                        customComponent: {
                            items: [
                                {
                                    type: 'singleOrRangeDate',
                                    label: '录入日期',
                                    name: 'createTime',
                                    defaultValue: ''
                                },
                                {
                                    type: 'singleOrRangeDate',
                                    label: '交易时间',
                                    name: 'tradeTime',
                                    defaultValue: ''
                                },
                                {
                                    type: 'singleOrRangeDate',
                                    label: '商管处理时间',
                                    name: 'cancelOrderSGTime',
                                    defaultValue: ''
                                },
                                {
                                    type: 'singleOrRangeDate',
                                    label: '清算处理时间',
                                    name: 'cancelOrderQSTime',
                                    defaultValue: ''
                                }
                            ]
                        },
                        afterRedraw: function (){
                            ModuleUI.searchFormBySelect2($(this), 'cancelOrderSGId');
                            ModuleUI.searchFormBySelect2($(this), 'cancelOrderQSId');
                            ModuleUI.searchFormBySelect2($(this), 'cupsNo');
                        },
                        // 点击重置按钮时，搜索条件保留以下值，这个是点击重置传给后端查询值
                        resetReserveValue: [
                            {
                                field: 'createTime',
                                op: 'eq',
                                data: ''
                            },
                            {
                                field: 'tradeTime',
                                op: 'eq',
                                data: ''
                            },
                            {
                                field: 'cancelOrderSGTime',
                                op: 'eq',
                                data: ''
                            },
                            {
                                field: 'cancelOrderQSTime',
                                op: 'eq',
                                data: ''
                            }
                        ],
                        //公共函数没有真正清楚时间值，额外在onReset里重置
                        onReset: function () {
                            var customComponent = $(this).parents().find('.single-date-input');
                            _.filter(customComponent, function(v){
                                return v.value = '';
                            });
                        },
                        onSearch: function(){
                            var $grid = $(this);
                            var postData = $(this).jqGrid('getGridParam', 'postData');
                            var gid = $grid.jqGrid('getGridParam', 'gid');
                            var tableId = $('#fbox_'+gid+'-table');

                            var filters = postData.filters.replace(',"groups":[]', '');

                            $(this).jqGrid('getGridParam', 'postData').filters = filters;

                            me.queryFilters = CommonUI.searchFilterBySelect2(tableId, postData, 'cancelOrderSGId');
                            me.queryFilters = CommonUI.searchFilterBySelect2(tableId, postData, 'cancelOrderQSId');
                            me.queryFilters = CommonUI.searchFilterBySelect2(tableId, postData, 'cupsNo');
                        }
                    },
                    del : {
                        msg: "单据删除后无法恢复，<br>是否确认删除？"
                    }
                },
                actionsCol: {
                    width:160,
                    canButtonRender:function(name, opts, rowData){
                        if(name === "edit"){
                          return false;
                        }
                        //编辑1（商管）
                        if(name === "mchtEdit"){
                            if(rowData.type === "1"){
                                if(rowData.dealStatus === '9'){
                                    return false;
                                }
                            }
                            if(rowData.type === "2"){
                                if(rowData.dealStatus === '14'){
                                    return false;
                                }
                            }
                        }
                        //编辑2（清分）
                        if(name === "clearEdit"){
                            if(rowData.type === "1"){
                                if(rowData.dealStatus === '6'){
                                    return false;
                                }
                            }
                        }
                        //删除  需求说都允许删除，把禁止删除的规则去掉，让配置权限的人把权限收紧就行了 只有主管能删单据
                        /*if(name === "del"){
                            if(rowData.type === "1"){
                                if(rowData.dealStatus === '6'){
                                    return true;
                                }
                                if(rowData.dealStatus === '7' || rowData.dealStatus === '8'){
                                    if(rowData.refundedAmt > 0){
                                        return false;
                                    }else {
                                        return true;
                                    }
                                }
                                if(rowData.dealStatus === '9'){
                                    return false;
                                }
                            }
                            if(rowData.type === "2"){
                                if(rowData.dealStatus === '10'){
                                    return true;
                                }
                                if(rowData.dealStatus === '11' || rowData.dealStatus === '12' || rowData.dealStatus === '13'){
                                    if(rowData.refundedAmt > 0){
                                        return false;
                                    }else {
                                        return true;
                                    }
                                }
                                if(rowData.dealStatus === '14'){
                                    return false;
                                }
                            }
                            if(rowData.type === "3"){
                                if(rowData.dealStatus === '15'){
                                    return true;
                                }
                                if(rowData.dealStatus === '16'){
                                    if(rowData.refundedAmt > 0){
                                        return false;
                                    }else {
                                        return true;
                                    }
                                }
                            }
                        }*/
                        //调单释放（清分）
                        if(name === "clearRelease"){
                            if(rowData.type === "1"){
                                if(rowData.dealStatus === '6' || rowData.dealStatus === '9'){
                                    return false;
                                }
                            }
                            if(rowData.type === "2"){
                                if(rowData.dealStatus === '10' || rowData.dealStatus === '14'){
                                    return false;
                                }
                            }
                            if(rowData.type === "3" || rowData.type === "4"){
                                return false;
                            }
                            if(rowData.type === "5"){
                                if(rowData.dealStatus != '20'){
                                    return false;
                                }
                            }
                        }
                    },
                    extraButtons:[
                        {name:'mchtEdit', title:'商管编辑', icon:'icon-pencil',
                            click:function(name, obj, rowData){
                                //商管编辑 1-调单，2-退单，3-退货, 4-短款请款, 5-例外处理
                                me.updateMcht(rowData);
                            }
                        },
                        {name:'clearEdit', title:'清分编辑', icon:'icon-pencil',
                            click:function(name, obj, rowData){
                                //清分编辑 1-调单，2-退单，3-退货, 4-短款请款, 5-例外处理
                                me.updateClear(rowData);
                            }
                        },
                        {name:'clearRelease', title:'编辑释放', icon:'icon-retweet dark',
                            click:function(name, obj, rowData){
                               //清分编辑释放 1-调单，2-退单，3-退货, 4-短款请款, 5-例外处理
                                if(rowData.refundedAmt > 0){
                                    me.updateClearRelease(rowData);
                                }
                                else {
                                    Opf.Toast.warning('该'+ORDER_TYPE[rowData.type]+'尚未扣款');
                                }
                            }
                        }
                    ],
                    del:{},
                    view:{}
                },
                url: url._('settle.cancelorder.search'),
                postData: {
                    filters: function(){
                        return JSON.stringify({
                            groupOp: "AND",
                            rules: [{"field": "dealStatus","op": "in","data": "4"}]
                        })
                    }
                },
                download: {
                    url: url._('settle.cancelorder.download'),
                    titleName: '导出',
                    params: function () {
                        var postData = $(me.grid).jqGrid('getGridParam', 'postData');
                        return { filters: postData.filters };
                    },
                    queueTask: {//不配置就不在任务队列里生成一项，通常都要配置
                        name: function () {
                            return '调单退单退货管理';
                        }
                    }
                },
                colNames: {
                    id:             'ID',
                    createTime:     '录入日期',
                    tradeTime:      '交易时间',
                    mchtName:       '交易商户',
                    mehtremark:     '商户备注',
                    phone:          '商户联系电话',
                    tradeCardNo:    '交易卡号',
                    tradeAmt:       '交易金额',
                    longitude:      '交易经度',
                    latitude:       '交易纬度',
                    updateTime:     '处理时间',
                    type:           '类型',
                    dealStatus:     '处理状态',
                    updateName:     '操作人',
                    remark:         '备注',
                    contactStatus:  '联系状态',
                    cancelReasonCode: '退单原因',
                    cancelType:     '退单类型',
                    refundedAmt: '扣款释放金额',
                    debitReleaseTime: '扣款释放时间',
                    cancelOrderSG: '商管处理人',
                    cancelOrderQS: '清算处理人  ',
                    cancelOrderSGTime: '商管处理时间',
                    cancelOrderQSTime: '清算处理时间',
                    cupsNo: '交易渠道',
                    dealResult: '处理结果',
                    cancelOrderSGId: '商管处理人',
                    cancelOrderQSId: '清算处理人'
                },
                colModel: [
                    {name: 'id', hidden: true},
                    {name: 'createTime', formatter: dateFormatter},
                    {name: 'tradeTime', formatter: dateTimeFormatter},
                    {name: 'mchtName'},
                    {name: 'mehtremark', hidden:true},
                    {name: 'phone', search: true,
                        searchoptions: {
                            sopt: ['lk']
                        }
                    },
                    {name: 'tradeCardNo', search: true,
                        searchoptions: {
                            sopt: ['lk']
                        }
                    },
                    {name: 'tradeAmt', search: true,
                        searchoptions: {
                            sopt: ['eq']
                        }
                    },
                    {name: 'longitude',hidden:true, viewable:true},
                    {name: 'latitude',hidden:true, viewable:true},
                    {name: 'updateTime', formatter: timeFormatter, hidden: true, viewable:false},
                    {name: 'type', formatter : typeFormatter,
                        search: true,
                        stype: 'select',
                        searchoptions: {
                            sopt: ['eq'],
                            value: TYPE_MAP,
                            dataInit: function (elem) {
                                $(elem).on('change', function(){
                                    ck_type = $(this).val();
                                    ck_skip_num = 1;
                                    ck_skip_num2 = 0;
                                });
                            }
                        }
                    },
                    {name: 'dealStatus', formatter: statusFormatter,
                        search: true,
                        stype: 'select',
                        searchoptions: {
                            sopt: ['eq'],
                            value: CHECK_STATUS_MAP,
                            dataInit: function (elem) {
                                $(elem).on('focus', function(){
                                    var me = this;
                                    var selectTpl = '';
                                    ck_skip_num2 += 1;
                                    if(ck_skip_num == ck_skip_num2){
                                        var type = ck_type;
                                        var dealStatus;
                                        if(type == '1'){
                                            dealStatus = CHECK_STATUS_MAP;
                                        }
                                        else if(type == '2') {
                                            dealStatus = RETURN_ORDER_STATUS_MAP;
                                        }
                                        else if(type == '3'){
                                            dealStatus = RETURN_GOODS_STATUS_MAP;
                                        }
                                        else if(type == '4'){
                                            dealStatus = RETURN_PAYOFF_STATUS_MAP;
                                        }
                                        else if(type == '5'){
                                            dealStatus = RETURN_EXCEPTION_STATUS_MAP;
                                        }
                                        else{
                                            dealStatus = CHECK_STATUS_MAP;
                                        }

                                        _.each(dealStatus, function(v, i){
                                            selectTpl += '<option role="option" value="'+i+'">'+v+'</option>';
                                        });
                                       $(me).empty().append($(selectTpl));
                                    }
                                });
                            }
                        }
                    },
                    {name: 'updateName',hidden:true},
                    {name: 'remark',hidden:true},
                    {name: 'contactStatus',hidden:true, formatter:contactStatusFormatter},
                    {name: 'cancelReasonCode',hidden:true, formatter:cancelReasonCodeFormatter},
                    {name: 'cancelType',hidden:true, formatter:cancelTypeFormatter},
                    {name: 'refundedAmt',hidden:true},
                    {name: 'debitReleaseTime',hidden:true},
                    {name: 'cancelOrderSG'},
                    {name: 'cancelOrderSGTime', formatter: dateFormatter},
                    {name: 'cancelOrderQS'},
                    {name: 'cancelOrderQSTime', formatter: dateFormatter},
                    {name: 'cupsNo', hidden:true, search: true},
                    {name: 'dealResult', hidden:true,
                        search: true,
                        stype: 'select',
                        searchoptions: {
                            sopt: ['eq'],
                            value: DEALRESULT_MAP
                        }
                    },
                    {name: 'cancelOrderSGId', hidden:true, search: true},
                    {name: 'cancelOrderQSId', hidden:true, search: true}
                ],
                // filters: [{
                //     caption: '条件过滤',
                //     defaultRenderGrid: false,
                //     canClearSearch: true,
                //     canSearchAll: true,
                //     isSearchRequired: 3, //true/false/number:最少{number}项
                //     isSearchRequiredMsg: '请至少输入三项查询条件，还需要输入一项查询条件',
                //     components: [
                //         {
                //             label: '交易卡号/尾号',
                //             name: 'tradeCardNo',
                //             options: {
                //                 sopt:['llk']
                //             }
                //         },
                //         {
                //             type: 'rangeDate',
                //             label: '录入日期',
                //             ignoreFormReset: true,
                //             limitDate: moment(),
                //             defaultValue: '',
                //             name: 'createTime'
                //         },
                //         {
                //             type: 'rangeDate',
                //             label: '交易时间',
                //             defaultValue: '',
                //             limitDate: moment(),
                //             name: 'tradeTime'
                //
                //         },
                //         {label: '商户联系电话', name: 'phone', options: {sopt:['eq']}},
                //         {label: '交易金额', name: 'tradeAmt', options: {sopt:['eq']}},
                //         {
                //             label: '处理类型',
                //             name: 'type',
                //             type: 'select',
                //             defaultValue: '0',
                //             options: {
                //                 sopt: ['eq'],
                //                 value: TYPE_MAP
                //             }
                //         },
                //         {
                //             label: '状态',
                //             name: 'dealStatus',
                //             type: 'select',
                //             defaultValue: '0',
                //             options: {
                //                 sopt: ['eq'],
                //                 value: CHECK_STATUS_MAP
                //             }
                //         }
                //     ],
                //     searchBtn: {
                //         text: '搜索'
                //     }
                    /*,
                    beforeSubmit: function(postData) {
                        var filter = new commonFiltersFieldset();
                        return filter.clickFilterSearchSubmitBtn();
                    }*/
                //}],
                loadComplete: function() {}
            }));
            return me.grid;
        },
        updateMcht: function(rowData){
            var me = this;
            require(['app/oms/settle/cancel-order/mcht-edit-view'], function(MchtEditView){
                var model = new Backbone.Model(rowData);
                var title = "商管编辑"+ TYPE_MAP[rowData.type];
                var mchtEditView = new MchtEditView({model:model}).render();
                var $dialog = Opf.Factory.createDialog(mchtEditView.$el, {
                    destroyOnClose:true,
                    width:450,
                    height:600,
                    modal:true,
                    title:title,
                    buttons:[{
                        type:'submit',
                        text:'保存',
                        click: function(){
                            mchtEditView.submit(rowData.id,function(){
                                $dialog.dialog('close');
                                me.grid.trigger('reloadGrid');
                            });
                        }
                    }, {
                        type:'cancel',
                        text:'关闭'
                    }]
                });
            });
        },
        updateClear:function(rowData){
            var me = this;
            require(['app/oms/settle/cancel-order/clear-edit-view'], function(ClearEditView){
               var model = new Backbone.Model(rowData);
                var title = "清分编辑"+ TYPE_MAP[rowData.type];
                var clearEditView = new ClearEditView({model:model}).render();
                var $dialog = Opf.Factory.createDialog(clearEditView.$el, {
                    destroyOnClose:true,
                    width:450,
                    height:600,
                    modal:true,
                    title:title,
                    buttons:[{
                        type:'submit',
                        text:'保存',
                        click: function(){
                            var $input = $('input[name="refundedAmt"]');
                            var $timeInput = $('input[name="chargeTime"]');
                            var refundedAmt = $input.val();
                            var chargeTime = $timeInput.val();
                            var debitReleaseTime = $('[name="debitReleaseTime"]').val();

                            $input.on("focus", function(){
                                $('span[name="refundedAmtInfo"]').css("visibility","hidden");
                            });
                            $timeInput.on("focus", function(){
                                $('span[name="chargeTimeInfo"]').css("visibility","hidden");
                            });
                            if(refundedAmt<0 || refundedAmt===""){
                                $('span[name="refundedAmtInfo"]').css("visibility","visible");
                                $('span[name="refundedAmtInfo"]').html('请输入大于等于0的数字');
                            }
                            else if(refundedAmt > rowData.tradeAmt){
                                $('span[name="refundedAmtInfo"]').css("visibility","visible");
                                $('span[name="refundedAmtInfo"]').html('扣款金额应小于交易金额');
                            }
                            else if(chargeTime===""){
                                $('span[name="chargeTimeInfo"]').css("visibility","visible");
                            }
                            else if(refundedAmt > 0 && debitReleaseTime===""){
                                $('span[name="chargeTimeInfo"]').css("visibility","visible");
                            }
                            else {
                                //TODO 提交数据
                                clearEditView.submit(rowData.id,function(){
                                    $dialog.dialog('close');
                                    me.grid.trigger('reloadGrid');
                                });
                            }
                        }
                    }, {
                        type:'cancel',
                        text:'关闭'
                    }]
                });
            });
        },
        updateClearRelease:function(rowData){
          var me = this;
          require(['app/oms/settle/cancel-order/clearrelease-edit-view'], function(ClearReleaseEditView){
              var model = new Backbone.Model(rowData);
              var title = "编辑释放"+ TYPE_MAP[rowData.type];
              var clearReleaseEditView = new ClearReleaseEditView({model:model}).render();
              var $dialog = Opf.Factory.createDialog(clearReleaseEditView.$el, {
                  destroyOnClose:true,
                  width:450,
                  height:600,
                  modal:true,
                  title:title,
                  buttons:[{
                      type:'submit',
                      text:'保存',
                      click:function(){
                          var $input = $('input[name="refundedAmt"]');
                          var $timeInput = $('input[name="chargeTime"]');
                          var refundedAmt = $input.val();
                          var chargeTime = $timeInput.val();
                          $input.on("focus", function(){
                              $('span[name="refundedAmtInfo"]').css("visibility","hidden");
                          });
                          $timeInput.on("focus", function(){
                              $('span[name="chargeTimeInfo"]').css("visibility","hidden");
                          });

                          if(refundedAmt<0 || refundedAmt===""){
                              $('span[name="refundedAmtInfo"]').css("visibility","visible");
                          }
                          else if(refundedAmt > 0 && chargeTime===""){
                              $('span[name="chargeTimeInfo"]').css("visibility","visible");
                          }
                          else if(chargeTime===""){
                              $('span[name="chargeTimeInfo"]').css("visibility","visible");
                          }
                          else {
                              //TODO 提交数据
                              clearReleaseEditView.submit(rowData.id,function(){
                                  $dialog.dialog('close');
                                  me.grid.trigger('reloadGrid');
                              });
                          }
                      }
                  }, {
                      type:'cancel',
                      text:'关闭'
                  }]
              });
          })
        },
        typeChange: function(){
            var me = this.$el;
            var type = me.find('.type-dropdown>button').attr('ref'); //this.$el.find('input[name="type-radio"]:checked').val();
            //var $statusGroup = me.find('.dealStatus-form-group');
            // if(type == '0'){
            //     $statusGroup.hide();
            //     return;
            // }else{
            //     $statusGroup.show();
            // }
            var dealStatus;
            if(type == '1'){
                dealStatus = CHECK_STATUS_MAP;
            }
            else if(type == '2') {
                dealStatus = RETURN_ORDER_STATUS_MAP;
            }
            else if(type == '3'){
                dealStatus = RETURN_GOODS_STATUS_MAP;
            }
            else if(type == '4'){
                dealStatus = RETURN_PAYOFF_STATUS_MAP;
            }
            else if(type == '5'){
                dealStatus = RETURN_EXCEPTION_STATUS_MAP;
            }
            else{
                dealStatus = CHECK_STATUS_MAP;
            }
            var conditionItems = convertValue(dealStatus);

            var dropDownTpl = switchableDropdownTplFn({
                data: {
                    cls: 'dealStatus-dropdown dropdown-select',
                    defaultValue: '0',
                    menu: conditionItems
                }
            });
            me.find('.dealStatus-dropdown>.dropdown-menu').parent().empty().append($(dropDownTpl));

            // var tpl = RadioTpl({data:{
            //     cls: 'dealStatus-radio',
            //     defaultValue: '0',
            //     options: conditionItems
            // }});
            //me.find('.dealStatus-radio').parent().empty().append($(tpl));
        }
    });

    function contactStatusFormatter(val){
        return CONTACT_STATUS[val] || '';
    }

    function cancelReasonCodeFormatter(val){
        return CANCEL_REASON_CODE[val] || '';
    }

    function cancelTypeFormatter(val){
        return CANCEL_TYPE[val] || '';
    }

    function typeFormatter(val){
        return TYPE_MAP[val] || '';
    }

    function statusFormatter(val,obj,rowData){
        return rowData.type == '1' ? CHECK_STATUS_MAP[val] || '' : rowData.type == '2' ? RETURN_ORDER_STATUS_MAP[val] || '' : rowData.type == '3' ? RETURN_GOODS_STATUS_MAP[val] || '' : rowData.type == '4' ? RETURN_PAYOFF_STATUS_MAP[val] ||'': rowData.type == '5' ? RETURN_EXCEPTION_STATUS_MAP[val] || '' : '';
    }

    function getAddButtonTpl() {
        return '<button class="add-btn">新增</button>';
    }

    function getExportButtonTpl() {
        return '<button class="btn export-btn">导出</button>';
    }

    function convertValue (objList) {
        return _.map(objList, function (val, key) {
            return { label: val, value: key};
        });
    }

    function dateTimeFormatter(val) {
        return val ? moment(val, 'YYYYMMDDHHmmss').format('YYYY/MM/DD HH:mm:ss') : '';
    }

    function timeFormatter(val) {
        return val ? moment(val, 'YYYYMMDDHHmm').format('YYYY/MM/DD HH:mm') : '';
    }

    function dateFormatter(val) {
        return val ? moment(val, 'YYYYMMDD').format('YYYY/MM/DD') : '';
    }

    App.on('exception:cancelOrder:list',function(){
        App.show(new View());
    });

    return View;
});
