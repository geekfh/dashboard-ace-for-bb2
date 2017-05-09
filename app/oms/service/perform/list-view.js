/**
 * Created by zhuyimin on 2015/1/27.
 *
 * 服务开通复核，同服务对象管理，操作只有批量通过或者批量拒绝
 */
define([
	'app/oms/service/targetMgrAbstractView',
	'app/oms/service/target-perform-config'
], function(AbstractView,config){
	var OPERATION_MAP = {
		"pass": "0",
		"reject": "4"
	};
	var View = AbstractView.extend({
		tabId: 'menu.service.perform', //会用在 menu.js 里翻译
		canOperate: function(grid, operation){
			if (grid.find('input.cbox:checked').length === 0) {
				return false;
			}
			//TODO 能不能再次通过已经被拒绝的 ？
			return true;
		},


		getRowsData: function(grid,operation){
			return operation === "pass" ? getToBePassedArr(grid) : getToBeRejectedArr(grid);
		},

		//返回一个数组
		getPostData: function(grid,operation){
			var dataArr = [],
				rowsData = this.getRowsData(grid, operation);
			_.each(rowsData, function(rowData){
				dataArr.push({
					registerId : rowData.registerId, //服务编号
					serviceStatus : rowData.status, //当前服务状态
					flag : OPERATION_MAP[operation] //成功更改后的状态
				})
			});
			return dataArr;
		},

		// loadcomplete 执行的回调 每次 reload 取消所以选择
		disableSelect: function(data){
			console.log(data);
			var rows = this.grid.find('.ui-widget-content');
			for (var i = 0; i < data.content.length; i++) {
				$('input.cbox', rows[i]).prop('checked', false);
				$(rows[i]).removeClass('ui-state-highlight');
			}
		},

		STATUS_MAP : {
			"1": "邀请",
			"4": "复核不通过"
		}
	});


	//获取将被通过的数组 TODO 目前只是简单地返回被选中的行，以后会不会有特殊的需要？
	function getToBePassedArr(grid){
		return getRowsData(grid);
	}

	//获取将被拒绝的数组 TODO 目前只是简单地返回被选中的行，以后会不会有特殊的需要？
	function getToBeRejectedArr(grid){
		return getRowsData(grid);
	}

	//获取被选中的行包含的数据
	function getRowsData(grid){
		return _.map(grid.jqGrid('getGridParam', 'selarrrow'), function (id) {
			return grid.jqGrid('getRowData', id);
		});
	}

	App.on('service:perform', function () {
		var view = new View(config.performConfig);
		App.show(view);
	});
	return View;
});