/**
 * 外卡商户进件资料确认提交
 */
define([
    'app/oms/mcht/add/sub/confirm-view',
    'tpl!app/oms/mcht/wildcard/add/templates/add-confirm.tpl',
    'app/oms/mcht/wildcard/common/config-info2'
], function(ConfirmView, tpl, wildcardInfo2Conf) {
    var _serializeData = ConfirmView.prototype.serializeData;

    return ConfirmView.extend({
        template: tpl,
        serializeData: function () {
            var sData = _serializeData.call(this, arguments);
                sData.formLayout.wildcard_section = wildcardInfo2Conf;

            return sData;
        }
    });
});