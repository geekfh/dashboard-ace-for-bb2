define([
    'app/oms/route/oneSettle/sub/model-list',
    'app/oms/route/oneSettle/sub/model',
    'app/oms/common/store/OpfPageableCollection'
], function(ModelListView, ModelView, OpfPageableCollection) {

    var Collection = OpfPageableCollection.extend({
        state: {
            pageSize: 5
        },
        url: url._('route.txn')
    });

    var ItemView = ModelView.extend({
        // 编辑交易模型
        onEditModel: function (obj) {
            var me = this;
            require(['app/oms/route/oneSettle/txn/edit-txn-model-view'], function (EditModelView) {
                var view = new EditModelView({ model: obj.model, title: '修改交易模型' });

                view.on('submit:success', function () {
                    me.trigger('edit:success');
                });
            });
        },

        permission: {
            'edit': Ctx.avail('route.config.trade.edit'),
            'del': Ctx.avail('route.config.trade.del')
        },

        // 查看交易模型
        onViewModel: function (obj) {
            require(['app/oms/route/oneSettle/txn/txn-view-detail'], function (ModelView) {
                new ModelView({ model: obj.model, title: '查看交易模型' });
            });
        },

        onDelModel: function (obj) {
            var me = this;

            Opf.confirm('确认删除？', function (result){
                if (!result) {
                    return;
                }
                
                Opf.ajax({
                    url: url._('route.txn', {id: obj.model.get('id')}),
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

        modelType: 'txn'

    });

    var ListView = ModelListView.extend({
        childView: ItemView,

        initialize: function () {
            this.collection = new Collection();
            this.collection.fetch({parse: true});
            this.title = '交易模型';

            this.permission = {
                add: Ctx.avail('route.config.trade.add')
            };
        },

        // 新增交易模型
        onAddModel: function () {
            var me = this;

            require(['app/oms/route/oneSettle/txn/add-txn-model-view'], function (ModelView) {
                var view = new ModelView();

                view.on('submit:success', function (resp) {
                    me.collection.add(resp, {at: 0});
                });
            });
        }/*,

        selectChildViewWhenEdit: function (view) {
            return this.selectChildView(view);
        }*/

    });

    
    return ListView;
    
});