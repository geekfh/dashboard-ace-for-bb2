/*
 * 服务对象管理
 * */
define([
	'app/oms/service/targetMgrAbstractView',
	'app/oms/service/target-perform-config',
	'tpl!app/oms/service/target-mgr/templates/uploadFile.tpl'
], function (AbstractView, config, uploadFileTpl) {

	var OPERATION_MAP = {
		"open": "2",
		"stop": "3"
	};

	var View = AbstractView.extend({
		tabId: 'menu.service.target.mgr', //会用在 menu.js 里翻译

		generateImportBtn: function (grid) {
			var me = this;
			if (!Ctx.avail('serviceTargetMgr.importServiceTarget')) {
				return;
			}
			setTimeout(function () {
				Opf.Grid.navButtonAdd(grid, {
					caption: "",
					id: "importServiceTarget",
					name: "importServiceTarget",
					title: '导入',
					buttonicon: "icon-upload-alt white",
					position: "last",
					onClickButton: function () {
						addDialog(me);
					}
				});
				$("#importServiceTarget").hover(function () {//TODO 不要在全局范围内找
					$(".icon-upload-alt").addClass("icon-upload-alt-hover");
				}, function () {
					$(".icon-upload-alt").removeClass("icon-upload-alt-hover");
				});
			}, 10);
		},

		canOperate: function(grid,operation){
			if (grid.find('input.cbox:checked').length === 0) {
				return false;
			}
			//如果选中行既没有已开通的也没有达标的已停止的对象
			if(standardOrStoppedArr(grid).length === 0 && alreadyOpenedArr(grid).length === 0){
				return false;
			}
			//只可以批量停止已开通的
			if(operation === "stop" && alreadyOpenedArr(grid).length === 0){
				return false;
			}
			//只可以批量开通和达标的已停止的
			if(operation === "open" && standardOrStoppedArr(grid).length === 0){
				return false;
			}
			return true;
		},

		getRowsData: function(grid,operation){
			return operation === "open" ? standardOrStoppedArr(grid) : alreadyOpenedArr(grid);
		},

		//返回一个数组
		//如果operation是 open 这个数组就是 达标或已停止的
		//如果operation是 stop 这个数组就是 已开通的
		getPostData: function(grid,operation){
			var dataArr = [],
				rowsData = operation === 'open'? standardOrStoppedArr(grid) : alreadyOpenedArr(grid);
			_.each(rowsData, function(rowData){
				dataArr.push({
					registerId : rowData.registerId, //服务编号
					serviceStatus : rowData.status, //当前服务状态
					flag : OPERATION_MAP[operation] //成功更改后的状态
				})
			});
			return dataArr;
		},
		// 达标状态才能 开通
		// 开通状态才能 停止
		// 其他状态不能操作
		disableSelect: function(data){
			var statusList = _.pluck(data.content, 'status'),
				me = this,
				rows = me.grid.find('.ui-widget-content');
			for (var i = 0; i < statusList.length; i++) {
				var canNotCheckbox = statusList[i] !== "0" && statusList[i] !== "2" && statusList[i] !== "3";
				$('input.cbox', rows[i])
					.prop('disabled', canNotCheckbox)
					.prop('checked', false);
				$(rows[i]).removeClass('ui-state-highlight');
			}
		}

	});

	//返回状态为已经停止或达标的服务对象数组
	function standardOrStoppedArr(grid){
		var rowsData = getRowsData(grid);
		return _.filter(rowsData, function(rowData){
			return rowData.status === "0" || rowData.status === "3";
		});
	}

	//返回状态为已经开通的服务对象数组
	function alreadyOpenedArr(grid){
		var rowsData = getRowsData(grid);
		return _.filter(rowsData, function(rowData){
			return rowData.status === "2";
		});
	}

	//获取被选中的行包含的数据
	function getRowsData(grid){
		return _.map(grid.jqGrid('getGridParam', 'selarrrow'), function (id) {
			return grid.jqGrid('getRowData', id);
		});
	}

	function addDialog(me) {
		var uploader, tpl = uploadFileTpl();

		var $dialog = Opf.Factory.createDialog(tpl, {
			destroyOnClose: true,
			autoOpen: true,
			width: 450,
			height: 420,
			modal: true,
			buttons: [{
				type: 'submit',
				click: function (e) {
					//upload file

					var
						fileSelected = $dialog.find("input[name='file']").val() !== "",
						id = $dialog.find('[name="service-id"]').val();

					if(fileSelected){
						uploader.setData({id: id});
						uploader.submit();
					} else {
						$("label[for='uploadfile']").addClass("error").text("请选择文件");
					}
				}
			}, {
				type: 'cancel'
			}],
			create: function() {
				var
					$me = $(this),
					$indicator = $me.find('.uploadFileIndicator'),
					$serviceIdSelect = $me.find('[name="service-id"]'),
					$labelForUploadFile = $me.find("label[for='uploadfile']"),
					$trigger = $me.find('.uploadfile'),
					$submitBtn = $me.closest('.ui-dialog').find('button[type="submit"]');
				uploader = new Uploader({
					data: {
					},
					name: 'file',
					trigger: $trigger,
					action: url._('import.service.target'),
					accept: '.xls, .xlsx',
					change: function () {
						$labelForUploadFile.removeClass("error").text($me.find("input[name='file']").val());
					},
					beforeSubmit: function () {
						$indicator.show();
						Opf.UI.busyText($submitBtn);
					},
					complete: function () {
						$indicator.hide();
						Opf.UI.busyText($submitBtn,false);
					},
					progress: function(queueId, event, position, total, percent) {
						if(percent) {
							$indicator.find('.progress-percent').text(percent+'%').show();
						}
					},
					success: function(queueId, resp) {
						if(resp.success === false) {
							Opf.alert({ title: '导入失败', message: resp.msg ? resp.msg : '上传失败，请先下载上传模板。' });
						} else {
							Opf.Toast.success('导入成功');
							me.grid.trigger("reloadGrid", [{current:true}]);
							$me.dialog("destroy");
						}

					}
				});


				Opf.ajax({
					url: url._('get.service.id'),
					type: 'GET',
					success: function (resp) {
						var tpl = _.map(resp,function(item){
							return 	'<option title="'+ item.serviceName +'" value="' + item.id + '">' + item.serviceName + '</option>';
						}).join('');
						var $options = $(tpl);
						$serviceIdSelect.append($options);

						$options.closest('[title="T+0服务费"]').prop('selected', 'selected');
					}
				});

				// 下载按钮
				$(this).find('.download-btn').click(function(event) {
					Opf.UI.setLoading($('#page-content'), true);
					Opf.ajax({
						url: url._('service.target.download.tpl'),
						success: function (resp) {
							Opf.download(resp.data);
						},

						error: function(resp) {
							console.log("downlaod template error");
						},

						complete: function (resp) {
							Opf.UI.setLoading($(event.target).closest('#page-content'),false);
						}
					});
				});

			}
		});
	}

	App.on('service:target:mgr', function () {
		var view = new View(config.targetMgrConfig);
		App.show(view);
	});

	return View;
});
