define([
    'tpl!app/oms/meeting/launch/list/templates/framework.tpl',
    'jquery.jqGrid',
    'jquery.validate',
    'moment.override'
],function(tpl){
    //会议状态
    var STATUS_MAP = {
        "0": "准备中",
        "1": "进行中",
        "2": "结束",
        "3": "取消"
    };

    //格式化日期格式
    var dateFormatter = function(value) {
        return value ? moment(value, "YYYYMMDDhhmmss").format("YYYY/MM/DD HH:mm:ss") : '';
    };

    //禁用当前提交按钮
    var setBtnStatus = function($btn, flag){
        $btn.prop('disabled', flag === false);
    };

    //更改员工状态
    var showChangeStateDialog = function(me, rowData) {
        var tpl = [
            '<form onsubmit="return false;" >',
                '<table width="100%" cellspacing="0" cellpadding="0" border="0">',
                    '<tbody>',
                        '<tr class="FormData">',
                            '<td class="CaptionTD" style="padding-right:10px;">会议状态:</td>',
                            '<td class="DataTD">',
                                '&nbsp;',
                                '<select role="select" name="state" class="FormElement ui-widget-content ui-corner-all">',
                                    '<option value="1">进行中</option>',
                                    '<option value="2">结束</option>',
                                    '<option value="3">取消</option>',
                                '</select>',
                            '</td>',
                        '</tr>',
                    '</tbody>',
                '</table>',
            '</form>'
        ].join('');
        var $dialog = Opf.Factory.createDialog(tpl, {
            destroyOnClose: true,
            title: '状态变更',
            autoOpen: true,
            width: 300,
            height: 150,
            modal: true,
            buttons: [{
                type: 'submit',
                click: function () {
                    var $state = $(this).find('[name="state"]');
                    var oldState = rowData.status;
                    var newState = $state.val();
                    var selSateTxt = $state.find('option:selected').text();
                    if (oldState != newState) {
                        var addConfirmMessage = '';
                        if (newState == "3") {
                            addConfirmMessage = '改为取消后，此次会议将被删除！';
                        }
                        Opf.confirm('您确定更改会议状态为 "' + selSateTxt + '" 吗？<br><br> ' + addConfirmMessage, function (result) {
                            if (result) {
                                Opf.ajax({
                                    type: 'PUT',
                                    jsonData: {
                                        oldStatus: oldState,
                                        newStatus: newState
                                    },
                                    url: url._('meeting.launch.changestate', {id: rowData.id}),
                                    successMsg: '更改会议状态成功',
                                    success: function () {
                                        me.grid.trigger('reloadGrid', {current:true});
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
                $(this).find('[name="state"]').val(rowData.status=="0"?"1":rowData.status);
            }
        });
    };

    return Marionette.ItemView.extend({
        tabId: 'menu.meeting.launch',
        template: tpl,
        events: {
            'click #J_meeting button[name=submitBtn]': 'addMeeting'
        },

        addMeeting: function(){
            var me = this;
            var context = $("#J_meeting");
            var postData = {
                url: $("input[name=url]", context).val(),
                remark: $("textarea[name=remark]", context).val()
            };

            //检测会议链接
            var setupValidation = Opf.Validate.setup;
                Opf.Validate.addRules(context, {
                    rules: {
                        url: {
                            required : true,
                            url: true,
                            maxlength: 200
                        },
                        remark: {
                            maxlength: 100
                        }
                    }
                });
            var ret = setupValidation(postData, context)[0];
            if(!ret) return;

            //将当前提交按钮状态置为不可用
            setBtnStatus($("button[name=submitBtn]",context), false);

            //发送数据
            var ajaxOptions = {
                type: 'post',
                dataType: 'json',
                contentType: 'application/json',
                url: url._("meeting.launch.save"),
                data: JSON.stringify(postData),
                success: function(rsp){
                    me.grid.trigger("reloadGrid", {current:true});
                },
                complete: function(xhr, ts){
                    //清空输入框
                    $("input,textarea", context).val("");

                    //将提交按钮的状态置为可用
                    setBtnStatus($("button[name=submitBtn]",context), true);
                }
            };
            $.ajax(ajaxOptions);
        },

        initialize: function (options) {
            //TODO
        },

        onRender: function () {
            var me = this;
            var context = me.$el;
            if(!Ctx.avail('meeting.launch.create')){
                $("div.row", context).eq(0).remove();
            }
            _.defer(function () {
                me.renderGrid();
            });
        },

        renderGrid: function () {
            var me = this;
            me.grid = App.Factory.createJqGrid({
                caption: '发起会议',
                tableCenterTitle: '会议列表',
                rsId:'meeting.launch',
                gid: 'meeting-launch-grid',
                url: url._("meeting.launch.list"),
                datatype: 'json',
                actionsCol: {
                    width: 100,
                    view: false,
                    edit: false,
                    del : false,
                    canButtonRender: function (name, options, rowData) {
                        if(name === 'changestate' && !Ctx.avail('meeting.launch.changestate')){
                            return false;
                        }
                    },
                    extraButtons:[
                        {
                            name: 'changestate', icon: 'icon-opf-state-change', title: '更改会议状态',
                            click: function (name, opts, rowData) {
                                showChangeStateDialog(me, rowData);
                            }
                        }
                    ]
                },
                nav: {actions:{add:false,search:false,refresh:true}},
                colNames: {
                    id:         'id',
                    createTime: '发起时间', //格式：yyyyMMddHHmmss
                    oprName:    '发起人',
                    url:        '会议链接',
                    remark:     '会议说明',
                    status:     '会议状态' // 0:准备中，1：进行中，2：已结束，3：已取消
                },
                colModel: [
                    //主键
                    {
                        name: 'id',
                        index:'id',
                        hidden: true
                    },
                    //发起时间
                    {
                        name: 'createTime',
                        index: 'createTime',
                        formatter: function(value){
                            return dateFormatter(value);
                        }
                    },
                    //发起人
                    {
                        name: 'oprName',
                        index: 'oprName'
                    },
                    //会议链接
                    {
                        name: 'url',
                        index: 'url'
                    },
                    //会议说明
                    {
                        name: 'remark',
                        index: 'remark'
                    },
                    //会议状态
                    {
                        name: 'status',
                        index: 'status',
                        formatter: function(value){
                            return STATUS_MAP[value]||"";
                        }
                    }
                ],

                loadComplete: function () {
                    //TODO
                }
            });
        }
    });
});