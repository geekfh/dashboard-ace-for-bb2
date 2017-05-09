/**
 * Created by wupeiying on 2016/11/10.
 * 修改页面
 */
define([
	'app/oms/route/settlement/regularConfig/common/AbstractAddModelView',
	'app/oms/route/settlement/regularConfig/common/FieldsetGroup',
	'tpl!app/oms/route/settlement/regularConfig/edit-add-regularConfig.tpl',
	'assets/scripts/fwk/component/ajax-select',
	'common-ui',
	'select2',
	'bootstrap-datepicker'
], function(AbstractAddModelView, FieldsetGroup, tpl) {

	var editView = AbstractAddModelView.extend({

		title: '修改-出款特定路由配置',

		conditions:  [
			{type: 'total_amt'},
			{type: 'tx_time'}
		],

		formTemplate: tpl,

		initialize: function () {
			AbstractAddModelView.prototype.initialize.apply(this, arguments);
		},

		serializeFormData: function () {
			return {
				data: this.model.toJSON()
			};
		},

		ajaxOptions: function () {
			return {
				type: 'PUT',
				url: url._('route.settlement.regularConfig.edit', {id: this.model.id})
			};
		},
		events: {
			//'change [name=""]' :  ''
		},

		onRender: function () {
			AbstractAddModelView.prototype.onRender.apply(this, arguments);
			this.doSetup();

			var $form = this.$el.find('form.form');
			$form.validate({
				rules: {
					name: {
						required: true
					},
					priority: {
						required: true,
						number:true
					},
					singleCost: {
						required: true,
						number:true
					},
					tradeRange: {
						required: true
					},
					loaningCost: {
						required: true,
						number:true
					}
				}
			});
		},

		doSetup: function () {
			var me = this;
			//select2选中
			var sl_name = me.$el.find('[name="name"]');
			$(sl_name).select2({
				placeholder: '- 请选择名称 -',
				ajax : {
					type: 'GET',
						dataType: 'json',
						url: 'api/mcht/settle/route/channel/option',
						data: function (term) {
							return {
								basicModId: encodeURIComponent(term)
							};
					},
					results: function (data) {
						return {
							results: data
						};
					}
				},
				id: function (e) {
					return e.basicModId;
				},
				formatResult: function(data){
					return "<div class='select-result'>" + data.name + "</div>";
				},
				formatSelection: function(data){
					return data.name;
				},
				formatNoMatches: function () { return "没有匹配项，请输入其他关键字"; },
				formatInputTooShort: function (input, min) {
					var n = min - input.length;
					return "请输入至少 " + n + "个字符";
				},
				formatSearching: function () {
					return "搜索中...";
				},
				adaptContainerCssClass: function(classname){
					return classname;
				},
				escapeMarkup: function (m) {
					return m;
				}
			});
			$(sl_name).select2('data', {basicModId: me.model.attributes.basicModId, name: me.model.attributes.name});
		},

		getFormValues: function() {
			var $el = this.$el;

			return {
				basicModId: $el.find('[name="name"]').select2('data').basicModId,
				sourceCode:   $el.find('[name="sourceCode"]').val(),
				tradeChannelNo:  $el.find('[name="tradeChannelNo"]').val(),
				isContinue:    $el.find('[name="isContinue"]').val()
			};

		},

		validateForm: function () {
			return this.$el.find('form.form').valid();
		}

	});

	return editView;
});