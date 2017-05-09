define([
    'app/oms/report/component/AbstractTargetSearchDialog',
    'app/oms/report/component/SearchableMchtList'

], function(ParentDialog, SearchableMchtList) {


    var View = ParentDialog.extend({
        dialogClass: 'mcht-select-dialog',
        captionHtml: '商户搜索结果',
        title: '统计某个商户',//TODO 后续提供更新title的方法
        searchSubmitBtnText: '搜索商户',
        searchInputPlaceHolder: '输入 商户名（部分）/ 手机号 / 商户号 / 终端号',
        enableCancelSearch: false,

        initialize: function () {
            
            this.listView = new SearchableMchtList(); //用于显示搜索结果

            this.subViews = [this.listView];

            ParentDialog.prototype.initialize.apply(this, arguments);

        },

        onRender: function () {
            ParentDialog.prototype.onRender.apply(this, arguments);

            this.uiSearchForm = this.getSearchForm();
            this.uiSearchForm.empty().append(mchtSearchFilterTpl());
            this.uiSearchForm.addClass('mcht-search');

            this.uiSearchInput = this.uiSearchForm.find('.search-input');
            this.uiSearchBtn = this.uiSearchForm.find('.search-btn');


            //this.getSearchBtn().hide();
            this.listView.$el.appendTo(this.ui.contentWrap);

            this.attachEvents();
        },

        attachEvents: function () {
            var me = this;

            this.listView.on('select:target', _.bind(this.onSelectTarget, this));

            me.uiSearchInput.on('input',  _.debounce(function () {
                var canSearch = me.canSearchMcht();

                me.uiSearchBtn.prop('disabled', !canSearch);
            }, 800));

            me.uiSearchBtn.on('click', function (e) {
                e.preventDefault();

                var searchParams = {
                    "groupOp": "AND",
                    "rules": [{
                        "field": "mchtName",
                        "op": "lk",
                        "data": me.uiSearchInput.closest('[name="mchtName"]').val() || ''
                    },{
                        "field": "phoneNo",
                        "op": "lk",
                        "data": me.uiSearchInput.closest('[name="phoneNo"]').val() || ''
                    }]
                };

                me.showSearchView({
                    filters: JSON.stringify(searchParams)
                });

            });

            //this.getSearchInputEl().on('input', _.debounce(function () {
            //    if($.trim(this.value)!=='') {
            //        me.showSearchView($.trim(this.value));
            //    }
            //}, 800));
        },

        canSearchMcht: function () {
            var mchtName = this.uiSearchInput.closest('[name="mchtName"]').val();
            var phoneNo = this.uiSearchInput.closest('[name="phoneNo"]').val();

            return !!mchtName || !!phoneNo;
        },

        onSearch: function (params) {
            this.showSearchView(params);
        },

        searchSubmit: function (e) {
            e.preventDefault();

            var val = $.trim(this.ui.searchInput.val());

            if(val===''){
                this.cancelSearch();
            }else {
                this.onSearch(val);

                if(this.enableCancelSearch) {
                    this.ui.cancelSearchBtn.show();
                }
            }
        },

        reset: function () {
            ParentDialog.prototype.reset.apply(this, arguments);
            this.resetAllSub();
        },

        resetAllSub: function () {
            this.eachSubView(function(view) {
                view.reset && view.reset();
            });
        },

        onSelectTarget: function (targetInfoObj) {
            this.setSelectObj(targetInfoObj);
        },

        eachSubView: function(cb) {
            var me = this;
            _.each(this.subViews, function(view) {
                cb.call(me, view);
            });
        },

       showSearchView: function (params) {

            this.updateCaptionLine('搜索相关的商户');
            this.listView.updateKeyword(params);
            this.listView.show();

        }

    });

    function mchtSearchFilterTpl () {
        return [
            '<div class="search-wrap">',
                '<label class="search-name">商户名</label>',
                '<input type="text" name="mchtName" class="search-input">',
            '</div>',
            '<div class="search-wrap">',
                '<label class="search-name">手机号</label>',
                '<input type="text" name="phoneNo" class="search-input">',
            '</div>',
            '<button type="submit" class="btn btn-primary search-btn" disabled>搜索商户</button>'
        ].join('');
    }

    return View;
});