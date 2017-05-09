define([
    'tpl!app/oms/wkb/certification-task/perform/templates/perform.tpl',
    'assets/scripts/fwk/component/linkage',
    'app/oms/wkb/certification-task/perform/info',
    'app/oms/wkb/branch-task/show/history-view',
    'assets/scripts/fwk/component/common-edit-zbank',
    'common-ui',
    'moment.override'
], function (tpl, Linkage, InfoView, HistoryView, EditZbankView) {
    var  STATUS_MAP = {
            0 : { cls: 'label-success', icon: 'icon-opf-check-circle', descr: '已验证！' },//pre check pass
            1 : { cls: 'label-warning', icon: 'icon-opf-warning', descr: '未验证通过，可能无法收到活动的奖励、分润等，请重新修改后提交。' },//pre check fail
            2 : { cls: '', icon: 'icon-opf-questions', descr:'可能有误，将无法收到活动的奖励、分润等，请重新修改后提交。' }//unknown
        },
     View = Marionette.ItemView.extend({
        className: 'common-task perform-task certification-task',

        template: tpl,

        events: {
            'click .js-task-info':                'popTaskInfo',
            'click .js-back':                     'goback',

            'click .reject-trigger':              'popRejectForm',
            'click .js-pass':                     'popPassForm',

            'click .reject-submit':               'rejectSubmit',
            'click .pass-submit':                 'passSubmit',

            'click .check-trigger':               'clickCheckBox',

            // 修改有误的支行相关事件
            'click .update-bank':                 'editZBank',
            'click .js-confirm-update-zbank':     'submitUpdateZbank',
            'click .js-cancel-update-zbank':      'cancelEditZbank'
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
        },

        serializeData: function () {
            return this.data;
        },

        onRender: function () {
            var me = this;
            this.renderCertificationInfo();

            this.attachValidation();

            this.checkZbankInfo();

            this.$el.find('.checkable').append($('<i class="check-trigger icon-ok" ></i>'));

            this.$el.find('.js-back').hide();
            this.showPreCheckResult();

            //倒计时
            this.ui.countDownOpt.hide();
            if(Ctx.avail('menu.wkb.mchttask.countDown')){//如果是商审用户 才会显示倒计时 206
                var first = 0, seconds = 0;//first分 seconds秒
                Opf.ajax({
                    url: url._('task.mcht.countDown', {id: me.data.taskId}),
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
        showPreCheckResult: function () {
            var me=this;
            var $el = me.$el;
            //var preStatus = this.data.realNameAuth.isRealName || 2;
            var idStatus = this.data.operatorPreview.idStatus || "2";
            var cardStatus = this.data.operatorPreview.cardStatus || "2";
            var idlabel = me.generateLabel(idStatus, '身份证信息');
            var cardlabel = me.generateLabel(cardStatus, '银行卡信息');

            $el.find('div[name="idCard-row"] ').after($(idlabel));
            $el.find('div[name="acctNo-row"] ').after($(cardlabel));
        },
        generateLabel: function(status, desc){
            return [
                '<div class="row row-margintop pre-check-result">',
                    '<div class="col-lg-3"></div>',
                    '<div class="col-lg-4">',
                        '<span class="label ' + STATUS_MAP[status].cls + '">',
                            '<i class="icon '+ STATUS_MAP[status].icon +'"></i>',
                            (desc || '') + STATUS_MAP[status].descr,
                        '</span>',
                    '</div>',
                '</div>'
            ].join('');
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

         renderCertificationInfo: function () {
             var showInfoView = new InfoView({
                 data: this.data.realNameAuth,
                 taskInfo: this.data.taskInfo,
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

             this.$el.find('.info-board-wrap').html(showInfoView.$el);
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

        checkZbankInfo: function () {
            var me = this;
            var $el = this.$el;
            var realNameAuth = this.data.realNameAuth || {};

            me.$zbankRow = $el.find('[name="zbankName-row"]');

            if(!realNameAuth.zbankCode) {
                var editZbankView = new EditZbankView({
                    bankCode: realNameAuth.bankNo,
                    taskId: me.data.taskId,
                    renderAfter: me.$zbankRow
                });

                editZbankView.on('updatezbank.success', function () {
                    me.hasEditedZbank = true;
                    me.$zbankRow.find('.info-item-text').text('原开户支行');
                });
            }
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

            if(this.canPass()){
                this.ui.passFormDialog.toggle();
            } else{
                Opf.alert({title:'支行名称可能有误', message:'请修改后再确认通过！'});
            }
        },

        canPass: function () {
            //如果有账户信息并且有支行号 或者 有账户信息手写支行但已修改，则允许通过
            /* 当审核员点击确认修改时应该会获取到 zbankCode*/
            return (this.data.realNameAuth && this.data.realNameAuth.zbankCode) || this.hasEditedZbank;
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

            console.info('<<<<getRejectSubmitValues ', obj);

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

    function getCheckable (e) {
        return $(e.target ? e.target : e).closest('.checkable');
    }

    return View;
});