define([
    'tpl!app/oms/route/oneSettle/route-mcht/templates/table-list.tpl',
    'assets/scripts/fwk/component/common-select-areano',
    'jquery.jqGrid'
], function(tableCtTpl, AreaNoView) {

    var STATUS_MAP = {
        '0': '启用',
        '1': '不启用',
        '2': '当日已走满'
    };


    var SELECT_TYPE ={
        SEL_ALL: 'selectall',
        SEL_INIT: 'init'

    };

    var _STAT_MAP = {
        "maxTotalAmtSum":"单日总限额",
        "dayTxnAmtSum":"当天交易总量"
    };

    // 是否直联
    var IS_DIRECT_MCHT = {
        "1": "是",
        "0": "否"
    };

    var MCC_GROUP_MAP = {};

    var View = Marionette.ItemView.extend({
        tabId: 'menu.route.mcht',
        template: tableCtTpl,
        initialize: function () {
            this.unSelectedIds = [];
            this.selectType = SELECT_TYPE.SEL_INIT;
        },
        onRender: function() {
            var me = this;

            $.ajax({
                type: 'GET',
                url: url._('options.mccGroup'),
                success: function (resp) {
                    MCC_GROUP_MAP = {};
                    _.each(resp, function (groupData) {
                        MCC_GROUP_MAP[groupData.value] = groupData.name;
                    }); 
                },
                complete: function () {
                    ajaxChannelName(function (data) {
                        me.channelNameValues = data;
                        me.renderGrid();
                    });
                }

            });


        },

        onEditModel: function (obj) {
            var me = this, model = new Backbone.Model(obj);
            require(['app/oms/route/oneSettle/mcht-channel/edit-mcht-channel-model-view'], function (EditModelView) {
                var view = new EditModelView({ model: model, title: '修改商户模型' });

                view.on('submit:success', function () {
                    Opf.Toast.success('提交成功');
                    me.grid.trigger('reloadGrid', {current: true});
                });
            });
        },

        // 查看通道模型模型
        onViewModel: function (obj) {
            var model = new Backbone.Model(obj);
            require(['app/oms/route/oneSettle/mcht-channel/mcht-channel-detail'], function (ModelView) {
                new ModelView({ model: model, title: '查看商户模型' });
            });
        },

        onAddModel: function () {
            var me = this;
            require(['app/oms/route/oneSettle/mcht-channel/add-mcht-channel-model-view'], function (ModelView) {
                var view = new ModelView();
                view.on('submit:success', function (resp) {
                    Opf.Toast.success('提交成功');
                    me.grid.trigger('reloadGrid', {current: true});
                });
            });
        },

        getRowDataIds: function () {
            return _.pluck($(this.grid).jqGrid('getRowData'), 'id');
        },

        getSelectedIds: function () {
            var me = this;
            var rowIds = me.getRowDataIds();

            return _.filter(rowIds, function (id) {
                return _.weekContains(Opf.Grid.getSelRowIds(me.grid), id);
            });

        },

        getUnSelectedIds: function () {
            var me = this;
            var rowIds = me.getRowDataIds();

            return _.filter(rowIds, function (id) {
                return !_.weekContains(Opf.Grid.getSelRowIds(me.grid), id);
            });
        },

        showSelectedRows: function () {
            var $pageInfo = $('#route-mcht-grid-pager_left').find('.ui-paging-info');
            var text = $pageInfo.text().split(',').shift();

            $pageInfo.text(text + ',选中' + this.getSelectedNum() + '条');
        },

        getSelectedNum: function () {
            if (this.selectType === SELECT_TYPE.SEL_ALL) {
                return this.totalElements - this.unSelectedIds.length;

            } else {
                return Opf.Grid.getSelRowIds(this.grid).length;

            }
        },

        // 在全选的情况下，翻页时需要自动全选，如果有忽略的选项，需要将其反选.
        refreshSelectAll: function () {
            var me = this;
            var unSelectedIds = me.unSelectedIds;

            // 如果在忽略列表中则不选中，如果不在忽略列表中则选中。
            _.each(this.getUnSelectedIds(), function (rowId) {
                if (!_.weekContains(unSelectedIds, rowId)) {
                    me.grid.setSelection(rowId);
                }
            });

            // _.each(this.getUnSelectedIds(), function (rowId) {
            //     if (_.weekContains(unSelectedIds, rowId)) {
            //         me.grid.setSelection(rowId);
            //     }
            // });
            me.showSelectedRows();
            console.log('<<<refreshSelectAll unSelectedIds', me.unSelectedIds);
        },

        // 在反选全部的情况下，翻页时需要自动反选，如果有忽略的选项，需要将其选中。
        refreshUnSelectAll: function () {
            var me = this;

            _.each(this.getSelectedIds(), function (rowId) {
                me.grid.setSelection(rowId);
            });

            console.log('<<<refreshSelectAll unSelectedIds', me.unSelectedIds);
        },

        checkedSelected: function () {
            if (this.selectType === SELECT_TYPE.SEL_ALL || Opf.Grid.getSelRowIds(this.grid).length >0 ) {
                return true;
            }

            return false;
        },

        ajaxBatchOperate: function (submitURL, submitData) {
            return Opf.ajax({
                type: 'PUT',
                url: submitURL,
                jsonData: submitData
            });

        },

        requestDefaultBatchOpenOrClose: function (options) {
            // alert('requestDefaultBatchOpenOrClose');

            var me = this, submitData = {
                operate: options.operate,
                ids: options.checked
            };

            me.ajaxBatchOperate(url._('route.open.close.default'), submitData).done(function (resp) {
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

        requestBatchOpenOrClose: function (options) {
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


        branchOpen: function () {
            var me = this;
            if (!me.checkedSelected()) {
                Opf.alert('未选中任何模型');
                return;
            }

            Opf.confirm('确认批量开启', function(result) {
                if (result) {
                    me.requestBatchOpenOrClose({
                        operate: 'open',
                        exclude: me.getUnSelectedIds(),
                        checked: me.getSelectedIds()
                    });
                }
            });
        },


        branchClose: function () {
            var me = this;
            if (!me.checkedSelected()) {
                Opf.alert('未选中任何模型');
                return;
            }

            Opf.confirm('确认批量关闭', function(result) {
                if (result) {
                    me.requestBatchOpenOrClose({
                        operate: 'close',
                        exclude: me.getUnSelectedIds(),
                        checked: me.getSelectedIds()
                    });
                }
            });
        },

        branchEdit: function () {
            var me = this;
            if (!me.checkedSelected()) {
                Opf.alert('未选中任何模型');
                return;
            }

            var amountVal = window.prompt("输入单日额度");
            if(amountVal != null) {
                this.requestBatchUpdateDayAmountLimit({
                    amountVal: amountVal,
                    exclude: me.getUnSelectedIds(),
                    checked: me.getSelectedIds()
                });
            }
        },

        branchRemarkEdit: function (){
            var me = this;
            if (!me.checkedSelected()) {
                Opf.alert('未选中任何模型');
                return;
            }

            var amountVal = window.prompt("输入备注信息");
            if(amountVal != null) {
                this.requestBatchUpdateRemark({
                    amountVal: amountVal,
                    exclude: me.getUnSelectedIds(),
                    checked: me.getSelectedIds()
                });
            }
        },

        requestBatchUpdateDayAmountLimit: function (options) {
            var me = this,
                submitData = {
                    operate: options.amountVal,
                    exclude: options.exclude
                };

            if (this.selectType === SELECT_TYPE.SEL_INIT) {
                this.requestDefaultBatchUpdateDayAmountLimit(options);
                return;
            }


            if (this.selectType === SELECT_TYPE.SEL_ALL) {
                submitData.exclude = this.unSelectedIds;
                submitData.filters = this.getFilters();

                me.ajaxBatchOperate(url._('batch.upd.maxtotalamt.filters'), submitData).done(function (resp) {
                    if (resp.success !== false) {
                        me.ajaxSuccess();
                    }
                });
            }

        },

        requestDefaultBatchUpdateDayAmountLimit: function (options) {
            var me = this, submitData = {
                operate: options.amountVal,
                ids: options.checked
            };

            me.ajaxBatchOperate(url._('route.maxtotalamt.default'), submitData).done(function (resp) {
                if (resp.success !== false) {
                    me.ajaxSuccess();
                }
            });
        },

        requestBatchUpdateRemark: function (options){
            var me = this, submitData = {
                operate: options.amountVal,
                ids: options.checked
            };

            me.ajaxBatchOperate(url._('route.remark.default'), submitData).done(function (resp) {
                if (resp.success !== false) {
                    me.ajaxSuccess();
                }
            });
        },

        ajaxSuccess: function () {
            var me = this;

            me.enterToUnSelectAll();
            Opf.Toast.success('提交成功');
            me.grid.trigger('reloadGrid', {current: true});
        },

        deleteMchtData: function (rowData) {
            var me = this;

            $.ajax({
                type: 'DELETE',
                url: url._('route.filters.mcht', {id: rowData.id}),
                complete: function () {
                    me.grid.trigger('reloadGrid', {current: true});
                }
            });
        },

        renderGrid: function() {
            var me = this;

            me.grid = App.Factory.createJqGrid({
                rsId:'route.mcht.grid',
                caption: '商户详情',
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
                        {name: 'del', caption:'',  title:'注销该商户', icon: 'icon-off red', click: function(btn, obj, model) {
                            Opf.confirm('确定注销该商户？', function (result) {
                                if(result){
                                    me.deleteMchtData(model);
                                    // console.log('该商户已经注销!!');
                                }
                            });
                        }}
                    ],
                    canButtonRender: function (name, opts, rowData) {
                        // if (name === 'del' && rowData.status != 0) {
                        //     return false;
                        // }
                    }
                },
                altRows: true,
                multiselect: true,
                multiboxonly: false,
                onSelectRow: function (rowid, status, e) {
                    // 如果在全选的状态下，
                    if (me.selectType === SELECT_TYPE.SEL_ALL) {
                        // 选中的时候需要在反选列表中清除。
                        if (status) {
                            _.remove(me.unSelectedIds, rowid);
                        } else {// 反选的时候需要添加到反选列表中，
                            me.unSelectedIds.push(rowid);
                        }
                    }

                    me.showSelectedRows();
                    console.log('<<<onSelectRow unSelectedIds', me.unSelectedIds);
                },
                onSelectAll: function (rowidArr, isSelectedAll) {
                    if (me.selectType === SELECT_TYPE.SEL_ALL) {
                        // 选中的时候需要在反选列表中清除。
                        if (isSelectedAll) {
                            me.unSelectedIds = _.difference(me.unSelectedIds, rowidArr);

                        } else {// 反选的时候需要添加到反选列表中，
                            me.unSelectedIds = _.union(me.unSelectedIds, rowidArr);

                        }
                    }

                    me.showSelectedRows();
                    console.log('<<<onSelectRow unSelectedIds', me.unSelectedIds);
                },
                filters: [{
                    caption: '条件过滤',
                    canClearSearch: true,
                    canSearchAll: true,
                    components: [
                        {label: '商户名称', name: 'mchtName'},
                        {label: '所属通道', name: 'channelName', type: 'select',
                            options:{sopt: ['lk'],value: me.channelNameValues}
                        },{label: '地区', name: 'regionCode',
                            options:{
                                sopt: ['lk'],
                                dataInit: function (elem) {
                                    var $el = $(elem);
                                    var areaNoView = new AreaNoView({
                                        appendTo: $el.closest('.filter-form-group')
                                    });

                                    areaNoView.ui.areaNo.on('change', function () {
                                        var areaNo = areaNoView.getAreaNoValue();
                                        $el.val(areaNo).trigger('change');
                                    });

                                    $el.closest('.filter-group-content').hide();
                                    $el.on('change.clearInput', function () {
                                        // 当隐藏的 input 输入框的值为空时，才去触发清空事件
                                        if($(this).val() === ''){
                                            areaNoView.clearAreaNo();
                                        }
                                    });
                                }
                            }
                        },{label: '费率', name: 'rate',
                            options: {sopt:['eq','ne', 'lt', 'gt']},
                            inputmask:{decimal: true}
                        }, {label: '封顶', name: 'maxFee',
                            options: {sopt:['eq','ne', 'lt', 'gt']},
                            inputmask:{decimal: true}
                        }, {label: '备注', name: 'remark'
                        }, {label: '商户号', name: 'mchtNo'
                        }, {label: '状态', name: 'status', type: 'select',
                            options: {sopt: ['lk'], value: STATUS_MAP}
                        }, {label: '是否直联', name: 'isDirectMcht', type: 'select',
                            options:{value: IS_DIRECT_MCHT}
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
                gid: 'route-mcht-grid',
                url: url._('route.filters.mcht'),

                colNames: {
                    id: '',
                    mchtName: '商户名称',
                    mchtNo: '商户号',
                    status: '状态',
                    channelName: '所属通道',
                    maxTotalAmt: '单日限额',
                    dayTxnAmt: '当天交易量',
                    mccGroup: '商户类型',
                    createTime: '创建时间',
                    lastUpdTime: '最后修改时间',
                    remark: '备注信息'
                },

                colModel: [
                    {name: 'id', hidden: true},
                    {name: 'mchtName', search: true},
                    {name: 'mchtNo'},
                    {name: 'status', formatter: statusFormatter},
                    {name: 'channelName', formatter: function (val) {
                        return me.channelNameValues[val] || val || '';
                    }},
                    {name: 'maxTotalAmt'},
                    {name: 'dayTxnAmt', formatter: dayTxnAmtFormatter},
                    {name: 'mccGroup', formatter: mccGroupFormatter},
                    {name: 'createTime', formatter: timeFormatter},
                    {name: 'lastUpdTime', formatter: timeFormatter},
                    {name: 'remark'}//, formatter: remarkFormatter
                ],
                loadComplete: function(resp) {
                    me.totalElements = resp.totalElements;

                    if (me.selectType === SELECT_TYPE.SEL_ALL) {
                        me.refreshSelectAll();
                    }

                    // $('#jqgh_route-mcht-grid-table_cb').css('visibility', 'hidden');
                }
            });

            _.defer(function () {

                if (Ctx.avail('route.mcht.grid.upload')) {
                    Opf.Grid.navButtonAdd(me.grid, {
                        caption: "上传", //
                        name: "acctMmCode",
                        title:'上传',
                        //buttonicon: "icon-opf-icon-key-temp white",
                        onClickButton: function() {
                            me.enterToUploadMchts();
                        },
                        position: "last" //first
                    });
                }

                Opf.Grid.navButtonAdd(me.grid, {
                    caption: "全选", //
                    name: "acctMmCode",
                    title:'全选',
                    //buttonicon: "icon-opf-icon-key-temp white",
                    onClickButton: function() {
                        me.enterToSelectAll();
                    },
                    position: "last" //first
                });

                Opf.Grid.navButtonAdd(me.grid, {
                    caption: "反选", //
                    name: "acctMmCode",
                    title:'反选',
                    //buttonicon: "icon-opf-icon-key-temp white",
                    onClickButton: function() {
                        me.enterToUnSelectAll();
                    },
                    position: "last" //first
                });

                Opf.Grid.navButtonAdd(me.grid, {
                    caption: "批量开启", //
                    name: "acctMmCode",
                    title:'批量开启',
                    //buttonicon: "icon-opf-icon-key-temp white",
                    onClickButton: function() {
                        me.branchOpen();
                    },
                    position: "last" //first
                });

                Opf.Grid.navButtonAdd(me.grid, {
                    caption: "批量关闭", //
                    name: "acctMmCode",
                    title:'批量关闭',
                    //buttonicon: "icon-opf-icon-key-temp white",
                    onClickButton: function() {
                        me.branchClose();
                    },
                    position: "last" //first
                });

                Opf.Grid.navButtonAdd(me.grid, {
                    caption: "批量修改", //
                    name: "acctMmCode",
                    title:'批量修改',
                    //buttonicon: "icon-opf-icon-key-temp white",
                    onClickButton: function() {
                        me.branchEdit();
                    },
                    position: "last" //first
                });

                Opf.Grid.navButtonAdd(me.grid, {
                    caption: "批量修改备注",
                    name: "acctMmCode",
                    title:'批量修改备注',
                    onClickButton: function() {
                        me.branchRemarkEdit();
                    },
                    position: "last"
                });

            });

        },


        enterToUploadMchts: function () {
            var me = this;

            require(['app/oms/route/oneSettle/mcht-channel/upload-mchts'], function (UploadView) {
                var view = new UploadView();

                view.on('submit:success', function (resp) {
                    me.ajaxSuccess();
                });
            });
        },

        enterToSelectAll: function () {
            var me = this;

            me.selectType = SELECT_TYPE.SEL_ALL;
            me.unSelectedIds = [];
            me.refreshSelectAll();
        },


        enterToUnSelectAll: function () {
            var me = this;

            me.selectType = SELECT_TYPE.SEL_INIT;
            me.unSelectedIds = [];
            me.refreshUnSelectAll();

        }



    });


    function ajaxChannelName (callback) {
        Opf.ajax({
            url: url._('route.channel.name'),
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

    function mccGroupFormatter (val) {
        return MCC_GROUP_MAP[val] || '';
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

    App.on('route:mcht:list', function () {
        App.show(new View());
    });

    return View;

});
