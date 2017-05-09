define([
    'app/oms/common/store/OpfPageableCollection',
    'tpl!app/oms/report/component/templates/explorer-result-item.tpl',
    'app/oms/report/component/Pager'
], function(OpfPageableCollection, searchResultItemTpl, Pager) {

    var Collection = OpfPageableCollection.extend({

        url: url._('report.tree.searchExplore'),

        state: {
        },

        queryParams: {
            kw: ''
        },

        applyKeyword: function (kw, options) {
            kw = (kw === void 0 ? '' : kw);
            var params = options.params;
            this.queryParams.kw = encodeURIComponent(kw);
            // 进驻时间
            params && $.extend(this.queryParams, params);
            this.getFirstPage();
            return this;
        }
    });

    var ItemView = Marionette.ItemView.extend({
        tagName: 'li',
        template: searchResultItemTpl
    });

    var ExplorerSearchView = Marionette.CompositeView.extend({

        tagName: 'div',
        className: 'search-result-panel',
        template: _.template('<ul class="search-result-list"></ul><div hidden class="pager-container"></div>'),
        childView: ItemView,
        childViewContainer: '.search-result-list',

        events: {
            'change .radio-btn': 'onExplorerSelect'
        },

        ui: {
            pagerCt: '.pager-container',
            resultList: '.search-result-list'
        },


        getEmptyView: function () {
            return Backbone.Marionette.ItemView.extend({
                template: _.template([
                '<div class="text-center" style="color:#AAA;position:relative;top:40px;">',
                    '没有找到相关拓展员',
                '</div>'
                ].join(''))
            });
        },

        updateKeyword: function (kw) {
            var orgTreeOptions = this.getOption('orgTreeOptions');
            if(this.lastKw !== kw) {
                this.collection.applyKeyword(kw, orgTreeOptions);
                this.lastKw = kw;
            }
        },

        onExplorerSelect: function (e) {
            if($(e.target).prop('checked')) {
                var explorerId = $(e.target).closest('label').attr('radio-explorer-id');
                var model = this.collection.findWhere({id:explorerId});
                this.trigger('select:target', model.toJSON());
            }
        },

        initialize: function() {
            var me = this;
            this.lastKw = null;
            this.collection = new Collection();

            this.collection.on('request', function () {
                Opf.UI.ajaxLoading(me.$el);
            });

            this.render();

            this.createPager();
        },

        createPager: function () {
            var me = this;

            this.pager = new Pager({
                collection: this.collection
            });

            this.pager.$el.appendTo(this.ui.pagerCt);

            this.pager.on('previous:page', function() {
                me.collection.getPreviousPage();
            })//
            .on('next:page', function() {
                me.collection.getNextPage();
            });

            this.collection.on('sync', function (collection) {

                me.ui.resultList.scrollTop(0);

                var shouldShow = collection.length > 0;
                var isShowing = me.ui.pagerCt.is(':visible');

                //如果需要显示分页栏，则容器设置padding-bottom留出位置给分页按钮
                if(shouldShow != isShowing) {
                    if(shouldShow) {
                        me.ui.pagerCt.show();
                        me.$el.css('padding-bottom', me.ui.pagerCt.height()
                        );
                    }else {
                        me.ui.pagerCt.hide();
                        me.$el.css('padding-bottom', 0);
                    }
                }
            });
        },

        show: function () {
            this.$el.show();
        },

        reset: function () {
            this.$el.find('input:checked').prop('checked', false);
        }
    });
    
    return ExplorerSearchView;
});