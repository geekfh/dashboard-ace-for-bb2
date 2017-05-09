/**
 * 上下文模块
 * 需要把cotext后面的依赖再延迟吗？因为浪费了context.load里面一次ajax提前的机会
 */

define([
    "marionette", 'framework', 'context',
    'assets/scripts/fwk/main/TaskQueueMgr',
    'assets/scripts/entities/nav/list/list-controller',
    'assets/scripts/entities/nav/content/content-view'
],

function(Marionette, Framework, Context, TaskQueueMgr, navCtrl, ContextView) {

    var root = this;

    var Ctx = root.Ctx  = Context;
    var App = root.App  = new Marionette.Application();
    var contentView = null; //new ContextView();

    //获取url中的参数
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg);  //匹配目标参数
        if (r != null) return unescape(r[2]); return null; //返回参数值
    }

    /**
     * @author hefeng
     * @date 2015/12/21
     * @description 扩展App自定义事件，方便给DOM元素onClick属性存放事件(如超链接)
     */
    if(_.isUndefined(App.__events__)){
        App.__events__ = {};
    }

    /**
     * @author hefeng
     * @date 2016/8/3
     * @description 暂存模块配置项
     */
    if(_.isUndefined(App.__module__)){

        App.__module__ = {};

        // 菜单翻译
        App.__module__.menuLang = {};

        // 菜单配置
        App.__module__.menuItems = [];

        // 权限配置
        App.__module__.pmsMap = {};

        // module配置
        App.__module__.confMap = {};

        // URL配置
        App.__module__.urlMap = {};

    }

    // 装载模块
    App.loadModule = function(mPath) {
        App.navRegion.$el.empty();
        App.mainRegion.$el.empty();

        Opf.UI.setLoading("#sidebar", true);

        // 加载左侧菜单
        require([mPath], function(module) {
            App.__module__.menuLang = module.moduleMenuLang;
            App.__module__.pmsMap = module.modulePermission;
            App.__module__.menuItems = module.moduleMenu;
            App.__module__.confMap = module.moduleConfig;
            App.__module__.urlMap = module.moduleUrl;

            //切换url
            url._switch();

            _.defer(function() {
                var navView = navCtrl.listNav();
                contentView = new ContextView();
                App.navRegion.show(navView);
                App.mainRegion.show(contentView);
                Opf.UI.setLoading("#sidebar", false);
            });
        });
    };

    // 任务队列
    App.TaskQueueMgr = TaskQueueMgr;

    App.show = function (view) {
        document.body.scrollTop=0;
        contentView.addTabContent(view);
    };

    App.canRepeatShow = function (view, options) {
        document.body.scrollTop=0;
        return contentView.addTabContentCanRepeat(view, options);
    };

    App.closeTabViewById = function (id) {
        document.body.scrollTop=0;
        contentView.closeTabViewById(id);
    };

    App.maskCurTab = function () {
        Opf.UI.setLoading('#page-body');
    };

    App.getCurTabPaneEl = function () {
        return contentView.getNowActiveTab();
    };

    App.unMaskCurTab = function () {
        Opf.UI.setLoading('#page-body', false);
    };

    App.addRegions({
        topRegion: "#page-top",
        mainRegion: "#page-body",
        navRegion: '#nav-list-region'
    });

    // App start
    App.on("start", function() {
        var moduleName = getUrlParam("module");

        if(moduleName != null) {
            App.loadModule("app/" + moduleName + "/module-main");
        } else {
            Opf.alert("请在地址栏里配置模块名参数，如：module='oms'");
        }
    });

    App.Factory = Opf.Factory;

    return App;
});
