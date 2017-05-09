/**
 * User hefeng
 * Date 2016/7/18
 */
define([
    'tpl!app/demo/others/select2/templates/demo.tpl',
    'select2'
], function(select2Tpl) {

    // 配置视图
    return Marionette.ItemView.extend({
        // TAB唯一标识
        tabId: 'demo.menu.others.select2',

        template: select2Tpl,

        className: "select2-sample",

        ui: {
            select2Container: '.js-source-states'
        },

        onRender: function () {
            var me = this;

            me.createSelect2();
        },

        createSelect2: function() {
            this.ui.select2Container.select2({
                placeholder: '请选择',
                width: 300,
                //closeOnSelect: false,
                allowClear: true
            });
        }
    });

});