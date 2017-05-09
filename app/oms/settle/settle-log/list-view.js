define([
    'tpl!app/oms/settle/settle-log/template/table-ct.tpl',
    'jquery.jqGrid',
    'app/oms/settle/commonSettleStatus'
], function (tpl, undefined, comstatus) {

    var View = Marionette.ItemView.extend({
        template: tpl,
        tabId: 'menu.settle.log',

        onRender: function () {
            var me = this;

            _.defer(function () {
                me.renderGrid();
            });
        },

        renderGrid: function () {

            var me = this;
            var grid = this.grid = App.Factory.createJqGrid({
                rsId: 'settleLog',
                caption: 'cp_settleLog',
                gid: 'settle-log-grid', // 这个就是对应表格的 id
                url: url._('settle.log.search'),
                actionsCol: {
                    edit : false,
                    del: false
                },
                nav: {
                    actions: {
                        add: false
                    }
                },
                colNames: {
                    id: '',
                    oprName: '操作人',
                    recordKey: '操作记录',
                    page: '操作页面',
                    name: '操作名称',
                    descr: '操作描述',
                    oldStatus: '原值',
                    newStatus: '修改后值',
                    s_Status: '值',
                    time: '操作时间'
                },
                colModel: [
                    { name: 'id', hidden: true },
                    { name: 'oprName', search:true }, //操作人
                    { name: 'recordKey' }, //操作记录
                    { name: 'page', formatter: pageFormatter}, //操作页面
                    { name: 'name', search:true }, //操作名称
                    { name: 'descr' }, //操作描述
                    { name: 'oldStatus', formatter: mapFormatter}, //原值
                    { name: 'newStatus', formatter: mapFormatter}, //修改后值
                    //{ name: 's_Status', formatter: statusFormatter},
                    { name: 'time', formatter: timeFormatter } //操作时间
                ],

                loadComplete: function(data) {
                    //console.log('aaaaaaa: ' + comstatus);
                }
            });

            return grid;
        }
    });

    App.on('settle:log:list', function () {
        App.show(new View());
    });

    function pageFormatter(val){
        return comstatus[val].page || '';
    }

    function mapFormatter(val, options, rowData){
        var arr_map = rowData.page; var rp = comstatus[arr_map];//获取page值

        if(val == null){
            return '';
        }
        else{
            return rp.map[arr_map, val] || ''; //val + ' : ko : ' +
        }
    }

    function timeFormatter(val) {
        return val ? moment(val, 'YYYYMMDDHHmm').format('YYYY/MM/DD HH:mm') : '';
    }

    //function statusFormatter(val, options, rowData){
    //    var old_status = rowData.oldStatus;
    //    var new_status = rowData.newStatus;
    //    return old_status + '改为' + new_status;
    //}

    return View;

});