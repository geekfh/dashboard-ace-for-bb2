/**
 * 拓展员迁移
 */
define([
    'app/oms/operate/mdata/common/list-view',
    'app/oms/operate/mdata/common/log/list-view'
], function(MdataView, LogView) {
    var _gridOptions = MdataView.prototype.gridOptions;
    var _onRender = MdataView.prototype.onRender;

    //数据转换
    var convertData = function(data){
        var obj = {}; data=data||{};
        if(_.isString(data)){
            data = JSON.parse(data);
        }
        _.each(data.rules, function(item){
            obj[item.field] = item.data||"";
        });

        return obj;
    };

    return MdataView.extend({
        tabId: 'menu.data.move.user',
        gridOptions: _.extend({}, _gridOptions, {
            rsId: 'data.move.user',
            gid: 'data-move-user-grid',

            toolbar: [
                {
                    name: 'init',
                    iconCls: 'icon-file',
                    text: '初始化数据',
                    onClick: function(grid){
                        var $grid = grid, $button = $(this),
                            loadingEl = $('<span>...</span>');
                        var filterViews = $grid.jqGrid('getGridParam', 'filterViews');
                        var filterView = filterViews[0];
                        var filterData = filterView.getFilterValue();
                        var postData = convertData(filterData);
                        Opf.ajax({
                            type: 'POST',
                            url: url._('operate.data.move.user.dataInit'),
                            jsonData: postData,
                            successMsg: '数据初始化成功',
                            beforeSend: function() {
                                $button.append(loadingEl).prop('disabled', true);
                            },
                            complete: function() {
                                loadingEl.remove();
                                $button.prop('disabled', false);
                            },
                            success: function(){
                                $grid.trigger('reloadGrid', {current: true});
                            }
                        })
                    }
                },{
                    name: 'clean',
                    iconCls: 'icon-eraser',
                    text: '擦除数据',
                    onClick: function(grid){
                        var $grid = grid, $button = $(this),
                            loadingEl = $('<span>...</span>');
                        Opf.ajax({
                            type: 'DELETE',
                            url: url._('operate.data.move.user.dataClean'),
                            successMsg: '数据擦除成功',
                            beforeSend: function() {
                                $button.append(loadingEl).prop('disabled', true);
                            },
                            complete: function() {
                                loadingEl.remove();
                                $button.prop('disabled', false);
                            },
                            success: function(){
                                $grid.trigger('reloadGrid', {current: true});
                            }
                        })
                    }
                },{
                    name: 'moveTo',
                    iconCls: 'icon-building',
                    text: '开始迁移',
                    onClick: function(grid){
                        var $grid = grid, $button = $(this),
                            loadingEl = $('<span>...</span>');
                        Opf.ajax({
                            type: 'GET',
                            url: url._('operate.data.move.user.dataAction'),
                            successMsg: '数据迁移成功',
                            beforeSend: function() {
                                $button.append(loadingEl).prop('disabled', true);
                            },
                            complete: function() {
                                loadingEl.remove();
                                $button.prop('disabled', false);
                            },
                            success: function(){
                                $grid.trigger('reloadGrid', {current: true});
                            }
                        })
                    }
                },{
                    name: 'log',
                    iconCls: 'icon-book',
                    text: '查看日志',
                    onClick: function(){
                        // 初始化日志视图
                        var logView = new LogView({ prcName: 'PKG_MOVE_BRH_MCHT_OPR.P_MOVE_OPR' }).render();

                        // 创建日志视窗
                        Opf.Factory.createDialog(logView.$el, {
                            destroyOnClose: true,
                            title: '查看拓展员迁移日志',
                            autoOpen: true,
                            width: 800,
                            height: 600,
                            modal: true,
                            buttons: [{
                                type: 'cancel'
                            }]
                        });
                    }
                }
            ],

            filters: [
                {
                    defaultRenderGrid: false,
                    components: [
                        {
                            label: '操作员ID',
                            name: 'oprCode',
                            options: {
                                sopt: ['eq']
                            }
                        },{
                            label: '迁移后所属机构',
                            name: 'brhCodeNew',
                            options: {
                                sopt: ['eq']
                            }
                        }
                    ]
                }
            ],

            colNames: {
                id: 'ID',
                oprId: '操作员ID',
                brhCodeOld: '旧机构号',
                brhCodeNew: '新机构号',
                mchtSelltBrh: '清算机构号'
            },

            colModel: [
                {name: 'id', hidden: true},
                {name: 'oprId'},
                {name: 'brhCodeOld'},
                {name: 'brhCodeNew'},
                {name: 'mchtSelltBrh'}
            ]
        }),

        onRender: function(){
            _onRender.apply(this, arguments);

            var me = this;
            _.defer(function(){
                me.grid.jqGrid('setGridParam', {
                    datatype: 'json',
                    url: url._('operate.data.move.user.list')
                });
            });
        }
    });
});
