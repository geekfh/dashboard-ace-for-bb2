define([
    'tpl!app/oms/route/noCard/templates/model-list.tpl',
    'app/oms/route/noCard/sub/pager-view'
], function(tpl, PagerView) {

    var ListView = Marionette.CompositeView.extend({
        template: tpl,
        className: 'models-group',
        childViewContainer: '.model-item',
        triggers: {
            'click .add-model': 'add:model'/*,
            'click .upload-models': 'upload:models'*/
        },

        events: {
            'submit .search-form': 'onSearch',
            'keyup input[type=search]': 'checkRestSeachBtnVisible',
            'click .clear-search': 'clear'

        },

        ui: {
            btnClearSearch :'.btn-clear-search',
            searchInput: 'input[type="search"]',
            'modelPanel': '.model-panel',
            'addModel': '.add-model'
        },

        serializeData: function () {
            return { title: this.title, permission: this.permission };
        },

        checkRestSeachBtnVisible: function () {
            this.ui.btnClearSearch.toggle(!!$.trim(this.ui.searchInput.val()));
        },

        //关键字搜索
        onSearch: function (e) {
            if (e) e.preventDefault();

            var data = {};
            var query = this.$el.find('input[type="search"]').val();

            if (query.trim()) {
                // data.kw = encodeURIComponent(query);
                this.collection.queryParams.kw = encodeURIComponent(query);
            } else {
                delete this.collection.queryParams.kw;

            }

            this.scrollToTop();
            this.collection.getFirstPage({reset: true});
        },

        getSearchInputValue: function () {
            return this.$el.find('input[type="search"]').val();
        },

        refreshModels: function () {
            this.$el.find('.scroll-more-wrapper')[0].scrollTop = 0;
            this.collection.getFirstPage({reset: true});
        },

        onChildviewEditSuccess: function () {
            this.refreshModels();
        },

        onChildviewModelsRefresh: function () {
            this.refreshModels();
        },

        clear: function (e) {
            if (e) e.preventDefault();

            this.ui.searchInput.val(null);
            this.checkRestSeachBtnVisible();
            delete this.collection.queryParams.kw;
            
            this.scrollToTop();
            this.collection.getFirstPage({reset: true});
        },

        onRender: function () {
            
            var $list = this.$el.find('.model-item');

            var $wrapper = Opf.Utils.scrollLoadMore({
                prefill: true,
                target: $list,
                collection: this.collection,
                maxHeight: 400
            });
        },

        filterCheckbox: function (modelView) {
            this.children.each(function (childView) {
                if (childView !== modelView) {
                    childView.uncheckedView();
                }
            });
        },

        scrollToTop: function () {
            this.$el.find('.scroll-more-wrapper').get(0).scrollTop = 0;
        },

        // 选中一个模型
        // selectChildView: function (view) {
        //     if (view.isSelected()) {
        //         this.forceChildrenView();
        //         return 'unselected';

        //     } else {
        //         this.blurChildrenView();
        //         view.selectView();
        //         return 'selected';

        //     }
        // },

        // 选中一个模型
        checkedChildView: function (view) {
            view.checkedView();
        },

        // 将列表下所有模型选中
        checkedChildrenView: function () {
            this.children.each(function (childView) {
                childView.checkedView();
            });
        },

        getCheckedChildrenView: function () {
            var result = [];

            this.children.each(function (childView) {
                childView.isChecked() && result.push(childView.model.get('id'));
            });

            return result;
        },

        getUncheckedChildrenView: function () {
            var result = [];

            this.children.each(function (childView) {
                childView.isUnchecked() && result.push(childView.model.get('id'));
            });

            return result;
        },

        // 反选一个模型
        uncheckedChildView: function (view) {
            view.uncheckedView();
        },

        // 将列表下所有模型反选
        uncheckedChildrenView: function () {
            this.children.each(function (childView) {
                childView.uncheckedView();
            });
        },


        // 将列表置为不可编辑的状态
        disableChoice: function () {
            this.$el.find('.model-content-disable').length || this.ui.modelPanel.append('<div class="model-content-disable"></div>');
        },

        // 将列表置为可编辑的状态
        enableChoice: function () {
            this.$el.find('.model-content-disable').remove();
        },

        cleanEditRelevanceStatus: function () {
            this.enableChoice();
            this.uncheckedChildrenView();
            this.operateObj = void 0;
        },

        getBindRelevance: function () {
            var result = [];

            this.children.each(function (childView) {
                result.push({
                    id: childView.model.get('id'),
                    operate: childView.isChecked() ? 'bind' : 'unbind'
                });
            });

            return result;
        }/*,

        _proxyChildEvents: function(view) {
            this.listenTo(view, 'all', function() {
                var args = Array.prototype.slice.call(arguments);
                var rootEvent = args[0];

                args[0] = 'pager:' + rootEvent;
                args.splice(1, 0, view);

                this.triggerMethod.apply(this, args);

            }, this);
        }*//*,

        previousPage: function () {
            this.collection.getPreviousPage();
        },

        toPage: function (toPage) {
            this.collection.getPage(toPage);
        },

        nextPage: function () {
            this.collection.getNextPage();
        },

        onPagerPreviousPage: function () {
            if (this.waiteToSave) {
                this.trigger('need:save', 'previousPage');
            } else {
                this.previousPage();
            }
        },

        onPagerToPage: function (view, toPage) {
            if (this.waiteToSave) {
                this.trigger('need:save', 'toPage', toPage);
            } else {
                this.toPage(toPage);
            }
        },

        onPagerNextPage: function () {
            if (this.waiteToSave) {
                this.trigger('need:save', 'nextPage');
            } else {
                this.nextPage();
            }
        }*//*,

        setWaiteToSave: function () {
            this.waiteToSave = true;
        },

        cleanWaiteToSave: function () {
            this.waiteToSave = false;
        }*/


    });

    
    return ListView;
    
});