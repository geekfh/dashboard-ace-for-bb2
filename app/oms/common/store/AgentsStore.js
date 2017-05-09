/**
 * Created by zhuyimin on 2015/1/13.
 */

/**
 * agents 的 pagebale collection
 * */

define(['backbone.paginator'], function() {

	var AgentsCollection = Backbone.PageableCollection.extend({

		initialize: function(models, options){
			this.brhCode = options.brhCode;//需要根据这个机构号去获取终端信息
		},

		url: function () {
			return url._('mcht.terminals.agent', {brhCode: this.brhCode});
		},

		// Initial pagination states
		state: {
			//这里设置的参数都要根据 PageableCollection 定义的字段名
			//真正传出去的参数名就在 queryParams 里面映射
			firstPage: 0,
			pageSize: 10 //这个值要跟模板中每页显示select对应，后期改成jsstorage取
		},

		queryParams: {
			// 通过applyTaskCategory方法来设置
			// 把不发送给后台的字段设为 null
			currentPage: "number",
			pageSize: "size",
			totalPages: null,
			totalRecords: null
		},

		applyState: function(state) {
			$.extend(this.state, state);
		},

		parseState: function(resp, queryParams, state, options) {
			return {
				isFirstPage: resp.firstPage,
				isLastPage: resp.lastPage,
				currentPage: parseInt(resp.number, 10),
				pageSize: parseInt(resp.size, 10),
				totalPages: resp.totalPages,
				numberOfElements: parseInt(resp.numberOfElements, 10),
				totalRecords: parseInt(resp.totalElements, 10)
			};
		},

		// get the actual records
		parseRecords: function(resp, options) {
			return resp.content;
		}
	});

	return AgentsCollection;

});