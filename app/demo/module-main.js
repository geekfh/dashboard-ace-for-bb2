/**
 * Module main
 * Author hefeng(@iboxpay.com)
 * Date 2016/7/15
 * Desc 这里是模块的入口文件，即第一次加载系统模块时这里会被调用
 *
 * module-url 系统接口URL配置文件(必须)
 * module-menu 系统菜单配置文件(必须)
 * module-permission 系统权限配置文件(必须)
 * module-lang 菜单名称(i18N)配置文件(必须)
 *
 * @return 返回对象是固定格式，不能自己添加自定义返回对象
 * @wiki http://wiki.iboxpay.com/pages/viewpage.action?pageId=11831767
 *
 * 注意：如果有自定义模块依赖，请依次配置在依赖列表文件后面。
 * 例如：
 * [
    'app/demo/module-url',
    'app/demo/module-menu',
    'app/demo/module-permission',
    'i18n!app/demo/common/nls/module-lang',
    'app/demo/custom/module' //自定义依赖模块
 * ]
 * 特别说明：如果你在common里面定义了一些工具类和函数集方法，
 * 希望模块加载后就能被调用到，请在依赖项里加载并将此对象挂载到你的模块名下面。
 * 如"App.oms.utils"
 */
define([
    'app/demo/module-url',
    'app/demo/module-menu',
    'app/demo/module-permission',
    'app/demo/module-config',
    'i18n!app/demo/common/nls/module-lang'
], function(Url, Menu, Permission, MConf, menuLang) {

    if(_.isUndefined(Ctx.DEMO)) {
        var ctxDemo = Ctx.DEMO = {};
    }

    // testFn
    ctxDemo.testFn = function() {};

    // 全局调用
    Ctx.DEMO.testFn();

    return {
        moduleUrl: Url.urlRoot,
        moduleMenu: Menu.menuRoot,
        moduleMenuLang: menuLang,
        moduleConfig: MConf,
        modulePermission: Permission.permissionRoot
    }
});
