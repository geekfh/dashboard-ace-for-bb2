define([
    'app/oms/report/component/AbstractTargetSearchDialog',
    'app/oms/report/component/SingleCheckOrgTree',
    'app/oms/report/component/SearchableOrgList'

], function(ParentDialog, SingleCheckOrgTree, OrgSearchListView) {

    var View = ParentDialog.extend({
        dialogClass: 'org-select-dialog',
        title: '统计某个机构',//TODO 后续提供更新title的方法
        searchSubmitBtnText: '搜索机构',
        searchInputPlaceHolder: '机构的名称',

        initialize: function (options) {
            options = options || {};
            this.status = null;// 'tree'/'search'

            options.title && (this.title = options.title);

            this.treeView = new SingleCheckOrgTree({
                type: 'reportBrh',
                orgTreeOptions: options.orgTreeOptions
            }); //用于机构树
            
            this.listView = new OrgSearchListView($.extend({}, {
                orgTreeOptions: options.orgTreeOptions
            })); //用于显示搜索结果

            this.subViews = [this.treeView, this.listView];

            ParentDialog.prototype.initialize.apply(this, arguments);
        },

        onRender: function () {
            ParentDialog.prototype.onRender.apply(this, arguments);

            this.showTreeView();
            this.attachEvents();
        },

        onCancelSearch: function () {
            this.showTreeView();
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

            this.treeView.on('select:target', _.bind(this.onSelectOrg, this));

            this.listView.on('select:target', _.bind(this.onSelectOrg, this));
        },

        onSelectOrg: function (orgInfoObj) {
            this.setSelectObj(orgInfoObj);
        },

        hideAllSub: function() {
            this.eachSubView(function(view) {
                view.$el.hide().appendTo(this.ui.contentWrap);
            });
        },

        eachSubView: function(cb) {
            var me = this;
            _.each(this.subViews, function(view) {
                cb.call(me, view);
            });
        },

        showTreeView: function() {
            this.hideAllSub();

            this.updateCaptionLine('选择机构');
            this.treeView.reset();
            this.treeView.show();

            this.status = 'tree';
        },

       showSearchView: function (kw) {
            this.hideAllSub();

            this.updateCaptionLine('名称包含 “' + kw + '” 的机构');
            this.listView.updateKeyword(kw);
            this.listView.show();

            this.status = 'search';
        }



    });
    
    return View;
});