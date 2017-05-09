//对应一个机构类型的配置视图
define([
    'tpl!app/oms/param/sen/list/templates/filter-bar.tpl',
    'tpl!app/oms/param/sen/list/templates/filter-tag.tpl'
], function(filterTpl,tagTpl) {



    var TagStore = Backbone.Collection.extend({
        /**
         * @return {Array}
         */
        getFilterWords :function () {
            return this.pluck('name');
        }
    });

    var TagItem = Marionette.ItemView.extend({
        tagName: 'li',
        className: 'tag-item',
        template: tagTpl,
        triggers: {
            'click .btn-remove-tag': 'remove:tag'
        }
    });


    var FilterBar = Marionette.CompositeView.extend({

        template: filterTpl,
        className: 'filter-bar',

        childView: TagItem,
        childViewContainer: '.kw-tags',

        ui: {
            filterIndicator: '.filter-indicator',
            filterKwSit : '.filter-indicator .kw-tags',
            inputSearch: 'input[name="kw"]'
        },

        events: {
            'click .btn-revoke-filter': 'onRevokeFilter',
            'submit .form-search': 'onSearchSubmit'
        },

        initialize: function (options) {
            var me = this;

            this.options = options || {};
            this._lastKw = null;

            this.collection = new TagStore();

            this.render();

            this.collection.on('reset', onCollectionChanged);
            this.collection.on('remove', onCollectionChanged);

            function onCollectionChanged () {
                me.ui.filterIndicator.toggle(me.collection.length>0);

                me.trigger('search:submit', me.collection.getFilterWords());
            }
        },

        onChildviewRemoveTag: function (childView) {
            this.collection.remove(childView.model);

            this.ui.inputSearch.val(this.collection.getFilterWords().join(' '));
        },

        onRevokeFilter: function () {
            this.collection.reset();
            
            this.ui.inputSearch.val(this.collection.getFilterWords().join(' '));
        },

        onRender: function () {
            var me = this;

            this.ui.filterIndicator.hide();

            if(this.options.renderTo) {
                this.$el.appendTo(this.options.renderTo);
            }

            this.ui.inputSearch.on('input', _.debounce(function (e) {
                me.applyKeywords($.trim(e.target.value));
            },200));
        },

        onSearchSubmit: function (e) { 
            e && e.preventDefault();

            var kw = $.trim(this.ui.inputSearch.val());
            this.applyKeywords(kw);
        },

        applyKeywords: function (kw) {
            kw = $.trim(kw);

            if(kw === this._lastKw) {
                return;
            }

            this.collection.reset(this.convertKw(kw));
            this._lastKw = kw;
        },

        convertKw: function (str) {
            str = $.trim(str);
            if(str === '') {
                return [];
            }
            return _.map(_.unique(str.split(/\s+/)), function (w) {
                return { id: w, name: w };
            });
        }

    });

    return FilterBar;

});