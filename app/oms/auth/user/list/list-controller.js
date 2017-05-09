

//此Controller对应于权限管理菜单下的操作员表
define(['App'], function(App) {


	var Controller = Marionette.Controller.extend({

		listUsers: function(kw) {

			require(['app/oms/auth/user/list/list-view'], function(View) {

					console.info('new view users');
					var usersView =  new View.Users({}); 
        			App.show(usersView);

			});


		},//@listUsers

        addUsers: function() {
            require(['app/oms/auth/user/add/add-view'], function(View) {

                console.info('new view users');
                var addView =  new View(); 
                App.show(addView);

            });
        },
        showUsers: function(id, rowData) {
            require(['app/oms/auth/user/show/show-info-view'], function(ShowUserInfoView) {

                console.info('new showView users');
                // Opf.UI.setLoading($('#page-body'));
                App.maskCurTab();
                Opf.ajax({
                    type: 'GET',
                    url: url._('user',{id: id}),
                    success: function(data) {
                        data._from = "view"; //_from："view" ----表示是来自员工管理的拓展员详情界面，区别于任务审核-新增拓展员下的拓展员详情界面
                        var view = new ShowUserInfoView({
                            data: data,
                            rowData: rowData
                        }).render();

                        Opf.Factory.createDialog(view.$el, {
                            destroyOnClose: true,
                            title: '操作员资料',
                            cls: 'user-detail-dialog',
                            zindex: 6000,
                            width: '80%',
                            height: 600,
                            paddingLayer: true,
                            paddingLayerCls: 'user-detail-view-pad-layer',
                            modal: true,
                            autoshow: true
                        });
                        // Opf.UI.setLoading($('#page-body'), false);
                    },
                    complete: function () {
                        App.unMaskCurTab();
                    }
                });
            });
        },
        eidtUsers: function(id) {
            require(['app/oms/auth/user/edit/edit-view'], function(View) {

                console.info('new editView users');
                Opf.ajax({
                    type: 'GET',
                    url: url._('user',{id: id}),
                    success: function(data) {
                        var editView = new View(data); 
                        App.show(editView);
                    }
                });
            });
        }

	});


	var ctrl = new Controller();

    App.on('user:list', function() {
        console.log('监听到 App触发的"user:list"事件, 触发权限管理菜单下的操作员表');
        ctrl.listUsers();
    });

    App.on('user:add', function() {
        ctrl.addUsers();
    });
    
    App.on('user:show', function(id, rowData) {
        ctrl.showUsers(id, rowData);
    }); 

    App.on('user:edit', function(id) {
        ctrl.eidtUsers(id);
    });

    return ctrl;


});