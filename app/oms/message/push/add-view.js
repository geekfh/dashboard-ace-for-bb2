define([
    'app/oms/message/common/common-add'
], function(AddView) {
    var _ui = AddView.prototype.ui;

    return AddView.extend({
        ui: _.extend({
            msgTerminalType: "#msg_push_terminalType",
            msgTerminalTypeContainer: "#msg_push_terminalTypeContainer",
            msgBack: "#msg_push_back",
            msgConfirm: "#msg_push_confirm",
            msgTips: "#msg_push_tips"
        }, _ui),

        updateUi: function() {
            var ui = this.ui;
            var kind = 'A2';
            this.uploadUrl = url._('upload.xls');

            this.$el.find('tr.FormData').each(function(){
                var $this = $(this);
                var belong = $this.attr('belong') || false;
                var neeShow = belong && belong.indexOf(kind) !== -1;
                $this.toggle(neeShow);
            });

            ui.pushContentTr.show();
            ui.pushContentTr.insertBefore(ui.pushPositionTr);
            ui.pushObjectTr.find('.CaptionTD').text('推送对象');
            ui.pushDeviceTr.find('.CaptionTD').text('推送设备');
        },

        setDefaultData: function(data) {
            var me = this, ui = me.ui;

            var pushObject = data.pushObject;
            var msgType = me._getValueStr(pushObject, 0);
            var btn = ui.msgTerminalType.find('button[data-msg-type="'+msgType+'"]');
                btn.trigger('click'); //第一次trigger设置radio的value值

            ui.pushObject.eq(1).prop('checked', true);
            ui.pushObject.filter('[value="'+pushObject+'"]').prop('checked', true);
            ui.pushObjectRange.filter('[value="'+pushObject+'"]').prop('checked', true);

            me.setPushDetailValue(data); //ui.pushObjectRangeTr.is(':visible') &&
            me.setPushDeviceValue(data.pushDevice);
            ui.pushContent.val(data.pushContent);
            ui.pushPosition.val(data.pushPosition);
            me.setPushTypeValue(data.pushType);
            me.setPushDateValue(data.pushDate);

            btn.trigger('click'); //第二次trigger触发radio的change事件
        },
        getMsgType: function () {
          return 'msgPush';
        },

        getValue: function() {
            var me = this, ui = this.ui;

            return _.extend({
                //pushObject: ui.pushObject.filter(':checked').val(),
                //pushDetail: me.getPushDetail(),
                pushDevice: ui.pushDevice.val(),
                pushContent: me.getPushContent(),
                pushPosition: ui.pushPosition.val(),
                pushType: ui.pushType.closest(':checked').val(),
                pushDate: me.getPushDate()
            }, me.getPushObject(), me.getPushDetail());
        }
    });
});