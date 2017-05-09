define([
    'app/oms/mcht/add/sub/info-view'
], function(InfoView) {
    var _ui = InfoView.prototype.ui;
    var _onRender = InfoView.prototype.onRender;

    return InfoView.extend({
        ui: $.extend({}, _ui, {
            clearSection: '.clear-section'
        }),
        onRender: function(){
            _onRender.call(this, arguments);
            this.doRender();
        },
        doRender: function(){
            var ui = this.ui;

            //只支持普通商户
            ui.dd.find('button').attr('disabled', 'disabled');

            //删除清算信息
            //ui.clearSection.remove();

            //删除委托他人收款
            ui.accountProxy.closest('.account-proxy-type').hide();

            /*.attr('checked', 'checked')
            .trigger('change')
            .closest('label')
            .hide();*/
        }
    });

});