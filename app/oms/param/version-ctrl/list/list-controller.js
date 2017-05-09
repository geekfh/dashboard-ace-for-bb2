


//此Controller对应于参数设置菜单下的版本控制表
define(['App'], function(App) {


    var Controller = Marionette.Controller.extend({

        listView: function(kw) {

            require(['app/oms/param/version-ctrl/list/list-view'], function(View) {

                    var view =  new View({}); 
                    App.show(view);

            });


        }//@listMccs

    });

    var ctrl = new Controller();

    App.on('version-ctrl:list', function() {
        ctrl.listView();
    });

    return ctrl;

});