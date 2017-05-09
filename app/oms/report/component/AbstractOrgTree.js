define(['zTree'], function() {

    var OrgTreeView = Backbone.Marionette.ItemView.extend({
        className: 'tree-wrap',

        /************* 通常需要覆盖的配置>>> **********************/
        treeSetting: null,

        reset: function () {

        },

        /************* <<<通常需要覆盖的配置 **********************/

        template: function () {
            //ztree某个实例的标识依赖id
            var fn = _.template([
                '<div id="org-select-tree-' + Opf.Utils.id() + '" class="ztree org-select-tree"></div>'
            ].join(''));
            return fn.apply(this, arguments);
        },

        ui: {
            tree: '.org-select-tree'
        },


        onDestroy: function () {
            console.log('>>>destroy abstractOrgTree.js');
            if(this.ztree) {
                this.ztree.destroy();
            }  
        },

        initialize: function(options) {
            this.options = options;
            this.hasInit = false;
            this._initData = null;
            this.ztree = null;
            this.type = options.type;
            this.descLabel = '';

            // 这个是加在树的叶子节点后面的描述字段
            if(this.getOption('descLabel')){
                this.descLabel = '<span style="color: #bbb;">' + this.getOption('descLabel') + '</span>';
            }
            
            this.render();

            this._initTreeRoot();

            if(options.renderTo) {
                this.$el.appendTo (options.renderTo);
            }
        },


        _initTreeRoot: function() {
            if(this.hasInit) {
                return;
            }
            
            var me = this;
            var orgTreeOptions = this.getOption('orgTreeOptions');

            var _params = {type: me.type};
            if(orgTreeOptions && orgTreeOptions.params){
                $.extend(_params, orgTreeOptions.params);
            }

            Opf.ajax($.extend({
                url: url._("report.tree.getInitOrgData"),
                data: _params,
                success: function(data) {
                    if (data) {
                        me._initData = data;
                        me._renderTree();
                        me.trigger('init', data);
                    }
                }
            }, this.getOption('getInitOrgDataAjaxOptions')));

            this.hasInit = true;
        },

        convertNodesData: function (arr) {
            var descLabel = this.descLabel;
            return _.map(arr, function(item) {
                return {
                    id: item.id,
                    name: item.name + descLabel,
                    isParent: item.hasChild,
                    orgLevel: item.orgLevel
                };
            });
        },

        convertInitData2TreeData: function() {
            var descLabel = this.descLabel;
            var data = this._initData;
            var root, children = this.convertNodesData(data.children);
            //如果规则为下级机构全部，此时后台传过来的根节点的id为null，那么在生成机构树时不能看到本机构，只能显示所有的下级机构
            if(data.id){
                root = {
                    orgLevel: data.orgLevel,
                    id: data.id,
                    name: data.name + descLabel,
                    open: true,
                    children: children
                };
            }

            return root || children;
        },
        
        _renderTree: function() {
            var me = this;
            var zTreeNodes = this.convertInitData2TreeData();
            var orgTreeOptions = this.getOption('orgTreeOptions');

            var defaultSetting = {
                view: {
                    selectedMulti: false,
                    showLine: false, //不 显示层级虚线
                    showIcon: false, //不 显示几点类型图标
                    nameIsHTML : true
                },
                callback: {
                    
                },
                async: { //异步加载孩子
                    enable: true,
                    type: 'GET',
                    url: function(treeId, treeNod) {
                        return url._("report.tree.getChildrenByOrg", {
                            id: treeNod && treeNod.id
                        });
                    },
                    otherParam: orgTreeOptions.params,
                    dataFilter: function (treeId, parentNode, responseData) {
                        return me.convertNodesData(responseData);
                    }
                }
            };

            var setting = $.extend(true, defaultSetting, this.treeSetting);

            var ztree = this.ztree = $.fn.zTree.init(this.ui.tree, setting, zTreeNodes);
        },

        show: function() {
            this.$el.show();
        }
    });

    return OrgTreeView;
});