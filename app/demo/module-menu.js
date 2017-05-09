/**
 * Module menu
 * Author hefeng(@iboxpay.com)
 * Date 2016/7/15
 * Desc 页面菜单显示设置(特别说明：用来打开层级关系的叫层级菜单，用来打开页面的叫跳转菜单)
 *
 * rsId 菜单权限标识，必须唯一。格式：{moduleId}.menu.{your.module.path} 如demo.menu.grid.list
 * name 菜单名，从i18N文件(nls/menu)里面取，必须唯一。格式：同上
 * iconCls 菜单前面的图片(http://fontawesome.io/3.2.1/icons/)，一般只需要配置顶级菜单。格式：icon-*
 * deps 菜单依赖项。一般只需要配置菜单页面对应的视图。只能配置在跳转菜单。建议：同一级菜单下的模块触发事件和逻辑都写在controller里面。
 * trigger 触发事件名。一般定义在菜单视图里面，我们是根据触发事件来加载页面的。只能配置在跳转菜单。格式：{moduleId}:evt:{your.module.path} 如demo:evt:grid:list
 * items 这是一个递归配置项。
 */
define([
    'i18n!app/demo/common/nls/module-lang'
], function(menusLang) {

    return {
        menuRoot: [
            // grid
            {
                rsId: 'demo.menu.grid',
                iconCls: 'icon-opf-param-config',
                name: menusLang._('demo.menu.grid'),
                items: [
                    // list1
                    {
                        rsId: 'demo.menu.grid.list1',
                        name: menusLang._('demo.menu.grid.list1'),
                        deps: ['app/demo/grid/controller'],
                        trigger: 'demo:evt:grid:list1'
                    },

                    // list2
                    {
                        rsId: 'demo.menu.grid.list2',
                        name: menusLang._('demo.menu.grid.list2'),
                        deps: ['app/demo/grid/controller'],
                        trigger: 'demo:evt:grid:list2'
                    },

                    // list3
                    {
                        rsId: 'demo.menu.grid.lists',
                        name: menusLang._('demo.menu.grid.lists'),
                        items: [
                            //DEMOS
                            {
                                rsId: 'demo.menu.grid.list3',
                                name: menusLang._('demo.menu.grid.list3'),
                                deps: ['app/demo/grid/controller'],
                                trigger: 'demo:evt:grid:list3'
                            },

                            // 动态表头
                            {
                                rsId: 'demo.menu.grid.list4',
                                name: menusLang._('demo.menu.grid.list4'),
                                deps: ['app/demo/grid/controller'],
                                trigger: 'demo:evt:grid:list4'
                            }
                        ]
                    }
                ]
            },

            // others
            {
                rsId: "demo.menu.others",
                iconCls: 'icon-opf-iboxpay',
                name: menusLang._('demo.menu.others'),
                items: [
                    //测试
                    {
                        rsId: 'demo.menu.others.test',
                        name: menusLang._('demo.menu.others.test'),
                        deps: ['app/demo/others/controller'],
                        trigger: 'demo:evt:others:test'
                    },

                    //编辑器
                    {
                        rsId: 'demo.menu.others.ckeditor',
                        name: menusLang._('demo.menu.others.ckeditor'),
                        deps: ['app/demo/others/controller'],
                        trigger: 'demo:evt:others:ckeditor'
                    },

                    //时间控件
                    {
                        rsId: 'demo.menu.others.datetimepicker',
                        name: menusLang._('demo.menu.others.datetimepicker'),
                        deps: ['app/demo/others/controller'],
                        trigger: 'demo:evt:others:datetimepicker'
                    },

                    //backgrid
                    {
                        rsId: 'demo.menu.others.backgrid',
                        name: menusLang._('demo.menu.others.backgrid'),
                        deps: ['app/demo/others/controller'],
                        trigger: 'demo:evt:others:backgrid'
                    },

                    //select2
                    {
                        rsId: 'demo.menu.others.select2',
                        name: menusLang._('demo.menu.others.select2'),
                        deps: ['app/demo/others/controller'],
                        trigger: 'demo:evt:others:select2'
                    },

                    //echarts
                    {
                        rsId: 'demo.menu.others.echarts',
                        name: menusLang._('demo.menu.others.echarts'),
                        deps: ['app/demo/others/controller'],
                        trigger: 'demo:evt:others:echarts'
                    },

                    //jqGrid
                    {
                        rsId: 'demo.menu.others.jqGrid',
                        name: menusLang._('demo.menu.others.jqGrid'),
                        deps: ['app/demo/others/controller'],
                        trigger: 'demo:evt:others:jqGrid'
                    },

                    //bootstrap
                    {
                        rsId: 'demo.menu.others.bootstrap',
                        name: menusLang._('demo.menu.others.bootstrap'),
                        deps: ['app/demo/others/controller'],
                        trigger: 'demo:evt:others:bootstrap'
                    }
                ]
            }
        ]
    }
});
