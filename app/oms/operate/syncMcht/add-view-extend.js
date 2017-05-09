/**
 * Created by wupeiying on 2016/11/11.
 * 新增页面
 */
define([
	'app/oms/operate/syncMcht/edit-view',
	'common-ui'
], function(AddChannelModelView) {

	var addView = AddChannelModelView.extend({
		initialize: function () {
			AddChannelModelView.prototype.initialize.apply(this, arguments);
		},

		ajaxOptions: function () {
			return {
				type: 'POST',
				url: url._('operate.sync.mchtChannel.list')
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