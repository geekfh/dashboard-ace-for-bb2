define([
    'tpl!app/oms/route/noCard/channel-attr-config/templates/table-list.tpl',
    'jquery.jqGrid'
], function(tableCtTpl) {

    var STATUS_MAP = {
        '0': '启用',
        '1': '不启用',
        '2':'当日已走满自动停用'

    },BANKMARK_MAP = {
        '1':'是银商系'
    };
    var View = Marionette.ItemView.extend({
        tabId: 'menu.nocard.channel.attr.config',
        template: tableCtTpl,
        onRender: function() {
            var me = this;

            _.defer(function () {
                me.renderGrid();
            });
        },
        // 修改通道属性配置
        onEditModel: function (id) {
            var me = this, model = new Backbone.Model(this.getDetailDataById(id));
            require(['app/oms/route/noCard/channel-attr-config/edit'], function (EditModelView) {
                var view = new EditModelView({ model: model, title: '修改通道属性配置' });

                view.on('submit:success', function () {
                    Opf.Toast.success('提交成功');
                    me.grid.trigger('reloadGrid', {current: true});
                });
            });
        },

        // 查看通道属性配置
        onViewModel: function (id) {
            var model = new Backbone.Model(this.getDetailDataById(id));
            require(['app/oms/route/noCard/channel-attr-config/detail'], function (ModelView) {
                new ModelView({ model: model, title: '查看通道属性配置' });
            });
        },
        // 新增通道属性配置
        onAddModel: function () {
            var me = this;
            require(['app/oms/route/noCard/channel-attr-config/add'], function (ModelView) {
                var view = new ModelView();
                view.on('submit:success', function (resp) {
                    Opf.Toast.success('提交成功');
                    me.grid.trigger('reloadGrid', {current: true});
                });
            });
        },
        getDetailDataById: function(id){
            var data;
            Opf.ajax({
                type:'GET',
                url:url._('route.nocard.channel.config',{'id':id}),
                async:false,
                success:function(resp){
                    data = resp;
                }
            });
            return data;
        },

        renderGrid: function() {
            var me = this;

            me.grid = App.Factory.createJqGrid({
                rsId:'nocard.channel.attr.config',
                caption: '通道属性配置',
                nav: {
                    actions:{
                        editfunc: function (id) {
                            me.onEditModel(id);
                        },
                        addfunc: function () {
                            me.onAddModel();
                        },
                        viewfunc: function (id) {
                            me.onViewModel(id);
                        },
                        search: false

                    }
                },
                actionsCol:{
                    del:false,
                    width:100,
                    extraButtons: [
                        {
                            name: 'changestate', icon: 'icon-opf-state-change', title: '状态变更',
                            click: function (name, options, rowData) {
                                showChangeStateDialog(me,rowData);
                            }
                        }
                    ]
                },
                gid: 'nocard-channel-attr-config-grid',
                url: url._('route.nocard.channel.config'),

                colNames: {
                    id: '序列号',
                    channelName: '通道名称',
                    channelCnName: '通道中文名称',
                    channelSettleAttr: '通道清算属性',
                    status: '状态',
                    bankMark:'是否银商系标记',
                    remark: '备注'

                },

                colModel: [
                    {name: 'id'},
                    {name: 'channelName'},
                    {name: 'channelCnName'},
                    {name: 'channelSettleAttr', formatter:channelSettleAttrFormatter},
                    {name: 'status', formatter: statusFormatter},
                    {name: 'bankMark',formatter:bankMarkFormatter},
                    {name: 'remark'}

                ],
                filters: [{
                    caption: '条件过滤',
                    canClearSearch: true,
                    canSearchAll: true,
                    components: [
                        {label: '通道名称', name: 'channelName', options: {sopt:['eq']}},
                        {label: '状态', name: 'status', type: 'select',
                            options: {sopt: ['eq'], value: STATUS_MAP}
                        }
                    ],
                    searchBtn: {text: '搜索'}
                }],
                loadComplete: function() {}
            });

        }

    });

    function bankMarkFormatter(val){
        return BANKMARK_MAP[val] ? BANKMARK_MAP[val] : '不是银商系';
    }
    function statusFormatter (val) {
        if (val == 2) {
            return '<span style="color: red;">' + STATUS_MAP[val] + '</span>';
        }

        return STATUS_MAP[val] || '';
    }
    function channelSettleAttrFormatter(val){
        return val == '1' ? '一清通道' : '二清通道';
    }

    function timeFormatter (val) {
        var value = val || '';
        return value.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1-$2-$3 $4:$5:$6');
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
                            url: url._('route.nocard.channel.config.upd.status', {id: rowData.id}),
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

    App.on('route:nocard:channelConfig:list', function () {
        App.show(new View());
    });

    return View;

});
