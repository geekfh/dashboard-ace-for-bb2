define([
    'app/oms/auth/org/edit/edit-view'

], function (EditView) {
    var ORG_IMAGES = ['idCardFront','idCardBack','personWithIdCard','bankCard','license','orgImage','taxImage'];
    var SUB_VIEW_CLASS = {
        'info':{
            path:'app/oms/auth/org/save-edit/save-info-view',
            renderTo:'#add-brh-info',
            next: 'pic', pre:''
        },
        'pic': {
            path:'app/oms/auth/org/edit/edit-pic-view',
            renderTo:'#add-brh-pic',
            next: 'confirm', pre:'info'
        },
        'confirm': {
            path:'app/oms/auth/org/common/sub/confirm-view',
            renderTo:'#add-brh-confirm',
            next: '', pre: 'pic'
        }
    };

    var View = EditView.extend({
        constructor: function (data, taskId) {
            EditView.prototype.constructor.apply(this, arguments);

            this.subViews = {};
            this._obj = this.handleData(data);//这里需要将图片包在images里进行处理；
            this.taskId = taskId;
        },

        events: _.extend({
            'click .js-del': 'deleteTask'
        }, EditView.prototype.events),

        getSubViewClass: function (name) {
            return SUB_VIEW_CLASS[name];
        },

        deleteTask: function () {
            // branch.cancel.refused.one
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

        handleData: function (data) {
            var obj = $.extend(data, {images: []});

            _.each(ORG_IMAGES, function(name){
                if(data[name]){
                    obj.images.push({
                        name: name,
                        value: data[name]
                    });
                }
            });

            obj.images.push({
                name: 'extra',
                value: data.extraImages
            });

            return obj;
        },

        onRender: function () {
            var me = this;
            //编辑保存的机构任务时，UI的渲染逻辑是新增机构的UI渲染逻辑
            me.renderSubView('info');

            var $head = this.$el.find('.wizard-head');

            var backBtnHtml = [
                '<button type="button" class="js-back btn btn-default pull-left">',
                    '<span class="icon icon-reply"></span> 返回',
                '</button>'
            ].join('');

            $head.find('.caption').text('编辑机构');
            $head.after(backBtnHtml);

            this.$el.find('.js-del').show();
        },

        getNewSubView: function(SubView, viewName) {
            var me = this;
            var subView = new SubView(this._obj);
            //这是子view在render之前执行的方法，可以在创建子view之前传入额外参数
            //需要传入 创建的子view 和 子view的名称
            me.on('before:render', function(subView, viewName){
                if(viewName == 'info'){
                    subView.setExtraParams({
                        brhInfo: me._obj,
                        rowData: {level:me._obj.brhLevel}
                    });
                }
            });

            return subView;
        },

        onSubmit: function (e) {
            //编辑保存的机构任务提交时，提交的URL与新增编辑机构的不同
            // Opf.UI.setLoading('.main-content',true,{text:'正在验证提交'});
            App.maskCurTab();

            var me = this;
            var deleteList = ['extraImages'];

            _.each(deleteList.concat(ORG_IMAGES), function(image){
                delete me._obj[image];
            });

            Opf.ajax({
                url: url._('task.update.submit', {id: me.taskId}),
                method: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(me._obj),
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
                    // Opf.UI.setLoading('.main-content',false);
                    App.unMaskCurTab();
                }
            });
        }
        
    });

    return View;

});