/**
 * User hefeng
 * Date 2016/7/18
 */
define([
    'assets/scripts/entities/page/list-view'
], function(PageView) {

    // 配置视图
    return PageView.extend({
        // TAB唯一标识
        tabId: 'demo.menu.grid.list2',

        gridOption: {
            caption: 'DEMO2',

            rsId:'demo.pm.grid.list2',

            gid: 'demo-page-grid-list2-grid',

            url: url._('demo.api.grid.list2'),

            filters: [
                {
                    caption: '精准搜索',
                    defaultRenderGrid: true,
                    canSearchAll: false,
                    components: [
                        {
                            label: '商户名称',
                            name: 'name'
                        }
                    ],
                    searchBtn: {
                        text: '搜索'
                    }
                }
            ],

            actionsCol: {
                //view: false
                //width: 300,
                //edit: false,
                //del : false,
                extraButtons:[
                    {
                        name: 'changeState', title: '更改状态', icon: 'icon-unlink',
                        click: function(type, btnConf, rowData) {
                            Opf.alert({
                                title: type,
                                message: JSON.stringify(rowData)
                            });
                        }
                    }
                ]
            },

            colNames: {
                id: 'ID',
                field1: '字段1',
                field2: '字段2',
                field3: '字段3'
            },

            colModel: [
                { name:'id', index:'id', hidden:true },
                { name:'field1', index:'field1', editable:true },
                { name:'field2', index:'field2', editable:true },
                { name:'field3', index:'field3', viewable:false, search:true }
            ]
        }
    });

});