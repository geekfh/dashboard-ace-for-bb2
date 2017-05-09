define([
    'app/oms/report/component/AbstractTargetSearchDialog',
    'app/oms/report/component/ExploreSelectView',
    'app/oms/report/component/SearchableExplorerList'


], function(ParentDialog, ExploreSelectView, SearchableExplorerList) {

    var View = ParentDialog.extend({
        
        dialogClass: 'explorer-select-dialog',
        title: '统计某个拓展员',//TODO 后续提供更新title的方法
        searchSubmitBtnText: '搜索拓展员',
        searchInputPlaceHolder: '拓展员的名称',

        initialize: function (options) {
            options = options || {};
            this.status = null;// 'tree'/'search'

            this.complexSelectView = new ExploreSelectView({
                type: 'reportOpr',
                orgTreeOptions: options.orgTreeOptions
            }); //用于机构树
            
            this.listView = new SearchableExplorerList($.extend({}, {
                orgTreeOptions: options.orgTreeOptions
            })); //用于显示搜索结果

            this.subViews = [this.complexSelectView, this.listView];

            ParentDialog.prototype.initialize.apply(this, arguments);
        },

        onRender: function () {
            ParentDialog.prototype.onRender.apply(this, arguments);

            this.showComplexSelectView();
            this.attachEvents();
        },

        onCancelSearch: function () {
            this.showComplexSelectView();
        },

        onSearch: function (kw) {
            this.showSearchView(kw);
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

        attachEvents: function () {

            this.complexSelectView.on('select:target', _.bind(this.onSelectExplorer, this));

            this.listView.on('select:target', _.bind(this.onSelectExplorer, this));
        },

        onSelectExplorer: function (obj) {
            console.log('>>>onSelectExplorer', obj);
            this.setSelectObj(obj);
        },

        hideAllSub: function() {
            this.eachSubView(function(view) {
                view.$el.hide();
            });
        },

        eachSubView: function(cb) {
            var me = this;
            _.each(this.subViews, function(view) {
                cb.call(me, view);
            });
        },

        showComplexSelectView: function() {
            this.hideAllSub();

            this.status = 'tree';
            this.updateCaptionLine('<span class="org-sub-title">所属机构</span><span class="explorer-sub-title">选择拓展员</span>');
            this.complexSelectView.show();
            this.complexSelectView.reset();
            this.complexSelectView.$el.appendTo(this.ui.contentWrap);
        },

        //TODO 不对
       showSearchView: function (kw) {
            this.hideAllSub();

            this.status = 'search';
            this.updateCaptionLine('<span class="explorer-sub-title">名称包含 “'+ kw + '” 的拓展员</span>');
            this.listView.updateKeyword(kw);
            this.listView.show();
            this.listView.$el.appendTo(this.ui.contentWrap);
        }



    });
    
    return View;
});