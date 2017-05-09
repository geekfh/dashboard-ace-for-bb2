define([
    'App',
    'app/oms/report/bank-bundle/bank-bundle-view'
    ], function(App, ExportView) {


    var Controller = {

        listExportStat: function() {

            console.log('>>>export-controller listexportStat');

            this.exportView = new ExportView();
            App.show(this.exportView);

        } 

    };

    App.on('export:stat:list', function() {
        Controller.listExportStat();
    });


    return Controller;
});