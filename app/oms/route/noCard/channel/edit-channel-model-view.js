define([
    'app/oms/route/noCard/channel/add-channel-model-view',
    'common-ui'
], function(AddChannelModelView) {

    var EditChannelView = AddChannelModelView.extend({
        initialize: function () {
            AddChannelModelView.prototype.initialize.apply(this, arguments);

        },

        ajaxOptions: function () {
            return {
                type: 'PUT',
                url: url._('nocard.route.channel', {id: this.model.id})
            };
        },

        addSelects: function () {
            var channelName = this.model.get('channelName');
            CommonUI.noCradChannelName(this.$el.find('[name="channelName"]'), channelName);
        }, 

        serializeFormData: function () {
            return {
                data: this.model.toJSON()
            };
        }

    });
    
    return EditChannelView;
});