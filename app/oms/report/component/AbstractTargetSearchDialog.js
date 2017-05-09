/**
 * 抽象类，包含了窗体骨架和搜索部分
 * 配置项参考 "你通常需要覆盖的配置>>>" 部分
 *
 * 目前子类不支持 ui 和 events 这类配置，如果子类配置了，父类的事件和ui引用就坏掉
 * 后续子类需要再说吧，建议不要用到这些属性，如果真的用到就以为着父类还不够抽象
 *
 * 设置当前选择的对象，this.setSelectObj 方法
 */
define([
    'tpl!app/oms/report/component/templates/target-search-select-panel.tpl'
], function(panelTpl) {

    var OrgSelectView = Backbone.Marionette.ItemView.extend({

        /*********** 你通常需要覆盖的配置>>>  ******************/
        dialogClass: '',
        title: '',//窗口标题
        captionHtml: '',//选择目标标题
        searchSubmitBtnText: '',//搜索按钮的文字
        searchInputPlaceHolder: '',//搜索框的placeholder
        enableCancelSearch: true,

        //进入搜索状态后回调
        onSearch: function () {
        },

        //点击取消搜索按钮后的回调
        onCancelSearch: function () {
        },

        //每次打开窗口（open方法）会调用reset
        reset: function () {
            //TODO 父类要不要重置 this.selObj
            this.setSelectObj(null);
        },

        /*********** <<<你通常需要覆盖的配置 ******************/
        ui: {
            cancelSearchBtn: '.cancel-btn',
            searchForm: '.search-form',
            searchInput: '.search-input',
            searchBtn: '.search-btn',
            contentCaptionLine: '.caption-line',
            contentWrap : '.content-wrap',
            panel: '.target-select-panel'//窗口内容的顶级dom
        },

        events: {
            'click .cancel-btn': 'cancelSearch',
            'submit .search-form': 'searchSubmit'
        },

        template: panelTpl,

        serializeData: function () {
            return {
                searchSubmitBtnText: this.searchSubmitBtnText,
                searchInputPlaceHolder: this.searchInputPlaceHolder,
                captionHtml: this.captionHtml || ''
            };
        },

        initialize: function(options) {
            this.options = options;

            this.selObj = null;//选中的对象信息

            this.dialog = null;

            this.render(); //绘制骨架
        },

        getSearchForm: function () {
            return this.ui.searchForm;
        },

        getSearchInputEl: function () {
            return this.ui.searchInput;
        },

        getSearchBtn: function () {
            return this.ui.searchBtn;
        },

        setSelectObj: function (obj) {
            this.selObj = obj;
        },

        onSubmit: function () {
            //保证view接收的都是有数据的。在这里，第二次后如果没有进行选择，会默认的选择上一次的，不知道好不好？
            if(this.selObj){
                this.trigger('select:target', this.selObj);
                return true;
            }else{
                Opf.alert("您还没有选择相关的数据，请进行选择！！！");
                return false;
            }
        },

        cancelSearch: function () {
            this.onCancelSearch();
            this.ui.cancelSearchBtn.hide();
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

        resize: _.debounce(function (event, ui) {
            var h = this.ui.panel.height();//窗体内容顶级dom的高度
            //遍历 “树或者列表”的容器的兄弟高度，减去这部分就是内容容器的高度
            this.ui.contentWrap.siblings().each(function (idx, el) {
                h -= $(el).outerHeight(true);
            });
            if(h>0) {
                this.ui.contentWrap.height(h);
            }
        }, 150),

        onRender: function() {
            var me = this;
            this.dialog = Opf.Factory.createDialog(this.$el, {
                dialogClass: (this.dialogClass || '') + ' blue-light-dialog report-target-dialog',
                title: this.title,
                width: 570,
                height: 500,
                modal: true,
                resize: _.bind(me.resize, me),
                buttons: [{
                    type: 'submit',
                    text: '确认',
                    click: function () {
                        //当没有进行选择，请求失败的时候，不关闭对话框
                        if(me.onSubmit()){
                            me.dialog.dialog('close');
                        }                        
                    }
                },{
                    type: 'cancel'
                }]
            });
            this.resize();
        },

        open: function() {
            this.reset();
            this.dialog.dialog('open');
            this.resize();
        },

        updateCaptionLine: function (str) {
            this.ui.contentCaptionLine.html(str);
        }

    });

    return OrgSelectView;

});