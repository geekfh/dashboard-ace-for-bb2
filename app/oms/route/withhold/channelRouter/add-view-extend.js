/**
 * Created by wupeiying on 2016/11/11.
 * 新增页面
 */
define([
	'app/oms/route/withhold/channelRouter/edit-view',
	'common-ui'
], function(AddChannelModelView) {

	var addView = AddChannelModelView.extend({
		initialize: function () {
			AddChannelModelView.prototype.initialize.apply(this, arguments);
		},

		ajaxOptions: function () {
			return {
				type: 'POST',
				url: url._('route.withhold.channelRouter.list')
			};
		},

		doSetup: function () {
			var me = this;
		},

		serializeFormData: function () {
			return {
				data: this.model.toJSON()
			};
		}

	});

	return addView;
});