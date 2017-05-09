define([
    'tpl!app/oms/wkb/task/list/templates/pager.tpl'],
function (tpl) {

    var View = Marionette.ItemView.extend({

        initialize: function (options) {
            this.collection = options.collection;

            this.render();
        },

        triggers: {
        },

        events: {
            'click .previous': function (e) {
                if(!$(e.target).closest('li').hasClass('disabled')) {
                    this.trigger('previous:page');
                }
            },
            'click .next': function (e) {
                if(!$(e.target).closest('li').hasClass('disabled')) {
                    this.trigger('next:page');
                }
            },
            'click .first': function (e) {
                if(!$(e.target).closest('li').hasClass('disabled')) {
                    this.trigger('first:page');
                }
            },
            'click .last': function (e) {
                if(!$(e.target).closest('li').hasClass('disabled')) {
                    this.trigger('last:page');
                }
            },
            'change .size': function (e) {
                this.trigger('change:size', e);
            }
        },

        template: tpl,

        ui: {
            firstBtn: '.first',
            lastBtn: '.last',
            preBtn     : '.previous',
            nextBtn    : '.next',
            startNo    : '.start-no',
            endNo      : '.end-no',
            totalNum   : '.total-num',
            zeroOccupy : '.zero-occupy',
            sizeSelect: '[name="size"]',
            rowsNumInfoWrap: '.rows-info-wrap'
        },

        onRender: function () {
            var ui = this.ui;

            this.collection.on('sync', function (collection, resp) {

                var firstPage = resp.firstPage;
                var lastPage = resp.lastPage;
                var number = resp.number;
                var numberOfElements = resp.numberOfElements;
                var size = resp.size;
                var sort = resp.sort;
                var totalElements = resp.totalElements;
                var totalPages = resp.totalPages;

                ui.firstBtn.toggleClass('disabled', firstPage == true);
                ui.lastBtn.toggleClass('disabled', lastPage == true);

                ui.preBtn.toggleClass('disabled', firstPage === true);
                ui.nextBtn.toggleClass('disabled', lastPage === true);

                ui.sizeSelect.val(size);

                //当前页第一条处于全局第几条
                if(numberOfElements) {
                    ui.rowsNumInfoWrap.show();
                    ui.startNo.text(number * size + 1);
                    ui.endNo.text(number * size + numberOfElements);
                }else {
                    ui.rowsNumInfoWrap.hide();
                }
                ui.totalNum.text(totalElements);
                
            });
        }
    });

    return View;
});
