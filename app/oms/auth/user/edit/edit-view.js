define([
    'App',
    'app/oms/auth/user/add/add-view'
], function(App, AddView) {

    var SUB_VIEW_CLASS = {
        'info': {path:    'app/oms/auth/user/edit/edit-info-view', renderTo:     '#add-user-info'},
        'confirm': {path:   'app/oms/auth/user/common/confirm-view', renderTo:    '#add-user-confirm'}
    };

    var editUserView = AddView.extend({
        constructor: function (data, rowData) {
            Marionette.ItemView.prototype.constructor.apply(this, arguments);

            this.subViews = {};
            this._obj = data;
            this.userId = data.id;
            this.rowData = rowData;
        },

        events: _.extend({
            'click .js-back' : 'goback'
        }, AddView.prototype.events),

        onRender: function () {
            AddView.prototype.onRender.apply(this, arguments);
            var $head = this.$el.find('.wizard-head').show();

            var backBtnHtml = [
                '<button type="button" class="js-back btn btn-default pull-left">',
                    '<span class="icon icon-reply"></span> 返回',
                '</button>'
            ].join('');

            $head.find('.caption').text('编辑操作员');
            $head.after(backBtnHtml);
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
                if(viewName == 'info'){
                    subView.setExtraParams({
                        rowData: me.rowData
                    });
                }
            });

            return subView;
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
                url: url._('user', {id: me.userId}),
                method: 'PUT',
                //TODO 外面覆盖
                contentType: 'application/json',
                data: JSON.stringify(obj),
                success: function (resp) {
                    if(resp.success !== false) {
                        
                        Opf.Toast.success('提交成功');

                        App.trigger('user:list');
                    }
                },
                error: function () {
                    Opf.alert('录入失败');
                },
                complete: function () {
                    // submitBtns.text('确认提交').removeClass('disabled');
                }
            });
        },

        goback: function () {
            this.$el.remove();
            this.trigger('back');
        }
    });

    
    return editUserView;

});
