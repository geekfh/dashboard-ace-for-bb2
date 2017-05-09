/**
 * Created by wupeiying on 2015/7/30.
 */

define(['App',
    'tpl!app/oms/settle/settle-txn/list/templates/txn-histroy.tpl',
    'i18n!app/oms/common/nls/settle',
    'jquery.jqGrid',
    'bootstrap-datepicker',
    'moment.override',
    'select2'
], function(App, txnHistoryTpl, settleLang) {

    var RESULTFLAG_MAP = {
        "0": "入账成功",
        "1": "入账失败",
        "2": "超时",
        "3": "入账受理成功",
        "4": "提交请求",
        "5": "已拆分批次",
        "6": "初始化信息",
        "7": "暂停清算",
        "8": "已处理"
    };

    var RESULTFLAG_VALUE = {
        'INIT_INFO': '6', // 初始化信息
        'STOP_SETTLE': '7', // 暂停清算
        'HAD_SPLIT_BATCH': '5', // 已拆分批次
        'RECORDED_SUCCESS': '0' // 入账成功
    };

    //数据库原先是1，对公，2，对私。现在改为0、对公，1、对私。
    var SETTLEACCTTYPE_MAP = {
        "0" : settleLang._("settle-txn.settleAcctType.0"),
        "1" : settleLang._("settle-txn.settleAcctType.1")
    };

    // 默认生成清算日期=当天的数据
    var default_settleDate = {
        "groupOp": "AND",
        "rules": [
            {"field":"settleDate","op":"eq","data": moment().format('YYYYMMDD')}
        ]
    };

    var STAT_MAP = {
        settleAmtSuccess: "入账成功",
        settleAmtFail: "入账失败",
        settleAmtInitial: "初始化状态",
        totalSettleAmt: "清算金额",
        count: "笔数",
        noBatchCount: "未分批次笔数"
    };

    var DISC_CYCLE_MAP = {
        T000: 'T000',
        T001: 'T001',
        T002: 'T002',
        T003: 'T003',
        T004: 'T004',
        T005: 'T005',
        T006: 'T006',
        T007: 'T007',
        T008: 'T008',
        T009: 'T009'
    };

    var CHECK_ALL_BY_FULTER = 'filters',
        CHECK_BY_DEFAULT = 'default';


    //TO秒到状态处理
    var changeState = function (me, rowData) {
        var tpl = [
            '<form class="form-faster-check"><div class="container">',
                '<style type="text/css">.form-faster-check .col-xs-3{text-align: right;}</style>',
                '<div class="container">',
                    '<div class="row settle-styles-row">',
                        '<div class="col-xs-3">处理结果：</div>',
                        '<div class="col-xs-9">',
                            '<select name="dealResult">',
                                '<option value="1">入账成功</option>',
                                '<option value="2">入账失败(待审)</option>',
                            '</select>',
                        '</div>',
                    '</div>',
                    '<div class="row settle-styles-row">',
                        '<div class="col-xs-3">处理描述：</div>',
                        '<div class="col-xs-9">',
                            '<textarea name="dealDesc" style="width:280px;height:120px;"></textarea>',
                        '</div>',
                    '</div>',
                '</div>',
            '</div></form>'
        ].join('');

        var rules = {
            dealDesc: { required:true, maxlength: 200 }
        };
        var $dialogForm = $(tpl);

        var $dialog = Opf.Factory.createDialog($dialogForm, {
            destroyOnClose: true,
            title: "处理状态",
            width: 480,
            height: 360,
            autoOpen: true,
            modal: true,
            buttons: [{
                type: 'submit',
                text: '提交',
                className: 'submit',
                icons: { primary: 'icon-ok' },
                click: function () {
                    //发送审核通过/拒绝的信息
                    var isValid = $dialogForm.validate().form();
                    if(isValid){
                        //提交审核信息
                        var ajaxOptions = {
                            url: url._(me.getCheckUrl(), {id: rowData.id}),
                            type: 'PUT',
                            contentType: "application/json",
                            jsonData: Opf.Util.getFormData($dialogForm),
                            success: function(){
                                $dialog.trigger('dialogclose');
                                me.grid.trigger("reloadGrid", [{current: true}]);
                            }
                        };
                        Opf.ajax(ajaxOptions);
                    }
                }
            },{
                type: 'cancel'
            }]
        });
        Opf.Validate.addRules($dialogForm, {rules: rules});
    };

    var tpl = [
        '<div class="row">',
            '<div class="col-xs-12 jgrid-container">',
                '<table id="settle-t0-faster-grid-table"></table>',
                '<div id="settle-t0-faster-grid-pager" ></div>',
            '</div>',
        '</div>'
    ].join('');


    var View = Marionette.ItemView.extend({
        tabId: 'menu.t0.faster.txn',
        template: _.template(tpl),

        onRender: function() {
            var me = this;
            // 用于标识 navBtn 是否点击过操作
            me.handleNavBtn = false;
            me.respData = null;
            me.navBtnUrl = me.getNavBtnUrl();

            // 表格列标题左边的复选框
            me.hasFuckCheckBox = false;

            _.defer(function () {
                var $grid = me.renderGrid();
                me.checkType = CHECK_BY_DEFAULT;
            });
        },

        getRequestDateSelect: function(gird) {
            var data = {};

            data['id'] = Opf.Grid.getSelRowId(gird);
            data["status"] = "0";
            data['remark'] = $('form.form-settle-txn').find('textarea[name="remark"]').val();

            console.log('faster: ' + data);
            var options = {
                url:'api/settle/txns/' + data['id'] + '/sta',
                data:data,
                type:'PUT',
                contentType:'application/json',
                dataType:'json',
                needData:true
            };
            return options;
        },

        ajaxRequest: function(options, dialog, roleGird) {
            $.ajax({
                type: options.type,
                contentType: options.contentType,
                dataType: options.dataType,
                url: options.url,
                data: options.needData ? JSON.stringify(options.data) : "",
                success: function(resp) {
                    console.log(resp);
                    $(dialog).dialog("destroy");
                    $(roleGird).trigger("reloadGrid", [{current:true}]);
                    if(resp.success) {
                        Opf.Toast.success('操作成功');
                    }
                },
                error: function(resp) {
                    console.log(resp);
                    $(dialog).dialog("destroy");

                }
            });
        },

        isSelectedAll: function () {
            return this.checkType === CHECK_ALL_BY_FULTER;
        },

        attachValidation: function() {
            return {
                setupValidation: Opf.Validate.setup,
                addValidateRules: function(form) {
                    Opf.Validate.addRules(form, {
                        rules:{
                            batchNo:{
                                required: true,
                                number: true
                            },
                            settleDate:{
                                required: true,
                                date: true
                            },
                            inDate: {
                                required: true,
                                date: true
                            },
                            traceNo:{
                                required: true,
                                number: true
                            },
                            resultFlag:{
                                required: true
                            },
                            retNo:{
                                required: true,
                                number: true
                            },
                            retCode:{
                                required: true,
                                number: true
                            },
                            retMsg:{
                                required: true,
                                maxlength: 100
                            },
                            mchtNo:{
                                required: true,
                                number: true
                            },
                            settleBrhId:{
                                required: true,
                                number: true
                            },
                            settleAcctType:{
                                required: true
                            },
                            settleBankNo:{
                                required: true,
                                number: true
                            },
                            settleBankNm:{
                                required: true
                            },
                            settleBankAddr:{
                                required: true,
                                maxlength: 100
                            },
                            settleBankCode:{
                                required: true,
                                number: true
                            },
                            settleAcctNm:{
                                required: true,
                                namechars: true
                            },
                            settleAcct:{
                                required: true,
                                number: true
                            },
                            settleAmt:{
                                required: true,
                                float: true
                            },
                            otherAmt:{
                                required: true,
                                float: true
                            },
                            remark:{
                                required: true,
                                maxlength: 100
                            },
                            recCreateTime:{
                                required: true,
                                date: true
                            },
                            recUpdTime:{
                                required: true,
                                date: true
                            }
                        }
                    });
                }
            };

        },

        onClickButton: function(roleGird) {
            var me = this;
            var tpl = settleTxnTpl();
            var $dialog = $(tpl).dialog({
                autoOpen: true,
                height: Opf.Config._('ui', 'settleTxn.grid.form.extra.height'),  // 300,
                width: Opf.Config._('ui', 'settleTxn.grid.form.extra.width'),   // 350,
                modal: true,
                buttons: [{
                    html: "<i class='icon-ok'></i>&nbsp; 确认提交",
                    "class" : "btn btn-xs btn-primary",
                    click: function(e) {
                        var $form = $('form.form-settle-txn');
                        var validator = $form.validate();
                        var valid = true;
                        if(validator && !validator.form()){
                            valid = false;
                        }

                        if(valid) {
                            $($(e.target).closest('button')).addClass('disabled').find('span').html("<i class='icon-ok'></i>&nbsp; 正在提交...");
                            me.ajaxRequest(me.getRequestDateSelect(roleGird), this, roleGird);

                        }
                    }
                }, {
                    html: "<i class='icon-remove'></i>&nbsp; 取消",
                    "class" : "btn btn-xs",
                    click: function() {
                        $(this).dialog("destroy");
                    }
                }],
                create: function() {
                    Opf.Validate.addRules($('form.form-settle-txn'), {
                        rules: {
                            remark: 'required'

                        }
                    });

                    $(this).prev('.ui-widget-header').find('.ui-dialog-title').addClass('settle-styles-paddingL-15');
                },
                close: function() {
                    $(this).dialog("destroy");
                }
            });
        },

        checkedAll: function () {
            var me = this;

            me.checkType = CHECK_ALL_BY_FULTER;

            _.each(me.getUnSelectedIds(), function (rowId) {
                me.grid.setSelection(rowId);
            });
        },

        uncheckedAll: function () {
            var me = this;

            me.checkType = CHECK_BY_DEFAULT;

            _.each(_.clone(me.getSelectedIds()), function (rowId) {
                me.grid.setSelection(rowId);
            });
        },

        getRowDataIds: function () {
            return _.pluck($(this.grid).jqGrid('getRowData'), 'id');

        },

        getSelectedSettleDates: function () {
            return _.pluck(this.getSelectedData(), 'settleDate');
        },

        getSelectedIds: function () {
            return _.clone(Opf.Grid.getSelRowIds(this.grid));
        },

        getUnSelectedIds: function () {
            var me = this;
            var rowIds = me.getRowDataIds();

            return _.filter(rowIds, function (id) {
                return !_.weekContains(Opf.Grid.getSelRowIds(me.grid), id);
            });
        },

        getSelectedData: function () {
            var me = this;
            var rowIds = me.getSelectedIds();
            var rowData = $(me.grid).jqGrid('getRowData');

            return _.filter(rowData, function (item) {
                return _.weekContains(rowIds, item.id);
            });
        },

        getNavBtnUrl: function () {
            return {
                singleBatch: url._('settle.t0.faster.single.batch'),
                divideBatch: url._('settle.t0.faster.divide.batch'),
                stopSettle: url._('settle.t0.faster.stop.settle'),
                recoverySettle: url._('settle.t0.faster.recovery.settle'),
                setSuccess: url._('settle.t0.faster.set.success'),
                download: url._('settle.t0.faster.txn.download')
            };
        },

        checkNavBtnPermisson: function (btnName) {
            return Ctx.avail('settleTxn.' + btnName) || btnName == 'checkedAll';
        },

        getSettleNumVal: function () {
            return 'TN';
        },

        addNavBtn: function (options) {
            //if(this.checkNavBtnPermisson(options.name)){
            //
            //}
            Opf.Grid.navButtonAdd(this.grid, {
                caption: options.caption,
                name: options.name,
                title: options.title,
                buttonicon: options.buttonicon,
                onClickButton: options.onClickButton,
                position: "last"
            });
        },

        doBtnAjax: function (url, params) {
            var me = this;
            me.handleNavBtn = true;
            return Opf.ajax({
                type: 'PUT',
                url: url,
                data: JSON.stringify(params),
                success: function () {
                    Opf.Toast.success('操作成功');
                    $(me.grid).trigger("reloadGrid", [{current:true}]);
                }
            });
        },

        showSingleBatchDialog: function () {
            var me = this;
            var params = me.getNavBtnParamsByFlag(RESULTFLAG_VALUE.INIT_INFO);
            var singleBatchUrl = me.navBtnUrl.singleBatch;

            // T+1 清算流水单独成批的时候需要在url 后面加个 setleDate 参数，并且要求选择的记录的清算日期要一样
            if(me.getSettleNumVal() == 'TN'){
                var settleDateList = me.getSelectedSettleDates();
                var _settleDate = _.uniq(settleDateList);

                // 如果去重后新数组的长度大于1，说明至少有两个不同的清算日期
                if(_settleDate.length > 1){
                    Opf.alert('T+1 的清算中，单独成批操作所选择的记录的清算日期要相同。');
                    return;
                }else{
                    singleBatchUrl = singleBatchUrl + '?settleDate=' + _settleDate[0];
                }
            }

            if(params){
                me.showDialog({
                    title: '备注信息',
                    tpl: getSingleBatchTpl(),
                    rules: {
                        message: {
                            required: true,
                            maxlength: 20
                        }
                    },
                    onClickCallBack: function (dialogForm) {
                        var $dialogForm = $(dialogForm);
                        var valid = $dialogForm.validate().form();

                        if(valid){
                            $.extend(params, {message: $dialogForm.find('[name="message"]').val()});
                            me.doBtnAjax(singleBatchUrl, params);//url
                            $dialogForm.trigger('dialogclose');
                        }
                    }
                });
            }
        },

        showDivideBatchDialog: function () {
            var me = this;

            me.showDialog({
                title: '划分批次',
                tpl: getDivideBatchTpl(),
                height: 350,
                rules: {
                    value: {
                        required: true,
                        number: true,
                        range: [0,999999]
                    }
                },
                beforeShowDialog: function (dialog) {
                    var $dialog = $(dialog);
                    var $settleDate = $dialog.find('[name="settleDate"]');
                    var $cupsNum = $dialog.find('[name="cupsName"]');

                    $settleDate.datepicker({autoclose: true,format: 'yyyymmdd'});
                    $settleDate.datepicker('update', moment().format('YYYY-MM-DD'));

                    $settleDate.on('change.date', function () {
                        Opf.ajax({
                            type:'GET',
                            url: url._('settle.txn.divide.batch.count'),
                            data: {
                                settleDate: $settleDate.val(),
                                settleNum: 'T088'//写死 me.getSettleNumVal()
                            },
                            success: function (data) {
                                $dialog.find('#batch-count').text(data.totalBoBatchCount);
                                $dialog.find('#batch-amount').text(data.totalBoBatchAmount);
                            }
                        });
                    }).trigger('change.date');

                    $cupsNum.on('change', function () {
                        Opf.ajax({
                            type:'GET',
                            url: url._('settle.txn.divide.batch.count'),
                            data: {
                                settleDate: $settleDate.val(),
                                settleNum: 'T088',//me.getSettleNumVal(),
                                cupsNo: $cupsNum.val()
                            },
                            success: function (data) {
                                $dialog.find('#batch-count').text(data.totalBoBatchCount);
                                $dialog.find('#batch-amount').text(data.totalBoBatchAmount);
                            }
                        });
                    });

                    //渠道名称
                    $dialog.find('[name="cupsName"]').select2({
                        placeholder: '所有',
                        minimumResultsForSearch: Infinity,
                        width: '180px',
                        ajax: {
                            type: 'GET',
                            //url: url._('cups.name'),
                            url: url._('settle.one.txn.cups'),
                            async: false,
                            dataType: 'json',
                            results: function (data, page) {
                                var arr_data = [];
                                arr_data.push({value: '', name: '所有'});
                                $.each(data, function(i, v){
                                    var value = v.value;
                                    var name = v.name;
                                    arr_data.push({value: value, name: name});
                                });
                                return {
                                    results: arr_data
                                };
                            }
                        },
                        id: function (e) {
                            return e.value;
                        },
                        formatResult: function(data, container, query, escapeMarkup){
                            return data.name;
                        },
                        formatSelection: function(data, container, escapeMarkup){
                            return data.name;
                        }
                    });
                    //$dialog.find('[name="cupsName"]').select2('data').setValue('所有');
                },
                onClickCallBack: function (dialogForm) {
                    var $dialogForm = $(dialogForm);
                    var valid = $dialogForm.validate().form();
                    var settleDate = $dialogForm.find('[name="settleDate"]').val();
                    var value = $dialogForm.find('[name="value"]').val();
                    var name = $dialogForm.find('[name="name"]').val() || '';
                    var cupsValue = $dialogForm.find('[name="cupsName"]').val() == "" ?
                        "" :
                        $dialogForm.find('[name="cupsName"]').select2('data').value;
                    //if(cupsValue == ""){
                    //    Opf.alert('请选择渠道名称！');
                    //    return false;
                    //}
                    //else if(valid){
                        $dialogForm.trigger('dialogclose');
                        // 根据划分批次的数量来定进度完成的大概时间，暂时定为 50 毫秒完成 1 条数据
                        Opf.UI.setProgress(me.$el, true, {title:'划分批次中，请稍后...', totalTime: 50*value});
                        me.doBtnAjax(me.navBtnUrl.divideBatch +'?settleDate='+ settleDate + '&cupsNo=' + cupsValue, {
                            value: value,
                            name: name || ''
                        }).done(function () {
                            Opf.UI.setProgress(me.$el, false);
                        });
                    //}
                }

            });
        },

        showSetSuccessDialog: function (roleGird) {
            var me = this;
            var params = me.getNavBtnParamsByFlag('noNeedFlag');

            if(params){
                //var selectId = Opf.Grid.getLastSelRowId(roleGird);
                var arr_params = params.settleTxnIds;
                for(var i = 0; i < arr_params.length; i++){
                    var rowData = roleGird.getRowData(arr_params[i]);
                    if(rowData.resultFlag != 6){//初始化信息状态才能弹出框
                        Opf.alert('只有状态为初始化信息才能设置.');
                        return false;
                    }
                }

                me.showDialog({
                    title: '备注信息',
                    tpl: getSingleBatchTpl(),
                    rules: {
                        message: {
                            required: true,
                            maxlength: 20
                        }
                    },
                    onClickCallBack: function (dialogForm) {
                        var $dialogForm = $(dialogForm);
                        var valid = $dialogForm.validate().form();

                        if(valid){
                            $.extend(params, {message: $dialogForm.find('[name="message"]').val()});
                            var ajaxDeffer = me.doBtnAjax(me.navBtnUrl.setSuccess, params);
                            ajaxDeffer.done(function (data) {
                                if(data.success !== false){
                                    Opf.alert('"设为成功"操作请求成功！');
                                }
                            });
                            $dialogForm.trigger('dialogclose');
                        }
                    }
                });
            }
        },

        showDialog: function (options) {
            var rules = options.rules;
            var $dialogForm = $(options.tpl);

            Opf.Validate.addRules($dialogForm, {rules: rules});

            if(options.beforeShowDialog && _.isFunction(options.beforeShowDialog)){
                options.beforeShowDialog($dialogForm);
            }

            var $dialog = Opf.Factory.createDialog($dialogForm, {
                destroyOnClose: true,
                title: options.title,
                width: options.width || 350,
                height: options.height || 260,
                autoOpen: true,
                modal: true,
                buttons: [{
                    type: 'submit',
                    text: '确定',
                    click: function () {
                        options.onClickCallBack($dialog);
                    }
                },{
                    type: 'cancel'
                }]
            });
        },

        checkSelected: function () {
            if(this.getSelectedIds().length === 0) {
                Opf.alert('请至少选中一条记录');
                return false;
            }
            return true;
        },

        getNavBtnParamsByFlag: function (flag) {
            var me = this;
            if(me.checkSelected()){
                // 默认是手动选中若干个记录，不需要查询条件作为参数
                var params = {
                    mark: '0',
                    filters: '',
                    settleTxnIds: me.getSelectedIds()
                };

                if(me.isSelectedAll()){
                    // 如果是全选，则需要查询条件作为参数，但不需要判断结果标示
                    var postData = $(me.grid).jqGrid('getGridParam', 'postData');
                    params.mark = '1';
                    params.filters = postData.filters;
                    params.settleTxnIds = [];

                    return params;

                }else if(me.checkflagsAllEq(flag)) {
                    // 如果不是全选，则需要判断结果标示，
                    // 当判断结果为false,则弹出提示
                    return params;
                }
            }
            return false;
        },

        checkflagsAllEq: function (flag) {
            if(flag == 'noNeedFlag'){
                // 如果结果标示设置为 noNeedFlag，则直接返回true
                return true;
            }else{
                var flagsAllEq = true;
                var selectedRowDatas = this.getSelectedData();

                _.each(selectedRowDatas, function (item) {
                    if(item.resultFlag != flag){
                        flagsAllEq = false;
                    }
                });

                if(!flagsAllEq){
                    Opf.alert({
                        title:'选中记录的结果标示应该都为：' + RESULTFLAG_MAP[flag],
                        message:'请重新选择 !'
                    });
                }
                return flagsAllEq;
            }
        },

        gridOptions: function (options) {
            return options;
        },

        fuckCheckBox: function () {
            var me = this;
            var $checkboxWrap = me.$el.find('#jqgh_settle-txns-grid-table_cb');
            // 干掉列标题最左边的的复选框
            if($checkboxWrap.length){
                $checkboxWrap.remove();
            }
        },

        getSettleNumIsNeed: function () {
            return false;
        },

        getCheckUrl: function () {
            return 'settle.t0.faster.txn.failDown';
        },
        extraOperateAjax: function (url) {
            var grid = this.grid;
            return Opf.ajax({
                type:'GET',
                url: url,
                success: function () {
                    Opf.Toast.success('操作成功');
                },
                complete: function () {
                    $(grid).trigger("reloadGrid", [{current:true}]);
                }
            });
        },
        renderGrid: function() {
            var me = this;
            var validation = this.attachValidation();
            var roleGird = me.grid = App.Factory.createJqGrid(me.gridOptions({
                rsId:'settleFasterTxn',
                caption: '清算流水',
                stats:{
                    labelConfig:STAT_MAP,
                    items:[
                        {name: 'settleAmtSuccess', type:'currency'},
                        {name: 'settleAmtFail', type:'currency'},
                        {name: 'settleAmtInitial', type:'currency'},
                        {name: 'totalSettleAmt', type:'currency'},
                        {name: 'count', type:'count'},
                        {name: 'noBatchCount', type:'count'}
                    ]
                },
                download: {
                    url: me.navBtnUrl.download,
                    //必须返回对象
                    params: function () {
                        var postData = $(roleGird).jqGrid('getGridParam', 'postData');
                        return { filters: postData.filters };
                    },
                    queueTask: {//不配置就不在任务队列里生成一项，通常都要配置
                        name: function () {
                            return '清算流水表';
                        }
                    }
                },
                altRows: true,
                multiselect: true,
                multiboxonly: false,
                tableCenterTitle: 'S0 清算流水',
                actionsCol: {
                    edit : false,
                    del: false,
                    width: 100,
                    extraButtons: [
                        {   name: 'changestate', caption:'', title:'处理',
                            icon: 'icon-opf-process-account icon-opf-process-account-color',
                            click: function(name, opts, rowData) {
                                changeState(me, rowData);
                            }
                        },
                        {
                            name: 'history', title: '出款历史记录', icon: 'icon-table',
                            click: function(name, opts, rowData){
                                require(['app/oms/settle/common/settle-common'], function(View){
                                    var view = new View({id: rowData.id}).render();
                                    view.showDialog(view);
                                    view.$el.on('reloadParentGrid',function(){
                                        me.grid.trigger('reloadGrid');
                                    });
                                });
                            }
                        }
                    ],
                    canButtonRender: function(name, opts, rowData) {
                        if(name === 'changestate'){
                            return canShowCheckAccount(rowData);
                        }
                    }
                },
                postData: {
                    filters: JSON.stringify(default_settleDate)
                },
                nav: {
                    search: {
                        width: 500,
                        customComponent: {
                            items: [
                                {
                                    type: 'singleOrRangeDate',
                                    label: '清算日期',
                                    name: 'settleDate',
                                    limitRange: 'month',
                                    data: moment().format('YYYYMMDD')
                                }
                            ]
                        },
                        // 点击重置按钮时，搜索条件保留以下值
                        resetReserveValue: [
                            {
                                field: 'settleDate',
                                op: 'ge',
                                data: moment().subtract('day',1).format('YYYYMMDD')
                            },{
                                field: 'settleDate',
                                op: 'le',
                                data: moment().format('YYYYMMDD')
                            }
                        ],
                        afterRedraw: function (){
                            var arr_input = $(this).find('input');
                            _.each(arr_input, function (v, i){
                                if($(v).val().length > 7){//可能值是20170421，则清空
                                    $(v).val('');
                                }
                            });
                        },
                        beforeShowForm: function(form) {},
                        onSearch: function(){
                            var $grid = $(this),
                                postData = $grid.jqGrid('getGridParam', 'postData');

                            var sDateNum = 0;
                            var filJson = eval('(' + postData.filters + ')');
                            var arr_sDate = [];
                            var filJsonResult = true;

                            if(_.where(filJson.rules, {field:'settleDate',op:'eq'}).length > 0){
                                var filData = moment().format('YYYYMMDD');
                                var fil_str = '{"field":"settleDate","op":"eq","data":"'+filData+'"},';
                                postData.filters = postData.filters.replace(fil_str, '');
                            }

                            filJson = eval('(' + postData.filters + ')');


                            $.each(filJson.rules, function(i, v){
                                if(filJson.rules[i].field == 'settleDate'){
                                    if(sDateNum > 1){
                                        Opf.alert('清算日期选项不能超出两项.');
                                        return filJsonResult = false;
                                    }
                                    else{
                                        arr_sDate.push(filJson.rules[i]);
                                        sDateNum++;
                                    }
                                }
                            });
                            if(filJsonResult && arr_sDate.length > 1){
                                if(arr_sDate[0].data > arr_sDate[1].data){
                                    Opf.alert('第一个清算日期必须小于第二个清算日期.');
                                    return filJsonResult = false;
                                }
                            }
                            return filJsonResult;
                        }
                    },
                    actions: {
                        add: false,
                        edit: false,
                        del: false
                    },
                    formSize: {
                        width: Opf.Config._('ui', 'settleTxn.grid.form.width'),
                        height: Opf.Config._('ui', 'settleTxn.grid.form.height')
                    },
                    //add: {
                    //    beforeShowForm: function(form) {
                    //        validation.addValidateRules(form);
                    //    },
                    //    beforeSubmit: validation.setupValidation
                    //},
                    //edit: {
                    //    beforeShowForm: function(form) {
                    //        validation.addValidateRules(form);
                    //    },
                    //    beforeSubmit: validation.setupValidation
                    //},
                    view: {
                        width: Opf.Config._('ui', 'settleTxn.grid.viewform.width'),
                        height: Opf.Config._('ui', 'settleTxn.grid.viewform.height'),
                        beforeShowForm: function (form) {
                            var selectId = Opf.Grid.getLastSelRowId(roleGird);
                            Opf.ajax({
                                type: 'GET',
                                url: url._('settle.t0.faster.txn', {id: selectId}),
                                success: function (rowData) {
                                    var	$txnHistory = $(txnHistoryTpl({data: rowData}));
                                    $(form).append($txnHistory);
                                }
                            });
                        }
                    }
                },
                gid: 'settle-t0-faster-grid',
                url: url._('settle.t0.faster.txn'),
                colNames: {
                    id       : settleLang._('settle.txn.id'),  //ID
                    settleDate       : settleLang._('settle.txn.settle.date'),  //清算日期
                    batchNo       : settleLang._('settle.txn.batch.no'),  //批次号
                    keyNo: '机构/商户编号',
                    keyName: '机构/商户名称',
                    inDate       : settleLang._('settle.txn.in.date'),  //入账日期
                    traceNo       : settleLang._('settle.txn.trace.no'),  //流水号
                    retNo       : settleLang._('settle.txn.ret.no'),  //响应流水号
                    retCode       : settleLang._('settle.txn.ret.code'),  //响应码
                    retMsg       : settleLang._('settle.txn.ret.msg'),  //响应信息
                    // outCode       : "转换后响应码",
                    // outMsg       : "转换后响应信息",
                    mchtNo       : settleLang._('settle.txn.mcht.no'),  //商户编号
                    settleBrhId       : settleLang._('settle.txn.settle.brh.id'),  //清算机构号
                    mchtName     : '商户名称',
                    settleBrhName : '清算机构名称',
                    settleAcctType       : settleLang._('settle.txn.settle.acct.type'),  //账户类型
                    settleBankNo       : settleLang._('settle.txn.settle.bank.no'),  //账户开户行号
                    settleBankNm       : settleLang._('settle.txn.settle.bank.nm'),  //账户开户行名称
                    settleBankAddr       : settleLang._('settle.txn.settle.bank.addr'),  //账户开户行地址
                    settleBankCode       : settleLang._('settle.txn.settle.bank.code'),  //账户开户行地区编码
                    settleAcctNm       : settleLang._('settle.txn.settle.acct.nm'),  //账户名称
                    settleAcct       : settleLang._('settle.txn.settle.acct'),  //卡号
                    settleAmt       : settleLang._('settle.txn.settle.amt'),  //清算金额
                    otherAmt       : settleLang._('settle.txn.other.amt'),  //其它金额
                    remark       : settleLang._('settle.txn.remark'),  //备注
                    resultFlag       : settleLang._('settle.txn.result.flag'),  //结果标示
                    settleNum  : '结算周期', // 结算周期
                    payTime  : '出款时间', // 出款时间
                    cupsNo  : '清算渠道', // 清算渠道
                    recCreateTime       : settleLang._('settle.txn.rec.create.time'),  //记录创建时间
                    recUpdTime       : settleLang._('settle.txn.rec.upd.time'), //记录修改时间
                    inalienable         :settleLang._('settle.sum.inalienable'),
                    outCode : '转换后返回码',
                    outMsg : '转换后响应信息'
                },
                responsiveOptions: {
                    hidden: {
                        ss: ['id','batchNo', 'settleDate', 'traceNo', 'resultFlag', 'inDate','retNo','retCode','retMsg','outCode','outMsg','mchtNo','settleBrhId','settleAcctType', 'settleBankNm', 'settleBankAddr','settleBankCode', 'settleBankNo','otherAmt','remark','recCreateTime','recUpdTime','outCode','outMsg'],
                        xs: ['id', 'batchNo', 'settleDate', 'traceNo', 'resultFlag', 'inDate','retNo','retCode','retMsg','outCode','outMsg','mchtNo','settleBrhId','settleAcctType','settleBankNo','settleBankNm','settleBankAddr','settleBankCode','otherAmt','remark','recCreateTime','recUpdTime','outCode','outMsg'],
                        sm: ['id','batchNo', 'settleDate', 'traceNo', 'resultFlag', 'inDate','retNo','retCode','outCode','settleAcctType','settleBankAddr','settleBankCode','otherAmt','remark','recCreateTime','recUpdTime','outCode','outMsg'],
                        md: ['id','inDate','retNo','retCode','outCode','settleAcctType','settleBankAddr','settleBankCode','otherAmt','remark','recCreateTime','recUpdTime','outCode','outMsg'],
                        ld: ['id','inDate','retNo','retCode','outCode','settleAcctType','settleBankAddr','settleBankCode','otherAmt','remark','recCreateTime','recUpdTime','outCode','outMsg']
                    }
                },
                colModel: [
                    {name:         'id', index:         'id', editable: false, hidden: true},  //ID
                    {name:         'settleDate', index:         'settleDate', search:false,editable: true,
                        searchoptions: {
                            dataInit : function (elem) {
                                $(elem).datepicker({autoclose: true,format: 'yyyymmdd'});
                            },
                            sopt: ['eq']
                        },
                        editoptions: {
                            dataInit : function (elem) {
                                $(elem).datepicker({ autoclose: true, format: 'yyyymmdd' })
                                    .on("changeDate changeMonth changeYear", function(oDate) {
                                        $(oDate.target).valid();
                                    });
                            }
                        }

                    },  //清算日期
                    {name:         'batchNo', index:         'batchNo', search:true,editable: true, hidden: true,
                        searchoptions: {
                            sopt: ['eq']
                        }
                    },  //批次号
                    {name: 'keyNo', index: 'keyNo', search: false, formatter: keyNoFormatter,searchoptions: {sopt: ['eq']}},  // 机构/商户编号
                    {name: 'keyName', index: 'keyName', search: false, formatter: keyNameFormatter}, // 机构/商户名称
                    {name: 'inDate', index: 'inDate', search: false, editable: true,
                        editoptions: {
                            dataInit : function (elem) {
                                $(elem).datepicker({ autoclose: true, format: 'yyyymmdd' })
                                    .on("changeDate changeMonth changeYear", function(oDate) {
                                        $(oDate.target).valid();
                                    });
                            }
                        }
                    },  //入账日期
                    {name:         'traceNo', index: 'traceNo', search:true,editable: true, hidden: false,
                        searchoptions: {
                            sopt: ['lk', 'nlk','eq', 'ne', 'lt', 'le', 'gt', 'ge']
                        }
                    },  //流水号
                    {name:         'retNo', index:         'retNo', search:false,editable: true},  //响应流水号
                    {name:         'retCode', index:         'retCode', search:false,editable: true},  //响应码
                    {name:         'outCode', index:         'outCode', search:false,editable: true},  //转换后响应码
                    {name:         'mchtNo', index:         'mchtNo', width: 250, search:true, editable: true, hidden: true, visible: false,
                        _searchType:'string',searchoptions: {sopt: ['eq']}
                    },  //商户编号
                    {name:         'settleBrhId', index:         'settleBrhId', search:true,editable: true, hidden:true, visible: false,
                        _searchType:'string',searchoptions: {sopt: ['eq']}

                    },  //清算机构号
                    {name: 'mchtName', index: 'mchtName', search: true, hidden:true, _searchType:'string', visible: false},// 商户名称
                    {name: 'settleBrhName', index: 'settleBrhName', search: true, hidden:true, _searchType:'string', visible: false},// 清算机构名称
                    {name: 'settleAcctType', index: 'settleAcctType', search: false, editable: true, formatter: settleAcctTypeFormatter,
                        edittype: 'select',
                        editoptions: {
                            value: SETTLEACCTTYPE_MAP
                        }
                    },  //账户类型
                    {name:         'settleBankNo', index:         'settleBankNo', search:false,editable: true, hidden: true},  //账户开户行号
                    {name:         'settleBankNm', index:         'settleBankNm', search:false,editable: true},  //账户开户行名称
                    {name: 'settleBankAddr', index: 'settleBankAddr', search: false, editable: true, edittype: "textarea"},  //账户开户行地址
                    {name:         'settleBankCode', index:         'settleBankCode', search:false,editable: true},  //账户开户行地区编码
                    {name:         'settleAcctNm', index:         'settleAcctNm', search:false,editable: true},  //账户名称
                    {name:         'settleAcct', index:         'settleAcct', width: 250, search:true,editable: true},  //卡号
                    {name:         'settleAmt', index:         'settleAmt', search:true,editable: true, formatter: Opf.currencyFormatter},  //清算金额
                    {name: 'retMsg', index: 'retMsg', search: false, editable: true, edittype: "textarea", hidden:true},  //响应信息
                    {name: 'outMsg', index: 'outMsg', search: false, editable: true, edittype: "textarea", hidden:true},  //转换后响应信息
                    {name:         'otherAmt', index:         'otherAmt', search:false,editable: true, formatter: Opf.currencyFormatter},  //其它金额
                    {name: 'remark', index: 'remark', search: false, editable: true, edittype: "textarea"},  //备注
                    {name: 'resultFlag', index: 'resultFlag', search: true, stype: 'select',
                        searchoptions: {
                            value: RESULTFLAG_MAP,
                            sopt: ['eq','ne']
                        },
                        editable: true,
                        formatter: resultFlagFormatter,
                        edittype:'select',
                        editoptions: {
                            value: RESULTFLAG_MAP
                        }
                    },
                    //交易渠道号
                    {name:         'cupsNo', index:         'cupsNo', search:true,editable: true, hidden: true,
                        searchoptions: {
                            sopt: ['lk', 'nlk','eq', 'ne', 'lt', 'le', 'gt', 'ge']
                        }
                    },
                    {name: 'settleNum', index: 'settleNum', search: me.getSettleNumIsNeed(), stype: 'select',
                        searchoptions: {
                            value: DISC_CYCLE_MAP,
                            sopt: ['eq','ne']
                        }
                    },
                    {name: 'payTime', index: 'payTime', formatter: dateFormatter},
                    {name: 'recCreateTime', index: 'recCreateTime', search: false, editable: true,
                        editoptions: {
                            dataInit : function (elem) {
                                $(elem).datepicker({ autoclose: true, format: 'yyyymmdd' })
                                    .on("changeDate changeMonth changeYear", function(oDate) {
                                        $(oDate.target).valid();
                                    });
                            }
                        }
                    },
                    //记录创建时间
                    {name: 'recUpdTime', index: 'recUpdTime', search: false, editable: true,
                        editoptions: {
                            dataInit : function (elem) {
                                $(elem).datepicker({ autoclose: true, format: 'yyyymmdd' })
                                    .on("changeDate changeMonth changeYear", function(oDate) {
                                        $(oDate.target).valid();
                                    });
                            }
                        }
                    }, //记录修改时间
                    {name: 'inalienable',  index: 'inalienable', hidden:true, viewable:false},
                    {name:         'outCode', index:         'outCode', search:false,editable: true},  //响应码
                    {name: 'outMsg', index: 'outMsg', search: false, editable: true, edittype: "textarea", hidden:true}  //响应信息
                ],

                onSelectRow: function (rowId, status) {
                    if (status === false) {
                        me.checkType = CHECK_BY_DEFAULT;
                    }

                },
                loadComplete: function() {
                    if (me.isSelectedAll()) {
                        me.checkedAll();
                    }
                    if(me.handleNavBtn){
                        me.uncheckedAll();
                        me.handleNavBtn = false;
                    }
                    _.defer(function(){
                        if(!me.hasFuckCheckBox){
                            me.fuckCheckBox();
                            me.hasFuckCheckBox = true;
                        }
                    });
                }
            }));

            _.defer(function () {
                me.addNavBtn({caption: "", name: "checkedAll", title:'全选',
                    buttonicon: "icon-check white",
                    onClickButton: function () {
                        if (me.checkType === CHECK_BY_DEFAULT) {
                            me.checkedAll();
                        } else {
                            me.uncheckedAll();
                        }
                    }
                });

                me.addNavBtn({caption: "", name: "singleBatch", title:'单独成批',
                    buttonicon: "icon-folder-open white",
                    onClickButton: function() {
                        me.showSingleBatchDialog();
                    }
                });

                me.addNavBtn({caption: "", name: "divideBatch", title:'划分批次',
                    buttonicon: "icon-cut white",
                    onClickButton: function() {
                        me.showDivideBatchDialog();
                    }
                });

                me.addNavBtn({caption: "", name: "stopSettle", title:'暂停清算',
                    buttonicon: "icon-pause white",
                    onClickButton: function() {
                        var params = me.getNavBtnParamsByFlag(RESULTFLAG_VALUE.INIT_INFO);
                        params && me.doBtnAjax(me.navBtnUrl.stopSettle, params);
                    }
                });

                me.addNavBtn({caption: "", name: "recoverySettle", title:'恢复清算',
                    buttonicon: "icon-play white",
                    onClickButton: function() {
                        var params = me.getNavBtnParamsByFlag(RESULTFLAG_VALUE.STOP_SETTLE);
                        params && me.doBtnAjax(me.navBtnUrl.recoverySettle, params);
                    }
                });

                me.addNavBtn({caption: "", name: "setSuccess", title:'设为成功',
                    buttonicon: "icon-ok white",
                    onClickButton: function() {
                        me.showSetSuccessDialog(roleGird);
                    }
                });

                // TODO  龊方式解决问题
                // 【下载报表】按钮放在右边
                var $dlBtn = me.$el.find('.ui-pg-button-download-default');
                $dlBtn.parent().append($dlBtn);
            });

            return roleGird;
        }

    });

    //记录时间大于等于10分钟 显示入账按钮
    function canShowCheckAccount (rowData) {
        var result = false;
        if(rowData.differTime > 10 && rowData.resultFlag == 5){
            result = true;
        }
        return result;
    }

    function resultFlagFormatter(val) {
        return RESULTFLAG_MAP[val] || '';
    }

    function settleAcctTypeFormatter(val) {
        return SETTLEACCTTYPE_MAP[val] || '';
    }

    function keyNoFormatter(cellvalue, options, rowObject) {
        return rowObject.mchtNo || rowObject.settleBrhId || '';
    }

    function keyNameFormatter(cellvalue, options, rowObject) {
        return rowObject.mchtName || rowObject.settleBrhName || '';
    }

    function getSingleBatchTpl () {
        return [
            '<form class="form-settle-txn">',
            '<div class="col-xs-12">',
            '<textarea name="message" style="width:250px;height:80px;margin:5px;"></textarea>',
            '</div>',
            '</form>'
        ].join('');
    }

    function getDivideBatchTpl () {
        var totalBoBatchCountTpl = [
            '<span id="batch-count" style="color: #4b4b4b;"></span>'
        ].join('');

        var totalBoBatchAmountTpl = [
            '<span id="batch-amount" style="color: #4b4b4b;"></span>'
        ].join('');

        return [
            '<form class="form-settle-txn">',
            '<fieldset>',
            '<div class="row settle-styles-row" style="margin-left:0;margin-right:0">',
            '<div class="col-xs-3">渠道名称</div>',
            '<div class="col-xs-9">',
            '<div name="cupsName">所有</div>',
            '</div>',
            '</div>',
            '<div class="row settle-styles-row" style="margin-left:0;margin-right:0">',
            '<div class="col-xs-3">清算日期</div>',
            '<div class="col-xs-9">',
            '<input type="text" name="settleDate" readonly>',
            '</div>',
            '</div>',
            '<div class="row settle-styles-row" style="margin-left:0;margin-right:0">',
            '<div class="col-xs-3">数量</div>',
            '<div class="col-xs-9">',
            '<input type="text" name="value" autofocus="true">',
            '</div>',
            '</div>',
            '<div class="row settle-styles-row" style="margin-left:0;margin-right:0">',
            '<div class="col-xs-3">备注信息</div>',
            '<div class="col-xs-9">',
            '<textarea name="name"></textarea>',
            '</div>',
            '</div>',
            '<div style="color: #ff0000; padding: 5px">',
            '请注意，划分批次功能会将所有的初始化状态记录都划分！',
            '当前总共还有 ' + totalBoBatchCountTpl + ' 笔（金额共￥' + totalBoBatchAmountTpl + '）没有划分。',
            '</div>',
            '</fieldset>',
            '</form>'
        ].join('');
    }

    function dateFormatter(val) {
        return val ? moment(val, 'YYYYMMDDHHmm').format('YYYY/MM/DD HH:mm') : '';
    }

    App.on('settleFaster:t0:list', function(){
        App.show(new View());
    });

    return View;

});