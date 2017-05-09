/**
 * Created by wupeiying on 2015/11/26.
 */

define(['App',
    'tpl!app/oms/account/profit/upload.tpl',
    'jquery.jqGrid',
    'upload'
], function(App, uploadTpl) {

    var tableCtTpl = [
        '<div class="row">',
        '<div class="col-xs-12 jgrid-container">',
        '<table id="posted-info-grid-table"></table>',
        '<div id="posted-info-grid-pager" ></div>',
        '</div>',
        '</div>'].join('');

    var STATUS_MAP = {
        1: '待审核',
        9: '审核通过'
    };

    var View = Marionette.ItemView.extend({
        template: _.template(tableCtTpl),
        tabId: 'menu.postedInfo.list',
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
                rsId: 'postedInfo',
                caption: '',
                filters: [
                    {
                        caption: '奖励分润搜索',
                        //defaultRenderGrid: false,
                        canSearchAll: true,
                        components: [
                            {
                                label: '批次状态',
                                name: 'status',
                                type: 'select',
                                defaultValue: '1',
                                options: {
                                    sopt: ['eq'],
                                    value: STATUS_MAP
                                }
                            }
                        ],
                        searchBtn: {
                            text: '搜索'
                        }
                }],
                nav: {
                    actions: {
                        search: false,
                        add: false
                    }
                },
                actionsCol: {
                    width: 150,
                    edit: false,
                    del: false,
                    canButtonRender: function (name, options, rowData) {
                        var status = rowData.status;
                        if(name === "postedTicket" && status == 9) {
                            return false;
                        }
                    },
                    extraButtons: [
                        {
                            name: 'detail', icon: '', title: '查看贴票数据', caption: '查看明细',
                            click: function (name, opts, rowData) {
                                detailHandle(rowData);
                            }
                        },
                        {
                            name: 'download', icon: '', title: '导出', caption: '导出',
                            click: function (name, opts, rowData) {
                                Opf.confirm('是否确定导出？<br><br> ', function(result){
                                    if(result){
                                        Opf.ajax({
                                            type: 'GET',
                                            url: url._('postedInfo.download', {batchNo: rowData.batchNo}),
                                            success: function(resp){
                                                if(resp.success){
                                                    Opf.download(resp.data);
                                                }
                                            }
                                        });

                                    }
                                });
                            }
                        },
                        {
                            name: 'postedTicket', icon: '', title: '审核', caption: '审核',
                            click: function (name, opts, rowData) {
                                Opf.confirm('您确定审核吗？<br><br> ', function (result) {
                                    if (result) {
                                        Opf.ajax({
                                            type: 'PUT',
                                            url: url._('postedInfo.postedTicket', {batchNo: rowData.batchNo}),
                                            success: function () {
                                                grid.trigger('reloadGrid', {current: true});
                                                Opf.Toast.success('审核成功.');
                                            },
                                            error: function(){
                                                Opf.Toast.success('审核失败.');
                                            }
                                        });
                                    }
                                });
                            }
                        }
                    ]
                },
                gid: 'posted-info-grid',
                url: url._('posted.info.list'),
                colNames: {
                    id:'',
                    batchNo:'批次号',
                    tradeAmount:'交易总金额',
                    intoPiecesRewardAmount:'进件奖励总金额',
                    profitRewardAmount:'分润奖励总金额',
                    totalRewardAmount:'奖励总金额',
                    applyOprName:'操作人',
                    applyDate:'操作时间',
                    status:'批次状态'
                },
                colModel: [
                    {name: 'id', hidden:true},
                    {name: 'batchNo'},
                    {name: 'tradeAmount', hidden:true},
                    {name: 'intoPiecesRewardAmount', hidden:true},
                    {name: 'profitRewardAmount', hidden:true},
                    {name: 'totalRewardAmount'},
                    {name: 'applyOprName'},
                    {name: 'applyDate', formatter: dateFormatter},
                    {name: 'status', formatter: function(val){ return STATUS_MAP[val] || ''; }}
                ],
                loadComplete: function () {}
            });

            me.importBtn(grid);

            return grid;
        },
        importBtn: function (grid) {
            if (!Ctx.avail('postedInfo.import')) {
                return;
            }
            var importHtml = ['<div style="border: 1px solid #ffffff;color: #ffffff;border-radius: 1px;">',
                '<div style="padding: 5px 10px 5px 10px;">',
                '<i class="icon-download-alt smaller-80"></i>&nbsp;',
                '导入数据',
                '</div>',
                '</div>'].join('');
            Opf.Grid.navButtonAdd(grid, {
                id: 'import',
                caption: importHtml,
                name: 'import',
                title: '导入数据',
                position: 'last',
                onClickButton: function () {
                    addDialog(grid);
                }
            });
            $("#importInformation").hover(function () {
                $(".icon-upload-alt").addClass("icon-upload-alt-hover");
            }, function () {
                $(".icon-upload-alt").removeClass("icon-upload-alt-hover");
            });
        }
    });


    function detailHandle(rowData){
        require(['app/oms/account/profit/postedTicket-view'], function () {
            App.trigger('posted:ticket:list', {batchNo: rowData.batchNo});
        });
    }

    function addDialog(grid) {
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
                    if (fileSelected) {
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
                    action: url._('postedInfo.file.import'),
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
                            Opf.alert({title: '提示', message: resp.msg});
                        } else {
                            $me.dialog("close");
                            grid.trigger('reloadGrid', {current: true});
                            grid[0].addJSONData(resp);
                        }

                    }
                });

                // 下载按钮
                $(this).find('.download-btn').click(function (event) {
                    Opf.download(url._('postedInfo.download.file'));
                });
            }
        });
    }

    function dateFormatter(val) {
        return val ? moment(val, 'YYYYMMDDHHmm').format('YYYY/MM/DD HH:mm') : '';
    }

    App.on('posted:info:list', function () {
        App.show(new View());
    });

    return View;
});