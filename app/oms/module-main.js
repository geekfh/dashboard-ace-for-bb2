/**
 * User hefeng
 * Date 2016/7/15
 */
define([
    'app/oms/module-url',
    'app/oms/module-menu',
    'app/oms/module-permission',
    'app/oms/module-config',
    'i18n!app/oms/common/nls/menu'
], function(Url, Menu, Permission, MConf, menuLang) {

    /**
     * 开通宝推广页
     */
    if (Ctx.getGid() == 4) {
        require(['app/oms/message/ktb-news/news-view'], function () {
            App.trigger('show:ktb:news');
        });
    }

    return {
        moduleUrl: Url.urlRoot,
        moduleMenu: Menu.menuRoot,
        moduleMenuLang: menuLang,
        moduleConfig: MConf,
        modulePermission: Permission.permissionRoot
    }
});