define(['App',
	'tpl!app/oms/auth/role-group/list/templates/table-ct.tpl',
    'app/oms/auth/role-group/role-select-view',
	'i18n!app/oms/common/nls/auth',
	'jquery.jqGrid',
	'bootstrap-datepicker',
	'select2'
], function(App, tableCtTpl, RoleSelectView, authLang) {

    //新建机构是默认产生的角色组，对应的id数组
    var DEFAULT_ROLEGROUPS_IDS = _.pluck(Ctx.get('SPECIFIC_OPERATORS'), 'roleGroupId');

	App.module('AuthSysApp.RoleGroup.List.View', function(View, App, Backbone, Marionette, $, _) {

		View.RoleGroups = Marionette.ItemView.extend({
            tabId: 'menu.auth.rolegroup',
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

				var setupValidation = Opf.Validate.setup;
				var addValidateRules = function(form) {
					Opf.Validate.addRules(form, {
						rules: {
							name: {
                                'required':true,
                                'maxlength': 50,
                                'checkGroupNameRepeat': {ignore: [$(form).find('input[name="name"]').val()]}
                            },
							descr: {
                                'required':true,
                                'maxlength': 300
                            },
							roles:'required'
						}
					});
				};

                var roleListView, addRoleListView;

				var roleGroupGird = App.Factory.createJqGrid({
						rsId: 'rolegroup',
						caption: authLang._('role-group.txt'),
                        actionsCol: {
                            canButtonRender: function (name, options, rowData) {
                                var userBrhCode = ''+Ctx.getUser().get('brhCode');
                                var curRowBranchCode = ''+rowData.branchId;

                                //非本机构下的角色组不能删除
                                if(name === 'del' && curRowBranchCode != userBrhCode) {
                                    return false;
                                }
                                //默认角色组不能删除
                                //TODO 本来要参照后台传的数据来判断是否为默认角色组，现在暂时硬性判断
                                // if (name === 'del' && _.contains(DEFAULT_ROLEGROUPS_IDS, parseInt(rowData.id, 10))) {
                                // id为 1~8 的是默认角色组
                                if (name === 'del' && parseInt(rowData.id, 10) < 9) {
                                    return false;
                                }

                                if(name === 'edit') {
                                	//对于编辑按钮，满足下面 任一 条件可以编辑
                                	//1.该角色组记录，是当前登录人所在机构创建
                                    //2.上级机构一定可以修改下 n 级机构
                                    //3.当前登录人所在机构是0级机构
                                    return curRowBranchCode == userBrhCode || userBrhCode == '000' ||
                                            curRowBranchCode.substring(0, 3) == userBrhCode;
                                }

                                return true;
                            }
                        },
						nav: {
                            formSize: {
                                width: Opf.Config._('ui', 'rolegroup.grid.form.width'),
                                height: Opf.Config._('ui', 'rolegroup.grid.form.height')
                            },
                            add: {
                                beforeShowForm: function(form) {
                                    Opf.UI.setLoading(form, true);
                                    addRoleListView = new RoleSelectView.AddView();
                                    $(form).find('table').after(addRoleListView.$el);

                                    addRoleListView.on('ready', function () {
                                        Opf.UI.setLoading(form, false);
                                    });
                                    
                                    addValidateRules(form);
                                },

                                onclickSubmit: function(params, postdata) {
                                    postdata['roles'] = addRoleListView.getSelectedRoles();
                                    return postdata;
                                },

                                beforeSubmit: function (postdata, form) {
                                    var result = setupValidation(postdata, form);

                                    if (!addRoleListView.validate()) {
                                        result[0] = false;
                                    }

                                    return result;
                                }
                            },

							edit: {
								beforeShowForm: function(form) {
                                    var selID = Opf.Grid.getLastSelRowId(roleGroupGird);
                                    var rowData = roleGroupGird.getRowData(selID);

                                    Opf.UI.setLoading(form, true);
                                    roleListView = new RoleSelectView.EditView({roleGroupId: selID, branchId: rowData.branchId});
                                    $(form).find('table').after(roleListView.$el);

                                    roleListView.on('ready', function () {
                                        Opf.UI.setLoading(form, false);
                                    });

									addValidateRules(form);
								},

                                onclickSubmit: function(params, postdata) {
                                    postdata['roles'] = roleListView.getSelectedRoles();
                                    return postdata;
                                },

								beforeSubmit: function (postdata, form) {
                                    var result = setupValidation(postdata, form);

                                    if (!roleListView.validate()) {
                                        result[0] = false;
                                    }

                                    return result;
                                }
							},

                            view:{
                                beforeShowForm:function(form){
                                    var selID = Opf.Grid.getLastSelRowId(roleGroupGird);
                                    console.log(selID);
                                    $.ajax({
                                        type:'GET',
                                        url:url._('role-group-id',{id:selID}),
                                        success:function(data){
                                            var $tbody = form.find('tbody');
                                            var firstRolesLabel = data.roles[0].name == void 0 ? null : data.roles[0].name;
                                            $tbody.append(createRoleLabel(firstRolesLabel,'角色'));

                                            for(var i=1;i<data.roles.length;i++){
                                                $tbody.append(createRoleLabel(data.roles[i].name));
                                            } 
                                            
                                        }
                                    });
                                }
                            }
						},
						gid: 'role-groups-grid',//innerly get corresponding ct '#role-groups-grid-table' '#role-groups-grid-pager'
						url: url._('role-group'),
						colNames: [
							'',
							authLang._('role-group.name'),
							authLang._('role-group.branchName.txt'),
                            authLang._('role-group.branch.txt'),
                            authLang._('role-group.descr')
							],


                        responsiveOptions: {
                            hidden: {
                                ss: ['branchName'],
                                xs: ['branchName'],
                                sm: [],
                                md: [],
                                ld: []
                            }
                        },

						colModel: [
							{name:         'id', index:         'id', editable:    false,      hidden:   true  },
							{name:       'name', index:       'name', search:true,editable: true ,
								_searchType:'string', formatter: nameFormatter
							},
                            {name: 'branchName', index: 'branchName', search:true,editable: false,
                                editoptions: {disabled: true},
                                _searchType:'string'
                            },
                            {name: 'branchId', index: 'branchId', search:false,editable: false, editoptions: {disabled: true}, hidden: true},
                            {name:      'descr', index:      'descr', search:false,editable: true  }

						],
						// pager: pagerSelector,// '#role-groups-grid-pager'

						loadComplete: function() {}
				});

			}

		});

	});


    function createRoleLabel(rolesLabel,viewLabel){
        var $viewLabel = viewLabel == void 0 ? '&nbsp;':viewLabel;
        var $rolesLabel = rolesLabel == void 0 ? '&nbsp;':rolesLabel;
        var $addLabel = [
            '<tr class="FormData" >',
                '<td class="CaptionTD form-view-label ui-widget-content" width="30%"> ',
                    '<b>'+ $viewLabel + '</b>',
                '</td>',
                '<td class="DataTD form-view-data ui-helper-reset ui-widget-content">',
                    '&nbsp;',
                    '<span>'+ $rolesLabel +'</span>',
                '</td>',
            '</tr>',
        ].join('');

        return $addLabel;
    }

    function nameFormatter (cellValue, options, rowObj) {
        if(_.contains(DEFAULT_ROLEGROUPS_IDS, rowObj.id)) {
            return cellValue + '（默认）';
        }
        return cellValue;
        
    }


	return App.AuthSysApp.RoleGroup.List.View;

});