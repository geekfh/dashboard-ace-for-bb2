define([
    'app/oms/route/oneSettle/mcht-channel/add-mcht-channel-model-view'
], function(AddMchtChannelModelView) {

    var EditMchtChannelView = AddMchtChannelModelView.extend({
        initialize: function () {
            AddMchtChannelModelView.prototype.initialize.apply(this, arguments);

        },

        ajaxOptions: function () {
            return {
                type: 'PUT',
                url: url._('route.mcht', {id: this.model.id})
            };
        },

        addSelects: function () {
            var regionCode = this.model.get('regionCode');
            var channelName = this.model.get('channelName');

            CommonUI.mccSection(this.$el.find('[name="mccGroup"]'), this.$el.find('[name="mcc"]'), this.model.get('mccGroup'), this.model.get('mcc'));

            regionCode = regionCode ? Opf.Util.parseRegionCode(regionCode) : [];
            CommonUI.address(this.$el.find('[name="province"]'), this.$el.find('[name="city"]'), this.$el.find('[name="regionCode"]'), regionCode[0],  regionCode[1], regionCode[2]);

            CommonUI.channelName(this.$el.find('[name="channelName"]'), channelName);
        },


        serializeFormData: function () {
            return {
                data: this.model.toJSON()
            };
        }

    });
    
    return EditMchtChannelView;
});