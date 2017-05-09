/**
 * Created by zhuyimin on 2015/1/28.
 *
 * 服务对象管理列表 和 服务开通复核列表 的 抽象类
 */

/*
 * 服务对象管理
 * */
define([
	'tpl!app/oms/service/target-mgr/templates/targetMgr.tpl',

	'i18n!app/oms/common/nls/service',
	'tpl!app/oms/service/target-mgr/templates/selTargetTpl.tpl',
	'upload',
	'jquery.jqGrid',
	'bootstrap-datepicker'
], function (targetMgrTpl, serviceLang, selTargetTpl) {

	//var STATUS_MAP = {
	//	"1": "邀请",
	//	"0": "达标",
	//	"2": "已开通",
	//	"3": "停止",
	//	"4": "复核不通过",
	//	"5": "代理商推荐"
	//};
	var TARGETTYPE_MAP = {
		"1": "商户",
		"2": "机构"
	};
	var View = Marionette.ItemView.extend({
		tabId: '', //会用在 menu.js 里翻译



		template: targetMgrTpl,


		templateHelpers: function(){
			return {
				rsId : this.getOption('rsId')
			}
		},

		events: {},

		initialize: function (config) {
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
						xxx: {
							required: true

						}
					}
				});
			};

			var grid = me.grid = App.Factory.createJqGrid({
				emptyrecords: '没有查询到服务对象',
				rsId: me.getOption('rsId'),
				caption: serviceLang._(me.getOption('rsId')+'.txt'),
				actionsCol: {
					edit: false,
					del: false,
					view: false,
					canButtonRender: function (name, options, rowData) {
						return true;
					},
					extraButtons: []
				},
				nav: {
					view: {
						height: 420
					},
					//TODO 这是邀请 ？
					add: {
						beforeSubmit: setupValidation
					},
					actions: {
						add: me.getOption('enableAdd')
					}

				},
				gid: me.getOption('rsId'),
				url: url._(me.getOption('url')),
				colNames: {
					"registerId": "id",//服务开通表ID
					"serviceObjectId": serviceLang._("service.target.mgr.serviceObjectId"),//服务对象编号
					"name": serviceLang._("service.target.mgr.name"),//服务名称
					"type": serviceLang._("service.target.mgr.type"),//服务类型
					"targetType": serviceLang._("service.target.mgr.targetType"),//服务对象类型
					"status": serviceLang._("service.target.mgr.status"),//服务开通状态（邀请、达标、已开通、停止、复核）邀请：1， 达标：0， 已开通：2， 停止：3， 复核：4
					brhNo: '所属机构号',
					"openTime": serviceLang._("service.target.mgr.openTime"),//开通时间
					"closeTime": serviceLang._("service.target.mgr.closeTime")//结束时间
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
					{name: 'registerId', index: 'registerId',hidden:true},//服务开通表ID
					{name: 'serviceObjectId', index: 'serviceObjectId', search: true, _searchType: 'string'},//服务对象编号
					{name: 'name', index: 'name', search: true, _searchType: 'string'},//服务对象名称
					{name: 'type', index: 'type', search: true, _searchType: 'string'},//服务名称
					{name: 'targetType', index: 'targetType', formatter: me.targetTypeFormatter},//服务对象类型
					{name: 'status', index: 'status', formatter: _.bind(me.statusFormatter, me), search:true, stype:'select', searchoptions:{ sopt:['eq'], value: me.STATUS_MAP}},//服务开通状态
					{name: 'brhNo', hidden: true, viewable: false, search: true, _searchType: 'string'},
					{name: 'openTime', index: 'openTime', formatter: me.timeFormatter, search:true,searchoptions: {
						dataInit : function (elem) {
							$(elem).datepicker({autoclose: true,format: 'yyyymmdd'});
						},
						sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge']
					}},//开通时间
					{name: 'closeTime', index: 'closeTime', formatter: me.timeFormatter, search:true,searchoptions: {
						dataInit : function (elem) {
							$(elem).datepicker({autoclose: true,format: 'yyyymmdd'});
						},
						sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge']
					}}//结束时间
				],

				//实现批量操作
				//请参考 http://stackoverflow.com/questions/5259262/jqgrid-multiselect-and-disable-check-conditional

				multiselect: true,//Ctx.avail('serviceTargetMgr'),//TODO 这里放的是 批量操作的权限
				multiboxonly: false,//实现点击条目 叠加选择

				//这里实现禁止选中某些行
				loadComplete: _.bind(me.disableSelect, me),

				beforeSelectRow: function (rowid, e) {
					var cboxdisabled = me.grid.find('tr#' + rowid + '.jqgrow input.cbox:disabled');

					if (cboxdisabled.length === 0) {
						return true;
					}
					cboxdisabled.prop('checked', false); // 如果点击 操作栏，会在触发beforeSelctRow 之前 选中 checkbox，修复此问题
					cboxdisabled.closest('tr').removeClass('ui-state-highlight'); //去除选中高亮
					return false;
				},

				onSelectAll: function (aRowids, status) { // 只有选中当前页面的 rows
					if (status) { //true 为选中状态
						var cboxdisabled = me.grid.find('input.cbox:disabled'), selarrrow;
						cboxdisabled.prop('checked', false);
						cboxdisabled.closest('tr').removeClass('ui-state-highlight'); //去除选中高亮


						selarrrow = me.grid.find('input.cbox:checked')
							.closest('tr')
							.map(function () {
								return this.id;
							})
							.get(); // get()不带参数，调用 toArray() 返回数组
						//重新设置选中的 rowid
						me.grid[0].p.selarrrow = selarrrow;

					}

				}

			});
			me.generateImportBtn(grid);

			//批量操作
			me.generateBtns(grid,me.getOption('operation'));
		},
		generateImportBtn: function (grid) {

		},

		//某些条目是不能被选中的，由具体实现覆盖
		disableSelect: function(){

		},

		//批量开通、批量停止
		//config:{"open":{"text":"批量开通","buttonicon":"icon-ok-sign white"},"stop":{"text":"批量停止","buttonicon":"icon-remove-sign white"}}
		//
		generateBtns: function(grid,config){

			var
				me = this;

			_.each(config, function(prop, operation){

				if (!Ctx.avail(me.getOption('rsId')+ '.'+ operation)) {
					return;
				}
				setTimeout(function () {
					Opf.Grid.navButtonAdd(grid, {
						caption: "",
						id: 'serviceTargetMgr.'+ operation,
						name: 'serviceTargetMgr.'+ operation,
						title: prop.text,
						buttonicon: prop.buttonicon,
						position: "last",
						onClickButton: function () {
							//判断是否响应点击操作
							if(!me.canOperate(grid, operation)){
								return false;
							}


							var $dialog = Opf.Factory.createDialog(selectTpl(grid), {
								destroyOnClose: true,
								title: prop.text,
								autoOpen: true,
								width: 510,
								modal: true,
								buttons: [{
									type: 'submit',
									text: prop.text,
									click: function () {
										Opf.ajax({
											type: 'PUT',
											jsonData: me.getPostData(grid,operation),
											url: url._(me.getOption('operationUrl')),
											successMsg: '成功' + prop.text,
											success: function () {
												grid.trigger('reloadGrid', {current: true});
											},
											complete: function () {
												$dialog.dialog('close');
											}
										});
									}
								}, {
									type: 'cancel'
								}],
								create: function () {
								}
							});

							function selectTpl(grid) {
								//这里要判断是选中单个还是其他情况！
								//如果选中多个则不生成列表，但要生成一段说明文字
								var tpl,
									rowsData = me.getRowsData(grid,operation),
									hint = '<div class="operate-terminals-hint">是否确认'+ prop.text +'？</div>';

								if(rowsData.length !== 1){

									tpl = ['<div class="bat-operation">',
										'<div class="discription">你选择了',
										'<span class="term-amount">',
										rowsData.length,
										'</span>个服务对象',
										'</div>',
										'</div>'
									].join('');
								}

								//生成列表
								else{
									tpl = selTargetTpl({items: rowsData});
								}
								return (rowsData.length !== 1) ? $(tpl).append(hint) : $(tpl).prepend(hint);
							}

						}
					});

				}, 10);
			});
		},

		canOperate: function(grid,operation){

			return true;
		},

		getPostData: function(grid,operation){

		},

		getRowsData: function(grid,operation){

		},
		//可被覆盖
		STATUS_MAP : {
			"1": "邀请",
			"0": "达标",
			"2": "已开通",
			"3": "停止",
			"4": "复核不通过",
			"5": "代理商推荐"
		},

		statusFormatter: function(val){
			return this.STATUS_MAP[val] || "";
		},

		targetTypeFormatter: function(val){
			return TARGETTYPE_MAP[val] || "";
		},

		timeFormatter: function(val) {
			val || (val = "");
			//'$1年$2月$3日$4时$5分$6秒'
			return Opf.String.replaceFullDate(val.toString(), '$1年$2月$3日$4时$5分');
		}



	});

	return View;
});
