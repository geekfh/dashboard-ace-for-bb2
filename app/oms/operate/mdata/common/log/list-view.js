define([
    'jquery.jqGrid',
    'moment.override'
],function(){
    var tpl = [
        '<div class="jgrid-container">',
        '<table id="data-move-log-grid-table"></table>',
        '<div id="data-move-log-grid-pager" ></div>',
        '</div>'
    ].join("");

    return Marionette.ItemView.extend({
        template: _.template(tpl),

        initialize: function(options) {
            this.options = options;
        },

        onRender: function () {
            var me = this;

            _.defer(function () {
                me.renderGrid();
            });
        },

        renderGrid: function () {
            var me = this;

            me.grid = App.Factory.createJqGrid({
                caption: '数据迁移日志',
                rsId: 'data.move.log',
                gid: 'data-move-log-grid',
                url: url._('operate.data.move.log') + '?prcName=' + me.options.prcName,
                actionsCol: false,
                nav: {actions: {add: false, search: false}},

                colNames: {
                    id: 'ID',
                    loginId: '操作人员ID',
                    prcName: '过程名称',
                    tabName: '表名称',
                    execInfo: '处理信息',
                    execDate: '处理时间',
                    remark: '备注'
                },

                colModel: [
                    {
                        name: 'id',
                        hidden: true
                    }
                    ,{ name: 'loginId' }
                    ,{ name: 'prcName' }
                    ,{ name: 'tabName' }
                    ,{ name: 'execInfo' }
                    ,{ name: 'execDate' }
                    ,{ name: 'remark' }
                ]
            });
        }
    });

});