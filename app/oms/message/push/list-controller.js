define([
    'App',
    'app/oms/message/push/list-view'
    ], function(App, PushListView) {

    var Controller = {
        listPushList: function() {
            console.log('>>>pushList-controller listPushList');

            this.pushListView = new PushListView();
            App.show(this.pushListView);
        }
    };

    App.on('msg:push:list', function() {
        Controller.listPushList();
    });

    return Controller;
});