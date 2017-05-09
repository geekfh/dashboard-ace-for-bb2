/**
 * @created 2014-3-12 19:27:29
 */
define(['App',
	'tpl!app/oms/settle/settle-lock/list/templates/table-ct.tpl',
	'i18n!app/oms/common/nls/settle',
	'assets/scripts/fwk/factory/typeahead.factory',
	'common-ui',
	'jquery.jqGrid',
	'bootstrap-datepicker'
], function(App, tableCtTpl,settleLang, typeaheadFactory,commonUi) {

	var LOCKFLAG_MAP = {
		'0' : settleLang._('settle.lock.get.lock'),
		'1' : settleLang._('settle.lock.off.lock'),
	}

	App.module('SettleApp.settleLock.List.View', function(View, App, Backbone, Marionette, $, _) {

		View.settleLock = Marionette.ItemView.extend({
			tabId: 'menu.settle.lock',
			template: tableCtTpl,

			events: {

			},

			onRender: function() {
				var me = this;

				setTimeout(function() {

					me.renderGrid();

				},1);
			},
	
			renderGrid: function() {
				var me= this;
				var roleGird = App.Factory.createJqGrid({
					rsId:'settleLock',
					caption: settleLang._('settle.lock.txt'),
					actionsCol: {
						edit : false,
						del: false,
						extraButtons: [
							{name: 'unlock', title:'解锁', icon: 'icon-unlock red', click: function() {
								var selectId = Opf.Grid.getLastSelRowId(roleGird);
								Opf.ajax({
									type:'PUT',
									url:url._('settle.lock.unlock',{id:selectId}),
									success:function(){
										$(roleGird).trigger("reloadGrid", [{current:true}]);
										Opf.Toast.success('操作成功');
									}
								});
							}},
							{name: 'lock', title:'加锁', icon: 'icon-lock', click: function() {
								var selectId = Opf.Grid.getLastSelRowId(roleGird);
								Opf.ajax({
									type:'PUT',
									url:url._('settle.lock.lock',{id:selectId}),
									success:function(){
										$(roleGird).trigger("reloadGrid", [{current:true}]);
										Opf.Toast.success('操作成功');
									}
								});
							}}
						],
						canButtonRender: function(name, opts, rowData) {
							if(name === 'unlock' && rowData.lockFlag !== '0' ) {
								return false;
							}
							if(name === 'lock' && rowData.lockFlag !== '1' ) {
								return false;
							}
						}
					},
					nav: {
						actions: {
                            add: false
                        }
					},
					gid: 'settle-lock-grid',//innerly get corresponding ct '#channel-accounts-grid-table' '#channel-accounts-grid-pager'
					url: url._('settle.lock'),
					colNames: {
						id             : settleLang._('settle.lock.id'),  //ID
						controlId      : settleLang._('settle.lock.control.id'),  //关联清算控制表编号
						oprLockId      : settleLang._('settle.lock.opr.lock.id'),  //任务领取人编号
						oprLockName    : settleLang._('settle.lock.opr.lock.name'),  //任务领取人
						oprUnlockId    : settleLang._('settle.lock.opr.unlock.id'),  //任务解锁人编号
						oprUnlockName  : settleLang._('settle.lock.opr.unlock.name'),  //任务解锁人
						lockFlag       : settleLang._('settle.lock.lock.flag'),  //锁状态
						ip             : settleLang._('settle.lock.ip'),  //绑定ip
						mac            : settleLang._('settle.lock.mac'),  //网卡
						lockTime       : settleLang._('settle.lock.lock.time'),  //领用时间
						unlockTime     : settleLang._('settle.lock.unlock.time'),  //解绑时间
						res            : settleLang._('settle.lock.res')  //预留
					},

					colModel: [
						{name:         'id', index:         'id', editable: false, hidden: true},  //ID
						{name:         'controlId', index:         'controlId', editable: true},  //关联清算控制表id
						{name:         'oprLockId', index:         'oprLockId', editable: false,hidden: true},  //任务领取人编号
						{name:         'oprLockName', index:         'oprLockName', search:true, editable: true,
							_searchType:'string'
						},  //任务领取人
						{name:         'oprUnlockId', index:         'oprUnlockId', editable: false,hidden: true},  //任务解锁人编号
						{name:         'oprUnlockName', index:         'oprUnlockName', search:true, editable: true,
							_searchType:'string'
						},  //任务解锁人
						{name:         'lockFlag', index:         'lockFlag', editable: false,formatter: lockFlagFormatter },  //锁状态
						{name:         'ip', index:         'ip', editable: true},  //绑定ip
						{name:         'mac', index:         'mac', editable: true},  //网卡
						{name:         'lockTime', index:         'lockTime', editable: true},  //领用时间
						{name:         'unlockTime', index:         'unlockTime', editable: true},  //解绑时间
						{name:         'res', index:         'res', editable: true,hidden: true}  //预留
					],

					loadComplete: function() {}
				});

			}

		});
	});

	function lockFlagFormatter(value) {
		return LOCKFLAG_MAP[value];
	}

	return App.SettleApp.settleLock.List.View;

});