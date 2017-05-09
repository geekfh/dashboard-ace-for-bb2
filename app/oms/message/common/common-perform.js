define([
    'tpl!app/oms/message/common/templates/perform.tpl'
], function(tpl) {

    var View = Marionette.ItemView.extend({
        template: tpl,
        triggers: {
            'click .perform-cancel': 'perform:cancel'
        },

        events: {
            'click .perform-submit': 'onSubmit'
        },

        initialize: function (options) {
            this.formLayout = options.formLayout;
            this.previewLayout = options.previewLayout;
            this.url = options.url;

            this.render();
            this._attachValidation();
        },

        onRender: function() {
            this.$el.find('.download-xls').click(function(){
                var url = $(this).find('span').text();
                Opf.download(url);
            });
        },

        serializeData: function () {
            return { 
                model: this.model,
                formLayout: this.formLayout,
                previewLayout: this.previewLayout
            };
        },

        getValues: function () {
            var me = this;

            return {
                name: me.$el.find('[name="result"]:checked').val(),
                value:   me.$el.find('[name="desc"]').val()
            };

        },

        validate: function () {
            return this.$el.find('form.form-perform').valid();
        },

        _attachValidation: function () {
            var $form = this.$el.find('form.form-perform');

            $form.validate({
                rules: {
                    desc: {required:true}
                }
            });
        },

        onSubmit: function (e) {
            var me = this;

            if (!this.validate()) {
                return;
            }

            Opf.ajax({
                url: me.url,
                type: 'PUT',
                jsonData: me.getValues(),
                success: function (resp) {
                    me.trigger('perform:success');
                    Opf.Toast.success('操作成功');
                },
                error: function () {
                    Opf.alert('提交出错');
                }         
            });
        }

    });
    
    return View;
});