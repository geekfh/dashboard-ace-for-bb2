//具有分页功能的collection
define(['backbone.paginator'], function() {
    var OpfPagableCollection = Backbone.PageableCollection.extend({

        state: {
            //这里设置的参数都要根据 PageableCollection 定义的字段名
            //真正传出去的参数名就在 queryParams 里面映射
            firstPage: 0,
            pageSize: 20 //这个值要跟模板中每页显示select对应，后期改成jsstorage取
        },

        queryParams: {

            //不属于PageableCollection里面关于分页的参数
            //要自己写方法设置


            currentPage: "number",
            pageSize: "size",
            totalRecords: null,
            totalPages: null,
            sortKey: null,
            order: null
        },

        refresh: function (options) {
            //TODO check
            this.getPage(this.state.currentPage, options);
        },

        initialize: function (model, options) {
            //如果继承了该类并配置该属性，则会覆盖默认的
            //这里做了一下保护,避免默认的被覆盖
            this.queryParams = $.extend({}, OpfPagableCollection.prototype.queryParams, this.queryParams);
            this.state = $.extend({}, OpfPagableCollection.prototype.state, this.state);

            Backbone.PageableCollection.prototype.initialize.apply(this, arguments);
        },

        parseState: function(resp, queryParams, state, options) {
            if(!resp) return{
                totalRecords: 0,
                totalPages: 0
            };

            /*
            PageableCollection 刚好用到 firstPage 和 lastPage 作为第一页和最后一页的索引
            所以把后台使用的"是否第一页"和"是否最后一页"的标识，在前台这边转化一下
            */
            var pageSize = parseInt(resp.size, 10);
            var totalRecords = parseInt(resp.totalElements, 10);

            var hasNextPage = resp.hasNextPage,
                hasPreviousPage = resp.hasPreviousPage;

            //业管的后台分页实体就是没这两个字段，这里保护一下呗
            if(hasNextPage === void 0) {
                hasNextPage = (resp.lastPage !== true);
            }

            if(hasPreviousPage === void 0) {
                hasPreviousPage = (resp.firstPage !== true);
            }


            return {
                hasNextPage: hasNextPage,
                hasPreviousPage: hasPreviousPage,
                lastPage: totalRecords === 0 ? 0 : (Math.ceil(totalRecords / pageSize) - 1),
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
            return resp ? resp.content : [];
        }
    });

    return OpfPagableCollection;

});