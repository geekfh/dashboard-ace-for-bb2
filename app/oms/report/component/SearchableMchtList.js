/**
 * 目测搜索以后会改动，忍住！不要去做抽象基类的事情
 */
define([
    'app/oms/common/store/OpfPageableCollection',
    'tpl!app/oms/report/component/templates/mcht-result-item.tpl',
    'app/oms/report/component/Pager'
], function(OpfPageableCollection, searchResultItemTpl, Pager) {

    var Model = Backbone.Model.extend({
        parse: function (data) {
            data.name = data.mchtName;
            return data;
        }
    });

    var Collection = OpfPageableCollection.extend({

        model: Model,
        url: url._('report.search.mcht'),

        state: {
        },

        queryParams: {
            kw: ''
        },

        applyKeyword: function (params) {
            for(var i in params){
                if(params.hasOwnProperty(i)){
                    this.queryParams[i] = params[i];
                }
            }
            this.getFirstPage();
            return this;
        }
    });

    var ItemView = Marionette.ItemView.extend({
        tagName: 'li',
        template: searchResultItemTpl
    });


    var MchtSearchView = Marionette.CompositeView.extend({

        tagName: 'div',
        className: 'search-result-panel',
        template: _.template('<ul class="search-result-list"></ul><div hidden class="pager-container"></div>'),
        childView: ItemView,
        childViewContainer: '.search-result-list',

        events: {
            'change .radio-btn': 'onMchtSelect'
        },

        ui: {
            pagerCt: '.pager-container',
            resultList: '.search-result-list'
        },

        getEmptyView: function () {
            return Backbone.Marionette.ItemView.extend({
                template: _.template([
                '<div class="text-center" style="color:#AAA;position:relative;top:40px;">',
                    '没有相关商户，请输入更精确的信息<br>',
                    '（部分商户名 或者 完整的手机号）',
                '</div>'
                ].join(''))
            });
        },

        updateKeyword: function (params) {
            this.collection.applyKeyword(params);
            //if(this.lastKw !== kw) {
            //    this.collection.applyKeyword(kw);
            //    this.lastKw = kw;
            //}
        },

        onMchtSelect: function (e) {
            if($(e.target).prop('checked')) {
                var mchtId = $(e.target).closest('label').attr('radio-mcht-id');
                var model = this.collection.findWhere({mchtNo:mchtId});
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

    return MchtSearchView;
});