/**
 * Created by wupeiying on 2015/9/14.
 */
define(['App',
    'jquery.jqGrid',
    'jquery.validate'
], function(App) {

    var tableCtTpl = [
        '<div class="row">',
        '<div class="col-xs-12 jgrid-container">',
        '<table id="account-sub-grid-table"></table>',
        '<div id="account-sub-grid-pager" ></div>',
        '</div>',
        '</div>'].join('');

    var STATUS_MAP = {
        1: '正常',
        2: '停用',
        3: '注销'
    };

    var SUB_MAP = {
        1:'资金',
        2:'积分',
        3:'授信'
    };

    var CURRENCY_MAP = {
        1:'人民币',
        2:'港币',
        3:'美元'
    };

    var View = Marionette.ItemView.extend({
        template: _.template(tableCtTpl),
        tabId: 'menu.accountSub.management',
        events: {},

        onRender: function () {
            var me = this;
            _.defer(function () {
                me.renderGrid();
            });
        },
        showDialog: function(){
            Opf.Factory.createDialog(this.$el, {
                dialogClass: 'ui-jqdialog',
                open: true,
                destroyOnClose: true,
                width: 1250,
                height: 600,
                modal: true,
                title: '子账户管理',
                buttons: [{
                    type: 'cancel',
                    text: '关闭'
                }]
            });
            $('.ui-jqdialog-content').attr("style","overflow-x:hidden!important;");
        },
        renderGrid: function () {
            var me = this;
            var grid = App.Factory.createJqGrid({
                rsId: 'accountSub',
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
                    width: 110,
                    extraButtons: [
                        {
                            name: 'changeStatus', icon: '', title: '状态变更', caption: '状态变更',
                            click: function (name, opts, rowData) {
                                showChangeStatusDialog(grid, rowData);
                            }
                        }/*,
                        {
                            name: 'changeFreeze', icon: '', title: '子账户余额冻结', caption: '子账户余额冻结',
                            click: function (name, opts, rowData) {
                                showChildFreezeDialog(grid, rowData);
                            }
                        }*///,
                        //{
                        //    name: 'changeUnFreeze', icon: '', title: '子账户余额解冻', caption: '子账户余额解冻',
                        //    click: function (name, opts, rowData) {
                        //        //if (!Ctx.avail('')) {
                        //        //    return;
                        //        //}
                        //        showChildUnFreezeDialog(grid, rowData);
                        //    }
                        //}
                    ]
                },
                gid: 'account-sub-grid',
                url: url._('account.sub.list'),//'amount.json',
                postData: {id: me.options.id},
                colNames: {
                    id			       :    '',
                    subAccountNo	   :	'编号',//子账户编号
                    subAccountStatus   :	'子账户状态',//(1正常/2停用/3锁定/4注销)
                    bussName       	   :	'业务类型',
                    subAccountType     :    '子账户类型',//("1":资金；"2":积分；"3":授信)
                    currencyType	   :	'币种类型',//账户类型为资金/授信时需要区分(1、人民币；2、港币；3、美元)
                    currencyTypeName   :    '币种',//显示币种名称
                    transitAmount	   :    '在途余额',
                    balanceAmount      :    '可用余额',
                    freezeAmount	   :	'冻结余额',
                    ctime	           :    '开户日期',
                    createTime         :    '开户时间'
                },
                colModel: [
                    {name: 'id', editable: false, hidden: true},
                    {name: 'subAccountNo', editable: false},
                    {name: 'subAccountStatus', editable: false, formatter: statusFormatter},
                    {name: 'bussName', editable: false},
                    {name: 'subAccountType', editable: false, formatter: subFormatter},
                    {name: 'currencyType', editable: false, hidden: true},
                    {name: 'currencyTypeName', editable: false, hidden: true},
                    {name: 'transitAmount', editable: false},
                    {name: 'balanceAmount', editable: false},
                    {name: 'freezeAmount', editable: false},
                    {name: 'createTime', editable: false, hidden: true},
                    {name: 'ctime',index: 'ctime', editable: false, formatter: dateFormatter}
                    //{name: 'createDate', editable: false},
                ],
                loadComplete: function () {}
            });

            return grid;
        }
    });

    function dateFormatter(val) {
        return val ? moment(val, 'YYYYMMDDHHmm').format('YYYY/MM/DD HH:mm') : '';
    }

    function showChildFreezeDialog(grid, rowData){
        var html = ['<div>',
            '<div class="div_hd_error" style="border-color: #eed3d7;background-color: #f2dede;margin-top:-4px;padding: 10px 0 10px 0;display: none;">',
            '<center><a class="hd_error" style="color: #b94a48;"></a></center>',
            '</div>',
            '<div style="padding: 10px 0 10px 0;">',
            '<div style="padding: 0 0 0 100px;">子账户编号:<label style="padding-left: 15px;" for="subAccountNo">',
             rowData.subAccountNo,
            '</label></div>',
            '<div style="padding: 0 0 0 112px;">可用余额:<label style="padding-left: 15px;" for="balanceAmount">',
             rowData.balanceAmount,
            '</label></div>',
            '<div style="padding: 0 0 0 112px;">冻结金额:<label style="padding-left: 15px;" for="freezeAmount">',
             rowData.freezeAmount,
            '</label></div>',
            '</div>',
            '<div style="padding-left: 50px;">',
            '<div style="border: 1px solid #ddd;padding: 10px 0 10px 50px;width: 350px;">',
            '<div style="padding-top: 10px;">冻结金额&nbsp;&nbsp;<input type="text" id="txt_freezeAmount" placeholder="请输入冻结金额" /></div>',
            '<div style="padding-top: 10px;">冻结原因&nbsp;&nbsp;',
            '<textarea id="ta_freezeAmount" placeholder="请输入冻结原因" style="max-width: 180px; max-height: 100px;width: 180px;height: 100px;" />',
            '</div>',
            '</div>',
            '</div>',
            '</div>'].join('');
        var $dialog = Opf.Factory.createDialog(html, {
            destroyOnClose: true,
            title: '子账户余额冻结',
            autoOpen: true,
            width: 450,
            height: 400,
            modal: true,
            buttons: [{
                type: 'submit',
                click: function () {
                    var amount = $(this).find('#txt_freezeAmount').val().trim();
                    var amountCause = $(this).find('#ta_freezeAmount').val().trim();

                    //if(parseInt(rowData.balanceAmount) <= parseInt(amount)){
                    //    $(this).find('.div_hd_error').animate({ opacity:0.9,speed:'slow'},200,function(){
                    //        $(this).css("display","block");
                    //    });
                    //    $(this).find('.hd_error').empty().html('冻结金额不能比可用金额大。');
                    //    return false;
                    //}
                    if(amount == ''){
                        $(this).find('.div_hd_error').animate({ opacity:0.9,speed:'slow'},200,function(){
                            $(this).css("display","block");
                        });
                        $(this).find('.hd_error').empty().html('冻结金额不能为空！');
                        return false;
                    }
                    else if(amountCause == ''){
                        $(this).find('.div_hd_error').animate({ opacity:0.9,speed:'slow'},200,function(){
                            $(this).css("display","block");
                        });
                        $(this).find('.hd_error').empty().html('冻结原因不能为空！');
                        return false;
                    }
                    else if(amountVerify(amount) == false){
                        $(this).find('.div_hd_error').animate({ opacity:0.9,speed:'slow'},200,function(){
                            $(this).css("display","block");
                        });
                        $(this).find('.hd_error').empty().html('输入有效金额格式！');
                        return false;
                    }
                    //TODO block target
                    Opf.ajax({
                        type: 'PUT',
                        url: url._('account.sub.status.freeze'),
                        successMsg: '修改成功！',
                        jsonData: {
                            id: rowData.id,
                            freezeAmount: amount,
                            freezeDesc: amountCause
                        },
                        success: function () {
                            grid.trigger('reloadGrid', {current: true});
                        },
                        complete: function () {
                            $(this).find('.div_hd_error').css("display","none");
                            $dialog.dialog('close');
                        }
                    });
                }
            },{
                type: 'cancel'
            }]
        });
    }

    function showChildUnFreezeDialog(grid, rowData){
        var html = ['<div>',
            '<div class="div_hd_error" style="border-color: #eed3d7;background-color: #f2dede;margin-top:-4px;padding: 10px 0 10px 180px;display: none;">',
            '<a class="hd_error" style="color: #b94a48;"></a>',
            '</div>',
            '<div style="padding: 10px 0 10px 0;">',
            '<div style="padding: 0 0 0 100px;">子账户编号:<label style="padding-left: 15px;" for="subAccountNo">',
            rowData.subAccountNo,
            '</label></div>',
            '<div style="padding: 0 0 0 112px;">可用余额:<label style="padding-left: 15px;" for="balanceAmount">',
            rowData.balanceAmount,
            '</label></div>',
            '<div style="padding: 0 0 0 112px;">解冻金额:<label style="padding-left: 15px;" for="freezeAmount">',
            rowData.balanceAmount,
            '</label></div>',
            '</div>',
            '<div style="padding-left: 50px;">',
            '<div style="border: 1px solid #ddd;padding: 10px 0 10px 50px;width: 350px;">',
            '<div style="padding-top: 10px;">解冻金额&nbsp;&nbsp;<input type="text" id="txt_freezeAmount" placeholder="请输入解冻金额" /></div>',
            '<div style="padding-top: 10px;">解冻原因&nbsp;&nbsp;',
            '<textarea id="ta_freezeAmount" placeholder="请输入解冻原因" style="max-width: 180px; max-height: 100px;width: 180px;height: 100px;" />',
            '</div>',
            '</div>',
            '</div>',
            '</div>'].join('');
        var $dialog = Opf.Factory.createDialog(html, {
            destroyOnClose: true,
            title: '子账户余额解冻',
            autoOpen: true,
            width: 450,
            height: 400,
            modal: true,
            buttons: [{
                type: 'submit',
                click: function () {
                    var amount = $(this).find('#txt_freezeAmount').val();
                    var amountCause = $(this).find('#ta_freezeAmount').val();
                    if(amount.trim() == '' || amountCause.trim() == ''){
                        $(this).find('.div_hd_error').animate({ opacity:0.9,speed:'slow'},200,function(){
                            $(this).css("display","block");
                        });
                        $(this).find('.hd_error').html('不能为空！');
                        return false;
                    }
                    //TODO block target
                    Opf.ajax({
                        type: 'PUT',
                        url: url._('account.sub.status.unfreeze'),
                        successMsg: '修改成功！',
                        jsonData: {
                            id: rowData.id
                            //freezeAmount: amount,
                            //freezeDesc: amountCause
                        },
                        success: function () {
                            grid.trigger('reloadGrid', {current: true});
                        },
                        complete: function () {
                            $dialog.dialog('close');
                        }
                    });
                }
            },{
                type: 'cancel'
            }]
        });
    }

    function showChangeStatusDialog(grid, rowData) {
        var $dialog = Opf.Factory.createDialog(statusFormTpl(rowData), {
            destroyOnClose: true,
            title: '子账户状态变更',
            autoOpen: true,
            width: 300,
            height: 150,
            modal: true,
            buttons: [{
                type: 'submit',
                click: function () {
                    var $state = $(this).find('[name="state"]');
                    var oldState = rowData.subAccountStatus;
                    var newState = $state.val();
                    var selSateTxt = $state.find('option:selected').text();
                    if (oldState != newState) {
                        //标识为  (1正常/2停用/3锁定/4注销)
                        Opf.confirm('您确定更改子账户状态为 "' + selSateTxt + '" 吗？<br><br> ', function (result) {
                            if (result) {
                                //TODO block target
                                Opf.ajax({
                                    type: 'PUT',
                                    jsonData: {
                                        subAccountNo: rowData.id,
                                        accountStatus: newState
                                        //oldStatus: oldState,
                                        //newStatus: newState
                                    },
                                    url: url._('account.sub.status.edit'),
                                    successMsg: '变更成功！',
                                    success: function () {
                                        grid.trigger('reloadGrid', {current: true});
                                    },
                                    complete: function () {
                                        $dialog.dialog('close');
                                    }
                                });
                            }
                        });
                    }
                    else {
                        $(this).dialog('close');
                    }
                }
            }, {
                type: 'cancel'
            }],
            create: function () {
                $(this).find('[name="state"]').val(rowData.subAccountStatus);
            }
        });
    }

    function statusFormTpl() {
        var str = [
            '<form onsubmit="return false;" style="padding-top:12px;">',
            '<table width="100%" cellspacing="0" cellpadding="0" border="0">',
            '<tbody>',
            '<tr class="FormData">',
            '<td class="CaptionTD">子账户状态:</td>',
            '<td class="DataTD">',
            '&nbsp;',
            '<select role="select" name="state" class="FormElement ui-widget-content ui-corner-all">',
            '<option value="1">正常</option>',
            '<option value="2">停用</option>',
            '<option value="3">注销</option>',
            '</select>',
            '</td>',
            '</tr>',
            '</tbody>',
            '</table>',
            '</form>',
        ].join('');

        return str;
    }

    function amountVerify(val){
        //var num = '21022332.05';
        var exp = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/;
        if(exp.test(val)){
            return true;
        }else{
            return false;
        }
    }

    function statusFormatter(val){
        return STATUS_MAP[val] || '';
    }

    function subFormatter(val){
        return SUB_MAP[val] || '';
    }

    function currencyFormatter(val){
        return CURRENCY_MAP[val] || '';
    }

    return View;
});