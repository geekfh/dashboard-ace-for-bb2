define([
    'App',
    'app/oms/message/msg-center/list-view'
    ], function(App, PushListView) {

    var Controller = {
        listPushList: function() {
            console.log('>>>pushList-controller listPushList');

            this.pushListView = new PushListView();
            App.show(this.pushListView);
        }
    };

    App.on('msg:center:list', function() {
        Controller.listPushList();
    });

    return Controller;
});