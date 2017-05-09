define([
    'tpl!app/oms/notice-mgr/templates/notice-mgr.tpl',
    'app/oms/notice-mgr/notice-mgr-list-view'
], function(tpl, NoticeListView) {

    var STATUS = {
        UNREAD: 2
    };

    var View = Marionette.CompositeView.extend({
        tabId: 'menu.notice.mgr',

        featureAvailConfig: {
            newNotice: true,
            noticeItemCheckable: true,
            deleteNotice: true,
            editNotice: true
        },

        className: 'notice-mgr-panel',

        template: tpl,

        ui: {
            'container': '.notice-container'
        },

        events: {
            
        },

        initialize: function () {
            var me = this;
            /*a=*/
            this.layersMgr = new Opf.LayersMgr();

            this.layersMgr.on('bring:to:front', function (view) {
                if(me.detailView && view === me.detailView) {
                    me.detailView.refrehFromServer();
                }
            });
            this.layersMgr.on('bring:to:front', function (view) {
                if(me.noticeListView && view === me.noticeListView) {
                    me.noticeListView.refresh();
                }
            });
        },

        onRender: function () {
            var me = this;

            this.noticeListView = new NoticeListView({
                noticesUrl: this.getOption('noticesUrl'),
                featureAvailConfig: me.featureAvailConfig,
                renderTo: this.ui.container
            });

            this.noticeListView.on({
                // 'delete:detail': function (model) { me.deleteNotice(model); },
                'view:detail': function (model) { me.showDetail(model); },
                'edit:notice': function (model) { me.showEditFormView(model); },
                'add:notice': function () { me.showAddFormView(); }
            });

            this.layersMgr.bringToFront(this.noticeListView);
        },

        showAddFormView: function (cb) {
            var me = this;
            var ui = me.ui;

            Opf.UI.setLoading(me.$el);

            require(['app/oms/notice-mgr/new-notice-view'], function (PostNoticeView) {

                if(!me.noticeAddView) {
                    me.noticeAddView = new PostNoticeView({
                        renderTo: ui.container
                    });
                }

                me.layersMgr.bringToFront(me.noticeAddView);

                Opf.UI.setLoading(me.$el, false);
            });
        },

        showEditFormView: function (model, cb) {
            var me = this;
            var ui = me.ui;

            Opf.UI.setLoading(me.$el);

            require(['app/oms/notice-mgr/edit-notice-view'], function (EditNoticeView) {

                if(!me.editNoticeForm || me.editNoticeForm.isDestroyed) {

                    me.editNoticeForm = new EditNoticeView({
                        renderTo: ui.container
                    });
                }

                me.editNoticeForm.updateModel(model);
                me.layersMgr.bringToFront(me.editNoticeForm);

                Opf.UI.setLoading(me.$el, false);
            });
        },

        showDetail: function (model) {
            //用上requireLoader 两个异步完成后 。。。
            var me = this;
            model.fetch({
                success: function (model) {
                    me.renderDetailView(model);
                }
            });
        },

        renderDetailView: function (model) {
            var me = this;
            
            Opf.UI.setLoading(me.$el);

            require(['app/oms/notice-mgr/notice-detail-view'], function (DetailView) {
                //detailView 返回会销毁
                me.detailView = new DetailView({
                    featureAvailConfig: me.featureAvailConfig,
                    model: model,
                    renderTo: me.ui.container
                });


                me.layersMgr.bringToFront(me.detailView, false);


                me.detailView.on('edit:notice', function(model) {
                    me.showEditFormView(model);
                });

                me.detailView.on('delete', function () {
                    me.noticeListView.refresh();
                });
                
                Opf.UI.setLoading(me.$el, false);

                if(model.get('status') === STATUS.UNREAD) {
                    App.trigger('view:unreaded:notice', model);
                    console.log('<<< view an unread notice');
                }

            });

            
                
        }
        
    });

    App.on('notice:mgr:list', function () {
        App.show(new View());
    });
    
    return View;
});