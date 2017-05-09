define([
    'tpl!assets/scripts/fwk/component/templates/switchable-dropdown.tpl'
], function(tpl) {

    /*
    options = {
    data: {
        defaultValue: '1',
        menu: [{value: '1', label: '正序'}, {value: '0', label: '倒序'}]
    },
    events:{
        'changed.bs.dropdown': _.bind(this._onOrderChange, this)
    }
    }
     */

    var Dropdown = Backbone.View.extend({
        tagName: 'span',
        initialize: function (options) {
            this.options = options;
            this.render();
        },
        render: function () {
            this.$el.append(tpl({data:this.options.data}));
        }
    });


    return Dropdown;
});