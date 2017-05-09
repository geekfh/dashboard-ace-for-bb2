define(['App',
	'tpl!app/oms/mcht/list/templates/table-ct.tpl',
	'i18n!app/oms/common/nls/mcht',
	'tpl!app/oms/mcht/list/templates/selectMcht.tpl',
	'tpl!app/oms/mcht/common/templates/bank.tpl',
	'tpl!app/oms/mcht/list/templates/stateFormTpl.tpl',
	'assets/scripts/fwk/factory/typeahead.factory',
	'app/oms/mcht/common/editBank',//修改银行卡的公共功能（商户列表和商户查询有用）
	'jquery.jqGrid',
	'bootstrap-datepicker',
	'moment.override',
	'common-ui',
	'jquery.validate',
	'jquery.autosize'
], function (App, tableCtTpl, mcmgrLang, selectMchtTpl, bankTpl, stateFormTpl) {

	var CARD_STATUS_MAP = {
		0: '无需拍卡',
		1: '已拍卡',
		2: '未拍卡'
	};
	var STATUS_MAP = {
		0: mcmgrLang._('MCHT.status.0'),
		1: mcmgrLang._('MCHT.status.1'),
		2: mcmgrLang._('MCHT.status.2'),
		3: mcmgrLang._('MCHT.status.3'),
		4: mcmgrLang._('MCHT.status.4'),
		5: mcmgrLang._('MCHT.status.5'),
		6: mcmgrLang._('MCHT.status.6')
	};
	var KIND_MAP = {
		'A1':mcmgrLang._('MCHT.kind.A1'),
		'A2':mcmgrLang._('MCHT.kind.A2'),
		'A3':mcmgrLang._('MCHT.kind.A3'),
		'F1': mcmgrLang._('MCHT.kind.F1'),
		'B1': mcmgrLang._('MCHT.kind.B1'),
		'B2': mcmgrLang._('MCHT.kind.B2'),
		'D1': mcmgrLang._('MCHT.kind.D1'),
		'E1': mcmgrLang._('MCHT.kind.E1'),
		'C1': '集团商户(总店)',//集团商户(门店)旧的数据（因S300那边改动，这边全部要改成他们一样的，逗！）
		'C2': '集团商户(门店)'//集团商户(总店)旧的数据
		// 'B3':mcmgrLang._('MCHT.kind.B3'),
		// 'C1':mcmgrLang._('MCHT.kind.C1'),
		// 'C2':mcmgrLang._('MCHT.kind.C2'),
		// 'C3':mcmgrLang._('MCHT.kind.C3')

	};
	var CERTIFICATECOUNTS_MAP = {
		'0': '营业执照',
		'1': '税务登记证',
		'2': '机构组织编号'
	};
	var MCHT_SOURCE_MAP = {
		'1': '开放注册',
		'2': '开通宝',
		'3': '平台录入',
		'4': '新开放注册',
		'5': '快捷商户自主注册'
	};
	var INVITESTATUS_MAP = {
		'0':'未邀请',
		'1':'已邀请',
		'2':'已达标',
		'5':'已签约',
		'3':'复核不通过',
		'4':'已关闭'
	};
	var MARK_COLOR_MAP = {
		'0': {image:'assets/images/mcht/T0invited.png',title:'已邀请'}, //已被邀请
		'1': {image:'assets/images/mcht/T0standard.png',title:'已达标'}, //通过
		'2': {image:'assets/images/mcht/T0fail.jpg',title:'复核不通过'}, //不通过
		'3': {image:'assets/images/mcht/T0close.png',title:'已关闭'}, //关闭
		'4': {image:'assets/images/mcht/T0contract.png',title:'已签约'} //签约
	};
	var MCHT_ISCOMARKETING = {
		'1': '是',
		'2': '否'
	};
	var SOSTATUS_MAP = {
		'0': '未开通',
		'1': '开通',
		'2': '关闭'
	};

	var WECHAT_ALIPAY_MAP = {
		"00": '未开通',
		"01": '已开通大商户',
		"10": '已开通特约商户',
		"11": '已开通特约商户'
	};
	var WHITE_CODE_TYPE_MAP = {
		"query": "0",
		"modify": "1"
	};
	App.module('MchtSysApp.List.View', function (View, App, Backbone, Marionette, $, _) {
		View.Mchts = Marionette.ItemView.extend({
			tabId: 'menu.mcht.user',
			template: tableCtTpl,
			events: {},
			onRender: function () {
				var me = this;
				_.defer(function(){
					me.renderGrid();
				});
			},
			showEditView: function (id) {
				/*var me = this, viewUrl;
                var isWildcard = true;
                if(isWildcard){
                    viewUrl = "app/oms/mcht/wildcard/edit/edit-view";
                } else {
                    viewUrl = "app/oms/mcht/edit/edit-view";
                }
				require([viewUrl], function (View) {
					//获取录入时的信息
					Opf.ajax({
						type: 'GET',
						url: url._('merchant', {
							id: id
						}),
						success: function (data) {
							console.log(data);
							var infoView = new View(data, id);

							infoView.render();

							bindBackBtnEvent(infoView, me.$el);

							App.getCurTabPaneEl().append(infoView.$el);

						}
					});
				});*/
                var me = this;
                App.maskCurTab();
                //获取录入时的信息
                Opf.ajax({
                    type: 'GET',
                    url: url._('merchant', { id: id }),
                    success: function (data) {
                        var viewUrl,
                            isWildcard = !!data.interMcht; //外卡独有标识"interMcht"
                        if(isWildcard){
                            viewUrl = "app/oms/mcht/wildcard/edit/edit-view";
                        } else {
                            viewUrl = "app/oms/mcht/edit/edit-view";
                        }
                        require([viewUrl], function (View) {

                            var infoView = new View(data, id);

                            infoView.render();

                            bindBackBtnEvent(infoView, me.$el);

                            App.getCurTabPaneEl().append(infoView.$el);
                        });
                    },
                    complete: function(){
                        App.unMaskCurTab();
                    }
                });
			},
			renderTip: function () {
				var tipTpl = [
					'<div class="search-tip">',
						'<div class="search-tip-arrow"></div>',
						'<span>点击此处可搜索商户信息</span>',
					'</div>'
				].join('');

				this.$el.find('.fieldset-innerwrap').eq(0).append(tipTpl);
			},
			renderGrid: function () {
				var me = this;
				var grid = me.grid = App.Factory.createJqGrid({
					rsId: 'mchtsgrid',
					caption: mcmgrLang._('mcht.txt'),
					filters: [
						{
							caption: '精准搜索',
							defaultRenderGrid: false,
							canSearchAll: true,
							isSearchRequired: true,
							components: [
								{
									label: '商户名称',
									name: 'name'
								}, {
									label: '商户号',
									name: 'code',
									inputmask: {
										integer: true
									},
									options: {
										sopt: ['eq']
									}
								}, {
									label: '商户手机号',
									name: 'userPhone',
									inputmask: {
										integer: true
									},
									options: {
										sopt: ['eq']
									}
								}
							],
							searchBtn: {
								text: '搜索'
							}
						}, {
							caption: '条件过滤',
							defaultRenderGrid: false,
							canSearchAll: true,
							canClearSearch: true,
							isSearchRequired: true,
							components: [
								{
									label: '签约机构名',
									name: 'branchName'
								}, {
									label: '签约机构号',
									name: 'brhCode',
									options: {
										sopt: ['eq', 'lk']
									},
									inputmask: {
										integer: true
									}
								}, {
									label: '拓展员姓名',
									name: 'expandName'
								},{
									label: '拓展员推荐码',
									name: 'expandinvitedcode',
									options: {
										sopt: ['eq']
									},
									inputmask: {
										integer: true
									}
								}, {
									label: '一级代理商',
									name: 'agency'
								}, {
									label: '状态',
									name: 'status',
									type: 'select',
									options: {
										sopt: ['eq'],
										value: STATUS_MAP
									}
								}, {
									label: '商户证件',
									name: 'certificateCounts',
									type: 'select2',
									options: {
										value: CERTIFICATECOUNTS_MAP,
										sopt: ['rlk'],
										select2Config: {
											width: 310,
											multiple: true // 想要多选的这里必须配置！
										},
										valueFormat: function (select2Data) {
											if(!select2Data.length){
												return false;
											}else{
												// 与后台协商的结果：如果什么都没有选择，传'_ _ _', 有选择的置为 1
												// 必须按照营业执照，税务登记证，机构组织编号 的顺序
												// 如果选择了第一个和第三个，则传 '1_1'
												var newVal = ['_','_','_']; 
												var selectList = _.pluck(select2Data, 'id');
												
												for(var i = 0; i < selectList.length; i++){
													newVal[selectList[i]] = '1';
												}

												return newVal.join('');
											}
										}
									}
								}, {
									label: '邀请状态',
									name: 'inviteStatus',
									type: 'select',
									options: {
										sopt: ['eq'],
										value: INVITESTATUS_MAP
									}
								}, {
									label: 'S0秒到开通状态',
									name: 'mchtServiceS0Status',
									type: 'select',
									options: {
										sopt: ['eq'],
										value: SOSTATUS_MAP
									}
								}
							],
							searchBtn: {
								text: '过滤'
							}
						}
					],
					actionsCol: {
						width: 100,
						canButtonRender: function (name, options, rowData) {
							// 0－正常,  1－商户新增保存,  2－提交待审核,  3－商户停用,  4－商户注销
							var status = rowData.status;

							// 未开通过S0业务的商户不应该能配置S0额度等级
							if(name === "updateS0" && status != "0") {
								return false;
							}

							if (status == 1 || status == 2) {// 新增/待审 只能查看
								return name == 'view';

							} else if (status == 5 && (name === 'changestate' || name === 'edit')) {
								return false;

							} else {
								return true;
							}

							if(name === "changePhotoCardState" && rowData.cardStatus == "0"){
								return false;
							}

						},
						extraButtons: [
							{
								name: 'editBank', icon: 'icon-credit-card', title: '修改银行卡',
								click: function (name, opts, rowData){
									editView.onEditBankDialog(me.grid, rowData);
								}
							},
							{
								name: 'changestate', icon: 'icon-opf-state-change', title: '状态变更',
								click: function (name, opts, rowData) {
									showChangeStateDialog(me, rowData);
								}
							},
							/*{
								name: 'editCoMarketing', icon: 'icon-edit', title: '更改联合营销商户',
								click: function (name, opts, rowData) {
									showEditCoMarketingDialog(me, rowData);
								}
							},*/
							{
								name: 'IsBlackList', icon: 'icon-ban-circle red', title: '已加入进件黑名单'
							},
							{
								name: 'NoBlackList', icon: 'icon-ban-circle grey', title: '未加入进件黑名单',
								click: function (name, opts, rowData) {
									showEditIsInBlackListDialog(me, rowData);
								}
							},
							{
								name: 'updateS0', icon: 'image-icon-mcht-update-s0', title: 'S0服务',
								click: function (name, opts, rowData) {
									showUpdateS0Dialog(me, rowData);
								}
							},
							{
								name: 'updateT1', icon: 'icon-yen red', title: '修改额度等级',
								click: function(name, opts, rowData){
									showUpdateT1Dialog(me, rowData);
								}
							},
							{
								name: 'viewWAState', icon: 'icon-info-sign', title: '微信、支付宝服务开通状态',
								click: function(name, opts, rowData){
									showViewWPStateDialog(me, rowData);
								}
							},
							{
								name:'whiteBars', icon: 'icon-key', title: '白条开关',
								click: function(name, opts, rowData){
									showWhiteBarsDialog(me, rowData);
								}
							},
							{
								name: 'changeStateView', icon: 'icon-zoom-in orange2', title: '查看状态变更记录',
								click: function (name, opts, rowData){
									require(['app/oms/mcht/common/changeStateView/list-view'], function(changeStateView){
										var csView = new changeStateView({mchtId: rowData.id, url: 'mcht.changeStateView'}).render();
										csView.showDialog(changeStateView);
										csView.$el.on('reloadParentGrid',function(){
											me.grid.trigger('reloadGrid');
										});
									});
								}
							},
							{
								name:'changePhotoCardState', title: '拍卡状态变更', caption: '拍卡状态变更',
								click: function(name, opts, rowData){
									showChangePhotoCardStateDialog(me, rowData);
								}
							},
							{
								name:'changeMchtType', title: '直联商户配置', caption: '直联商户配置',
								click: function(name, opts, rowData){
									showChangeMchtTypeDialog(me, rowData);
								}
							}
						]
					},
					nav: {
						search: {
							onSearch: function() {
								var $grid = $(this), postData = $grid.jqGrid('getGridParam', 'postData');
								var filters = JSON.parse(postData.filters), len = filters.rules.length;

								if(len<1) {
									Opf.alert({
										title: "搜索提示",
										message: "请至少输入 1 项查询条件"
									});
								}

								return !!len;
							}
						},
						actions: {
							editfunc: function (id) {
								me.showEditView(id);
								me.$el.hide();
							},
							addfunc: function () {
								App.trigger('mcht:add');
							},
							viewfunc: function (id) {
								App.trigger("mcht:show", id);//商户id
							}
						}
					},
					gid: 'mchts-grid',//innerly get corresponding ct '#mchts-grid-table' '#mchts-grid-pager'
					url: url._('merchant'),
					colNames: {
						id: '',
						mchtName: mcmgrLang._('MCHT.mchtName'/*'mchtName'*/),
						kind: mcmgrLang._('MCHT.kind'/*'kind'*/),
						certificateCounts: '商户证件数',
						mchtNo: mcmgrLang._('MCHT.mchtNo'/*'mchtNo'*/),
						status: mcmgrLang._('MCHT.status'/*'status'*/),
						oneAgent: mcmgrLang._('MCHT.oneAgent'/*'oneAgent'*/),
						branchName: mcmgrLang._('MCHT.branchName'/*'branchName'*/),
						brhCode: mcmgrLang._('MCHT.brhCode'),  // 所属机构编号
						expandName: mcmgrLang._('MCHT.expandName'/*'expandName'*/),
						expandinvitedcode: '拓展员推荐码',
						userName: mcmgrLang._('MCHT.userName'/*'userName'*/),
						phone: mcmgrLang._('MCHT.phone'/*'phone'*/),
						// mccName         : mcmgrLang._('MCHT.mccName'),
						// regionName      : mcmgrLang._('MCHT.regionName'/*'regionName'*/),
						// rate:       '扣率',
						discName: mcmgrLang._('MCHT.discName'/*'discName'*/),
						mchtSource: '商户来源',
						registeDate: mcmgrLang._('MCHT.registeDate'),//商户录入时间
						finalVertifyDate: mcmgrLang._('MCHT.finalVertifyDate'),//终审通过时间

						inviteStatus: mcmgrLang._('MCHT.inviteStatus'),//商户邀请状态  0-未邀请 1-已邀请

						//新增搜索功能，前端不需要显示，但是需要作为搜索条件传到后台来搜索
						//
						userPhone: mcmgrLang._('MCHT.userPhone'),  // 联系人手机号码
						regDate: mcmgrLang._('MCHT.regDate'),  // 申请日期
						cardNo: mcmgrLang._('MCHT.cardNo'),  //联系人证件号码
						inviteMark: mcmgrLang._('MCHT.inviteMark'), //邀请状态标志 未被邀请 已被邀请 邀请通过 邀请不通过
						mchtServiceS0Status: 'S0秒到开通状态',
						isCoMarketing: '是否联合营销商户',
						isInBlackList: '是否在黑名单中',
						maxDeviceNum: '终端数量'
					},
					//responsiveOptions: {
					//	hidden: {
					//		ss: ['kind', 'branchName', 'expandName', 'userName', 'phone', 'mccName', 'regionName', 'discName', 'userPhone', 'regDate', 'cardNo', 'registeDate', 'finalVertifyDate', 'rate', 'mchtSource'],
					//		xs: ['kind', 'branchName', 'expandName', 'userName', 'phone', 'mccName', 'regionName', 'discName', 'userPhone', 'regDate', 'cardNo', 'registeDate', 'finalVertifyDate', 'rate', 'mchtSource'],
					//		sm: ['kind', 'expandName', 'phone', 'mccName', 'regionName', 'discName', 'userPhone', 'regDate', 'cardNo', 'registeDate', 'finalVertifyDate', 'rate', 'mchtSource'],
					//		md: ['phone', 'mccName', 'regionName', 'discName', 'userPhone', 'regDate', 'cardNo', 'registeDate', 'finalVertifyDate', 'rate', 'mchtSource'],
					//		ld: []
					//	}
					//},
					colModel: [
						{name: 'id', index: 'id', editable: false, hidden: true},
						{
							name: 'mchtName', index: 'name', search: true, editable: true,
							_searchType: 'string', formatter: mchtNameFormatter
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
							name: 'certificateCounts', index: 'certificateCounts', search: true, hidden: true,
							formatter: CFCountsFormatter,
							stype: 'select',
							searchoptions: {
								sopt: ['eq','ne'],
								value: CERTIFICATECOUNTS_MAP
							}
						},
						{
							name: 'mchtNo', index: 'code', search: true, editable: true,
							width: 130, fixed: true,
							searchoptions: {
								sopt: ['eq']
							}
						},
						{
							name: 'status', index: 'status', search: true, editable: true,
							formatter: statusFormatter,
							stype: 'select',
							searchoptions: {
								sopt: ['eq'],
								value: STATUS_MAP
							},
							edittype: 'select',
							editoptions: {
								value: STATUS_MAP
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
						{name: 'phone', index: 'phone', search: false, editable: true, hidden: true},
						// {name:         'mccName', index:         'mccName', search:false,editable: true},
						// {name:      'regionName', index:      'regionName', search:false,editable: true},
						// {name:      'rate',       index:      'rate',       search:false, editable: true},
						{name: 'discName', index: 'discName', search: false, editable: true},
						{
							name: 'mchtSource',
							index: 'mchtSource',
							search: true,
							editable: true,
							formatter: mchtSourceFormatter,
							stype: 'select',
							searchoptions: {
								sopt: ['eq', 'ne'],
								value: MCHT_SOURCE_MAP
							}

						},
						{
							name: 'registeDate',
							index: 'registeDate',
							search: false,
							editable: true,
							formatter: timeFormatter
						},
						{
							name: 'inviteStatus',
							index: 'inviteStatus',
							hidden: true,
							search: true,
							editable: false,
							formatter: inviteStatusFormatter,
							stype: 'select',
							searchoptions: {
								sopt: ['eq'],
								value: INVITESTATUS_MAP
							}
						},
						{
							name: 'finalVertifyDate',
							index: 'finalVertifyDate',
							search: false,
							editable: true,
							formatter: timeFormatter
						},


						//新增搜索功能，前端不需要显示，但是需要作为搜索条件传到后台来搜索
						{
							name: 'userPhone',
							index: 'userPhone',
							search: true,
							editable: false,
							viewable: false,
							hidden: true,
							searchoptions: {
								sopt: ['eq']
							}
						},
						{
							name: 'regDate',
							index: 'regDate',
							search: true,
							editable: false,
							viewable: false,
							hidden: true,
							searchoptions: {
								dataInit: function (elem) {
									$(elem).datepicker({autoclose: true, format: 'yyyymmdd'});
								},
								sopt: ['eq', 'lt', 'gt']
							}
						},
						{
							name: 'cardNo',
							index: 'cardNo',
							search: false,
							editable: false,
							viewable: false,
							hidden: true,
							_searchType: 'string'
						},
						//cellattr 用法
						//http://www.trirand.com/jqgridwiki/doku.php?id=wiki:colmodel_options&s[]=cellattr
						//http://wangxiao5530.iteye.com/blog/1886450
						{name: 'inviteMark', index: 'inviteMark', editable: false, search: false, viewable: false, formatter: inviteMarkFormatter, cellattr: setCellBG },
						{name: 'mchtServiceS0Status', index: 'mchtServiceS0Status', editable: false, search: false, viewable: false, formatter: mchtServiceS0StatusFormatter },
						{name: 'isCoMarketing', index: 'isCoMarketing', editable: false, hidden: true,
							formatter: iscomarketingFormatter,
							stype: 'select',
							searchoptions: {
								sopt: ['eq'],
								value: MCHT_ISCOMARKETING
							},
							edittype: 'select',
							editoptions: {
								value: MCHT_ISCOMARKETING
							}
						},
						{name: 'isInBlackList', index: 'isInBlackList', hidden: true },//是否在黑名单中
						{name: 'maxDeviceNum', index: 'maxDeviceNum', hidden: true }
					],
					//暂时把邀请的功能加在 商户列表里
					multiselect: Ctx.avail('menu.mcht.inviteMcht'),
					multiboxonly: false,//实现点击条目 叠加选择
					loadComplete: function (data) {

						// 这里要保护一下，如果没有请求数据，me.grid 为 undefined
						if(me.grid && data.content){
							//第一次加载隐藏黑名单按钮
							me.grid.find('a[name="IsBlackList"]').hide();
							me.grid.find('a[name="NoBlackList"]').hide();

							var rows = me.grid.find('.ui-widget-content');
							for (var i = 0; i < data.content.length; i++) {
								$('input.cbox', rows[i])
									.prop('disabled', cannotCheck(data.content[i]))
									.prop('checked', false);
								$(rows[i]).removeClass('ui-state-highlight');
							}
							me.grid[0].p.selarrrow = []; //bug #3454

						}
						setTimeout(function () {
							if(!me.$el.find('.search-tip').length){
								me.renderTip();
							}
						}, 300);

						//不能选择的条件： 审核通过的状态不为 正常商户，或商户已被邀请过/达标/关闭，或操作人不是 代理商
						function cannotCheck(item){
							if(item.isInBlackList){
								if(item.isInBlackList == 1){//已加入黑名单
									me.grid.find('#IsBlackList_' + item.id).show();
								}
								else{//未加入黑名单
									me.grid.find('#NoBlackList_' + item.id).show();
								}
							}
							return item.status !== "0" || ("124".indexOf(item.inviteStatus) > -1) || Ctx.getBrhLevel() < 2;
						}
					},

					beforeSelectRow: function(rowid, e){
						var cboxdisabled = me.grid.find('tr#'+ rowid +'.jqgrow input.cbox:disabled');

						if (cboxdisabled.length === 0) {
							return true;
						}
						cboxdisabled.prop('checked', false); // 如果点击 操作栏，会在触发beforeSelctRow 之前 选中 checkbox，修复此问题
						cboxdisabled.closest('tr').removeClass('ui-state-highlight'); //去除选中高亮
						return false;
					},

					onSelectAll: function (aRowids, status) { // 只有选中当前页面的 rows
						if(status){ //true 为选中状态
							var cboxdisabled = me.grid.find('input.cbox:disabled'), selarrrow;
							cboxdisabled.prop('checked', false);
							cboxdisabled.closest('tr').removeClass('ui-state-highlight'); //去除选中高亮


							selarrrow = me.grid.find('input.cbox:checked')
								.closest('tr')
								.map(function(){
									return this.id;
								})
								.get(); // get()不带参数，调用 toArray() 返回数组
							//重新设置选中的 rowid
							me.grid[0].p.selarrrow = selarrrow;

						}
					}
				});

				me.generateInviteBtn(grid);

			},
			generateInviteBtn: function (grid) {
				if (!Ctx.avail('menu.mcht.inviteMcht')) {
					return;
				}
				Opf.Grid.navButtonAdd(grid, {
					caption: "",
					id: "inviteMcht",
					name: "inviteMcht",
					title: '邀请',
					buttonicon: "icon-star white",
					position: "last",
					onClickButton: function () {
						inviteDialog(grid);
					}
				});
				$("#importInformation").hover(function () {
					$(".icon-star").addClass("icon-star-hover");
				}, function () {
					$(".icon-star").removeClass("icon-star-hover");
				});
			}

		});

	});

	function inviteDialog(grid) {
		if (grid.find('input.cbox:checked').length === 0) {
			return false;
		}
		var rowsData = _.map(grid.jqGrid('getGridParam', 'selarrrow'), function(id){ return grid.jqGrid('getRowData', id);});

		var $dialog = Opf.Factory.createDialog(selectTpl(), {
			destroyOnClose: true,
			title: '邀请选中商户',
			autoOpen: true,
			width: 510,
			modal: true,
			buttons: [{
				type: 'submit',
				text: '邀请',
				click: function () {
					Opf.ajax({
						type: 'POST',
						jsonData: {
							id: getBoxNo(rowsData)
						},
						url: url._('invite.mcht'),
						successMsg: '成功邀请商户',
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
			create: function() {
				$(this).find('.operation-msg').on('click',function(){
					$dialog.find('.error-msg').hide();
				});
			}
		});

		function selectTpl(){
			return selectMchtTpl({items:rowsData});
		}
		function getBoxNo(rowDataArray){
			return _.map(rowDataArray, function(rowData){
				return rowData.mchtNo;
			});
		}

	}

	function showEditIsInBlackListDialog(me, rowData){
		var titleName = '';
		if(rowData.isInBlackList == 1){
			titleName = '是否确认将商户取消进件黑名单？';
		}
		else if (rowData.isInBlackList == 0){
			titleName = '是否确认将商户加入进件黑名单？';
		}
		else{
			return;
		}
		Opf.confirm(titleName, function (result) {
			if (result) {
				Opf.ajax({
					type: 'GET',
					url: url._('merchant.show', {id: rowData.id}),
					success: function (res) {
						Opf.ajax({
							type: 'PUT',
							jsonData: {
								mchtNo: res.mcht.mchtNo,		//商户编号
								phoneNo: res.mcht.phone, 	//手机号码
								idNo: res.mcht.cardNo,		//身份证号码
								licenceNo: res.mcht.licNo,	//营业执照号码
								orgCode: res.mcht.orgCode,		//组织机构证号
								bankCardNo: res.mcht.accountNo	//收款银行号卡号
							},
							url: url._('mcht.isInBlackList.edit'),
							successMsg: '修改成功',
							success: function () {
								me.grid.trigger('reloadGrid', {current: true});
							}
						});
					}
				});
			}
		});
	}

	/*function showEditCoMarketingDialog(me, rowData){

		var html = [
             '<div style="padding: 20px 0 0 40px;">',
                 '是否联合营销商户:&nbsp;&nbsp;&nbsp;&nbsp;',
                 '<select role="select" name="state" class="FormElement ui-widget-content ui-corner-all" style="width: 80px;">',
                     '<option value="1">是</option>',
                     '<option value="2">否</option>',
                 '</select>',
             '</div>'
		].join('');

		var $dialog = Opf.Factory.createDialog(html, {
			destroyOnClose: true,
			title: '更改联合商户',
			autoOpen: true,
			width: 300,
			height: 170,
			modal: true,
			buttons: [{
				type: 'submit',
				click: function () {
					var $state = $(this).find('[name="state"]');
					var oldState = rowData.isCoMarketing;
					var newState = $state.val();
					var selSateTxt = $state.find('option:selected').text();
					if (oldState != newState) {
						Opf.confirm('您确定更改联合营销商户为 "' + selSateTxt + '" 吗？<br>', function (result) {
							if (result) {
								//TODO block target
								Opf.ajax({
									type: 'PUT',
									jsonData: {
										oldStatus: oldState,
										newStatus: newState
									},
									url: url._('mcht.isCoMarketing', {id: rowData.id}),
									successMsg: '修改成功',
									success: function () {
										me.grid.trigger('reloadGrid', {current: true});
									},
									complete: function () {
										$dialog.dialog('close');
									}
								});
							}
						});
					} else {
						$(this).dialog('close');
					}
				}
			}, {
				type: 'cancel'
			}],
			create: function () {
				$(this).find('[name="state"]').val(rowData.isCoMarketing);
			}
		});

	}*/

	function showChangeMchtTypeDialog(me, rowData){
		//  /api/mcht/merchants/updateMchtType/{id}   0-未开通，1-已开通
		var STR_MCHTTYPE = {
			0: '未开通',
			1: '已开通'
		};
		//当前类型
		var mtype = STR_MCHTTYPE[rowData.mchtType] || '';

		//判断新的要修改的类型
		var updateMchtType = rowData.mchtType == 0 ? 1 : 0;

		Opf.confirm('当前状态是' + mtype + '，确定更改为' + STR_MCHTTYPE[updateMchtType] + '吗？', function (result) {
			if (result) {
				Opf.ajax({
					type: 'PUT',
					jsonData: {
						mchtType: updateMchtType
					},
					url: url._('mcht.updateMchtType', {id: rowData.id}),
					success: function () {
						Opf.Toast.success('更改成功');
						me.grid.trigger('reloadGrid', {current: true});
					}
				});
			}
		});
	}

	function showChangePhotoCardStateDialog(me, rowData){
		var getCurStatus = (function(){
			var curStatus;
			if(!!curStatus){
				return curStatus;
			}
			Opf.ajax({
				url: url._('mcht.serachTCStatus', {id: rowData.id}),      //商户id
				type: 'GET',
				async: false
			}).success(function(res){
				if(typeof res === "number"){
					curStatus = res
				}
			});
			return curStatus;
		})();
		var html = [
			'<form onsubmit="return false;">' ,
			'<table width="100%" cellspacing="0" cellpadding="0" border="0">' ,
				'<tbody>',
				'<tr class="FormData"><td class="CaptionTD">当前拍卡状态：</td><td class="DataTD">&nbsp;<span name="curStatus"></span></td> </tr>',
				'<tr class="FormData">' ,
					'<td class="CaptionTD">拍卡状态：</td>' ,
					'<td class="DataTD">&nbsp;' ,
					'<select role="select" name="status">' ,
					'<option value="0">无需拍卡</option>' ,
					'<option value="1">已拍卡</option>' ,
					'<option value="2">未拍卡</option>' ,
				'</select></td></tr>',
				'<tr class="FormData"><td class="CaptionTD">备注：</td><td class="DataTD">&nbsp; <textarea placeholder="状态变更原因，必须填" cols="30" rows="6" name="remark"></textarea></td></tr>',
			'</tbody></table></form>'
		].join('');
		var $html = $(html);
		Opf.Validate.addRules($html, {
			rules:{
				status: 'required',
				remark: 'required'
			}
		});
		var $dialog = Opf.Factory.createDialog($html, {
			title: '商户拍卡状态变更',
			width: '500',
			height: '350',
			modal: true,
			buttons: [
				{
					type: 'submit',
					click: function(){
						if($(this).validate().form()){
							var params = {
								status:$(this).find('[name="status"]').val(),
								remark:$(this).find('[name="remark"]').val()
							};
							Opf.ajax({
								url: url._('mcht.updateTCStatus', {id: rowData.id}),
								type: 'PUT',
								data: params
							}).success(function(res){
								Opf.Toast.success(res.msg || '商户拍卡状态变更成功！')
							});
						}
					}
				},
				{
					type: 'cancel'
				}
			],
			create: function(){
				$(this).find('[name="curStatus"]').text(CARD_STATUS_MAP[getCurStatus]);
			}
		})

	}

	function showUpdateS0Dialog(me, rowData){
		var html = [
			'<form onsubmit="return false;" >',
                '<table width="100%" cellspacing="0" cellpadding="0" border="0">',
                    '<tbody>',
                        '<tr class="FormData">',
                            '<td class="CaptionTD" style="padding-right:10px;">S0秒到开关:</td>',
                            '<td class="DataTD">&nbsp;',
                                '<select role="select" name="s0State" class="FormElement ui-widget-content ui-corner-all">',
                                    '<option value="0">关闭</option>',
                                    '<option value="1">打开</option>',
                                '</select>',
                            '</td>',
                        '</tr>',
                        '<tr class="FormData">',
                            '<td class="CaptionTD" style="padding-right:10px;">S0额度等级:</td>',
                            '<td class="DataTD">&nbsp;',
                                '<input name="s0StateRemark" type="text" />',
                            '</td>',
                        '</tr>',
                    '</tbody>',
                '</table>',
			'</form>'
		].join('');

		var $dialog = Opf.Factory.createDialog(html, {
			destroyOnClose: true,
			title: '修改S0服务',
			autoOpen: true,
			width: Opf.Config._('ui', 'mcht.grid.changestate.form.width'),
			height: Opf.Config._('ui', 'mcht.grid.changestate.form.height'),
			modal: true,
			buttons: [{
				type: 'submit',
				click: function () {
					var $s0State = $(this).find('[name="s0State"]');
					var oldS0State = rowData.mchtServiceS0Status;
					var newS0Sate = $s0State.find('option:selected').val();
					var S0Remark = $(this).find('[name="s0StateRemark"]').val();

                    var addConfirmMessage = "";

					if (oldS0State != newS0Sate) {
						addConfirmMessage = '您确定执行以下操作吗？<br>S0秒到开关为 "' + $s0State.find('option:selected').text() + '" <br>';
                    }

                    Opf.confirm(addConfirmMessage||"您确定要修改S0服务吗？", function (result) {
                        if (result) {
                            Opf.ajax({
                                type: 'PUT',
                                jsonData: {
                                    newS0Status:newS0Sate,
                                    mchtS0Rank: S0Remark
                                },
                                successMsg: '修改S0服务成功',
                                url: url._('mcht.updateS0.out', {id: rowData.id}),
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
			}, {
				type: 'cancel'
			}],
			create: function () {
				$(this).find('[name="s0State"]').val(rowData.mchtServiceS0Status);
			}
		});
	}

	function showWhiteBarsDialog(me, rowData){
		var html = [
			'<form onsubmit="return false;" >',
			'<table width="100%" cellspacing="0" cellpadding="0" border="0">',
			'<tbody>',
			'<tr class="FormData">',
			'<td class="CaptionTD" style="padding-right:10px;">白条开关:</td>',
			'<td class="DataTD">&nbsp;',
			'<select role="select" name="whiteBarsState" class="FormElement ui-widget-content ui-corner-all">',
			'<option value="0">关闭</option>',
			'<option value="1">打开</option>',
			'</select>',
			'</td>',
			'</tr>',
			'</tbody>',
			'</table>',
			'</form>'
		].join('');

		App.maskCurTab();
		Opf.ajax({
			type: 'PUT',
			jsonData: {
				type: WHITE_CODE_TYPE_MAP['query']
			},
			url: url._('mcht.updateMchtIOU', {id: rowData.id}),
			success: function (data) {
				var $dialog = Opf.Factory.createDialog(html, {
					destroyOnClose: true,
					title: '白条开关',
					autoOpen: true,
					width: Opf.Config._('ui', 'mcht.grid.changestate.form.width'),
					height: Opf.Config._('ui', 'mcht.grid.changestate.form.height'),
					modal: true,
					buttons: [{
						type: 'submit',
						click: function () {
							var $whiteBarsState = $(this).find('[name="whiteBarsState"]');
							var oldWhiteBarsState = rowData.mchtIOUStatus;
							var newWhiteBarsState = $whiteBarsState.find('option:selected').val();

							var addConfirmMessage = "";

							if (oldWhiteBarsState != newWhiteBarsState) {
								addConfirmMessage = '您确定执行以下操作吗？<br>白条开关为 "' + $whiteBarsState.find('option:selected').text() + '" <br>';
							}

							Opf.confirm(addConfirmMessage||"您确定要修改白条开关吗？", function (result) {
								if (result) {
									Opf.ajax({
										type: 'PUT',
										jsonData: {
											type: WHITE_CODE_TYPE_MAP['modify'],
											mchtIOUStatus:newWhiteBarsState
										},
										successMsg: '修改白条开关成功',
										url: url._('mcht.updateMchtIOU', {id: rowData.id}),
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
					}, {
						type: 'cancel'
					}],
					create: function () {
						$(this).find('[name="whiteBarsState"]').val(data);
					}
				});
			},
			complete: function(){
				App.unMaskCurTab();
			}
		});



	}

	function showViewWPStateDialog(me, rowData){
		var html = [
			'<form onsubmit="return false;">',
			'<table width="100%" cellspacing="0" cellpadding="0" border="0">',
			'<tbody>',
			'<tr class="FormData">',
			'<td class="CaptionTD col-md-4" style="padding-right:10px;"><label style="display: inline-block">微信支付:</label></td>',
			'<td class="DataTD col-md-8">&nbsp;<label name="weChatStatus" type="text" style="display: inline-block"/></td>',
			'</tr>',
			'<tr class="FormData">',
			'<td class="CaptionTD  col-md-4" style="padding-right:10px;"><label style="display: inline-block">支付宝支付:</label></td>',
			'<td class="DataTD col-md-8">&nbsp;<label name="alipayStatus" type="text" style="display: inline-block"/></td>',
			'</tr>',
			'</tbody>',
			'</table>',
			'</form>'
		].join('');
		var $dialog = Opf.Factory.createDialog(html, {
			destroyOnClose:true,
			title:'查看微信支付宝开通状态',
			autoOpen:true,
			width:Opf.Config._('ui', 'mcht.grid.changestate.form.width'),
			height:Opf.Config._('ui', 'mcht.grid.changestate.form.height'),
			modal:true,
			buttons:[{
				type: 'cancel'
			}],
			create: function() {
				var $me = $(this);
				var mchtNo = rowData.mchtNo;
				var filters = {"groupOp":"AND","rules":[{"field":"mchtNo","op":"eq","data":mchtNo}]};
				var submitData = 'filters='+ encodeURIComponent(JSON.stringify(filters));
				Opf.ajax({
					type: 'GET',
					url: url._('mcht.online.showservice'),
					jsonData: submitData,
					success: function(resps){
						/*业务规则
						 *按商户号查询路由配置表，如果能匹配到具体记录，则按以下规则判断，显示微信、支付宝的服务开通状态：
						 *威富通（慧收银）：微信、支付宝同时开通大商户
						 *天津微信：开通微信大商户
						 *厦门民生：开通支付宝大商户
						 *飞付支付宝/飞付支付宝A/飞付支付宝B：开通支付宝特约商户
						 * 微信/微信虚拟通道A/微信虚拟通道B：开通微信特约商户
						 * 补充：民生微信（mspa）：开通微信大商户
						 *       民生支付宝（mspb）：开通支付宝大商户


						 *优先级规则：
						 *如果在以上通道查不到商户号，则状态显示为未开通
						 *如果同时开通了特约商户、大商户，则状态显示为开通特约商户

						 *{value: "xywx", name: "天津兴业微信"}
						 *{value: "wftz", name: "威富通支付宝"}
						 *{value: "wftw", name: "威富通微信"}
						 *{value: "wcht", name: "微信"}
						 *{value: "wchb", name: "微信虚拟通道b"}
						 *{value: "wcha", name: "微信虚拟通道"}
						 *{value: "mszf", name: "厦门民生支付宝"}
						*/
						var weChat = "00", alipay = "00", weChatStatus, alipayStatus;
						if(resps && resps.length){
							_.each(resps, function(resp){
								if(resp.value == "wftw" || resp.value == "xywx" || resp.value == "mspa"){
									weChat = weChat.substring(0, 1) + "1";
								}
								else if(resp.value == "wftz" || resp.value == "mszf" || resp.value == "mspb"){
									alipay = alipay.substring(0, 1) + "1";
								}
								else if(resp.value == "flpy" || resp.value == "flpa" || resp.value == "flpb"){
									alipay = "1" + alipay.substring(1, 2);
								}
								else if(resp.value == "wcht" || resp.value == "wcha" || resp.value == "wchb"){
									weChat = "1" + weChat.substring(1, 2);
								}
							});
						}
						weChatStatus = WECHAT_ALIPAY_MAP[weChat];
						alipayStatus = WECHAT_ALIPAY_MAP[alipay];
						$me.find('[name="weChatStatus"]').text(weChatStatus);
						$me.find('[name="alipayStatus"]').text(alipayStatus);
					}
				});
			}
		})
	}

	function showUpdateT1Dialog(me, rowData){
		var html = [
			'<form onsubmit="return false;">',
			'<table width="100%" cellspacing="0" cellpadding="0" border="0">',
			'<tbody>',
			'<tr class="FormData">',
			'<td class="CaptionTD" style="padding-right:10px;">T1额度等级:</td>',
			'<td class="DataTD">&nbsp;<input name="t1MchtRank" type="text"/></td>',
			'</tr>',
			'</tbody>',
			'</table>',
			'</form>'
		].join('');
		var $dialog = Opf.Factory.createDialog(html, {
			destroyOnClose:true,
			title:'修改额度等级',
			autoOpen:true,
			width:Opf.Config._('ui', 'mcht.grid.changestate.form.width'),
			height:Opf.Config._('ui', 'mcht.grid.changestate.form.height'),
			modal:true,
			buttons:[{
				type:'submit',
				click:function(){
					var mchtRank = $(this).find('[name="t1MchtRank"]').val();
					if(!mchtRank){
						Opf.alert("请填写额度等级");
						return false;
					}
					Opf.confirm("您确定要修改T1的额度等级吗？", function(result){
						if(result){
							Opf.ajax({
								type:'PUT',
								jsonData:{
									mchtRank:mchtRank
								},
								successMsg:'修改额度等级成功',
								url: url._('mcht.updateT1.in', {id:rowData.id}),
								success: function(){
									me.grid.trigger('reloadGrid', {current:true});
								},
								complete: function(){
									$dialog.dialog('close');
								}
							})
						}
					})
				}
			},{
				type: 'cancel'
			}],
			create: function() {
				$(this).find('[name="t1MchtRank"]').val(rowData.mchtRank);
			}
		})
	}

	function showChangeStateDialog(me, rowData) {
		var validator = false;
		var $dialog = Opf.Factory.createDialog(stateFormTpl({}), {
			destroyOnClose: true,
			title: '状态变更',
			autoOpen: true,
			width: Opf.Config._('ui', 'mcht.grid.changestate.form.width'),
			height: 360,
			modal: true,
			buttons: [{
				type: 'submit',
				click: function () {
					var $state = $(this).find('[name="state"]');
					var $unionState = $(this).find('[name="unionState"]');
					// var $s0State = $(this).find('[name="s0State"]');
					var oldState = rowData.status;// 商户状态
					var newState = $state.val();
					var oldUnionState = rowData.isCoMarketing;// 联合营销商户状态
					var newUnionState = $unionState.val();
					// var oldS0State = rowData.mchtServiceS0Status;// S0服务开关
					// var newS0State = $s0State.val();
					var selSateTxt = $state.find('option:selected').text();
					var selUnionSateTxt = $unionState.find('option:selected').text();
					// var selS0SateTxt = $s0State.find('option:selected').text();

					var oldmaxDeviceNum = rowData.maxDeviceNum;
					var maxDeviceNum = $(this).find('[name="maxDeviceNum"]').val();

					var remark = $(this).find('[name="remark"]').val();
					var isValid = validator.form();
					if(!isValid){
						return false;
					}

					if (oldState != newState || oldUnionState != newUnionState || oldmaxDeviceNum != maxDeviceNum ) {
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

						/*if(oldS0State != newS0State){
							addConfirmMessage += (index++)+'、更改S0秒到开关为 "' + selS0SateTxt + '" <br>';
						}*/

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
										// oldS0Status:oldS0State,
										// newS0Status: newS0State,
										maxDeviceNum: maxDeviceNum,
										remark: remark
									},
									url: url._('mcht.changestates', {id: rowData.id}),
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
				var form = $(this).find('form');
				validator = $(form).validate({
					errorElement: "span",
					errorClass: "help-error",
					focusInvalid: false,
					rules : {
						remark : { 'required': true }
					},
					highlight: function(element) {
						// 这里element是DOM对象
						$(element).closest('.form-group').addClass('has-error');
					},
					success: function(element) {
						element.closest('.form-group').removeClass('has-error');
						element.remove();
					},
					errorPlacement: function(error, element) {
						error.addClass('help-block').insertAfter(element);
					}
				});
				$(this).find('[name="state"]').val(rowData.status);
				$(this).find('[name="unionState"]').val(rowData.isCoMarketing);
				//$(this).find('[name="s0State"]').val(rowData.mchtServiceS0Status);
				$(this).find('[name="maxDeviceNum"]').val(rowData.maxDeviceNum);
			}
		});
	}

	function statusFormatter(val) {
		return STATUS_MAP[val] || '';
	}

	function iscomarketingFormatter(val) {
		return MCHT_ISCOMARKETING[val] || '';
	}

	function kindFormatter(val) {
		return KIND_MAP[val] || '';
	}

	function CFCountsFormatter(val) {
		if(val == '100' || val == '010' || val == '001'){
			return '一证商户';
		}else if(val == '111') {
			return '三证商户';
		}else{
			return '';
		}
	}

	function mchtSourceFormatter(val) {
		return MCHT_SOURCE_MAP[val] || '';
	}

	function inviteStatusFormatter(val) {
		return INVITESTATUS_MAP[val] || '';
	}

	function timeFormatter(val) {
		return val ? moment(val, 'YYYYMMDDHHmm').format('YYYY/MM/DD HH:mm') : '';
	}

	//返回空值，真正的标识用 background-image
	function inviteMarkFormatter( cellvalue, options, rowObject) {
		// return rowObject.inviteStatus === "0" ? "" : "T0";
		return '';
	}
	//s0 秒到达开通状态
	function mchtServiceS0StatusFormatter(val){
		return SOSTATUS_MAP[val] || '';
	}
	//设置cell background-image
	//rawObject 是后台传回来的数据
	//rdata 是 在 colModel 中的列
	function setCellBG(rowId, val, rawObject, cm, rdata){
		var status,
			invite = rawObject.inviteStatus;
		//0-未邀请             不显示 T0 标签
		if(invite === "0" || !invite){
			return "";
		}
		//1-已邀请             显示 黄色 T0 标签
		else if(invite === "1"){
			status = 0;
		}
		//2-已达标             显示 蓝色 T0 标签
		else if(invite === "2"){
			status = 1;
		}
		//3-复核不通过         显示 红色 T0 标签
		else if(invite === "3"){
			status = 2;
		}
		//4-已关闭             显示 灰色 T0 标签
		else if(invite === "4"){
			status = 3;
		}
		//4-已签约             显示 绿色 T0 标签
		else if(invite === "5"){
			status = 4;
		}

		return "style='background: url("+ MARK_COLOR_MAP[status].image +") no-repeat center center;text-align:center;' title='"+MARK_COLOR_MAP[status].title+"'";
	}

	function bindBackBtnEvent(view, gridEl) {
		var $gridEl = $(gridEl);

		view.on('back', function () {
			setTimeout(function () {
				$(window).trigger('resize');
				$gridEl.show();
			}, 1);
		});
	}

	//商户等级
	function mchtNameFormatter(value, param, rowData){
		var mchtLevel = parseInt(rowData.mchtLevel);
		var mchtLevelStr = "";
		for(var i=0; i<mchtLevel; i++){
			mchtLevelStr += '<i class="icon icon-star" style="color:#FF6A00;"></i>';
		}

		var mchtNameStr = "";
			mchtNameStr += '<div class="row">';
			mchtNameStr += '<div class="col-xs-12">'+value+'</div>';
			mchtNameStr += '</div>';
			mchtNameStr += '<div class="row">';
			mchtNameStr += '<div class="col-xs-12">'+mchtLevelStr+'</div>';
			mchtNameStr += '</div>';

		return mchtNameStr;
	}

	return App.MchtSysApp.List.View;

});