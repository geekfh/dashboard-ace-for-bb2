/**
 * 数据迁移view
 */
define([
    'jquery.jqGrid',
    'bootstrap-datepicker',
    'moment.origin'
], function() {
    var tpl = [
        '<div class="row">',
        '<div class="col-xs-12 jgrid-container">',
            '<table id="<%= data.gid%>-table"></table>',
            '<div id="<%= data.gid%>-pager" ></div>',
        '</div>',
        '</div>'
    ].join("");

    return Marionette.ItemView.extend({
        tabId: 'menu.data.move.xx',
        template: _.template(tpl),
        className: 'data-move',

        serializeData: function(){
            var me = this;
            return {
                data: {
                    gid: me.gridOptions.gid
                }
            }
        },

        gridOptions: {
            caption: '数据迁移',
            rsId: 'data.move.xx',
            gid: 'data-move-xx-grid',
            actionsCol: false,
            nav: {
                actions: {
                    add:false, search:false
                }
            }
        },

        onRender: function() {
            var me = this;

            _.defer(function () {
                me.renderGrid();
            });

        },

        renderGrid: function() {
            var grid = this.grid = App.Factory.createJqGrid(this.gridOptions);
        }

    });
});











