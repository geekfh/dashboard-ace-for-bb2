define([
    'app/oms/service/list/listView'
],function(ListView){

    var EVENTS_MAP = {
        'add:service':   'showAddView',
        'edit:task':     'showEditTaskView',
        'edit:Activate': 'showEditActivateView',
        'view:task':     'showViewTask',
        'view:activate': 'showViewActivate',
        'view:mchts':    'showMchts'
    };

    var Controller = Marionette.Controller.extend({
        
        showAddView: function (page) {

            require(['app/oms/service/add/CreateServerView'], function (CreateServerView) {
                var view = new CreateServerView({
                    page: page,
                    canAddFee: true,
                    canAddFees: true
                });
                App.show(view);
            });

        },

        showListView: function (page) {
            var view = this.listView = new ListView({defaultOpenPage: page});
            App.show(view);
            this._attachViewEvent();
        },

        showEditTaskView: function (id, page) {

            require(['app/oms/service/edit/task/editTaskView'], function (EditTaskView) {
                Opf.ajax({
                    url: url._('service.get', {id: id}),
                    type: 'GET',
                    success: function (resp) {
                        var view = new EditTaskView({
                            data: resp, id: id,
                            page: page,
                            canAddFee: true,
                            canAddFees: true
                        });
                        App.show(view);

                    },
                    complete: function () {

                    }
                });
            });

        },

        showEditActivateView: function (id, page) {

            require(['app/oms/service/edit/activate/editActivateView'], function (EditAvtivateView) {
                Opf.ajax({
                    url: url._('service.register', {id: id}),
                    type: 'GET',
                    success: function (resp) {
                        var view = new EditAvtivateView({ data: resp, id: id, page: page });
                        App.show(view);

                    },
                    complete: function () {

                    }
                });
            });

        },

        showViewTask: function (id, page) {

            require(['app/oms/service/view/task/viewTask'], function (ViewTask) {
                Opf.ajax({
                    url: url._('service.get', {id: id}),
                    type: 'GET',
                    success: function (resp) {
                        var view = new ViewTask({ data: resp, id: id, page: page });
                        App.show(view);

                    },
                    complete: function () {

                    }
                });
            });

        },

        showViewActivate: function (id, page) {

            require(['app/oms/service/view/activate/viewActivate'], function (ViewActivate) {
                Opf.ajax({
                    url: url._('service.register', {id: id}),
                    type: 'GET',
                    success: function (resp) {
                        var view = new ViewActivate({ data: resp, id: id, page: page });
                        App.show(view);

                    },
                    complete: function () {

                    }
                });
                
            });
        },

        showMchts: function (id) {

            require(['app/oms/service/view/mchts/viewMchts'], function (ViewMchts) {
                var view = new ViewMchts({id: id});
                
                var $dialog = Opf.Factory.createDialog(view.render().$el, {
                    destroyOnClose: true,
                    title: '已开通服务的商户',
                    autoOpen: true,
                    width: 900,
                    height: 600,
                    modal: true
                });
            });

        },


        _attachViewEvent: function () {
            var me = this;

            _.each(EVENTS_MAP, function (func, trigger) {
                me.listView.on(trigger, function () {
                    me[func].apply(me, arguments);
                });
            });

        }

    });

    var ctrl = new Controller();

    App.on('service:list', function () {
        ctrl.showListView();
    });

    App.on('service:list:page', function (page) {
        ctrl.showListView(page);
    });

    return ctrl;
});