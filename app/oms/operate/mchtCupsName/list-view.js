/**
 * Created by wupeiying on 2016/8/8.
 */
define(['App',
	'tpl!app/oms/operate/mchtCupsName/edit-view.tpl',
	'tpl!app/oms/operate/mchtCupsName/uploadFile.tpl',
	'jquery.validate',
	'jquery.jqGrid',
	'upload'
], function(App, editTpl, uploadFileTpl) {

	var tableCtTpl = [
		'<div class="row">',
		'<div class="col-xs-12 jgrid-container">',
		'<table id="mcht-cupsName-grid-table"></table>',
		'<div id="mcht-cupsName-grid-pager" ></div>',
		'</div>',
		'</div>'].join('');

	var STATUS_MAP = {
		0: '正常',
		1: '停用'
	};

	var View = Marionette.ItemView.extend({
		template: _.template(tableCtTpl),
		tabId: 'menu.operate.mchtCupsName',
		events: {},

		onRender: function () {
			var me = this;
			_.defer(function () {
				me.renderGrid();
			});
		},

		attachValidation: function() {
			return {
				setupValidation: Opf.Validate.setup,
				addValidateRules: function(form) {
					Opf.Validate.addRules(form, {
						rules:{
							mchtName:{required: true},
							mcc:{required: true},
							mchtNo:{required: true},
							chnlInstId:{required: true},
							termNo:{required: true},
							chnlName:{required: true},
							status:{required: true},
							feeRate:{required: true},
							feeVal:{required: true},
							changeDate:{required: true},
							tmkValue:{required: true},
							chnlCode:{required: true},
							chnlVCode:{required: true},
							boxMchtNo:{required: true},
							regionCode:{required: true},
							mccGroup:{required: true},
							remark:{required: true},
							tmkIndex:{required: true},
							tmkCv:{required: true},
							maxAmount:{required: true}
						}
					});
				}
			};
		},

		renderGrid: function () {
			var me = this;
			var validation = this.attachValidation();
			var grid = App.Factory.createJqGrid({
				rsId: 'mchtCupsName',
				caption: '',
				filters:[
					{
						caption: '渠道搜索',
						//defaultRenderGrid: false,
						canSearchAll: true,
						canClearSearch: true,
						components: [
							{
								label: '商户名称',
								name: 'mchtName',
								options: {
									sopt: ['eq', 'lk']
								}
							}, {
								label: '商户号',
								name: 'mchtNo',
								inputmask: {
									integer: true
								},
								options: {
									sopt: ['eq', 'lk']
								}
							}, {
								label: '终端号',
								name: 'termNo',
								inputmask: {
									integer: true
								},
								options: {
									sopt: ['eq', 'lk']
								}
							}, {
								label: '所属通道',
								name: 'chnlName',
								inputmask: {
									integer: true
								},
								options: {
									sopt: ['eq', 'lk']
								}
							}
						],
						searchBtn: {
							text: '搜索'
						}
					}
				],
				nav: {
					actions: {
						search: false
					},
					add: {
						beforeShowForm: function(form) {
							validation.addValidateRules(form);
						},
						beforeSubmit: validation.setupValidation
					},
					edit: {
						beforeShowForm: function(form) {
							validation.addValidateRules(form);
						},
						beforeSubmit: validation.setupValidation
					}
				},
				actionsCol: {
					width: 100,
					edit: false,
					extraButtons: [
						{
							name: 'edit', icon: 'ui-icon ui-icon-pencil', title: '修改操作',
							click: function (name, opts, rowData){
								Opf.ajax({
									url: url._('mcht.cupsName.views', {id: rowData.id}),
									type: 'GET',
									success: function (resp) {
										if(resp.data){
											var $dialog = Opf.Factory.createDialog(editTpl({data: resp.data}), {
												title: '修改操作',
												destroyOnClose: true,
												autoOpen: true,
												width: 450,
												height: 600,
												modal: true,
												buttons: [{
													type: 'submit',
													click: function (e) {
														var form = $(this).find('.form-value');
														var objStr = {};
														_.each(form, function(v, i){
															objStr[$(v).attr('name')]=$(v).val();
														});

														Opf.ajax({
															type: 'PUT',
															async: false,
															url: 'api/mcht/channel/'+rowData.id,
															jsonData: objStr,
															success: function (resp) {
																if(resp.success){
																	Opf.Toast.success('修改成功！');
																	$dialog.dialog('close');
																	$(grid).trigger('reloadGrid', {current: true});
																}
																else{
																	Opf.Toast.success('修改失败！');
																}
															}
														});
													}
												}, {
													type: 'cancel'
												}]
											});
										}
									}
								});
							}
						}
					],
					del: false
				},
				gid: 'mcht-cupsName-grid',
				url: url._('mcht.cupsName.list'),
				colNames: {
					id: '',
					mchtName: '商户名称',
					mchtNo: '商户号',
					termNo: '终端号',
					chnlName: '所属通道',
					status: '状态',//0:正常1:停用
					mcc: 'MCC',
					chnlInstId: '收单机构代码',
					feeRate: '费率',
					feeVal: '封顶值',
					changeDate: '日切时间',
					chnlCode: '渠道简写',
					tmkValue: '主密钥TMK'
				},
				colModel: [
					{name: 'id', hidden: true},
					{name: 'mchtName', editable: true},
					{name: 'mchtNo', hidden: false, editable: true},
					{name: 'termNo', editable: true},
					{name: 'chnlName', editable: true},
					{name: 'status', editable: true, formatter: function(val){return STATUS_MAP[val]},
						edittype: 'select',
						editoptions:{
							value: STATUS_MAP
						}
					},
					{name: 'mcc', editable: true},
					{name: 'chnlInstId', editable: true},
					{name: 'feeRate', editable: true},
					{name: 'feeVal', editable: true},
					{name: 'changeDate', editable: true},
					{name: 'chnlCode', editable: true, hidden: true},
					{name: 'tmkValue', editable: true, hidden: true},
				],
				loadComplete: function () {}
			});

			var btnHtml = _.template(['<div style="border: 1px solid #ffffff;color: #ffffff;border-radius: 3px;text-align: center;">',
				'<div style="width: 110px;  height: 29px; padding: 5px 8px;">',
				'<i class="<%=icon%>"></i>',
				'<%=str%>',
				'</div>',
				'</div>'].join(''));

			_.defer(function () {
				Opf.Grid.availNavButtonAdd(grid, {
					caption: btnHtml({str: '批量导入', icon: 'icon-download'}),
					name: 'batchImport',
					title: '批量导入',
					position: 'last',
					buttonicon: 'auto-batch',
					onClickButton: function() {
						batchImportDialog(grid);
					}
				});
			});

			return grid;
		}
	});

	function batchImportDialog(grid){
		var titleName = "批量导入";
		var uploader, tpl = null;
		uploader = tpl = uploadFileTpl({
			data: titleName
		});
		var $dialog = Opf.Factory.createDialog(tpl, {
			destroyOnClose: true,
			autoOpen: true,
			width: 450,
			height: 420,
			modal: true,
			buttons: [{
				type: 'submit',
				click: function (e) {
					var fileSelected = ($dialog.find("input[name='file']").val() === "" ? false : true);

					if(fileSelected){
						uploader.submit();
					}
					else{
						$("label[for='uploadfile']").addClass("error").text("请选择文件");
					}
				}
			}, {
				type: 'cancel'
			}],
			create: function() {
				var $me = $(this),
					$indicator = $me.find('.uploadFileIndicator'),
					$trigger = $me.find('.uploadfile'),
					$submitBtn = $me.closest('.ui-dialog').find('button[type="submit"]');
				uploader = new Uploader({
					data: {},
					name: 'file',
					trigger: $trigger,
					action: 'api/mcht/channel/batch_import',//上传接口
					accept: '.xls, .xlsx',
					change: function () {
						$("label[for='uploadfile']").removeClass("error").text($("form input[name='file']").val());
					},
					beforeSubmit: function () {
						Opf.UI.busyText($submitBtn);
					},
					complete: function () {
						Opf.UI.busyText($submitBtn,false);
					},
					progress: function(queueId, event, position, total, percent) {
						if(percent) {
							$indicator.find('.progress-percent').text(percent+'%').show();
						}
					},
					success: function(queueId, resp) {
						if(resp.success === false) {
							Opf.alert({ title: '操作提示', message: resp.msg ? resp.msg : '信息导入错误!' });
						}
						else {
							$me.dialog("destroy");
							Opf.alert({ title: '操作提示', message: resp.msg });
							grid.trigger('reloadGrid');
						}
					}
				});

				// 下载按钮
				$(this).find('.download-btn').click(function(event) {
					Opf.UI.setLoading($('#page-content'), true);
					Opf.ajax({
						type: 'GET',
						url: 'api/mcht/channel/download_template',
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


	App.on('operate:mchtCupsName:list', function () {
		App.show(new View());
	});

	return View;
});