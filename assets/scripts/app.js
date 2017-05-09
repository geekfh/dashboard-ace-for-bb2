/**
 * Application 应用主模块
 */
define([
    "marionette", 'framework', 'context',

    'assets/scripts/fwk/main/ToolMenu',
    'assets/scripts/fwk/main/PswMgr',
    'assets/scripts/fwk/main/TaskQueueMgr',

    'assets/scripts/entities/nav/list/list-controller',
    'assets/scripts/entities/nav/content/content-view'
],

function(Marionette, Framework, Context, ToolMenu, PswMgr, TaskQueueMgr, navCtrl, ContextView) {
    /** @private */
    var root = this,
        sysInfo = {};

    /**
     * windows对象，调用方法 window.Ctx可简写为(Ctx)
     * @global
     * @namespace
     */
    var Ctx = root.Ctx  = Context;

    /**
     * windows对象，调用方法 window.App可简写为(App)
     * @global
     * @namespace
     */
    var App = root.App  = new Marionette.Application();

    /** @private */
    var contentView = null; //new ContextView();

    if(_.isUndefined(App.__events__)){
        /**
         * 扩展App自定义事件，方便给DOM元素onClick属性存放事件(如超链接)。
         * @memberof App
         * @property {object} __events__ 全局存放公共事件(多页面共享)
         * @example
         * App.__events__ = {
         *  // 挂载到__events__对象的方法
         *  aLink: function() {
         *    //TODO
         *  }
         * }
         */
        App.__events__ = {};
    }

    // 暂存模块配置项
    if(_.isUndefined(App.__module__)){
        /**
         * 扩展App对象，用来挂载子模块相关信息。禁止私自扩展更不能重写。
         * @memberof App
         * @property {object} __module__ 第三方子系统接入模块配置项
         * @property {object} __module__.menuLang <ul><li>子模块菜单i18N(多语言)配置信息</li><li>Path: app/{moduleid}/common/nls/module-lang</li><li>e.g. {'demo.menu.grid': '数据表格'}</li></ul>
         * @property {object} __module__.menuItems <ul><li>子模块菜单配置项。</li><li>配置规范请见：{@link http://wiki.iboxpay.com/pages/viewpage.action?pageId=10094382}</li></ul>
         * @property {object} __module__.pmsMap <ul><li>子模块权限配置项</li><li>配置规范请见：{@link http://wiki.iboxpay.com/pages/viewpage.action?pageId=10094391}</li></ul>
         * @property {object} __module__.confMap <ul><li>子模块配置信息</li><li>Path: app/{systemId}/module-config</li><li>e.g. Opf.Config._("ui", "grid.form.width")</li></ul>
         * @property {object} __module__.urlMap <ul><li>子模块API请求地址MAP</li><li>Path: app/{systemId}/module-url</li><li>e.g. 'demo.api.grid.list': 'app/demo/data/grid/list.json'</li></ul>
         */
        App.__module__ = {};

        // menuLang
        App.__module__.menuLang = {};

        // menuItems
        App.__module__.menuItems = [];

        // pmsMap
        App.__module__.pmsMap = {};

        // confMap
        App.__module__.confMap = {};

        // urlMap
        App.__module__.urlMap = {};
    }

    /**
     * 装载子系统模块
     * 注意：当页面加载子系统模块的时候，如果子系统有ajax请求的逻辑判断，后端返回数据格式应如下：
     * @example
     * // 一般多用在请求拦截的情况下。
     * // 需要满足一定的条件才允许加载子系统模块
     * {
     *  success: true/false,
     *  errorMsg: "Your messages",
     * }
     * @memberof App
     * @param {String} mPath - 模块的路径(相对于app目录)
     * @returns {null}
     */
    App.loadModule = function(mPath) {
        App.navRegion.$el.empty();
        App.mainRegion.$el.empty();

        Opf.UI.setLoading("#sidebar", true);

        // 加载左侧菜单
        require([mPath], function(module) {
            //如果module返回错误信息则中断模块加载
            //系统给出错误提示
            if(module.errorMsg) {
                Opf.alert({
                    title: "提示信息",
                    message: module.errorMsg
                });
                Opf.UI.setLoading("#sidebar", false);
                return;
            }

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

    /**
     * 显示一个视图，也即新增一个TAB页，
     * 如果该TAB页面存在的话就打开它
     * @memberof App
     * @param {View} view - View/ItemView/LayoutView的一个实例
     * @returns {null}
     */
    App.show = function (view) {
        document.body.scrollTop=0;
        contentView.addTabContent(view);
    };

    /**
     * 是否允许标签页(TAB)重复，默认不允许。如果需要同一个View打开多个TAB页请传入不同的tabId, tabName。
     *
     * @example
     * // 选项卡参数
     * var tabViewOpts = {
     *     id: "yourTabId",
     *      tabName: "yourTabName"
     * };
     * App.canRepeatShow(myView, tabViewOpts);
     *
     * @private
     * @memberof App
     * @param {View} view - 一般指Marionette.ItemView的实例，也可以是Backbone.View的实例
     * @param {Object} options - 必须包含tabId和tabName
     * @returns {Object} 返回tabId，如{id: "yourTabId"}
     */
    App.canRepeatShow = function (view, options) {
        document.body.scrollTop=0;
        return contentView.addTabContentCanRepeat(view, options);
    };

    /**
     * 根据ID关闭一个视图，也即关闭一个TAB页
     * @memberof App
     * @param {String} id - 页面配置的tabId
     * @returns {null}
     */
    App.closeTabViewById = function (id) {
        document.body.scrollTop=0;
        contentView.closeTabViewById(id);
    };

    /**
     * 根据ID显示一个视图，也即显示一个TAB页
     * @memberof App
     * @param {String} id - 页面配置的tabId
     * @returns {null}
     */
    App.showTabViewById = function (id) {
        document.body.scrollTop=0;
        contentView.showTabViewById(id);
    };

    /**
     * 页面遮罩层。
     * 调用此方法将在页面生成一个半透明的背景层，用户不能点击。
     * @memberof App
     * @returns {null}
     */
    App.maskCurTab = function () {
        Opf.UI.setLoading('#page-body');
    };

    /**
     * 获取当前页面的page container，这在一些回调函数里面经常用到。
     * 例如，某个页面新增了一条数据需要跳转到另一个页面刷新表格并显示这条数据。
     * @memberof App
     * @returns {jQuery}
     */
    App.getCurTabPaneEl = function () {
        return contentView.getNowActiveTab();
    };

    /**
     * 去掉页面遮罩。
     * @memberof App
     * @returns {null}
     */
    App.unMaskCurTab = function () {
        Opf.UI.setLoading('#page-body', false);
    };

    /** @private */
    App.addRegions({
        topRegion: "#page-top",
        mainRegion: "#page-body",
        navRegion: '#nav-list-region'
    });

    //这个要放在外层，可别放到promise链里面去
    var contextTask = Ctx.load(function(args) {
        if(_.isObject(args[0])) {
            sysInfo = args[0];
            sysInfo.submodules = Ctx.getSubModuleList();
        }
    });

    // App start
    App.on("start", function() {
        // context load done
        contextTask.done(function () {
            // 检测是否强制修改密码
            PswMgr.deferredForceChangeInitPsw().done(function () {
                App.topRegion.show(new ToolMenu({
                    user: sysInfo.user,
                    submodules: sysInfo.submodules
                }));
            });
        });
    });

    /**
     * 工厂方法集合。
     * 提供了一系列可直接调用的方法。
     * @namespace
     * @memberof App
     */
    App.Factory = Opf.Factory;

    return App;
});
