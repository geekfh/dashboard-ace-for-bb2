define(['App',
	'i18n!app/oms/common/nls/param',
	'tpl!app/oms/param/card-bin/list/uploadFile.tpl',
	'jquery.jqGrid',
	'jquery.validate',
	'bootstrap-datepicker',
	'select2',
	'upload',
	'common-ui'
], function(App,  paramLang, uploadFileTpl) {

	var tableCtTpl = ['<div class="row">',
		'<div class="col-xs-12 jgrid-container">',
		'<table id="card-bins-grid-table"></table>',
		'<div id="card-bins-grid-pager" ></div>',
		'</div>',
		'</div>'].join('');

	var TYPE_MAP = {
		1:	'借记卡',
		2:	'贷记卡',
		3:	'准贷记卡',
		4:	'预付卡'
	};

	var ISUNIONPAY_MAP = {
		0: '否',
		1: '是'
	};

	var queryFilters;

	var View = Marionette.ItemView.extend({
		template: _.template(tableCtTpl),
		tabId: 'menu.param.cardbin',
		events: {},

		onRender: function() {
			var me = this;
			_.defer(function () {
				me.renderGrid();
			});
		},

		renderGrid: function() {
			var me = this;
			var setupValidation = Opf.Validate.setup;
			var addValidateRules = function(form){
				Opf.Validate.addRules(form, {
					rules: {
						bin: {
							'required': true
						},
						name: {
							'required': true
						},
						binLen: {
							'required': true
						},
						cardLen: {
							'required': true
						},
						type: {
							'required': true
						},
						bankName: {
							'required': true
						},
						cupLogFlag: {
							'required': true
						},
						recOprId: {
							'required': true
						},
						recCrtTs: {
							'required': true
						},
						recUpdOpr: {
							'required': true
						},
						recUpdTs: {
							'required': true
						}
					}
				});
			};

			var grid = me.grid = App.Factory.createJqGrid({
				rsId: 'cardbin',
				caption: paramLang._('card-bin.txt'),
				nav: {
					actions:{
						//search: false
					},
					search: {
						width: 450,
						afterRedraw: function (){
							return CommonUI.searchFormBySelect2($(this), 'bankName');
						},
						onSearch: function() {
							var $grid = $(this), postData = $grid.jqGrid('getGridParam', 'postData');
							var gid = $grid.jqGrid('getGridParam', 'gid');
							var tableId = $('#fbox_'+gid+'-table');

							return me.queryFilters = queryFilters = CommonUI.searchFilterBySelect2(tableId, postData, 'bankName');
						}
					},
					add:{
						beforeShowForm:function(form){
							form.find('#tr_bankId').css('display','none');
							addValidateRules(form);
						},
						afterShowForm: function(form) {
							_.defer(function(){
								addSelect2(form, form.find('#bankName'), '');
							});
						},
						beforeSubmit: setupValidation
					},
					edit:{
						beforeShowForm:function(form){
							form.find('#tr_bankId').css('display','none');
							addValidateRules(form);
						},
						afterShowForm: function(form) {
							var bankName = Opf.Grid.getSelRowId(grid);
							var rowData = grid.getRowData(bankName);
							addSelect2(form, form.find('#bankName'), rowData.bankName);
						},
						beforeSubmit: setupValidation
					}
				},
				gid: 'card-bins-grid',
				url: url._('card-bin'),
				colNames: {
					id			: 		'',
					bin			:		'卡bin',
					name		:		'卡中文名',
					binLen		:		'卡bin长度',
					cardLen		:		'卡号长度',
					type		:		'卡类型',	//1:借记卡;2:贷记卡;3:准贷记卡;4:预付卡;
					bankId		: 		'所属银行ID',
					bankName	: 		'所属银行',
					cupLogFlag	:		'是否银联品牌卡',
					recOprId	:		'记录员号',
					recCrtTs	:		'记录创建时间',
					recUpdOpr	:		'修改员号',
					recUpdTs	:		'记录修改时间'
				},
				colModel: [
					{name:	'id',			index:'id',			editable: false, hidden: true},
					{name:	'bin',			index:'bin',		editable: true, search: true,
						searchoptions: {
							sopt: ['lk']
						}
					},
					{name:	'name',			index:'name',		editable: true, search: true,
						searchoptions: {
							sopt: ['lk']
						}
					},
					{name:	'binLen',		index:'binLen',	 	editable: true},
					{name:	'cardLen',		index:'cardLen',	editable: true},
					{name:	'type',		 	index:'type',		editable: true, formatter: statusFormatter, search: true,
						stype: 'select',
						searchoptions: {
							sopt: ['eq'],
							value: TYPE_MAP
						},
						edittype: 'select',
						editoptions: {
							value: TYPE_MAP
						}
					},
					{name:	'bankId',		index:'bankId',	 	editable: true, hidden: true},
					{name:	'bankName',		index:'bankName',	editable: true, search: true,
						stype: 'select',
						searchoptions: {
							sopt: ['eq']
						}
					},
					{name:	'cupLogFlag',	index:'cupLogFlag', editable: true, formatter: isUnionPayFormatter,
						edittype: 'select',
						editoptions: {
							value: ISUNIONPAY_MAP
						}
					},
					{name:	'recOprId',	 	index:'recOprId',	editable: false, hidden: true},
					{name:	'recCrtTs',	 	index:'recCrtTs',	editable: false, hidden: true},
					{name:	'recUpdOpr',	index:'recUpdOpr', 	editable: false, hidden: true},
					{name:	'recUpdTs',	 	index:'recUpdTs',	editable: false, hidden: true}
				],

				loadComplete: function() {}
			});

			me.ImportBtn(grid);//批量导入

			return grid;
		},

		ImportBtn: function (grid)  {
			var me = this;
			if(!Ctx.avail('cardbin.Import')) {
				return;
			}
			Opf.Grid.navButtonAdd(grid, {
				caption: "",
				id: "Import",
				name: "Import",
				title:'批量导入',
				buttonicon: "icon-upload-alt white",
				position: "last",
				onClickButton: function(){
					addImportDialog(grid);
				}
			});
			$("#Import").hover(function(){
				$(".icon-upload-alt").addClass("icon-upload-alt-hover");
			},function(){
				$(".icon-upload-alt").removeClass("icon-upload-alt-hover");
			});
		}
	});

	//批量导入
	function addImportDialog(grid){
		var titleName = "批量导入";
		var uploader, tpl = null;
		uploader = tpl = uploadFileTpl({
			data: titleName
		});
		var $dialog = Opf.Factory.createDialog(tpl, {
			destroyOnClose: true,
			autoOpen: true,
			width: 400,
			height: 350,
			modal: true,
			buttons: [{
				type: 'submit',
				click: function (e) {
					var fileSelected = ($dialog.find("input[name='file']").val() === "" ? false : true);
					var bankId = $(this).find("input[name='bankId']").val();
					if(bankId == ''){
						Opf.alert('需要选择所属银行！');
						return;
					}
					if(fileSelected){
						uploader.form.append('<input id="bankId" name="bankId" type="hidden" value="' + bankId + '"/>');
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
					name: 'file',
					trigger: $trigger,
					action: url._('card-bin.import'),//上传接口
					//data: { bankId: $("input[name='bankId']").val() },
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
							grid.trigger("reloadGrid", [{current:true}]);
							$me.dialog("destroy");
							Opf.alert({ title: '上传成功', message: resp.msg });
						}

					}
				});

				// 下载按钮
				$(this).find('.download-btn').click(function(event) {
					Opf.UI.setLoading($('#page-content'), true);
					Opf.ajax({
						url: url._('card-bin.download'),
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

				//select
				addSelect2($('.upload-form'), $('.div_bankName'), '');
			}
		});
	}

	function addSelect2(form, $select, bankName) {
		$($select).select2({
			placeholder: '请选择所属银行',
			minimumInputLength: 1,
			width: '220px',
			ajax: {
				type: 'GET',
				url: url._('card-bin.bankName'),
				dataType: 'json',
				//contentType: 'application/json',
				data: function (term, page) {
					return {
						bankName: encodeURIComponent(term)
					};
				},
				results: function (data, page) {
					return {
						results: data
					};
				}
			},
			initSelection: function(element, callback){
				var number = $(element).val();
				if(number !== ''){
					return $.ajax({
						type: 'GET',
						url: url._('card-bin.bankName'),
						dataType: 'json',
						//contentType: 'application/json',
						data: function (term, page) {
							return {
								bankName: encodeURIComponent(number)
							};
						},
						results: function (data, page) {
							return {
								results: data.bankName
							};
						}
					});
					//return $.ajax({
					//	type: 'GET',
					//	url: url._('bank.info'),
					//	dataType: 'json',
					//	contentType: 'application/json',
					//	data: function (term, page) {
					//		return {
					//			value: encodeURIComponent(number)
					//		};
					//	}
					//}).done(function(data) {
					//	callback(data);
					//});
				}
			},
			id: function (e) {
				form.find('#bankId').val(e.bankId);//e.key
				return e.bankName;//e.value
			},
			formatResult: function(data, container, query, escapeMarkup){
				return data.bankName;
				//console.log('aa: ' + query.term);
				//console.log('bb: ' + data.value);
				//data.value = data.value.replace(new RegExp("(" + query.term + ")", "g"), "<span class='select-term'>$1</span>");
				//return "<div class='select-result'>" + data.value + "</div>";
			},
			formatSelection: function(data, container, escapeMarkup){
				return data.bankName;
			},
			formatNoMatches: function () { return "没有匹配项，请输入其他关键字"; },
			formatInputTooShort: function (input, min) {
				var n = min - input.length;
				return "请输入至少 " + n + "个字符";
			},
			formatSearching: function () {
				return "搜索中...";
			},
			adaptContainerCssClass: function(classname){
				return classname;
			},
			escapeMarkup: function (m) {
				return m;
			}
		});
		if(bankName !== ''){
			$('.select2-chosen').html(bankName);
		}
	}

	function statusFormatter(val){
		return TYPE_MAP[val] || '';
	}

	function isUnionPayFormatter(val){
		return ISUNIONPAY_MAP[val] || '';
	}

	App.on('card-bins:list', function () {
		App.show(new View());
	});

	return View;
});