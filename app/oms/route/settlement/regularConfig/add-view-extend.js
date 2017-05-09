/**
 * Created by wupeiying on 2016/11/11.
 * 新增页面
 */
define([
	'app/oms/route/settlement/regularConfig/edit-view',
	'common-ui'
], function(AddChannelModelView) {

	var addView = AddChannelModelView.extend({
		initialize: function () {
			AddChannelModelView.prototype.initialize.apply(this, arguments);
		},

		ajaxOptions: function () {
			return {
				type: 'POST',
				url: url._('route.settlement.regularConfig.list')
			};
		},

		doSetup: function () {
			var me = this;

			me.$el.find('[name="name"]').select2({
				placeholder: '--请选择名称--',
				width: '100%',
				ajax: {
					type: "get",
					autoMsg: false,
					url: 'api/mcht/settle/route/channel/option',
					dataType: 'json',
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
		},

		serializeFormData: function () {
			return {
				data: this.model.toJSON()
			};
		}

	});

	return addView;
});