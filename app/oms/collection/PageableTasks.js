define(['backbone.paginator'], function() {
    var TasksCollection = Backbone.PageableCollection.extend({

        url: url._('task'),

        // Initial pagination states
        state: {
            //这里设置的参数都要根据 PageableCollection 定义的字段名
            //真正传出去的参数名就在 queryParams 里面映射
            firstPage: 0,
            pageSize: 20 //这个值要跟模板中每页显示select对应，后期改成jsstorage取
        },

        queryParams: {
            // type不属于PageableCollection里面关于分页的参数
            // 通过applyTaskCategory方法来设置
            type: null,
            kw: null,

            currentPage: "number",
            pageSize: "size",
            totalRecords: null,
            totalPages: null,
            sortKey: null,
            order: null
        },

        //切换目录的时候不考虑搜索
        applyTaskCategory: function(type) {
            // 5-参与过的任务,  2-待完成任务,  1-待领取任务
            this.queryParams.type = type;
            this.queryParams.kw = null;
            return this;
        },

        //搜索的时候不考虑切换目录
        applyKeyWord: function(kw) {
            this.queryParams.type = null;
            this.queryParams.kw = kw;
            return this;
        },

        applyState: function(state) {
            $.extend(this.state, state);
        },


        parseState: function(resp, queryParams, state, options) {
            console.log('parseState');
            /*
            PageableCollection 刚好用到 firstPage 和 lastPage 作为第一页和最后一页的索引
            所以把后台使用的"是否第一页"和"是否最后一页"的标识，在前台这边转化一下
            */
            var pageSize = parseInt(resp.size, 10);
            var totalRecords = parseInt(resp.totalElements, 10);
            return {
                lastPage: totalRecords == 0 ? 0 : (Math.ceil(totalRecords / pageSize) - 1),
                isFirstPage: resp.firstPage,
                isLastPage: resp.lastPage,
                currentPage: parseInt(resp.number, 10),
                numberOfElements: parseInt(resp.numberOfElements, 10),
                pageSize: pageSize,
                sort: resp.sort,
                totalRecords: totalRecords,
                totalPages: parseInt(resp.totalPages, 10)
            };
        },

        // get the actual records
        parseRecords: function(resp, options) {
            return resp.content;
        }
    });

    return TasksCollection;

});