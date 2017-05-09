/**
 * User hefeng
 * Date 2016/7/18
 */
define([
    'tpl!app/demo/others/bootstrap/templates/bootstrap.tpl'
], function(bootstrapTpl) {

    // 配置视图
    return Marionette.ItemView.extend({
        // TAB唯一标识
        tabId: 'demo.menu.others.bootstrap',

        template: bootstrapTpl,

        className: "bootstrap-sample",

        ui: {
            myAffix: '[data-spy="affix"]'
        },

        onRender: function () {
            var me = this;

            me.createBootstrapView();

        },

        createBootstrapView: function () {
            var me = this;

            me.ui.myAffix.affix();
        }
    });

});