define([
    'tpl!app/oms/mcht/service/templates/pager.tpl'
    ],function(pagerTpl){
        var Pager = Marionette.ItemView.extend({
            initialize: function(options){
                this.collection = options.collection;
                this.render();
            },

            template: pagerTpl,

            ui: {
                firstBtn: '.first-page',
                lastBtn:  '.last-page',
                preBtn:   '.previous-page',
                nextBtn:  '.next-page'
            },

            events: {
                'click .previous-page': function (e) {
                    if(!$(e.target).closest('li').hasClass('disabled')) {
                        this.trigger('previous:page');
                    }
                },
                'click .next-page': function (e) {
                    if(!$(e.target).closest('li').hasClass('disabled')) {
                        this.trigger('next:page');
                    }
                },
                'click .first-page': function (e) {
                    if(!$(e.target).closest('li').hasClass('disabled')) {
                        this.trigger('first:page');
                    }
                },
                'click .last-page': function (e) {
                    if(!$(e.target).closest('li').hasClass('disabled')) {
                        this.trigger('last:page');
                    }
                }

            },


            onRender: function(){
                this._listenerToUpdatePager();
            },

            _listenerToUpdatePager: function(collection, resp){
                this.collection.on('sync', function(collection, resp){
                    
                    var firstPage = resp.firstPage
                        ,lastPage = resp.lastPage
                        ,number = resp.number
                        ,numberOfElements = resp.numberOfElements
                        ,size = resp.size
                        ,sort = resp.sort
                        ,totalElements = resp.totalElements
                        ,totalPages = resp.totalPages
                        ,ui = this.ui;


                    ui.firstBtn.toggleClass('disabled', firstPage === true);
                    ui.lastBtn.toggleClass('disabled', lastPage === true);

                    ui.preBtn.toggleClass('disabled', firstPage === true);
                    ui.nextBtn.toggleClass('disabled', lastPage === true);
                    
                }, this);
            }
        });

        return Pager;
});