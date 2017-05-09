/**
 * Created by liliu on 2016/8/8.
 */
define([
	'tpl!app/oms/settle/cancel-order/templates/detail.tpl'
], function(tpl){
	var View = Marionette.ItemView.extend({
		template:tpl,
		onRender:function(){
			Opf.Factory.createDialog(this.$el, {
				destroyOnClose:true,
				width:450,
				height:600,
				modal:true,
				title:'查看调单',
				buttons:[{type:'cancel', text:'关闭'}]
			});
		}
	});
	return View;
});