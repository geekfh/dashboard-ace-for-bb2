define([
    'tpl!app/oms/message/push-sm/add/templates/item.tpl',
    'tpl!app/oms/message/push-sm/add/templates/list.tpl'
], function(itemTpl, listTpl) {

    var ItemView = Marionette.ItemView.extend({
        template: itemTpl,
        tagName: 'tr',
        className: 'message-list-item',
        triggers: {
            'click .list-edit': 'show:edit',
            'click .list-del' : 'del:item'
        },

        initialize: function () {

        },

        onRender: function () {

        },

        onDelItem: function () {
            var me = this;

            Opf.ajax({
                url: url._('push.sm.eidt', {id: me.model.get('id')}),
                type: 'DELETE',
                success: function (resp) {
                    me.trigger('del:item:success');
                },
                error: function (resp) {
                    Opf.alert('请求出错');
                }
            });
        }

    });


    var Collection = Backbone.Collection.extend({
        // url: 'assets/data/message.json'
        url: url._('push.sm.category')
    });


    var View = Marionette.CompositeView.extend({
        template: listTpl,
        childViewContainer: '.msg-categories-list',
        childView: ItemView,

        initialize: function () {
            this.collection = new Collection();
        },

        onRender: function () {
            this.collection.fetch();
            this._addValidateEvents();
        },

        ui: {
            name: '[name="name"]',
            desc: '[name="desc"]',
            btnAdd:  '.btn-add',
            btnEdit: '.btn-edit'
        },

        triggers: {
            'click .btn-add'    : 'click:add',
            'click .btn-edit'   : 'click:edit',
            'click .btn-cancel' : 'click:cancel'
        },

        onChildviewShowEdit: function (child, obj) {
            var model = obj.model;
            var ui = this.ui;
            this.editingModel = model;

            ui.name.val(model.get('name'));
            ui.desc.val(model.get('descr'));

            this.showEdit();
        },

        _addValidateEvents: function () {
            var $form = this.$el.find('form');

            $form.validate({
                rules: {
                    name: {required:true},
                    desc: {required:true}
                }
            });
        },

        getValues: function () {
            var ui = this.ui;
            return {
                name: ui.name.val(),
                desc: ui.desc.val()
            };
        },

        onClickAdd: function () {
            var me = this;
            var $form = me.$el.find('form');
            if(!$form.valid()) {
                return;
            }

            Opf.ajax({
                url: url._('push.sm.eidt'),
                type: 'POST',
                jsonData: me.getValues(),
                success: function (resp) {
                    me.collection.fetch();
                },
                error: function (resp) {
                    Opf.alert('请求出错');
                }
            });
        },

        onClickEdit: function () {
            var me = this;
            var itemId = me.editingModel.get('id');

            Opf.ajax({
                url: url._('push.sm.eidt', { id: itemId }),
                type: 'PUT',
                jsonData: $.extend({ id: itemId }, me.getValues()),
                success: function (resp) {
                    me.showAdd();
                    // 不加 reset: true ，本地collection 不会立即更新
                    me.collection.fetch({reset:true});
                },
                error: function (resp) {
                    Opf.alert('请求出错');
                }
            });
        },

        onClickCancel: function () {
            this.showAdd();
        },

        showEdit: function () {
            this.ui.btnAdd.hide();
            this.ui.btnEdit.show();
        },

        showAdd: function () {
            this.ui.name.val('');
            this.ui.desc.val('');
            this.ui.btnAdd.show();
            this.ui.btnEdit.hide();
        },

        onChildviewDelItemSuccess: function () {
            this.collection.fetch({reset: true});
        }


    });

    
    return View;
});