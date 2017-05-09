//此Controller对应于参数设置菜单下的基本参数表
define(['app/oms/common/store/SenFiledsStore',
    'app/oms/param/sen/list/SenFieldsPanel',
     'app/oms/param/sen/list/ConfirmView'
], function(SenFiledsStore, SenFieldsPanel, ConfirmView) {

   

    var Controller = Marionette.Controller.extend({

        showConfirmView: function (modelArr, yes, no) {
            new ConfirmView({
                models: modelArr,
                yes: yes,
                no: no
            });
        },

        _listSenFields: function (StoreClazz, SenPanelClazz) {
            var me = this;

             //这个collection是真的用来跟后台交互的
            var store = new StoreClazz();
            store.fetch({reset: true});

            var view = new SenPanelClazz({
                rawCollection: store
            });

            view.on('save', function () {

                // me.showConfirmView(store.getChangedModels(), function () {

                    store.sync('update').done(function () {

                        Opf.Toast.success('保存成功');

                        view.triggerMethod('save:success');

                        store.fetch({reset: true});
                    });
                    
                //     console.log('我保存');
                // }, function () {
                //     console.log('我不保存');
                // });
            });

            view.on('cancel:edit', function  () {
                store.restoreToLastFetch();
            });


            App.show(view);
    
            Opf.UI.ajaxLoading(view.$el);
        },

        listSenFields: function(data) {
            var StoreClazz = SenFiledsStore.extend({
                url: url._('sen.fields', {which: data.type}),
                getUpdateUrl: function () {
                    return url._('sen.fields.updatebatch', {which: data.type});
                }
            });

            var PanelView = SenFieldsPanel.extend({
                tabId: data.tabid
            });
            this._listSenFields(StoreClazz, PanelView);
        }

    });

    var ctrl = new Controller();

    App.on('sen:fields:list', function(data) {
        ctrl.listSenFields(data);
    });

    return ctrl;


});