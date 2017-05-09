define(['tpl!app/oms/route/oneSettle/channel-attr-config/templates/add.tpl',
    'app/oms/route/oneSettle/channel/add-channel-model-view',
    'app/oms/route/oneSettle/channel-attr-config/add-detail'
],function(tpl,ChannelModelView,AddDetail){

    var view = ChannelModelView.extend({
        title: '新增通道属性配置',
        formTemplate: tpl,
        events: {
            'change select[name="xntdFlag"]': 'onXntdFlagHandle'
        },
        ajaxOptions: {
            type: 'POST',
            url: url._('route.channel.config')
        },
        onXntdFlagHandle: function(){
            var isCheck = $('select[name="xntdFlag"]').find('option:selected').val();
            if(isCheck == 1){
                $('div[name="div-chaZsnm"]').show();
            }
            else{
                $('div[name="div-chaZsnm"]').hide();
            }
        },
        getFormValues: function() {
            var $el = this.$el;
            return {
                id:            $el.find('[name="id"]').val(),
                status:        $el.find('[name="status"]').val(),
                channelName:   $el.find('[name="channelName"]').val(),
                channelCnName: $el.find('[name="channelCnName"]').val(),
                bankMark:      $el.find('[name="bankMark"]').val(),
                code:           $el.find('[name="code"]').val(),
                remark:        $el.find('[name="remark"]').val(),
                xntdFlag:      $el.find('select[name="xntdFlag"]').find('option:selected').val(),
                chaZsnm:       $el.find('[name="chaZsnm"]').val()
            };
        },
        onChannelNameChange: function () {},

        commit:function(params){
            var me = this;
            var model = new Backbone.Model(params);
             new AddDetail({model:model,params:params,callBack: function(params,optionsFx){
                 var myAjaxOptions = me.ajaxOptions;
                 if(!myAjaxOptions.type && !myAjaxOptions.url) {
                     console.error('ajaxOptions 需要配置 url 和 type');
                 }
                 var ajaxOptions = $.extend({
                     jsonData: params,
                     success: function(resp) {
                         me.$dialog.dialog('close');
                         me.destroy();
                         me.trigger('submit:success', resp);
                         optionsFx();
                     }
                 }, myAjaxOptions);

                 Opf.ajax(ajaxOptions);
            }}).render();
        }
    });

    return view;
});