/**
 * @created 2014-3-12 19:27:29
 */



define(['App',
	'tpl!app/oms/settle/stlm-repair/list/templates/table-ct.tpl',
	'tpl!app/oms/settle/stlm-repair/list/templates/stlm-repair.tpl',
	'i18n!app/oms/common/nls/settle',
	'assets/scripts/fwk/factory/typeahead.factory',
	'common-ui',
	'jquery.jqGrid',
	'bootstrap-datepicker',
	'select2'
], function(App, tableCtTpl, stlmRepairTpl, settleLang, typeaheadFactory,commonUi) {
	var RESULTFLAG_MAP = {
		"0" : settleLang._("stlm-repair.resultFlag.0"),
		"1" : settleLang._("stlm-repair.resultFlag.1"),
		"2" : settleLang._("stlm-repair.resultFlag.2"),
		"3" : settleLang._("stlm-repair.resultFlag.3"),
		"7" : settleLang._("stlm-repair.resultFlag.7"),
		"8" : settleLang._("stlm-repair.resultFlag.8"),
		"9" : settleLang._("stlm-repair.resultFlag.9")
	},
	REPAIRFLAG_MAP = {
		"1" : settleLang._("stlm-repair.repairFlag.1"),
		"2" : settleLang._("stlm-repair.repairFlag.2")
	},
	REPAIRTYPE_MAP = {
		"1" : settleLang._("stlm-repair.repairType.1"),
		"2" : settleLang._("stlm-repair.repairType.2")
	};

	var BRANCHS = ['branchName', 'branchUserName', 'branchPhone', 'branchMobile'] ,
		MCHTS = ['mchtName', 'userName', 'userPhone'];

	App.module('SettleApp.StlmRepair.List.View', function(View, App, Backbone, Marionette, $, _) {

		View.StlmRepairs = Marionette.ItemView.extend({
			tabId: 'menu.stlm.repair',
			template: tableCtTpl,

			events: {

			},

            initialize: function () {
                this.queryFilters = null;
            },


			beforeRenderGridView: function () {
				var me = this;

				this.$el.find('.set-grid-table').attr('id', me.getGid() + '-table');
				this.$el.find('.set-grid-pager').attr('id', me.getGid() + '-pager');
			},

			getGid: function () {
				return 'stlm-repairs-grid';
			},

			onRender: function() {
				var me = this;

				me.beforeRenderGridView();

				setTimeout(function() {

					me.renderGrid();

				},1);
			},

			getRequestDate: function(gird) {
				var options = {};
				var data = {};

				data['id'] = Opf.Grid.getSelRowId(gird);
				var $form = $('form.form-stlm-repair').find(':input');
				$form.each(function() {
					data[$(this).attr('name')] = $(this).val();
				});
				console.log(data);

				options.url = 'api/settle/stlm-repairs/' + data['id'];
				options.data = data;
				options.type = 'PUT';
				options.contentType = 'application/json';
				options.dataType = 'json';
				options.needData = true;
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
						console.log(resp);
						$(dialog).dialog("destroy");
						$(grid).trigger("reloadGrid", [{current:true}]);
						if(resp.success) {
		                    Opf.Toast.success('操作成功');
		                }
					},
					error: function(resp) {
						console.log(resp);
						$(dialog).dialog("destroy");
						// alert('操作失败');
					}
				});
			},

			choice: function(canChoice) {
				return (canChoice === '7') || (canChoice === '8') || (canChoice === '9');
			}, 

			onClickButton: function(roleGird) {
				var me = this
				var tpl = stlmRepairTpl();
				console.log(tpl);
				var $dialog = $(tpl).dialog({
					autoOpen: true,
					height: Opf.Config._('ui', 'stlmRepair.grid.form.extra.height'),   //300,
					width: Opf.Config._('ui', 'stlmRepair.grid.form.extra.width'),   //350,
					modal: true,
					buttons: [{
						html: "<i class='icon-ok'></i>&nbsp; 提交",
						"class" : "btn btn-xs btn-primary",
						click: function(e) {
							var $form = $('form.form-stlm-repair');
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
							$(this).dialog("destroy");
						}
					}],
					create: function() {
						Opf.Validate.addRules($('form.form-stlm-repair'), {
							rules: {
								nextDo: {
									required: true,
									maxlength: 300
								}
								
							}
						});

						$(this).prev('.ui-widget-header').find('.ui-dialog-title').addClass('settle-styles-paddingL-15');

					},
					close: function() {
						$(this).dialog("destroy");
					}
				});
			},
			
			attachValidation: function() {
				return {
					setupValidation: Opf.Validate.setup,
					addValidateRules: function(form) {
	                    Opf.Validate.addRules(form, {
		                    rules:{
		                    	repairFlag: {
		                            required: true
		                        },
		                        repairType: {
		                            required: true
		                        },
		                        repairDesc: {
		                            required: true,
		                            maxlength: 300
		                        },
		                        repairAmt:{
									required: true,
									float: true,
									floatGtZero: true
		                        },
		                        keyNo:{
		                            required: true,
		                            namechars: true
		                        }
		                    }
	                    });
	                }
				};
				
			},
			
			renderGrid: function() {
				var me= this;
				var validation = this.attachValidation();
				var searchKeyNo = function(form){
					var $form = $(form),
							fkeyNo = $form.find('input[name="keyNo"]'),
							// fRuleName = $form.find('input[name="ruleName"]'),
							kname = 'rule', 
							model,
							tah;
						model = typeaheadFactory.createModel(kname, {
							search 	: 'name',
							//paramKey 	: 'kw',
							//limitKey	: 'limit',
							//limit 		: 10,
							prefectch 	: null,
							remote		: 'api/system/options/rule',
							fixParam	: null
						});
						
						tah = typeaheadFactory.newTypeahead(kname, {
							el : fkeyNo,
							displayKey : 'name'
						});
						
						tah.on('typeahead:selected', function(e, obj){
							var id = obj.id || obj.value;
							fkeyNo.val(id);
						});
						
						tah.on('typeahead:closed', function(e, obj){
							model.clearRemoteCache();
						});
				};

				var roleGird = App.Factory.createJqGrid({
					rsId:'stlmRepair',
					caption: settleLang._('stlmRepair.txt'),
	                download: {
	                    url: url._('stlm.repair.download'),
	                    //必须返回对象
	                    params: function () {
	                        return { filters: me.queryFilters };
	                    },
	                    queueTask: {//不配置就不在任务队列里生成一项，通常都要配置
	                        name: function () {
	                            return '账单调整';
	                        }
	                    }
	                },
					actionsCol: {
						// width: Opf.Config._('ui', 'stlmRepair.grid.form.actionsCol.width'),   //130,
						del:false,
						edit:false,
						extraButtons: [
							{name: 'check', title:'处理', icon: 'icon-opf-process-account icon-opf-process-account-color', click: function() {
								me.onClickButton(roleGird);
							}}
						],
						canButtonRender: function(name, opts, rowData) {
							// return true;
							// 只有在未处理、补帐中、补帐完毕的情况下才显示处理按钮
							if(name === 'check' && !me.choice(rowData.resultFlag)) {
								return false;
							}
						}
					},
					nav: {
						formSize: {
							width: Opf.Config._('ui', 'stlmRepair.grid.form.width'),
							height: Opf.Config._('ui', 'stlmRepair.grid.form.height')
						},
						add : {
							beforeShowForm: function(form) {
								validation.addValidateRules(form);
								setupRepairInfo(me,form);
								
							},

							onclickSubmit: function(params, postdata) {
								// postdata['keyNo'] = $('[name=keyNo]').val();

								postdata['repairType'] = '1';

								return postdata;
							},
							beforeSubmit: validation.setupValidation
						},
						edit: {
							beforeShowForm: function(form) {
								validation.addValidateRules(form);
                            },
                            beforeSubmit: validation.setupValidation
						},
                        search: {
                            onSearch: function() {
                                var $grid = $(this), postData = $grid.jqGrid('getGridParam', 'postData');
                                me.queryFilters = postData.filters;
                            }
                        },
						view: {
							width: Opf.Config._('ui', 'stlmRepair.grid.viewform.width'),
							height: Opf.Config._('ui', 'stlmRepair.grid.viewform.height'),

							//add informaction
							beforeInitData: function() {
								var rowData = roleGird._getRecordByRowId(Opf.Grid.getSelRowId(roleGird));

								//1-商户补账,2-机构补账
								if(rowData.repairFlag === '1') {
									viewableGrid(MCHTS, this, true);
									viewableGrid(BRANCHS, this, false);
								} 

								//1-商户补账,2-机构补账
								if(rowData.repairFlag === '2') {
									viewableGrid(BRANCHS, this, true);
									viewableGrid(MCHTS, this, false);
								} 

							}
							//add end

						}
					},
					gid: me.getGid(),//innerly get corresponding ct '#stlm-repairs-grid-table' '#stlm-repairs-grid-pager'
					url: url._('stlm.repair'),
					colNames: {
						id       : settleLang._('stlm.repair.id'),  //ID
						repairDate       : settleLang._('stlm.repair.repair.date'),  //补账日期
						resultFlag       : settleLang._('stlm.repair.result.flag'),  //结果标示(9-未处理,8-补账中,7-补账完毕,3-处理后用于退货,2-处理后挂账,1-处理后参加清算,0-参入清算后已纳入清算)
						//add new informaction 
						//
						branchName: settleLang._('stlm.repair.branch.name'),  // '机构名称'
						branchUserName: settleLang._('stlm.repair.branch.user.name'),  // '管理员姓名'
						branchPhone: settleLang._('stlm.repair.branch.phone'),  // '管理员手机'
						branchMobile: settleLang._('stlm.repair.branch.mobile'),  // '管理员电话'
						mchtName: settleLang._('stlm.repair.mcht.name'),  // '商户名称'
						userName: settleLang._('stlm.repair.user.name'),  // '主用户姓名'
						userPhone: settleLang._('stlm.repair.user.phone'),  // '主用户手机'
						// 
						//add end
						repairNo       : settleLang._('stlm.repair.repair.no'),  //补账人员
                        repairName     : settleLang._('stlm.repair.repair.name'),
						oprDate       : settleLang._('stlm.repair.opr.date'),  //处理日期
						oprNo       : settleLang._('stlm.repair.opr.no'),  //处理人员
                        oprName     : settleLang._('stlm.repair.opr.name'),
						nextDate       : settleLang._('stlm.repair.next.date'),  //处理后参加清算日期
						nextDo       : settleLang._('stlm.repair.next.do'),  //原因及处理描述
						repairFlag       : settleLang._('stlm.repair.repair.flag'),  //补账标示(1-商户补账,2-机构补账)
						// repairType       : settleLang._('stlm.repair.repair.type'),  //补账类型(1-按金额补账,2-结算全部)
						repairDesc       : settleLang._('stlm.repair.repair.desc'),  //补账描述
						repairAmt       : settleLang._('stlm.repair.repair.amt'),  //补账金额
						nowAmt       : settleLang._('stlm.repair.now.amt'),  //已补金额
						keyNo       : settleLang._('stlm.repair.ibox42'),  //机构/商户编号
						recCreateTime       : settleLang._('stlm.repair.rec.create.time'),  //记录创建时间
						recUpdTime       : settleLang._('stlm.repair.rec.upd.time') //记录修改时间

					},

					responsiveOptions: {
						hidden: {
							ss: ['oprName', 'repairFlag', 'repairType', 'repairAmt', 'nowAmt', 'repairName', 'repairDesc', 'nextDo'],
							xs: ['repairFlag', 'repairType', 'repairAmt', 'nowAmt', 'repairName', 'repairDesc', 'nextDo'],
							sm: ['repairAmt', 'nowAmt', 'repairName', 'repairDesc'],
							md: ['repairName', 'repairDesc'],
							ld: []
						}
					},

					colModel: [
						{name:         'id', index:         'id', editable: false, hidden: true},  //ID
						{name:         'repairFlag', index:         'repairFlag', width: 90, search:true,editable: true, formatter : repairFlagFormatter,
							stype: 'select',
							searchoptions: {
								value: REPAIRFLAG_MAP,
								sopt: ['eq','ne']
							},
							edittype:'select',
							editoptions: {
								value: REPAIRFLAG_MAP
							}
						},  //补账标示(1-商户补账,2-机构补账)
						{name: 'keyNo', index: 'keyNo', search: true, editable: true,
							_searchType:'string'
						},  //机构/商户编号
						//add new informaction 
						//
						{name: 'branchName', index:'branchName', editable: false, viewable: true, hidden: true},
						{name: 'branchUserName', index:'branchUserName', editable: false, viewable: true, hidden: true},
						{name: 'branchPhone', index:'branchPhone', editable: false, viewable: true, hidden: true},
						{name: 'branchMobile', index:'branchMobile', editable: false, viewable: true, hidden: true},
						{name: 'mchtName', index:'mchtName', editable: false, viewable: true, hidden: true},
						{name: 'userName', index:'userName', editable: false, viewable: true, hidden: true},
						{name: 'userPhone', index:'userPhone', editable: false, viewable: true, hidden: true},
						// //
						//
						//add end
						{name:         'resultFlag', index:         'resultFlag', search:true,editable: false, formatter : resultFlagFormatter,
							stype: 'select',
							searchoptions: {
								value: RESULTFLAG_MAP,
								sopt: ['eq','ne']
							}

						},  //结果标示(9-未处理,8-补账中,7-补账完毕,3-处理后用于退货,2-处理后挂账,1-处理后参加清算,0-参入清算后已纳入清算)
						{name:         'oprNo', index:         'oprNo', search:false,editable: false, hidden:true, viewable:false},  //处理人员
                        {name:         'oprName', index:         'oprName', search:false,editable:false, width: 90},
						{name:         'nextDo', index:         'nextDo', search:false,editable: false},  //原因及处理描述
						// {name:         'repairType', index:         'repairType', search:false, hidden:true, editable: false, formatter : repairTypeFormatter,
						// 	edittype:'select',
						// 	editoptions: {
						// 		value: REPAIRTYPE_MAP
						// 	}
						// },  //补账类型(1-按金额补账,2-结算全部)
						{name:         'repairAmt', index:         'repairAmt', search:false,editable: true, formatter: Opf.currencyFormatter},  //补账金额
						{name:         'nowAmt', index:         'nowAmt', search:false,editable: false, formatter: Opf.currencyFormatter},  //已补金额
						{name:         'repairNo', index:         'repairNo', search:false,editable: false, hidden:true, viewable: false},  //补账人员
                        {name:         'repairName', index:         'repairName', search:false,editable:false, width:90},
						{name:         'repairDesc', index:         'repairDesc', search:false,editable: true, edittype: 'textarea'},  //补账描述
						{name:         'repairDate', index:         'repairDate', search:true,editable: false, hidden: true,
							searchoptions: {
								dataInit : function (elem) {
									$(elem).datepicker({autoclose: true,format: 'yyyymmdd'});
								},
								sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge']
							}

						},  //补账日期
						{name:         'oprDate', index:         'oprDate', search:true,editable: false, hidden: true,
							searchoptions: {
								dataInit : function (elem) {
									$(elem).datepicker( {autoclose: true, format: "yyyymmdd"} );
								},
								sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge']
							}
						},  //处理日期
						{name:         'nextDate', index:         'nextDate', search:false,editable: false, hidden: true},  //处理后参加清算日期
						{name:         'recCreateTime', index:         'recCreateTime', search:false,editable: false, hidden: true},  //记录创建时间
						{name:         'recUpdTime', index:         'recUpdTime', search:false,editable: false, hidden: true} //记录修改时间

					],

					loadComplete: function() {}
				});
			}

		});

	});

	function viewableGrid (argus, grid, viewable) {
		var canView;

		if(viewable) {
			canView = true;
		} else {
			canView = false;
		}

		for(var i=0; i<argus.length; i++) {
			$(grid).jqGrid('setColProp', argus[i], {
				viewable: canView
				
			});
		}
	}


	function resultFlagFormatter(val) {
		return RESULTFLAG_MAP[val];
	}

	function repairFlagFormatter(val) {
		return REPAIRFLAG_MAP[val];
	}

	function repairTypeFormatter(val) {
		return REPAIRTYPE_MAP[val];
	}

	function setupRepairInfo(me,form){
		var $select = $(form).find('select[name="repairFlag"]');
		var $keyNo = me.$keyNo = $(form).find('[name=keyNo]');

		$select.on('change', function(){
			// $keyNo.data('type',$(this).val());
			if($(this).val() === '1') {
				$('#tr_keyNo').find('.CaptionTD').html('商户号');
			} else if($(this).val() === '2') {
				$('#tr_keyNo').find('.CaptionTD').html('机构号');
			}

			if($keyNo.data('select2')) {
				$keyNo.select2('data', null);
			}
		});


		$select.trigger('change');
		addOprIdSelect2($keyNo);
		// var $removeIcon = me.$removeIcon = commonUi.creatRemoveIconWith($keyNo);
		// typeaheadEl(me,{
		// 	el:$keyNo,
		// 	url:url._('mchtno')
		// });
	}

    function addOprIdSelect2 (select) {
        var $select = $(select);

        $select.select2({
            placeholder: '请输入商户/机构号',
            minimumInputLength: 1,
            width: '76%',
            ajax: {
                type: "get",
                url: url._('mchtno'),
                dataType: 'json',
                data: function (term, page) {
                    return {
                    	type: $('#repairFlag').val(),
                        kw: encodeURIComponent(term)
                    };
                },
                results: function (data, page) {
                    _.each(data, function(infos) {
                        infos.name = infos.value + '<br>(' + infos.name + ')';

                    });

                    return {
                        results: data
                    };
                }
            },
            id: function (e) {
                return e.value;
            },
            formatResult: function(data, container, query, escapeMarkup){
                return data.name;
            },
            formatSelection: function(data, container, escapeMarkup){
                return data.name;
            }

        });
    }

	function typeaheadEl (me, options) {
        var $el = options.el;
        var url = options.url;
        var MCHTNO_TYPEHEAD = 'mchtno';
        var tahIsSelect = false;
        var model,mchtNoTypeahead;

        model = typeaheadFactory.createModel(MCHTNO_TYPEHEAD, {
            search  : 'value',
            prefectch   : null,
            remote      : {
                url : url,
                replace : function(url, query){
                    return url + '?' + $.param({
                    	type:encodeURIComponent(me.$keyNo.data('type')),
                        kw: me.$keyNo.val()
                    });
                }
            }
        });

        
        mchtNoTypeahead = typeaheadFactory.newTypeahead(MCHTNO_TYPEHEAD, {
            el : $el,
            displayKey : 'value'
        });
        

       mchtNoTypeahead.on('typeahead:selected', function(e, obj){
			var id = obj.id || obj.value;
			tahIsSelect = id ? true:false;
			commonUi.triggerTahSelected($el,me.$removeIcon);
		});

        mchtNoTypeahead.on('typeahead:closed', function(e, obj){
        	console.log('you close me');
        	console.log(tahIsSelect);
        	if(!tahIsSelect) { $el.val('') };
			model.clearRemoteCache();
			tahIsSelect = false;
		});
    }


	return App.SettleApp.StlmRepair.List.View;

});