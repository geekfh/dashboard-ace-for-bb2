define([
    'app/oms/notice-mgr/notice-mgr-view'
], function(NoticeMgrView) {

    var STATUS_UNREAD = 2;

    var View = NoticeMgrView.extend({

        noticesUrl: url._('user.notices'),

        featureAvailConfig: {
            newNotice: false
        },

        initialize: function () {
            var me = this;

            NoticeMgrView.prototype.initialize.apply(this, arguments);

            // this.collection.on('sync', function (collection, resp) {
            //     me.refreshUnReadNumTxt();
            // });
        },

        refreshUnReadNumTxt: function () {
            this.ui.unreadNumText.text(this.getUnReadNumTxt());
        },

        getUnReadNumTxt: function () {
            var len = this.collection.length;

            var unReadNumInCurPage = this.collection.filter(function (model) {
                return model.get('status') == STATUS_UNREAD;
            }).length;

            var str = null;

            if(unReadNumInCurPage > 0) {
                //如果当前页里面的未读数5等于当前页的条数5，那么显示‘4+’
                str = unReadNumInCurPage == len ? (unReadNumInCurPage - 1)+'+' : unReadNumInCurPage;
            }

            return str ? ('（未读数:'+str+'）') : '';
        }

    });

    App.on('notice:list', function () {
        App.show(new View());
    });

    return View;
});