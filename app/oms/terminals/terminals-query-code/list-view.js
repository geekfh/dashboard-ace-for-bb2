/**
 * Created by wupeiying on 2016/7/12.
 */
define([
	'App',
	'jquery.jqGrid'
], function (App) {
	var tableTpl = [
		'<div class="row">',
		'<div class="col-xs-12 jgrid-container">',
		'<table id="terminals-query-code-grid-table"></table>',
		'<div id="terminals-query-code-grid-pager" style="display: none;"></div>',
		'<div class="container-fluid">',
		'<p style="background-color: #EFF3F8; padding: 5px 0; text-align: center; font-size: 18px; font-weight: bold; font-family: \'Microsoft Yahei\';">升级码操作指引</div>',
		'<div class="row" style="margin-top: 30px; margin-bottom: 30px;">',
		'<div class="col-sm-6 col-lg-3"><img src="./assets/images/upgrade/step_1.jpg?_v=2" style="width: 100%; max-width: 540px; height: auto;" /></div>',
		'<div class="col-sm-6 col-lg-3"><img src="./assets/images/upgrade/step_2.jpg?_v=2" style="width: 100%; max-width: 540px; height: auto;" /></div>',
		'<div class="col-sm-6 col-lg-3"><img src="./assets/images/upgrade/step_3.jpg?_v=2" style="width: 100%; max-width: 540px; height: auto;" /></div>',
		'<div class="col-sm-6 col-lg-3"><img src="./assets/images/upgrade/step_4.jpg?_v=2" style="width: 100%; max-width: 540px; height: auto;" /></div>',
		'</div>',
		'<div class="row" style="padding-left: 2em; font-size: 16px;">',
		'<a href="http://api.iboxpay.com/h5/cashboxRecommendRegest/mc/mc_shengjishuakaqi.html" target="_blank" style="color: blue;">刷卡器升级操作指引</a>',
		'</div>',
		'</div>',
		'</div>',
		'</div>'
	].join('');

	// SN起止号段
	var SN_MAP = [
		// 013200
		{
			key: "013200",
			value: [
				//盒子总数994
				{
					start: "211406",
					end: "212400"
				},

				//盒子总数2322
				{
					start: "315101",
					end: "317421"
				},

				//盒子总数20000
				{
					start: "370100",
					end: "390099"
				}
			]
		},

		// 013600
		{
			key: "013600",
			value: [
				// 盒子总数100
				{
					start: "43600",
					end: "43699"
				},

				// 盒子总数3000
				{
					start: "93700",
					end: "96699"
				},

				// 盒子总数100000
				{
					start: "106700",
					end: "206699"
				},

				// 盒子总数1000
				{
					start: "206700",
					end: "207699"
				},

				// 盒子总数100000
				{
					start: "207750",
					end: "307749"
				},

				// 盒子总数1000
				{
					start: "307750",
					end: "308749"
				},

				// 盒子总数290000
				{
					start: "390200",
					end: "680199"
				},

				// 盒子总数100100
				{
					start: "680200",
					end: "780299"
				},

				// 盒子总数100000
				{
					start: "780300",
					end: "880299"
				}
			]
		},

		// 013610
		{
			key: "013610",
			value: [
				// 盒子总数400000
				{
					start: "000000",
					end: "399999"
				},

				// 盒子总数1000
				{
					start: "400000",
					end: "400999"
				}
			]
		},

		// 013620
		{
			key: "013620",
			value: [
				// 盒子总数1000
				{
					start: "000000",
					end: "000999"
				},

				// 盒子总数200000
				{
					start: "001000",
					end: "200999"
				}
			]
		}
	];

	// SN号是否合法
	var isValidSnNO = function(val) {
		var itemObj = {}, flag = false;
		for(var i=0; i<SN_MAP.length; i++){
			var sn_item = SN_MAP[i];
			var valReg = new RegExp("^("+sn_item.key+")(\\d+)$", "g");
			if(valReg.test(val)) {
				itemObj = _.extend({}, sn_item);
				itemObj.key = RegExp.$2;
			}
		}

		if(_.isArray(itemObj.value)) {
			var values = itemObj.value;
			for(var j=0; j<values.length; j++) {
				var value = values[j];

				var start = parseInt(value.start);
				var end = parseInt(value.end);
				var val = parseInt(itemObj.key);

				if(val>=start && val<=end){
					flag = true;
					break;
				}
			}
		}

		return flag;
	};

	return Marionette.ItemView.extend({
		tabId: 'menu.terminals.query.code',
		template: _.template(tableTpl),

		onRender: function () {
			var me = this;
			_.defer(function(){
				me.renderGrid();
			});
		},

		renderGrid: function () {
			var me = this;

			var grid = me.grid = App.Factory.createJqGrid({
				caption: "升级码获取",
				rsId: 'terminals.query.code',
				gid: 'terminals-query-code-grid',
				url: url._('terminals.terminalQueryCode'),
				filters: [{
					caption: '必填项',
					//canSearchAll: false,
					defaultRenderGrid: false,
					components: [
						{
							label: 'SN号',
							name: 'sn_No',
							options: {
								sopt: ['eq']
							}
						}, {
							label: '软件版本',
							name: 'version',
							options: {
								sopt: ['eq']
							}
						}, {
							label: '计数',
							name: 'counter',
							defaultValue: '00',
							options: {
								sopt: ['eq']
							}
						}
					],
					searchBtn: {
						text: '确定'
					},
					beforeSubmit: function(postdata) {
						var flag = false,
							msg = null,
							filters = JSON.parse(postdata.filters||"{}"),
							rules = filters.rules||[];

						if(rules.length<3) {
							msg = "所有获取项均为必填";

						} else if(!isValidSnNO(_.findWhere(rules, {field: "sn_No"}).data)) { //SN号
							msg = "不支持此SN号的升级码，请联系售后服务";

						} else {
							flag = true;
						}

						msg && Opf.alert(msg);

						return flag;
					}
				}],
				actionsCol: false,
				pager: false,
				nav: {
					actions: {
						add: false,
						search: false,
						refresh: true
					}
				},

				colNames: {
					id: "ID",
					//error: "错误信息",
					duk: "升级码 "
				},

				colModel: [
					{ name: 'id', sortable: false, hidden: true},
					//{ name: 'error' },
					{ name: 'duk', sortable: false }
				]
			});
		}
	});

});