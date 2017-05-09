/**
 * Created by liliu on 2017/2/17.
 */
define([
	'app/oms/route/withhold/channelProductConfig/edit-view',
	'common-ui'
], function(AddChannelModelView) {

	var addView = AddChannelModelView.extend({
		initialize: function () {
			AddChannelModelView.prototype.initialize.apply(this, arguments);
		},

		ajaxOptions: function () {
			return {
				type: 'POST',
				url: url._('route.channelProduct.list')
			};
		},

		doSetup: function () {
			var me = this;
		},

		serializeFormData: function () {
			var channelListFunc = (function(){
				var channelList = [];
				return function (){
					if(channelList.length){
						return channelList;
					}else {
						Opf.ajax({
							url: url._('route.channelProduct.channel.query'),
							type: 'GET',
							async: false,
							success: function(resp){
								channelList = resp;
							}
						});
						return channelList;
					}
				}
			})();
			return {
				data: this.model.toJSON(),
				channelList: channelListFunc()
			};
		}

	});

	return addView;
});