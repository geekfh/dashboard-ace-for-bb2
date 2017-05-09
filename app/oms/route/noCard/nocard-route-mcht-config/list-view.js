define([
    'tpl!app/oms/route/noCard/nocard-route-mcht-config/templates/table-list.tpl',
    'assets/scripts/fwk/component/common-select-areano',
    'jquery.jqGrid',
    'common-ui'
], function(tableCtTpl, AreaNoView) {

    var STATUS_MAP = {
        '0': '启用',
        '1': '不启用',
        '2':'当日已走满自动停用'
    };


    var SELECT_TYPE ={
        SEL_ALL: 'selectall',
        SEL_INIT: 'init'

    };

    var _STAT_MAP = {
        "maxTotalAmtSum":"单日总限额",
        "dayTxnAmtSum":"当天交易总量"
    };


    var View = Marionette.ItemView.extend({
        tabId: 'menu.nocard.route.mcht.config',
        caption: '无卡路由商户配置',
        template: tableCtTpl,
        initialize: function () {
            this.unSelectedIds = [];
            this.selectType = SELECT_TYPE.SEL_INIT;
        },
        onRender: function() {
            var me = this;

           /* $.ajax({
                type: 'GET',
                url: url._('options.mccGroup'),
                /!*success: function (resp) {
                    MCC_GROUP_MAP = {};
                    _.each(resp, function (groupData) {
                        MCC_GROUP_MAP[groupData.value] = groupData.name;
                    });
                },*!/
                complete: function () {*/
                    ajaxChannelName(function (data) {
                        me.channelNameValues = data;
                        me.renderGrid();
                    });
              //  }

           // });


        },

        //新增
        onAddModel: function () {
            var me = this;
            require(['app/oms/route/noCard/nocard-route-mcht-config/add'], function (ModelView) {
                var view = new ModelView();
                view.on('submit:success', function (resp) {
                    Opf.Toast.success('提交成功');
                    me.grid.trigger('reloadGrid', {current: true});
                });
            });
        },

        //编辑所选记录
        onEditModel: function (obj) {
            var me = this, model = new Backbone.Model(obj);
            require(['app/oms/route/noCard/nocard-route-mcht-config/edit'], function (EditModelView) {
                var view = new EditModelView({ model: model, title: '修改无卡路由商户配置' });

                view.on('submit:success', function () {
                    Opf.Toast.success('提交成功');
                    me.grid.trigger('reloadGrid', {current: true});
                });
            });
        },

        // 查看无卡路由商户配置
        onViewModel: function (obj) {
            var model = new Backbone.Model(obj);
            require(['app/oms/route/noCard/nocard-route-mcht-config/detail'], function (ModelView) {
                new ModelView({ model: model, title: '查看无卡路由商户配置' });
            });
        },

        getRowDataIds: function () {
            return _.pluck($(this.grid).jqGrid('getRowData'), 'id');
        },

        ajaxBatchOperate: function (submitURL, submitData) {
            return Opf.ajax({
                type: 'PUT',
                url: submitURL,
                jsonData: submitData
            });

        },

        requestDefaultBatchOpenOrClose: function (options) {//商户通道号模型  批量开启、关闭无搜索条件
            // alert('requestDefaultBatchOpenOrClose');

            var me = this, submitData = {
                operate: options.operate,
                ids: options.checked
            };

            me.ajaxBatchOperate(url._('route.nocard.open.close.default'), submitData).done(function (resp) {
                if (resp.success !== false) {
                    me.ajaxSuccess();
                }
            });
        },


        getFilters: function () {
            var postData = $(this.grid).jqGrid('getGridParam', 'postData');
            if (postData.filters) {
                return $.parseJSON(postData.filters);
            }

            return '{"groupOp":"AND","rules":[]}';
        },

        requestBatchOpenOrClose: function (options) {//商户通道号模型   批量开启和关闭通道商户模型(条件过滤的时候)
            var me = this,
                submitData = {
                    operate: options.operate,
                    exclude: options.exclude
                };

            if (this.selectType === SELECT_TYPE.SEL_INIT) {
                this.requestDefaultBatchOpenOrClose(options);
                return;
            }

            if (this.selectType === SELECT_TYPE.SEL_ALL) {
                submitData.filters = this.getFilters();
                submitData.exclude = this.unSelectedIds;

                me.ajaxBatchOperate(url._('batch.open.close.filters'), submitData).done(function (resp) {
                    if (resp.success !== false) {
                        me.ajaxSuccess();
                    }
                });
            }

        },

        ajaxSuccess: function () {
            var me = this;

            me.enterToUnSelectAll();
            Opf.Toast.success('提交成功');
            me.grid.trigger('reloadGrid', {current: true});
        },
        //无卡路由商户状态变更
        renderGrid: function() {
            var me = this;

            var grid = me.grid = App.Factory.createJqGrid({
                rsId:'nocard.route.mcht.config',
                caption: '无卡路由商户配置',
                stats:{
                    labelConfig:_STAT_MAP,
                    items:[
                        {name: 'maxTotalAmtSum', type:'currency'},
                        {name: 'dayTxnAmtSum', type:'onlyNum'}
                    ]
                },
                actionsCol: {
                    del: false,
                    width: 100,
                    extraButtons: [
                        {
                            name: 'changestate', icon: 'icon-opf-state-change', title: '状态变更',
                            click: function (name, options, rowData) {
                                showChangeStateDialog(me,rowData);
                            }
                        }
                    ],
                    canButtonRender: function (name, opts, rowData) {
                        // if (name === 'del' && rowData.status != 0) {
                        //     return false;
                        // }
                    }
                },
                altRows: true,
                //multiselect: true,
                multiboxonly: false,

                //表头
                filters: [{
                    caption: '条件过滤',
                    canClearSearch: true,
                    canSearchAll: true,
                    components: [
                        {label: '商户名称', name: 'mchtName'},
                        {label: '所属通道', name: 'oneSettleChannel', type: 'select',
                            options:{sopt: ['lk'],value: me.channelNameValues}
                        },
                        {label: '通道商户号', name: 'channelMchtNo', options: {sopt: ['eq']}},
                        {label: '状态', name: 'status', type: 'select',
                            options: {sopt: ['lk'], value: STATUS_MAP}
                        },
                        {label: '备注', name: 'remark'
                        },
                        {label: '商户编号', name: 'mchtNo',options: {sopt: ['eq']}
                        }
                    ],
                    searchBtn: {text: '搜索'}
                }],
                nav: {
                    actions:{
                        editfunc: function (id) {
                            me.onEditModel(me.grid._getRecordByRowId(id));
                        },
                        addfunc: function () {
                            me.onAddModel();
                        },
                        viewfunc: function (id) {
                            me.onViewModel(me.grid._getRecordByRowId(id));
                        },
                        search: false
                    }
                },
                gid: 'nocard-route-mcht-config-grid',
                url: url._('route.nocard.route.mcht.config'),//问题
                multiselect: true,
                colNames: {
                    id: '',
                    mchtNo: '商户编号',
                    mchtName: '商户名称',
                    status: '状态',
                    oneSettleChannel: '通道名称',
                    channelMchtNo:     '通道商户号',
                    dayMaxAmt:         '单日最大金额',
                    remark: '备注信息',
                    createTime: '创建时间',
                    lastUpdTime: '最后修改时间'
                },

                colModel: [
                    {name: 'id', hidden: true},
                    {name: 'mchtNo'},
                    {name: 'mchtName', search: true},
                    {name: 'status', formatter: statusFormatter},
                    {name: 'oneSettleChannel', formatter: function (val) {
                        return me.channelNameValues[val] || val || '';
                    }},
                    {name: 'channelMchtNo'},
                    {name: 'dayMaxAmt', formatter: dayTxnAmtFormatter},
                    {name: 'remark'},
                    {name: 'createTime', formatter: timeFormatter},
                    {name: 'lastUpdTime', formatter: timeFormatter}
                ]

            });

            //批量修改状态
            _.defer(function () {
                if (Ctx.avail('nocard.route.mcht.config.editStatus')) {
                    Opf.Grid.navButtonAdd(me.grid, {
                        caption: '',
                        name: 'editStatus',
                        title:'修改状态',
                        position: 'last',
                        buttonicon: 'ui-icon icon-unlink white',
                        onClickButton: function() {
                            var ids = Opf.Grid.getSelRowIds(grid);

                            if(ids.length == 0){
                                Opf.alert({title: "警告", message: "请至少选中一条记录!"});
                            }
                            else{
                                var flag = true;
                                var ids_status = grid.getRowData(ids[0]);
                                //判断状态是否一致
                                $.each(ids, function (i, v){
                                    if(grid.getRowData(ids[0]).status != grid.getRowData(ids[i]).status){
                                        flag = false;
                                    }
                                    return flag;
                                });
                                //一致然后发送到后台
                                if(flag){
                                    var STATUS_MAP = {
                                        '0': '启用',
                                        '1': '不启用'
                                    };
                                    var callBack = CommonUI.showStatusDialog(ids_status.status, STATUS_MAP);
                                    callBack.parent().find('[type="submit"]').on('click', function (){
                                        var status = callBack.find('[name="status"]').val();
                                        Opf.ajax({
                                            type: 'PUT',
                                            url: 'api/mcht/online/router/bat-update-sta',
                                            jsonData: {
                                                ids: ids,
                                                status: status
                                            },
                                            success: function(resp){
                                                if(resp.success){
                                                    Opf.Toast.success('修改成功.');
                                                    me.grid.trigger('reloadGrid');
                                                }
                                            }
                                        });
                                    });
                                }
                                else{
                                    Opf.alert({title: "警告", message: "需选择状态一致"});
                                }
                            }
                        }
                    });
                }
                if (Ctx.avail('nocard.route.mcht.config.upload')) {//权限
                    Opf.Grid.navButtonAdd(me.grid, {
                        caption: '',
                        name: 'acctMmCode',
                        title:'上传',
                        buttonicon: 'ui-icon icon-upload-alt white',
                        onClickButton: function() {
                            me.enterToUploadMchts();
                        },
                        position: "last" //first
                    });
                }
            });
        },

        //批量导入Excel文件
        enterToUploadMchts: function () {
            var me = this;

            require(['app/oms/route/noCard/nocard-route-mcht-config/upload-onesettle-mcht'], function (UploadOnesettleView) {
                var view = new UploadOnesettleView();

                view.on('submit:success', function (resp) {
                    me.ajaxSuccess();
                });
            });
        }
    });

    function ajaxChannelName (callback) {
        Opf.ajax({
            url: url._('route.nocard.channel.name'),//通道接口
            type: 'GET',
            success: function (resp) {
                var result = {};

                _.each(resp, function (item) {
                    result[item.value] = item.name;
                });

                callback && callback (result);
            }
        });
    }

    function statusFormatter (val) {
        if (val == 2) {
            return '<span style="color: red;">' + STATUS_MAP[val] + '</span>';
        }


        return STATUS_MAP[val] || '';
    }

    function dayTxnAmtFormatter (val) {
        return val || 0;
    }



    function timeFormatter (val) {
        var value = val || '';
        return value.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1-$2-$3 $4:$5:$6');
    }

    function remarkFormatter (val) {
        var value = val || '' ;
        if(value.length > 11){
            value = value.substring(0, 11) + '...';
        }
        return value;
    }
    function stateFormTpl() {
        var str = [
            '<form onsubmit="return false;" >',
            '<table width="100%" cellspacing="0" cellpadding="0" border="0">',
            '<tbody>',
            '<tr class="FormData">',
            '<td class="CaptionTD" style="padding-right:10px;">状态变更:</td>',
            '<td class="DataTD">',
            '&nbsp;',
            '<select role="select" name="state" class="FormElement ui-widget-content ui-corner-all">',
            '<option value="0">启用</option>',
            '<option value="1">不启用</option>',
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
    function showChangeStateDialog(me, rowData) {
        var oldState = rowData.status;
        var $dialog = Opf.Factory.createDialog(stateFormTpl(), {
            destroyOnClose: true,
            title: '状态变更',
            autoOpen: true,
            //width: Opf.Config._('ui', 'mcht.grid.changestate.form.width'),
            //height: Opf.Config._('ui', 'mcht.grid.changestate.form.height'),
            modal: true,
            buttons: [{
                type: 'submit',
                click: function () {
                    var $state = $(this).find('[name="state"]');
                    var newState = $state.val();
                    var selSateTxt = $state.find('option:selected').text();
                    if (oldState != newState) {
                        Opf.ajax({
                            type: 'PUT',
                            jsonData: {
                                oldStatus:  oldState,
                                newStatus: newState
                            },
                            url: url._('route.nocard.route.config.upd.status', {id: rowData.id}),
                            successMsg: '更改状态成功',
                            success: function () {
                                me.grid.trigger('reloadGrid', {current: true});
                            },
                            complete: function () {
                                $dialog.dialog('close');
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
                $(this).find('[name="state"]').val(oldState);
            }
        });
    }
    App.on('route:nocardRouteMchtConfig:list', function () {
        App.show(new View());
    });

    return View;

});
