define(['App',
	'tpl!app/oms/auth/role/list/templates/table-ct.tpl',
	'i18n!app/oms/common/nls/auth',
	'jquery.jqGrid',
	'bootstrap-datepicker',
	'assets/scripts/fwk/component/simple-tree',
	'jstree',
	'jquery.validate',
	'common-ui'
], function(App, tableCtTpl, authLang, x, y, SimpleTree, v) {

	var LEVEL_MAP = {
		'0': authLang._('role.flag.all'),
		'1': authLang._('role.flag.level-one'),
		'2': authLang._('role.flag.level-zero')
	};

	
	App.module('AuthSysApp.Role.List.View', function(View, App, Backbone, Marionette, $, _) {

		View.Roles = Marionette.ItemView.extend({
			tabId: 'menu.auth.role',
			template: tableCtTpl,

			events: {

			},

			onRender: function() {
				var me = this;

				setTimeout(function() {
					me.renderGrid();
				}, 1);
			},

			busyAuth: function(toggle) {
				Opf.UI.setLoading(this.$treeWrap,toggle);
				// Opf.UI[toggle ? 'spin' : 'unSpin'](this.$treeWrap);
			},

			refreshAuth: function(id) {
				this.renderTree(id);
			},

			//TODO refactor, use back model, add convertToxx method to the model
			fetchRoleAuths: function(id, callback) {

				$.ajax({
					type: 'GET',
					dataType: 'json',
					url: 'roles/' + id,
					success: function(resp) {
						if (!resp.success) {
							callback(resp.auths || []);
						}
					}
				});
			},

			convert: function(auths) {

				var handle = function(node) {
					var item = {
						name: node.text,
						isLeaf: node.isLeaf,
						id: node.id
					};

					if (!node.isLeaf) {

						item.type = 'folder';

						_.each(node.children || [], function(child) {
							var itemChildren = item.children || (item.children = []);
							itemChildren.push(handle(child));
						});

					} else {

						item.type = 'item';
					}
					return item;
				};

				var ret = [];
				_.each(auths, function(node) {
					ret.push(handle(node));
				});

				return ret;
			},

			getRoleId: function() {
				//TODO
				return '4';
			},

			renderGrid: function() {
				
				var setupValidation = Opf.Validate.setup;
				var addValidateRules = function(form){
					Opf.Validate.addRules(form, {
						rules : {
							name : {
								'required': true,
								'maxlength': 12
							},
							code : 'required',
							descr: {
								'maxlength': 300
							}
						}
					});
				};
				
				var view = this;
				var me = this, $addForm, $editForm;
				var roleGird = App.Factory.createJqGrid({
					rsId: 'roles',
					jsonReader: {
						// id: 'code'
					},
					caption: authLang._('role'),
					// actionsCol: {
					// 	width: 130,
					// 	//默认提供 edit / del / view 按钮,如果要禁止这三种之一，要手动配置
					// 	edit:false,//禁止edit
					// 	//提供具体某一行是否能绘制某种按钮的方法
					// 	canButtonRender: function (type, opts, rowData) {
					// 		//编号为daren或者tt的行不能删除
					// 		if(type === 'del' && (rowData.code === 'daren' || rowData.code === 'tt')) {
					// 			return false;
					// 		}
					// 	},
					// 	extraButtons: [
					// 		//name是必须的，对应的资源id生成规则是gid+'.btn.'+name
					// 		{name: 'sp', caption: '审核', icon: '', click: function () {alert('审核呀');}},
					// 		{name: 'fp', caption: '分批', icon: '', click: function () {alert('分批呀');}}
					// 	]
					// },
					nav: {
						formSize: {
                            width: Opf.Config._('ui', 'roles.grid.form.width'),
                            height: Opf.Config._('ui', 'roles.grid.form.height')
                        },
						add : {
							beforeShowForm: function (form) {
								$addForm = $(form);
								renderFlag(form);
								view.trigger('role:add', $(form[0]).closest('.ui-widget'));//el of form widget

								addValidateRules(form);
							},
							onclickSubmit: function(params, postdata) {
								if ($addForm.find('[name="flagRadio"]').filter(':checked').val() === 'level') {
									postdata.useBrh = '';
									postdata.flag = $addForm.find('[name="flag"]').val();
								} else {
									postdata.useBrh = $addForm.find('[name="branch"]').val();
									postdata.flag = '';
								}
								return postdata;
							},
							beforeSubmit: setupValidation
						},
						edit: {
							beforeShowForm: function(form) {
								$editForm = $(form);

								var id = Opf.jqGrid.getLastSelRowId(this);
								var rowData = roleGird._getRecordByRowId(id);
								renderFlag(form, { useBrh: rowData.useBrh });

								// 机构号和及级别不能同时出现，如果出现了机构号说明是指定机构，需要将radio button指向机构
								if (rowData.useBrh) {
									$(form).find('[name="flagRadio"]').filter('[value="branch"]').click();
								}

								view.trigger('role:edit', id, $(form[0]).closest('.ui-widget'));//el of form widget

								addValidateRules(form);
							},
							onclickSubmit: function(params, postdata) {
								if ($editForm.find('[name="flagRadio"]').filter(':checked').val() === 'level') {
									postdata.useBrh = '';
									postdata.flag = $editForm.find('[name="flag"]').val();
								} else {
									postdata.useBrh = $editForm.find('[name="branch"]').val();
									postdata.flag = '';
								}
								return postdata;
							},
							beforeSubmit: setupValidation
						},
						view: {
							beforeShowForm: function(form) {
								//TODO原谅我这么恶心吧
								var $form = $(form);
								var tpl = [
									'<div class="col-xs-12" style="padding-left: 10%;">',
									'<b>拥有的权限</b><b class="empty-value" style="display:none;">:&nbsp;无</b>',
										'<div class="tree"></div>',
									'</div>'
								].join('\n');
								var $tpl = $(tpl);

								var id = Opf.jqGrid.getLastSelRowId(this);
								$.ajax({
									type: 'GET',
									dataType: 'json',
									url: url._('role.v2', {id:id}),
									success: function(resp) {
										if (!resp.success) {
											if(resp.auths && resp.auths.length) {
												new SimpleTree({
													renderTo: $tpl.find('.tree'),
													data: convert(resp.auths),
													selectable: false
												});
											}else {
												$tpl.find('.empty-value').show();
											}
											$form.append($tpl);
										}
									}
								});//ajax
								
							}//beforeShowForm
						}
					},
					gid: 'roles-grid', //innerly get corresponding ct '#roles-grid-table' '#roles-grid-pager'
					url: url._('role'),
					colNames: [
						// '',
						'',
						'名称',
						'编号',
						'可见级别',
						'指定机构号',
						'描述'
					],

					responsiveOptions: {
						hidden: {
							ss: ['code','flag'],
							xs: ['code','flag'],
							sm: [],
							md: [],
							ld: []
						}
					},

					colModel: [
						// {name:'myac',index:'', width:80, fixed:true, sortable:false, resize:false,
						// 	formatter:'actions', 
						// 	formatoptions:{ 
						// 		keys:true,
								
						// 		delOptions:{recreateForm: true/*, beforeShowForm:beforeDeleteCallback*/}
						// 		// ,  
						// 		// editformbutton:true, editOptions:{recreateForm: true, beforeShowForm:beforeEditCallback}
						// 	}
						// },
						{name: 'id', index: 'id', editable: false, hidden: true}, 
						{name: 'name', index: 'name', search:true,editable: true, editoptions:{required : true},
							_searchType:'string'
						},
						{name: 'code', index: 'code', search:false,editable: true, editoptions:{required : true}},
						{name: 'flag', index: 'flag', search:true,editable: true, formatter: flagFormatter,
							stype:'select',
                                searchoptions:{
                                	sopt:['eq'],
                                    value: extendLevelMap
                                },
							edittype:'select',
								editoptions: {
									value: extendLevelMap
								}
						},
						{name: 'useBrh', index: 'useBrh', editable: false},
						{name: 'descr', index: 'descr', search:false,editable: true, edittype:'textarea'}

					],

					loadComplete: function() {}
				});

			}

		});

	});

	function flagFormatter(cellvalue, options, rowObject) {
		return LEVEL_MAP[cellvalue] || '';
	}

	 /**
     * 权限列表转成树结构，参数列表的每一个元素都应一个叶子，
     * 同时，每一个元素的 wholeName 字段用来生成对应的父节点
     * @param  {[type]} auths 
     * [{name: "费率模型修改", value: "system:brhprofitmodel:u", wholeName: "系统管理-费率模型"},...]
     * @return {[type]}       [description]
     */
    function convert (auths) {
        var WHOLENAME_SEP = '-';
        var rootList = [];
        var curNode, curList;
        var nameArr, name;

        _.each(auths, function (item) {
            nameArr = item.wholeName.split('-');
            curList = rootList;

            //wholeName 用来生成父节点
            for (var i = 0; i < nameArr.length; i++) {
                //找到以 nameArr[i] 为name的结点
                curNode = _.findWhere(curList, {name: nameArr[i]});

                if(!curNode) {
                    curNode = {name: nameArr[i]};
                    curList.push(curNode);

                    //更新父节点配置
                    curNode.type = 'folder';
                    curNode.isLeaf = false;
                    curNode.id = null;
                    curNode.children = [];
                }
                //当前列表 变为 该结点的孩子列表
                curList = curNode.children;
            }

            //auths 列表里每个元素对应一个叶子
            curList.push({
                name: item.name,
                isLeaf: true,
                id: item.value,
                type: "item"
            });

        });
        return rootList;
    }


    function xxconvert (auths) {

		var handle = function(node) {
			var item = {
				name: node.text,
				isLeaf: node.isLeaf,
				id: node.id
			};

			if (!node.isLeaf) {
				item.type = 'folder';
				_.each(node.children || [], function(child) {
					var itemChildren = item.children || (item.children = []);
					itemChildren.push(handle(child));
				});

			} else {
				item.type = 'item';
			}

			return item;
		};

		var ret = [];
		_.each(auths, function(node) {
			ret.push(handle(node));
		});
		return ret;
	}

	function extendLevelMap() {
		var defaultMap = {
			'0': authLang._('role.flag.all'),
			'1': authLang._('role.flag.level-one')
		};
		if (Ctx.getUser().get('brhLevel') === 0) {
			return _.extend({}, defaultMap, {'2': authLang._('role.flag.level-zero')});
		}
		return defaultMap;
	}

	function renderFlag (form, defaultBranchVal) {
		if (!defaultBranchVal || !defaultBranchVal.useBrh) {
			defaultBranchVal = null;
		} else {
			defaultBranchVal = defaultBranchVal.useBrh;
		}

		var $form = $(form),
			$trFlag = $form.find('#tr_flag'), $flagRadio, $branchSelect2,
			roleRadio = [
				'<tr class="FormData" style="border-bottom: none;">' +
					'<td class="CaptionTD">可见级别</td>' +
					'<td class="DataTD ">&nbsp;' +
						'<label><input type="radio" name="flagRadio" value="level" checked/>指定级别</label>&nbsp;&nbsp;'+
						'<label><input type="radio" name="flagRadio" value="branch"/>指定机构</label>'+
					'</td>' +
				'</tr>'
			].join('');

		$trFlag.find('.CaptionTD').empty();
		$trFlag.find('.DataTD').append('<input name="branch" style="width: 170px;">');
		$trFlag.before(roleRadio);

		$flagRadio = $form.find('[name="flagRadio"]');
		$branchSelect2 = $trFlag.find('[name="branch"]');

		CommonUI.branchSelect2($branchSelect2, {defaultValue: defaultBranchVal});

		$flagRadio.on('change', function () {
			$trFlag.find('[name="branch"]').select2('container').toggle($flagRadio.filter(':checked').val() === 'branch');
			$trFlag.find('select').toggle($flagRadio.filter(':checked').val() === 'level');

		});

		$flagRadio.trigger('change');

	}

	return App.AuthSysApp.Role.List.View;

});