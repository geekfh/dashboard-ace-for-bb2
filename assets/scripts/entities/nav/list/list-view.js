/**
 * 菜单列表
 */
define([
    'marionette',
    'tpl!assets/scripts/entities/nav/list/templates/nav-list.tpl',
    'assets/scripts/fwk/main/MenuMgr'
], function(Marionette, listTplFn, menuConfiger) {

    var View = Marionette.ItemView.extend({

        tagName: 'ul',
        className: 'nav nav-list',
        template: listTplFn,
        events: {
            "click a": "navigate"
        },

        ui: {
            'menuItemTotice': '.menu-notice'
        },

        initialize: function () {
            var me = this;

            App.on('view:unreaded:notice', function (noticeModel) {
                me.refreshUnreadNoticeNum();
            });
        },

        onRender: function() {
            attachEvents();

            if(Ctx.avail('menu.notice')) {
                this.refreshUnreadNoticeNum();
            }
        },

        //更新 查看公告 菜单上的未读数
        refreshUnreadNoticeNum: function() {
            var me = this;

            Opf.ajax({
                url: url._('fwk.notices.summary'),
                ignoreBsError: true,
                success: function(resp) {
                    if (resp && resp.success !== false) {
                        //如果有未读数(>0)
                        if(resp.unreadNum) {
                            me.ui.menuItemTotice.find('.menu-icon').empty().append('<span class="unread-num">'+resp.unreadNum+'</span>');
                        }else {
                            me.ui.menuItemTotice.find('.menu-icon').empty();
                        }
                    }
                }
            });
        },

        serializeData: function() {
            return {
                listTplFn: listTplFn,
                items: menuConfiger.getItems()
            };
        },

        navigate: function(e) {
            if (this.canNavigate(e)) {
                e.preventDefault();
                var data = $(e.target).closest('a').data();

                if (data.trigger) {
                    this.trigger("navigate", e, data);
                }
            }
        },

        canNavigate: function(e) {
            // var $target = $(e.target);
            // if ($target.closest('a.dropdown-toggle').length && $target.find('.arrow').length) {
            //   return false;
            // }
            return true;
        },

        onNavigateTo: function (e) {
            var $linkEl = $(e.target).closest('a');
            //移除上次高亮
            if(this._lastActiveLinkEl) {
                this._eachClosetMenuItemToggleClass(this._lastActiveLinkEl, 'active', false);
            }
            //高亮这次
            this._eachClosetMenuItemToggleClass($linkEl, 'active', true);
            this._lastActiveLinkEl = $linkEl.get(0);
        },

        _eachClosetMenuItemToggleClass: function (fromEl, cls, toggle) {
            this._eachClosetMenuItem(fromEl, function (el) {
                $(el).toggleClass(cls, !!toggle);
            });
        },

        _eachClosetMenuItem: function (linkEl, cb) {

            function getParent (el) {
                var $ul = $(el).closest('ul.submenu');
                if($ul.length) {
                    return $ul.closest('li');
                }
            }

            var $li = $(linkEl).closest('li');

            while($li && $li.length) {
                cb($li);
                $li = getParent($li);
            }

        }

    });

    function attachEvents() {
        //TODO refactor copy from ace.js
        $(function(){
            $('#nav-list-region').off(ace.click_event).on(ace.click_event, function(e) {
                //check to see if we have clicked on an element which is inside a .dropdown-toggle element?!
                //if so, it means we should toggle a submenu
                var link_element = $(e.target).closest('a');
                if (!link_element || link_element.length == 0) return; //if not clicked inside a link element

                $minimized = $('#sidebar').hasClass('menu-min');

                if (!link_element.hasClass('dropdown-toggle')) { //it doesn't have a submenu return
                    //just one thing before we return
                    //if sidebar is collapsed(minimized) and we click on a first level menu item
                    //and the click is on the icon, not on the menu text then let's cancel event and cancel navigation
                    //Good for touch devices, that when the icon is tapped to see the menu text, navigation is cancelled
                    //navigation is only done when menu text is tapped
                    if ($minimized && ace.click_event == "tap" &&
                        link_element.get(0).parentNode.parentNode == this /*.nav-list*/ ) //i.e. only level-1 links
                    {
                        var text = link_element.find('.menu-text').get(0);
                        if (e.target != text && !$.contains(text, e.target)) //not clicking on the text or its children
                            return false;
                    }

                    return;
                }
                //
                var sub = link_element.next().get(0);

                //if we are opening this submenu, close all other submenus except the ".active" one
                if (!$(sub).is(':visible')) { //if not open and visible, let's open it and make it visible
                    var parent_ul = $(sub.parentNode).closest('ul');
                    if ($minimized && parent_ul.hasClass('nav-list')) return;

                    parent_ul.find('> .open > .submenu').each(function() {
                        //close all other open submenus except for the active one
                        if (this != sub && !$(this.parentNode).hasClass('active')) {
                            $(this).slideUp(200).parent().removeClass('open');

                            //uncomment the following line to close all submenus on deeper levels when closing a submenu
                            $(this).find('.open > .submenu').slideUp(0).parent().removeClass('open');
                        }
                    });
                } else {
                    //uncomment the following line to close all submenus on deeper levels when closing a submenu
                    $(sub).find('.open > .submenu').slideUp(0).parent().removeClass('open');
                }

                if ($minimized && $(sub.parentNode.parentNode).hasClass('nav-list')) return false;

                $(sub).slideToggle(200).parent().toggleClass('open');
                return false;
            });
        });
    }

    return View;
});