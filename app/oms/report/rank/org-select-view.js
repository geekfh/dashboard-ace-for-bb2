/*
 事件 select:target 选中一个机构
 */
define([
    'tpl!app/oms/report/rank/templates/org-select-panel.tpl',
    'app/oms/report/rank/org-tree',
    'app/oms/report/rank/org-search-list',
    'zTree'
], function(panelTpl, OrgTreeView, OrgSearchListView) {



    /*简单做法，绕开复杂的控制器，把所有view都创建完，但是请求则懒加载
     然后把子view都添加到窗体
     */
    var OrgSelectView = Backbone.Marionette.ItemView.extend({

        ui: {
            cancelSearchBtn: '.cancel-btn',
            searchInput: '.search-input',
            contentCaptionText: '.caption-line .text',
            contentWrap : '.content-wrap',
            panel: '.target-select-panel'//窗口内容的顶级dom
        },

        events: {
            'click .cancel-btn': 'cancelSearch',
            'submit .search-form': 'searchSubmit'
        },

        template: panelTpl,

        award : false,

        initialize: function(options) {
            this.options = options;

            this.award = options.orgTreeOptions && options.orgTreeOptions.award;//true 表示 业绩指标查询
            this.ztreeType = null;//是展现树(orgTree)还是搜索树(searchTree)
            this.status = null;// 'tree'/'search'
            this.selOrgId =  null;
            this.dialog = null;
            this.treeView = new OrgTreeView($.extend({type: options.type},{
                orgTreeOptions:options.orgTreeOptions
            })); //用于机构树

            this.listView = new OrgSearchListView($.extend({},{
                orgTreeOptions:options.orgTreeOptions
            })); //用于显示搜索结果

            this.subViews = [this.treeView, this.listView];

            this.render(); //绘制骨架

            this.attachEvents();
        },

        attachEvents: function () {

            this.treeView.on('select:target', _.bind(this.onSelectOrg, this));

            this.listView.on('select:target', _.bind(this.onSelectOrg, this));
        },

        onConfirm: function () {
            //保证view接收的都是有数据的。在这里，第二次后如果没有进行选择，会默认的选择上一次的，不知道好不好？


            if(this.award){
                var checkedNodes = this.treeView.ztree.getCheckedNodes();
                if(checkedNodes.length > 0 || this.selOrgId){
                    if(this.ztreeType == 'orgTree'){
                        checkedNodes[0].id === '1' ? checkedNodes.shift(): '';//去掉最上面的全选
                        this.trigger('select:target',checkedNodes);
                        return true;
                    }
                    if(this.ztreeType == 'searchTree'){
                        this.trigger('select:target',this.selOrgId);
                        return true;
                    }
                }else{
                    Opf.alert("您还没有选择相关的数据，请进行选择！！！");
                    return false;
                }
            }


            if(this.selOrgId ){
                this.trigger('select:target', this.selOrgId);
                return true;
            }else{
                Opf.alert("您还没有选择相关的数据，请进行选择！！！");
                return false;
            }

        },

        onSelectOrg: function (options) {
            this.selOrgId =  options[0];
            this.ztreeType = options[1];
        },

        cancelSearch: function () {
            this.ui.cancelSearchBtn.hide();
            this.showTreeView();
        },

        searchSubmit: function (e) {
            e.preventDefault();

            var val = $.trim(this.ui.searchInput.val());

            if(val===''){
                this.cancelSearch();
            }else {
                this.showSearchView(val);
                this.ui.cancelSearchBtn.show();
            }
        },

        onResize: _.debounce(function (event, ui) {
            var h = this.ui.panel.height();//窗体内容顶级dom的高度
            //遍历 “树或者列表”的容器的兄弟高度，减去这部分就是内容容器的高度
            this.ui.contentWrap.siblings().each(function (idx, el) {
                h -= $(el).outerHeight(true);
            });
            if(h>0) {
                this.ui.contentWrap.height(h);
            }
        }, 200),

        onRender: function() {
            var me = this;
            this.dialog = Opf.Factory.createDialog(this.$el, {
                dialogClass: 'blue-light-dialog report-target-dialog',
                title: this.options.title || '统计某个机构的业绩',
                width: 570,
                height: 500,
                modal: true,
                resize: _.bind(me.onResize, me),
                buttons: [{
                    type: 'submit',
                    text: '确认',
                    click: function () {
                        //当没有进行选择，请求失败的时候，不关闭对话框
                        if(me.onConfirm()){
                            me.dialog.dialog('close');
                        }
                    }
                },{
                    type: 'cancel'
                }]
            });
            this.onResize();
            this.showTreeView();
            //this.showSearchView();
        },

        open: function() {
            this.reset();
            this.dialog.dialog('open');
        },

        hideAllSub: function() {
            this.eachSubView(function(view) {
                view.$el.hide().appendTo(this.ui.contentWrap);
            });
        },

        reset: function () {
            this.selOrgId = null;
            this.resetAllSub();
        },

        resetAllSub: function () {
            this.eachSubView(function(view) {
                view.reset && view.reset();
            });
        },

        showTreeView: function() {
            this.hideAllSub();

            this.status = 'tree';
            this.ui.contentCaptionText.text('选择机构');
            this.treeView.show();
        },

        showSearchView: function (kw) {
            this.hideAllSub();

            this.status = 'search';
            this.ui.contentCaptionText.text('机构搜索结果');
            this.listView.updateKeyword(kw);
            this.listView.show();
        },

        eachSubView: function(cb) {
            var me = this;
            _.each(this.subViews, function(view) {
                cb.call(me, view);
            });
        }

    });

    return OrgSelectView;

});