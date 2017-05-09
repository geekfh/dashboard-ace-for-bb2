/**
 * @created 2014-3-12 19:27:29
 */



define(['App',
	'tpl!app/oms/settle/settle-sum/list/templates/table-ct.tpl',
	'tpl!app/oms/settle/settle-sum/list/templates/dialog.tpl',
	'i18n!app/oms/common/nls/settle',
	'jquery.jqGrid',
	'jquery.validate',
	'bootstrap-datepicker'
], function(App, tableCtTpl, dialogTpl,  settleLang) {

	var DOFLAG_MAP = {
		"0" : settleLang._("settle-sum.doFlag.0"),
		"1" : settleLang._("settle-sum.doFlag.1"),
		"2" : settleLang._("settle-sum.doFlag.2"),
		"3" : settleLang._("settle-sum.doFlag.3"),
		"9" : settleLang._("settle-sum.doFlag.9")
	};

	var SETTLEMODE_MAP = {
		"0" : settleLang._("settle-sum.settleMode.0"),
		"1" : settleLang._("settle-sum.settleMode.1"),
		"2" : settleLang._("settle-sum.settleMode.2")
	};

	var SORTLEVEL_MAP = {
		"0" : settleLang._("settle-sum.sortLevel.0"),
		"1" : settleLang._("settle-sum.sortLevel.1")
	};
	
	var SAMEBANKFLAG_MAP = {
			"0" : settleLang._("settle-sum.samebankflag.0"),
			"1" : settleLang._("settle-sum.samebankflag.1")
	};

	var RULES = {
		batchNum: {
			required : true
		},
		oprMsg1: {
			maxlength : 300
		}
	};

	var STAT_MAP = {
        "totalSum":"总笔数",
        "totalAmt":"总金额"
    };



	var FIND = {"sameBankFlag":'input[name="sameBankFlag"]:checked', 
				"sortLevel":'input[name="sortLevel"]:checked',
				"batchNum":'input[name="batchNum"]', 
				"oprMsg1":'textarea[name="oprMsg1"]' 
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


		getRequestDate: function(gird) {
			var options = {};
			var data = {};

			data['id'] = Opf.Grid.getSelRowId(gird);
			var $form = $('form.form-settle-sum');
			for (var key in FIND) {
				data[key] = $form.find(FIND[key]).val();
				if (!data[key]) {
					data[key] = '0';
				}
			}

			options.url = 'api/settle/sums/' + data['id'] + '/accept';
			options.data = data;
			options.type = 'PUT';
			options.contentType = 'application/json';
			options.dataType = 'json';
			options.needData = true;
			return options;
		},

		getRequestDateSelect: function(gird) {
			var options = {};

			options.url = 'api/settle/sums/' + Opf.Grid.getSelRowId(gird) + '/batMain';
			options.type = 'GET';
			options.contentType = 'application/x-www-form-urlencoded';
			options.dataType = 'json';
			options.needData = false;
			return options;
		},

		ajaxRequest: function(options, dialog, grid) {
			$.ajax({
				type: options.type,
				contentType: options.contentType,
				dataType: options.dataType,
				url: options.url,
				data: options.needData ? JSON.stringify(options.data) : "",
				success: function(resp) {
					if (dialog) {
						$(dialog).dialog('destroy');
					}
					$(grid).trigger("reloadGrid", [{current:true}]);
					if(resp.success) {
	                    Opf.Toast.success('操作成功');
	                }
				},
				error: function(resp) {
					console.log(resp);
					console.error('ajax get fail !!');
					if (dialog) {
						$(dialog).dialog('destroy');
					}
					// alert('操作失败');
				}
			});
		},

		ajaxBatchNum: function(gird, form, $dialog) {
			var id = Opf.Grid.getSelRowId(gird);
			var sameBankFlag = ($(form).find(FIND["sameBankFlag"]).val() || "0");

			$.ajax({
				type: 'GET',
				contentType: 'application/json',
				dataType: 'json',
				url: 'api/settle/sums/' + id + '/' + sameBankFlag + '/scopValue',
				success: function(resp) {
					var min,max;

					if(resp.minValue && resp.maxValue) {
						min = (resp.minValue < 1 ? 1 : resp.minValue);
						max = (resp.maxValue > 99 ? 99 : resp.maxValue);
						
					} else {
						min = 0;
						max = 0;

					}
					
					if(min === 0 && max === 0) {
						$('#batchNum-to-append').empty().append('0 ~ 0');

					} else {
						$('#batchNum-to-append').empty().append(min + ' ~ ' + max);

					}

					$(form).find('input[name="batchNum"]').each(function() {
						$(this).rules('add', {
							range: [min, max]
							
						});
					});

	
				}, 
				error: function(resp) {
					$($dialog).dialog('destroy');
				}
			});
		},

		onClickButton: function(roleGird) {
			var me =  this;
			var tpl = dialogTpl();
			var $dialog = $(tpl).dialog({
				autoOpen: true,
				height: Opf.Config._('ui', 'settleSum.grid.form.extra.height'),    //300,
				width: Opf.Config._('ui', 'settleSum.grid.form.extra.width'),     //350,
				modal: true,

				buttons: [{
					html: "<i class='icon-ok'></i>&nbsp; 提交",
					"class" : "btn btn-xs btn-primary",
					click: function(e) {
						var $form = $('form.form-settle-sum');
						var validator = $form.validate();
						var valid = true;

						if(validator && !validator.form()){
							valid = false;
						}
						if(valid){
							$($(e.target).closest('button')).addClass('disabled').find('span').html("<i class='icon-ok'></i>&nbsp; 正在提交...");
							me.ajaxRequest(me.getRequestDate(roleGird), this, roleGird);
						}
					}
				}, {
					html: "<i class='icon-remove'></i>&nbsp; 取消",
					"class" : "btn btn-xs",
					click: function() {
						$(this).dialog('destroy');
					}
				}],
				create: function() {
					var dialogMe = this;

					Opf.Validate.addRules($('form.form-settle-sum'), {
						rules: RULES
					});

					var $form = $('form.form-settle-sum');
					var $sameBankFlag = $form.find('input[name="sameBankFlag"]');
					var $sortLevel = $form.find('input[name="sortLevel"]');
					$sameBankFlag.on('change', function(){
						me.ajaxBatchNum(roleGird, $form, dialogMe);
					});

					$sameBankFlag.trigger('change');
					$(this).prev('.ui-widget-header').find('.ui-dialog-title').addClass('settle-styles-paddingL-15');
				},
				close: function(event, ui) {
					$(this).dialog('destroy');
				}
			});
		},

		serializeData: function () {
			return {data: {}};
		},

		gridOptions: function(defaultOptions) {
        	return defaultOptions;
        },
		
		
		renderGrid: function() {
			var me = this;
			var roleGird = App.Factory.createJqGrid(me.gridOptions({
				rsId:'settleSum',
				caption: settleLang._('settleSum.txt'),
				stats:{
                    labelConfig:STAT_MAP,
                    items:[
                        {name: 'totalSum', type:'count'},
                        {name: 'totalAmt', type:'currency'}        
                    ]
                },
				actionsCol: {
					edit : false,
					del: false/*,
					extraButtons: [
						{name: 'todo', title:'划分批次', icon: 'icon-opf-divide-batch icon-opf-divide-batch-color', click: function() {
							me.onClickButton(roleGird);
						}}
					],
					canButtonRender: function(name, opts, rowData) {
						if(name === 'todo' && (rowData.inalienable !== '1' || rowData.totalAmt === 0)) {
							return false;
						}
					}*/
				},
				nav: {
					actions: {
                        add: false
                    },

					formSize: {
						width: Opf.Config._('ui', 'settleSum.grid.form.width'),
						height: Opf.Config._('ui', 'settleSum.grid.form.height')
					},
					view: {
						width: Opf.Config._('ui', 'settleSum.grid.viewform.width'),
						height: Opf.Config._('ui', 'settleSum.grid.viewform.height')
					}
				},
				gid: 'settle-sums-grid',//innerly get corresponding ct '#settle-sums-grid-table' '#settle-sums-grid-pager'
				url: url._('settle.sum'),
				colNames: {
					id       : settleLang._('settle.sum.id'),  //ID
					settleDate       : settleLang._('settle.sum.settle.date'),  //清算日期
					settleNum       : settleLang._('settle.sum.settle.num'),  //同一个清算周期清算次数
					nodeTime   : settleLang._('settle.sum.timeNode'),  // 时间节点
					settleDesc       : settleLang._('settle.sum.settle.desc'),  //清算描述
					doFlag       : settleLang._('settle.sum.do.flag'),  //操作标志(0-入账完成,1-入账进行中，2-已拆分好批次，3-拆分批次前，9-初始化状态)
					totalNum       : settleLang._('settle.sum.total.num'),  //总笔数
					totalAmt       : settleLang._('settle.sum.total.amt'),  //总金额
					succNum       : settleLang._('settle.sum.succ.num'),  //成功笔数
					succAmt       : settleLang._('settle.sum.succ.amt'),  //成功金额
					failNum       : settleLang._('settle.sum.fail.num'),  //失败笔数
					failAmt       : settleLang._('settle.sum.fail.amt'),  //失败金额
					unknowNum       : settleLang._('settle.sum.unknow.num'),  //不确定笔数
					unknowAmt       : settleLang._('settle.sum.unknow.amt'),  //不确定金额
					doneNum       : settleLang._('settle.sum.done.num'),  //已完成批次数
					settleMode       : settleLang._('settle.sum.settle.mode'),  //入账方式（0-直接联机清算，1-全部采用文件方式其它系统代理清算，2-混合清算）
					sameBankFlag       : settleLang._('settle.sum.same.bank.flag'),  //同行是否单独成一批次
					batchNum       : settleLang._('settle.sum.batch.num'),  //批次数量
					sortLevel       : settleLang._('settle.sum.sort.level'),  //排序优先级
					oprId       : settleLang._('settle.sum.opr.id'),  //操作员

					//add row
					oprName     : settleLang._('settle.sum.opr.name'),  //操作员名称
					//add end

					oprMsg1       : settleLang._('settle.sum.opr.msg1'),  //操作员描述
					recCreateTime       : settleLang._('settle.sum.rec.create.time'),  //记录创建时间
					recOprTime       : settleLang._('settle.sum.rec.opr.time'),  //操作时间
					recInTime       : settleLang._('settle.sum.rec.in.time'), //入账时间
					inalienable         :settleLang._('settle.sum.inalienable')  //显示标志，若为9则显示划分批次按钮
					
				},

				responsiveOptions: {
					hidden: {
						ss: ['id','settleDesc','settleNum','settleDesc','doFlag','totalNum','succNum','failNum','failAmt','unknowNum','unknowAmt','doneNum','settleMode','sameBankFlag','batchNum','sortLevel','oprId','oprMsg1','recCreateTime','recOprTime','recInTime', 'succAmt'],
                        xs: ['id','settleDesc','settleNum','settleDesc','doFlag','totalNum','succNum','failNum','failAmt','unknowNum','unknowAmt','doneNum','settleMode','sameBankFlag','batchNum','sortLevel','oprId','oprMsg1','recCreateTime','recOprTime','recInTime'],
						sm: ['id','doFlag','succNum','failNum','failAmt','unknowNum','unknowAmt','doneNum','settleMode','sameBankFlag','batchNum','sortLevel','oprId','oprMsg1','recCreateTime','recOprTime','recInTime'],
						md: ['id','doneNum','settleMode','sameBankFlag','batchNum','sortLevel','oprId','oprMsg1','recCreateTime','recOprTime','recInTime'],
						ld: ['id','doneNum','settleMode','sameBankFlag','batchNum','sortLevel','oprId','oprMsg1','recCreateTime','recOprTime','recInTime']
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
								$(elem).datepicker({ autoclose: true, format: 'yyyymmdd' })
									.on("changeDate changeMonth changeYear", function(oDate) {
										$(oDate.target).valid();
									});
							}
						}
					},  //清算日期
					{name: 'settleNum', index: 'settleNum', search: false, editable: true,
						_searchType:'num'
					},  //同一个清算周期清算次数
					{name: 'nodeTime', index: 'nodeTime', formatter: Opf.nodeTimeFormatter},
					{name: 'settleDesc', index: 'settleDesc', search: false, hidden:true, editable: true, edittype: "textarea"},  //清算描述
					{name: 'doFlag', index: 'doFlag', search: true, editable: true, formatter: doFlagFormatter,
						edittype:'select',
						editoptions: {
							value: DOFLAG_MAP
						},
						stype: 'select',
						searchoptions: {
							value: DOFLAG_MAP,
							sopt:['eq','ne']
						}
					},  //操作标志(0-入账完成,1-入账进行中，2-已拆分好批次，3-拆分批次前，9-初始化状态)
					{name: 'totalNum', index: 'totalNum', search: false, editable: true},  //总笔数
					{name: 'totalAmt', index: 'totalAmt', search: false, editable: true, formatter: Opf.currencyFormatter},  //总金额
					{name: 'succNum', index: 'succNum', search: false, editable: true},  //成功笔数
					{name: 'succAmt', index: 'succAmt', search: false, editable: true, formatter: Opf.currencyFormatter},  //成功金额
					{name: 'failNum', index: 'failNum', search: false, editable: true},  //失败笔数
					{name: 'failAmt', index: 'failAmt', search: false, editable: true, formatter: Opf.currencyFormatter},  //失败金额
					{name: 'unknowNum', index: 'unknowNum', search: false, editable: true},  //不确定笔数
					{name: 'unknowAmt', index: 'unknowAmt', search: false, editable: true, formatter: Opf.currencyFormatter},  //不确定金额
					{name: 'doneNum', index: 'doneNum', search: false, editable: true},  //已完成批次数
					{name: 'settleMode', index: 'settleMode', search: false, editable: true,  formatter: settleModeFormatter,
						edittype:'select',
						editoptions: {
							value: SETTLEMODE_MAP
						}
					},  //入账方式（0-直接联机清算，1-全部采用文件方式其它系统代理清算，2-混合清算）
					{name: 'sameBankFlag', index: 'sameBankFlag', search: false, editable: true, formatter: sameBankFlagFormatter,
						edittype: "select",
						editoptions: {
							value: SAMEBANKFLAG_MAP
						}
					},  //同行是否单独成一批次
					{name: 'batchNum', index: 'batchNum', search: false, editable: true},  //批次数量
					{name: 'sortLevel', index: 'sortLevel', search: false, editable: true, formatter: sortLevelFormatter,
						edittype:'select',
						editoptions: {
							value: SORTLEVEL_MAP
						}
					},  //排序优先级
					{name: 'oprId', index: 'oprId', search: false, editable: true, viewable: false},  //操作员
					//add row 
					{name: 'oprName', index: 'oprName', search: false, editable: false, hidden: true},
					//add end
					{name: 'oprMsg1', index: 'oprMsg1', search: false, editable: true, edittype: "textarea"},  //操作员描述
					{name: 'recCreateTime', index: 'recCreateTime', search: false, editable: true, formatter: timeFormatter,

						// formatter: function(value) {
						// 	return value ? value.substring(0, 8) : "";
						// },

						editoptions: {
							dataInit : function (elem) {
								$(elem).datepicker({ autoclose: true, format: 'yyyymmdd' })
									.on("changeDate changeMonth changeYear", function(oDate) {
										$(oDate.target).valid();
									});
							}
						}
					},  //记录创建时间
					{name: 'recOprTime', index: 'recOprTime', search: false, editable: true, formatter: timeFormatter,

						// formatter: function(value) {
						// 	return value ? value.substring(0, 8) : "";
						// },
						editoptions: {
							dataInit : function (elem) {
								$(elem).datepicker({ autoclose: true, format: 'yyyymmdd' })
									.on("changeDate changeMonth changeYear", function(oDate) {
										$(oDate.target).valid();
									});
							}
						}
					},  //操作时间
					{name: 'recInTime', index: 'recInTime', search: false, editable: true, formatter: timeFormatter,
						// formatter: function(value) {
						// 	return value ? value.substring(0, 8) : "";
						// },
						editoptions: {
							dataInit : function (elem) {
								$(elem).datepicker({ autoclose: true, format: 'yyyymmdd' })
									.on("changeDate changeMonth changeYear", function(oDate) {
										$(oDate.target).valid();
									});
							}
						}
					}, //入账时间
					{name: 'inalienable',  index: 'inalienable', hidden:true, viewable:false} //结果标志若为9才显示划分批次的按钮
				],

				loadComplete: function() {}
			}));

		}
	});


	function timeFormatter(value) {
		return value ? value.substring(0, 8) + ' ' + value.substring(8,10) + ':' + value.substring(10,12) + ':' + value.substring(12,14) : '';
	}

	function doFlagFormatter(val){
		return DOFLAG_MAP[val] || ''; 
	}

	function settleModeFormatter(val){
		return SETTLEMODE_MAP[val] || '';
	}

	function sortLevelFormatter(val){
		return SORTLEVEL_MAP[val] || '';
	}

	function sameBankFlagFormatter(val) {
		return SAMEBANKFLAG_MAP[val] || '';
	}


return View;

});