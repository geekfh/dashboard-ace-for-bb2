define(['tpl!app/oms/wkb/task/perform/templates/history.tpl'], function(tpl) {

    var View = Marionette.ItemView.extend({

        events: {
            
        },

        template: tpl,

        className: 'history-wrapper task-history',

        initialize: function (options) {
            this.options = options;
            this.render();
        },

        serializeData: function(){
            return this.options.data;
        },

        onRender: function(){
            var me = this;

            me.$el.find('.history-wrapper').removeClass('history-wrapper task-history');
            me.$el.appendTo(this.options.renderTo);
            me.attachToBtn(this.options.triggerBtn);


            if(me.options.toggle){
                me.$el.show();
            }else{
                me.$el.hide();
            }

            $(document.body).on('click.historyHide',function(){
                if(me.canHide()) {
                    me.$el.hide();
                }
            });

            me.$el.on('click',function(){
                return false;
            });

        },

        canHide: function(){
            if(this.$el.is(':visible')){
                return true;
            }else{
                return false;
            }
        },


        attachToBtn: function (infoBtn){
            var me = this;
            $(window).on('resize.history',function(){
                me.$el.position({
                    my: 'center-35% top',
                    at: 'center bottom',
                    of: $(infoBtn),
                    collision: 'none'
                });
            });
            $(infoBtn).on('click.historyShow',function(){
                me.$el.show();
                setTimeout(function(){
                    $(window).triggerHandler('resize.history');
                },1);
                return false;
            });
        }


    });

    return View;
});