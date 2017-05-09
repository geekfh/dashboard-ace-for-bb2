/**
 * @created 2014-3-14 11:37:52
 */
define(['App',
	'tpl!app/oms/settle/settle-control/list/templates/table-ct.tpl',
	'i18n!app/oms/common/nls/settle',
	'jquery.jqGrid',
	'jquery.validate',
	'bootstrap-datepicker',
	'moment.override'
], function(App, tableCtTpl, settleLang) {

	var CTLFLAG_MAP = {
		"0" : settleLang._("settle-control.ctlFlag.0"),
		"1" : settleLang._("settle-control.ctlFlag.1"),
		"2" : settleLang._("settle-control.ctlFlag.2"),
		"3" : settleLang._("settle-control.ctlFlag.3"),
		"4" : settleLang._("settle-control.ctlFlag.4"),
		"5" : settleLang._("settle-control.ctlFlag.5"),
		"6" : settleLang._("settle-control.ctlFlag.6"),
		"7" : settleLang._("settle-control.ctlFlag.7"),
		"8" : settleLang._("settle-control.ctlFlag.8"),
		"9" : settleLang._("settle-control.ctlFlag.9")
	};

	var SETTLEMODE_MAP = {
		"0" : settleLang._("settle-control.settleMode.0"),
		"1" : settleLang._("settle-control.settleMode.1")
	};

	// 默认生成清算日期=当天的数据
	var default_settleDate = {
		"groupOp": "AND",
		"rules": [
			{"field":"settleDate","op":"eq","data": moment().format('YYYYMMDD')}
		]
	};

	var View = Marionette.ItemView.extend({
		template: tableCtTpl,

		events: {

		},

		onRender: function() {
			var me = this;

			setTimeout(function() {

				me.renderGrid();

			},1);
		},

		serializeData: function () {
			return {data: {}};
		},
        	
        gridOptions: function(defaultOptions) {
        	return defaultOptions;
        },

		extraOperateAjax: function (url) {
			var grid = this.grid;
			return Opf.ajax({
				type:'GET',
				url: url,
				success: function () {
					Opf.Toast.success('操作成功');
				},
				complete: function () {
					$(grid).trigger("reloadGrid", [{current:true}]);
				}
			});
		},


		_extraOperateAjax: function (url) {
			return Opf.ajax({
				type:'GET',
				url: url,
				success: function () {
					Opf.Toast.success('操作成功');
				}
			});
		},

		batchExtraOperateAjax: function (urlArr, totalLength) {
			var me = this;

			if (!urlArr || urlArr.length === 0) {
				$(this.grid).trigger("reloadGrid", [{current:true}]);
				return;
			}

			var submitUrl = urlArr.pop();
			this._extraOperateAjax(submitUrl).done(function () {
				me.batchExtraOperateAjax(urlArr, totalLength);
			});
		},

		getTransferUrl: function () {
			return 'settle.ctrl.transfer';
		},

		getCheckUrl: function () {
			return 'settle.ctrl.check';
		},

		getConfirmUrl: function () {
			return 'settle.ctrl.confirm';
		},

		getConfirmTUrl: function () {
			return 'settle.ctrl.confirmT';
		},

		renderGrid: function() {
			var me = this;

			var roleGird = me.grid = App.Factory.createJqGrid(me.gridOptions({
				// TODO >>>remove
				autoRefresh: false,
				autoRefreshInterval: 30000,
				// <<<

                altRows: true,
                multiselect: true,
                multiboxonly: false,

				rsId:'settleControl',
				caption: settleLang._('settleControl.txt'),
				tableCenterTitle: 'T+1控制表',
				actionsCol: {
					edit : false,
					del: false,
					width: 100,
					extraButtons:[
						{name: 'transfer', caption:'推送',  title:'推送', icon: '', click: function(btn, obj, model) {
							Opf.confirm('确定推送？', function (result) {
								if(result){
									var submitUrl = url._(me.getTransferUrl(), {id: model.id});
									me.extraOperateAjax(submitUrl);
								}
							});
	                    }},
	                    {name: 'check',    caption:'对账',  title:'对账', icon: '', click: function(btn, obj, model) {
							Opf.confirm('确定对账？', function (result) {
								if (result) {
									var submitUrl = url._(me.getCheckUrl(), {id: model.id});
									me.extraOperateAjax(submitUrl);
								}
							});
						}},
	                    {name: 'confirm',  caption:'汇总',  title:'汇总', icon: '', click: function(btn, obj, model) {
	                    	Opf.confirm('确认汇总？', function (result) {
	                    		if (result) {
			                    	var submitUrl = model.batchNo.substring(0, 1).toUpperCase() === 'T' ? url._(me.getConfirmTUrl(), {id: model.id}) : url._(me.getConfirmUrl(), {id: model.id});
			                    	me.extraOperateAjax(submitUrl);
	                    		}
	                    	});
	                    }},
	                    {name: 'repeal',  caption:'',  title:'撤销', icon: 'icon-opf-rotate-left orange', click: function(btn, obj, model) {
	                    	var submitUrl = url._('settle.control.repeal', {ctrId: model.id});
							me.extraOperateAjax(submitUrl);
	                    }}
					],
					canButtonRender: function(name, opts, rowData) {
						//清算状态是4和9的时候才显示转账按钮
						if(name === 'transfer' && !(rowData.ctlFlag == '4' || rowData.ctlFlag == '9')) {
							return false;
						}

						//清算状态为1,3,5才显示对账按钮
						if(name === 'check' && !(canShowCheckAccount(rowData.ctlFlag))) {
							return false;
						}

						// 清算状态为1才显示汇总按钮
						if(name === 'confirm' && rowData.ctlFlag != '1') {
							return false;
						}

						// 如果 (T+0的批次 && 批次号是以T开头), 都不能显示撤销按钮
						// 否则 如果 清算状态不为9，也不能显示撤销按钮
						// 其余情况可以显示撤销按钮
						if(name === 'repeal'){
							if(rowData.settleNum === 'T000' && rowData.batchNo[0] === 'T'){
								return false;
							}
							else if(rowData.batchNo[0] === 'R'){
								return false;
							}
							else if(rowData.ctlFlag != '9'){
								return false;
							}
						}
					}
				},
				nav: {
					actions: {
                        add: false
                    },
					formSize: {
						width: Opf.Config._('ui', 'settleControl.grid.form.width'),
						height: Opf.Config._('ui', 'settleControl.grid.form.height')
					},
					view: {
						width: Opf.Config._('ui', 'settleControl.grid.viewform.width'),
						height: Opf.Config._('ui', 'settleControl.grid.viewform.height')
					}
				},
				postData: {
					filters: JSON.stringify(default_settleDate)
				},
				gid: 'settle-controls-grid',
				url: url._('settle.control'),
				colNames: {
					id       : settleLang._('id'),  //ID
					settleDate       : settleLang._('settle.control.settle.date'),  //清算日期
					settleNum       : '清算周期',  //清算周期
					nodeTime  :  settleLang._('settle.control.timeNode'),  // 时间节点
					inDate       : settleLang._('settle.control.in.date'),  //入账日期
					batchNo       : settleLang._('settle.control.batch.no'),  //批次号
					ctlFlag       : settleLang._('settle.control.ctl.flag'),  //清算标志
					payBank       : settleLang._('settle.control.pay.bank'),  //中转银行
					acctNo       : settleLang._('settle.control.acct.no'),  //付款账号

					//add row
					accBankName       : settleLang._('settle.control.bank.name'),
					acctBankNo       : settleLang._('settle.control.bank.no'),
					//add end

					acctUn       : settleLang._('settle.control.acct.un'),  //付款行联行号
					acctName       : settleLang._('settle.control.acct.name'),  //付款账号名称
					settleMode       : settleLang._('settle.control.settle.mode'),  //入账方式
					hostName       : settleLang._('settle.control.host.name'),  //银企直联前置机IP
					hostPort       : settleLang._('settle.control.host.port'),  //银企直联前置机端口号

					//add database message because the database had changed in 20140321
					custNo         : settleLang._('settle.control.cust.no'),    //付款客户号
					// userNo         : settleLang._('付款用户编号'),    //付款用户编号
					// userPwd         : settleLang._('付款用户密码'),    //付款用户密码
					//add end

					totalNum       : settleLang._('settle.control.total.num'),  //总笔数
					totalAmt       : settleLang._('settle.control.total.amt'),  //总金额
					succNum       : settleLang._('settle.control.succ.num'),  //成功笔数
					succAmt       : settleLang._('settle.control.succ.amt'),  //成功金额
					failNum       : settleLang._('settle.control.fail.num'),  //失败笔数
					failAmt       : settleLang._('settle.control.fail.amt'),  //失败金额
					unknowNum       : settleLang._('settle.control.unknow.num'),  //未确认笔数
					unknowAmt       : settleLang._('settle.control.unknow.amt'),  //未确认金额
					oprId1       : settleLang._('settle.control.opr.id1'),  //初审员
					oprId2       : settleLang._('settle.control.opr.id2'),  //复审员

					//add rows
					oprName1     : settleLang._('settle.control.opr.name1'),
					oprName2     : settleLang._('settle.control.opr.name2'),
					//add end

					oprMsg1       : settleLang._('settle.control.opr.msg1'),  //初审描述
					oprMsg2       : settleLang._('settle.control.opr.msg2'),  //复审描述

					inMsg       : settleLang._('settle.control.in.msg'),  //入账描述
					recCreateTime       : settleLang._('settle.control.rec.create.time'),  //记录创建时间
					recOprTime1       : settleLang._('settle.control.rec.opr.time1'),  //初审时间
					recOprTime2       : settleLang._('settle.control.rec.opr.time2'),  //复审时间
					recInTime       : settleLang._('settle.control.rec.in.time'), //入账时间
					remark:      settleLang._('settle.control.remark')
					
				},

				responsiveOptions: {
					hidden: {
						ss: ['settleNum', 'ctlFlag', 'custNo', 'inDate', 'payBank', 'acctNo', 'acctUn', 'acctName', 'settleMode', 'hostName', 'hostPort', 'totalNum', 'totalAmt', 'succNum', 'succAmt', 'failNum', 'failAmt', 'unknowNum', 'unknowAmt', 'oprId1', 'oprId2', 'recCreateTime', 'recOprTime1', 'recOprTime2', 'recInTime'],
						xs: ['settleNum', 'ctlFlag', 'custNo', 'inDate', 'payBank', 'acctUn', 'settleMode', 'hostName', 'hostPort', 'totalNum', 'totalAmt', 'succNum', 'succAmt', 'failNum', 'failAmt', 'unknowNum', 'unknowAmt', 'oprId1', 'oprId2', 'recCreateTime', 'recOprTime1', 'recOprTime2', 'recInTime'],
						sm: ['inDate', 'payBank', 'acctUn', 'settleMode', 'hostName', 'hostPort', 'failNum', 'failAmt', 'unknowNum', 'unknowAmt', 'oprId1', 'oprId2', 'recCreateTime', 'recOprTime1', 'recOprTime2', 'recInTime'],
						md: ['inDate', 'payBank', 'acctUn', 'settleMode', 'hostName', 'hostPort', 'oprId1', 'oprId2', 'recCreateTime', 'recOprTime1', 'recOprTime2', 'recInTime'],
						ld: ['inDate', 'payBank', 'acctUn', 'settleMode', 'hostName', 'hostPort', 'oprId1', 'oprId2', 'recCreateTime', 'recOprTime1', 'recOprTime2', 'recInTime']
					}
				},

				colModel: [
					{name:         'id', index:         'id', editable: false, hidden: true},  //ID
					{name: 'settleDate', index: 'settleDate', search: true, editable: true,
						searchoptions: {
							dataInit : function (elem) {
								$(elem).datepicker({autoclose: true,format: 'yyyymmdd'});
							},
							sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge']
						},
						editoptions: {
							dataInit : function (elem) {
								$(elem).datepicker({ autoclose: true, format: 'yyyymmdd'})
									.on("changeDate changeMonth changeYear", function(oDate) {
										$(oDate.target).valid();
									});
							}
						}
					},  //清算日期
					{name: 'settleNum', index: 'settleNum', search: false, editable: true,
						_searchType:'num'
					},  //清算周期
					{name: 'nodeTime', index: 'nodeTime', formatter: Opf.nodeTimeFormatter},
					{name: 'inDate', index: 'inDate', search: false, editable: true,
						editoptions: {
							dataInit : function (elem) {
								$(elem).datepicker({ autoclose: true, format: 'yyyymmdd'})
									.on("changeDate changeMonth changeYear", function(oDate) {
										$(oDate.target).valid();
									});
							}
						}
					},  //入账日期
					{name:         'batchNo', index:         'batchNo', search:true,editable: true,
						searchoptions: {
							sopt: ['eq']
						}
					},  //批次号
					{name: 'ctlFlag', index: 'ctlFlag', search: true, editable: true, formatter: ctlFlagFormatter,
						edittype:'select',
						editoptions: {
							value: CTLFLAG_MAP
						},
						stype: 'select',
						searchoptions: {
							value:CTLFLAG_MAP,
							sopt:['eq','ne']
						}
					},  //清算标志
					{name:         'payBank', index:         'payBank', search:false,editable: true},  //中转银行
					{name:         'acctNo', index:         'acctNo', search:false,editable: true, hidden: true},  //付款账号
					{name:         'accBankName', index:         'accBankName', search:false, editable:false, hidden: true},
					{name:         'acctBankNo', index:         'acctBankNo', search:false, editable:false, hidden: true},
					{name:         'acctUn', index:         'acctUn', search:false,editable: true},  //付款行联行号
					{name:         'acctName', index:         'acctName', search:false,editable: true, hidden: true},  //付款账号名称
					{name: 'settleMode', index: 'settleMode', search: false, editable: true, formatter: settleModeFormatter,
						edittype:'select',
						editoptions: {
							value: SETTLEMODE_MAP
						}
					},  //入账方式
					{name:         'hostName', index:         'hostName', search:false,editable: true},  //银企直联前置机IP
					{name:         'hostPort', index:         'hostPort', search:false,editable: true},  //银企直联前置机端口号

					//add database message because the database had changed in 20140321
					{name: 'custNo', index: 'custNo', search:false,editable: true, hidden:true},
					// {name: 'userNo', index: 'userNo', search:false,editable: true},
					// {name: 'userPwd', index: 'userPwd', search:false,editable: true},
					//add end

					{name:         'totalNum', index:         'totalNum', search:false,editable: true},  //总笔数
					{name:         'totalAmt', index:         'totalAmt', search:false,editable: true, formatter: Opf.currencyFormatter},  //总金额
					{name:         'succNum', index:         'succNum', search:false,editable: true},  //成功笔数
					{name:         'succAmt', index:         'succAmt', search:false,editable: true, formatter: Opf.currencyFormatter},  //成功金额
					{name:         'failNum', index:         'failNum', search:false,editable: true},  //失败笔数
					{name:         'failAmt', index:         'failAmt', search:false,editable: true, formatter: Opf.currencyFormatter},  //失败金额
					{name:         'unknowNum', index:         'unknowNum', search:false,editable: true},  //未确认笔数
					{name:         'unknowAmt', index:         'unknowAmt', search:false,editable: true, formatter: Opf.currencyFormatter},  //未确认金额
					{name:         'oprId1', index:         'oprId1', search:false,editable: true, viewable: false},  //初审员
					{name:         'oprId2', index:         'oprId2', search:false,editable: true, viewable: false},  //复审员
					{name: 'oprName1', index: 'oprName1', search: false, editable: false, hidden: true},
					{name: 'oprName2', index: 'oprName2', search: false, editable: false, hidden: true, viewable: false},
					{name: 'oprMsg1', index: 'oprMsg1', search: false, editable: true, edittype: "textarea", hidden: true},  //初审描述
					{name: 'oprMsg2', index: 'oprMsg2', search: false, editable: true, edittype: "textarea", viewable: false, hidden: true},  //复审描述
					{name: 'inMsg', index: 'inMsg', search:false,editable: true, edittype: "textarea"},  //入账描述
					{name: 'recCreateTime', index: 'recCreateTime', search: false, editable: true,
						editoptions: {
							dataInit : function (elem) {
								$(elem).datepicker({ autoclose: true, format: 'yyyymmdd'})
									.on("changeDate changeMonth changeYear", function(oDate) {
										$(oDate.target).valid();
									});
							}
						}
					},  //记录创建时间
					{name:         'recOprTime1', index:         'recOprTime1', search:false,editable: true,
						editoptions: {
							dataInit : function (elem) {
								$(elem).datepicker({ autoclose: true, format: 'yyyymmdd'})
									.on("changeDate changeMonth changeYear", function(oDate) {
										$(oDate.target).valid();
									});
							}
						}
					},  //初审时间
					{name: 'recOprTime2', index: 'recOprTime2', search: false, viewable: false, editable: true,
						editoptions: {
							dataInit : function (elem) {
								$(elem).datepicker({ autoclose: true, format: 'yyyymmdd'})
									.on("changeDate changeMonth changeYear", function(oDate) {
										$(oDate.target).valid();
									});
							}
						}
					},  //复审时间
					{name: 'recInTime', index: 'recInTime', search: false, editable: true,
						editoptions: {
							dataInit : function (elem) {
								$(elem).datepicker({ autoclose: true, format: 'yyyymmdd'})
									.on("changeDate changeMonth changeYear", function(oDate) {
										$(oDate.target).valid();
									});
							}
						}
					}, //入账时间
					{name: 'remark',  index: 'remark', search: false, editable: false }
				],

				loadComplete: function() {}
			}));


			_.defer(function () {

				Opf.Grid.availNavButtonAdd(me.grid, {
                    caption: '',
                    name: 'batchTransfer',
                    title: '批量推送',
                    buttonicon: 'icon-envelope-alt white',
                    onClickButton: function () {

                    	if (Opf.Grid.getSelRowIds(me.grid).length === 0) {
                    		Opf.alert('请至少选中一条记录！');
                    		return;
                    	}

                    	Opf.confirm('确认推送？', function (result) {
                    		if (result) {
		                    	var ids = Opf.Grid.getSelRowIds(me.grid), rowData, urlArr = [];
		                    	for (var i=0; i<ids.length; i++) {
		                			rowData = me.grid._getRecordByRowId(ids[i]);
		                    		if (!(rowData.ctlFlag == '4' || rowData.ctlFlag == '9')) {
		                    			Opf.alert('包含不能推送的数据，请重新选择！');
		                    			return;
		                    		}

		                    		urlArr.push(url._(me.getTransferUrl(), {id: ids[i]}));
		                    	}

								me.batchExtraOperateAjax(urlArr, urlArr.length);

                    		}
                    	});


                    },
                    position: "last" 
                });

                Opf.Grid.availNavButtonAdd(me.grid, {
                    caption: '',
                    name: 'batchCheck',
                    title: '批量对账',
                    buttonicon: 'icon-bar-chart white',
                    onClickButton: function () {
                    	if (Opf.Grid.getSelRowIds(me.grid).length === 0) {
                    		Opf.alert('请至少选中一条记录！');
                    		return;
                    	}

                    	Opf.confirm('确认对账？', function (result) {
                    		if (result) {
		                    	var ids = Opf.Grid.getSelRowIds(me.grid), rowData, urlArr = [];
		                    	for (var i=0; i<ids.length; i++) {
		                    		rowData = me.grid._getRecordByRowId(ids[i]);
		                    		if (!(canShowCheckAccount(rowData.ctlFlag))) {
		                    			Opf.alert('包含不能对账的数据，请重新选择！');
		                    			return;
		                    		}
		                    		urlArr.push(url._(me.getCheckUrl(), {id: ids[i]}));
		                    	}

								me.batchExtraOperateAjax(urlArr, urlArr.length);

                    		}

                    	});

                    },
                    position: "last" 
                });

                Opf.Grid.availNavButtonAdd(me.grid, {
                    caption: '',
                    name: 'batchConfirm',
                    title: '批量汇总',
                    buttonicon: 'icon-cogs white',
                    onClickButton: function () {
                    	if (Opf.Grid.getSelRowIds(me.grid).length === 0) {
                    		Opf.alert('请至少选中一条记录！');
                    		return;
                    	}
                    	
                    	Opf.confirm('确认汇总？', function (result) {
                    		if (result) {
			                    var ids = Opf.Grid.getSelRowIds(me.grid), rowData, urlArr = [];
		                    	for (var i=0; i<ids.length; i++) {
		                    		rowData = me.grid._getRecordByRowId(ids[i]);
		                    		if (rowData.ctlFlag != '1') {
		                    			Opf.alert('包含不能汇总的数据，请重新选择！');
		                    			return;
		                    		}
		                    		urlArr.push(rowData.batchNo.substring(0, 1).toUpperCase() === 'T' ? url._(me.getConfirmTUrl(), {id: ids[i]}) : url._(me.getConfirmUrl(), {id: ids[i]}));
		                    	}

								me.batchExtraOperateAjax(urlArr, urlArr.length);
                    		}

                    	});

                    	
                    },
                    position: "last" 
                });
			});

		}

	});


	function ctlFlagFormatter(val) {
		return CTLFLAG_MAP[val];
	}

	function settleModeFormatter(val) {
		return SETTLEMODE_MAP[val];
	}

	//清算状态为1,3,5才显示对账按钮
	function canShowCheckAccount (flag) {
		return flag == '1' || flag == '3' || flag == '5';
}


return View;

});