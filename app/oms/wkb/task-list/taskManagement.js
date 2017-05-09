/**
 * Created by wupeiying on 2015/8/19.
 */
define(['App',
    'jquery.jqGrid',
    'jquery.validate',
    'upload'
], function(App) {

    var STATUS_MAP = {
        0: '异常',
        1: '签到',
        2: '签退'
    };

    var View = Marionette.ItemView.extend({
        tabId: 'menu.task.management.config',
        template: _.template(['<div class="row">',
        '<div class="col-xs-12 jgrid-container">',
        '<table id="task-Management-grid-table"></table>',
        '<div id="task-Management-grid-pager" ></div>',
        '</div>',
        '</div>'].join('')),

        initialize: function () {},

        onRender: function() {
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
                width: 1000,
                height: 700,
                modal: true,
                title: '商审人员在线管理',
                buttons: [{
                    type: 'cancel',
                    text: '关闭'
                }]
            });
            $('.ui-jqdialog-content').attr("style","overflow-x:hidden!important;");
        },
        renderGrid: function() {
            var me = this;
            var grid = me.grid = App.Factory.createJqGrid({
                rsId: 'task.Management',
                caption: '',
                gid: 'task-Management-grid',
                url: url._('task.mcht.status.save'),
                actionsCol: { view: false, add: false, edit: false, del: false, search: false, refresh: false,
                    width: 45,
                    canButtonRender: function (name, options, rowData) {
                        var status = rowData.oprStatus;
                        if (status != '2') {
                            return name == 'down';
                        }
                        else{
                            return false;
                        }
                    },
                    extraButtons: [
                        {
                            name: 'down', icon: '', title: '处理', caption: '处理',
                            click: function (name, opts, rowData) {
                                onOprStatus(me, rowData);
                            }
                        }
                    ]
                },
                nav: {
                    actions: { view: false, add: false, edit: false, del: false, search: false, refresh: false }
                },
                colNames: {
                    id                  : '',
                    oprName             : '操作人',
                    oprStatus           : '用户状态',//0-异常 1-签到，2-签退
                    lastUpdTime         : '最后操作时间',
                    lastAppintTime      : '最后指派时间',
                    curTaskNum          : '当前任务池数量',
                    loginIp             : '签到时登录的ip',
                    maxTask             : '任务池最大数',
                    descr               : '描述'
                },
                colModel: [
                    {name: 'id', hidden: true},
                    {name: 'oprName', search: true, editable: true},
                    {name: 'oprStatus', editable: true, formatter: statusFormatter,
                        edittype: 'select',
                        editoptions: {
                            value: STATUS_MAP
                        },
                        stype: 'select',
                        searchoptions: {
                            sopt: ['eq'],
                            value: STATUS_MAP
                        },
                        width: 90
                    },
                    {name: 'lastUpdTime', editable: true, formatter: timeFormatter},
                    {name: 'lastAppintTime', editable: true, formatter: timeFormatter},
                    {name: 'curTaskNum', editable: true},
                    {name: 'loginIp', editable: true},
                    {name: 'maxTask', editable: true, hidden: true},
                    {name: 'descr', editable: true}//, formatter: remarkFormatter
                ],
                loadComplete: function (grid) {}
            });

            return grid;
        }
    });

    function onOprStatus(me, rowData){
        var html = [
            '<div id="changeStatusView">',
            '<div style="padding: 10px 0 0 30px;">',
            '用户状态:&nbsp;&nbsp;&nbsp;&nbsp;',
            '<select role="select" name="status" class="FormElement ui-widget-content ui-corner-all" style="width: 80px;">',
            '<option value="0">异常</option>',
            //'<option value="1">签到</option>',
            '<option value="2">签退</option>',
            '</select>',
            '</div>',
            '<div style="padding: 10px 0 0 30px;">',
            '<span style="padding: 0 42px 0 0;">原因:</span>',
            '<textarea name="remark" style="max-width: 400px; max-height: 130px; width: 230px; height: 134px; margin: 0px;" placeholder="请输入原因"></textarea>',
            '</select>',
            '</div>',
            '</div>'
        ].join('');
        var $dialog = Opf.Factory.createDialog(html, {
            destroyOnClose: true,
            title: '用户状态修改',
            autoOpen: true,
            width: 400,
            height: 330,
            modal: true,
            buttons: [{
                type: 'submit',
                click: function () {
                    var op_select = $dialog.find('option:selected').val();//$dialog.find('option:selected').text();
                    var remarkContent = $dialog.find('[name="remark"]').val();
                    Opf.confirm('您确定更改吗？<br>', function () {
                        Opf.ajax({
                            type: 'PUT',
                            jsonData: { id: rowData.id, oprStatus: op_select, descr: remarkContent },//Ctx.getUser().get('id')
                            url: url._('task.mcht.status.save'),
                            successMsg: '修改成功',
                            success: function () {
                                me.grid.trigger('reloadGrid', {current: true});
                            },
                            complete: function () {
                                $dialog.dialog('close');
                            }
                        });
                    });
                }
            }]
        });
    }

    function statusFormatter(val){
        return STATUS_MAP[val] || '';
    }

    function timeFormatter(val) {
        return val ? moment(val, 'YYYYMMDDHHmm').format('YYYY/MM/DD HH:mm') : '';
    }

    function remarkFormatter (val, grid) {
        var me = arguments;
        var value = val || '' ;
        if(value.length > 9){
            value = value.substring(0, 9) + '......';
        }

        var str_value = me[0];
        var html = '<a href="javascript:void(0)" class="lb-remark'+ me[1].rowId + '" value="'+str_value+'">' + value + '</a>';

        $('.lb-remark'+ me[1].rowId).on('click', function () {
            alert('123');
        });

        return html;
    }

    return View;

});