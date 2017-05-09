define(['zTree'], function() {

    var OrgTreeView = Backbone.Marionette.ItemView.extend({
        className: 'tree-wrap',
        template: _.template([
            '<div id="org-select-tree" class="ztree org-select-tree"></div>'
        ].join('')),

        ui: {
            tree: '#org-select-tree'
        },
        award: false,
        initialize: function(data) {
            this.render();
            this.award = data.orgTreeOptions && data.orgTreeOptions.award;//true 表示 业绩指标查询
            this.hasInit = false;
            this._initData = null;
            this.ztree = null;
            this.type = data.type;
        },

        _initTreeRoot: function() {
            var me = this;
            var orgTreeOptions = this.getOption('orgTreeOptions');
            var _params = {type: me.type};
            if(orgTreeOptions && orgTreeOptions.params){
                $.extend(_params, orgTreeOptions.params);
            }
            Opf.ajax({
                url: url._("report.tree.getInitOrgData"),
                data: _params,
                success: function(data) {
                    if (data) {
                        me._initData = data;
                        me._renderTree();
                    }
                },
                error: function(data){
                    $("#org-select-tree").html("该机构没有下级机构，不能进行统计！").css("text-align", "center").css("margin-top", "20px");
                }
            });
        },

        convertNodesData: function (arr, level) {
            var me = this;
            // leafDeep 如果配置了 2, 那么最多可以允许点击 '+' 号来异步获取到 2 级的孩子结点
            var orgTreeOptions = this.getOption('orgTreeOptions') || {};
            var leafDeep = orgTreeOptions.leafDeep || 999;
            return _.map(arr, function(item) {
                return {
                    id: item.id,
                    name: orgTreeOptions.award === true ? item.name : me.nameFormat(item),//下级机构的名字
                    isParent: item.hasChild && level < leafDeep,
                    orgLevel: item.orgLevel,
                    nocheck: orgTreeOptions.award === true ? false : (item.hasChild === false && me.type === 'rankBrh'),//nocheck=true 标示没有radio按钮
                    simpleName: orgTreeOptions.award === true ? item.name : me.simpleNameFormat(item)
                };
            });
        },

        convertInitData2TreeData: function() {
            var me = this;
            var data = this._initData;
            var orgTreeOptions = this.getOption('orgTreeOptions') || {};
            var award = orgTreeOptions.award;
            var ruleType = Ctx.getUser() && Ctx.getUser().get('ruleType');
            var root, children = this.convertNodesData(data.children, 1);
            //award ? data.id = 1 :'';
            //如果规则为下级机构全部，此时后台传过来的根节点的id为null，那么在生成机构树时不能看到本机构，只能显示所有的下级机构
            if(data.id){
                root = {
                    orgLevel: data.orgLevel,
                    id: data.id,
                    name:  me.nameFormat(data),//最外层机构的名字
                    open: true,
                    nocheck: false,  //统计排行榜，就算是下级机构的权限，也应该是可以统计下级机构（这里的对象是下级机构）
                    children: children,
                    simpleName :  me.simpleNameFormat(data)
                };

            }
            if(award &&(ruleType == 1 || ruleType == 2)){
                root = {
                    orgLevel: data.orgLevel,
                    id: '1',//默认1
                    name:  '全选',
                    open: true,
                    nocheck: false,
                    children: children,
                    simpleName :  data.name
                }
                if(ruleType == 1){
                    var childOne = {//把父节点放到第一个孩子(谢斌提的变态需求)
                        id: data.id,
                        name: data.name,
                        isParent: false,
                        orgLevel: data.orgLevel,
                        nocheck: false,//nocheck=true 标示没有radio按钮
                        simpleName:  data.name
                    }

                    children.unshift(childOne);
                }

            }

            return root || children;
        },

        _renderTree: function() {
            var me = this;
            var zTreeNodes = this.convertInitData2TreeData();
            var orgTreeOptions = this.getOption('orgTreeOptions') || {};
            console.log(zTreeNodes);
            var setting = {
                view: {
                    selectedMulti: false,
                    showLine: false, //不 显示层级虚线
                    showIcon: false, //不 显示几点类型图标
                    nameIsHTML : true
                },
                data: {
                    key: {
                        title: "simpleName"
                    }
                },
                check: {
                    enable: true,
                    chkStyle: orgTreeOptions.award == true ? "checkbox" : 'radio', //award == true 表示业绩指标查询--用的是复选框，其他是单选框
                    radioType: "all",
                    chkboxType: { "Y": "ps", "N": "ps" }//勾选结点不影响父亲和孩子的选中
                },
                callback: {
                    beforeClick: function (treeId, treeNode, clickFlag) {
                        if(treeNode.nocheck) {
                            return false;
                        }
                        return true;
                    },
                    onClick: function (event, treeId, treeNode, clickFlag) {
                        ztree.checkNode(treeNode, true, false, true);
                    },
                    onCheck: function (event, treeId, treeNode ) {
                        ztree[treeNode.checked ? 'selectNode' : 'cancelSelectedNode'](treeNode);
                        if(treeNode.checked) {
                            me.trigger('select:target', [treeNode,'orgTree']);//TODO 第二个参数为机构信息对象,这里暂时用treeNode顶替
                        }
                    }
                },
                async: { //异步加载孩子
                    enable: true,
                    type: 'GET',
                    url: function(treeId, treeNod) {
                        return url._("report.tree.getChildrenByOrg", {
                            id: treeNod.id
                        });
                    },
                    otherParam: orgTreeOptions.params,
                    dataFilter: function (treeId, parentNode, responseData) {
                        return me.convertNodesData(responseData, parentNode.level + 1);
                    }
                }
            };

              var ztree = this.ztree = $.fn.zTree.init(this.ui.tree, setting, zTreeNodes);
        },

        reset: function () {
            var ztree = this.ztree;
            if(ztree) {//树是异步创建，第一次不需要重置
                _.each(ztree.getSelectedNodes(), function (treeNode) {
                    ztree.cancelSelectedNode(treeNode);
                });
                _.each(ztree.getCheckedNodes(true), function (treeNode) {
                    ztree.checkNode(treeNode, false);
                });
            }
        },

        show: function() {
            if (!this.hasInit) {
                this._initTreeRoot();
            }
            this.$el.show();
        },

        nameFormat: function (item) {//机构选择弹框的展示名称
            var text = this.type == 'rankBrh' ? '下属机构' : '拓展员业绩';
            var labelHtml;
            if(item.hasChild === false && this.type === 'rankBrh'){
                labelHtml = '<span>' + item.name + '</span><span style="color: #999;">没有'+ text +',不能统计</span>';
            }else{
                labelHtml = '<span style="color: #999;">统计</span><span>' + item.name + '</span><span style="color: #999;"">的'+ text +'</span>';
            }
            return labelHtml;
        },
        simpleNameFormat: function (item) {//考核范围旁边的展示名称
            var text = this.type == 'rankBrh' ? '下属机构' : '拓展员业绩';
            var labelHtml;
            if(item.hasChild === false && this.type === 'rankBrh'){
                labelHtml = item.name + '没有'+ text +'，不能统计';
            }else{
                labelHtml = "统计" + item.name + "的" + text;
            }
            return labelHtml;
        }
    });

    return OrgTreeView;
});