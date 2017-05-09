/**
 * Created by liliu on 2017/1/19.
 */
define([
	'App',
	'jquery.jqGrid'
], function(App){
	var STATUS_MAP = {
		1: '批次未审核',
		2: '冻结失败',
		3: '待贴票',
		4: '未审核',
		5: '审核通过',
		6: '审核拒绝',
		7: '解冻成功',
		8: '解冻失败'
	};
	var tableCtTpl = [
		'<div class="row">' ,
		'<div class="col-xs-12 jgrid-container">' ,
		'<table id="updateAwardDetail-grid-table"></table>',
		'<div id="updateAwardDetail-grid-pager"></div>',
		'</div>',
		'</div>'].join('');
	var View = Marionette.ItemView.extend({
		template: _.template(tableCtTpl),
		tabId: 'menu.updateAwardDetail',
		initialize: function(options){
			this.data = options.data;
		},
		onRender: function(){
			var me = this;
			_.defer(function(){
				me.renderGrid();
				this.$('.ui-dialog-buttonset').prepend(_.template('<span style="padding-right: 10px;"><input type="checkbox" name = "noCheck">不选数据提交</input></span>'));
			});
		},
		renderGrid: function(){
			var me = this;
			var grid = me.grid = App.Factory.createJqGrid({
				gid: 'updateAwardDetail-grid',
				rsId: 'updateAwardDetail',
				cellEdit: true,
				cellsubmit:'clientArray',
				editurl: 'clientArray',
				multiselect: true,
				actionsCol: false,
				rowList: [10, 20, 30, 100, 200, 300],
				nav: {
					actions:{
						add: false,
						search: false,
						refresh: false
					}
				},
				url: url._('posted.audit.user', {userId: this.data.userId}),
				colModel: [
					{name:'id'},
					{name:'userName'},
					{name:'status', formatter: statusFormatter},
					{name:'totalRewardAmount'},
					{name:'ticketAmount', editable: true, formatter:'number'},
					{name:'taxAmount', editable: true, formatter:'number'},
					{name:'thawAmount', formatter:'number'},
					{name:'remarks'}
				],
				colNames: {
					id: '奖励ID',
					userName: '用户姓名',
					status: '状态',
					totalRewardAmount: '奖励金额(元)',
					ticketAmount: '贴票金额',
					taxAmount: '代扣税额',
					thawAmount: '解冻金额',
					remarks: '备注'
				},
				onSelectRow: function(rowid, status, e){
					if(status === false){
						me.grid.setRowData(rowid, {'ticketAmount':'', 'taxAmount':'', 'thawAmount':''});
					}else {
						me.grid.setRowData(rowid, {'ticketAmount':me.data.ticketAmount, 'taxAmount':me.data.taxAmount, 'thawAmount':me.data.ticketAmount-me.data.taxAmount});
					}
					setStat(me);
				},
				beforeEditCell:function(rowid, cellname, value, iRow, iCol){
					var me = this;
					if(!$(this).find("tr[id="+rowid+"]").find('td:first>input').is(':checked')){
						setTimeout(function () {
							Opf.Toast.info('请先勾选此行！');
							$(me).jqGrid('restoreCell', iRow, iCol);
						}, 1);
					}
				},
				afterEditCell: function(rowid, cellname, value, iRow, iCol){},
				beforeSaveCell: function(rowid, cellname, value, iRow, iCol){},
				afterSaveCell: function(rowid, cellname, value, iRow, iCol){
					var ticketAmount = me.grid.getCell(rowid, 'ticketAmount');
					var taxAmount = me.grid.getCell(rowid, 'taxAmount');
					var thawAmount = ticketAmount-taxAmount;//计算解冻金额
					if(thawAmount < 0){
						$(this).jqGrid('restoreCell', iRow, iCol);
						Opf.Toast.error('贴票金额应大于扣税金额！');
					}else {
						me.grid.setCell(rowid, 'thawAmount', thawAmount);
						setStat(me);
					}
				}
			});

			_.defer(function(){
				addStatLine(grid);
			})
		},
		submit: function(id, callback){
			var me = this;
			Opf.confirm('确认提交？', function (result) {
				if (!result) {
					return;
				}
				if (Opf.Grid.hasSelRow(me.grid) === 0 && !$('.ui-dialog-buttonset').find('[name = "noCheck"]').is(':checked') === true) {
					Opf.alert('请至少选择一行数据.');
					return false;
				}
				var data = [];
				if($('.ui-dialog-buttonset').find('[name = "noCheck"]').is(':checked') === false){
					data = me.getSelectedData();
				}
				Opf.ajax({
					url: url._('posted.audit.userUpdate', {id: id}),
					type: 'PUT',
					jsonData: data,
					success: function(res){
						if(res.success){
							Opf.Toast.success(res.msg || '操作成功');
						}
					}
				});
				callback();
			});
		},
		getSelectedData: function () {
			var me = this;
			var rowsData = _.map(me.grid.jqGrid('getGridParam', 'selarrrow'), function (id) {
				return me.grid.jqGrid('getRowData', id);
			});

			return _.map(rowsData, function (item) {
				return _.pick(item, 'id', 'ticketAmount', 'taxAmount', 'thawAmount');
			});
		}
	});

	function addStatLine (grid) {
		var $grid = $(grid);
		var $uiGrid = $grid.closest('.ui-jqgrid');
		var $toppager = $uiGrid.find('.ui-jqgrid-toppager');

		// 只需在当前jqgrid里面找到'.totalInfo',再将其移除
		$uiGrid.find('#updateAwardDetail-grid-pager').remove();
		var $statLine = $('<div class="totalInfo"></div>');

		var statHtml = [
			'<div class="stat">',
			'<span class="statLabel">贴票总金额:</span>',
			'<span class="statValue">￥0</span>',
			'</div>',
			'<div class="stat">',
			'<span class="statLabel">代扣税总金额:</span>',
			'<span class="statValue">￥0</span>',
			'</div>',
			'<div class="stat">',
			'<span class="statLabel">解冻总金额:</span>',
			'<span class="statValue">￥0</span>',
			'</div>'
		].join('');
		$statLine.append(statHtml);
		$toppager.after($statLine);
	}
	function setStat(me){
		var rowsData = _.map(me.grid.jqGrid('getGridParam', 'selarrrow'), function (id) {
			return me.grid.jqGrid('getRowData', id);
		});
		var getSumAmount = function (){
			var getNumberArray = function(){
				return _.map(_.pluck(arguments[0], arguments[1]), function(item){
					return Number(item);
				})
			};
			return _.reduce(getNumberArray.apply(null, arguments), function(memo, num){ return memo + num; }, 0);
		};
		//获取 贴票总金额 代扣税总金额 解冻总金额
		var sumTicketAmount = getSumAmount.call(null, rowsData, 'ticketAmount');
		var sumTaxAmount = getSumAmount.call(null, rowsData, 'taxAmount');
		var sumThawAmount = getSumAmount.call(null, rowsData, 'thawAmount');

		var updateDisplaySumAmount = (function(me){
			var $stat = $(me.$el).find('.stat .statValue');
			$stat.filter(":eq(0)").text('￥'+ Opf.currencyFormatter(sumTicketAmount));
			$stat.filter(":eq(1)").text('￥'+ Opf.currencyFormatter(sumTaxAmount));
			$stat.filter(":eq(2)").text('￥'+ Opf.currencyFormatter(sumThawAmount));
		})(me, sumTicketAmount, sumTaxAmount, sumThawAmount);
	}
	function statusFormatter(val){
		return STATUS_MAP[val] || '';
	}
	return View;
});