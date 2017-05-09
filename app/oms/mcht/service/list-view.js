define([
    'tpl!app/oms/mcht/service/templates/row.tpl',
    'tpl!app/oms/mcht/service/templates/list.tpl',
    'app/oms/mcht/service/pager'
    ], function(rowTpl,listTpl,Pager){
    var SUMMARY_DESC_LEN = 80;
    var RowView = Marionette.ItemView.extend({
        template: rowTpl,

        events: {
            'click .unfold' : 'unfoldDesc',
            'click .fold' : 'foldDesc'
        },

        triggers: {
            'click .invite-more' : 'invite:more',
            'click .show-actual-user' : 'show:actual:user'
        },

        className: 'row service-row',

        mixinTemplateHelpers: function(data){
            if (data.desc.length > SUMMARY_DESC_LEN) {
                data.summaryDesc = data.desc.slice(0,SUMMARY_DESC_LEN) + '...';
                data.shouldAppendUnfoldBtn = true;
            } else {
                data.summaryDesc = data.desc;
                data.shouldAppendUnfoldBtn = false;
            }
            return data;
        },

        unfoldDesc: function(e){
            $(e.target).closest('div').toggle();
            $(e.target).closest('.service-desc').find('.service-detail-desc').toggle();
        },

        foldDesc: function(e){
            $(e.target).closest('div').toggle();
            $(e.target).closest('.service-desc').find('.service-summary-desc').toggle();
        }
    });

    var EmptyView = Marionette.ItemView.extend({
            template: _.template([
                '<h3 class="align-center">没有数据</h3>'
            ].join(''))
        });


    var CompositeView = Marionette.CompositeView.extend({
        tabId: 'menu.mcht.service',

        emptyView: EmptyView,
        template: listTpl,
        childView: RowView,
        childViewContainer: '.brh-service-list-container',

        initialize: function(){
            this.render();
        },

        onRender: function(){
            // this._addPager();
            // this._addListener();
        },

        onChildviewInviteMore: function(args){
            this.trigger('invite:more', args.model.get('id'));
        },

        onChildviewShowActualUser: function(args){
            this.trigger('show:actual:user', args.model.get('id'));
        },

        _addPager: function(){
            this.pager = new Pager({collection: this.collection}); //render()
            this.$('.pager-container').append(this.pager.$el);
        },

        _addListener: function(){
            this.listenTo(this.pager, 'all', function(evName){
                this.trigger.apply(this, arguments);
            });
        }

    });

    return CompositeView;
});