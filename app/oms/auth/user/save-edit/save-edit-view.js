define([
'App',
'app/oms/auth/user/edit/edit-view'
], function(App, EditView) {

    var SUB_VIEW_CLASS = {
        'info': {path:    'app/oms/auth/user/save-edit/save-info-view', renderTo:     '#add-user-info'},
        'confirm': {path:   'app/oms/auth/user/common/confirm-view', renderTo:    '#add-user-confirm'}
    };

    var editUserView = EditView.extend({
        constructor: function (data, taskId) {
            Marionette.ItemView.prototype.constructor.apply(this, arguments);

            this.subViews = {};
            this._obj = data;
            // this.userId = data.target.id;
            this.taskId = taskId;
        },

        events: _.extend({
            'click .js-del': 'deleteTask'
        }, EditView.prototype.events),

        onRender: function () {
            EditView.prototype.onRender.apply(this, arguments);

            this.$el.find('.js-del').show();
        },

        getSubViewClass: function (name) {
            return SUB_VIEW_CLASS[name];
        },

        getNewSubView: function(SubView, viewName) {
            var me = this;
            var subView = new SubView(this._obj);
            //这是子view在render之前执行的方法，可以在创建子view之前传入额外参数
            //需要传入 创建的子view 和 子view的名称
            me.on('before:render', function(subView, viewName){

            });

            return subView;
        },

        deleteTask: function () {
            // operator.cancel.refused.one
            var me = this;
            Opf.confirm('您确定要删除该申请吗？', function (result) {
                if(result) {
                    Opf.ajax({
                        type: 'PUT',
                        url: url._('task.cancel', {id: me.taskId}),
                        successMsg: '删除成功',
                        success: function () {
                            me.$el.remove();
                            me.trigger('back');
                        }
                    });
                }
            });
        },

        onSubmit: function (e) {
            e.preventDefault(e);
            var me = this;
            var obj = $.extend({}, me._obj);

            for(var p in obj) {
                if(p.indexOf('_') === 0) {
                    delete obj[p];
                }
            }
            console.log(obj);

            $.ajax({
                url: url._('task.update.submit', {id: me.taskId}),
                method: 'PUT',
                //TODO 外面覆盖
                contentType: 'application/json',
                data: JSON.stringify(obj),
                success: function (resp) {
                    Opf.Toast.success('提交成功');
                    me.$el.remove();
                    me.trigger('back');
                },
                error: function () {
                    Opf.alert('录入失败');
                },
                complete: function () {
                    // submitBtns.text('确认提交').removeClass('disabled');
                }
            });
        }
    });

    
    return editUserView;

});
