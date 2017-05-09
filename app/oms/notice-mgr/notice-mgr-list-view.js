//编辑的时候，进入页面，然后model获取完，绑定。。。
//选中，去勾选，下一页之后可能丢失，有bug（包括编辑和删除）
define([
    'tpl!app/oms/notice-mgr/templates/notice-list.tpl',
    'tpl!app/oms/notice-mgr/templates/notice-item.tpl',
    'tpl!app/oms/notice-mgr/templates/pager.tpl',
    'app/oms/common/store/OpfPageableCollection',
    'moment.override',
    'jquery.inputmask'
], function(tpl, noticeItemTpl, pageTpl, OpfPageableCollection) {

    var PAGE_SIZE_KEY = 'notices.page.size';//每页显示多少条


    //分页栏
    var PagerView =  Marionette.ItemView.extend({

        template: pageTpl,

        ui: {
            inputRedirect: '[name="redirectTo"]'
        },

        events: {
            'click .btn-first': function() {
                this.collection.getFirstPage();
            },
            'click .btn-previous': function() {
                this.collection.getPreviousPage();
            },
            'click .btn-next': function() {
                this.collection.getNextPage();
            },
            'click .btn-last': function() {
                this.collection.getLastPage();
            },
            'change [name="redirectTo"]': function (e) {
                var to = $(e.target).val();
                var state = this.collection.state;
                var totalPages = state.totalPages;

                if(totalPages && to < 0) {
                    $(e.target).val(1);
                    this.collection.getFirstPage();
                }
                else if(totalPages && to > totalPages) {
                    this.collection.getLastPage();
                    $(e.target).val(totalPages);
                }
                else  if(to > 0 && state.totalPages && to <= state.totalPages) {
                    this.collection.getPage(to - 1);
                }
            }
        },

        initialize: function (options) {
            var me = this;
            options = options || {};

            this.options = options;
            var collection = this.collection = options.collection;

            this.collection.on('sync', function (collection) {
                if(collection instanceof Backbone.Collection) {
                    me.render();
                }
            });
        },

        serializeData: function () {
            return {state: this.collection.state};
        },

        onRender: function () {
            var me = this;

            this.options.renderTo && this.$el.appendTo(this.options.renderTo);

            _.once(function () {
                me.ui.inputRedirect.inputmask('numeric', {
                    autoUnmask: true,
                    allowMinus: false
                });
            });
        }

    });

    //一条公告
    var ItemView = Marionette.ItemView.extend({

        template: noticeItemTpl,

        tagName: 'tr',

        className: 'notice-item message-item',

        ui: {
            'checkbox': '.notice-select-chk'
        },

        triggers: {
            'click .col-summary': 'view:detail',
            'click .col-time': 'view:detail'
        },

        events: {
            'change .notice-select-chk': 'onCheckboxChange'
        },

        templateHelpers: function () {
            return {
                featureAvailConfig: this.featureAvailConfig,
                formatTime: function (str) {
                    // return moment(str).fromNow();
                    return moment(str).formatYMDHm();
                }
            };
        },

        onCheckboxChange: function(e) {
            var isCheck = $(e.target).prop('checked');
            this.trigger('select:change', isCheck);
        },

        deselect: function () {
            this.ui.checkbox.prop('checked', false);
        }
    });

    //公告列表
    var ListView = Marionette.CompositeView.extend({

        // featureAvailConfig: {
        //     newNotice: true,
        //     noticeItemCheckable: true,
        //     deleteNotice: true,
        //     editNotice: true
        // }, 

        className: 'notice-list-panel',

        getChildView: function () {
            return this._childView || (this._childView = ItemView.extend({
                featureAvailConfig: this.getOption('featureAvailConfig')
            }));
        },

        childViewContainer: '.notices-tbody',

        template: tpl,

        ui: {
            'infobar': '.message-infobar',
            'toolbar': '.message-toolbar',
            'footer': '.message-footer',
            'navbar': '.message-navbar',
            'pageSizeSelet': '.page-size-selet',
            'navAdd': '.nav-add'
        },

        triggers: {
            'click .btn-add': 'add:notice'
        },

        events: {
            'click .btn-delete': 'onActionDelete',
            'click .btn-edit': 'onActionEdit',
            'change [name="pageNumber"]': 'onPageNumberChange'
        },

        templateHelpers: function () {
            return {
                featureAvailConfig: this.getOption('featureAvailConfig')
            };
        },

        getNoticesUrl: function () {
            return this.getOption('noticesUrl') || url._('mgr.notices');
        },

        newNoticesCollection: function () {
            var noticesUrl = this.getNoticesUrl();

            var Collection =  OpfPageableCollection.extend({
                model: Backbone.Model.extend({
                    url: function () {
                        return noticesUrl + '/' + this.id;
                    }
                }),

                state: {
                    pageSize: 5
                },

                initialize: function() {
                    OpfPageableCollection.prototype.initialize.apply(this, arguments);
                },

                url: noticesUrl

            });

            return new Collection();
        },

        initialize: function(options) {
            var me = this;

            this.selectedView = null;

            this.collection = this.newNoticesCollection();
            this.collection.fetch({parse: true});

            this.collection.on('request', function (collection) {
                if(collection instanceof Backbone.Collection) {
                    Opf.UI.ajaxLoading(me.$el);
                }
            });

            this.collection.on('sync', function (collection) {
                if(collection instanceof Backbone.Collection) {
                    if(me.selectedView && !me.selectedView.isDestroyed) {
                        me.selectedView.deselect();
                    }
                    me.selectedView = null;
                    me.toggleBarUI(false);
                }
            });

            this.render();
        },

        show: function () {
            this.$el.show();
            //头部用了 ScrollToFixed， 当重新显示后要给机会它重新调整
            _.defer(function () {
                $(window).trigger('resize.ScrollToFixed');
            });
        },

        refresh: function () {
            this.collection.refresh({reset: true});
        },

        onRender: function () {
            new PagerView({
                renderTo: this.ui.footer,
                collection: this.collection
            });

            this.ui.navbar.scrollToFixed();

            if(Opf.Storage.get(PAGE_SIZE_KEY)) {
                this.ui.pageSizeSelet.val(Opf.Storage.get(PAGE_SIZE_KEY));
                this.collection.setPageSize( parseInt(Opf.Storage.get(PAGE_SIZE_KEY), 10) );
            }

            this.options.renderTo && this.$el.appendTo(this.options.renderTo);
        },

        toggleBarUI: function (isSomeRowSelected) {
            this.ui.toolbar.toggle(isSomeRowSelected);
            this.ui.infobar.toggle(!isSomeRowSelected);
        },

        onChildviewViewDetail: function (childview) {
            this.trigger('view:detail', childview.model);
        },

        //单选
        onChildviewSelectChange: function(childView, isSelect) {
            var ui = this.ui;

            //如果某个子 view 选中
            if(isSelect) {

                //如则果已有选中，则取消选中
                this.selectedView && this.selectedView.deselect();
                
                this.selectedView = childView;

                this.toggleBarUI(true);

            }else {

                this.selectedView = null;

                this.toggleBarUI(false);
            }
        },

        onPageNumberChange: function (e) {
            var number = $(e.target).val();
            Opf.Storage.set(PAGE_SIZE_KEY, number);
            this.collection.setPageSize( parseInt(number, 10) );
        },

        onActionEdit: function (childView) {
            var me = this;

            if(this.selectedView) {
                Opf.UI.ajaxLoading(this.$el);
                this.selectedView.model.fetch({
                    success: function (model) { 
                        me.trigger('edit:notice', model);
                    }
                });
            }
        },

        onActionDelete: function () {
            var me = this;
            if(this.selectedView) {
                Opf.UI.ajaxLoading(this.$el);
                this.selectedView.model.destroy({
                    wait: true,
                    success: function () {
                        me.refresh();
                    }
                });
            }
        }

    });

    return ListView;
});