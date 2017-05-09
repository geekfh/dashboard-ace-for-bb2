define([
    'tpl!assets/scripts/entities/nav/content/templates/content.tpl',
    'tpl!assets/scripts/entities/nav/content/templates/tab-title.tpl',
    'tpl!assets/scripts/entities/nav/content/templates/tab-content.tpl',
    //'assets/scripts/fwk/main/MenuLangMgr',
    //'i18n!assets/scripts/fwk/nls/menu',
    'marionette'
], function(tpl, titleTpl, contentTpl) {

    var CACHE_TAB_VIEW = {},
        CAN_REPEAT_ID = 'can-repeat-view-id',
        dllId = 0;

    var View = Marionette.LayoutView.extend({
        template: tpl,
        events: {
            'click .delete-menu-tab': 'removeTab',
            'click [tabTrigger]': function () {
                $(window).trigger('resize');
            }
        },
        ui: {
            tabTitle: '[menuTitle="mcht-tab-title"]',
            tabContent: '[menuContent="mcht-tab-content"]'
        },
        initialize: function () {
            // 重置tab:cache
            CACHE_TAB_VIEW = {};
        },

        onRender: function () {
            this.$el.hide();
        },


        // 获取已经打开的 tab view
        getNowActiveTab: function () {
            var tabMainBodys = this.ui.tabContent.find('[tabMainBody]');
            var result = null;

            _.each(tabMainBodys, function (tabMainBody) {
                if ($(tabMainBody).hasClass('active')) {
                    result = $(tabMainBody);
                }
            });

            if(result === null) {
                throw "无法找到当前正在显示的tab view";
            }

            return result;
        },

        //显示旁边的 tab view
        showNextTabView: function ($title) {
            var $next = $title.next();

            if ($next.length === 0) {
                $next = $title.prev();
            }

            $next.find('a').click();
        },

        removeTab: function (e) {
            var id = $(e.target).closest('li').attr('tabId');

            this.closeTabViewById(id);
        },

        closeTabViewById: function (id) {
            if (!id || !CACHE_TAB_VIEW[id]) {
                return;
            }

            // 退出TAB页面时执行一下tabUnload方法
            // true/退出  false/不退出
            var tabView = CACHE_TAB_VIEW[id].tabView||{};
            if(typeof tabView.tabUnload === "function" && tabView.tabUnload() === false) {
                return;
            }

            // 如果关闭的tab是正在显示的tab view，需要显示它旁边的tab view
            if(CACHE_TAB_VIEW[id].$tabTitle.hasClass('active')) {
                this.showNextTabView(CACHE_TAB_VIEW[id].$tabTitle);
            }

            CACHE_TAB_VIEW[id].$tabTitle.remove();     
            CACHE_TAB_VIEW[id].$tabContent.remove();  
            delete CACHE_TAB_VIEW[id];

            if (this.ui.tabTitle.children().length === 0) {
                this.$el.hide();
            }

        },

        //根据ID显示TAB
        showTabViewById: function (id) {
            if (!id || !CACHE_TAB_VIEW[id]) {
                return;
            }

            CACHE_TAB_VIEW[id].$tabTitle.find('a').click();
        },

        // 将所有tab view 关闭
        cleanActiveTabs: function () {
            this.ui.tabTitle.find('li').removeClass('active');
            this.ui.tabContent.find('[tabmainbody]').removeClass('active');
        },


        // 添加一个tab view
        addTabContent: function (view) {
            if (!(view && view.tabId)) {
                return;
            }

            var menuLang = App.__module__.menuLang;
            var id = view.tabId.replace(/\./g, '-');
            var tabName = menuLang._(view.tabId);

            this.showTabView(view, id, tabName);

        },


        addTabContentCanRepeat: function (view, options) {
            var id = options.id || (CAN_REPEAT_ID + (++dllId));
            var tabName = options.tabName || '';

            this.showTabView(view, id, tabName);
            return {id: id};
        },

        showTabView: function (view, id, tabName) {
            // 新添加的tab view是一定要展示出来的，所以需要关闭所有tab view
            this.cleanActiveTabs();
            this.$el.show();

            var $el = this.$el, tab, ui = this.ui;

            // 如果页面已经加载了该view
            if (tab = CACHE_TAB_VIEW[id]) {
                tab.$tabTitle.addClass('active');
                tab.$tabContent.addClass('active').empty().append(view.render().$el);

            // 如果页面未加载该view
            } else {
                tab = {
                    $tabTitle: $(titleTpl({id: id, title: tabName})).appendTo(ui.tabTitle),
                    $tabContent: $(contentTpl({id: id})).appendTo(ui.tabContent)
                };
                tab.$tabContent.append(view.render().$el);

                CACHE_TAB_VIEW[id] = tab;
                CACHE_TAB_VIEW[id].tabView = view;
            }

        }


    });

    
    return View;
});