

//此Controller对应于权限管理菜单下的规则表
define(['App'], function(App) {

	function isCustomRuleVal(val) {
		return parseInt(val, 10) === 0;
	}


	var Controller = Marionette.Controller.extend({

		listRules: function(kw) {

			var me = this;

			require(['app/oms/auth/rule/list/list-view' /*,'entities/user'*/ ], function(View) {

				console.info('new view rule');
				var rulesView = new View.Rules({});
				App.show(rulesView);

				rulesView.on('typeChange', me.onTypeChange, me);

				me.rulesView = rulesView;
			});


		}, //@listRules

		/**|--------------------------------------------
		 * |for add/edit form pop from grid
		 * |--------------------------------------------*/
		onTypeChangeToCustom: function(e,checkedList) {
			var me = this;
			var $tbody = $(e.target).closest('tbody');

			//取消上次ajax
			this._lastFetchDiretOgrs && this._lastFetchDiretOgrs.abort();
			this._lastFetchDirectExpands && this._lastFetchDirectExpands.abort();

			//TODO busy
			$.when(this.fetchDiretOgrs(), this.fetchDirectExpands(),
				Loader.deferRquire(['app/oms/auth/rule/list/type-custom-row-view']))//

			.done(function (orgsResp, oprsResp, TypeCustomView) {

				// new TypeCustomView(orgsData, oprsData);
				var view = new TypeCustomView(convertOrgsData(orgsResp[0],checkedList),
					convertExpandsData(oprsResp[0],checkedList), me.rulesView);

				$tbody.append(view.$el);

				Opf.Function.defer(function () {
					// Opf.Util.positionFixed($(e.target).closest('.ui-jqdialog'));
				}, 1);

				me.typeCustomView = view;

			}).always(function () {
				//TODO un busy
			}).fail(function () {
				//TODO
			});
		},

		onTypeChangeFromCustom: function(e) {

			// var $typeRow = $(e.target).closest('tr');
			// var $typeEdit = $typeRow.next('.rule-type-edit-row');
			// if ($typeEdit.length) {
			// 	$typeEdit.remove();
			// }
			this.typeCustomView && this.typeCustomView.destroy();
		},

		/**
		 * 获取当前用户所在机构的下级机构数据
		 */
		fetchDiretOgrs: function() {
			//TODO remove mock
			return (this._lastFetchDiretOgrs = $.ajax({
				url: url._('rule.branches'),
				dataType: 'json'
			}));
		},

		/**
		 * 获取当前用户所在机构的下级拓展员数据
		 */
		fetchDirectExpands: function() {
			//TODO remove mock
			return (this._lastFetchDirectExpands = $.ajax({
				url: url._('rule.operators'), 
				dataType: 'json'
			}));
		},

		onTypeChange: function(e, typeVal,checkedList) {
			this[isCustomRuleVal(typeVal) ? 'onTypeChangeToCustom' : 'onTypeChangeFromCustom'](e,checkedList);
			console.log('>>>type change', typeVal);
		}
		//ef for



	});


	function convertOrgsData(data,checkedList) {
		var result = [];
		var newData = dataSetSelected(data,'0',checkedList);
		Opf.walkTree(newData, {
			deep: 1,
			collection: result,
			nodeCb: function (isParent, node, collection) {
				collection.push({
					id: node.id + 'org',
					code: node.code,
					text: node.name,
					a_attr: {
						title: node.name
					},
					state: {
						selected:node.selected
					}
				});
			}
		});
		return result;
	}

	function convertExpandsData(data,checkedList) {
		var result = [];
		var newData = dataSetSelected(data,'1',checkedList);
		Opf.walkTree(newData, {
			deep: 1,
			collection: result,
			nodeCb: function (isParent, node, collection) {
				collection.push({
					code: node.code,
					id: node.id + 'exp',
					text: node.name,
					a_attr: {
						title: node.name
					},
					state: {
						selected:node.selected
					}
				});
			}
		});
		return result;
	}
	
	function dataSetSelected(data,type,checkedList){
		var xdata = data;
		_.each(xdata,function(node){
			node['selected'] = false;
			var nodeMark = type == '0' ? 'code':'id';
			_.each(checkedList,function(checkedNode){
				if(node[nodeMark] == checkedNode.value){
					node['selected'] = true;
				}
			});
		});
		return xdata;
	}
	
	var ctrl = new Controller();

    App.on('rules:list', function() {
        console.log('监听到 App触发的"rules:list"事件, 触发权限管理菜单下的规则表');
        ctrl.listRules();
    });

    return ctrl;


});