define(['App',
  'tpl!app/oms/auth/user/task/templates/perform.tpl',
  'app/oms/auth/user/show/show-info-view',
  'app/oms/wkb/branch-task/show/history-view',
  'assets/scripts/fwk/component/linkage',
  'common-ui',
  'moment.override'
], function(App, tpl, ShowInfoView, HistoryView, Linkage) {

    var MAX_LENGTH = 20;

    var labelWarningFormatter = function(data, desc, type){
        var errorInfo = data.preview && data.preview[type+"Json"]||{};
        if(_.isString(errorInfo)) errorInfo = JSON.parse(errorInfo);

        return errorInfo.respMsg||errorInfo.description||(desc||"信息")+"可能有误";
    };

    var STATUS_MAP = {
        "0" : { cls: 'label-success', icon: 'icon-opf-check-circle', descr: '已验证' },//pre check pass
        "1" : { cls: 'label-warning', icon: 'icon-opf-warning', formatter:labelWarningFormatter },//pre check fail
        "2" : { cls: '', icon: 'icon-opf-questions', descr:'未验证' }//unknown
    },
    preType_MAP = {//预审类型
        'idCard':'idCard',
        'cardNo':'cardNo'
    };

    var View = Marionette.ItemView.extend({
        className: 'perform-task user-perform',
        template: tpl,

        events: {
            'click .js-task-info':                'popTaskInfo',
            'click .js-back':                     'goback',
            'click .put-back-task':               'putBackTask',

            'click .reject-trigger':              'popRejectForm',
            'click .js-pass':                     'popPassForm',

            'click .reject-submit':               'rejectSubmit',
            'click .pass-submit':                 'passSubmit',

            'click .check-trigger':               'clickCheckBox',
            'click .menual-check-btn-idStatus':   'menualCheckIdCard',
            'click .menual-check-btn-cardStatus':   'menualCheckCardStatus'
        },

        ui: {
            putBackTaskBtn: '.put-back-task',
            rejectFormDialog: '.reject-form-wrapper',
            passFormDialog: '.pass-form-wrapper',
            rejectForm: '.reject-form',
            passForm: '.pass-form',
            rejectSubmitBtn: '.reject-submit',
            passSubmitBtn: '.pass-submit',
            rejectReason: '.reject-reason',
            btnSuccess:'.btn-success',//通过审核按钮
            countDownOpt: '.div_countDown',
            rejectContainer: '.reject-container',
            caption: '.caption'
        },

        initialize: function (options) {
            this.data = options.data;
            this.taskInfo = options.data.taskInfo;
            this.taskModel = options.taskModel;
            this.tasks = options.tasks;
        },

        serializeData: function () {
            return this.data;
        },

        onRender: function () {
            var me = this;
            var $el = me.$el;

            //判断哪个类型，显示TITLE
            if(this.taskInfo.subType == '306'){
                me.ui.caption.html('盒伙人申请对私转对公户');
            }

            me.renderUserInfo();
            //如果当前操作员所属机构为0级别或者1级时，则不能勾选拓展员
            if(me.data.brhLevel == 0 || me.data.brhLevel == 1) {
                me.$el.find('[name="isExplorer"]').removeClass('checkable');
            }

            me.$el.find('[name="oprBeinvitedCode"]').removeClass('checkable');

            $el.find('.checkable').append($('<i class="check-trigger icon-ok" ></i>'));

            $(document.body).click(function(e) {
                if(me.$history && me.$history.is(':visible') && 
                    (!$(e.target).closest('.history-wrapper').length)) {
                    me.$history.hide();
                }
            });

            me.attachValidation();
            setTimeout(function(){
                me.showPreCheckResult();
            },100);

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

        // 放回任务
        putBackTask: function () {
            var me = this;

            Opf.UI.busyText(me.ui.putBackTaskBtn);
            Opf.ajax({
                url: url._('task.putback', {id: me.taskModel.id}),
                type: 'PUT',
                success: function (resp) {
                    me.taskModel.set('status', 1);//更改成待领取状态
                    // Opf.UI.setLoading($('#page-body'));
                    App.maskCurTab();
                    Opf.ajax({
                        url: url._('task.target', {id: me.taskModel.id}),
                        success: function (data) {
                            // 切换到 showView 界面
                            me.goToShowView(data);
                            // Opf.UI.setLoading($('#page-body'), false);
                            App.unMaskCurTab();
                        }
                    });
                },
                complete: function () {
                    Opf.UI.busyText(me.ui.putBackTaskBtn, false);
                }
            });
        },

        goToShowView: function (data) {
            var me = this;

            require(['app/oms/auth/user/task/show-view'], function (ShowView) {
                var showView = new ShowView({
                    data: data,
                    taskModel: me.taskModel,
                    tasks: me.tasks
                }).render();

                me.$el.remove();
                App.getCurTabPaneEl().append(showView.$el);

                showView.$el.find('.js-back').hide();

                //绑定 showView 的返回事件
                showView.on('back', function(){
                    $('.tasks-board').show();
                    // var currentPage = showView.tasks.state.currentPage;
                    me.tasks.getPage(0, {reset: true});
                });
            });
        },

        showPreCheckResult: function () {
            //判断this.data.preview中的数据
            //preview 的值有可能为空，所以做一下保护
            //如果为空，默认status的值为'2'(为验证)
            var me = this;
            var $el = me.$el;
            var preview = me.data.preview || {};
            var userInfo = me.data.userInfo || {};
            var taskInfo = me.data.taskInfo || null;
            this.idStatus = preview.idStatus || '2';
            this.cardStatus = preview.cardStatus || '2';
            if(preview && taskInfo.subType != '306') {//306不需要身份证和账号预审！！
                if(userInfo.cardNo){
                    var $idlabel = $(me.generateLabel(preview.idStatus || '2', '身份证信息', 'id'));
                    if(preview.idStatus == 2){
                        $idlabel.find('.pre-label').append($(me.generManualCheckLabel('idStatus')));
                    }
                    $el.find('div.cardNo-row').after($idlabel);
                    !isUser20(this.taskModel) && this.generateAutoRejectIcon('cardNo',preview.idStatus);
                }

                //this.generateAutoRejectIcon(name);
                if(userInfo.accountNo){
                    var $accountlabel =  $(me.generateLabel(preview.cardStatus || '2', '账号', 'card'));

                    if(preview.cardStatus == 2){
                        $accountlabel.find('.pre-label').append($(me.generManualCheckLabel('cardStatus')));
                    }
                    $el.find('div.accountNo-row').after($accountlabel);
                    !isUser20(this.taskModel) && this.generateAutoRejectIcon('accountNo',preview.cardStatus);
                }

                //如果是2.0拓展员审核，则不论审核通过与否都显示"审核通过"按钮
                if(isUser20(this.taskModel)) return;

                if(this.taskInfo.subType == "305"){
                    //新增拓展员-新 没有银行卡，用户是快速注册的，还没添加银行卡
                    this.ui.btnSuccess.show();
                }
                else {
                    // 其中有一项预审失败，那么就不显示 审核通过按钮
                    if(preview.idStatus != '0' || preview.cardStatus != '0'){
                        this.ui.btnSuccess.hide();
                    }
                }
            }

            //在相应地方append相应内容
            // <span class="label label-warning">xx可能有误</span>
            // <span class="label label-success">xx已验证</span>
            // <span class="label ">xx未验证</span>
            
        },
        //预审不通过，自动的的打叉
        generateAutoRejectIcon: function(divName,status){
            if(status != '0'){
                var $preDivEl = this.$el.find('div [name="'+divName+'"]').addClass('checked');
                $preDivEl.find('i').addClass('icon-remove').click(function(e){
                    e.stopPropagation();
                });
            }

        },
        //手动预审通过，去掉打叉
        cancleAutoRejectIcon: function (divName) {
            if(isUser20(this.taskModel)) return;
            var $preDivEl = this.$el.find('div [name="' + divName + '"]').removeClass('checked');
            $preDivEl.find('i').removeClass('icon-remove');
        },
        generateLabel: function(status, desc, type){
            var data = this.data||{},
                previewItem = STATUS_MAP[status];
            var labelTpl = [
                  '<div class="row row-margintop pre-check-result">',
                      '<div class="col-lg-1"></div>',
                      '<div class="col-lg-10 pre-label">',
                          '<span class="label ' + previewItem.cls + '">',
                              '<i class="icon '+ previewItem.icon +'"></i>',
                              '<span class="pre-desc">',
                                    previewItem.formatter?
                                        previewItem.formatter(data, desc, type):
                                        (desc||"") + previewItem.descr,
                              '</span>',
                          '</span>',
                      '</div>',
                  '</div>'
                ].join('');
            return labelTpl;
        },
        generManualCheckLabel: function(type){
            var labelTpl = [
                '<div class="menual-check-'+type+'" style="display:inline;margin-left:8px;">',
                    '<button type="button" class="btn btn-xs btn-primary menual-check-btn-'+type+'">手动验证</button>',
                '</div>'
            ].join('');
            return labelTpl;
        },
        rejectSubmit: function (e) {
            e.preventDefault();
            var me = this;
            var $el = me.$el;

            console.log(me.getRejectSubmitValues());

            if($el.find('.checkable.checked').length < 1 && !$el.find('input[name="needAdd"]').is(':checked')){
                Opf.alert('请勾选错误信息！<br><br> 如果需要补充信息，请勾选拒绝按钮上方的“仍需补充资料”。');
            }else if(me.ui.rejectForm.valid()) {

                Opf.UI.busyText(me.ui.rejectSubmitBtn, true);
                me.getRejectSubmitValues();
                Opf.ajax({
                    url: url._('task.refuse', {id:me.data.taskId}),
                    type: 'PUT',
                    data: JSON.stringify(me.getRejectSubmitValues()),
                    success: function (resp) {
                        Opf.Toast.success('操作成功');

                        var tabId = me.$el.closest('[tabmainbody]').attr('id');
                        App.closeTabViewById(tabId);

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

        toggleCheck : function ($checkable, isChecked) {
            $checkable.toggleClass('checked', isChecked);
            $checkable.find('i.check-trigger').toggleClass('icon-remove', isChecked);
        },


        renderUserInfo: function () {
            var me = this;
            var $el = this.$el;
            var showInfoView = new ShowInfoView({
                data: this.data.userInfo,
                taskModel: me.taskModel,
                convertor: function (item) {
                    item.check = !!$el.find('.checkable[name='+ (item.key||item.name) +']').hasClass('checked');
                }
            });
            showInfoView.render();
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
            this.ui.rejectForm.validate({
              rules: {
                reason: {
                  required: true
                },
                successRemark: {
                  required: true
                }
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
        /**
         * 身份证号跟账号信息预审都通过才会显示 审核通过按钮
         * @param type
         */
        showPassBtn: function(){
            if(this.idStatus == 0 && this.cardStatus == 0 ){
                this.ui.btnSuccess.show();
            }
        },
        menualCheckIdCard: function(){
            var me = this, $el = me.$el;
            var userInfo = this.data.userInfo;
            var idStatusBtn = $('.menual-check-btn-idStatus', $el);
                idStatusBtn.prop('disabled', true).text('正在验证...');
            var preLabel = idStatusBtn.closest('.pre-label');
            Opf.ajax({
                type: 'GET',
                url: url._('task.menual.check.idCard', {id:userInfo.id}),
                successMsg: '验证完成',
                success: function (resp) {
                    var status = resp.status || {};
                    if(status == 0 ){//已验证
                        $('span.label', preLabel).addClass('label-success');
                        $('span.pre-desc', preLabel).text('身份证信息已验证');
                        idStatusBtn.text('完成验证').hide();
                        me.cancleAutoRejectIcon('cardNo');
                        me.idStatus = 0;
                        me.showPassBtn();

                    }else if(status == 1){//可能有误
                        $('span.label', preLabel).addClass('label-warning');
                        $('span.pre-desc', preLabel).text('身份证信息可能有误');
                        idStatusBtn.text('完成验证').hide();

                    }else if(status == 2){//未验证
                        idStatusBtn.prop('disabled', false).text('手动验证');
                    }
                },
                error: function () {
                    Opf.alert('验证失败');
                    idStatusBtn.prop('disabled', false).text('手动验证');
                }
            });
        },
        menualCheckCardStatus: function(){
            var me = this, $el = me.$el;
            var userInfo = this.data.userInfo;
            var cardStatusBtn = $('.menual-check-btn-cardStatus', $el);
                cardStatusBtn.prop('disabled', true).text('正在验证...');
            var preLabel = cardStatusBtn.closest('.pre-label');
            Opf.ajax({
                type: 'GET',
                url: url._('task.menual.check.cardNo', {id:userInfo.id}),
                successMsg: '验证完成',
                success: function (resp) {
                    var status = resp.status || {};
                    if(status == 0 ){//已验证
                        $('span.label', preLabel).addClass('label-success');
                        $('span.pre-desc', preLabel).text('账号信息已验证');
                        cardStatusBtn.text('完成验证').hide();
                        me.cancleAutoRejectIcon('accountNo');
                        me.cardStatus = 0;
                        me.showPassBtn();

                    }else if(status == 1){//可能有误
                        $('span.label', preLabel).addClass('label-warning');
                        $('span.pre-desc', preLabel).text('账号信息可能有误');
                        cardStatusBtn.text('完成验证').hide();
                    }else if(status == 2){//未验证
                        cardStatusBtn.prop('disabled', false).text('手动验证');
                    }
                },
                error: function () {
                    Opf.alert('验证失败');
                    cardStatusBtn.prop('disabled', false).text('手动验证');
                }
            });
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
            var me = this;

            this.ui.rejectFormDialog.hide();

            if(me.canPass()){
                me.ui.passFormDialog.toggle();
            }else{
                var isVisible = me.ui.passFormDialog.is(':visible');
                if(isVisible) {
                    me.ui.passFormDialog.toggle();
                } else {
                    var alertStr = '该账号的身份证信息未验证通过，日后可能无法收到活动的奖励、分润等。一旦通过审核后无法修改身份证信息。';
                    Opf.confirm(alertStr, function (result) {
                        if(result){
                            me.ui.passFormDialog.toggle();
                        }
                    });
                }
            }
        },

        canPass: function () {
            var preview = this.data.preview || {};
            var idStatus = preview.idStatus || '2';

            return idStatus != '2';
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
                success: function (resp) {
                    Opf.Toast.success('操作成功');
                    var tabId = me.$el.closest('[tabmainbody]').attr('id');
                    App.closeTabViewById(tabId);

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

        clickCheckBox : function(e) {
            var $checkable = getCheckable(e);

            if(!$checkable.length) return;

            this.toggleCheck($checkable, !$checkable.hasClass('checked'));
        }
    });

    function getCheckable (e) {
        return $(e.target ? e.target : e).closest('.checkable');
    }

    //判断是否为2.0拓展员审核
    function isUser20(model) {
        var subType = model.get('subType');
        var status = model.get('status');
        return subType=='104' && status=='2';
    }

  return View;

});