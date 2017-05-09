define(['App'], function(App) {

	App.module('MchtSysApp.List', function(List, App, Backbone, Marionette, $, _) {

		List.Controller = {

			listMchts: function(kw) {

				require(['app/oms/mcht/list/list-view' /*,'entities/user'*/ ], function(View) {

					console.info('new view mcht');
					var mchtsView = new View.Mchts({});
					App.show(mchtsView);

				});


			}, //@商户列表

			listPufaMchts: function(kw) {

				require(['app/oms/mcht/list/list-pufa-view' /*,'entities/user'*/ ], function(View) {

					console.info('new view mcht');
					var mchtsView = new View.PufaMchts({});
					App.show(mchtsView);

				});


			}, //@商户列表(浦发)

            listUser2Mchts: function() {

                require(['app/oms/mcht/list/list-user2-view'], function(View) {
                    var mchtsUser2View = new View();
                    App.show(mchtsUser2View);
                });


            }, //@商户列表(客服/运营)

			listPersonMchts: function () {
				require(['app/oms/mcht/list/list-person-view'], function(View) {

					var personView = new View();

					App.show(personView);

				});
			},

			//推荐注册商户列表
			listTopuserMchts: function() {
				require(['app/oms/mcht/list/list-topuser-view'], function(View) {
					var topuserView = new View();
					App.show(topuserView);
				});
			}
		};

	});
	return App.MchtSysApp.List.Controller;
});