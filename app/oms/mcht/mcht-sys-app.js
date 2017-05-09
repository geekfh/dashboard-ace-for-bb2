/**
 * 我的商户
 */

define([
    'App'
], function(App) {

    App.module('MchtSysApp', function(MchtSysApp) {

        var BmgrSysRouter = Marionette.AppRouter.extend({
            appRoutes: {
                "mchts(/filter/kw::kw)": "listMchts"
            }
        });

        /**
         * @API : define methods for interaction (with parent app) and router
         */
        var API = {
            listMchts: function(kw) {
                var me = this;
                console.log('>>>>mcht.listMchts ',  kw || '');

                require(['app/oms/mcht/list/list-controller'], function (ctrl) {
                    ctrl.listMchts(kw);
                });
            },

            listPufaMchts: function(kw) {
                var me = this;
                console.log('>>>>mcht.listPufaMchts', (kw || ''));

                require(['app/oms/mcht/list/list-controller'], function (ctrl) {
                    ctrl.listPufaMchts(kw);
                });
            },

            listUser2Mchts: function() {
                require(['app/oms/mcht/list/list-controller'], function (ctrl) {
                    ctrl.listUser2Mchts();
                });
            },

            addMcht: function () {
                require(['app/oms/mcht/add/add-controller'], function (ctrl) {
                    ctrl.addMcht();
                });
            },

            showMcht: function (id) {
                require(['app/oms/mcht/show/show-controller'], function (ctrl) {
                    ctrl.showMcht(id);
                });
            },

            showPufaMcht: function (id) {
                require(['app/oms/mcht/show/show-controller'], function (ctrl) {
                    ctrl.showMchtPufa(id);
                });
            },

            showUser2Mcht: function (id) {
                require(['app/oms/mcht/show/show-controller'], function (ctrl) {
                    ctrl.showMchtUser2(id);
                });
            },

            editMcht: function (id) {
                require(['app/oms/mcht/edit/edit-controller'], function (ctrl) {
                    ctrl.editMcht(id);
                });
            },

            mchtInfoChange: function (id) {
                require(['app/oms/mcht/change/info-change-controller'], function (ctrl) {
                    ctrl.listMchtInfoChange(id);
                });
            },

            querycht: function(id) {
                require(['app/oms/onestop/search-controller'], function (ctrl) {
                    ctrl.searchMcht(id);
                });
            },

            showServiceList: function(){
                require(['app/oms/mcht/service/list-controller'], function(ctrl){
                    ctrl.showList();
                });
            },

            listPersonMchts: function () {
                require(['app/oms/mcht/list/list-controller'], function (ctrl) {
                    ctrl.listPersonMchts();
                });
            },

            //推荐注册商户列表
            listTopuserMchts: function() {
                require(['app/oms/mcht/list/list-controller'], function (ctrl) {
                    ctrl.listTopuserMchts();
                });
            }
        };

        //if it is not used to map the url first time typed in browser
        //u can new router anywhere before u want, otherwise, u should
        //add router before start Backbone history
        new BmgrSysRouter({ controller: API });


        /**
         * @RegisgerEvent : register events or command to parent app
         */
        App.on('mchts:list', function(kw) {
            API.listMchts(kw);
        });

        App.on('mchts:pufa:list', function(kw) {
            API.listPufaMchts(kw);
        });

        App.on('mcht:add', function () {
            API.addMcht();
        });

        App.on('mcht:show', function (id) {
            API.showMcht(id);
        });

        App.on('mcht:show:pufa', function (id) {
            API.showPufaMcht(id);
        });

        App.on('mcht:show:user2', function (id) {
            API.showUser2Mcht(id);
        });

        App.on('mcht:edit', function (id) {
            API.editMcht(id);
        });

        App.on('mcht:info:change', function (id) {
            API.mchtInfoChange(id);
        });

        App.on('mcht:query', function(id){
            API.querycht(id);
        });

        App.on('mcht:service:list', function(){
            API.showServiceList();
        });

        App.on('mcht:user:list', function() {
            API.listPersonMchts();
        });

        App.on('mchts:user2:list', function() {
            API.listUser2Mchts();
        });

        App.on('mchts:topuser:list', function() {
            API.listTopuserMchts();
        });

        //this callback will be invoked before parent app:initilize:after
        App.addInitializer(function() {
            console.log('>>>>initializer MchtSysApp');
        });
    });

    return App.MchtSysApp;
});
