//编辑机构计费方案中一条记录

define([
    'app/oms/disc/brh-disc/common/edit/edit-disc-view'
], function(BaseEditDiscView) {

    var EditDiscDialogView = BaseEditDiscView.extend({

        initialize: function () {
            BaseEditDiscView.prototype.initialize.apply(this, arguments);
        },

        onRender: function() {

            BaseEditDiscView.prototype.onRender.apply(this, arguments);

            this.$dialog = Opf.Factory.createDialog(this.$el, {
                dialogClass: '',
                destroyOnClose: true,
                title: '编辑计费方案',
                autoOpen: true,
                width: 750,
                height: 550,
                modal: true,
                buttons: [{
                    type: 'submit',
                    text: '保存',
                    click: _.bind(this._onDialogSave, this)
                }, {
                    type: 'cancel'
                }]
            });
        },

        getPostData: function () {
            var postData = BaseEditDiscView.prototype.getPostData.apply(this, arguments);

            if (this.modelRecord.uniteRatio === '0') {
                delete postData.profitSetting;
            }
            return postData;
        },

        _onDialogSave: function() {
            var me = this;

            if (this.validate()) {
                Opf.UI.ajaxLoading(this.$el);
                Opf.ajax({
                    url: url._('disc.edit.scheme', {id: this.model.get('id')}),
                    type: 'PUT',
                    jsonData: this.getPostData(),
                    complete: function() {
                        me.$dialog.dialog('close');
                    },
                    success: function() {
                        me.trigger('submit:success');
                    }
                });
            }
        }

    });

    return EditDiscDialogView;
});