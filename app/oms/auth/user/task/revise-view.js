define([
    'app/oms/auth/user/edit/edit-view',
    'jquery.fancybox'
], function (EditView) {

    var SUB_VIEW_CLASS = {
        'info': {path:    'app/oms/auth/user/task/revise-info-view', renderTo:     '#add-user-info'},
        'confirm': {path:   'app/oms/auth/user/common/confirm-view', renderTo:    '#add-user-confirm'}
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

    var View = EditView.extend({
        className: 'add-user-wrap person-mcht-wizard',

        events: _.extend({
            'click .js-del': 'deleteTask',
            'click .js-back' : 'goback'
        }, EditView.prototype.events),

        ui: _.extend({
            delBtn: '.js-del'
        }, EditView.prototype.ui),

        constructor: function (data, taskData) {
            EditView.prototype.constructor.apply(this, arguments);

            this.subViews = {};
            this._obj = data.target;
            this.errorMark = data.errorMark;
            this.refuseReason = data.refuseReason;
            this.taskData = taskData;
        },

        onRender: function () {
            EditView.prototype.onRender.apply(this, arguments);
            var me = this;
            this.renderErrorMark();
            this.checkDeletable();

            this.on('end:render', function(name) {
                _.defer(function(){
                    name == 'info' && me.applyErrorMark();
                });
            });

            this.$el.find('.innerwrap').css({'max-width': '1200px'});
            this.$el.find('.wizard-head').show().find('.caption').text('修订操作员');

        },

        getSubViewClass: function (name) {
            return SUB_VIEW_CLASS[name];
        },

        applyErrorMark: function() {
            //输入框的值可以直接设置
            var me = this;
            var errorMark = me.errorMark;
            var infoView = me.subViews['info'];
            function isError (fieldName) {
                return fieldName in errorMark;
            }
            if(isError('accountNo')) {
                $.extend(errorMark,{zbankProvince: 0, zbankCity: 0, zbankRegionCode: 0, zbankName: 0, bankName:0,accountName: 0});
            }


            //input select相关
            infoView.$el.find("[name]:visible").not('[type="file"]').each(function() {
                var $this = $(this);
                var name = $this.attr('name');
                var notErrorMark = (errorMark[name] === void 0);

                if(notErrorMark){//不在错误表中，置为不可编辑
                    $this.prop('disabled', true);
                }else{//在错误表中置为高亮
                    $this.addClass('has-revise-error');
                    $this.blur(function () {
                        $this.removeClass('has-revise-error');
                    });
                }

                //select2特殊处理
                //if($this.data('select2')){
                //    if(errorMark.bankName === void 0){
                //        $this.select2('enable', false);
                //    }else {
                //        $this.closest('.form-group').addClass('has-error');
                //        $this.on('select2-blur', function() {
                //            $this.removeClass('has-revise-error');
                //        });
                //    }
                //}
            });
            //图片相关
            infoView.$el.find('.upload-img').each(function() {
                var $this = $(this);
                var name = $this.closest('.form-group').attr('id');
                var notErrorMark = (errorMark[name] === void 0);

                if(notErrorMark){
                    $this.find('.btn-panel').remove();
                    $this.find('.upload-form').remove();
                    me.checkBigImg($this.find('img'));
                }else{
                    $this.find('img').addClass('has-revise-error');
                }
            });


            // 在修订时，如果拓展员详情中某个信息有误，则允许用户将其修改为非拓展员，该下拉框可用
            // 同理，如果账户信息中某个信息有误，则允许用户将其改为不填写帐号信息
            me.checkCanEdit(infoView.ui.isExplorer, ['cardNo','idCardFront','idCardBack','personWithIdCard','bankCard']);
            me.checkCanEdit(infoView.ui.needAccount, ['bankName','bankNo','accountName','accountNo']);
        },

        checkBigImg: function (el) {
            var $el = $(el);
            var url = $el.attr('src');
            $el.wrap('<a class="img-link" href="'+ url +'"></a>');
            $el.closest('.img-link').fancybox({
                wrapCSS    : 'fancybox-custom',
                closeClick : true,
                openEffect : 'none',
                type: 'image',

                helpers : {
                    title : {
                        type : 'inside'
                    }
                }
            });  
        },

        renderErrorMark: function () {
            var refuseString = this.refuseReason || '';

            this.$el.find('.tab-content').prepend(errTpl({errorArr: refuseString.split(/\n/)}));
        },

        onSubmit: function (e) {
            var me = this;
            var obj = $.extend({}, me._obj);
            
            for(var p in obj) {
                if(p.indexOf('_') === 0) {
                    delete obj[p];
                }
            }
            var postData = {
                target: obj,
                task: me.taskData
            };

            // Opf.UI.setLoading('.main-content',true,{text:'正在验证提交'});
            App.maskCurTab();

            $.ajax({
                url: url._('task.revise.submit.user', {id: me.taskData.id}),
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
                        successMsg: '删除成功',
                        success: function () {
                            me.$el.remove();
                            me.trigger('back');
                        }
                    });
                }
            });
        },

        checkCanEdit: function (el, checkArray) {
            var $el = $(el);
            var errorMark = this.errorMark;
            _.each(checkArray, function(item) {
                if(errorMark.hasOwnProperty(item)){
                    $el.prop('disabled', false);
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