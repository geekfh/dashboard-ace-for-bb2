define([
    'app/oms/common/store/OpfPageableCollection'
], function(OpfPageableCollection) {

    //目前只能调用 getNextPage方法
    
    var LoadMoreCollection = OpfPageableCollection.extend({

        initialize: function () {
            OpfPageableCollection.prototype.initialize.apply(this, arguments);
        },

        loadMore: function () {
            console.log(state);
        }

    });
});


