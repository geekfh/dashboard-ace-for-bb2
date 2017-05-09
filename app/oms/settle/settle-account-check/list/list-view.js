/**
 * @created 2014-3-12 19:27:29
 */



define([
	'tpl!app/oms/settle/settle-account-check/list/templates/table-ct.tpl',
	'tpl!app/oms/settle/settle-account-check/list/templates/check-table.tpl',
	'jquery.jqGrid',
	'jquery.validate',
	'bootstrap-datepicker'
], function(tableCtTpl, CheckTableTpl) {
	var AUTHSTATUS_MAP = {
		'0': '通过',
		'1': '拒绝',
		'9': '未处理'
	};

	var View = Marionette.ItemView.extend({
		template: tableCtTpl,
		tabId: 'menu.account.check',
		onRender: function () {
			var me = this;
			_.defer(function () {
				me.renderGrid();
			});
		},
		createCheckDialog: function (data, type) {
			var me = this;
			data.dateDescShort = (function (dataString){
				//后台返回 "20170314 23:00:00 - 20170315 23:00:00"
				//达到     2017/03/02 23：00--2017/03/02 23:00 所有参与清分交易
				if(!!dataString && !!dataString.trim()){
					var dataArray = dataString.match(/\d{8}\s\d{2}:\d{2}:\d{2}/g);
					var shortDataArray = _.map(dataArray, function(item){
						return item.slice(0, 4)+"/"+item.slice(4, 6)+ "/"+item.slice(6, 14);
					});
					if(shortDataArray && shortDataArray.length == 2){
						return shortDataArray[0] + ' -- '  + shortDataArray[1];
					}
				}
			})(data.dateDesc);
			var tableTpl = CheckTableTpl(data);

			// 审核按钮
			var buttons = [{
				type: 'submit',
				text: '通过',
				click: function () {
					me.showMarkDialog({
						param: {
							id: data.id,
							authStatus: 0
						},
						submitCallback: function () {
							$dialog.trigger('dialogclose');
						}
					});
				}
			},{
				type: 'submit',
				text: '拒绝',
				click: function () {
					me.showMarkDialog({
						param: {
							id: data.id,
							authStatus: 1
						},
						submitCallback: function () {
							$dialog.trigger('dialogclose');
						}
					});
				}
			},{
				type: 'cancel'
			}];

			var $dialog = Opf.Factory.createDialog(tableTpl, {
				destroyOnClose: true,
				title: '账务审核',
				width: 800,
				height: 500,
				autoOpen: true,
				modal: true,
				buttons: type=='view'? false:buttons
			});

			if(type == 'view') return;

			$dialog.find('#tr-stlm-errors, #tr-stlm-errors-his').on('click', function(){
				$dialog.dialog('close');
				require(['app/oms/settle/stlm-error/list/list-view'], function(View) {
					var stlmErrorsView =  new View.StlmErrors({stlmDate: data.settleDate});
					App.show(stlmErrorsView);

				});
			});
			$dialog.find('#tr-stlm-repair-dtl-in, #tr-stlm-repair-dtl-out').on('click', function(){
				$dialog.dialog('close');
				require(['app/oms/settle/repair-detail/list/list-view'], function () {
					App.trigger('repairDetail:list', {createTime: data.settleDate});
				});
			});
			$dialog.find('#tr-settle-errors').on('click', function(){
				$dialog.dialog('close');
				require(['app/oms/settle/settle-error/list/list-view'], function(View) {
					var settleErrorsView =  new View.SettleErrors({settleDate: data.settleDate});
					App.show(settleErrorsView);
				});
			});
			$dialog.find('#tr-trade-water, #tr-clear-water').on('click', function () {
				$dialog.dialog('close');
				require(['app/oms/settle/algo-detail/list/list-controller'], function(View) {
					var algoDetail =  new View.listQueryAlgoDetail({algoDate: data.settleDate});
					App.show(algoDetail);
				});
			});
		},

		showMarkDialog: function (options) {
			var me = this;

			var $descDialog = Opf.Factory.createDialog(getMarkTpl(), {
				destroyOnClose: true,
				title: '审核描述',
				width: 1200,
				height: 300,
				autoOpen: true,
				modal: true,
				buttons: [{
					type: 'submit',
					text: '确定',
					click: function () {
						var $dialogWrap = $descDialog.closest('.ui-dialog');
						var $authDesc = $descDialog.find('[name="authDesc"]');
						var param = $.extend(options.param, {authDesc: $authDesc.val() || ''});
						Opf.UI.setLoading($dialogWrap);
						Opf.ajax({
							type: 'POST',
							url: url._('settle.account.check'),
							data: JSON.stringify(param),
							success: function (resp) {
								if(resp.success) {
									$(me.grid).trigger("reloadGrid", [{current:true}]);
									Opf.Toast.success('操作成功');
									options.submitCallback();
									Opf.UI.setLoading($dialogWrap, false);
									$descDialog.trigger('dialogclose');
								}
							}
						});
					}
				},{
					type: 'cancel'
				}]
			});
		},

		renderGrid: function() {
			var me = this;
			var grid = me.grid = App.Factory.createJqGrid({
				rsId:'accountCheck',
				caption: '账户审核',
				actionsCol: {
					edit : false,
					del: false,
					extraButtons: [
						{
							name: 'check', title:'审核', icon: 'icon-opf-param-config green',
							click: function(name, opts, rowData) {
								me.createCheckDialog(rowData);
							}
						}
					],
					 canButtonRender: function(name, opts, rowData) {
						 if(name === 'check' && rowData.authStatus === '0') {
							 return false;
						 }
					 }
				},
				nav: {
					actions: {
						add: false,
						viewfunc: function(id) {
							var rowData = grid._getRecordByRowId(id);

							me.createCheckDialog(rowData, 'view');
						}
					}
				},
				gid: 'account-check-grid',
				url: url._('settle.account'),
				colNames: {
					id:           '',  //ID
					settleDate:   '账务日期', 
					settleNum:    '通道名称',
					txNum:        '成功交易笔数', 
					txAmt:        '成功交易金额', 
					delayNum:     '本期延迟笔数', 
					delayAmt:     '本期延迟金额', 
					redoNum:      '恢复交易笔数', 
					redoAmt:      '恢复交易金额', 
					redoFee:      '恢复手续', 
					redoSettle:   '恢复应付金额', 
					totalNum:     '调账前总笔数', 
					totalAmt:     '调账前总金额', 
					totalFee:     '调账前总手续费', 
					totalSettle:  '调账前应付金额', 
					deleySettle:  '本期截留金额', 
					repairAmt:    '本期解冻金额', 
					repairSettle: '本期清算金额', 
					settleAmt:    '调账后汇总金额', 
					dateNum:      '清算交易天数', 
					dateDesc:     '清算交易天数描述', 
					authStatus:   '审核状态', 
					authOpr:      '审核人员Id', 
					oprName:      '审核人员名称', 
					authTime:     '审核时间',
					authDesc:     '审核描述'
				},


				colModel: [
					{name: 'id', hidden: true},
					{name: 'settleDate', formatter: settleDateFormatter,
						search: true, _searchType: 'date',
						searchoptions: {
							dataInit : function (elem) {
								$(elem).datepicker({autoclose: true, format: 'yyyymmdd'});
							}
						}
					}, // 账务日期
					{name: 'settleNum', formatter: settleNumFormatter}, // 通道名称
					{name: 'txNum', hidden: true}, // 成功交易笔数
					{name: 'txAmt', hidden: true}, // 成功交易金额
					{name: 'delayNum', hidden: true}, // 本期延迟笔数
					{name: 'delayAmt', hidden: true}, // 本期延迟金额
					{name: 'redoNum', hidden: true}, // 恢复交易笔数
					{name: 'redoAmt', hidden: true}, // 恢复交易金额
					{name: 'redoFee', hidden: true}, // 恢复手续
					{name: 'redoSettle', hidden: true}, // 恢复应付金额
					{name: 'totalNum', hidden: true}, // 调账前总笔数
					{name: 'totalAmt', hidden: true}, // 调账前总金额
					{name: 'totalFee', hidden: true}, // 调账前总手续费
					{name: 'totalSettle', hidden: true}, // 调账前应付金额
					{name: 'deleySettle', hidden: true}, // 本期截留金额
					{name: 'repairAmt', hidden: true}, // 本期解冻金额
					{name: 'repairSettle', hidden: true}, // 本期清算金额
					{name: 'settleAmt', hidden: true}, // 调账后汇总金额
					{name: 'dateNum', hidden: true}, // 清算交易天数
					{name: 'dateDesc', hidden: true}, // 清算交易天数描述
					{name: 'authStatus', formatter: authStatusFormatter,
						search: true, stype: 'select',
						searchoptions: {
							sopt: ['eq','ne'],
							value: AUTHSTATUS_MAP
						}
					}, // 审核状态
					{name: 'authOpr', hidden: true}, // 审核人员Id
					{name: 'oprName'}, // 审核人员名称
					{name: 'authTime', formatter: timeFormatter}, // 审核时间
					{name: 'authDesc'}  // 审核描述
				],

				loadComplete: function() {}
			});

		}
	});

	function authStatusFormatter (val) {
		return AUTHSTATUS_MAP[val];
	}

	function timeFormatter (val) {
		return val ? Opf.String.replaceFullDate(val, '$1-$2-$3 $4:$5:$6') : '';
	}

	function settleDateFormatter (val) {
		return val ? moment(val, 'YYYYMMDD').format('YYYY-MM-DD') : '';
	}

    function settleNumFormatter (val) {
        return (val == "ibox" || val == "TN00") ? "代付" : val;
    }

	function getMarkTpl () {
		return [
			'<form class="form-check-mark">',
				'<div class="col-xs-12">',
					'<textarea name="authDesc" maxlength="30" style="width:250px;height:80px;margin:5px;"></textarea>',
				'</div>',
			'</form>'
		].join('');
	}

	return View;

});