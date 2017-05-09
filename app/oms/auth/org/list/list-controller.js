//此Controller对应于权限管理菜单下的机构组织表
define(['App'], function(App) {

    function isStlmVal(val) {
        return parseInt(val, 10) === 0;
    }


    var Controller = Marionette.Controller.extend({

        listOrgs: function(kw) {
            var me = this;
            require(['app/oms/auth/org/list/list-view' /*,'entities/org'*/ ], function(View) {

                console.info('new view orgs');
                var orgsView = new View.Orgs({});

                App.show(orgsView);

                me.orgsView = orgsView;
                me.addEvents();
            });


        }, //@listOrgs

        addEvents: function() {
            this.orgsView.on('org:edit', function(id, rowData) {
                require(['app/oms/auth/org/edit/edit-info-controller'], function(ctrl) {
                    ctrl.editBrh(id, rowData);
                });
            });

            this.orgsView.on('org:view', function(id, rowData) {
                require(['app/oms/auth/org/show/show-controller'], function(ctrl) {
                    ctrl.viewBrh(id, rowData);
                });
            });

        },

        addBranch: function() {
            require(['app/oms/auth/org/add/add-brh-view'], function(View) {
                App.show(new View());
            });
        }


    });

    var ctrl = new Controller();

    App.on('branches:list', function() {
        ctrl.listOrgs();
    });

    App.on('branch:add', function() {
        ctrl.addBranch();
    });

    return ctrl;



});