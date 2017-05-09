/**
 * Created by zhuyimin on 2015/1/8.
 */
/**
 * 用来映射终端型号，映射后不会出来“盒子”字样*/


define([
	'tpl!app/oms/terminals/terminals-type-displays/list/templates/terminalsTypeDisplays.tpl',
	'i18n!app/oms/common/nls/terminals',
	'jquery.jqGrid',
	'select2'
], function (TerminalsTypeDisplaysTpl, terminalsLang) {

	var MCHTACTTYPE_MAP = {
		"P603+":    terminalsLang._("terminals.mgr.sourceTermMachTp.P603PLUS"),
		"600":      terminalsLang._("terminals.mgr.sourceTermMachTp.600"),
		"602(通刷宝)": terminalsLang._("terminals.mgr.sourceTermMachTp.602"),
		"808":      terminalsLang._("terminals.mgr.sourceTermMachTp.808"),
		"809":      terminalsLang._("terminals.mgr.sourceTermMachTp.809"),
		"E550":     terminalsLang._("terminals.mgr.sourceTermMachTp.E550"),
		"E5X0":     terminalsLang._("terminals.mgr.sourceTermMachTp.E5X0")
	},

		arrResponse = [];

	var View = Marionette.ItemView.extend({
		tabId: 'menu.terminals.type.display',
		template: TerminalsTypeDisplaysTpl,

		events: {},

		initialize: function () {
		},

		onRender: function () {
			var me = this;

			setTimeout(function () {
				me.renderGrid();
			}, 1);
		},

		renderGrid: function () {
			var me = this;

			var setupValidation = Opf.Validate.setup;
			var addValidateRules = function (form) {
				Opf.Validate.addRules(form, {
					rules: {
						termFactory: {
							required: true
						},
						termMachTp: {
							required: true
						},
						brhNo: {
							required: true
						}
					}
				});
			};

			var grid = me.grid = App.Factory.createJqGrid({
				emptyrecords: '没有查询到相关的POS机',
				rsId: 'terminalsTypeDisplays',
				caption: terminalsLang._('terminalsTypeDisplays.txt'),
				actionsCol: {
				},
				nav: {
					view: {
						height: 420
					},

					add: {
						beforeShowForm: function (form) {

							var $selectSourceTermFactory = $(form).find('select[name="sourceTermFactory"]');
							var $brhNo = $(form).find('#brhNo').css('minWidth',200);
							$.ajax({
								type: 'GET',
								contentType: 'application/json',
								dataType: 'json',
								url: url._('terminals.mgr.options'),
								success: function (resp) {
									createOptions(resp);
								}
							});

							attatchChangeEvent($selectSourceTermFactory);


							//判断当前机构等级
							//如果是0级机构，则可以用select2选择一级机构
							if(Ctx.getBrhLevel() === 0){
								$brhNo.select2({
									placeholder: '选择机构',
									minimumInputLength: 1,
									ajax: {
										type: 'GET',
										url: url._('task.map.brh'),
										dataType: 'json',
										data: function (term) {
											return { kw: encodeURIComponent(term), upBrh: '000' };
										},
										results: function (data) { return { results: data }; }
									},
									initSelection: function () {},
									id: function (data) { return data.key; },
									formatResult: function(data){ return data.value; },
									formatSelection: function(data){ return data.value; }

								});
								$brhNo.on('change', function(){
									$(this).closest('form').find('label[for="brhNo"]').hide();
								});
							}

							//如果是1级机构，只能使用自身机构
							else if(Ctx.getBrhLevel() === 1){
								$brhNo.closest('td').html(' <div data-brhNo="'+ Ctx.getUser().get('brhCode') +'">'+ Ctx.getUser().get('brhName') +'</div>');
							}

							addValidateRules(form);
						},
						onclickSubmit: function (params, postdata) {
							var id,
								sourceTermFactory = $('select[name="sourceTermFactory"]').val(),
								sourceTermMachTp = $('select[name="sourceTermMachTp"]').val(),
								$brhNo = $('#brhNo');

							delete postdata['type'];
							delete postdata['sourceTermMachTp'];
							delete postdata['sourceTermFactory'];

							id = _.findWhere(arrResponse, {
								"termFactory": sourceTermFactory,
								"termMachType": sourceTermMachTp
							})["id"];
							postdata['termTypeId'] = id;
							//机构号  一级机构的机构号
							//如果当前机构是 一级机构 直接从 data-brhNo 取，否则从select2取
							postdata['brhNo'] = $brhNo.data('data-brhNo') || $brhNo.select2('data') && $brhNo.select2('data').key;
							//if(Ctx.getBrhLevel() === 1){
							//	postdata['brhNo'] = $brhNo.data('data-brhNo')
							//} else {
							//	postdata['brhNo'] = $brhNo.select2('data') && $brhNo.select2('data').id;
							//}
							return postdata;
						},
						beforeSubmit: setupValidation
					},

					edit: {
						beforeShowForm: function (form) {

							$(form).find('#tr_brhNo').remove();
							$(form).find('#tr_sourceTermFactory').remove();
							$(form).find('#tr_sourceTermMachTp').remove();

							addValidateRules(form);

						},
						onclickSubmit: function (params, postdata) {
							var selectId = Opf.Grid.getLastSelRowId(grid),
								rowData = grid._getRecordByRowId(selectId);
							postdata['id'] = rowData.id;
							return postdata;
						},

						beforeSubmit: setupValidation
					},
					//后台要求暂时隐藏 新增功能
					actions: {
						add: false
					}

				},
				gid: 'terminalsTypeDisplays',
				url: url._('terminals.terminaltypedisplays'),
				colNames: {
					id: 'id',
					brhNo: terminalsLang._('temrinals.display.branch.code'), //机构
					brhName: terminalsLang._('temrinals.display.branch.name'), //机构名称
					termMachTp: terminalsLang._('temrinals.display.mcht.show.name'),//终端型号显示名称
					sourceTermMachTp: terminalsLang._('temrinals.display.mcht.act.name'),//终端型号实际名称
					termFactory: terminalsLang._('temrinals.display.factory.show.name'),//厂商显示名称
					sourceTermFactory: terminalsLang._('temrinals.display.factory.act.name')//厂商实际名称
				},

				responsiveOptions: {
					hidden: {
						ss: [],
						xs: [],
						sm: [],
						md: [],
						ld: []
					}
				},

				colModel: [
					{name: 'id', index: 'id',editable: false, search: false, hidden: true },  //
					{name: 'brhNo', index: 'brhNo', editable: true, search: true, _searchType: 'string'},  //
					{name: 'brhName', index: 'brhName', editable: false, search: true, _searchType: 'string'},  //
					{name: 'sourceTermFactory', index: 'sourceTermFactory', editable: true, edittype: 'select', editoptions: {value: {}}, search:true, _searchType:'string'},  //
					{name: 'sourceTermMachTp', index: 'sourceTermMachTp', editable: true, edittype: 'select', editoptions: {value: {}}, search:true, stype:'select', searchoptions:{ sopt:['eq'], value: MCHTACTTYPE_MAP }},  //
					{name: 'termFactory', index: 'termFactory', editable: true, search: true, _searchType: 'string'},  //
					{name: 'termMachTp', index: 'termMachTp', editable: true, search: true, _searchType: 'string'}  //
				]

			});

		}
	});



	function attatchChangeEvent($selectSourceTermFactory){
		$selectSourceTermFactory.on('change', function(){
			console.log("change termfactory");
			createOptionsForsourceTermMachTp(arrResponse, $selectSourceTermFactory.val());
		});
	}

	function createOptions(resp){
		var arrActFactory = [];
		if (arrResponse.length === 0) {
			arrResponse = resp;
		}
		arrActFactory = _.uniq(_.pluck(resp,"termFactory"));
		_.each(arrActFactory,function(value){
			$("select[name='sourceTermFactory']").append('<option value="' + value + '">' + value + '</option>');
		});
		createOptionsForsourceTermMachTp(resp,arrActFactory[0]);
	}

	function createOptionsForsourceTermMachTp(arrResponse, termFactory){
		var arr = _.where(arrResponse, {'termFactory': termFactory});
		$("select[name='sourceTermMachTp']").empty();
		_.each(arr,function(item){
			$("select[name='sourceTermMachTp']").append('<option value="' + item['termMachType'] + '">' + item['termMachType'] + '</option>');
		});
	}

	return View;

});