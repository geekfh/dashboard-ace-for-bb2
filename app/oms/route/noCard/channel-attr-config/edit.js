define([
    'tpl!app/oms/route/noCard/channel-attr-config/templates/add.tpl',
    'app/oms/route/noCard/channel/add-channel-model-view',
    'common-ui'
], function(tpl,AddChannelConfigView) {

        var editView = AddChannelConfigView.extend({
            title: '修改通道属性配置',
            formTemplate: tpl,
            initialize: function () {
                AddChannelConfigView.prototype.initialize.apply(this, arguments);
        },

        ajaxOptions: function () {
            return {
                type: 'PUT',
                url: url._('route.nocard.channel.config', {id: this.model.id})
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
        },
        getFormValues: function() {
            var $el = this.$el;

            return {
                id:             $el.find('[name="id"]').val(),
                status:         $el.find('[name="status"]').val(),
                channelName:    $el.find('[name="channelName"]').val(),
                channelCnName:  $el.find('[name="channelCnName"]').val(),
                bankMark:       $el.find('[name="bankMark"]').val(),
                code:           $el.find('[name="code"]').val(),
                remark:         $el.find('[name="remark"]').val()
            };

        },
        onChannelNameChange: function () {

        }


    });
    
    return editView;
});