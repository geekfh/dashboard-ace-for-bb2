/**
 * 商户迁移
 */
define([
    'app/oms/operate/mdata/common/list-view',
    'app/oms/operate/mdata/common/log/list-view',
    'assets/scripts/fwk/component/uploader'
], function(MdataView, LogView, uploader) {
    var _gridOptions = MdataView.prototype.gridOptions;
    var _onRender = MdataView.prototype.onRender;

    return MdataView.extend({
        tabId: 'menu.data.move.mcht',
        gridOptions: _.extend({}, _gridOptions, {
            rsId: 'data.move.mcht',
            gid: 'data-move-mcht-grid',

            toolbar: [
                {
                    name: 'init',
                    iconCls: 'icon-file',
                    text: '初始化数据',
                    onClick: function(grid){
                        var $grid = grid;

                        uploader.doImport({
                            uploadUrl: url._('operate.data.move.mcht.dataInit'),
                            uploadTpl: url._('operate.data.move.mcht.downloadTpl'),
                            uploadResultTitle: '数据初始化结果',
                            cbSuccess: function(queueId){
                                $grid.trigger("reloadGrid", {current:true});
                            }
                        });
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
                            url: url._('operate.data.move.mcht.dataClean'),
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
                            url: url._('operate.data.move.mcht.dataAction'),
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
                        var logView = new LogView({ prcName: 'PKG_MOVE_BRH_MCHT_OPR.P_MOVE_MCHT' }).render();

                        // 创建日志视窗
                        Opf.Factory.createDialog(logView.$el, {
                            destroyOnClose: true,
                            title: '查看商户迁移日志',
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
                    url: url._('operate.data.move.mcht.list')
                });
            });
        }
    });
});
