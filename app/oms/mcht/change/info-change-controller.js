define([
    'App',
    'app/oms/mcht/change/info-change-view'
    ], function(App, MchtInfoChangeView) {


    var Controller = {

        listMchtInfoChange: function() {

            console.log('>>>maintain-controller listMchtInfoChange');

            this.mchtInfoChangeView = new MchtInfoChangeView();
            App.show(this.mchtInfoChangeView);

        } 

    };


    return Controller;
});