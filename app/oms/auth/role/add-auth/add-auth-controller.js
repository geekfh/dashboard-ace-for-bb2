define(['App'], function(App) {

	var Controller = Marionette.Controller.extend({

		//get available unselected auths  
		getRoleInfo: function(id, callback) {
			//TODO refator Connection
			// $.getJSON('roles/' + id + '/auths',{}, function (data) {
			// });
			$.ajax({
				url: 'roles/' + id + '/auths',
				dataType: 'json',
				success: function(resp) {
					callback(resp);
				}
				//TODO error
			});

			return;
		},


		toAddAuth: function(id) {

			var me = this;

			this.getRoleInfo(id, function(data) {

				require(['app/oms/auth/role/add-auth/add-auth-view'], function(View) {
					var addView = new View.AddFormWin(data);

					addView.render();

					addView.on('role:addAuth', function(roleId, authIds) {

						console.info('>>>add-auth-ctrl on role:addAuth role id : ' + id + ' with ', authIds);

						if (id && authIds) {
							//TODO use Connection
							$.ajax({
								contentType: 'application/json',
								type: 'PUT',
								dataType: 'json',
								url: 'roles/' + roleId,
								//use Connection
								data: JSON.stringify({
									id: roleId,
									auths: authIds
								}),
								success: function(resp) {
									//TODO check success flag move outside
									if (resp.success) {
										addView.destroy();
									}
									
									// 未找到有监听'roleAddAuth:success'事件的代码，将其注释
									// AuthSysApp.trigger('roleAddAuth:success');

								},
								error: function() {

								}
							});
						}

					});

				});

			});

		}

	});

	return new Controller();

});