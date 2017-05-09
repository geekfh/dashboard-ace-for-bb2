define([
    'tpl!app/oms/message/push-sm/list/templates/perform.tpl'
    // ,'moment.origin'
], function(tpl) {

    var View = Marionette.ItemView.extend({
        template: tpl,
        triggers: {
            'click .perform-cancel': 'perform:cancel'
        },

        events: {
            'click .download-xls': 'downloadXls',
            'click .perform-submit': 'onSubmit'
        },

        initialize: function (options) {
            this.render();
            this._attachValidation();
        },

        serializeData: function () {
            return { model: this.model };
        },

        getValues: function () {
            var me = this;

            return {
                name: me.$el.find('[name="result"]:checked').val() === "1" ?
                        me.getStatus(me.model.get('pushType')) :
                        "4",
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

        downloadXls: function(event){
            var url = $(event.target).data('href');
            Opf.download(url);
        },

        onSubmit: function (e) {
            var me = this;

            if (!this.validate()) {
                return;
            }

            Opf.ajax({
                url: url._('push.sm.status',{id : me.model.get('id')}),
                type: 'PUT',
                jsonData: me.getValues(),
                success: function (resp) {
                    if (resp.success === true) {
                        Opf.Toast.success('操作成功');
                    }
                },
                error: function () {
                    Opf.alert('提交出错');
                },
                complete: function(){
                    me.trigger('perform:complete');
                }
            });
        },

        getStatus: function(pushType){
            // var 
            //     now = moment().format("YYYYMMDDHHmm"),
            //     me = this;
            if (pushType == '1') {
                return '3';
            }
            // return (me.model.get('sendTime') - now > 0) ? '2' : '3';
            return '2';
        }

    });
    
    return View;
});