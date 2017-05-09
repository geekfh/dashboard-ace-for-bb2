/**
 * Created by wupeiying on 2015/7/3.
 */
define(['App',
    'tpl!app/oms/operate/blacklist/templates/blacklist.tpl',
    'tpl!app/oms/operate/blacklist/templates/changeStatus.tpl',
    'tpl!app/oms/operate/blacklist/add/uploadFile.tpl',
    'jquery.jqGrid',
    'jquery.validate',
    'upload'
], function(App, tpl, changeStatusTpl, uploadFileTpl) {

    var TAPE_MAP = {
        'licenceNo':    '营业执照号码',
        'idNo':         '身份证号码',
        'phoneNo':      '手机号码',
        'orgCode':      '组织机构证号',
        'bankCardNo':   '收款银行号卡号'
    };


    var STATUS_MAP = {
        0: '停用',
        1: '启用'
    };

    var EDIT_MAP = {
        0: '否',
        1: '是'
    };

    var View = Marionette.ItemView.extend({
        tabId: 'menu.operate.blacklist',
        template: tpl,

        initialize: function () {

        },

        onRender: function() {
            var me = this;
            _.defer(function () {
                me.renderGrid();
            });
        },

        renderGrid: function() {
            var me = this;
            var grid = me.grid = App.Factory.createJqGrid({
                rsId:'operate.blacklist',
                caption: 'blacklist',
                gid: 'operate-blacklist-grid',
                url: url._('operate.blacklist'),
                actionsCol: {
                    del: false,
                    width: 100,
                    extraButtons: [
                        {
                            name: 'changeStatus', icon: 'icon-opf-state-change', title: '黑名单启用/停用',
                            click: function (name, opts, rowData) {
                                //if (!Ctx.avail('operate.blacklist.status.edit')) {
                                //    return;
                                //}

                                showChangeStatusDialog(me, rowData);
                            }
                        }
                    ]
                },
                nav: {
                    actions: {
                        addfunc: function () {
                            me.onAddModel();
                        }
                    },
                    edit: {
                        beforeShowForm: function(form) {
                            if(form.find('#isEdit').val() == 0){
                                form.find('input[name="value"]').attr('readonly','true');
                            }
                            form.find('#tr_isEdit').hide();
                        }
                    }
                },
                colNames: {
                    id                  : '',
                    type                : '黑名单要素',
                    value               : '黑名单要素内容',
                    mchtNo              : '商户号',
                    status              : '状态',
                    isEdit              : '是否可编辑',
                    remark              : '备注',
                    oprNameCreate       : '创建人姓名',
                    createTime          : '创建时间',
                    oprNameUpdate       : '修改人姓名',
                    updateTime          : '修改时间'
                },

                colModel: [
                    {name: 'id',       hidden: true},
                    {name: 'type',     search:true, formatter: typeFormatter,
                        stype: 'select',
                        searchoptions: {
                        sopt: ['eq'],
                        value: TAPE_MAP
                    }},
                    {name: 'value',    editable: true, search:true},
                    {name: 'mchtNo'},
                    {name: 'status',   formatter: statusFormatter},
                    {name: 'isEdit',   hidden: true, editable: true, formatter: editFormatter},
                    {name: 'remark',editable: true , edittype:'textarea', editoptions:{
                        cols:30, rows:8
                    }},//, formatter: remarkFormatter
                    {name: 'oprNameCreate', hidden: true},
                    {name: 'createTime', hidden: true, formatter: timeFormatter},
                    {name: 'oprNameUpdate',search:true,hidden: true},
                    {name: 'updateTime',search:true,hidden: true,formatter: timeFormatter}
                ]
            });

            me.blackListImportBtn(grid);//批量导入

            return grid;
        },

        blackListImportBtn: function (grid)  {
            var me = this;
            if(!Ctx.avail('operate.blacklist.import')) {
                return;
            }
            Opf.Grid.navButtonAdd(grid, {
                caption: "",
                id: "blackListImport",
                name: "blackListImport",
                title:'批量导入',
                buttonicon: "icon-upload-alt white",
                position: "last",
                onClickButton: function(){
                    addImportDialog(me);
                }
            });
            $("#blackListImport").hover(function(){
                $(".icon-upload-alt").addClass("icon-upload-alt-hover");
            },function(){
                $(".icon-upload-alt").removeClass("icon-upload-alt-hover");
            });
        },

        onAddModel: function () {
            var me = this;
            require(['app/oms/operate/blacklist/add/add-blacklist-view'], function (AddView) {
                var view = new AddView();
                view.render();
                view.on('add:submit', function () {
                    view.destroy();
                    me.grid.trigger('reloadGrid', {current: true});
                });
            });
        }

    });

    function showChangeStatusDialog(me, rowData){
        var $dialog = Opf.Factory.createDialog(changeStatusTpl({date:moment().format('YYYYMMDD')+': '}), {
            destroyOnClose: true,
            title: '黑名单启用/停用',
            autoOpen: true,
            width: 400,
            height: 360,
            modal: true,
            buttons: [{
                type: 'submit',
                click: function () {
                    var $state = $dialog.find('[name="status"]');
                    var oldState = rowData.status;
                    var newState = $state.val();
                    var selSateTxt = $state.find('option:selected').text();
                    var remarkContent = $dialog.find('[name="remark"]').val();
                    var checkValue =  $dialog.find('#otherStatusElse').val();
                    if (oldState != newState) {
                        Opf.confirm('您确定更改为 "' + selSateTxt + '" 吗？<br>', function (result) {
                            if(remarkContent.trim() == ""){
                                Opf.alert('备注内容不能为空！');
                                return;
                            }
                            if (result) {
                                //TODO block target
                                Opf.ajax({
                                    type: 'PUT',
                                    jsonData: {
                                        oldStatus: oldState,
                                        newStatus: newState,
                                        reason: remarkContent,
                                        otherStatusElse: checkValue,
                                        mchtNo: rowData.mchtNo
                                    },
                                    url: url._('operate.blacklist.status.edit', {id: rowData.id}),
                                    successMsg: '修改成功',
                                    success: function () {
                                        me.grid.trigger('reloadGrid', {current: true});
                                    },
                                    complete: function () {
                                        $dialog.dialog('close');
                                    }
                                });
                            }
                        });
                    } else {
                        $(this).dialog('close');
                    }
                }
            }, {
                type: 'cancel'
            }],
            create: function () {
                $(this).find('[name="status"]').val(rowData.status);
                if(rowData.mchtNo == null || rowData.mchtNo == 0){
                    $(this).find('.checkbox').hide();//.attr('readonly','readonly');
                }
                $(this).find('#otherStatusElse, [name="bl_ck_status"]').on('click', function () {
                    if($dialog.find('#otherStatusElse').val() == "1")
                    {
                        $dialog.find('#otherStatusElse').removeAttr("checked");
                        $dialog.find('#otherStatusElse').val(0);
                    }
                    else
                    {
                        $dialog.find('#otherStatusElse').attr("checked","true");
                        $dialog.find('#otherStatusElse').val(1);
                    }
                });
                var curTextarea = $(this).find('[name="remark"]');
                curTextarea.val(moment().format('YYYYMMDD')+': ');
                var minLength = curTextarea.val().length;
                curTextarea.on('keydown', function(){
                    if($(this).val().length <= minLength){
                        $(this).val(moment().format('YYYYMMDD')+': ');
                    }
                });
            }
        });
    }

    //批量导入
    function addImportDialog(me){
        var titleName = "进件黑名单-批量导入";
        var uploader, tpl = null;
        uploader = tpl = uploadFileTpl({
            data: titleName
        });
        var $dialog = Opf.Factory.createDialog(tpl, {
            destroyOnClose: true,
            autoOpen: true,
            width: 450,
            height: 420,
            modal: true,
            buttons: [{
                type: 'submit',
                click: function (e) {
                    var fileSelected = ($dialog.find("input[name='file']").val() === "" ? false : true);

                    if(fileSelected){
                        uploader.submit();
                    }
                    else{
                        $("label[for='uploadfile']").addClass("error").text("请选择文件");
                    }
                }
            }, {
                type: 'cancel'
            }],
            create: function() {
            var $me = $(this),
                $indicator = $me.find('.uploadFileIndicator'),
                $trigger = $me.find('.uploadfile'),
                $submitBtn = $me.closest('.ui-dialog').find('button[type="submit"]');
                uploader = new Uploader({
                        data: {},
                        name: 'file',
                        trigger: $trigger,
                        action: url._('operate.blacklist.import.add'),//上传接口
                        accept: '.xls, .xlsx',
                        change: function () {
                            $("label[for='uploadfile']").removeClass("error").text($("form input[name='file']").val());
                        },
                        beforeSubmit: function () {
                            Opf.UI.busyText($submitBtn);
                        },
                        complete: function () {
                            Opf.UI.busyText($submitBtn,false);
                        },
                        progress: function(queueId, event, position, total, percent) {
                            if(percent) {
                                $indicator.find('.progress-percent').text(percent+'%').show();
                            }
                        },
                        success: function(queueId, resp) {
                            if(resp.success === false) {
                                Opf.alert({ title: '文件格式不合法', message: resp.msg ? resp.msg + '请先下载上传模板。' : '上传失败' });
                            } else {
                                me.grid.trigger("reloadGrid", [{current:true}]);
                                $me.dialog("destroy");
                                Opf.alert({ title: '上传成功', message: resp.msg });
                            }

                        }
                });

                // 下载按钮
                $(this).find('.download-btn').click(function(event) {
                    Opf.UI.setLoading($('#page-content'), true);
                    Opf.ajax({
                        url: url._('operate.blacklist.import.download'),
                        success: function (resp) {
                            Opf.download(resp.data);
                        },

                        error: function(resp) {
                            console.log("downlaod template error");
                        },

                        complete: function (resp) {
                            Opf.UI.setLoading($(event.target).closest('#page-content'),false);
                        }
                    });
                });
            }
        });
    }

    function editFormatter(val){
        return EDIT_MAP[val] || '';
    }

    function statusFormatter(val){
        return STATUS_MAP[val] || '';
    }

    function typeFormatter (val) {
        return TAPE_MAP[val] || '';
    }

    function timeFormatter (val) {
        var value = val || '';
        return value.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1-$2-$3 $4:$5:$6');
    }

    function remarkFormatter(val){
        if(val.length > 2){
            val = val.replace(val.substr(0, 2),'......');
        }
        return val;
    }
    App.on('operate:blacklist', function () {
        App.show(new View());
    });

    return View;

});










