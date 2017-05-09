
define(['App',
	'tpl!app/oms/disc/list/templates/table-ct.tpl',
	'i18n!app/oms/common/nls/param',
	'app/oms/disc/disc-algos-grid',
	'jquery.jqGrid',
	'common-ui',
	'jquery.validate',
	'bootstrap-datepicker',
	'select2'
], function(App, tableCtTpl, paramLang, GridView) {

	var TYPE_MAP = {
		'mcht': '商户手续费率',
		'sale': '商户基准销售费率',
		'brh' : '机构服务费率',
		'rewd': '服务奖励分润模型',
		'serv': '服务手续费率/分润模型'
	};
	var STATUS_MAP = {
		'0':paramLang._('disc.status.0'),
		'1':paramLang._('disc.status.1')
	};

	var BRANCH_NAME_MAP = {};

	function typeFormatter(val){ return TYPE_MAP[val] || '';}
	function statusFormatter(val){return STATUS_MAP[val] || '';}

	App.module('ParamSysApp.Disc.List.View', function(View, App, Backbone, Marionette, $, _) {

		View.Discs = Marionette.ItemView.extend({
			tabId: 'menu.disc.service.list',
			template: tableCtTpl,

			onRender: function() {
				var me = this;

				_.defer(function () {
					me.renderGrid();
				});
			},

			renderGrid: function() {
				var me = this;
				var discGird = App.Factory.createJqGrid({

					rsId:'disc',
					caption: paramLang._('disc.txt'),
					//注意: 增加时，表单通过模板生成，如果增加或减少字段要去改模版
					nav: {
						formSize: {
			                width: Opf.Config._('ui', 'disc.grid.form.width'),
			                height: Opf.Config._('ui', 'disc.grid.form.height')
						},
						add: {
						},
						edit: decorateEditForm({
							
						}),

						search:{
							afterShowSearch: function(form) {
								me._searchform = form;

								Opf.ajax({
									type: 'GET',
									url: url._('options.disc-brhs'),
									success: function(resp){
										var brhData = me.brhData = resp;
                                		checkNeedSelect2(form, brhData);
									}
								});

                                return true;
                            },

                            afterRedraw: function(){
                            	if(!(me._searchform)){
                            		return false;
                            	}
                            	var $form = me._searchform;
                            	checkNeedSelect2($form, me.brhData);

                            }
						},
						actions: {
							addfunc: function () {
								require(['app/oms/disc/add/add-view'], function (View) {
									var view = new View();
									view.render();
									view.on('add:success', function () {
										Opf.Grid.toastSuccess(discGird, 'add');
										$(discGird).trigger("reloadGrid", [{current:true}]);
									});
								});
							}
						}
					},
					gid: 'discs-grid',//innerly get corresponding ct '#discs-grid-table' '#discs-grid-pager'
					url: url._('disc'),
					colNames: {
						code       : paramLang._('code'),
						name       : paramLang._('disc.name'),
						type       : paramLang._('disc.type'),
						branchCode : paramLang._('disc.branch.code'),
						branchName : paramLang._('disc.branch.name'),
						status     : paramLang._('disc.status')
					},

					colModel: [
						{name:         'id', index:         'id', editable: false, hidden: true},
						{name:       'code', index:       'code', search:false,editable: false},
						{name:       'name', index:       'name', search:true,editable: true,_searchType:'string'}, 
						{name:       'type', index:       'type', search:false,editable: true,formatter: typeFormatter,
							edittype:'select',
							editoptions: {value: TYPE_MAP}
						},
						{name: 'branchCode', index: 'branchCode', search:false,editable: true,
							edittype:'select',
							editoptions: {value: {}},
							formoptions: {
								label: paramLang._('disc.forbranch')
							}
						},
						{name: 'branchName', index: 'branchName', search:true,editable: false,_searchType:'string',
							stype:'text',
                            searchoptions:{
                            	sopt:['eq']
                            }
						},
						{name:     'status', index:     'status', search:false,editable: true,formatter: statusFormatter,
							edittype:'select',
							editoptions: {value: STATUS_MAP}}
					]
				});
				//return discGird;
			}

		});

	});
	
	
	function renderAlgosView (discId, form, gridOptions) {
		var view = new GridView({
			renderTo: form,
			gridOptions: gridOptions
		});

		if(discId) {
			Opf.ajax({
				url: url._('disc', {modelId: discId}),
				success: function (resp) {
					view.render(resp.algos);
				}
			});
		}else {
			view.render();
		}

		return view;
	}

	function decorateEditForm (options) {

		var setupValidation = Opf.Validate.setup;
		var addValidateRules = function(form){
            var rulesMap = {
                'name': {
                  required: true,
                  maxlength: 12
                }
            };
            Opf.Validate.addRules(form, {rules:rulesMap});
            
        };

		var subView;

		var opt = {
			beforeInitData: function () {
				$(this).jqGrid('setColProp', 'type', {
					editoptions: {
						disabled: true
					}
				});
				$(this).jqGrid('setColProp', 'branchCode', {
					editoptions: {
						disabled: true
					}
				});
			},
			afterShowForm: function (form) {
				var discId = this.p.selrow;
				subView = renderAlgosView(discId, form);

				var rowData = $(this)._getSelRecord();
				var $branchCode = $(form).find('[name=branchCode]');
				if(rowData.type === 'sale' || rowData.type === 'mcht') {
					CommonUI.branch4Disc($branchCode, rowData.branchCode);
				}else {
					$branchCode.closest('tr').hide();
				}

				$(this).jqGrid('setColProp', 'type', {
					editoptions: {
						disabled: false
					}
				});
				$(this).jqGrid('setColProp', 'branchCode', {
					editoptions: {
						disabled: false
					}
				});
				addValidateRules($(form));
			},
			onclickSubmit: function (params, postdata) {
				var algos = subView.getRowDatas(); 
				postdata.algos = algos;
			},
			beforeSubmit: setupValidation
		};

		return $.extend(opt, options);
	}

    function buildOrgSelectUI ($el, data) {
        $el.parent().width(150);
		$el.css({'height':'100%'});
        $el.select2({
            data: _.map(data, function (item) {return {id: item[1], text: item[1]};}),
            width: 300,
            placeholder: '- 选择适用机构 -'
        });
        $el.closest('tr').data('cached.select2', $el.data('select2'));
    }

    //检测表单是否需要select2，由于新增选择条件的时候会重绘
	function checkNeedSelect2 (form, data) {
		var $form = $(form);
    	var $select = $form.find('.columns select');

    	//找到所有应该放select2的input，重新加上select2；
    	_.each($select, function(item){
    		if($(item).find('option:checked').attr('value') == 'branchName'){
	        	var $dataSel = $(item).closest('tr').find('.data .input-elm');
	        	buildOrgSelectUI($dataSel, data);
			}
    	});

    	//找到所有的搜索条件下拉框重新绑定事件
		$select.on('change.addSelect2',function(){
			var me = $(this);
			if(me.find('option:checked').attr('value') == 'branchName'){
	        	var $dataSel = me.closest('tr').find('.data .input-elm');
	        	buildOrgSelectUI($dataSel, data);
			}else{
				var $cachedSelect2 = me.closest('tr').data('cached.select2');
				$cachedSelect2 && $cachedSelect2.destroy();
			}
        });

	}

	//return DiscsView;
	return App.ParamSysApp.Disc.List.View;

});