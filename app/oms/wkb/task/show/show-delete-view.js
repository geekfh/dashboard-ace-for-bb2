define(['App',
  'i18n!app/oms/common/nls/wkb',
  'tpl!app/oms/wkb/task/perform/templates/history.tpl',
  'moment.override'
], function(App, wkbLang, tpl) {


  App.module('WkbSysApp.Task.Show.deleteView', function(View, App, Backbone, Marionette, $, _) {

    View.Task = Marionette.ItemView.extend({
        className: 'show-task',
        template: tpl,

        events: {
            'click .js-back'      : 'goback'
        },

        ui: {
            btnTake:   '.js-take'
        },

        constructor: function (options) {
            Marionette.ItemView.prototype.constructor.apply(this, arguments);
            this.data = options.data;
        },

        onRender: function () {
            var me = this;
            var $el = this.$el;

            var $history = $el.find('.history-wrapper');
            $history.addClass('delete-history');
            $history.find('.arrow,.arrow-border').remove();

            var backBtnHtml = [
              '<div class="row">',
                '<div class=" col-sm-4 col-xs-3">',
                    '<button type="button" class="js-back btn btn-default pull-left">',
                      '<span class="icon icon-reply"></span> 返回',
                    '</button>',
                '</div>',
              '</div>'
            ].join('');

            $(backBtnHtml).insertBefore($history);
        },

        serializeData: function () {
            return this.data;
        },

        goback: function () {
            this.$el.remove();
            this.trigger('back');
        }
    });


  });



  return App.WkbSysApp.Task.Show.deleteView.Task;

});