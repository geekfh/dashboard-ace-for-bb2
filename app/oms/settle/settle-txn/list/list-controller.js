/**
 * @created 2014-3-14 11:37:52
 */

//此Controller对应于清分清算下的清算流水表
define([
	'App',
	'app/oms/settle/settle-txn/list/list-view',
	'common-ui'
], function(App, AbstractListView) {
	var SettleTxnsView = AbstractListView.extend({});

	var T0SettleTxnsView = AbstractListView.extend({
		tabId: 'menu.t0.settle.txn',
		serializeData: function () {
			return {data: { gridId: 'settle-t0-txns-grid'}};
		},
		getNavBtnUrl: function () {
			return {
				singleBatch: url._('settle.t0.txn.single.batch'),
				divideBatch: url._('settle.t0.txn.divide.batch'),
				stopSettle: url._('settle.t0.txn.stop.settle'),
				recoverySettle: url._('settle.t0.txn.recovery.settle'),
				setSuccess: url._('settle.t0.txn.set.success'),
				download: url._('settle.t0.txn.download'),
				maxAmount: url._('settle.txn.maxAmountT0')
			};
		},
		getPermission: function(){
			return {
				maxAmountT0: 'settleTxn.maxAmountT0',
				maxAmountOne: 'settleTxn.maxAmountOne'
			}
		},
		getSettleNumVal: function () {
			return 'T0';
		},
		checkNavBtnPermisson: function (btnName) {
			return Ctx.avail('settleTxn.t0.' + btnName) || btnName == 'checkedAll';
		},
		fuckCheckBox: function () {
			var me = this;
			var $checkboxWrap = me.$el.find('#jqgh_settle-t0-txns-grid-table_cb');
			// 干掉列标题最左边的的复选框
			if($checkboxWrap.length){
				$checkboxWrap.remove();
			}
		},
		getSettleNumIsNeed: function () {
			return true;
		},
		gridOptions: function (options) {
			var searchFilters = '';
			return $.extend(options, {
				rsId:'settleTxn.t0',
				caption: 'T+0清算流水',
				tableCenterTitle: 'T+0 清算流水',
				gid: 'settle-t0-txns-grid',
				nav: {
					search: {
						width: 500,
						customComponent: {
							items: [
								{
									type: 'singleOrRangeDate',
									label: '清算日期',
									name: 'settleDate',
									limitRange: 'month',
									data: moment().format('YYYYMMDD')
								}
							]
						},
						// 点击重置按钮时，搜索条件保留以下值
						resetReserveValue: [
							{
								field: 'settleDate',
								op: 'ge',
								data: moment().subtract('day',1).format('YYYYMMDD')
							},{
								field: 'settleDate',
								op: 'le',
								data: moment().format('YYYYMMDD')
							}
						],
						afterRedraw: function (){
							var arr_input = $(this).find('input');
							_.each(arr_input, function (v, i){
								if($(v).val().length > 7){//可能值是20170421，则清空
									$(v).val('');
								}
							});
							return CommonUI.searchFormBySelect2($(this), 'cupsNo');
						},
						onSearch: function(){
							var $grid = $(this),
								postData = $grid.jqGrid('getGridParam', 'postData');

							var sDateNum = 0;
							var filJson = eval('(' + postData.filters + ')');
							var arr_sDate = [];
							var filJsonResult = true;

							if(_.where(filJson.rules, {field:'settleDate',op:'eq'}).length > 0){
								var filData = moment().format('YYYYMMDD');
								var fil_str = '{"field":"settleDate","op":"eq","data":"'+filData+'"},';
								postData.filters = postData.filters.replace(fil_str, '');
							}

							filJson = eval('(' + postData.filters + ')');

							$.each(filJson.rules, function(i, v){
								if(filJson.rules[i].field == 'settleDate'){
									if(sDateNum > 1){
										Opf.alert('清算日期选项不能超出两项.');
										return filJsonResult = false;
									}
									else{
										arr_sDate.push(filJson.rules[i]);
										sDateNum++;
									}
								}
							});
							if(filJsonResult && arr_sDate.length > 1){
								if(arr_sDate[0].data > arr_sDate[1].data){
									Opf.alert('第一个清算日期必须小于第二个清算日期.');
									return filJsonResult = false;
								}
							}

							if(filJsonResult){
								//清算渠道搜索
								var gid = $grid.jqGrid('getGridParam', 'gid');
								var tableId = $('#fbox_'+gid+'-table');
								searchFilters = CommonUI.searchFilterBySelect2(tableId, postData, 'cupsNo');
							}

							return searchFilters;
						}
					},
					actions: {
						add: false
					},
					view: options.nav.view
				},
				actionsCol: {
					edit: false,
					del: false,
					extraButtons: [
						{
							name: 'history', title: '出款历史记录', icon: 'icon-table',
							click: function(name, opts, rowData){
								require(['app/oms/settle/common/settle-common'], function(View){
									var view = new View({id: rowData.id}).render();
									view.showDialog(view);
									view.$el.on('reloadParentGrid',function(){
										me.grid.trigger('reloadGrid');
									});
								});
							}
						}
					]
				},
				url: url._('settle.t0.txn')
			});
		}
	});
	var OneSettleTxnsView = AbstractListView.extend({
		tabId: 'menu.tc.settle.txn',
		serializeData: function () {
			return {data: { gridId: 'settle-tc-txns-grid'}};
		},
		getNavBtnUrl: function () {
			return {
				singleBatch: url._('settle.one.txn.single.batch'),
				divideBatch: url._('settle.one.txn.divide.batch'),
				stopSettle: url._('settle.one.txn.stop.settle'),
				recoverySettle: url._('settle.one.txn.recovery.settle'),
				setSuccess: url._('settle.one.txn.set.success'),
				download: url._('settle.one.txn.download'),
				maxAmount: url._('settle.txn.maxAmountOne')
			};
		},
		getSettleNumVal: function () {
			return 'TC';
		},
		checkNavBtnPermisson: function (btnName) {
			return Ctx.avail('settleTxn.tc.' + btnName) || btnName == 'checkedAll';
		},
		fuckCheckBox: function () {
			var me = this;
			var $checkboxWrap = me.$el.find('#jqgh_settle-tc-txns-grid-table_cb');
			// 干掉列标题最左边的的复选框
			if($checkboxWrap.length){
				$checkboxWrap.remove();
			}
		},
		getSettleNumIsNeed: function () {
			return false;
		},
		gridOptions: function (options) {
			var searchFilters = '';
			return $.extend(options, {
				rsId:'settleTxn.tc',
				caption: '一清清算流水表',
				gid: 'settle-tc-txns-grid',
				tableCenterTitle: 'T+C 清算流水',
				nav: {
					search: {
						width: 500,
						customComponent: {
							items: [
								{
									type: 'singleOrRangeDate',
									label: '清算日期',
									name: 'settleDate',
									limitRange: 'month',
									data: moment().format('YYYYMMDD')
								}
							]
						},
						afterRedraw: function (){
							var arr_input = $(this).find('input');
							_.each(arr_input, function (v, i){
								if($(v).val().length > 7){//可能值是20170421，则清空
									$(v).val('');
								}
							});
							return CommonUI.searchFormBySelect2($(this), 'cupsNo');
						},
						onSearch: function(){
							var $grid = $(this),
								postData = $grid.jqGrid('getGridParam', 'postData');

							var sDateNum = 0;
							var filJson = eval('(' + postData.filters + ')');
							var arr_sDate = [];
							var filJsonResult = true;

							if(_.where(filJson.rules, {field:'settleDate',op:'eq'}).length > 0){
								var filData = moment().format('YYYYMMDD');
								var fil_str = '{"field":"settleDate","op":"eq","data":"'+filData+'"},';
								postData.filters = postData.filters.replace(fil_str, '');
							}

							filJson = eval('(' + postData.filters + ')');

							$.each(filJson.rules, function(i, v){
								if(filJson.rules[i].field == 'settleDate'){
									if(sDateNum > 1){
										Opf.alert('清算日期选项不能超出两项.');
										return filJsonResult = false;
									}
									else{
										arr_sDate.push(filJson.rules[i]);
										sDateNum++;
									}
								}
							});
							if(filJsonResult && arr_sDate.length > 1){
								if(arr_sDate[0].data > arr_sDate[1].data){
									Opf.alert('第一个清算日期必须小于第二个清算日期.');
									return filJsonResult = false;
								}
							}

							if(filJsonResult){
								//清算渠道搜索
								var gid = $grid.jqGrid('getGridParam', 'gid');
								var tableId = $('#fbox_'+gid+'-table');
								searchFilters = CommonUI.searchFilterBySelect2(tableId, postData, 'cupsNo');
							}

							return searchFilters;
						}
					},
					actions: {
						add: false
					},
					view: options.nav.view
				},
				actionsCol: {
					edit: false,
					del: false,
					extraButtons: [
						{
							name: 'history', title: '出款历史记录', icon: 'icon-table',
							click: function(name, opts, rowData){
								require(['app/oms/settle/common/settle-common'], function(View){
									var view = new View({id: rowData.id}).render();
									view.showDialog(view);
									view.$el.on('reloadParentGrid',function(){
										me.grid.trigger('reloadGrid');
									});
								});
							}
						}
					]
				},
				url: url._('settle.one.txn')
			});
		}
	});

	var Controller = Marionette.Controller.extend({

		listSettleTxns: function() {
			console.info('new view settleTxn');

			var settleTxnsView =  new SettleTxnsView();
			App.show(settleTxnsView);

		},//@listSettleTxns

		listT0SettleTxns: function () {
			var t0SettleTxnsView =  new T0SettleTxnsView();
			App.show(t0SettleTxnsView);
		},
		listOneSettleTxns: function () {
			var oneSettleTxnsView =  new OneSettleTxnsView();
			App.show(oneSettleTxnsView);
		}

	});

	var ctrl = new Controller();

    App.on('settleTxns:list', function() {
        console.log('监听到 App触发的"settleTxns:list"事件, 触发清分清算下的清算流水表');
        ctrl.listSettleTxns();
    });

	App.on('settleTxns:t0:list', function () {
		console.log('监听到 App触发的"settleTxns:list"事件, 触发T+0下的清算流水表');
		ctrl.listT0SettleTxns();
	});

	App.on('settleTxns:one:list', function () {
		console.log('监听到 App触发的"settleTxns:list"事件, 触发T+C下的清算流水表');
		ctrl.listOneSettleTxns();
	});

    return ctrl;

});