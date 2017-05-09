/**
 * User hefeng
 * Date 2016/7/18
 * page view
 */
define([
    'tpl!assets/scripts/entities/page/templates/table-ct.tpl',
    'jquery.jqGrid',
    'jquery.validate',
    'bootstrap-datepicker',
    'moment.override'
], function(pageTplFn) {

    // 配置视图
    return Marionette.ItemView.extend({
        // TAB唯一标识
        tabId: 'menu.tab.id',

        template: pageTplFn,

        serializeData: function() {
            var that = this;

            return {
                gid: that.gridOption.gid
            }
        },

        onRender: function () {
            var me = this;

            _.defer(function () {
                me.renderGrid();
            });
        },

        // 表格配置
        gridOption: {
            // GRID标题(可选)
            caption: '',

            // 页面权限标识
            rsId: '',

            // 表格ID
            gid: '',

            // 表格REST请求URL
            url: ''
        },

        renderGrid: function() {
            var that = this;

            var gridOpts = $.extend(true, {}, that.gridOption);

            that.grid = App.Factory.createJqGrid.call(that, gridOpts);
        }
    });

});