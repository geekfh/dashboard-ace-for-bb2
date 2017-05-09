define([
    'App',
    'app/oms/report/maintain/maintain-view'
    ], function(App, MaintainView) {


    var Controller = {

        listMaintainStat: function() {

            console.log('>>>maintain-controller listMaintainStat');

            this.maintainView = new MaintainView();
            App.show(this.maintainView);

        } 

    };

    App.on('maintain:stat:list', function() {
        Controller.listMaintainStat();
    });


    return Controller;
});