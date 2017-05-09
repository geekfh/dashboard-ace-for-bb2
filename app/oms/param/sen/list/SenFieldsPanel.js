//对应一个机构类型的配置视图
define([
    'tpl!app/oms/param/sen/list/templates/sen-fields-panel.tpl',
    'app/oms/param/sen/list/SenFiledsGroupItemPanel',
    'app/oms/param/sen/list/FilterBar'

], function(tpl, SenFiledsGroupItemPanel, FilterBar) {

    var SenPanel = Marionette.CompositeView.extend({

        className: 'sen-fields-panel-sit',

        ui: {
            fixedHeadWrap: '.fixed-head-wrap',
            filterBarSit: '.filter-bar-sit',

            btnEdit: '.btn-edit',
            btnSave: '.btn-save',
            editModeBtnGroup: '.btn-group.for-edit',
            head: '.head'
        },

        events: {
            'click .btn-cancel-edit': 'onCancelEdit',
            'click .btn-edit': 'onEdit',
            'click .btn-save': 'onSave'
        },

        childView: SenFiledsGroupItemPanel,
        childViewContainer: '.panel-group',

        template: tpl,

        initialize: function (options) {
            var me = this;

            this.editMode = false;

            this.options = options;

            var rawCollection = this.rawCollection = options.rawCollection;

            this.collection = new Backbone.Collection();

            rawCollection.on('sync', function () {

                me.collection.reset();

                var groups = rawCollection.groupBy(function (item) {
                    return item.get('classNameDesc');
                });

                _.each(groups, function (fieldModels, name) {

                    me.collection.add(new Backbone.Model({
                        classNameDesc: fieldModels[0].get('classNameDesc'),
                        className: fieldModels[0].get('className'),
                        fieldsCollection: new Backbone.Collection(fieldModels)
                    }));

                });
            });


            rawCollection.on('request', function () {
                Opf.UI.ajaxLoading(me.$el);
            });

        },

        onSaveSuccess: function () {
            this.exitEditMode();
        },

        toggleEditModeBtn: function (toEditMode) {
            this.ui.btnEdit.toggle(!toEditMode);
            this.ui.editModeBtnGroup.toggle(toEditMode);
        },

        onEdit: function () {

            //TODO 判断collection是否sync完, 在collection里面扩展一个回调
            //如果加载完直接执行，如果没加载完在sync里面执行,这个TODO等我来
            this.enterEditMode();
        },

        enterEditMode: function () {
            this.editMode = true;

            this.toggleEditModeBtn(true);
            this.children.each(function (childView) {
                childView.enterEditMode();
            });
        },

        onCancelEdit: function () {
            this.exitEditMode();
            this.trigger('cancel:edit');
        },

        exitEditMode: function () {
            this.editMode = false;
            this.toggleEditModeBtn(false);
        },

        onSave: function () {
            this.trigger('save');
        },

        /**
         * @param  {Array} words
         */
        applyFilter: function (words) {
            words = $.makeArray(words);
            this.children.each(function (childView) {
                childView.applyFilter(words);
            });
        },

        onRender: function () {

            if(Ctx.avail('sen.btn.edit')) {
                this.ui.btnEdit.css('visibility','visible');
            }

            var me = this;

            this.ui.fixedHeadWrap.scrollToFixed();


            var filterBar = this.filterBar = new FilterBar({
                renderTo: this.ui.filterBarSit
            });

            filterBar.on('search:submit', function (words) {
                me.applyFilter(words);
            });
        }

    });

    return SenPanel;

});