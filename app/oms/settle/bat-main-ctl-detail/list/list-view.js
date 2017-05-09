/**
 * @created 2014-3-12 19:27:29
 */



define(['App',
	'tpl!app/oms/settle/bat-main-ctl-detail/list/templates/table-ct.tpl',
	'i18n!app/oms/common/nls/settle',
	'jquery.jqGrid',
	'jquery.validate',
	'bootstrap-datepicker'
], function(App, tableCtTpl, settleLang) {

	var STATE_MAP = {
		"0" : settleLang._("bat-main-ctl-detail.state.0"),
		"1" : settleLang._("bat-main-ctl-detail.state.1"),
		"2" : settleLang._("bat-main-ctl-detail.state.2"),
		"3" : settleLang._("bat-main-ctl-detail.state.3")
	},

	TASKASSIGNSTATE_MAP = {
		"0" : settleLang._("bat-main-ctl-detail.teskAssignState.0"),
		"1" : settleLang._("bat-main-ctl-detail.teskAssignState.1"),
		"2" : settleLang._("bat-main-ctl-detail.teskAssignState.2")
	},

	TASKSTARTFLAG_MAP = {
		"0" : settleLang._("bat-main-ctl-detail.taskStartFlag.0"),
		"1" : settleLang._("bat-main-ctl-detail.taskStartFlag.1")
	},

	RECOPRID_MAP = {
		"0" : settleLang._("bat-main-ctl-detail.recOprId.0"),
		"1" : settleLang._("bat-main-ctl-detail.recOprId.1"),
		"2" : settleLang._("bat-main-ctl-detail.recOprId.2"),
		"3" : settleLang._("bat-main-ctl-detail.recOprId.3")
	};



	View = Marionette.ItemView.extend({
		template: tableCtTpl,

		events: {

		},

		onRender: function() {
			var me = this;

			setTimeout(function() {

				me.renderGrid();

			},1);
		},

		getRequestDate: function(gird, id) {
			var data = {};

			id ? data['id'] = id : data['id'] = Opf.Grid.getSelRowId(gird);

			var options = {
				url:'api/settle/bat-main-ctl-details/' + data['id'] + '/batMain',
				data:data,
				type:'GET',
				contentType:'application/json',
				dataType:'json',
				needData:false
			};

			return options;
		},


		ajaxRequest: function(options, dialog, grid) {
			console.log('-----------ajaxRequest is doing!!');
			$.ajax({
				type: options.type,
				contentType: options.contentType,
				dataType: options.dataType,
				url: options.url,
				data: options.needData ? JSON.stringify(options.data) : "",
				success: function(resp) {
					$(grid).trigger("reloadGrid", [{current:true}]);
					if(resp.success) {
	                    Opf.Toast.success('操作成功');
	                }
				},
				error: function(resp) {
					$(grid).trigger("reloadGrid", [{current:true}]);
					// console.log(resp.success);
				}
			});
		},

		onClickButton: function(grid, id) {
			var me = this;
			// if(confirm('确定发起？')){
			// }
			me.ajaxRequest(me.getRequestDate(grid, id), null, grid);
		},

		attachValidation: function() {
			return {
				setupValidation: Opf.Validate.setup,
				addValidateRules: function(form) {
                    Opf.Validate.addRules(form, {
	                    rules:{
	                    	dateSettlmt:{
	                            required: true,
	                            date: true
	                        },
	                        settleNum:{
	                            required: true,
	                            namechars: true
	                        },
	                        batNo:{
	                            required: true,
	                            namechars: true
	                        },
	                        procName:{
								required: true,
								namechars: true
	                        },
	                        priority:{
	                            required: true,
	                            number: true
	                        },
	                        state:{
	                            required: true
	                        },
	                        runProcQuantity:{
	                            required: true,
	                            number: true
	                        },
	                        commitQuantity:{
	                            required: true,
	                            number: true
	                        },
	                        chdCount:{
	                            required: true,
	                            number: true
	                        },
							taskAssignState: {
	                            required: true
	                        },
	                        taskStartFlag: {
	                            required: true
	                        },
	                        descr: {
	                        	required: true,
	                        	maxlength: 100
	                        },
	                        note: {
	                        	required: true,
	                        	maxlength: 100
	                        },
	                        recOprId: {
	                        	required: true,
	                        	namechars: true
	                        },
	                        recUpdOpr: {
	                        	required: true,
	                        	namechars: true
	                        },
	                        recCrtTime: {
	                        	required: true,
	                        	date: true
	                        },
	                        recUpdTime: {
	                        	required: true,
	                        	date: true
	                        }
	                    }
                    });
                }
			};
			
		},

		serializeData: function () {
			return {data: {}};
		},
        	
        gridOptions: function(defaultOptions) {
        	return defaultOptions;
        },

		renderGrid: function() {
			var me = this;
			
			var validation = this.attachValidation();
            
			var grid = App.Factory.createJqGrid(me.gridOptions({
				//TODO >>>remove
				// autoRefresh: true,
				// autoRefreshInterval: 2000,
				//<<<

				rsId:'batMainCtlDetail',
				caption: settleLang._('batMainCtlDetail.txt'),
				actionsCol: {
					// width: Opf.Config._('ui', 'batMainCtlDetail.grid.form.actionCol.width'),
					edit : false,
					del: false,
					extraButtons: [
						{name: 'reStart', title:'重试', icon: 'icon-opf-restart icon-opf-restart-color', click: function(btn) {
							$(btn).hide();
							me.onClickButton(grid);
						}}
					],
					canButtonRender: function(name, opts, rowData) {
						// return true;
						//运行失败才显示该按钮  或者未运行也可以
						if(name === 'reStart' && !(rowData.state === '3' || rowData.state === '0')) {
							return false;
						}
					}
				},

				nav: {

					actions: {
                        add: false
                    },

					formSize: {
						width: Opf.Config._('ui', 'batMainCtlDetail.grid.form.width'),
						height: Opf.Config._('ui', 'batMainCtlDetail.grid.form.height')
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
					},
					view: {
						width: Opf.Config._('ui', 'batMainCtlDetail.grid.viewform.width'),
						height: Opf.Config._('ui', 'batMainCtlDetail.grid.viewform.height')
					}
				},
				gid: 'bat-main-ctl-details-grid',//innerly get corresponding ct '#bat-main-ctl-details-grid-table' '#bat-main-ctl-details-grid-pager'
				url: url._('bat.main.ctl.detail'),
				colNames: {
					id       : settleLang._('id'),  //ID
					dateSettlmt       : settleLang._('bat.main.ctl.detail.date.settlmt'),  //清算日期
					settleNum       : settleLang._('bat.main.ctl.detail.settle.num'),  //同一个清算周期清算次数
					nodeTime    : settleLang._('bat.main.ctl.detail.timeNode'),  // 时间节点
					batNo       : settleLang._('bat.main.ctl.detail.bat.no'),  //批量编号
					procName       : settleLang._('bat.main.ctl.detail.proc.name'),  //批量程序名
					priority       : settleLang._('bat.main.ctl.detail.priority'),  //优先级
					state       : settleLang._('bat.main.ctl.detail.state'),  //运行状态
					runProcQuantity       : settleLang._('bat.main.ctl.detail.run.proc.quantity'),  //设置进程数
					commitQuantity       : settleLang._('bat.main.ctl.detail.commit.quantity'),  //单次提交记录数
					chdCount       : settleLang._('bat.main.ctl.detail.chd.count'),  //子进程数量
					taskAssignState       : settleLang._('bat.main.ctl.detail.task.assign.state'),  //任务分配状态
					taskStartFlag       : settleLang._('bat.main.ctl.detail.task.start.flag'),  //是否指定主机
					descr       : settleLang._('bat.main.ctl.detail.descr'),  //批量任务描述
					note       : settleLang._('bat.main.ctl.detail.note'),  //运行描述
					recOprId       : settleLang._('bat.main.ctl.detail.rec.opr.id'),  //记录柜员号
					recUpdOpr       : settleLang._('bat.main.ctl.detail.rec.upd.opr'),  //修改柜员号
					recCrtTime       : settleLang._('bat.main.ctl.detail.rec.crt.time'),  //记录创建时间
					recUpdTime       : settleLang._('bat.main.ctl.detail.rec.upd.time') //记录修改时间
				},

				responsiveOptions: {
					hidden: {
						ss: ['priority'],
						xs: ['priority'],
						sm: [],
						md: [],
						ld: []
					}
				},

				colModel: [
					{name:         'id', index:         'id', editable: false, hidden: true},  //ID
					{name: 'dateSettlmt', index: 'dateSettlmt', search:true, editable: true,
						searchoptions: {
							dataInit : function (elem) {
								$(elem).datepicker({autoclose: true,format: 'yyyymmdd'});
							},
							sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge']
						},
						editoptions: {
							dataInit : function (elem) {
								$(elem).datepicker({ autoclose: true,format: 'yyyymmdd'})
									.on("changeDate changeMonth changeYear", function(oDate) {
										$(oDate.target).valid();
									});
							}
						}

					},  //清算日期
					{name:         'settleNum', index:         'settleNum', search:true, editable: true,
						_searchType:'num'

					},  //同一个清算周期清算次数
					{name: 'nodeTime', index: 'nodeTime', formatter: Opf.nodeTimeFormatter},

					{name:         'batNo', index:         'batNo', search:false,editable: true, hidden: true},  //批量编号
					{name:         'procName', index:         'procName', search:false,editable: true, hidden: true},  //批量程序名
					{name:         'priority', index:         'priority', search:false,editable: true},  //优先级
					{name: 'descr', index: 'descr', search: false, width:360, editable: true, edittype: "textarea"},  //批量任务描述
					{name: 'state', index: 'state', search: true, editable: true, formatter: stateFormatter,
						edittype:'select',
						editoptions: {
							value: STATE_MAP
						},
						stype: 'select',
						searchoptions: {
							value: STATE_MAP,
							sopt:['eq','ne']
						}
					},  //运行状态
					{name:         'runProcQuantity', index:         'runProcQuantity', search:false,editable: true, hidden: true},  //设置进程数
					{name:         'commitQuantity', index:         'commitQuantity', search:false,editable: true, hidden: true},  //单次提交记录数
					{name:         'chdCount', index:         'chdCount', search:false,editable: true, hidden: true},  //子进程数量
					{name:         'taskAssignState', index: 'taskAssignState', search: false, editable: true, hidden: true, formatter: taskAssignStateFormatter,
						edittype: 'select',
						editoptions: {
							value: TASKASSIGNSTATE_MAP
						}
					},  //任务分配状态
					{name: 'taskStartFlag', index: 'taskStartFlag', search: false, editable: true, hidden: true, formatter: taskStartFlagFormatter,
						edittype:'select',
						editoptions: {
							value: TASKSTARTFLAG_MAP
						}
					},  //是否指定主机
					{name: 'note', index: 'note', search: false, editable: true, edittype: "textarea", hidden: true},  //运行描述
					{name:         'recOprId', index:         'recOprId', search:false,editable: true, hidden: true, formatter: recOprIdFormatter},  //记录柜员号
					{name:         'recUpdOpr', index:         'recUpdOpr', search:false,editable: true, hidden: true},  //修改柜员号
					{name: 'recCrtTime', index: 'recCrtTime', search: false, editable: true, hidden: true,
						editoptions: {
							dataInit : function (elem) {
								$(elem).datepicker({ autoclose: true,format: 'yyyymmdd'})
									.on("changeDate changeMonth changeYear", function(oDate) {
										$(oDate.target).valid();
									});
							}
						}
					},  //记录创建时间
					{name: 'recUpdTime', index: 'recUpdTime', search: false, editable: true, hidden: true,
						editoptions: {
							dataInit : function (elem) {
								$(elem).datepicker({ autoclose: true,format: 'yyyymmdd'})
									.on("changeDate changeMonth changeYear", function(oDate) {
										$(oDate.target).valid();
									});
							}
						}
					} //记录修改时间
				],

				loadComplete: function() {}
			}));

			return grid;
		}

	});



	function stateFormatter(val) {
		return STATE_MAP[val];
	}

	function taskAssignStateFormatter(val) {
		return TASKASSIGNSTATE_MAP[val];
	}

	function taskStartFlagFormatter(val) {
		return TASKSTARTFLAG_MAP[val];
	}

	function recOprIdFormatter(val) {
		return RECOPRID_MAP[val];
	}



	return View;

});