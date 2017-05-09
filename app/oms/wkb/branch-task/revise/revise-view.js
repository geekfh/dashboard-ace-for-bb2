define([
    'app/oms/auth/org/add/add-brh-view'

], function (AbstractView) {
    var SUB_VIEW_CLASS = {
        'info':{
            path:'app/oms/wkb/branch-task/revise/revise-info',
            renderTo:'#add-brh-info',
            next: 'pic', pre:''
        },
        'pic': {
            path:'app/oms/wkb/branch-task/revise/revise-pic-view',
            renderTo:'#add-brh-pic',
            next: 'confirm', pre:'info'
        },
        'confirm': {
            path:'app/oms/auth/org/common/sub/confirm-view',
            renderTo:'#add-brh-confirm',
            next: '', pre: 'pic'
        }
    };

    var errTpl = _.template([
        '<div class="outter-wrap">',
            '<div class="reject-reason-wrap">',
            '<p>请根据以下提示修改表格，再继续提交</p>',
                '<ul class="reject-reason-txt">',
                '<% for(var i=0; i<errorArr.length; i++) { %>',
                '<li>- <%=errorArr[i] %></li>',
                '<% } %>',
                '</ul>',
            '</div>',
        '</div>'].join(''));

    var View = AbstractView.extend({
        className: 'add-brh-wrap person-mcht-wizard',

        events: {
            'click .btn-submit': 'onSubmit',
            'click .btn-next': 'onNext',
            'click .btn-back': 'onPrevious',
            'click .js-del': 'deleteTask',
            'click .js-back': 'goback'
        },

        ui: {
            nextBtn: '.btn-next',
            backBtn: '.btn-back',
            submitBtn: '.btn-submit',
            delBtn: '.js-del'
        },

        constructor: function (data, taskData) {
            AbstractView.prototype.constructor.apply(this, arguments);

            this.subViews = {};
            this._obj = data.target;
            this.errorMark = data.errorMark;
            this.refuseReason = data.refuseReason;
            this.taskData = taskData;
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
                        errorMark: me.errorMark
                    });
                }
                if(viewName == 'pic'){
                    subView.setExtraParams({
                        brhInfo: me._obj,
                        errorMark: me.errorMark
                    });
                }
            });

            return subView;
        },

        getSubViewClass: function (name) {
            return SUB_VIEW_CLASS[name];
        },

        onRender: function () {
            AbstractView.prototype.onRender.apply(this, arguments);
            this.renderErrorMark();
            this.checkDeletable();

            var $head = this.$el.find('.wizard-head').show();

            var backBtnHtml = [
                '<button type="button" class="js-back btn btn-default pull-left">',
                    '<span class="icon icon-reply"></span> 返回',
                '</button>'
            ].join('');

            $head.find('.caption').text('修订机构');
            $head.after(backBtnHtml);

        },

        renderErrorMark: function () {
            var refuseString = this.refuseReason || '';

            this.$el.find('.tab-content').prepend(errTpl({errorArr: refuseString.split(/\n/)}));
        },

        onSubmit: function (e) {
            var me = this;
            // Opf.UI.setLoading('.main-content',true,{text:'正在验证提交'});
            App.maskCurTab();
            delete me._obj.extraImages;
            var postData = {
                target: me._obj,
                task: me.taskData
            };

            $.ajax({
                url: url._('task.revise.submit.brh', {id: me.taskData.id}),
                method: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(postData),
                success: function (resp) {
                    if(resp.success !== false) {
                        Opf.Toast.success('提交成功');
                        me.remove();
                        me.trigger('back');
                    }
                },
                error: function () {
                    // Opf.alert('录入失败');
                },
                complete: function () {
                    // submitBtns.text('确认提交').removeClass('disabled');
                    // Opf.UI.setLoading('.main-content',false);
                    App.unMaskCurTab();
                }
            });
        },

        checkDeletable: function () {
            if(Ctx.avail('wkb.revise.btn.del')) {
                this.ui.delBtn.show();
            }
        },

        deleteTask: function () {
            // merchant.cancel.refused.one
            var me = this;
            Opf.confirm('您确定要删除该申请吗？', function (result) {
                if(result) {
                    Opf.ajax({
                        type: 'PUT',
                        url: url._('task.cancel', {id: me.taskData.id}),
                        // url: 'api/system/tasks?type=2',
                        // block: {
                        //     msg: '正在删除'
                        // },
                        successMsg: '删除成功',
                        success: function () {
                            me.$el.remove();
                            me.trigger('back');
                        }
                    });
                }
            });
        },

        goback: function () {
            this.$el.remove();
            this.trigger('back');
        }
        
    });

    return View;

});