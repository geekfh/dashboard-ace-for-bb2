/**
 * 编辑外卡商户
 */
define([
    'tpl!app/oms/mcht/wildcard/edit/templates/edit-mcht.tpl',
    'app/oms/mcht/edit/edit-view'
], function(tpl, EditView) {

    var params = {
        viewType: "editWildcard"
    };

    var _obj = {
        //请参考edit view
    };

    // 计数
    var _count = 0;

    function countSubViewClass () {
        _count++;
        var resultSubViewClass = {
            'info': {
                path: 'app/oms/mcht/wildcard/edit/sub/info-view',
                renderTo: '#edit-wildcard-mcht-info'
            },
            'info2': {
                path: 'app/oms/mcht/wildcard/edit/sub/info2-view',
                renderTo: '#edit-wildcard-mcht-info2'
            },
            'pic': {
                path: 'app/oms/mcht/wildcard/edit/sub/pic-view',
                renderTo: '#edit-wildcard-mcht-pic'
            },
            'extra': {
                path: 'app/oms/mcht/wildcard/edit/sub/extra-view',
                renderTo: '#edit-wildcard-mcht-extra'
            },
            'confirm': {
                path: 'app/oms/mcht/wildcard/edit/sub/confirm-view',
                renderTo: '#edit-wildcard-mcht-confirm'
            }
        };

        _.each(resultSubViewClass, function (viewClass) {
            viewClass.renderTo += _count;
        });

        return resultSubViewClass;
    }

    return EditView.extend({
        template: tpl,

        initialize: function () {
            this.subViewClass = countSubViewClass();
        },

        serializeData: function () {
            return {count: _count};
        },

        onSubmit: function (e) {
            //传递商户清算信息给后台容错
            this._obj.isInterMcht = 1; //加上外卡商户特有标识
            //this._obj.tNDiscId = null; //外卡费率

            //删除外卡商户初始信息
            delete this._obj.interMcht;
            console.log("submit data>>>", this._obj);

            EditView.prototype.onSubmit.call(this, arguments);
        }
    });

});
