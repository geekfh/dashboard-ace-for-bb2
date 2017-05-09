/**
 * Created by wupeiying on 2015/11/9.
 */
define(['App',
    'tpl!app/oms/account/manualAccount/addManualAccount.tpl',
    'jquery.jqGrid',
    'select2',
    'jquery.validate',
    'common-ui'
], function (App, addManualAccountTpl) {
    var tableTpl = [
        '<div class="row">',
        '<div class="col-xs-12 jgrid-container">',
        '<table id="manual-account-grid-table"></table>',
        '<div id="manual-account-grid-pager" ></div>',
        '</div>',
        '</div>'
    ].join('');

    var STATUS_MAP = {
        1: '待审核',
        2: '审核通过',
        3: '审核拒绝'
    };

    var USERTYPE_MAP = {
        1: '商户',
        2: '地推',
        3: '代理商'
    };

    var View = Marionette.ItemView.extend({
        template: _.template(tableTpl),
        tabId: 'menu.manualAccount.list',
        onRender: function () {
            var me = this;
            _.defer(function () {
                me.renderGrid();
            });
        },
        renderGrid: function () {
            var me = this;
            var validation = this.attachValidation();
            var grid = this.grid = App.Factory.createJqGrid({
                rsId: 'manualAccount',
                caption: '手工记账',
                gid: 'manual-account-grid',
                url: url._('manual.account.list'),
                actionsCol: {
                    width: 110,
                    del: false,
                    edit: false,
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
                            name: 'edit', icon: 'icon-edit', title: '编辑所选记录',
                            click: function (name, opts, rowData) {
                                onManualEditDialog(me, rowData);
                            }
                        },
                        {
                            name: 'manualCheck', icon: 'icon-file-text', title: '审核',
                            click: function (name, opts, rowData) {
                                onManualCheckDialog(me, rowData);
                            }
                        }
                    ]
                },
                nav: {
                    actions: {
                        add: false,
                        search: false
                    }
                    //edit: {
                    //    beforeShowForm: function(form) {
                    //        validation.addValidateRules(form);
                    //        var id = Opf.Grid.getSelRowId(grid);
                    //        var subName = grid.getRowData(id).userSubjectName;
                    //        select2Dialog(form);
                    //    },
                    //    beforeSubmit: validation.setupValidation
                    //}
                },
                filters: [
                    {
                        caption: '手工记账搜索',
                        //defaultRenderGrid: false,
                        canSearchAll: true,
                        canClearSearch: true,
                        components: [
                            {
                                label: '用户编号',
                                name: 'userNum',
                                type: 'text',
                                options: {
                                    sopt: ['lk']
                                }
                            },
                            {
                                label: '用户科目编号',
                                name: 'userSubjectId',
                                type: 'text',
                                options: {
                                    sopt: ['lk']
                                }
                            },
                            {
                                label: '公司科目编码',
                                name: 'companySubjectId',
                                type: 'text',
                                options: {
                                    sopt: ['lk']
                                }
                            },
                            {
                                label: '账务日期',
                                name: 'accountingDate',
                                type: 'rangeDate',
                                //ignoreFormReset: true,
                                limitRange: 'month',
                                limitDate: moment(),
                                defaultValue: [moment(), moment()],
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
                                label: '申请人',
                                name: 'applyOprName',
                                type: 'text',
                                options: {
                                    sopt: ['lk']
                                }
                            },
                            {
                                label: '用户类型',
                                name: 'userType',
                                type: 'select',
                                options: {
                                    value: USERTYPE_MAP,
                                    sopt: ['lk']
                                }
                            },
                            {
                                label: '审核状态',
                                name: 'status',
                                type: 'select',
                                options: {
                                    value: STATUS_MAP,
                                    sopt: ['lk']
                                }
                            }

                        ],
                        searchBtn: {
                            id: 'manualAccountSearch',
                            text: '搜索'
                        }
                    }],
                colNames: {
                    id: '',
                    bussTradeNo: '业务流水号',
                    userAccountNo: '用户主账户编号',
                    userSubAccountNo: '用户子账户编号',
                    userSubjectId: '用户科目编号',
                    userSubjectName: '用户科目名称',
                    amount: '记账金额',
                    accountingDate: '账务日期',
                    status: '状态',
                    refuseReason: '审核拒绝原因',
                    applyDate: '申请时间',
                    auditDate: '审核时间',
                    applyOprName: '申请人',
                    auditOprName: '审核人',
                    companyAccountNo: '公司主账户编号',
                    companySubAccountNo: '公司子账户编号',
                    companySubjectId: '公司科目编号',
                    companySubjectName: '公司科目名称',
                    remarks: '备注',
                    userType: '用户类型',
                    userNum: '用户编号'
                },
                colModel: [
                    {name: 'id', hidden: true},
                    {name: 'bussTradeNo', hidden: true},
                    {name: 'userAccountNo', hidden: true, viewable: false},
                    {name: 'userSubAccountNo', editable: true},
                    {name: 'userSubjectId', editable: true, hidden: true, viewable: false},
                    {name: 'userSubjectName', editable: true},
                    {name: 'amount', editable: true},
                    {name: 'accountingDate', formatter: dateFormatter},
                    {name: 'status', formatter: statusFormatter},
                    {name: 'applyDate', hidden: true, formatter: timeFormatter},
                    {name: 'auditDate', hidden: true, formatter: timeFormatter},
                    {name: 'refuseReason', hidden: true},
                    {name: 'applyOprName', hidden: true},
                    {name: 'auditOprName', hidden: true},
                    {name: 'companyAccountNo', hidden: true, viewable: false},
                    {name: 'companySubAccountNo', hidden: true, viewable: false},
                    {name: 'companySubjectId', hidden: true, viewable: false},
                    {name: 'companySubjectName', hidden: true, viewable: false},
                    {name: 'remarks', hidden: true},
                    {name: 'userType', hidden: true, viewable: false, viewable: false},
                    {name: 'userNum', hidden: true}
                ],
                loadComplete: function(data) {}
            });

            _.defer(function(){
                var addHtml = '<div style="border: 1px solid #ffffff;color: #ffffff;border-radius: 3px;">' +
                    '<div style="padding: 5px 10px 5px 10px;">' +
                    '<i class="icon-plus smaller-80"></i>' +
                    '新增' +
                    '</div>' +
                    '</div>';
                Opf.Grid.navButtonAdd(me.grid, {
                    caption: addHtml,
                    name: 'addManual',
                    title:'新增操作',
                    buttonicon: '',
                    onClickButton: function() {
                        me.addManualAccountDialog(grid);
                    }
                });
            });

            return grid;
        },
        addManualAccountDialog: function(grid){
            var $dialog = Opf.Factory.createDialog(addManualAccountTpl(), {
                destroyOnClose: true,
                title: '新增操作',
                width: 400,
                height: 400,
                autoOpen: true,
                modal: true,
                buttons: [{
                    type: 'submit',
                    text: '确定',
                    click: function () {
                        var userType = $(this).find('#sl-userType').val();
                        var userName = $(this).find('#outTradeNo');
                        var userId = $(this).find('#sl-userName').val();//$(this).find('#hd-userid').val();
                        var subName = $(this).find('#userSubjectName');
                        var amount = $(this).find('#amount').val().trim();
                        var exp = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/;

                        if(userName.val().trim() == '' || amount == '' || subName.val().trim() == ''){
                            CommonUI.loadError($(this), '全部必填.');
                            return false;
                        }
                        else if(!exp.test(amount)){
                            CommonUI.loadError($(this), '记账金额输入无效格式，请重新输入.');
                            return false;
                        }
                        else{
                            CommonUI.loadCleanError($(this), '');
                        }
                        Opf.ajax({
                            type:'POST',
                            async: false,
                            url: url._('manual.account.list'),
                            jsonData: {
                                "userType": userType,
                                "userNum": userName.select2('data').id,
                                "userSubAccountNo": userId,//子账户编号
                                "userSubjectId": subName.select2('data').id,
                                "userSubjectName": subName.select2('data').cnName,
                                "amount": amount
                            },
                            success: function (resp) {
                                if(resp.success){
                                    Opf.Toast.success('新增成功.');
                                    $dialog.dialog('close');
                                    grid.trigger("reloadGrid", [{current:true}]);
                                }
                            }
                        });
                    }
                },{
                    type: 'cancel'
                }],
                create: function(){
                    $(this).find('#outTradeNo').removeAttr('disabled');
                }
            });
            select2Dialog($dialog, null);
        },
        attachValidation: function() {
            return {
                setupValidation: Opf.Validate.setup,
                addValidateRules: function(form) {
                    Opf.Validate.addRules(form, {
                        rules:{
                            userSubAccountNo:{
                                required: true,
                                number: true
                            },
                            userSubjectId:{
                                required: true,
                                number: true
                            },
                            userSubjectName:{
                                required: true
                            },
                            amount:{
                                required: true,
                                number: true
                            }
                        }
                    });
                }
            };

        }
    });

    function onManualEditDialog(me, rowData){
        var $dialog = Opf.Factory.createDialog(addManualAccountTpl(), {
            destroyOnClose: true,
            title: '修改操作',
            width: 400,
            height: 400,
            autoOpen: true,
            modal: true,
            buttons: [{
                type: 'submit',
                text: '确定',
                click: function () {
                    //var userType = $(this).find('#sl-userType').val();
                    //var userName = $(this).find('#outTradeNo');
                    var userId = $(this).find('#sl-userName').val();
                    var subName = $(this).find('#userSubjectName');
                    if(subName.text() == ''){
                        subName.val(rowData.userSubjectName);
                    }
                    var amount = $(this).find('#amount').val().trim();
                    var exp = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/;

                    if(amount == '' || subName.val().trim() == ''){
                        CommonUI.loadError($(this), '全部必填.');
                        return false;
                    }
                    else if(!exp.test(amount)){
                        CommonUI.loadError($(this), '记账金额输入无效格式，请重新输入.');
                        return false;
                    }
                    else{
                        CommonUI.loadCleanError($(this), '');
                    }
                    Opf.ajax({
                        type:'PUT',
                        async: false,
                        url: url._('manual.account.edit', {id: rowData.id}),
                        jsonData: {
                            "userSubAccountNo": userId,//子账户编号
                            "userSubjectId": subName.select2('data')==null ? rowData.userSubjectId: subName.select2('data').id,
                            "userSubjectName": subName.select2('data')==null ? rowData.userSubjectName: subName.select2('data').cnName,
                            "amount": amount
                        },
                        success: function (resp) {
                            if(resp.success){
                                $dialog.dialog('close');
                                me.grid.trigger("reloadGrid", [{current:true}]);
                                Opf.Toast.success('修改成功.');
                            }
                        }
                    });
                }
            },{
                type: 'cancel'
            }],
            create: function(){
                $(this).find('#sl-userType option[value="'+rowData.userType+'"]').attr("selected", "selected");
                initAjax($(this), rowData);
                $(this).find('#sl-userType').attr('disabled','disabled');
                $(this).find('#amount').val(rowData.amount);
            }
        });
    }

    function onManualCheckDialog(me, rowData){
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
                    var status = $(this).find('#sl-status').val();
                    var reason = $(this).find('#tx-reason').val().trim();
                    if(status == 3 && reason == ''){
                        CommonUI.loadError($(this), '审核拒绝需填写拒绝描述.');
                        return false;
                    }
                    Opf.ajax({
                        type: 'POST',
                        async: false,
                        url: url._('account.subject.check'),
                        jsonData: {
                            "id": rowData.id,
                            "status": status,
                            "refuseReason": reason
                        },
                        success: function (resp) {
                            if(resp.success){
                                $dialog.dialog('close');
                                Opf.Toast.success('审核成功.');
                                me.grid.trigger('reloadGrid', {current: true});
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

    function initAjax($dialog, rowData){
        var arr = {};
        var resp2_arr = '';
        Opf.ajax({
            type: 'GET',
            async: false,
            url: 'api/account/search-user',
            data: {userNum: rowData.userNum, userType: rowData.userType},
            success: function(resp1){
                Opf.ajax({
                    type: 'GET',
                    async: false,
                    url: url._('account.sub.select'),
                    data: {userNum: rowData.userNum, userType: rowData.userType},
                    success: function(resp2) {
                        $.each(resp2, function(i, v){
                            if(rowData.userSubAccountNo == v.subAccountNo){
                                resp2_arr += '<option value="'+ v.subAccountNo+'" selected="selected">'+ v.subAccountTypeName+'+'+v.subAccountNo+'</option>';
                            }
                            else{
                                resp2_arr += '<option value="'+ v.subAccountNo+'">'+ v.subAccountTypeName+'+'+v.subAccountNo+'</option>';
                            }
                        });//, subAccountTypeName: resp2[0].subAccountTypeName
                        arr = {userNum: rowData.userNum, userName: resp1[0].userName, userSubjectName: rowData.userSubjectName, subAccountNo: rowData.userSubAccountNo};
                    }
                });
            }
        });
        $dialog.find('#sl-userName').append(resp2_arr);
        select2Dialog($dialog, arr);
    }

    function select2Dialog($dialog, rowData){
        $dialog.find('#outTradeNo').select2({
            placeholder: rowData == null ? '请选择用户名称' : rowData.userName,
            minimumInputLength: 1,
            width: '50%',
            ajax: {
                type: "GET",
                async: false,
                url: 'api/account/search-user',
                dataType: 'json',
                data: function (term) {
                    return {
                        userType: $dialog.find('#sl-userType').val(),
                        userName: term
                    };
                },
                results: function (data) {
                    return {
                        results: data
                    };
                }
            },
            id: function (e) {
                return e.userNum;
            },
            formatResult: function(data, container, query, escapeMarkup){
                return data.userName;
            },
            formatSelection: function(data, container, escapeMarkup){
                $dialog.find('#sl-userName').empty();
                Opf.ajax({
                    type: 'GET',
                    async: false,
                    url: url._('account.sub.select'),
                    data: {userNum: data.userNum, userType: data.userType},
                    success: function(resp){
                        //resp = resp[0];
                        var arr = '';
                        $.each(resp, function(i, v){
                            arr += '<option value="'+ v.subAccountNo+'">'+ v.subAccountTypeName+'+'+v.subAccountNo+'</option>';
                        });
                        $dialog.find('#sl-userName').append(arr);
                        //$dialog.find('#hd-userid').val(resp.subAccountNo);
                        //$dialog.find('#txt-userName').val(resp.subAccountTypeName+'+'+resp.subAccountNo);
                    }
                });
                return data.userName;
            }
        });
        $dialog.find('#userSubjectName').select2({
            placeholder: rowData == null ? '请选择科目' : rowData.userSubjectName,
            minimumResultsForSearch: Infinity,
            width: '50%',
            ajax: {
                type: "GET",
                async: false,
                url: url._('account.subject.info'),
                dataType: 'json',
                results: function (data) {
                    return {
                        results: data
                    };
                }
            },
            id: function (e) {
                return e.subjectId;
            },
            formatResult: function(data, container, query, escapeMarkup){
                return data.cnName;
            },
            formatSelection: function(data, container, escapeMarkup){
                return data.cnName;
            }
        });
    }

    function statusFormatter(val){
        return STATUS_MAP[val] || '';
    }

    function userTypeFormatter(val){
        return USERTYPE_MAP[val] || '';
    }

    function dateFormatter(val) {
        return val == null || val == '' ? '' : moment(val, 'YYYYMMDDHHmm').format('YYYY/MM/DD');
    }

    function timeFormatter(val) {
        return val == null || val == '' ? '' : moment(val, 'YYYYMMDDHHmm').format('YYYY/MM/DD HH:mm');
    }

    App.on('manual:account:list', function () {
        App.show(new View());
    });

    return View;

});