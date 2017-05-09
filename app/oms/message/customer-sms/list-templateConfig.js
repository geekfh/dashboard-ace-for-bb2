/**
 * Created by wupeiying on 2015/11/6.
 */

define(['App',
    'jquery.jqGrid',
    'jquery.validate'
], function(App) {

    var tableCtTpl = [
        '<div class="row">',
        '<div class="col-xs-12 jgrid-container">',
        '<table id="template-Config-grid-table"></table>',
        '<div id="template-Config-grid-pager" ></div>',
        '</div>',
        '</div>'].join('');

    var View = Marionette.ItemView.extend({
        template: _.template(tableCtTpl),
        tabId: 'menu.template.Config',
        events: {},
        onRender: function () {
            var me = this;
            _.defer(function () {
                me.renderGrid();
            });
        },
        showDialog: function(){
            Opf.Factory.createDialog(this.$el, {
                dialogClass: 'ui-jqdialog',
                open: true,
                destroyOnClose: true,
                width: 1250,
                height: 600,
                modal: true,
                title: '短信模板配置',
                buttons: [{
                    type: 'cancel',
                    text: '关闭'
                }]
            });
            $('.ui-jqdialog-content').attr("style","overflow-x:hidden!important;");
        },
        renderGrid: function () {
            var me = this;
            var grid = App.Factory.createJqGrid({
                rsId: 'templateConfig',
                caption: '',
                nav: {
                    actions: {
                        search: false
                    }
                },
                actionsCol: {
                    view: false
                },
                gid: 'template-Config-grid',
                url: url._('message.template.Config.list'),
                colNames: {
                    id: '',
                    name: '短信类型名称',
                    descr: '短信类型描述',
                    createTime: '创建时间',
                    updateTime: '更新时间',
                    createOprId: '创建人ID',
                    updateOprId: '修改人ID',
                    createOpr: '创建人'
                },
                colModel: [
                    {name: 'id', hidden: true},//
                    {name: 'name', editable: true},// 短信标题
                    {name: 'descr', editable: true, edittype: 'textarea'},//短信类型描述
                    {name: 'createTime', formatter: dateFormatter},//创建时间
                    {name: 'updateTime', formatter: dateFormatter},//更新时间
                    {name: 'createOprId', hidden: true},//创建人ID
                    {name: 'updateOprId', hidden: true},// 修改人ID
                    {name: 'createOpr', hidden: true}// 创建人ID
                ],
                loadComplete: function () {}
            });

            return grid;
        }
    });

    function dateFormatter(val) {
        return val ? moment(val, 'YYYYMMDDHHmm').format('YYYY/MM/DD HH:mm') : '';
    }

    return View;
});