define(['App'], function(App) {

	var rolesUrl = url._('role')+'/';

	var Controller = Marionette.Controller.extend({

		//TODO use model
		fetchRole: function(id, callback) {

			$.ajax({
				type: 'GET',
				dataType: 'json',
				url: rolesUrl + id,
				success: function(resp) {
					if (!resp.success) {
						callback(resp || []);
					}
				}
			});
		},

		fetchUnSelAuths: function(id, callback) {
			return $.ajax({
				url: url._('role.v2.canaddauths', {id: id}),
				dataType: 'json',
				success: function(resp) {
					callback(resp);
				}
			});
		},

		addAuth: function(id) {
			var me = this;

			Opf.UI.setLoading(me.editView.$el, true);

			this.fetchUnSelAuths(id, function(data) {
				require(['app/oms/auth/role/edit/add-auth-view'], function(View) {
					Opf.UI.setLoading(me.editView.$el, false);

					var addView = new View(data);

					addView.render();

					addView.on('submit', function(authIds) {
						if (id && authIds) {
							addView.setLoading(true);
							$.ajax({
								contentType: 'application/json',
								type: 'PUT',
								dataType: 'json',
								url: rolesUrl + id + '/add-auths',
								//use Connection
								data: JSON.stringify({
									id: id,
									auths: authIds
								}),

								success: function(resp) {
									//TODO check success flag move outside
									addView.destroy();

									me.fetchRole(me.roleId, function (data) {
										me.editView.refresh(data);
									});

								},
								complete: function() {
									addView.setLoading(false);
								}
							});
						}

					});
				});
			});
		},

		editRole: function (id, el) {
			var me = this;
				me.roleId = id;

			require(['app/oms/auth/role/edit/edit-view'], function (EditView) {
				//TODO use model
				me.fetchRole(id, function (data) {

					me.editView = new EditView({
						el: el,
						roleId : id,
						data: data
					});

					me.editView.render();

					me.editView.on('role:auth:add', function (id) {
						console.log('>>>edit ctrl view.on role:add:auth');

						me.addAuth(id);

					});

					me.editView.on('role:delete:auth', function (roleId, authIds) {

						console.log('>>> edit ctrl view.on role:delete:auth', roleId, authIds);

						me.editView.onBeforeDelAuth(false);
						$.ajax({
							contentType: 'application/json',
							url: rolesUrl + roleId + '/del-auths',
							type: 'DELETE',
							data: JSON.stringify({
								id: id,
								auths: authIds
							}),
							error: function () {
								me.editView.onAfterDelAuth(false);

							},
							success: function() {

								me.fetchRole(me.roleId, function (data) {
									me.editView.refresh(data);
								});

								me.editView.onAfterDelAuth(false);
							}
						});

					});

				});

			});
		}
	});


    return new Controller();


});