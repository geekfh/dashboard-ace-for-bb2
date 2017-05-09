define(['App',
	'tpl!app/oms/auth/user/list/templates/table-ct.tpl',
	'i18n!app/oms/common/nls/auth',
	'assets/scripts/fwk/factory/typeahead.factory',
	'jquery.validate',
	'jquery.jqGrid',
	'common-ui',
	'app/oms/auth/user/list/upload-image-view',
	'jquery.fancybox',
    'bootstrap-datepicker'
], function(App, tableCtTpl, authLang, typeaheadFactory, v, g, CommonUI, UploadImagerCtrl) {

	var ORG_LEVEL_MAP = {};

	var IS_EXPOLRER_MAP = {
		'0': authLang._('user.not.explorer'),
		'1':authLang._('user.is.explorer')
	};

	var GENDER_MAP = {
		'0': authLang._('user.gender.male'),
		'1': authLang._('user.gender.female')
	};

	var STATUS_MAP = {
		'0': authLang._('user.status.normal'),
        '1': authLang._('user.status.stop'),
		'2': authLang._('user.status.submit.perform'),
		//'3': authLang._('user.status.off'), 取消注销状态
        '5': authLang._('user.status.revise.edit'),
		'6': authLang._('user.status.save'),
		'7': '自助注册成功',
		'8': '好哒未实名认证'
	};

	var UPLOAD_IMG_BUTTOM = [
	'<span style="position: relative;">',
		'<button>添加图片</button>',
    '</span>'
	].join('');

	var DEFAULT_ROLEGROUP_KEY = 'add.default.roleGroupId';
	
	App.module('AuthSysApp.User.List.View', function(View, App, Backbone, Marionette, $, _) {

		View.Users = Marionette.ItemView.extend({
			tabId: 'menu.auth.opr',
			template: tableCtTpl,

			events: {

			},

			onRender: function() {
				var me = this;

				ORG_LEVEL_MAP = createOrgLevelMap();

				setTimeout(function() {
					me.renderGrid();
				}, 1);
			},

   	     	showEditView: function (id, rowData) {
   	     		var me = this;
               	require(['app/oms/auth/user/edit/edit-view'], function(View) {
	                console.info('new editView users');
	                Opf.ajax({
	                    type: 'GET',
	                    url: url._('user',{id: id}),
	                    success: function(data) {
	                        var editView = new View(data, rowData); 
	                        editView.render();
                            
                            bindBackBtnEvent(editView, me.$el);
							App.getCurTabPaneEl().append(editView.$el);

	                    }
	                });
	            });
            },

			loadRepeatPwdHandle: function (rowData){
				var me = this;
				var html = [
					'<div id="resetPwdView">',
					'<div id="div_defaultPwd" style="padding: 10px 0 0 60px;">',
					'<div class="checkbox" style="padding: 10px 0 0 30px;width: 150px;">',
					'<label style="font-size:10px;">',
					'<input id="defaultPwd" name="checkbox" type="checkbox" value="0" checked="true" /> 重置默认密码',
					'</label>',
					'</div>',
					'<div id="div_newPwd" style="padding: 10px 0 0 10px;">',
					'<span style="padding-right: 10px;">新密码:</span>',
					'<input id="pd_newPwd" type="password" style="width: 160px;" disabled=true />',
					'<input id="hd_pwd" type="hidden" />',
					'</div>',
					'</div>',
					'<br>',
					'</div>'
				].join('');

				var str_pwd = '123456';
				var $dialog = Opf.Factory.createDialog(html, {
					destroyOnClose: true,
					title: '重置密码',
					autoOpen: true,
					width: 350,
					modal: true,
					buttons: [{
						type: 'submit',
						text: '确定',
						click: function () {
							if($(this).find('#defaultPwd').attr('checked') != 'checked'){
								str_pwd = $dialog.find('#pd_newPwd').val();
							}
							Opf.ajax({
								type: 'PUT',
								jsonData: {
									id: rowData.id,
									password: str_pwd
								},
								url: url._('operators.reset.password'),
								successMsg: '重置成功!',
								success: function () {
									me.trigger('reloadGrid', {current: true});
								},
								complete: function () {
									$dialog.dialog('close');
								}
							});
						}
					}, {
						type: 'cancel'
					}]
				});

				$dialog.find('#defaultPwd').on('click', function(){
					if($(this).attr('checked') == 'checked'){//不隐藏
						$(this).removeAttr('checked', 'true');
						$('#pd_newPwd').removeAttr('disabled', true);
					}
					else{
						$(this).attr('checked', 'true');
						$('#pd_newPwd').attr('disabled', true);
						$('#pd_newPwd').val('');
					}
				});
			},

			checkTopLevel: function(rowData){
				var me = this;
				Opf.ajax({
					type: 'GET',
					url: url._('user.toplevel', {id: rowData.id}),
					success: function(res){
						var html = [
							'<table class="table" style="width:100%; min-width: 100%;max-width: 100%;">',
							'<thead>',
							'<tr>',
							'<td>所属</td>',
							'<td>姓名</td>',
							'<td>手机号码</td>',
							'<td>推荐码</td>',
							'</tr>',
							'</thead>',
							'<tbody>',
							'<tr>',
							'<td>直属上级盒伙人</td>',
							'<td name="soprName"></td>',
							'<td name="soprPhone"></td>',
							'<td name="soprInviteCode"></td>',
							'</tr>',
							'<tr>',
							'<td>顶级盒伙人</td>',
							'<td name="toprName"></td>',
							'<td name="toprPhone"></td>',
							'<td name="toprInviteCode"></td>',
							'</tr>',
							'</tbody>',
							'</table>'].join('');
						var $dialog = Opf.Factory.createDialog(html, {
							destroyOnClose: true,
							title: '查看上级',
							autoOpen: true,
							width: 400,
							modal: true,
							buttons: [{
								type: 'cancel'
							}],
							create: function(){
								var $me = $(this);
								$me.find('td[name="soprName"]').text(res.superOprResp["oprName"] || '');
								$me.find('td[name="soprPhone"]').text(res.superOprResp["oprPhone"] || '');
								$me.find('td[name="soprInviteCode"]').text(res.superOprResp["oprInviteCode"] || '');
								$me.find('td[name="toprName"]').text(res.topOprResp["oprName"] || '');
								$me.find('td[name="toprPhone"]').text(res.topOprResp["oprPhone"] || '');
								$me.find('td[name="toprInviteCode"]').text(res.topOprResp["oprInviteCode"] || '');
							}
						});
					}
				});
			},
			renderGrid: function() {
				var me = this;
		
				var grid = me.grid = App.Factory.createJqGrid({
					rsId: 'users',
					caption: authLang. _('operator.txt'),
					filters: [
						{
							caption: '条件过滤',
							defaultRenderGrid: false,
							canSearchAll: true,
							canClearSearch: true,
							components: [
								{
									label: authLang._('user.name'),
									name: 'name',
									options: {
										sopt: ['eq']
									}
								},{
									label: authLang._('user.login.name'),
									name: 'loginName',
									options: {
										sopt: ['eq']
									}
								},{
									label: authLang._('user.mobile'),
									name: 'mobile',
									options: {
										sopt: ['eq']
									}
								},{
									label: authLang._('user.cardNo.txt'),
									name: 'cardNoTxt',
									options: {
										sopt: ['eq']
									}
								}, {
									label: authLang._('user.oprInviteCode'),
									name: 'oprInviteCode',
									options: {
										sopt: ['eq']
									}
								}
							],
							searchBtn: {
								text: '搜索'
							}
						}
					],
					actionsCol: {
						width: 120,
						canButtonRender: function(name, opts, rowData) {
							if(name === 'del' &&
								(rowData.brhCode !== Ctx.getUser().get('brhCode') ||
									rowData.status == 2 || rowData.status == 5
								))
							{
								return false;
							}
							if(name === 'edit' && rowData.status != 0){
								return false;
							}
							// status {Number}
							// 0正常
							// 1停用
							// 3注销
							var status = rowData.status;
							if(name === 'changestate' && !(status == 0 || status == 1)){
								return false;
							}
							if(name === 'repeatPassword' && status != 0){
								return false;
							}
							if(name === 'checkTopLevel' && (rowData.isExplorer == "0" || rowData.brhCode != "015001" || rowData.oprInviteCode == null)){
								return false;
							}
						},
						extraButtons: [
							{
								name: 'changestate', icon: 'icon-opf-state-change', title: '状态变更',
								click: function (name, opts, rowData) {
									showChangeStateDialog(me, rowData);
								}
							},
							{
								name: 'repeatPassword', title: '重置密码', icon: 'icon-key orange2',
								click: function(name, obj, rowData){
									me.loadRepeatPwdHandle(rowData);
								}
							},
							{
								name: 'checkTopLevel', title: '查看盒伙人上级和顶级', icon: 'icon-info-sign',
								click: function(name, obj, rowData){
									me.checkTopLevel(rowData);
								}
							},
							{
								name: 'changeStateView', icon: 'icon-zoom-in orange2', title: '查看状态变更记录',
								click: function (name, opts, rowData){
									require(['app/oms/mcht/common/changeStateView/list-view'], function(changeStateView){
										var csView = new changeStateView({mchtId: rowData.id, url: 'mcht.auth.changeStateView'}).render();
										csView.showDialog(changeStateView);
										csView.$el.on('reloadParentGrid',function(){
											me.grid.trigger('reloadGrid');
										});
									});
								}
							}
						]
					},
					nav: {
						actions: {
							//管理员通过角色组查询
							search: Ctx.getUser().get('brhCode') === '000' &&  Ctx.getUser().get('loginName') === 'admin',
							addfunc: function() {
								App.trigger('user:add');
							},
							viewfunc: function(id) {
								var rowData = grid._getRecordByRowId(id);
								App.trigger('user:show', id, rowData);
							},
							editfunc: function(id) {
								var rowData = grid._getRecordByRowId(id);
								me.showEditView(id, rowData);
								me.$el.hide();
							}
						},
						formSize: {
							width: Opf.Config._('ui', 'users.grid.form.width'),
							height: Opf.Config._('ui', 'users.grid.form.height')
						}
					},
					gid: 'users-grid',//innerly get corresponding ct '#users-grid-table' '#users-grid-pager'
					url: url._('user'),
					colNames: [
						authLang._('user.id'),
						authLang._('user.name'),
						authLang._('user.login.name'),
						authLang._('user.mobile'),
						authLang._('user.status'),
						authLang._('user.is.explorer.txt'),
						authLang._('user.brhName'),
						authLang._('user.brhLevel'),
						authLang._('user.oneAgent'),
						authLang._('user.register.date'),
						authLang._('user.brhCode'),
						authLang._('user.role-group'),//authLang._('user.role-group.id'),

						authLang._('user.role-group'),//authLang._('user.role-group.id'),
						authLang._('user.rule.id'),
						authLang._('user.rule.name'),
						authLang._('user.cardNo.txt'),  // '身份证号码',

						authLang._('user.idCardFront.txt'),  // '身份证照片',
						authLang._('user.personWithIdCard.txt'),  // '手持身份证照片',
						authLang._('user.cardType.txt'),  // '证件类型',
						authLang._('user.gender'),
						authLang._('user.tel'),
						authLang._('user.email'),
						authLang._('user.oprInviteCode'), //邀请码
						authLang._('user.oprBeinvitedCode') //被邀请码

					],

					responsiveOptions: {
						hidden: {
							ss: ['ruleId','roleGroupId', 'cardNo', 'roleGroupName', 'loginName', 'ruleName','isExplorer','gender', 'status', 'registerDate', 'tel', 'mobile', 'email', 'brhName'],
							xs: ['ruleId','roleGroupId', 'cardNo', 'roleGroupName', 'isExplorer', 'gender', 'status', 'registerDate', 'tel', 'mobile', 'email', 'brhName'],
							sm: ['ruleId','roleGroupId', 'cardNo', 'roleGroupName', 'status', 'registerDate', 'tel', 'email'],
							md: ['ruleId','roleGroupId', 'cardNo', 'roleGroupName', 'tel', 'email'],
							ld: ['ruleId','roleGroupId', 'cardNo', 'roleGroupName', 'tel', 'email']
						}
					},

					colModel: [
						{name: 'id', index: 'id', search:false, editable: false, hidden:true, _searchType:'string'},
						{name: 'name', index: 'name', search:false, editable: true, _searchType:'string'},
						{name: 'loginName', index: 'loginName', search:false, editable: true, _searchType:'string'},
						{name: 'mobile', index: 'mobile', search:false, editable: true, hidden:true},
						{name: 'status', index: 'status', search:false,editable: true, formatter: statusFormatter,
							stype:'select',
							searchoptions:{
								sopt:['eq','ne'],
								value: STATUS_MAP
							},
							edittype:'select',
							editoptions: {
								value: STATUS_MAP
							}

						},
						{name: 'isExplorer',    index: 'isExplorer',    search:false,editable: true, formatter: isExplorerFormatter,
							stype:'select',
							searchoptions:{
								sopt:['eq'],
								value: IS_EXPOLRER_MAP
							},
							edittype:'select',
							editoptions: {
								value: IS_EXPOLRER_MAP
							}
						},
						{name: 'brhName',          index: 'brhName',          search:false, editable: false,
							_searchType:'string'
						},
						{name: 'brhLevel',          index: 'brhLevel',        search:false,editable: false, formatter: brhLevelFormatter,
							stype: 'select',
							searchoptions: {
								sopt:['eq'],
								value: ORG_LEVEL_MAP
							}
						},
						{name: 'oneAgent',          index: 'oneAgent',          search:false,editable: false},
						{name: 'registerDate',  index: 'registerDate',  search:false,editable: false,
							searchoptions: {
								dataInit : function (elem) {
									$(elem).datepicker({autoclose: true,format: 'yyyymmdd'});
								},
								sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge']
							}
						},
						{name: 'brhCode',          index: 'brhCode',          search:false,editable: false, hidden: true},

						{name: 'roleGroupId', index: 'roleGroupId', viewable: false, search:false,editable: true, edittype:'select', editoptions:{value:{}}},

						{name: 'roleGroupName', index: 'roleGroupName', search:true, _searchType: 'string', editable: false, editrules : {}},
						{name: 'ruleId',      index: 'ruleId',      search:false,editable: true, edittype:'select', editoptions:{value:{}}},
						{name: 'ruleName',      index: 'ruleName',  hidden: true, viewable: false, search:false,editable: false, editrules : {}},
						{name: 'cardNo', index: 'cardNo', editable: true},

						{name: 'idCardFront',      index: 'idCardFront', editable: true, hidden: true},     //身份证照片
						{name: 'personWithIdCard', index: 'personWithIdCard', editable: true, hidden: true}, //手持身份证照片
						{name: 'cardType', index: 'cardType', editable: false, hidden: true, viewable: false}, //证件类型
						{name: 'gender', index: 'gender', search:false, editable: true, hidden: true, formatter: genderFormatter,
							stype:'select',
							searchoptions:{
								sopt:['eq','ne'],
								value: GENDER_MAP
							},
							edittype:'select',
							editoptions: {
								value: GENDER_MAP
							}
						},
						{name: 'tel',           index: 'tel',           search:false,editable: true},
						{name: 'email',         index: 'email',         search:false,editable: true},
						{name: 'oprInviteCode', index: 'oprInviteCode', search:false},
						{name: 'oprBeinvitedCode', index: 'oprBeinvitedCode', search:false, hidden:true}

					],
					// pager: pagerSelector,// '#users-grid-pager'

					loadComplete: function() {}
				});//ef createGrid 

			}

		});

	});


	function isExplorerFormatter (val) {
		return IS_EXPOLRER_MAP[val] || '';
	}

	function genderFormatter (val) {
		return GENDER_MAP[val] || '';
	}

	function statusFormatter (val) {
		return STATUS_MAP[val] || '';
	}

	function brhLevelFormatter (val) {
		return ORG_LEVEL_MAP[val] || '';
	}

    function bindBackBtnEvent(view, gridEl) {
        var $gridEl = $(gridEl);

        view.on('back', function(){
            setTimeout(function(){
                $(window).trigger('resize');
                $gridEl.show();
            },1);
        });
    }

	function createOrgLevelMap () {
		var maxOrgLevel = Ctx.get('SUPPORT_BRH_LEVEL_LIMIT') || 6;
		var orgLevel = Ctx.getBrhLevel();
		var orgLevelMap = {
			'0': '集团总部',
			'1': '合作机构'
		};
		for(var i = 2; i <= maxOrgLevel; i++){
			orgLevelMap[i + ''] = (i-1) + ' 级代理';
		}
		//去掉当前机构以上的机构级别
		for(var p in orgLevelMap){
			if(orgLevelMap.hasOwnProperty(p) && parseInt(p, 10) < orgLevel){
				delete orgLevelMap[p];
			}
		}
		return orgLevelMap;
	}

    /**
     * @param me {Object} 当前视图对象
     * @param rowData {Object} 表格行数据
     */
    function showChangeStateDialog(me, rowData) {
	    var validator = false;
        var $dialog = Opf.Factory.createDialog(stateFormTpl(rowData), {
            destroyOnClose: true,
            title: '状态变更',
            autoOpen: true,
            width: Opf.Config._('ui', 'mcht.grid.changestate.form.width'),
            height: 350,//Opf.Config._('ui', 'mcht.grid.changestate.form.height')
            modal: true,
            buttons: [{
                type: 'submit',
                click: function () {
                    var $state = $(this).find('[name="state"]');
                    var oldState = rowData.status;
                    var newState = $state.val();
                    var selSateTxt = $state.find('option:selected').text();

	                var remark = $(this).find('[name="remark"]').val();
	                var isValid = validator.form();
	                if(!isValid){
		                return false;
	                }

                    if (oldState != newState) {
                        var addConfirmMessage = '';
                        //一共有三种情况需要额外增加说明：1.正常 -> 停用；2.停用 -> 正常；3.正常/停用 -> 注销
                        //标识为  0：正常；1：停用；3：注销
                        if (newState == '0') {
                            addConfirmMessage = '改为正常后，员工可以正常登录系统！';
                        } else if (newState == "1") {
                            addConfirmMessage = '改为停用后，员工将不能登录系统！';
                        } else if (newState == "3") {
                            addConfirmMessage = '改为注销后，员工将被删除！';
                        }
                        Opf.confirm('您确定更改用户状态为 "' + selSateTxt + '" 吗？<br><br> ' + addConfirmMessage, function (result) {
                            if (result) {
                                //TODO block target
                                Opf.ajax({
                                    type: 'PUT',
                                    jsonData: {
                                        oldStatus: oldState,
                                        newStatus: newState,
                                        remark: remark
                                    },
                                    url: url._('user.changestate', {id: rowData.id}),
                                    successMsg: '更改员工状态成功',
                                    success: function () {
                                        me.grid.trigger('reloadGrid', {current: true});
                                    },
                                    complete: function () {
                                        $dialog.dialog('close');
                                    }
                                });
                            }
                        });
                    } else {
                        $(this).dialog('close');
                    }
                }
            }, {
                type: 'cancel'
            }],
            create: function () {
	            var form = $(this);
	            validator = $(form).validate({
		            errorElement: "span",
		            errorClass: "help-error",
		            focusInvalid: false,
		            rules : {
			            remark : { 'required': true }
		            },
		            highlight: function(element) {
			            // 这里element是DOM对象
			            $(element).closest('.form-group').addClass('has-error');
		            },
		            success: function(element) {
			            element.closest('.form-group').removeClass('has-error');
			            element.remove();
		            },
		            errorPlacement: function(error, element) {
			            error.addClass('help-block').insertAfter(element);
		            }
	            });

                $(this).find('[name="state"]').val(rowData.status);
            }
        });
    }

    function stateFormTpl(rowData) {
        var str = [
            '<form onsubmit="return false;" style="padding-top:12px;">',
            '<table width="100%" cellspacing="0" cellpadding="0" border="0">',
            '<tbody>',
            '<tr class="FormData">',
            '<td class="CaptionTD" style="padding-right:10px;">员工状态:</td>',
            '<td class="DataTD">',
            '&nbsp;',
            '<select role="select" name="state" size="'+rowData.status+'" class="FormElement ui-widget-content ui-corner-all">',
            '<option value="0">正常</option>',
            '<option value="1">停用</option>',
            '<option value="3">注销</option>',
            '</select>',
            '</td>',
            '</tr>',
	        '<tr class="FormData">',
	        '<td class="CaptionTD" style="padding-right:10px;">备注:</td>',
	        '<td class="DataTD">',
	        '&nbsp;',
	        '<textarea name="remark" placeholder="状态变更原因，必填项" style="max-width: 198px; max-height: 97px;width: 198px; height: 97px;"></textarea>',
	        '</td>',
	        '</tr>',
            '</tbody>',
            '</table>',
            '</form>',
        ].join('');

        return str;
    }

	return App.AuthSysApp.User.List.View;

});