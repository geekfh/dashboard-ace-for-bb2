/**
 * Created by liliu on 2016/9/27.
 */

define([
	'App',
	'tpl!app/demo/grid/list3/templates/table-s.tpl',
	'tpl!app/demo/grid/list3/templates/stateFormTpl.tpl',
	'tpl!app/demo/grid/list3/templates/uploadFile.tpl',
	'jquery.jqGrid', 'jquery.validate', 'common-ui', 'upload'
], function(App, tpl, stateFormTpl, uploadFileTpl){
	var KIND_MAP = {
		'A1':'开放注册个体商户',
		'A2':'开放注册企业商户',
		'A3':'新开放注册个人商户',
		'B1': '个体商户',
		'B2': '普通商户',
		'D1': '二维码商户',
		'C1': '集团商户(总店)',//集团商户(门店)旧的数据（因S300那边改动，这边全部要改成他们一样的，逗！）
		'C2': '集团商户(门店)'//集团商户(总店)旧的数据
	};

	var view = Marionette.ItemView.extend({
		tabId: 'demo.menu.grid.list3',
		template: tpl,
		caption: '商户管理',

		onRender: function(){
			var me = this;
			_.defer(function(){
				me.renderGrid()
			});
		},

		renderGrid: function(){
			var me = this;

			//提交之前的验证规则---------------
			var setupValidation = Opf.Validate.setup;
			var addValidateRules = function(form){
				Opf.Validate.addRules(form, {
					rules : {
						mchtName : {
							'required': true,
							'maxlength': 12
						},
						mchtNo : 'required',
						oneAgent: {
							'required': true
						}
					}
				});
			};
			//---------------提交之前的验证规则

			var grid = me.grid = App.Factory.createJqGrid({
				rsId: 'demo.pm.grid.list3',
				gid: 'demo-page-grid-list3-grid',
				caption: '商户管理',
				url: url._('demo.api.grid.list3'),
				actionsCol: {
					extraButtons: [
						{
							name: 'changestate', icon: 'icon-opf-state-change', title: '更改状态',
							click: function (name, opts, rowData) {
								showChangeStateDialog(me, rowData);
							}
						}
					]
				},

				nav: {
					add:{
						//验证----------------
						beforeShowForm:function(form){
							addValidateRules(form);
						},
						beforeSubmit: setupValidation
						//----------------验证
					}
				},

				colNames: {
					id: '',
					mchtName: '商户名称',
					kind: '商户类型',
					mchtNo: '商户号',
					oneAgent: '一级代理商',
					branchName: '所属机构名',
					brhCode: '所属机构编号',
					expandName: '拓展员',
					expandinvitedcode: '拓展员推荐码',
					userName: '法人/个人名称',
					//registeDate: '商户录入时间',

					//新增搜索功能，前端不需要显示，但是需要作为搜索条件传到后台来搜索
					//userPhone: '联系人手机号码',  // 联系人手机号码
					cardNo: '联系人证件号码',  //联系人证件号码
					isInBlackList: '是否在黑名单中',
					maxDeviceNum: '终端数量'
				},

				colModel: [
					{name: 'id', index: 'id', editable: false, hidden: true},
					{
						name: 'mchtName', index: 'name', search: true, editable: true,
						_searchType: 'string'
					},
					{
						name: 'kind', index: 'kind', search: true, editable: true,
						formatter: kindFormatter,
						edittype: 'select',
						stype: 'select',
						searchoptions: {
							sopt: ['eq'],
							value: KIND_MAP
						},
						editoptions: {
							value: KIND_MAP
						}
					},
					{
						name: 'mchtNo', index: 'code', search: true, editable: true,
						width: 130, fixed: true,
						searchoptions: {
							sopt: ['eq']
						}
					},
					{name: 'oneAgent', index: 'oneAgent', search: false, editable: false, viewable: false},
					{
						name: 'branchName', index: 'branchName', search: true, editable: true,
						_searchType: 'string'
					},
					{
						name: 'brhCode',
						index: 'brhCode',
						search: true,
						editable: false,
						viewable: false,
						hidden: true,
						_searchType: 'string'
					},
					{
						name: 'expandName', index: 'expandName', search: true, editable: true,
						_searchType: 'string'
					},
					{
						name: 'expandinvitedcode', index: 'expandinvitedcode', search: true, editable: true, hidden: true,
						_searchType: 'string'
					},
					{
						name: 'userName', index: 'userName', search: true, editable: true,
						_searchType: 'string'
					},
					//{
					//	name: 'registeDate',
					//	index: 'registeDate',
					//	search: false,
					//	editable: true,
					//	formatter: timeFormatter
					//},

					//{
					//	name: 'userPhone',
					//	index: 'userPhone',
					//	search: true,
					//	editable: false,
					//	viewable: false,
					//	hidden: true,
					//	searchoptions: {
					//		sopt: ['eq']
					//	}
					//},
					{
						name: 'cardNo',
						index: 'cardNo',
						search: false,
						editable: false,
						viewable: false,
						hidden: true,
						_searchType: 'string'
					},
					{name: 'isInBlackList', index: 'isInBlackList', hidden: true },//是否在黑名单中
					{name: 'maxDeviceNum', index: 'maxDeviceNum', hidden: true }
				]
			});

			//上传按钮
			me.generateImportBtn(grid);
		},

		generateImportBtn: function (grid) {
			var me = this;
			if (!Ctx.avail('terminalsMgr.importInformation')) {
				return;
			}
			Opf.Grid.navButtonAdd(grid, {
				caption: "",
				id: "importInformation",
				name: "importInformation",
				title: '批量上传信息',
				buttonicon: "icon-upload-alt white",
				position: "last",
				onClickButton: function () {
					addImportDialog(me);
				}
			});
			$("#importInformation").hover(function () {
				$(".icon-upload-alt").addClass("icon-upload-alt-hover");
			}, function () {
				$(".icon-upload-alt").removeClass("icon-upload-alt-hover");
			});
		}
	});

	//批量导入
	function addImportDialog(me){
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
					action: url._('demo.api.grid.list3.import'),//上传接口
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
							Opf.alert({ title: '文件格式不合法', message: resp.msg ? resp.msg + '请先下载上传模板。' : '上传失败' });
						} else {
							me.grid.trigger("reloadGrid", [{current:true}]);
							$me.dialog("destroy");
							Opf.alert({ title: '上传成功', message: resp.msg });
						}

					}
				});

				// 下载按钮
				$(this).find('.download-btn').click(function(event) {
					Opf.UI.setLoading($('#page-content'), true);
					Opf.ajax({
						method:'get',
						url: url._('demo.api.grid.list3.download-excel'),  //下载接口
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

	function kindFormatter(val) {
		return KIND_MAP[val] || '';
	}

	function showChangeStateDialog(me, rowData) {

		var $dialog = Opf.Factory.createDialog(stateFormTpl({}), {
			destroyOnClose: true,
			title: '状态变更',
			autoOpen: true,
			width: 420,
			height: 360,
			modal: true,
			buttons: [{
				type: 'submit',
				click: function () {
					var $state = $(this).find('[name="state"]');
					var $unionState = $(this).find('[name="unionState"]');
					var oldState = rowData.status;// 商户状态
					var newState = $state.val();
					var oldUnionState = rowData.isCoMarketing;// 联合营销商户状态
					var newUnionState = $unionState.val();
					var selSateTxt = $state.find('option:selected').text();
					var selUnionSateTxt = $unionState.find('option:selected').text();

					var oldmaxDeviceNum = rowData.maxDeviceNum;
					var maxDeviceNum = $(this).find('[name="maxDeviceNum"]').val();
					if (oldState != newState || oldUnionState != newUnionState || /*oldS0State != newS0State ||*/ oldmaxDeviceNum != maxDeviceNum ) {
						var addConfirmMessage = '您确定执行以下操作吗？<br>';
						var noteMessage = '注意：';
						var index = 1;

						if(oldState != newState){
							addConfirmMessage += (index++)+'、更改商户状态为"' + selSateTxt + '" <br>';

							//一共有三种情况需要额外增加说明：1.正常 -> 停用；2.停用 -> 正常；3.正常/停用 -> 注销
							//标识为  0：正常；3：停用；4：注销
							if (newState == '4') {
								noteMessage += '商户状态改为注销后，商户将被删除！';
							}
							if (oldState == '0' && newState == '3') {
								noteMessage += '商户状态改为停用后，商户将不能进行交易！';
							}
							if (oldState == '3' && newState == '0') {
								noteMessage += '商户状态改为正常后，商户可进行正常交易！';
							}
						}

						if(oldUnionState != newUnionState){
							addConfirmMessage += (index++)+'、更改联合营销商户为 "' + selUnionSateTxt + '" <br>';
						}
						if(noteMessage != '注意：'){
							addConfirmMessage += '<br><br>'+noteMessage;
						}

						Opf.confirm(addConfirmMessage, function (result) {
							if (result) {
								//TODO block target
								Opf.ajax({
									type: 'PUT',
									jsonData: {
										oldStatus: oldState,
										newStatus: newState,
										oldUnionStatus:oldUnionState,
										newUnionStatus: newUnionState,
										maxDeviceNum: maxDeviceNum
									},
									url: url._('demo.api.grid.list3.changestate', {id: rowData.id}),
									successMsg: '更改状态成功',
									success: function () {
										me.grid.trigger('reloadGrid', {current: true});
									},
									complete: function () {
										$dialog.dialog('close');
									}
								});
							}
						});
					}
					else {
						$(this).dialog('close');
					}
				}
			}, {
				type: 'cancel'
			}],
			create: function () {
				$(this).find('[name="state"]').val(rowData.status);
				$(this).find('[name="unionState"]').val(rowData.isCoMarketing);
				$(this).find('[name="maxDeviceNum"]').val(rowData.maxDeviceNum);

				/*var address = {};
				address.zbankProvince = $(this).find('[name="zbankProvince"]');
				address.zbankCity = $(this).find('[name="zbankCity"]');
				address.zbankRegionCode = $(this).find('[name="zbankRegionCode"]');
				//init dom
				CommonUI.address(address.zbankProvince, address.zbankCity, address.zbankRegionCode);*/

				$(this).find('#txt-name').select2({
					placeholder: '--请选择--',
					minimumInputLength: 1,
					minimumResultsForSearch: Infinity,
					width: '180px',
					ajax: {
						type: 'GET',
						url: url._('demo.api.grid.list3.select2'),
						async: false,
						dataType: 'json',
						data: function (term) {
							return {
								kw: encodeURIComponent(term)
							};
						},
						results: function (data) {
							return {
								results: data
							};
						}
					},
					id: function (e) {
						return e.value;
					},
					value: function (e) {
						return e.name;
					},
					formatResult: function(data){
						return data.name;
					},
					formatSelection: function(data){
						return data.name;
					}
				});
			}
		});
	}

	return view;
});