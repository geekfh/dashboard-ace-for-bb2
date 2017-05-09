define(['App',
	'i18n!app/oms/common/nls/auth',
	'zTree'
], function(App, authLang) {

	App.module('AuthSysApp.Role.View', function(View, App, Backbone, Marionette, $, _) {

		View.AddAuth = Marionette.ItemView.extend({
			tagName: 'form',
			template: _.template('<div class="tree ztree" id="roleTree' + Opf.Utils.id() + '"></div>'),

			initialize: function (data) {
				this._data = data;
			},

			setLoading: function (toggle) {
				Opf.UI.setLoading(this.$el,toggle);
				// Opf.UI[toggle ? 'spin' : 'unSpin'](this.$el);
			},

			onRender: function() {
				var me = this;
				//var $form = $('<form><div class="tree"></div></form>');

				var treeNodeClick = function(e, treeId, treeNode) {
					// tree.expandNode(treeNode);
					tree.checkNode(treeNode, undefined, true);
				};

				var tree = $.fn.zTree.init(me.$el.find('.tree'), {
					check: {
						enable: true
					},
					view: {
						showIcon: false,
						dblClickExpand: false
					},
					callback: {
						onClick: treeNodeClick
					}
				}, convert(me._data));

				Opf.Factory.createDialog(this.el,{
					modal: true,
					height: 480,
					minHeight: 480,
					width: 420,
					title: '添加权限',
					destroyOnClose: true,
					buttons: [{
						//TODO i18n
						text: '提交',
						click: function() {
							// var ids = tree.jstree('get_selected');
							//TODO provide jstree.getSelctedItems method
							// ids = _.map(ids, function (id) {
							// 	retur tree.jstree('get_node',id);
							// });
							//TODO need a better way
							// var selId = Utils.jqGrid.getLastSelRowId(grid);
							// var reg = /^j/;
							// ids = _.filter(ids, function (val) {
							// 	return val && !reg.test(val)
							// });
							var checkedNodes = tree.getCheckedNodes();
							var ids = [];
							_.each(checkedNodes, function(val){
								if(val.isLeaf && val.id !== null) {
									ids.push(val.id);
								}
							}); 
							
							me.trigger('submit', ids);
						}
					}]
				});
			}
		});
	});

/**
     * 权限列表转成树结构，参数列表的每一个元素都应一个叶子，
     * 同时，每一个元素的 wholeName 字段用来生成对应的父节点
     * @param  {[type]} auths 
     * [{name: "费率模型修改", value: "system:brhprofitmodel:u", wholeName: "系统管理-费率模型"},...]
     * @return {[type]}       [description]
     */
    function convert (auths) {
        var WHOLENAME_SEP = '-';
        var rootList = [];
        var curNode, curList;
        var nameArr, name;

        _.each(auths, function (item) {
            nameArr = item.wholeName? item.wholeName.split('-'):[];
            curList = rootList;

            //wholeName 用来生成父节点
            for (var i = 0; i < nameArr.length; i++) {
                //找到以 nameArr[i] 为name的结点
                curNode = _.findWhere(curList, {name: nameArr[i]});

                if(!curNode) {
					curNode = {
						text: nameArr[i],
						name: nameArr[i]
					};

                    curList.push(curNode);

                    //更新父节点配置
                    curNode.type = 'folder';
                    curNode.isLeaf = false;
                    curNode.state = 'opened';
                    curNode.children = [];
                }
                //当前列表 变为 该结点的孩子列表
                curList = curNode.children;
            }

            //auths 列表里每个元素对应一个叶子
            curList.push({
            	id: item.id,
                name: item.name,
                isLeaf: true,
                code: item.value,
                type: "item"
            });

        });
        return rootList;
    }

	return App.AuthSysApp.Role.View.AddAuth;

});

