define([
    'tpl!app/oms/route/oneSettle/templates/model.tpl'
], function(tpl) {

    var ITEM_BLUR   = 0,  // 不选中
        ITEM_FORCE  = 1,  // 选中
        ITEM_SELECT = 2;  // 带边框的高亮

    var ItemView = Marionette.ItemView.extend({
        template: tpl,
        triggers: {
            'click .edit-model':    'edit:model',
            'click .view-model':    'view:model',
            'click .del-model':     'del:model',
            // 'click .model-content': 'click:content'
            'click .details-model-content': 'view:model',
            'change [name="checkbox"]': 'change:checkbox',

            'change input[name="checkbox"]': 'click:content'
        },

        ui: {
            checkbox: 'input[name="checkbox"]'
        },

        events: {
            'change input[name="checkbox"]': function (e) {
                // console.log(e);
                // console.log(e.target);
                // alert($(e.target).is(':checked'));
                this.triggerMethod('click:content');
            }
        },

        serializeData: function () {
            return { model: this.model, permission: this.permission };
        },

        initialize: function () {
            var me = this;
            // me.model.set('operate', ITEM_BLUR);

            // me.model.on('change', function () {
            //     me.render();
            // });
        },

        // cleanSelected: function () {
        //     if (this.isSelected()) {
        //         this.trigger('click:content');
        //     }
        // },

        // 该模型是否选中
        isChecked: function () {
            // return this.model.get('operate') === ITEM_SELECT;
            return this.ui.checkbox.is(':checked');
        },

        // isBlur: function () {
        //     return this.model.get('operate') === ITEM_BLUR;
        // },

        // 该模型是否没有被选中
        isUnchecked: function () {
            return !this.isChecked();
        },

        // 在高亮与暗色间切换
        // updateRelevance: function () {
        //     this.model.get('operate') === ITEM_BLUR ? this.model.set('operate', ITEM_FORCE) : this.model.set('operate', ITEM_BLUR);
        // },

        // 选中这个模型
        checkedView: function () {
            // this.model.set('operate', ITEM_FORCE);
            this.ui.checkbox.prop('checked', true);
        },

        // 反选这个模型
        uncheckedView: function () {
            // this.model.set('operate', ITEM_BLUR);
            this.ui.checkbox.prop('checked', false);
        }


        // 带边框的高亮
        // selectView: function () {
        //     this.model.set('operate', ITEM_SELECT);
        // }

        
    });
    
    return ItemView;
});