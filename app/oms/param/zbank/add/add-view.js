define([
    'App',
    'tpl!app/oms/param/zbank/add/templates/info.tpl',
    'common-ui'
], function(App, infoTpl){

    return Marionette.ItemView.extend({
        template: infoTpl,

        initialize: function(options){
            this.renderTo = options.renderTo;
        },

        ui: {
            zbankProvince: '[name="zbankProvince"]',
            zbankCity: '[name="zbankCity"]',
            zbankRegionCode: '[name="zbankRegionCode"]'
        },

        onRender: function() {
            var me = this;
            var ui = me.ui;

            //render html
            me.renderTo.append(me.$el.children());

            //init dom
            CommonUI.address(ui.zbankProvince, ui.zbankCity, ui.zbankRegionCode);
        }
    });
});