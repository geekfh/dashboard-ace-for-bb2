/**
 * Module permission
 * Author hefeng(@iboxpay.com)
 * Date 2016/7/15
 * Desc 页面菜单和操作按钮权限设置（这里配置“跳转菜单”的权限）
 *
 * rs2pm 跳转菜单关联权限码配置
 * rs 菜单权限码依赖关系配置
 *
 * 菜单权限标识构成 同menu-rsId。
 * 页面权限标识构成 {moduleId}.pm.{your.module.path}.{actionName} 如：demo.pm.others.ckeditor.add。
 * 后端权限码构成 {moduleId}:{pmcode}:{action} 如：demo:pmcodelist1:c
 *
 * c 新增/创建
 * r 查看详情/获取数据
 * u 编辑记录/更新数据
 * d 删除记录/删除数据
 * s 查询数据
 * x 自定义
 */
define({
    permissionRoot: {
        // 关联页面权限
        //< resourceId, permissionCodes<String/Array> >
        rs2pm: {
            "demo.menu.grid.list1": "demo:pmcodelist1:*", // *表示拥有页面所有权限码
            "demo.menu.grid.list2": "demo:pmcodelist2:*", // *表示拥有页面所有权限码
            "demo.menu.grid.list3": "demo:pmcodelist3:*", // *表示拥有页面所有权限码

            "demo.menu.others.ckeditor": [
                "demo:pmcodeckeditor:c", // 页面新增按钮权限
                "demo:pmcodeckeditor:r", // 页面详情按钮权限
                "demo:pmcodeckeditor:u", // 页面编辑按钮权限
                "demo:pmcodeckeditor:s", // 页面查询/刷新按钮权限
                "demo:pmcodeckeditor:d", // 页面删除按钮权限
                "demo:pmcodeckeditor:cus" // 页面自定义按钮权限
            ],
            /* page permission start */
            "demo.pm.others.ckeditor.add": "demo:pmcodeckeditor:c",
            "demo.pm.others.ckeditor.view": "demo:pmcodeckeditor:r",
            "demo.pm.others.ckeditor.edit": "demo:pmcodeckeditor:u",
            "demo.pm.others.ckeditor.search": "demo:pmcodeckeditor:s",
            "demo.pm.others.ckeditor.refresh": "demo:pmcodeckeditor:s",
            "demo.pm.others.ckeditor.del": "demo:pmcodeckeditor:d",
            "demo.pm.others.ckeditor.custom": "demo:pmcodeckeditor:cus",
            /* page permission end */

            "demo.menu.others.datetimepicker": "demo:pmcodedatetimepicker:*"
        },

        // 关联菜单权限
        rs: {
            // menu-grid
            "demo.menu.grid": [
                "demo.menu.grid.list1",
                "demo.menu.grid.list2",
                "demo.menu.grid.lists"
            ],

            // menu-grid-lists
            "demo.menu.grid.lists": [
                "demo.menu.grid.list3"
            ],

            // menu-others
            "demo.menu.others": [
                "demo.menu.others.ckeditor",
                "demo.menu.others.datetimepicker"
            ]
        }
    }
});
