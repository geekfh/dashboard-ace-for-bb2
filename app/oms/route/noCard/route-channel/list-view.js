define([
    'tpl!app/oms/route/noCard/route-channel/templates/table-list.tpl',
    'jquery.jqGrid',
    'common-ui'
], function(tableCtTpl) {

    var STATUS_MAP = {
        '0': '启用',
        '1': '不启用',
        '2': '当日已走满'
    };

    var View = Marionette.ItemView.extend({
        tabId: 'menu.nocard.route.channel',
        template: tableCtTpl,
        onRender: function() {
            var me = this;

            _.defer(function () {
                me.renderGrid();
            });
        },

        onEditModel: function (obj) {
            var me = this, model = new Backbone.Model(obj);
            require(['app/oms/route/noCard/channel/edit-channel-model-view'], function (EditModelView) {
                var view = new EditModelView({ model: model, title: '修改通道模型' });

                view.on('submit:success', function () {
                    Opf.Toast.success('提交成功');
                    me.grid.trigger('reloadGrid', {current: true});
                });
            });
        },

        // 查看通道模型模型
        onViewModel: function (obj) {
            var model = new Backbone.Model(obj);
            require(['app/oms/route/noCard/channel/channel-view-detail'], function (ModelView) {
                new ModelView({ model: model, title: '查看通道模型' });
            });
        },

        onAddModel: function () {
            var me = this;
            require(['app/oms/route/noCard/channel/add-channel-model-view'], function (ModelView) {
                var view = new ModelView();
                view.on('submit:success', function (resp) {
                    Opf.Toast.success('提交成功');
                    me.grid.trigger('reloadGrid', {current: true});
                });
            });
        },

        renderGrid: function() {
            var me = this;
            var grid = me.grid = App.Factory.createJqGrid({
                rsId:'nocard.route.channel.grid',
                caption: '通道详情',
                actionsCol: {
                },
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
                        }
                    }
                },
                gid: 'nocard-route-channel-grid',
                url: url._('nocard.route.channel'),
                multiselect: true,
                colNames: {
                    id: '序列号',
                    name: '模型名称',
                    channelCnName: '通道中文名称',
                    priority: '优先级',
                    status: '状态',
                    remark: '备注',
                    createTime: '创建时间',
                    lastUpdTime: '最后修改时间'

                },
                colModel: [
                    {name: 'id'},
                    {name: 'name', search: true, _searchType:'string', searchoptions: { sopt: ['lk'] }},
                    {name: 'channelCnName'},
                    {name: 'priority'},
                    {name: 'status', formatter: statusFormatter},
                    {name: 'remark'},
                    {name: 'createTime', formatter: timeFormatter},
                    {name: 'lastUpdTime', formatter: timeFormatter}
                ],
                loadComplete: function() {}
            });
            _.defer(function () {
                if(!Ctx.avail('nocard.route.channel.grid.editStatus')) {
                    return;
                }
                Opf.Grid.availNavButtonAdd(me.grid, {
                    caption: '',
                    name: 'editStatus',
                    title: '修改状态',
                    buttonicon: 'ui-icon icon-unlink white',
                    position: 'last',
                    onClickButton: function  () {
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
                                        url: 'api/mcht/route/online/channel-models/bat-update-stat',
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
            });
        }
    });


    function statusFormatter (val) {
        if (val == 2) {
            return '<span style="color: red;">' + STATUS_MAP[val] + '</span>';
        }
        return STATUS_MAP[val] || '';
    }

    function timeFormatter (val) {
        var value = val || '';
        return value.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1-$2-$3 $4:$5:$6');
    }

    App.on('nocard:route:channel:list', function () {
        App.show(new View());
    });

    return View;

});
