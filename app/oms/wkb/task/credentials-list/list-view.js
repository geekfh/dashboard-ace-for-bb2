/**
 * Created by wupeiying on 2015/8/18.
 */

define(['App',
    'i18n!app/oms/common/nls/mcht',
    'jquery.jqGrid',
    'jquery.validate',
    'upload'
], function(App, mcmgrLang) {

    var STATUS_MAP = {
        0: mcmgrLang._('MCHT.status.0'),
        1: mcmgrLang._('MCHT.status.1'),
        2: mcmgrLang._('MCHT.status.2'),
        3: mcmgrLang._('MCHT.status.3'),
        4: mcmgrLang._('MCHT.status.4'),
        5: mcmgrLang._('MCHT.status.5'),
        6: mcmgrLang._('MCHT.status.6')
    };

    var View = Marionette.ItemView.extend({
        tabId: 'menu.blacklist.credentials',
        template: _.template(['<div class="row">',
        '<div class="col-xs-12 jgrid-container">',
        '<table id="credentials-grid-table"></table>',
        '<div id="credentials-grid-pager" ></div>',
        '</div>',
        '</div>'].join('')),

        initialize: function () {},

        onRender: function() {
            var me = this;
            _.defer(function () {
                me.renderGrid();
            });
        },
        showDialog: function(){
            var me = this;
            Opf.Factory.createDialog(this.$el, {
                dialogClass: 'ui-jqdialog',
                open: true,
                destroyOnClose: true,
                width: 850,
                height: 600,
                modal: true,
                title: '重复证件列表',
                buttons: [{
                    type: 'cancel',
                    text: '关闭'
                }]
            });
            $('.ui-jqdialog-content').attr("style","overflow-x:hidden!important;");
        },
        renderGrid: function() {
            var me = this;
            var grid = me.grid = App.Factory.createJqGrid({
                rsId:'credentialsList',
                caption: '',
                gid: 'credentials-grid',
                url: url._('mcht.blackList.merchants.view'),
                postData: {'mchtNo': me.options.mchtNo,'idNo': me.options.idNo,'licenceNo': me.options.licenceNo},
                actionsCol: { view: false, edit: false, add: false, del: false, refresh: false, search: false },
                nav: {
                    actions: { view: false, edit: false, add: false, del: false, refresh: false, search: false }
                },
                colNames: {
                    id:     	'',
                    mchtNo:     '商户编号',
                    mchtName:   '商户名',
                    status:     '商户状态',
                    idNo:       '身份证号码',
                    licenceNo:	'营业执照号码'
                },
                colModel:[
                    {name:'id',index:'id', hidden:true},
                    {name:'mchtNo',index:'mchtNo',  sortable : false},
                    {name:'mchtName',index:'mchtName',  sortable : false},
                    {name:'status',index:'status', sortable : false, formatter: statusFormatter},
                    {name:'idNo',index:'idNo', sortable : false},
                    {name:'licenceNo',index:'licenceNo', sortable : false}
                ]
            });

            return grid;
        }

    });

    function statusFormatter(val){
        return STATUS_MAP[val] || '';
    }

    return View;

});