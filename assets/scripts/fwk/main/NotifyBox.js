define([
    'tpl!assets/scripts/fwk/main/templates/notify-box.tpl',
    'marionette',
    'framework'
], function(tpl) {

    return Marionette.ItemView.extend({

        template: tpl,
        tagName: 'li',
        className: 'light-blue xxxgrey',

        initialize: function() {
            // var me = this;
            // if(!Ctx.avail('hint.annunciate')){
            //     return false;
            // }
            // Opf.ajax({
            //     url: url._('user.notices.summary'),
            //     success: function(data) {
            //         me.data = data;
            //         me.render().$el.prependTo($('#notify-boxes'));
            //     }
            // });

            return false;
        },

        serializeData: function() {
            return this.data;
        },

        onRender: function() {
            var $el = this.$el;
            var $notifyBtn = $el.find('.notify-btn');
            setTimeout(function(){
                var $notice = $('body').find('[data-trigger="notice:list"]');
                if($notice.length){
                    $notifyBtn.click(function(){
                        $notice.trigger('click');
                    });
                }
            },300);

        }

    });
});