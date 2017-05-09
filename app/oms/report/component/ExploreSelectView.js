//机构树和拓展员列表组成的视图
define([
    'app/oms/report/component/AbstractOrgTree'
], function(AbstractOrgTree) {

    var Collection = Backbone.Collection.extend({

        updateOrgId: function (id, options) {
            this.fetch({
                url: url._("report.tree.getExploreByOrg", {id: id}),
                data: options.params
            });
        }
    });

    var ItemView = Marionette.ItemView.extend({
        tagName: 'li',
        className: 'explorer-item',
        template: _.template([
            '<label radio-explorer-id="<%=id%>"><input type="radio" name="explorer" class="radio-btn"/><%=name%></label>'
        ].join(''))

    });

    var NoExplorerView = Backbone.Marionette.ItemView.extend({
        template: _.template([
        '<div class="text-center" style="color:#AAA;position:relative;top:40px;">',
            '该机构没有拓展员',
        '</div>'
        ].join(''))
    });

    var View = Marionette.CompositeView.extend({

        className: 'complex-explorer-select clearfix',

        emptyView: NoExplorerView,

        template: _.template([
            '<div class="org-tree-sit"></div>',
            '<div class="explorer-list-sit"><ul class="explorer-list"></ul></div>'
        ].join('')),

        childViewContainer: '.explorer-list',
        childView: ItemView,

        events: {
            'change .radio-btn': 'onExplorerSelect'
        },

        ui: {
            orgTreeSit: '.org-tree-sit'
        },

        onExplorerSelect: function (e) {
            if($(e.target).prop('checked')) {
                var explorerId = $(e.target).closest('label').attr('radio-explorer-id');
                var model = this.collection.findWhere({id:explorerId});
                this.trigger('select:target', model.toJSON());
            }
        },

        initialize: function () {
            var me = this;

            this.collection = new Collection();

            this.collection.on('request', function () {
                Opf.UI.ajaxLoading(me.$el);
            });

            this.render();
        },

        onRender: function () {
            var me = this;

            var OrgTreeView = AbstractOrgTree.extend({
                treeSetting: {
                    callback: {
                        onClick: function(e, treeId, treeNode, clickFlag){
                            me.collection.updateOrgId(treeNode.id, me.getOption('orgTreeOptions'));
                        }
                    }
                }
            });

            var view = new OrgTreeView({
                renderTo: me.ui.orgTreeSit,
                type: 'reportOpr',
                orgTreeOptions: me.getOption('orgTreeOptions')
            });

            view.on('init', function () {
                var nodes = this.ztree.getNodes();
                if(nodes && nodes[0] && nodes[0].id) {
                    me.collection.updateOrgId(nodes[0].id, me.getOption('orgTreeOptions'));
                }
            });
        },

        show: function () {
            this.$el.show();
        },

        reset: function () {
            this.$el.find('input:checked').prop('checked', false);
        }
    });

    return View;
});