/**
 * User hefeng
 * Date 2016/7/18
 */
define([
    'tpl!app/demo/others/test/templates/test.tpl'
], function(testTpl) {

    // 配置视图
    return Marionette.ItemView.extend({
        // TAB唯一标识
        tabId: 'demo.menu.others.test',

        tabUnload: function() {
            return window.confirm("你确定要退出页面吗？");
        },

        template: testTpl,

        ui: {
            $p: 'p'
        },

        onRender: function () {
            var me = this;

            _.defer(function () {
                me.renderPage();
            });
        },

        renderPage: function () {
            var me = this,
                ui = me.ui;

            //ui.$p();
        }
    });

});