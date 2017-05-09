define([
    'tpl!app/oms/message/ktb-news/templates/news-dialog.tpl',
    'moment.override',
    'jquery.jqGrid'
], function(tpl) {

    var NewsView = Marionette.ItemView.extend({
        tabId: 'menu.msg.push.list',
        template: tpl,
        events: {
            'click .news-button': 'clickNewsButton'
        },

        initialize: function () {
            this.render();
        },

        clickNewsButton: function () {
            this.trigger('close:dialog');

            require(['app/oms/notice/notice-list-view'], function () {
                App.trigger('notice:list');
            });

        },

        onRender: function() {

        }

    });


    function showKTBNews () {
        var newsView = new NewsView();
        newsView.on('close:dialog', function () {
            $dialog.dialog('destroy');
        });

        var $dialog = Opf.Factory.createDialog(newsView.$el, {
            modal: true,
            height: $(window).height() > 500 ? 500 : $(window).height()-50,
            minHeight: 200,
            width: $(window).width() > 800 ? 800 : $(window).width()-10,
            title: ''
        });
        
    }


    App.on('show:ktb:news', function () {
            showKTBNews({
                url: 'http://www.baidu.com'
            });
    });



    return NewsView;
});