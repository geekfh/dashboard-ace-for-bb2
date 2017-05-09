define([
    'tpl!app/oms/wkb/extraInfo-open-task/perform/templates/perform.tpl',
    'assets/scripts/fwk/component/linkage',
    'app/oms/wkb/extraInfo-open-task/perform/info',
    'app/oms/wkb/branch-task/show/history-view',
    'common-ui',
    'moment.override'
], function (tpl, Linkage, InfoView, HistoryView) {
    //获取可勾选的对象
    var getCheckable = function (e) {
        return $(e.target ? e.target : e).closest('.checkable');
    };

    return Marionette.ItemView.extend({
        template: tpl,
        className: 'container common-task perform-task extraInfo-openuser-task',

        events: {
            'click .js-task-info':                'popTaskInfo',
            'click .js-back':                     'goback',

            'click .reject-trigger':              'popRejectForm',
            'click .js-pass':                     'popPassForm',

            'click .reject-submit':               'rejectSubmit',
            'click .pass-submit':                 'passSubmit',

            'click .check-trigger':               'clickCheckBox'

        },

        ui: {
            rejectFormDialog: '.reject-form-wrapper',
            passFormDialog: '.pass-form-wrapper',
            rejectForm: '.reject-form',
            passForm: '.pass-form',
            rejectSubmitBtn: '.reject-submit',
            passSubmitBtn: '.pass-submit',
            rejectContainer: '.reject-container',
            countDownOpt: '.div_countDown'
        },

        initialize: function (options) {
            this.data = options.data;
            this.taskInfo = options.data.taskInfo;
            this.openMerchantSupp = options.data.openMerchantSupp;
            this.taskModel = options.taskModel;
            this.tasks = options.tasks;
        },

        templateHelpers: {

        },

        serializeData: function () {
            return this.data;
        },

        onRender: function () {
            var me = this;
            this.renderOpenuserInfo();
            this.attachValidation();

            this.$el.find('.checkable').append($('<i class="check-trigger icon-ok" ></i>'));

            this.$el.find('.js-back').hide();

            //倒计时
            this.ui.countDownOpt.hide();
            if(Ctx.avail('menu.wkb.mchttask.countDown')){//如果是商审用户 才会显示倒计时
                var first = 0, seconds = 0;//first分 seconds秒
                Opf.ajax({
                    url: url._('task.mcht.countDown', {id: me.taskModel.id}),
                    type: 'GET',
                    async: false,
                    success: function (resp) {
                        if(resp.success){
                            var arr = resp.data.timeOut.split(':');
                            first = arr[0];
                            seconds = arr[1];
                        }
                    }
                });
                this.ui.countDownOpt.show();
                _.defer(function(){ CommonUI.countDownOption(me, first, seconds) });
            }
        },

        //渲染拒绝原因级联
        renderReject: function(){
            var me = this, ui = me.ui;
            var linkage = new Linkage({
                renderTo: ui.rejectContainer,
                properties: {
                    selectName: 'reasonName',
                    textareaName: 'reason'
                }
            });
            linkage.render();
        },

        renderOpenuserInfo: function () {
            var me = this, $el = me.$el;

            var showInfoView = new InfoView({
                data: me.openMerchantSupp,
                convertor: function (item) {
                    item.check = !!$el.find('.checkable[name='+ item.name +']').hasClass('checked');
                }
            }).render();
            showInfoView.on('gallery.close', function (galleryView) {
                galleryView.$el.find(':checkbox').each(function () {
                    var name = $(this).attr('name');
                    var isChecked = $(this).prop('checked');
                    var $checkable = $el.find('.checkable[name="'+name+'"]');
                    $checkable.toggleClass('checked', isChecked);
                    $checkable.find('i.check-trigger').toggleClass('icon-remove', isChecked);
                });
            });

            me.$el.find('.info-board-wrap').html(showInfoView.$el);
        },

        attachValidation: function () {
            var me = this;
            me.ui.rejectForm.validate({
                rules: {
                    reason: {
                        required: true
                    },
                    successRemark: {
                        required: true
                    }
                }
            });

            $(document.body).click(function(e) {
                if(me.$history && me.$history.is(':visible') &&
                    (!$(e.target).closest('.history-wrapper').length)) {

                    me.$history.hide();
                    console.log($(e.target).attr('class'));
                }
            });
        },

        popTaskInfo: function () {
            var me = this;
            setTimeout(function(){
                if(me.$history){
                    me.$history.show();
                }else{
                    me.doPopTaskInfo();
                }
            }, 10);
        },

        doPopTaskInfo: function () {
            var me = this;

            var $historyTrigger = me.$el.find('.history-trigger');
            var historyView = new HistoryView(me.taskInfo).render();

            me.$history = historyView.$el;
            $historyTrigger.append(me.$history);
        },

        popRejectForm: function () {
            this.ui.passFormDialog.hide();
            this.ui.rejectFormDialog.toggle();
            var isVisible = this.ui.rejectFormDialog.is(':visible');
            isVisible && this.renderReject();
        },

        popPassForm: function (e) {
            this.ui.rejectFormDialog.hide();
            this.ui.passFormDialog.toggle();
        },

        goback: function () {
            this.$el.remove();
            this.trigger('back');
        },

        passSubmit: function (e) {
            e.preventDefault();
            var me = this;
            var succRemk = this.ui.passForm.find('textarea[name="successRemark"]').val() || '';

            Opf.UI.busyText(me.ui.passSubmitBtn);
            Opf.ajax({
                type: 'PUT',
                url: url._('task.pass', {id:me.data.taskId}),
                data: JSON.stringify({
                    id: me.data.taskId,
                    successRemark: succRemk
                }),
                successMsg: '提交成功',
                success: function () {
                    Opf.Toast.success('操作成功');
                    me.goback();
                },
                error: function () {
                    Opf.alert('提交失败');
                },
                complete: function () {
                    Opf.UI.busyText(me.ui.passSubmitBtn, false);
                }
            });
        },

        rejectSubmit: function (e) {
            e.preventDefault();
            var me = this;
            var $el = me.$el;

            if($el.find('.checkable.checked').length < 1 && !$el.find('input[name="needAdd"]').is(':checked')){
                Opf.alert('请勾选错误信息！<br><br> 如果需要补充信息，请勾选拒绝按钮上方的“仍需补充资料”。');
            }else if(me.ui.rejectForm.valid()) {

                Opf.UI.busyText(me.ui.rejectSubmitBtn, true);
                Opf.ajax({
                    type: 'PUT',
                    url: url._('task.refuse', {id:me.data.taskId}),
                    data: JSON.stringify(me.getRejectSubmitValues()),
                    success: function () {
                        Opf.Toast.success('操作成功');
                        me.goback();

                    },
                    error: function () {
                        Opf.alert('提交失败');
                    },
                    complete: function () {
                        Opf.UI.busyText(me.ui.rejectSubmitBtn, false);
                    }
                });

            }
            return false;
        },

        getRejectSubmitValues: function () {
            var errorMark = {};
            this.$el.find('.checkable').each(function () {
                var name = $(this).attr('name');
                var isCheck = $(this).hasClass('checked');
                isCheck && (errorMark[name] = 0);

            });
            var obj = {
                errorMark: errorMark,
                refuseReason: this.ui.rejectContainer.find('textarea[name="reason"]').val()||""
            };
            var linkage = this.ui.rejectContainer.data('linkage');
            !!linkage && (_.extend(obj, {refuseId: linkage.key}));

            return obj;
        },

        clickCheckBox : function(e) {
            var $checkable = getCheckable(e);

            if(!$checkable.length) {return;}

            this.toggleCheck($checkable, !$checkable.hasClass('checked'));
        },

        toggleCheck : function ($checkable, isChecked) {
            $checkable.toggleClass('checked', isChecked);
            $checkable.find('i.check-trigger').toggleClass('icon-remove', isChecked);
        }
    });
});