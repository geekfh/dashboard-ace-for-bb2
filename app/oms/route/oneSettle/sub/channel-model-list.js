define([
    'app/oms/route/oneSettle/sub/model-list',
    'app/oms/route/oneSettle/sub/model',
    'app/oms/common/store/OpfPageableCollection'
], function(ModelListView, ModelView, OpfPageableCollection) {

    var ItemView = ModelView.extend({
        permission: {
            'edit': Ctx.avail('route.config.channel.edit'),
            'del': Ctx.avail('route.config.channel.del')
        },

        // 编辑通道模型模型
        onEditModel: function (obj) {
            var me = this;
            require(['app/oms/route/oneSettle/channel/edit-channel-model-view'], function (EditModelView) {
                var view = new EditModelView({ model: obj.model, title: '修改通道模型' });

                view.on('submit:success', function () {
                    me.trigger('edit:success');
                });
            });
        },

        // 查看通道模型模型
        onViewModel: function (obj) {
            require(['app/oms/route/oneSettle/channel/channel-view-detail'], function (ModelView) {
                new ModelView({ model: obj.model, title: '查看通道模型' });
            });
        },

        onDelModel: function (obj) {
            var me = this;

            Opf.confirm('确认删除？', function (result){

                if (!result) {
                    return;
                }

                Opf.ajax({
                    url: url._('route.channel', {id: obj.model.get('id')}),
                    type: 'DELETE',
                    success: function () {
                        Opf.Toast.success('删除成功');
                    },
                    complete: function () {
                        me.trigger('models:refresh');
                    }
                });
                
            });

        },

        modelType: 'channel'
    });

    var Collection = OpfPageableCollection.extend({
        state: {
            pageSize: 5
        },
        url: url._('route.channel')
    });

    var ListView = ModelListView.extend({
        childView: ItemView,

        initialize: function () {
            this.collection = new Collection();
            this.collection.fetch({parse: true});
            this.title = '通道模型';
            this._addCollectionListenner();

            this.permission = {
                add: Ctx.avail('route.config.channel.add')
            };
        },

        // 新增一个通道模型
        onAddModel: function () {
            var me = this;
            require(['app/oms/route/oneSettle/channel/add-channel-model-view'], function (ModelView) {
                var view = new ModelView();
                view.on('submit:success', function (resp) {
                    me.collection.add(resp, {at: 0});
                });
            });
        },

        // 通过交易模型ID来赛选通道模型
        filterByTxnId: function (txnId) {
            this.collection.queryParams['txnModelId'] = txnId;
            this.collection.getFirstPage();

        },

        // 清除赛选（交易模型ＩＤ）
        cleanFilterByTxnId: function () {
            this.collection.queryParams['txnModelId'] = void 0;
            this.collection.getFirstPage();
        },

        // 根据交易模型ID来编辑绑定关系
        setFiltersByIds: function (channelIds) {
            this.operateObj = {
                operate: 'editingRelevance',
                channelIds: channelIds
            };
            this._initEditingRelevanceOperate();
        },

        // 结束绑定关系的编辑
        clearFiltersByIds: function () {
            this.operateObj = null;
            this.uncheckedChildrenView();
        },

        // selectChildViewWhenEdit: function (view) {
        //     if (this.operateObj && this.operateObj.operate === 'editingRelevance') {
        //         view.updateRelevance();
        //         return 'edit.bind';
        //     } else {
        //         return this.selectChildView(view);
        //     }
        // },

        _addCollectionListenner: function () {
            var me = this;
            me.listenTo(this.collection, 'sync', function (collection) {
                if (me.operateObj && (me.operateObj.operate === 'editingRelevance')) {
                    me._initEditingRelevanceOperate();
                }
            });
        },

        _initEditingRelevanceOperate: function () {
            var me = this;
            this.children.each(function (childView) {
                _.contains(me.operateObj.channelIds, childView.model.get('id') + '') ? childView.checkedView() : childView.uncheckedView();
            });
        }

    });

    
    return ListView;
    
});