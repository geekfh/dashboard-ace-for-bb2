/**
 * Created by wupeiying on 2015/11/26.
 */
define(['App',
    'tpl!app/oms/account/profit/ticketEditTpl.tpl',
    'tpl!app/oms/account/profit/upload.tpl',
    'app/oms/common/moduleUI',
    'upload',
    'jquery.jqGrid',
    'common-ui',
    'bootstrap-datepicker'
], function(App, ticketEditTpl, uploadTpl, ModuleUI) {

    var tableCtTpl = [
        '<div class="row">',
        '<div class="col-xs-12 jgrid-container">',
        '<table id="posted-ticket-grid-table"></table>',
        '<div id="posted-ticket-grid-pager" ></div>',
        '</div>',
        '</div>'].join('');

    var STATUS_MAP = {
        1: '批次未审核',
        2: '冻结失败',
        3: '待贴票',
        4: '未审核',
        5: '审核通过',
        6: '审核拒绝',
        7: '解冻成功',
        8: '解冻失败',
        9: '批次审核通过',
        10: '已线下出款'
    };

    var USERTYPE_MAP= {
        1: '商户',
        2: '地推',
        3: '代理商'
    };

    var ISTICKET_MAP = {
        1: '是',
        2: '否'
    };

    var REWARDSTATUS_MAP = {
        3: "待贴票",
        4: "待审核"
    };

    var OUTWAY_MAP = {
        1: "虚拟账户出款",
        2: "银行转账",
        3: "结算平台出款"
    };
    var btnHtml = _.template(['<div style="border: 1px solid #fff;color: #fff;border-radius: 3px;text-align: center;">',
        '<div style="width: 100px;  height: 29px; padding: 5px;">',
        '<%=str%>',
        '</div>',
        '</div>'].join(''));
    var View = Marionette.ItemView.extend({
        template: _.template(tableCtTpl),
        tabId: 'menu.postedTicket.list',
        events: {},

        onRender: function () {
            var me = this;
            _.defer(function () {
                me.renderGrid();
            });
        },
        renderGrid: function () {
            var me = this;
            var grid = App.Factory.createJqGrid({
                rsId: 'postedTicket',
                caption: '',
                multiselect: true,
                rowList: [10,20,30,100,300,500],
                nav: {
                    actions: {
                        add: false
                    },
                    search: {
                        //width: 350,
                        afterRedraw: function (){
                            if(ISServicePermission('search') == false){
                                return ModuleUI.searchFormBySelect2($(this), 'userName');
                            }
                        },
                        onSearch: function() {
                            if(ISServicePermission('search') == false){
                                var $grid = $(this), postData = $grid.jqGrid('getGridParam', 'postData');
                                var gid = $grid.jqGrid('getGridParam', 'gid');
                                var tableId = $('#fbox_'+gid+'-table');
                                return me.queryFilters = queryFilters = searchFilterBySelect2(tableId, postData, 'userName');
                            }
                        }
                    }
                },
                actionsCol: {
                    edit: false,
                    del: false,
                    view: false,
                    width: 100,
                    extraButtons: [
                        {
                            name: 'ticketEdit', icon: '', title: '奖励明细编辑', caption: '奖励明细编辑',
                            click: function (name, opts, rowData) {
                                if(rowData.status == '3' || rowData.status == '4' || rowData.status == '5' || rowData.status == '6' || rowData.status == '8'){
                                    ticketEditHandle(rowData, grid);
                                }
                                else{
                                    Opf.Toast.warning('奖励明细不可编辑');
                                }
                            }
                        },
                        {
                            name: 'ticket', icon: '', title: '贴票', caption: '贴票',
                            click: function (name, opts, rowData) {
                                ticketHandle(rowData, grid);
                            }
                        },
                        {
                            name: 'check', icon: '', title: '审核', caption: '审核',
                            click: function (name, opts, rowData) {
                                checkHandle(rowData, grid);
                            }
                        },
                        {
                            name: 'thaw', icon: '', title: '解冻', caption: '解冻',
                            click: function (name, opts, rowData) {
                                thawHandle(rowData, grid);
                            }
                        },
                        {
                            name: 'frozen', icon: '', title: '入账', caption: '入账',
                            click: function (name, opts, rowData){
                                Opf.confirm('您确定入账吗？<br><br><div id="ck_frozen" class="checkbox"><label><input type="checkbox"><font style="font-size: 12px;">同时处理同批次下所有明细</font></label></div>', function (result) {
                                    if (result) {
                                        var ck = $(document).find('.bootbox-confirm').find('input[type="checkbox"]').is(':checked');
                                        Opf.ajax({
                                            type: 'PUT',
                                            url: url._('posted.ticket.frozen', {id: rowData.id}),
                                            jsonData: {id: rowData.id, batchInAccount: ck},
                                            success: function () {
                                                grid.trigger('reloadGrid', {current: true});
                                                Opf.Toast.success('入账成功.');
                                            },
                                            error: function(){
                                                Opf.Toast.success('入账失败.');
                                            }
                                        });
                                    }
                                });
                            }
                        }
                    ],
                    canButtonRender: function(name, opts, rowData) {
                        if(name === 'ticket' && rowData.isTicket == 1 && (rowData.status == 3 || rowData.status == 4 || rowData.status == 6)) {
                            return true;
                        }
                        else if(name === 'check' && (rowData.status == 1 || rowData.status == 4)){
                            return true;
                        }
                        else if((name === 'thaw' && rowData.status == 5 && rowData.outOfWay != 3 && rowData.outOfWay != 2) || (name === 'thaw' && rowData.status == 8)){
                            return true;
                        }
                        else if(name === 'frozen' && rowData.status == 2){
                            return true;
                        }
                        //else if(name == 'ticketEdit' && rowData.status == '3'
                        //    || name == 'ticketEdit' && rowData.status == '4'
                        //    || name == 'ticketEdit' && rowData.status == '5'
                        //    || name == 'ticketEdit' && rowData.status == '6'
                        //    || name == 'ticketEdit' && rowData.status == '8'
                        //){
                        //    return true;
                        //}
                        else if(name == 'ticketEdit'){
                            return true;
                        }
                        else{
                            return false;
                        }
                    }
                },
                gid: 'posted-ticket-grid',
                url: url._('posted.ticket.list'),//贴票管理
                postData: me.options.batchNo != undefined ? {
                    filters: JSON.stringify({
                        groupOp: "AND",
                        rules: [{field: 'batchNo', op: 'eq', data: me.options.batchNo}]
                    })
                }: {},
                colNames: {
                    id: '奖励ID',
                    ticketApplyId:'付款申请单号',
                    batchNo: '批次号',
                    userType:'用户类型',//1：商户，2：地推 3：代理商
                    userNum: '用户编号',
                    userName: '用户名',
                    status:  '状态',//1：批次未审核  2：冻结失败  3：待贴票  4：贴票未审核  5：审核通过  6：审核拒绝  7：解冻成功 8：解冻失败  9: '批次审核通过' 10: '已线下出款'
                    tradeAmount:'交易总金额',
                    intoPiecesRewardAmount: '进件奖励总金额',
                    profitRewardAmount: '分润奖励总金额',
                    ticketAmount: '贴票金额',
                    taxAmount: '代扣税金额',
                    totalRewardAmount: '奖励总金额',
                    modifyName: '修改人',
                    modifyDate: '修改时间',
                    thawAmount: '可解冻金额',
                    isTicket: '是否贴票',
                    outOfWay: '出款方式',
                    remarks: '备注'
                },
                colModel: [
                    {
                        name: 'id', search: ISServicePermission('search'),
                        searchoptions: {sopt: ['eq']}
                    },
                    {name: 'ticketApplyId', search: ISServicePermission('search'), searchoptions: {sopt: ['eq']}},
                    {name: 'batchNo', search: ISServicePermission('search')},
                    {name: 'userType', formatter: userTypeFormatter,
                        search: ISServicePermission('search'),
                        stype: 'select',
                        searchoptions: {
                            sopt: ['eq'],
                            value: USERTYPE_MAP
                        }},
                    {name: 'userNum', search: ISServicePermission('search')},
                    {
                        name: 'userName', search: true
                        // stype: 'select',
                        // searchoptions: {
                        //     sopt: ['eq']
                        // }
                    },
                    {name: 'status', formatter: statusFormatter,
                        search: ISServicePermission('search'),
                        stype: 'select',
                        searchoptions: {
                            sopt: ['eq'],
                            value: STATUS_MAP
                        }
                    },
                    {name: 'tradeAmount', hidden:true},
                    {name: 'intoPiecesRewardAmount', hidden:true},
                    {name: 'profitRewardAmount', hidden:true},
                    {name: 'ticketAmount', hidden: ISServicePermission('hidden') },
                    {name: 'taxAmount', hidden: ISServicePermission('hidden')},
                    {name: 'totalRewardAmount', hidden: ISServicePermission('hidden')},
                    {name: 'modifyName', search: ISServicePermission('search'), searchoptions: {sopt: ['eq']}},
                    {name: 'modifyDate', formatter: dateFormatter,
                        search: ISServicePermission('search'),
                        searchoptions: {
                            dataInit: function (elem) {
                                $(elem).datepicker({autoclose: true, format: 'yyyymmdd'});
                            },
                            sopt: ['eq', 'lt', 'gt', 'le', 'ge']
                        }
                    },
                    {name: 'thawAmount', hidden: ISServicePermission('hidden')},
                    {name: 'isTicket',
                        hidden: ISServicePermission('hidden'),
                        formatter: isTicketFormatter,
                        search: ISServicePermission('search'),
                        stype: 'select',
                        searchoptions: {
                            sopt: ['eq'],
                            value: ISTICKET_MAP
                        }
                    },
                    {name: 'outOfWay', formatter: outWayFormatter, search: ISServicePermission('search'), stype: 'select',
                        searchoptions: {
                            sopt: ['eq'],
                            value: OUTWAY_MAP
                        }
                    },
                    {name: 'remarks', search: ISServicePermission('search'), searchoptions: {sopt: ['lk']}}
                ],
                loadComplete: function () {}
            });

            _.defer(function(){
                Opf.Grid.availNavButtonAdd(grid, {
                    id: 'batchAudit',
                    caption: btnHtml({str: '批量审核'}),
                    name: 'batchAudit',
                    title: '批量审核',
                    position: 'last',
                    onClickButton: function () {
                        batchAuditDialog(grid);
                    }
                });
                Opf.Grid.availNavButtonAdd(grid, {
                    id: 'batchThaw',
                    caption: btnHtml({str: '批量解冻'}),
                    name: 'batchThaw',
                    title: '批量解冻',
                    position: 'last',
                    onClickButton: function () {
                        batchThawDialog(grid);
                    }
                });
                //导出奖励
                Opf.Grid.availNavButtonAdd(grid, {
                    caption: btnHtml({str: '导出奖励'}),
                    name: 'export',
                    title: '导出奖励',
                    position: 'last',
                    onClickButton: function(){
                        var postData = $(grid).jqGrid('getGridParam', 'postData');
                        Opf.ajax({
                            type: 'GET',
                            url: url._('posted.ticket.downloadReward'),
                            data: {filters: postData.filters},
                            success: function (resp) {
                                if(resp.success){
                                    var dlUrl = resp.data;
                                    if (dlUrl) {
                                        Opf.download(dlUrl);
                                    }
                                }else {
                                    Opf.alert(resp.msg);
                                }
                            }
                        });
                    }
                });
                //导入贴票
                Opf.Grid.availNavButtonAdd(grid, {
                    caption: btnHtml({str: '导入贴票'}),
                    name: 'input',
                    title: '导入贴票',
                    position: 'last',
                    onClickButton: function(){
                        inputDialog(grid);
                    }
                });
                //变更发奖方式
                Opf.Grid.availNavButtonAdd(grid, {
                    caption: btnHtml({str: '变更发奖方式'}),
                    name: 'updateAwardWay',
                    title: '变更发奖方式',
                    position: 'last',
                    onClickButton: function(){
                        updateAwardWayDialog(grid);
                    }
                })
            });

            return grid;
        }
    });

    function searchFilterBySelect2 (form, postData, className){
        var queryFilters = postData,
            val = $(form).find('#sl_' + className).select2('data') ? $(form).find('#sl_' + className).select2('data').userId : '';

        if(val){
            var filtersJson = $.parseJSON(queryFilters.filters);
            filtersJson.rules.push({"field": className,"op": "eq","data": val});
            postData.filters = JSON.stringify(filtersJson);
        }

        return postData;
    }

    //判断是否是客服权限
    function ISServicePermission(str){
        var flag = false;
        //hidden，判断是客服权限则返回true，不给客服看到字段，hidden： true
        if(str == 'hidden'){
            if(Ctx.getUser().get('brhCode') === '000' &&  (Ctx.getUser().get('loginName') === 'admin' || Ctx.getUser().get('loginName') === 'qitian')){
                flag = false;
            }
             else if (Ctx.avail('postedTicket.service')) {
                flag = true;
            }
            else{
                flag = false;
            }
        }
        //search，判断是客服权限则返回false，不给客服查询字段，search： false
        else if(str == 'search'){
            if(Ctx.getUser().get('brhCode') === '000' &&  (Ctx.getUser().get('loginName') === 'admin' || Ctx.getUser().get('loginName') === 'qitian')){
                flag = true;
            }
            else if (Ctx.avail('postedTicket.service')) {
                flag = false;
            }
            else{
                flag = true;
            }
        }
        return flag;
    }

    //变更发奖方式
    function updateAwardWayDialog(grid){
        var uploader, tpl = null;
        uploader = tpl = uploadTpl({});
        var $dialog = Opf.Factory.createDialog(tpl, {
            destroyOnClose: true,
            autoOpen: true,
            width: 500,
            height: 400,
            modal: true,
            buttons: [{
                type: 'submit',
                click: function (e) {
                    var fileSelected = ($dialog.find("input[name='file']").val() === "" ? false : true);
                    var outOfWay = $("form select").val();
                    var MultipartFile = $("form input[name='MultipartFile']").val();
                    if (fileSelected) {
                        uploader.form.append('<input name="MultipartFile" type="hidden" value="' + MultipartFile + '"/>');
                        uploader.form.append('<input name="outOfWay" type="hidden" value="' + outOfWay + '"/>');
                        uploader.submit();
                    }
                    else {
                        $("label[for='uploadfile']").addClass("error").text("请选择文件");
                    }
                }
            }, {
                type: 'cancel'
            }],
            create: function () {
                var $me = $(this),
                    $indicator = $me.find('.uploadFileIndicator'),
                    $trigger = $me.find('.uploadfile'),
                    $submitBtn = $me.closest('.ui-dialog').find('button[type="submit"]');
                $me.find(".form-row:last").after('<div class="form-row"><div class="row-num">3</div><label class="content-lab">导入的奖励明细，发放方式更新为：<select><option value="1">虚拟账户出款</option><option value="2">银行转账</option><option value="3">结算平台出款</option></select></label></div>');
                uploader = new Uploader({
                    data: {},
                    type: 'GET',
                    name: 'file',
                    trigger: $trigger,
                    action: url._('posted.ticket.importDetailOut'),
                    accept: '.xls, .xlsx',
                    change: function () {
                        $("label[for='uploadfile']").removeClass("error").text($("form input[name='file']").val());
                    },
                    beforeSubmit: function () {
                        Opf.UI.busyText($submitBtn);
                        $indicator.show();
                    },
                    complete: function () {
                        $indicator.hide();
                        Opf.UI.busyText($submitBtn, false);
                    },
                    progress: function (queueId, event, position, total, percent) {
                        if (percent) {
                            $indicator.find('.progress-percent').text(percent + '%').show();
                        }
                    },
                    success: function (queueId, resp) {
                        if (resp.success === false) {
                            Opf.alert({title: '提示', message: resp.remark + '请<a href="javascript:void(0)" data-download="'+resp.data+'">点击查看明细</a>'});
                            $("a[data-download]").on('click', function(target){
                                var url = $(target.delegateTarget).attr("data-download");
                                Opf.download(url);
                            })
                        } else {
                            $me.dialog("close");
                            grid.trigger('reloadGrid', {current: true});
                            Opf.alert(resp.remark || '导入成功！');
                        }

                    }
                });

                // 下载按钮
                $(this).find('.download-btn').click(function (event) {
                    Opf.ajax({
                        type: 'GET',
                        url: url._('posted.ticket.downloadDetailOut'),
                        success: function(res){
                            if(res.success && res.data){
                                Opf.download(res.data);
                            }
                        }
                    });
                });
            }
        });
    }
    //导入贴票
    function inputDialog(grid){
        var uploader, tpl = null;
        uploader = tpl = uploadTpl({});
        var $dialog = Opf.Factory.createDialog(tpl, {
            destroyOnClose: true,
            autoOpen: true,
            width: 400,
            height: 300,
            modal: true,
            buttons: [{
                type: 'submit',
                click: function (e) {
                    var fileSelected = ($dialog.find("input[name='file']").val() === "" ? false : true);
                    var MultipartFile = $("form input[name='MultipartFile']").val();
                    if (fileSelected) {
                        uploader.form.append('<input name="MultipartFile" type="hidden" value="' + MultipartFile + '"/>');
                        uploader.submit();
                    }
                    else {
                        $("label[for='uploadfile']").addClass("error").text("请选择文件");
                    }
                }
            }, {
                type: 'cancel'
            }],
            create: function () {
                var $me = $(this),
                    $indicator = $me.find('.uploadFileIndicator'),
                    $trigger = $me.find('.uploadfile'),
                    $submitBtn = $me.closest('.ui-dialog').find('button[type="submit"]');
                uploader = new Uploader({
                    data: {},
                    type: 'GET',
                    name: 'file',
                    trigger: $trigger,
                    action: url._('posted.ticket.importDetail'),
                    accept: '.xls, .xlsx',
                    change: function () {
                        $("label[for='uploadfile']").removeClass("error").text($("form input[name='file']").val());
                    },
                    beforeSubmit: function () {
                        Opf.UI.busyText($submitBtn);
                        $indicator.show();
                    },
                    complete: function () {
                        $indicator.hide();
                        Opf.UI.busyText($submitBtn, false);
                    },
                    progress: function (queueId, event, position, total, percent) {
                        if (percent) {
                            $indicator.find('.progress-percent').text(percent + '%').show();
                        }
                    },
                    success: function (queueId, resp) {
                        if (resp.success === false) {
                            Opf.alert({title: '提示', message: resp.remark + '请<a href="javascript:void(0)" data-download="'+resp.data+'">点击查看明细</a>'});
                            $("a[data-download]").on('click', function(target){
                                var url = $(target.delegateTarget).attr("data-download");
                                Opf.download(url);
                            })
                        } else {
                            $me.dialog("close");
                            grid.trigger('reloadGrid', {current: true});
                            Opf.alert(resp.remark || '导入成功！');
                        }

                    }
                });

                // 下载按钮
                $(this).find('.download-btn').click(function (event) {
                    Opf.ajax({
                        type: 'GET',
                        url: url._('posted.ticket.downloadDetail'),
                        success: function(res){
                            if(res.success && res.data){
                                Opf.download(res.data);
                            }
                        }
                    });
                });
            }
        });
    }
    //批量解冻
    function batchThawDialog(grid){
        var ids = Opf.Grid.getSelRowIds(grid);
        var flag = true;
        if(ids.length < 1){
            Opf.alert('请选择一项，再进行操作.');
            return false;
        }
        else{
            _.each(ids, function(v, i){
                var s = grid.getRowData(v);
                if(s.status != 5){
                    flag = false;
                }
            });
            if(!flag){
                Opf.alert('选择项有[非审核通过]状态.');
            }
        }
        if(flag){
            Opf.confirm('您确定批量解冻吗？<br><br> ', function (result) {
                if (result) {
                    Opf.ajax({
                        type: 'POST',
                        url: url._('posted.ticket.batchthaw'),
                        jsonData: {ids: ids},
                        success: function (resp) {
                            grid.trigger('reloadGrid', {current: true});
                            Opf.alert(resp.msg);
                        },
                        error: function(resp){
                            Opf.alert(resp.msg);
                        }
                    });
                }
            });
        }
    }

    //批量审核
    function batchAuditDialog(grid){
        var ids = Opf.Grid.getSelRowIds(grid);
        var flag = true;
        if(ids.length < 1){
            Opf.alert('请选择一项，再进行操作.');
            return false;
        }
        else{
            _.each(ids, function(v, i){
                var s = grid.getRowData(v);
                if(s.status != 4){
                    flag = false;
                }
            });
            if(!flag){
                Opf.alert('选择项有[非未审核]状态.');
            }
        }
        if(flag){
            var html = _.template(['<div id="div-check" style="padding: 20px 40px;">' ,
                '<div style="padding: 10px;">审核状态：&nbsp;&nbsp;<select id="sl-status"><option value="5">审核通过</option><option value="6">审核拒绝</option></select></div>' ,
                '</div></div>'].join(''));
            var $dialog = Opf.Factory.createDialog(html(), {
                title: '批量审核',
                destroyOnClose: true,
                autoOpen: true,
                width: 300,
                height: 180,
                modal: true,
                buttons: [{
                    type: 'submit',
                    click: function () {
                        Opf.ajax({
                            type: 'POST',
                            async: false,
                            url: url._('posted.ticket.batch.audit'),
                            jsonData: {ids: ids, status: $(this).find('#sl-status').val()},
                            success: function (resp) {
                                $dialog.dialog('close');
                                grid.trigger('reloadGrid', {current: true});
                                Opf.alert(resp.msg);
                            }
                        });
                    }
                },{
                    type: 'cancel',
                    click: function(){
                        $dialog.dialog('close');
                    }
                }]
            });
        }
    }

    function checkHandle(rowData, grid){
        var html = _.template(['<div>' ,
            '<div class="div_hd_error" style="border-color: #eed3d7;background-color: #f2dede;margin-top:-4px;padding: 10px 0 10px 0;display: none;">',
            '<center><a class="hd_error" style="color: #b94a48;"></a></center>',
            '</div>',
            '<div id="div-check" style="padding: 20px 40px;">' ,
            '<div style="padding: 10px;">贴票金额：&nbsp;&nbsp;<input id="txt-ticketAmount" type="text" value="<%=rowData.ticketAmount%>" readonly /></div>' ,
            '<div style="padding: 10px;">代扣税额：&nbsp;&nbsp;<input id="txt-taxAmount" type="text" value="<%=rowData.taxAmount%>" readonly /></div>' ,
            '<div style="padding: 10px;">审核状态：&nbsp;&nbsp;<select id="sl-status"><option value="5">审核通过</option><option value="6">审核拒绝</option></select></div>' ,
            '<div style="padding: 10px;">审核描述：&nbsp;&nbsp;<textarea id="tx-remarks" style="min-width: 180px; min-height: 80px;"></textarea></div>' ,
            '<div style="padding: 10px;"><input id="sl-batchInAccount" type="checkbox" />&nbsp;&nbsp;同时处理同批次下所有明细</div>' ,
            '</div></div>'].join(''));
        var $dialog = Opf.Factory.createDialog(html({rowData: rowData}), {
            title: '审核',
            destroyOnClose: true,
            autoOpen: true,
            width: 400,
            height: 420,
            modal: true,
            buttons: [{
                type: 'submit',
                click: function () {
                    var batchInAccount = $(this).find('#sl-batchInAccount').is(':checked');
                    var batchNo = rowData.batchNo;
                    if($(this).find('#sl-status').val() == '6'){
                        if($(this).find('#tx-remarks').val().trim() == ''){
                            CommonUI.loadError($(this), '审核拒绝需填写审核描述.');
                            return false;
                        }
                    }
                    else{
                        CommonUI.loadCleanError($(this), '');
                    }
                    Opf.ajax({
                        type: 'PUT',
                        async: false,
                        url: url._('posted.ticket.audit.edit', {id: rowData.id}),
                        jsonData: {
                            id: rowData.id,
                            status: $(this).find('#sl-status').val(),
                            remarks: $(this).find('#tx-remarks').val(),
                            batchInAccount: batchInAccount,
                            batchNo: batchNo
                        },
                        success: function (resp) {
                            if(resp.success){
                                $dialog.dialog('close');
                                grid.trigger('reloadGrid', {current: true});
                                Opf.Toast.success('审核成功.');
                            }
                            else{
                                Opf.Toast.error('审核失败.');
                            }
                        }
                    });
                }
            },{
                type: 'cancel',
                click: function(){
                    $dialog.dialog('close');
                }
            }]
        });
    }

    function ticketEditHandle(rowData, grid){
        var model1 = null;
        var model2 = null;

        Opf.ajax({
            type: 'GET',
            url: 'api/postedTicket/reward/info/'+rowData.id,
            async: false,
            success: function(resp){
                if(resp.status){
                    _.each(resp.data, function(v, i){
                        if(v.checked){
                            model1 = resp.data[i];
                        }
                        else{
                            model2 = resp.data[i];
                        }
                    });
                }
            }
        });
        if(!model1){ return false; }
        var $dialog = Opf.Factory.createDialog(ticketEditTpl({model: model1}), {
            title: '贴票',
            destroyOnClose: true,
            autoOpen: true,
            width: 400,
            height: 480,
            modal: true,
            buttons: [{
                type: 'submit',
                click: function () {
                    var form = $(this).find('.form-value');
                    var objStr = {};
                    _.each(form, function(v, i){
                        if($(v).attr('id') == 'status'){
                            objStr[$(v).attr('id')]=$(v).attr('key');
                        }
                        else{
                            objStr[$(v).attr('id')]=$(v).val();
                        }
                    });
                    Opf.ajax({
                        type: 'PUT',
                        async: false,
                        url: 'api/postedTicket/reward/info/update/'+rowData.id,
                        jsonData: objStr,
                        success: function (resp) {
                            if(resp.success){
                                $dialog.dialog('close');
                                Opf.Toast.success('奖励明细编辑成功.');
                                grid.trigger('reloadGrid', {current: true});
                            }
                            else{
                                Opf.Toast.error('奖励明细编辑失败.');
                            }
                        }
                    });
                }
            },{
                type: 'cancel',
                click: function(){
                    $dialog.dialog('close');
                }
            }]
        });
        $dialog.find('#isTicket').on('change', function(){
            var ck = $(this).val();
            if(ck == 2){
                $dialog.find('#taxAmount').val(model2.taxAmount);
                $dialog.find('#thawAmount').val(model2.thawAmount);
                $dialog.find('#ticketAmount').val(model2.ticketAmount);
                $dialog.find('#status').val(REWARDSTATUS_MAP[model2.status]);
                $dialog.find('#status').attr('key', model2.status);
            }
            else if(ck == 1){
                $dialog.find('#taxAmount').val(model1.taxAmount);
                $dialog.find('#thawAmount').val(model1.thawAmount);
                $dialog.find('#ticketAmount').val(model1.ticketAmount);
                $dialog.find('#status').val(REWARDSTATUS_MAP[model1.status]);
                $dialog.find('#status').attr('key', model1.status);
            }
        });
    }

    function ticketHandle(rowData, grid){
        var html = _.template(['<div>' ,
            '<div class="div_hd_error" style="border-color: #eed3d7;background-color: #f2dede;margin-top:-4px;padding: 10px 0 10px 0;display: none;">',
            '<center><a class="hd_error" style="color: #b94a48;"></a></center>',
            '</div>',
            '<div id="div-check" style="padding: 20px 40px;">' ,
            '<div style="padding: 10px;">' ,
            '批次号：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input id="txt-batchNo" type="text" value="<%=rowData.batchNo%>" readonly />&nbsp;&nbsp;&nbsp;&nbsp;' ,
            '用户编号：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input id="txt-userNum" type="text" value="<%=rowData.userNum%>" readonly />' ,
            '</div>' ,
            '<div style="padding: 10px;">' ,
            '姓 名：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input id="txt-userName" type="text" value="<%=rowData.userName%>" readonly />&nbsp;&nbsp;&nbsp;&nbsp;' ,
            '用户类型：<span style="padding: 0 20px;"><input id="txt-userType" type="text" value="'+USERTYPE_MAP[rowData.userType]+'" readonly /></span>' ,
            '</div>' ,
            '<div style="padding: 10px;">贴票金额：&nbsp;&nbsp;<input id="txt-ticketAmount" type="text" /> 元</div>' ,
            '<div style="padding: 10px;">代扣税额：&nbsp;&nbsp;<input id="txt-taxAmount" type="text" /> 元</div>' ,
            '</div></div>'].join(''));
        var $dialog = Opf.Factory.createDialog(html({rowData: rowData}), {
            title: '贴票',
            destroyOnClose: true,
            autoOpen: true,
            width: 700,
            height: 380,
            modal: true,
            buttons: [{
                type: 'submit',
                click: function () {
                    var exp = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/;
                    var ticketAmount = $(this).find('#txt-ticketAmount').val().trim();
                    var taxAmount = $(this).find('#txt-taxAmount').val().trim();

                    if(ticketAmount == '' || taxAmount == ''){
                        CommonUI.loadError($(this), '金额输入不能为空,请重新输入.');
                        return false;
                    }
                    else if(!exp.test(ticketAmount) || !exp.test(taxAmount)) {
                        CommonUI.loadError($(this), '金额输入无效格式,请重新输入.');
                        return false;
                    }
                    else{
                        CommonUI.loadCleanError($(this), '');
                    }
                    Opf.ajax({
                        type: 'PUT',
                        async: false,
                        url: url._('posted.ticket.audit', {id: rowData.id}),
                        jsonData: {ticketAmount: ticketAmount, taxAmount: taxAmount},
                        success: function (resp) {
                            if(resp.success){
                                $dialog.dialog('close');
                                Opf.Toast.success('贴票成功.');
                                grid.trigger('reloadGrid', {current: true});
                            }
                            else{
                                Opf.Toast.success('贴票失败.');
                            }
                        }
                    });
                }
            },{
                type: 'cancel',
                click: function(){
                    $dialog.dialog('close');
                }
            }]
        });
    }

    function thawHandle(rowData, grid){
        var html = _.template(['<div>' ,
            '<div class="div_hd_error" style="border-color: #eed3d7;background-color: #f2dede;margin-top:-4px;padding: 10px 0 10px 0;display: none;">',
            '<center><a class="hd_error" style="color: #b94a48;"></a></center>',
            '</div>',
            '<div id="div-check" style="padding: 20px 40px;">' ,
            '<div style="padding: 10px;">' ,
            '可解冻金额：<input id="txt-ticketAmount" type="text" value="<%=rowData.thawAmount%>" readonly /> 元' ,
            '</div>' ,
            '<div style="padding: 10px;">解冻金额：&nbsp;&nbsp;&nbsp;<select><option value="0">全部金额</option></select></div>' ,
            '<div style="padding: 10px;"><input id="sl-batchInAccount" type="checkbox" />&nbsp;&nbsp;同时处理同批次下所有明细</div>' ,
            //'<div style="padding: 10px;">解冻金额：&nbsp;&nbsp;<input id="txt-ticketAmount" type="text" /> 元</div>' ,
            '</div></div>'].join(''));
        var $dialog = Opf.Factory.createDialog(html({rowData: rowData}), {
            title: '解冻',
            destroyOnClose: true,
            autoOpen: true,
            width: 400,
            height: 300,
            modal: true,
            buttons: [{
                type: 'submit',
                click: function () {
                    var batchInAccount = $(this).find('#sl-batchInAccount').is(':checked');
                    var batchNo = rowData.batchNo;
                    Opf.ajax({
                        type: 'PUT',
                        async: false,
                        url: url._('posted.ticket.thaw', {id: rowData.id}),
                        jsonData: {
                            id: rowData.id,
                            batchInAccount: batchInAccount,
                            batchNo: batchNo
                        },
                        success: function (resp) {
                            if(resp.success){
                                $dialog.dialog('close');
                                Opf.Toast.success('解冻成功.');
                                grid.trigger('reloadGrid', {current: true});
                            }
                            else{
                                Opf.Toast.success('解冻失败.');
                            }
                        }
                    });
                }
            },{
                type: 'cancel',
                click: function(){
                    $dialog.dialog('close');
                }
            }]
        });
    }

    function statusFormatter(val){
        return STATUS_MAP[val] || '';
    }

    function userTypeFormatter(val){
        return USERTYPE_MAP[val] || '';
    }

    function dateFormatter(val) {
        return val ? moment(val, 'YYYYMMDDHHmm').format('YYYY/MM/DD HH:mm') : '';
    }

    function isTicketFormatter(val){
        return ISTICKET_MAP[val] || '';
    }

    function outWayFormatter(val){
        return OUTWAY_MAP[val] || '';
    }
    App.on('posted:ticket:list', function (data) {
        App.show(new View(data));
    });

    return View;
});
