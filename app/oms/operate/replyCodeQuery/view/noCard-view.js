/**
 * Created by liliu on 2016/8/23.
 */
define([
	'tpl!app/oms/operate/replyCodeQuery/templates/uploadFile.tpl',
	'jquery.jqGrid',
	'upload',
	'jquery.validate'
], function(uploadFileTpl){
	var SOURCE_MAP = (function(){
		var sourceMap = [];
		return (function (){
			if(sourceMap.length){
				return sourceMap;
			}else {
				Opf.ajax({
					url: url._('operate.replycode.find-source'),
					type: 'GET',
					async: false,
					success: function(resp){
						sourceMap = resp;
					}
				});
				return sourceMap;
			}
		})()
	})();
	var tpl = [
		'<div class="row">',
		'<div class="col-xs-12 jgrid-container">',
		'<table id="replyCode-noCard-grid-table"></table>',
		'<div id="replyCode-noCard-grid-pager"></div>',
		'</div>',
		'</div>'
	].join('');

	var View = Marionette.ItemView.extend({
		tabId:'menu.replyCodeQuery.noCard',
		template: _.template(tpl),
		initialize: function () {},
		onRender:function(){
			var me = this;
			_.defer(function(){
				me.renderGrid();
			});
		},
		renderGrid:function(){
			var setupValidate = Opf.Validate.setup;
			var addValidateRules = function(form){
				Opf.Validate.addRules(form, {
					rules:{
						source:'required',
						realCode:'required',
						realCodeDes:'required',
						boxCode:'required',
						boxCodeDes:'required',
						posCode:'required',
						posCodeDes:'required'
					}
				});
			};
			var me = this;
			var grid = me.grid = App.Factory.createJqGrid({
				rsId:'replyCode.noCard',
				caption:"",
				gid:'replyCode-noCard-grid',
				url:url._('operate.replycode.onlinelist'),
				filters:[
					{
						defaultRenderGrid: false,
						canSearchAll: true
					}
				],
				actionsCol:{
					width:100
				},
				nav:{
					search:{
						onSearch:function(){}
					},
					add:{
						beforeShowForm:function(form){
							addValidateRules(form);
						},
						afterShowForm:function(){
							$('.ui-jqdialog-title').text('新增应答码');
							var inputWidth = $('input[name="realCode"]').outerWidth();
							$('select[name="source"]').css("width", inputWidth);
						},
						beforeSubmit:setupValidate
					},
					edit:{
						beforeShowForm:function(form){
							addValidateRules(form);
						},
						afterShowForm:function(){
							var inputWidth = $('input[name="realCode"]').outerWidth();
							$('select[name="source"]').css("width", inputWidth);
						},
						beforeSubmit:setupValidate
					}
				},
				colNames:{
					id:'',
					source:'错误来源',
					realCode:'内部错误码',
					realCodeDes:'内部错误描述',
					boxCode:'对外错误码',
					boxCodeDes:'对外错误描述',
					desc:'描述',
					posCode:'POS机错误码',
					posCodeDes:'POS机错误码描述'
				},
				colModel:[
					{name:'id', hidden:true},
					{name:'source', search:true, editable:true, formatter:sourceFormatter,
						edittype:'select',
						editoptions:{
							value:SOURCE_MAP
						},
						stype:'select',
						searchoptions:{
							sopt:['lk','nlk','eq','ne'],
							value:SOURCE_MAP
						}},
					{name:'realCode', search:true,searchoptions:{sopt:['lk', 'nlk', 'eq', 'ne']}, editable:true},
					{name:'realCodeDes', editable:true},
					{name:'boxCode', search:true, searchoptions:{sopt:['lk','nlk','eq','ne']}, editable:true},
					{name:'boxCodeDes', search:true, searchoptions:{sopt:['lk','nlk','eq','ne']}, editable:true},
					{name:'desc', hidden:true, viewable:false},
					{name:'posCode', hidden:true, viewable:false},
					{name:'posCodeDes', hidden:true, viewable:false}
				]
			});
			me.replyCodeImportBtn(grid);//批量应答码信息导入
			return grid;
		},

		replyCodeImportBtn: function(grid){
			var me = this;
			if(!Ctx.avail('reply.code.replyCodeImport')){
				return;
			}
			Opf.Grid.navButtonAdd(grid,{
				caption:'',
				id:'replyCodeImport',
				name:'replyCodeImport',
				title:'批量应答码信息导入',
				buttonicon:'icon-upload-alt white',
				position:'last',
				onClickButton:function(){
					addImportDialog(me);
				}
			});
			$("#replyCodeImport").hover(function(){
				$(".icon-upload-alt").addClass("icon-upload-alt-hover");
			},function(){
				$(".icon-upload-alt").removeClass("icon-upload-alt-hover");
			});
		}
	});
	function addImportDialog(me){
		var titleName = "批量应答码信息导入";
		var uploader, tpl=null;
		uploader = tpl = uploadFileTpl({data:titleName});
		var $dialog = Opf.Factory.createDialog(tpl, {
			destroyOnClose:true,
			autoOpen:true,
			width:450,
			height:420,
			modal:true,
			buttons:[{
				type:'submit',
				click:function(e){
					var fileSelected = ($dialog.find("input[name='file']").val() === "" ? false : true);
					if(fileSelected){
						uploader.submit();
					}
					else {
						$("label[for='uploadfile']").addClass("error").text("请选择文件");
					}
				}
			},{
				type:'cancel'
			}],
			create:function(){
				var $me = $(this),
					$indicator = $me.find('.uploadFileIndicator'),
					$trigger = $me.find('.uploadfile'),
					$submitBtn = $me.closest('.ui-dialog').find('button[type="submit"]');
				uploader = new Uploader({
					data:{},
					name:'file',
					trigger:$trigger,
					action:url._('operate.replycode.onlineupload'),  //上传接口
					accept:'.xls, .xlsx',
					change:function(){
						$("label[for='uploadfile']").removeClass("error").text($("form input[name='file']").val());
					},
					beforeSubmit:function(){
						Opf.UI.busyText($submitBtn);
					},
					complete:function(){
						Opf.UI.busyText($submitBtn, false);
					},
					progress:function(queueId, event, position, total, percent){
						if(percent){
							$indicator.find('.progress-percent').text(percent+'%').show();
						}
					},
					success:function(queueId, resp){
						if(resp.success===false){
							Opf.alert({ title: '文件格式不合法', message: resp.msg ? resp.msg + '请先下载上传模板。' : '上传失败' });
						}else {
							me.grid.trigger("reloadGrid", [{current:true}]);
							$me.dialog("destroy");
							Opf.alert({ title: '上传成功', message: resp.msg });
						}
					}
				});
				//下载按钮
				$(this).find('.download-btn').click(function(event){
					Opf.UI.setLoading($('#page-content'), true);
					Opf.ajax({
						url:url._('operate.replycode.onlinedownload'),
						success:function(resp){
							Opf.download(resp.data);
						},
						error:function(resp){
							console.log("download template error");
						},
						complete:function(resp){
							Opf.UI.setLoading($(event.target).closest('#page-content'), false);
						}
					});
				});
			}
		});
	}
	function sourceFormatter(val){
		return SOURCE_MAP[val] || '';
	}
	return View;
});