/**
 * 数据迁移ctrl
 */
define(function(){
    var Ctrl = Marionette.Controller.extend({
        org: function(){
            require(['app/oms/operate/mdata/org/list-view'], function(View){
                var orgView = new View;
                App.show(orgView);
            })
        },

        mcht: function(){
            require(['app/oms/operate/mdata/mcht/list-view'], function(View){
                var mchtView = new View;
                App.show(mchtView);
            })
        },

        user: function(){
            require(['app/oms/operate/mdata/user/list-view'], function(View){
                var userView = new View;
                App.show(userView);
            })
        }
    });

    var ctrl = new Ctrl;

    //机构迁移
    App.on('data:move:org', ctrl.org);

    //商户迁移
    App.on('data:move:mcht', ctrl.mcht);

    //拓展员迁移
    App.on('data:move:user', ctrl.user);

    return ctrl;
});
