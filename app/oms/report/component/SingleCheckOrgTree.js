define([
    'app/oms/report/component/AbstractOrgTree'
], function(AbstractOrgTree) {

    var me;

    return AbstractOrgTree.extend({

        initialize: function () {
            me = this;
            AbstractOrgTree.prototype.initialize.apply(this, arguments);
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

        treeSetting: {

            check: {
                enable: true,
                chkStyle: "radio", //全体互斥的选项按钮
                radioType: "all",
                chkboxType: { "Y": "", "N": "" }//勾选结点不影响父亲和孩子的选中
            },

            callback: {

                beforeClick: function (treeId, treeNode, clickFlag) {
                    if(treeNode.nocheck) {
                        return false;
                    }
                    return true;
                },

                onClick: function (event, treeId, treeNode, clickFlag) {
                    this.getZTreeObj(treeId).checkNode(treeNode, true, false, true);
                },

                onCheck: function (event, treeId, treeNode ) {
                    var ztree = this.getZTreeObj(treeId);
                    ztree[treeNode.checked ? 'selectNode' : 'cancelSelectedNode'](treeNode);

                    if(treeNode.checked) {
                        me.trigger('select:target', treeNode);//TODO 第二个参数为机构信息对象,这里暂时用treeNode顶替
                    }
                }
            }
        }
    });


});