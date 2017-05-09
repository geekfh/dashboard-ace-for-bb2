define(['App',
	'tpl!app/oms/auth/rule/list/templates/table-ct.tpl',
	'i18n!app/oms/common/nls/auth',
	'jquery.jqGrid',
	'assets/scripts/fwk/component/simple-tree',
	'jstree',
	'jquery.validate',
	'bootstrap-datepicker'
], function(App, tableCtTpl, authLang,x,SimpleTree) {

	var TYPE_VAL_MAP = {
		'0': authLang._('rule.type.0'),//自定义
		'1': authLang._('rule.type.1'),
		'2': authLang._('rule.type.2'),
		'3': authLang._('rule.type.3'),
		'4': authLang._('rule.type.4')
	};

	var CUSTOM_RULE = {
		'0': authLang._('rule.type.0')//自定义
	};

	App.module('AuthSysApp.Rule.List.View', function(View, App, Backbone, Marionette, $, _) {

		View.Rules = Marionette.ItemView.extend({
			tabId: 'menu.auth.rule',
			template: tableCtTpl,

			events: {

			},

			onRender: function() {
				var me = this;
				setTimeout(function() {
					me.renderGrid();
				}, 1);
			},

			renderGrid: function() {
				var me = this;

				var setupValidation = Opf.Validate.setup;
				var addValidateRules = function(form) {
					Opf.Validate.addRules(form, {
						rules: {

							name: {
								'required': true,
								'maxlength': 24
							},
							type: {
								'required': true
							},
							descr: {
								'required': true,
								'maxlength': 300
							}
						}

					});
				};

				var rulesGird = App.Factory.createJqGrid({
						rsId: 'rule',
						module: 'rule',
						caption: authLang._('rule.txt'),
						actionsCol: {
							canButtonRender: function(name, opts, rowData) {
								if((name === 'edit' || name === 'del') && rowData.type !== '0') {
									return false;
								}
							}
						},
						nav: {
							formSize: {
                                width: Opf.Config._('ui', 'rule.grid.form.width'),
                                height: Opf.Config._('ui', 'rule.grid.form.height')
                            },
							add: {
								beforeShowForm:function(form){

									addValidateRules(form);
								},
								afterShowForm: function (form) {
									//触发type的change事件，处理器根据type最新值更新UI
									//$(form).find('select[name="type"]').trigger('change');
									var e = {
										target : $(form).find('select[name="type"]')
									};
									me.trigger('typeChange', e, 0,null);
								},
								onclickSubmit: function (params, postdata) {
									me.trigger('submit', params, postdata);
								},

								beforeSubmit: function(postdata, form) {
									var selOrgIds = $(form).find('.org-tree').jstree('get_selected');
									var selExpIds = $(form).find('.opr-tree').jstree('get_selected');
									if(!selOrgIds.length && !selExpIds.length){
										Opf.alert('请至少选择一个机构或者操作员！');
										return false;
									}else{
										return setupValidation(postdata, form);
									}
								}
							},
							edit: {
								beforeShowForm:function(form){
									addValidateRules(form);
									var message = rulesGird.getRowData(Opf.Grid.getSelRowIds(rulesGird)[0]).type;
									if(message !== '自定义规则') {
										console.log('进入不是自定义规则的方法');
										console.log(this);
                                        console.log(rulesGird);
										return false;
									}
								},
								afterShowForm: function (form) {
									var e = {
										target : $(form).find('select[name="type"]')
									};
									var rowId = Opf.Grid.getLastSelRowId(rulesGird);
									var checkedList = ajaxCheckedValue(rowId);
									me.trigger('typeChange', e, 0,checkedList);

									// $(form).find('select[name="type"]').trigger('change');
								},
								onclickSubmit: function (params, postdata) {
									me.trigger('submit', params, postdata);
								},
								
								beforeSubmit: function(postdata, form) {
									var selOrgIds = $(form).find('.org-tree').jstree('get_selected');
									var selExpIds = $(form).find('.opr-tree').jstree('get_selected');
									if(!selOrgIds.length && !selExpIds.length){
										Opf.alert('请至少选择一个机构或者操作员！');
										return false;
									}else{
										return setupValidation(postdata, form);
									}
								}
							},
							view:{
								beforeShowForm: function(form) {
								//TODO原谅我这么恶心吧
									var $form = $(form);
									var tpl = [
										'<div class="col-xs-12" style="padding-left: 10%;">',
										'<b>规则元素</b><b class="empty-value" style="display:none;">:&nbsp;无</b>',
											'<div class="tree"></div>',
										'</div>'
									].join('\n');
									var $tpl = $(tpl);

									var rowId = Opf.jqGrid.getLastSelRowId(this);
									var checkedList = ajaxCheckedValue(rowId);
									var orgList = creatViewTree(url._('rule.branches'),'0',checkedList);
									var expList = creatViewTree(url._('rule.operators'),'1',checkedList);
									var trees = creatTrees(orgList,expList);
									if(trees.length>0){
										console.log(trees);
										new SimpleTree({
											renderTo: $tpl.find('.tree'),
											data: trees,
											selectable: false
										});
									}
									else{
										$tpl.find('.empty-value').show();
									}

									$(form).append($tpl);

									
								}//beforeShowForm
							}
						},
						gid: 'rules-grid',//innerly get corresponding ct '#rules-grid-table' '#rules-grid-pager'
						url: url._('rule'),
						colNames: [
							'',
							authLang._('name'),
							authLang._('rule.range.txt'),
							authLang._('rule.branch.txt'),
							authLang._('descr')
						],

						responsiveOptions: {
							hidden: {
								ss: ['type'],
								xs: ['type'],
								sm: [],
								md: [],
								ld: []
							}
						},

						colModel: [
							{name: 'id', index: 'id', editable: false, hidden: true  },
							{name: 'name', index: 'name', search:true,editable: true ,
								_searchType:'string'
							},
							{name: 'type', index: 'type', search:false,editable: true,
								formatter: typeFormatter,
								edittype:'select',
								editoptions: {
									
									value: CUSTOM_RULE
								}
							},
							{name: 'branchName', index: 'branchName', search:false,editable: false, editoptions: {disabled: true} ,hidden:true },

							{name: 'descr', index: 'descr', search:false,editable: true, edittype: 'textarea'}
						],
						// pager: pagerSelector,// '#rules-grid-pager'

						loadComplete: function() {}
				});

			}

		});

	});

	function typeFormatter (cellvalue, options, rowObject) {
			return TYPE_VAL_MAP[cellvalue];
	}

	function ajaxCheckedValue(rowId){
		var url = 'api/system/rules/' + rowId;
		var checkedList = [];
		$.ajax({
			type:'GET',
			url:url,
			async:false,
			success:function(data){
				_.each(data.elems,function(elem){
					checkedList.push({
						value:elem.value,
						type:elem.type
					});
				});
			}
		});
		return checkedList;
	}

	function ajaxDate(url){
		var getData;
		$.ajax({
			type:'GET',
			url: url,
			dataType: 'json',
			async:false,
			success:function(data){
				getData = data;
			}
		});
		return getData;
	}

	function creatViewTree(url,type,checkedList){
		var dataList = ajaxDate(url);
		var XXXdataList = _.where(checkedList,{type:type});
		var leafList = [];
		_.each(XXXdataList,function(node){
			var leafObj = null,
				leafName = "";

			if(type == '0'){
				leafObj = _.findWhere(dataList,{code:node.value});
			}else{
				leafObj = _.findWhere(dataList,{id:parseInt(node.value)});
			}

			leafName = leafObj && leafObj.name||"";

			leafList.push({
				id:node.value,
				name:leafName,
				type:'item',
				isLeaf:true,
				children:null
			});
		});

		return leafList;
	}

	function creatTrees(orgList,expList){
		var trees = [];
		if(orgList.length>0){
			trees.push({
				name:'机构',
				id:null,
				isLeaf:false,
				type:'folder',
				children:orgList
			});
		}
		if(expList.length>0){
			trees.push({
				name:'操作员',
				id:null,
				isLeaf:false,
				type:'folder',
				children:expList
			});
		}
		return trees;
	}


	return App.AuthSysApp.Rule.List.View;

});