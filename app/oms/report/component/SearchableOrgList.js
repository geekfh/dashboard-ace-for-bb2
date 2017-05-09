define([
    'app/oms/common/store/OpfPageableCollection',
    'tpl!app/oms/report/component/templates/org-result-item.tpl',
    'app/oms/report/component/Pager'
], function(OpfPageableCollection, searchResultItemTpl, Pager) {

    var Collection = OpfPageableCollection.extend({

        url: url._('report.tree.searchOrg'),

        state: {
            // pageSize: 3
        },

        queryParams: {
            kw: ''

        },

        applyKeyword: function (kw, options) {
            var me = this;
            var params = options.params;
            console.log('发出搜索机构请求', kw);
            kw = kw === void 0 ? '' : kw;
            this.queryParams.kw = encodeURIComponent(kw);
            // 进驻时间
            params && $.extend(this.queryParams, params);
            //对搜索结果进行处理，如果没有搜索到内容，给出相应的提示
            var deferr = this.getFirstPage();

            return this;
        }
    });

    var ItemView = Marionette.ItemView.extend({
        template: searchResultItemTpl
    });

    /*
    这里有点恶心地把View加上了一些controller的功能，为了orgsearchview可以更独立，就这样吧
     */

    var OrgSearchView = Marionette.CompositeView.extend({
        className: 'search-result-panel',
        template: _.template('<div class="org-list-wrap"><ul class="org-list"></ul></div><div hidden class="pager-container"></div>'),
        childViewContainer: "ul.org-list",
        childView: ItemView,

        events: {
            'change .radio-btn': 'onOrgSelect'
        },

        ui: {
            pagerCt: '.pager-container',
            resultList: 'ul.org-list'
        },

        getEmptyView: function () {
            return Marionette.ItemView.extend({
                template: _.template([
                    '<div class="no-result text-center" style="color:##AAA;margin-top: 20px;">',
                        '没有找到相关的机构',
                    '<div>'].join(''))
            });
        },

        updateKeyword: function (kw) {
            var orgTreeOptions = this.getOption('orgTreeOptions');
            if(this.lastKw !== kw) {
                this.collection.applyKeyword(kw, orgTreeOptions);
                this.lastKw = kw;
            }
        },

        onOrgSelect: function (e) {
            if($(e.target).prop('checked')) {
                var orgId = $(e.target).closest('li').attr('data-org-id');
                var model = this.collection.findWhere({id:orgId});
                this.trigger('select:target', model.toJSON());
            }
        },

        initialize: function() {
            var me = this;
            this.lastKw = null;
            this.collection = new Collection();

            this.collection.on('request', function () {
                _.defer(function(){
                    Opf.UI.ajaxLoading(me.$el, true);
                });
                
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

        reset: function () {
            this.$el.find('input:checked').prop('checked', false);
        },

        show: function () {
            this.$el.show();
        }
    });
    
    return OrgSearchView;
});