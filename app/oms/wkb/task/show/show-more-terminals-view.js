define([
    'tpl!app/oms/wkb/task/show/templates/row.tpl',
    'tpl!app/oms/wkb/task/show/templates/terminalsList.tpl'
    ], function(row, list){

        var RowView = Marionette.ItemView.extend({
            template: row
            ,tagName: 'ul'
            ,className: 'terminal-row'
        });

        var TableView = Marionette.CompositeView.extend({
            template: list
            ,className: 'more-terminals-container'
            ,childView: RowView
            ,childViewContainer: '.terminals-list'

            ,initialize: function(){
                var me = this;
                this.collection.on('sync', function(collection, resp){
                    me.updateBtnStatus(resp);
                });
            }

            ,onRender: function (){
                this._listenToPagger();
                this.trigger("get:first:page");
            }
            ,_listenToPagger: function(){
                var me = this;
                this.$(".previous-btn").on("click", function(){
                    me.trigger("previous:btn:click");
                });
                this.$(".next-btn").on("click", function(){
                    me.trigger("next:btn:click");
                });
            }

            ,updateBtnStatus: function(resp){
                this.$(".previous-btn").toggleClass('disabled', resp.firstPage === true);
                this.$(".next-btn").toggleClass('disabled', resp.lastPage === true);
            }
        });
    return TableView;
});