/**
 * Created by liliu on 2016/11/30.
 */
define([
	'App',
	'jquery.jqGrid'
], function(App){
	var html = [
		'<div class="row">',
		'<div class="col-xs-12 jgrid-container">',
		'<table id="oms-page-system-union-grid-table"></table>',
		'<div id="oms-page-system-union-grid-pager"></div>',
		'</div>',
		'</div>'
	].join('');

	var STATE_MAP = {
		'0': '关闭',
		'1': '正常'
	};

	var View = Marionette.ItemView.extend({
		tabId:'oms.menu.system.union',
		template: _.template(html),
		onRender: function(){
			var me = this;
			_.defer(function(){
				me.renderGrid()
			});
		},
		renderGrid: function(){
			var setupValidation = Opf.Validate.setup;
			var addValidateRules = function(form){
				Opf.Validate.addRules(form, {
					rules: {
						serviceName: {
							'required': true
						},
						statue: {
							'required': true
						},
						remark: {
							'required': true
						},
						rootUrl: {
							'required': true
						}
					}
				})
			};
			var grid = App.Factory.createJqGrid({
				rsId: '*',
				gid: 'oms-page-system-union-grid',
				url: url._('system.setting.unionPlatform'),
				nav:{
					add: {
						beforeShowForm: function(form){
							var $form = $(form),
								$statue = $form.find('select#statue');

							addValidateRules(form);

							//默认状态为正常
							$statue.val('1');
						},
						beforeSubmit: setupValidation
					},
					edit: {
						beforeShowForm: function(form){
							var $form = $(form),
								$serviceName = $form.find('input#serviceName'),
								$statue = $form.find('select#statue');

							addValidateRules(form);

							if($serviceName.val() == 'oms'){
								$serviceName.attr("disabled", "disabled");
								$statue.val('1');
								$statue.attr("disabled", "disabled");
							}
						},
						beforeSubmit: setupValidation
					}
				},
				actionsCol:{
					del:false
				},
				colNames: {
					id: '',
					serviceName: '服务名称',
					statue: '状态',
					rootUrl: '服务root地址',
					remark: '服务描述'
				},
				colModel: [
					{name: 'id', hidden: true},
					{name: 'serviceName', editable: true, search: true, searchoptions:{sopt:['eq']}},
					{name: 'statue', editable: true, search: true, searchoptions:{sopt:['eq']}, formatter:formatState,
						edittype: 'select',editoptions: {
						value: STATE_MAP
					}},
					{name: 'rootUrl', editable: true, search: true, searchoptions:{sopt:['eq']}},
					{name: 'remark', editable: true, search: false}
				]
			});
			return grid;
		}
	});

	function formatState(val){
		return STATE_MAP[val];
	}

	return View;
});