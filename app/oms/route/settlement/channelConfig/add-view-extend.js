/**
 * Created by wupeiying on 2016/11/10.
 */
define([
	'app/oms/route/settlement/channelConfig/edit-view',
	'common-ui'
], function(AddChannelModelView) {

	var addView = AddChannelModelView.extend({
		initialize: function () {
			AddChannelModelView.prototype.initialize.apply(this, arguments);
		},

		ajaxOptions: function () {
			return {
				type: 'POST',
				url: url._('route.settlement.channelConfig.list')
			};
		},

		serializeFormData: function () {
			return {
				data: this.model.toJSON()
			};
		}

	});

	return addView;
});